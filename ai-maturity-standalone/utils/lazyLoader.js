// Lazy Loading Utilities for Performance Optimization
const LazyLoader = {
  // Cache for loaded components
  componentCache: new Map(),
  
  // Cache for loaded scripts
  scriptCache: new Map(),
  
  // Loading states
  loadingStates: new Map(),

  // Lazy load a component with fallback
  loadComponent: async function(componentName, scriptPath, fallbackComponent = null) {
    // Return cached component if available
    if (this.componentCache.has(componentName)) {
      return this.componentCache.get(componentName);
    }

    // Check if already loading
    if (this.loadingStates.has(componentName)) {
      return this.loadingStates.get(componentName);
    }

    // Create loading promise
    const loadingPromise = new Promise((resolve, reject) => {
      // Check if component is already available globally
      if (window[componentName]) {
        this.componentCache.set(componentName, window[componentName]);
        resolve(window[componentName]);
        return;
      }

      // Load script dynamically
      this.loadScript(scriptPath)
        .then(() => {
          if (window[componentName]) {
            this.componentCache.set(componentName, window[componentName]);
            resolve(window[componentName]);
          } else {
            console.warn(`Component ${componentName} not found after loading ${scriptPath}`);
            resolve(fallbackComponent);
          }
        })
        .catch((error) => {
          console.error(`Failed to load component ${componentName}:`, error);
          resolve(fallbackComponent);
        });
    });

    this.loadingStates.set(componentName, loadingPromise);
    
    try {
      const component = await loadingPromise;
      this.loadingStates.delete(componentName);
      return component;
    } catch (error) {
      this.loadingStates.delete(componentName);
      throw error;
    }
  },

  // Load script with caching
  loadScript: function(src) {
    // Return cached promise if available
    if (this.scriptCache.has(src)) {
      return this.scriptCache.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          resolve();
          return;
        }
        // Wait for existing script to load
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }

      // Create new script element
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.scriptCache.set(src, promise);
    return promise;
  },

  // Preload critical components
  preloadCritical: function(components) {
    const preloadPromises = components.map(({ name, path }) => {
      return this.loadComponent(name, path).catch(error => {
        console.warn(`Failed to preload ${name}:`, error);
        return null;
      });
    });

    return Promise.allSettled(preloadPromises);
  },

  // Load components on demand with intersection observer
  loadOnVisible: function(element, componentName, scriptPath, callback) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.loadComponent(componentName, scriptPath).then(callback);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          this.loadComponent(componentName, scriptPath).then(callback);
        }
      });
    }, {
      rootMargin: '50px' // Load 50px before element becomes visible
    });

    observer.observe(element);
  },

  // Load components on user interaction
  loadOnInteraction: function(element, componentName, scriptPath, callback, events = ['click', 'touchstart']) {
    const loadComponent = () => {
      events.forEach(event => {
        element.removeEventListener(event, loadComponent);
      });
      this.loadComponent(componentName, scriptPath).then(callback);
    };

    events.forEach(event => {
      element.addEventListener(event, loadComponent, { once: true, passive: true });
    });
  },

  // Progressive loading with priority
  loadWithPriority: function(components) {
    // Sort by priority (lower number = higher priority)
    const sortedComponents = components.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    let loadPromise = Promise.resolve();
    
    sortedComponents.forEach(({ name, path, priority = 0 }) => {
      if (priority === 0) {
        // High priority - load immediately
        loadPromise = loadPromise.then(() => this.loadComponent(name, path));
      } else {
        // Lower priority - load with delay
        loadPromise = loadPromise.then(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              this.loadComponent(name, path).then(resolve);
            }, priority * 100); // Delay based on priority
          });
        });
      }
    });

    return loadPromise;
  },

  // Clear cache (useful for development)
  clearCache: function() {
    this.componentCache.clear();
    this.scriptCache.clear();
    this.loadingStates.clear();
    console.log('LazyLoader cache cleared');
  },

  // Get cache statistics
  getCacheStats: function() {
    return {
      components: this.componentCache.size,
      scripts: this.scriptCache.size,
      loading: this.loadingStates.size,
      componentNames: Array.from(this.componentCache.keys()),
      scriptPaths: Array.from(this.scriptCache.keys())
    };
  },

  // Resource hints for better performance
  addResourceHints: function(resources) {
    resources.forEach(({ href, as, type = 'preload' }) => {
      const link = document.createElement('link');
      link.rel = type; // preload, prefetch, or dns-prefetch
      link.href = href;
      if (as) link.as = as;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Monitor loading performance
  measureLoadTime: function(name, loadFunction) {
    const startTime = performance.now();
    
    return loadFunction().then(result => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`${name} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Track performance if analytics available
      if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
        window.Analytics.trackTiming('lazy_loading', name, Math.round(loadTime));
      }
      
      return result;
    });
  }
};

// Auto-initialize resource hints for critical resources
document.addEventListener('DOMContentLoaded', function() {
  // Add resource hints for critical scripts
  LazyLoader.addResourceHints([
    { href: 'utils/storage.js', as: 'script', type: 'preload' },
    { href: 'utils/analytics.js', as: 'script', type: 'preload' },
    { href: 'components/StandaloneAssessment.js', as: 'script', type: 'preload' }
  ]);
});

// Export for global use
window.LazyLoader = LazyLoader;