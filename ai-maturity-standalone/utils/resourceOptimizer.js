// Resource Optimization Utilities
const ResourceOptimizer = {
  // Image optimization settings
  imageSettings: {
    quality: 85,
    formats: ['webp', 'jpg', 'png'],
    sizes: [320, 640, 1024, 1920],
    lazyLoadThreshold: '50px'
  },

  // Resource cache
  resourceCache: new Map(),
  
  // Loading states
  loadingResources: new Set(),

  // Optimize image loading with lazy loading and format detection
  optimizeImage: function(src, options = {}) {
    const {
      alt = '',
      className = '',
      sizes = '100vw',
      loading = 'lazy',
      placeholder = 'blur'
    } = options;

    // Check if browser supports WebP
    const supportsWebP = this.supportsWebP();
    
    // Generate optimized image element
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.loading = loading;
    img.sizes = sizes;

    // Add intersection observer for lazy loading
    if (loading === 'lazy') {
      this.addLazyLoading(img);
    }

    // Add error handling
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      this.handleImageError(img, src);
    };

    return img;
  },

  // Check WebP support
  supportsWebP: function() {
    if (this.resourceCache.has('webp-support')) {
      return this.resourceCache.get('webp-support');
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const support = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    this.resourceCache.set('webp-support', support);
    return support;
  },

  // Add lazy loading with intersection observer
  addLazyLoading: function(img) {
    if (!('IntersectionObserver' in window)) {
      return; // Fallback: load immediately
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: this.imageSettings.lazyLoadThreshold
    });

    observer.observe(img);
  },

  // Handle image loading errors
  handleImageError: function(img, originalSrc) {
    // Try fallback formats
    const fallbacks = [
      originalSrc.replace(/\.(webp|avif)$/, '.jpg'),
      originalSrc.replace(/\.(webp|avif|jpg)$/, '.png'),
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
    ];

    let currentFallback = 0;
    const tryFallback = () => {
      if (currentFallback < fallbacks.length) {
        img.src = fallbacks[currentFallback];
        currentFallback++;
      }
    };

    img.onerror = tryFallback;
    tryFallback();
  },

  // Preload critical resources
  preloadResources: function(resources) {
    resources.forEach(resource => {
      const { href, as, type = 'preload', crossorigin = false } = resource;
      
      if (this.resourceCache.has(href)) {
        return; // Already preloaded
      }

      const link = document.createElement('link');
      link.rel = type;
      link.href = href;
      if (as) link.as = as;
      if (crossorigin) link.crossOrigin = 'anonymous';
      
      link.onload = () => {
        this.resourceCache.set(href, true);
        console.log(`Preloaded: ${href}`);
      };
      
      link.onerror = () => {
        console.warn(`Failed to preload: ${href}`);
      };

      document.head.appendChild(link);
    });
  },

  // Optimize CSS loading
  optimizeCSS: function(cssFiles) {
    cssFiles.forEach(({ href, media = 'all', critical = false }) => {
      if (critical) {
        // Inline critical CSS
        this.inlineCSS(href);
      } else {
        // Load non-critical CSS asynchronously
        this.loadCSSAsync(href, media);
      }
    });
  },

  // Load CSS asynchronously
  loadCSSAsync: function(href, media = 'all') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
      this.media = media;
    };
    document.head.appendChild(link);
  },

  // Inline critical CSS
  inlineCSS: function(href) {
    if (this.resourceCache.has(`inline-${href}`)) {
      return;
    }

    fetch(href)
      .then(response => response.text())
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        this.resourceCache.set(`inline-${href}`, true);
      })
      .catch(error => {
        console.warn(`Failed to inline CSS: ${href}`, error);
      });
  },

  // Optimize font loading
  optimizeFonts: function(fonts) {
    fonts.forEach(font => {
      const { family, weights = [400], display = 'swap', preload = false } = font;
      
      if (preload) {
        // Preload font files
        weights.forEach(weight => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          link.href = `/fonts/${family}-${weight}.woff2`;
          document.head.appendChild(link);
        });
      }

      // Add font-display CSS
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${family}';
          font-display: ${display};
          src: url('/fonts/${family}-400.woff2') format('woff2');
        }
      `;
      document.head.appendChild(style);
    });
  },

  // Compress and optimize JavaScript
  optimizeJS: function(scripts) {
    scripts.forEach(script => {
      const { src, async = true, defer = false, module = false } = script;
      
      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.async = async;
      scriptElement.defer = defer;
      
      if (module) {
        scriptElement.type = 'module';
      }

      // Add error handling
      scriptElement.onerror = () => {
        console.error(`Failed to load script: ${src}`);
      };

      document.head.appendChild(scriptElement);
    });
  },

  // Service Worker for caching
  registerServiceWorker: function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          
          // Update available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            });
          });
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  },

  // Show update notification
  showUpdateNotification: function() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="bg-blue-600 text-white p-4 fixed bottom-4 right-4 rounded-lg shadow-lg z-50">
        <p class="mb-2">新版本可用</p>
        <button onclick="window.location.reload()" class="bg-white text-blue-600 px-3 py-1 rounded text-sm">
          更新
        </button>
        <button onclick="this.parentElement.remove()" class="ml-2 text-blue-200 hover:text-white">
          ×
        </button>
      </div>
    `;
    document.body.appendChild(notification);
  },

  // Monitor resource loading performance
  monitorPerformance: function() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const loadTime = entry.responseEnd - entry.startTime;
            
            // Log slow resources
            if (loadTime > 1000) {
              console.warn(`Slow resource: ${entry.name} (${loadTime.toFixed(2)}ms)`);
            }

            // Track in analytics
            if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
              window.Analytics.trackTiming('resource_loading', entry.name, Math.round(loadTime));
            }
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  },

  // Optimize for mobile
  optimizeForMobile: function() {
    // Reduce image quality on mobile
    if (window.innerWidth < 768) {
      this.imageSettings.quality = 75;
    }

    // Preload critical resources for mobile
    this.preloadResources([
      { href: 'assets/styles.css', as: 'style' },
      { href: 'utils/storage.js', as: 'script' }
    ]);

    // Add mobile-specific optimizations
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }
  },

  // Clean up resources
  cleanup: function() {
    this.resourceCache.clear();
    this.loadingResources.clear();
    console.log('Resource cache cleared');
  },

  // Get optimization statistics
  getStats: function() {
    return {
      cachedResources: this.resourceCache.size,
      loadingResources: this.loadingResources.size,
      webpSupport: this.supportsWebP(),
      memoryUsage: this.getMemoryUsage()
    };
  },

  // Get memory usage (if available)
  getMemoryUsage: function() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
};

// Auto-initialize optimizations
document.addEventListener('DOMContentLoaded', function() {
  ResourceOptimizer.monitorPerformance();
  ResourceOptimizer.optimizeForMobile();
  
  // Register service worker in production
  if (location.protocol === 'https:' || location.hostname === 'localhost') {
    ResourceOptimizer.registerServiceWorker();
  }
});

// Export for global use
window.ResourceOptimizer = ResourceOptimizer;