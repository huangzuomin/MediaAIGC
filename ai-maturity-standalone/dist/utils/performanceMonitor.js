// Performance Monitoring and Optimization
const PerformanceMonitor = {
  // Performance metrics
  metrics: {
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    resourceCount: 0
  },

  // Performance observers
  observers: new Map(),

  // Thresholds for performance warnings
  thresholds: {
    loadTime: 3000,      // 3 seconds
    renderTime: 1000,    // 1 second
    interactionTime: 100, // 100ms
    memoryUsage: 50,     // 50MB
    resourceSize: 1024   // 1MB
  },

  // Initialize performance monitoring
  init: function() {
    this.measurePageLoad();
    this.setupPerformanceObservers();
    this.monitorMemoryUsage();
    this.trackUserInteractions();
    this.setupPerformanceReporting();
    
    console.log('PerformanceMonitor initialized');
  },

  // Measure page load performance
  measurePageLoad: function() {
    if ('performance' in window && 'timing' in performance) {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaint = timing.responseStart - timing.navigationStart;

        this.metrics.loadTime = loadTime;

        console.log(`Performance: Page loaded in ${loadTime}ms`);
        console.log(`Performance: DOM ready in ${domReady}ms`);
        console.log(`Performance: First paint in ${firstPaint}ms`);

        // Track in analytics
        if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
          window.Analytics.trackTiming('page_performance', 'load_time', loadTime);
          window.Analytics.trackTiming('page_performance', 'dom_ready', domReady);
          window.Analytics.trackTiming('page_performance', 'first_paint', firstPaint);
        }

        // Check thresholds
        if (loadTime > this.thresholds.loadTime) {
          this.reportSlowLoad(loadTime);
        }
      });
    }
  },

  // Setup performance observers
  setupPerformanceObservers: function() {
    if ('PerformanceObserver' in window) {
      // Observe resource loading
      this.createObserver('resource', (entries) => {
        entries.forEach(entry => {
          this.metrics.resourceCount++;
          
          const size = entry.transferSize || 0;
          const loadTime = entry.responseEnd - entry.startTime;

          // Log large resources
          if (size > this.thresholds.resourceSize * 1024) {
            console.warn(`Large resource: ${entry.name} (${this.formatBytes(size)})`);
          }

          // Log slow resources
          if (loadTime > 1000) {
            console.warn(`Slow resource: ${entry.name} (${loadTime.toFixed(2)}ms)`);
          }

          // Track in analytics
          if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
            window.Analytics.trackTiming('resource_loading', entry.name, Math.round(loadTime));
          }
        });
      });

      // Observe paint timing
      this.createObserver('paint', (entries) => {
        entries.forEach(entry => {
          console.log(`Performance: ${entry.name} at ${entry.startTime.toFixed(2)}ms`);
          
          if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
            window.Analytics.trackTiming('paint_timing', entry.name, Math.round(entry.startTime));
          }
        });
      });

      // Observe layout shifts
      this.createObserver('layout-shift', (entries) => {
        let clsValue = 0;
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        if (clsValue > 0.1) {
          console.warn(`Layout shift detected: ${clsValue.toFixed(4)}`);
          
          if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
            window.Analytics.trackEvent('layout_shift', {
              value: clsValue,
              threshold_exceeded: clsValue > 0.25
            });
          }
        }
      });

      // Observe long tasks
      this.createObserver('longtask', (entries) => {
        entries.forEach(entry => {
          const duration = entry.duration;
          console.warn(`Long task detected: ${duration.toFixed(2)}ms`);
          
          if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
            window.Analytics.trackEvent('long_task', {
              duration: Math.round(duration),
              start_time: Math.round(entry.startTime)
            });
          }
        });
      });
    }
  },

  // Create performance observer
  createObserver: function(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [type] });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to create ${type} observer:`, error);
    }
  },

  // Monitor memory usage
  monitorMemoryUsage: function() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);

        this.metrics.memoryUsage = usedMB;

        // Check memory threshold
        if (usedMB > this.thresholds.memoryUsage) {
          console.warn(`High memory usage: ${usedMB}MB / ${limitMB}MB`);
          
          if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
            window.Analytics.trackEvent('high_memory_usage', {
              used_mb: usedMB,
              total_mb: totalMB,
              limit_mb: limitMB
            });
          }
        }

        console.log(`Memory: ${usedMB}MB used, ${totalMB}MB total, ${limitMB}MB limit`);
      };

      // Check memory every 30 seconds
      setInterval(checkMemory, 30000);
      checkMemory(); // Initial check
    }
  },

  // Track user interactions
  trackUserInteractions: function() {
    const interactionTypes = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (event) => {
        const startTime = performance.now();
        
        // Use requestAnimationFrame to measure interaction response time
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime;
          
          if (responseTime > this.thresholds.interactionTime) {
            console.warn(`Slow interaction: ${type} took ${responseTime.toFixed(2)}ms`);
            
            if (window.Analytics && typeof window.Analytics.trackTiming === 'function') {
              window.Analytics.trackTiming('interaction_response', type, Math.round(responseTime));
            }
          }
        });
      }, { passive: true });
    });
  },

  // Setup performance reporting
  setupPerformanceReporting: function() {
    // Report performance metrics every 5 minutes
    setInterval(() => {
      this.generatePerformanceReport();
    }, 300000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.generatePerformanceReport();
    });
  },

  // Generate performance report
  generatePerformanceReport: function() {
    const report = {
      timestamp: Date.now(),
      metrics: { ...this.metrics },
      navigation: this.getNavigationTiming(),
      resources: this.getResourceTiming(),
      memory: this.getMemoryInfo(),
      connection: this.getConnectionInfo(),
      vitals: this.getWebVitals()
    };

    console.log('Performance Report:', report);

    // Send to analytics
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('performance_report', report);
    }

    return report;
  },

  // Get navigation timing
  getNavigationTiming: function() {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domContentLoadedEventEnd - timing.domLoading,
        load: timing.loadEventEnd - timing.loadEventStart
      };
    }
    return null;
  },

  // Get resource timing
  getResourceTiming: function() {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const summary = {
        total: resources.length,
        scripts: 0,
        stylesheets: 0,
        images: 0,
        fonts: 0,
        other: 0,
        totalSize: 0,
        averageLoadTime: 0
      };

      let totalLoadTime = 0;

      resources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime;
        totalLoadTime += loadTime;
        summary.totalSize += resource.transferSize || 0;

        // Categorize resources
        if (resource.name.includes('.js')) {
          summary.scripts++;
        } else if (resource.name.includes('.css')) {
          summary.stylesheets++;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          summary.images++;
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
          summary.fonts++;
        } else {
          summary.other++;
        }
      });

      summary.averageLoadTime = resources.length > 0 ? totalLoadTime / resources.length : 0;
      return summary;
    }
    return null;
  },

  // Get memory info
  getMemoryInfo: function() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  },

  // Get connection info
  getConnectionInfo: function() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  },

  // Get Web Vitals
  getWebVitals: function() {
    const vitals = {};

    // Get paint metrics
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      vitals[entry.name.replace('-', '_')] = Math.round(entry.startTime);
    });

    // Get navigation metrics
    if ('timing' in performance) {
      const timing = performance.timing;
      vitals.time_to_interactive = timing.domContentLoadedEventEnd - timing.navigationStart;
      vitals.dom_content_loaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    }

    return vitals;
  },

  // Report slow load
  reportSlowLoad: function(loadTime) {
    console.warn(`Slow page load detected: ${loadTime}ms`);
    
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('slow_page_load', {
        load_time: loadTime,
        threshold: this.thresholds.loadTime,
        user_agent: navigator.userAgent,
        connection: this.getConnectionInfo()
      });
    }
  },

  // Format bytes
  formatBytes: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get performance score
  getPerformanceScore: function() {
    const report = this.generatePerformanceReport();
    let score = 100;

    // Deduct points for slow metrics
    if (report.metrics.loadTime > this.thresholds.loadTime) {
      score -= 20;
    }
    if (report.memory && report.memory.used > this.thresholds.memoryUsage) {
      score -= 15;
    }
    if (report.resources && report.resources.averageLoadTime > 1000) {
      score -= 10;
    }

    return Math.max(0, score);
  },

  // Optimize performance based on current metrics
  optimizePerformance: function() {
    const report = this.generatePerformanceReport();
    const optimizations = [];

    // Memory optimization
    if (report.memory && report.memory.used > this.thresholds.memoryUsage) {
      optimizations.push('memory');
      this.optimizeMemory();
    }

    // Resource optimization
    if (report.resources && report.resources.totalSize > 5 * 1024 * 1024) { // 5MB
      optimizations.push('resources');
      this.optimizeResources();
    }

    // Connection optimization
    if (report.connection && report.connection.effectiveType === 'slow-2g') {
      optimizations.push('connection');
      this.optimizeForSlowConnection();
    }

    console.log('Applied optimizations:', optimizations);
    return optimizations;
  },

  // Optimize memory usage
  optimizeMemory: function() {
    // Clear caches
    if (window.LazyLoader) {
      window.LazyLoader.clearCache();
    }
    if (window.ResourceOptimizer) {
      window.ResourceOptimizer.cleanup();
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }

    console.log('Memory optimization applied');
  },

  // Optimize resources
  optimizeResources: function() {
    // Reduce image quality
    if (window.ResourceOptimizer) {
      window.ResourceOptimizer.imageSettings.quality = 70;
    }

    // Enable aggressive caching
    if ('caches' in window) {
      caches.open('performance-cache').then(cache => {
        // Cache current page
        cache.add(window.location.href);
      });
    }

    console.log('Resource optimization applied');
  },

  // Optimize for slow connection
  optimizeForSlowConnection: function() {
    // Disable non-essential features
    if (window.Analytics) {
      window.Analytics.pause();
    }

    // Reduce update frequency
    this.thresholds.memoryUsage *= 2;

    console.log('Slow connection optimization applied');
  },

  // Cleanup observers
  cleanup: function() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    console.log('PerformanceMonitor cleaned up');
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
  PerformanceMonitor.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  PerformanceMonitor.cleanup();
});

// Export for global use
window.PerformanceMonitor = PerformanceMonitor;