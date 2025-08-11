// Mobile optimization utilities for better performance and UX
const MobileOptimization = {
  // Device detection utilities
  detectDevice: function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLandscape: width > height,
      isPortrait: height > width,
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isChrome: /chrome/.test(userAgent),
      isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
      screenSize: `${width}x${height}`,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: screen.orientation ? screen.orientation.angle : 0
    };
  },

  // Performance optimizations
  optimizeForMobile: function() {
    const device = this.detectDevice();
    
    if (device.isMobile) {
      // Disable hover effects on mobile
      document.body.classList.add('mobile-device');
      
      // Optimize scroll performance
      this.optimizeScrolling();
      
      // Optimize touch interactions
      this.optimizeTouchInteractions();
      
      // Reduce animations on low-end devices
      if (this.isLowEndDevice()) {
        this.reduceAnimations();
      }
      
      // Optimize images for mobile
      this.optimizeImages();
    }
    
    return device;
  },

  // Optimize scrolling performance
  optimizeScrolling: function() {
    // Use passive event listeners for better scroll performance
    const passiveSupported = this.supportsPassive();
    
    if (passiveSupported) {
      document.addEventListener('touchstart', function() {}, { passive: true });
      document.addEventListener('touchmove', function() {}, { passive: true });
    }
    
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
  },

  // Optimize touch interactions
  optimizeTouchInteractions: function() {
    // Prevent 300ms click delay
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
    
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (existingViewport) {
      existingViewport.content = meta.content;
    } else {
      document.head.appendChild(meta);
    }
    
    // Add touch-action CSS for better touch handling
    const style = document.createElement('style');
    style.textContent = `
      .touch-optimized {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  },

  // Check if device is low-end
  isLowEndDevice: function() {
    // Simple heuristics for low-end device detection
    const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
    const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
    const connection = navigator.connection;
    
    const isLowMemory = memory < 2;
    const isLowCores = cores < 4;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.effectiveType === '3g'
    );
    
    return isLowMemory || isLowCores || isSlowConnection;
  },

  // Reduce animations for better performance
  reduceAnimations: function() {
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion * {
        animation-duration: 0.1s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('reduced-motion');
  },

  // Optimize images for mobile
  optimizeImages: function() {
    const images = document.querySelectorAll('img');
    const device = this.detectDevice();
    
    images.forEach(img => {
      // Add loading="lazy" for better performance
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // Optimize image sizes for mobile
      if (device.isMobile && device.pixelRatio > 1) {
        // Handle high DPI displays
        img.style.imageRendering = 'crisp-edges';
      }
    });
  },

  // Check for passive event listener support
  supportsPassive: function() {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  },

  // Viewport management
  manageViewport: function() {
    const device = this.detectDevice();
    let viewportContent = 'width=device-width, initial-scale=1';
    
    if (device.isMobile) {
      // Prevent zoom on mobile
      viewportContent += ', maximum-scale=1, user-scalable=no';
    }
    
    if (device.isIOS) {
      // iOS specific optimizations
      viewportContent += ', viewport-fit=cover';
    }
    
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = viewportContent;
    }
  },

  // Battery and performance monitoring
  monitorPerformance: function() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2 || !battery.charging) {
          // Reduce performance-intensive features when battery is low
          this.enablePowerSaveMode();
        }
      });
    }
    
    // Monitor memory usage
    if ('memory' in performance) {
      const memInfo = performance.memory;
      const memoryUsage = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
      
      if (memoryUsage > 0.8) {
        // High memory usage, optimize
        this.optimizeMemoryUsage();
      }
    }
  },

  // Enable power save mode
  enablePowerSaveMode: function() {
    document.body.classList.add('power-save-mode');
    
    // Reduce animation frequency
    const style = document.createElement('style');
    style.textContent = `
      .power-save-mode * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }
      
      .power-save-mode .animate-spin {
        animation-duration: 2s !important;
      }
    `;
    document.head.appendChild(style);
  },

  // Optimize memory usage
  optimizeMemoryUsage: function() {
    // Clear unused event listeners
    // Reduce DOM complexity
    // Implement virtual scrolling if needed
    console.warn('High memory usage detected, optimizing...');
  },

  // Network optimization
  optimizeForNetwork: function() {
    const connection = navigator.connection;
    if (!connection) return;
    
    const { effectiveType, downlink, rtt } = connection;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Very slow connection
      this.enableOfflineMode();
    } else if (effectiveType === '3g' || downlink < 1.5) {
      // Moderate connection
      this.reduceDataUsage();
    }
  },

  // Enable offline mode features
  enableOfflineMode: function() {
    document.body.classList.add('offline-optimized');
    
    // Disable non-essential features
    // Cache critical resources
    // Show offline indicators
  },

  // Reduce data usage
  reduceDataUsage: function() {
    // Compress images
    // Reduce animation complexity
    // Minimize API calls
    document.body.classList.add('data-saver-mode');
  },

  // Accessibility optimizations for mobile
  optimizeAccessibility: function() {
    const device = this.detectDevice();
    
    if (device.isMobile) {
      // Increase touch target sizes
      const style = document.createElement('style');
      style.textContent = `
        .mobile-device button,
        .mobile-device .radio-option,
        .mobile-device .btn {
          min-height: 44px;
          min-width: 44px;
        }
        
        .mobile-device .radio-option {
          min-height: 60px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add focus indicators for keyboard navigation
    if (!device.isTouch) {
      document.body.classList.add('keyboard-navigation');
    }
  },

  // Initialize all mobile optimizations
  init: function() {
    const device = this.optimizeForMobile();
    this.manageViewport();
    this.monitorPerformance();
    this.optimizeForNetwork();
    this.optimizeAccessibility();
    
    // Track device info for analytics
    if (window.Analytics) {
      window.Analytics.trackCustomEvent('device_detected', {
        device_type: device.isMobile ? 'mobile' : device.isTablet ? 'tablet' : 'desktop',
        screen_size: device.screenSize,
        pixel_ratio: device.pixelRatio,
        is_touch: device.isTouch,
        is_ios: device.isIOS,
        is_android: device.isAndroid,
        orientation: device.isLandscape ? 'landscape' : 'portrait'
      });
    }
    
    return device;
  }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MobileOptimization.init());
} else {
  MobileOptimization.init();
}

// Export for global use
window.MobileOptimization = MobileOptimization;