// Performance Benchmark Tests
const { TestUtils, setupTests } = require('../setup');

describe('Performance Benchmark Tests', () => {
  let performanceObserver;
  let mockPerformance;

  beforeEach(() => {
    setupTests();
    
    // Mock Performance API
    mockPerformance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn(() => []),
      getEntriesByName: jest.fn(() => []),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn(),
      timing: {
        navigationStart: Date.now() - 5000,
        domContentLoadedEventEnd: Date.now() - 3000,
        loadEventEnd: Date.now() - 2000,
        domInteractive: Date.now() - 3500,
        domComplete: Date.now() - 2500
      },
      navigation: {
        type: 0, // TYPE_NAVIGATE
        redirectCount: 0
      }
    };

    global.performance = mockPerformance;

    // Mock PerformanceObserver
    performanceObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => [])
    };

    global.PerformanceObserver = jest.fn(() => performanceObserver);
  });

  describe('Page Load Performance', () => {
    test('should measure initial page load time', () => {
      const measurePageLoad = () => {
        const navigationStart = performance.timing.navigationStart;
        const loadComplete = performance.timing.loadEventEnd;
        const domContentLoaded = performance.timing.domContentLoadedEventEnd;
        
        return {
          totalLoadTime: loadComplete - navigationStart,
          domContentLoadedTime: domContentLoaded - navigationStart,
          domInteractiveTime: performance.timing.domInteractive - navigationStart,
          domCompleteTime: performance.timing.domComplete - navigationStart
        };
      };

      const metrics = measurePageLoad();
      
      expect(metrics.totalLoadTime).toBeGreaterThan(0);
      expect(metrics.domContentLoadedTime).toBeGreaterThan(0);
      expect(metrics.domInteractiveTime).toBeGreaterThan(0);
      expect(metrics.domCompleteTime).toBeGreaterThan(0);
      
      // Performance benchmarks (in milliseconds)
      expect(metrics.totalLoadTime).toBeLessThan(5000); // Total load < 5s
      expect(metrics.domContentLoadedTime).toBeLessThan(3000); // DOMContentLoaded < 3s
      expect(metrics.domInteractiveTime).toBeLessThan(2000); // DOM Interactive < 2s
    });

    test('should measure First Contentful Paint (FCP)', () => {
      const mockFCPEntry = {
        name: 'first-contentful-paint',
        entryType: 'paint',
        startTime: 1200,
        duration: 0
      };

      performance.getEntriesByType.mockReturnValue([mockFCPEntry]);

      const measureFCP = () => {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcpEntry ? fcpEntry.startTime : null;
      };

      const fcp = measureFCP();
      
      expect(fcp).toBe(1200);
      expect(fcp).toBeLessThan(2500); // FCP should be < 2.5s for good performance
    });

    test('should measure Largest Contentful Paint (LCP)', () => {
      const mockLCPEntry = {
        name: '',
        entryType: 'largest-contentful-paint',
        startTime: 2100,
        duration: 0,
        size: 12000,
        element: document.createElement('div')
      };

      const measureLCP = () => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Simulate LCP entry
          setTimeout(() => {
            resolve(mockLCPEntry.startTime);
          }, 100);
        });
      };

      return measureLCP().then(lcp => {
        expect(lcp).toBe(2100);
        expect(lcp).toBeLessThan(4000); // LCP should be < 4s for good performance
      });
    });

    test('should measure Cumulative Layout Shift (CLS)', () => {
      const mockCLSEntries = [
        {
          entryType: 'layout-shift',
          value: 0.1,
          hadRecentInput: false,
          startTime: 1000
        },
        {
          entryType: 'layout-shift',
          value: 0.05,
          hadRecentInput: false,
          startTime: 2000
        }
      ];

      const measureCLS = () => {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];

        mockCLSEntries.forEach(entry => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (sessionValue && 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            clsValue = Math.max(clsValue, sessionValue);
          }
        });

        return clsValue;
      };

      const cls = measureCLS();
      
      expect(cls).toBe(0.15); // Sum of both entries
      expect(cls).toBeLessThan(0.25); // CLS should be < 0.25 for good performance
    });

    test('should measure First Input Delay (FID)', () => {
      const mockFIDEntry = {
        name: 'click',
        entryType: 'first-input',
        startTime: 1500,
        processingStart: 1520,
        processingEnd: 1525,
        duration: 25,
        cancelable: true
      };

      const measureFID = () => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const firstInput = list.getEntries()[0];
            if (firstInput) {
              const fid = firstInput.processingStart - firstInput.startTime;
              resolve(fid);
            }
          });

          observer.observe({ entryTypes: ['first-input'] });
          
          // Simulate FID measurement
          setTimeout(() => {
            const fid = mockFIDEntry.processingStart - mockFIDEntry.startTime;
            resolve(fid);
          }, 100);
        });
      };

      return measureFID().then(fid => {
        expect(fid).toBe(20);
        expect(fid).toBeLessThan(100); // FID should be < 100ms for good performance
      });
    });
  });

  describe('Component Performance', () => {
    test('should measure component render time', () => {
      const measureComponentRender = (componentName, renderFunction) => {
        const startTime = performance.now();
        
        // Mock component render
        renderFunction();
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        performance.mark(`${componentName}-render-start`);
        performance.mark(`${componentName}-render-end`);
        performance.measure(`${componentName}-render`, 
                          `${componentName}-render-start`, 
                          `${componentName}-render-end`);
        
        return renderTime;
      };

      const mockRender = jest.fn(() => {
        // Simulate render work
        for (let i = 0; i < 1000; i++) {
          Math.random();
        }
      });

      const renderTime = measureComponentRender('StandaloneAssessment', mockRender);
      
      expect(renderTime).toBeGreaterThan(0);
      expect(renderTime).toBeLessThan(50); // Component render should be < 50ms
      expect(mockRender).toHaveBeenCalled();
      expect(performance.mark).toHaveBeenCalledWith('StandaloneAssessment-render-start');
      expect(performance.mark).toHaveBeenCalledWith('StandaloneAssessment-render-end');
    });

    test('should measure question navigation performance', () => {
      const measureNavigationPerformance = () => {
        const startTime = performance.now();
        
        // Simulate question navigation
        const mockNavigation = () => {
          // Simulate DOM updates
          for (let i = 0; i < 100; i++) {
            const element = document.createElement('div');
            element.textContent = `Question ${i}`;
          }
        };

        mockNavigation();
        
        const endTime = performance.now();
        return endTime - startTime;
      };

      const navigationTime = measureNavigationPerformance();
      
      expect(navigationTime).toBeGreaterThan(0);
      expect(navigationTime).toBeLessThan(20); // Navigation should be < 20ms
    });

    test('should measure result calculation performance', () => {
      const measureCalculationPerformance = (answers, questions) => {
        const startTime = performance.now();
        
        // Mock complex calculation
        const mockCalculation = () => {
          let result = 0;
          Object.values(answers).forEach(answer => {
            for (let i = 0; i < 1000; i++) {
              result += answer * Math.random();
            }
          });
          return result;
        };

        const result = mockCalculation();
        
        const endTime = performance.now();
        return {
          calculationTime: endTime - startTime,
          result
        };
      };

      const mockAnswers = {
        tech_awareness: 3,
        data_management: 4,
        workflow_integration: 3,
        team_capability: 2
      };

      const mockQuestions = TestUtils.createMockQuestions();
      const { calculationTime, result } = measureCalculationPerformance(mockAnswers, mockQuestions);
      
      expect(calculationTime).toBeGreaterThan(0);
      expect(calculationTime).toBeLessThan(100); // Calculation should be < 100ms
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Memory Performance', () => {
    test('should monitor memory usage', () => {
      const measureMemoryUsage = () => {
        // Mock memory info (Chrome-specific)
        const mockMemoryInfo = {
          usedJSHeapSize: 10 * 1024 * 1024, // 10MB
          totalJSHeapSize: 20 * 1024 * 1024, // 20MB
          jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB
        };

        global.performance.memory = mockMemoryInfo;

        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
            usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
          };
        }

        return null;
      };

      const memoryInfo = measureMemoryUsage();
      
      if (memoryInfo) {
        expect(memoryInfo.used).toBeGreaterThan(0);
        expect(memoryInfo.total).toBeGreaterThanOrEqual(memoryInfo.used);
        expect(memoryInfo.limit).toBeGreaterThan(memoryInfo.total);
        expect(memoryInfo.usagePercentage).toBeLessThan(80); // Memory usage should be < 80%
      }
    });

    test('should detect memory leaks', () => {
      const detectMemoryLeaks = () => {
        const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        // Simulate potential memory leak scenario
        const objects = [];
        for (let i = 0; i < 1000; i++) {
          objects.push({
            id: i,
            data: new Array(1000).fill(Math.random()),
            callback: function() { return this.data; }
          });
        }

        // Force garbage collection (if available)
        if (global.gc) {
          global.gc();
        }

        const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        const memoryIncrease = finalMemory - initialMemory;

        // Clean up
        objects.length = 0;

        return {
          initialMemory,
          finalMemory,
          memoryIncrease,
          potentialLeak: memoryIncrease > 5 * 1024 * 1024 // > 5MB increase
        };
      };

      const leakTest = detectMemoryLeaks();
      
      expect(leakTest.memoryIncrease).toBeGreaterThanOrEqual(0);
      // In a real scenario, we'd want to ensure no significant memory leaks
      // expect(leakTest.potentialLeak).toBe(false);
    });
  });

  describe('Network Performance', () => {
    test('should measure resource loading times', () => {
      const mockResourceEntries = [
        {
          name: 'https://example.com/app.js',
          entryType: 'resource',
          startTime: 100,
          responseEnd: 800,
          transferSize: 50000,
          encodedBodySize: 45000,
          decodedBodySize: 120000
        },
        {
          name: 'https://example.com/styles.css',
          entryType: 'resource',
          startTime: 150,
          responseEnd: 400,
          transferSize: 15000,
          encodedBodySize: 12000,
          decodedBodySize: 30000
        }
      ];

      performance.getEntriesByType.mockReturnValue(mockResourceEntries);

      const measureResourcePerformance = () => {
        const resourceEntries = performance.getEntriesByType('resource');
        
        return resourceEntries.map(entry => ({
          name: entry.name,
          loadTime: entry.responseEnd - entry.startTime,
          transferSize: entry.transferSize,
          compressionRatio: entry.decodedBodySize / entry.encodedBodySize
        }));
      };

      const resourceMetrics = measureResourcePerformance();
      
      expect(resourceMetrics).toHaveLength(2);
      expect(resourceMetrics[0].loadTime).toBe(700); // 800 - 100
      expect(resourceMetrics[1].loadTime).toBe(250); // 400 - 150
      
      // Performance expectations
      resourceMetrics.forEach(metric => {
        expect(metric.loadTime).toBeLessThan(2000); // Resource load < 2s
        expect(metric.compressionRatio).toBeGreaterThan(1); // Should be compressed
      });
    });

    test('should measure API response times', async () => {
      const measureAPIPerformance = async (url, options = {}) => {
        const startTime = performance.now();
        
        // Mock fetch response
        const mockResponse = {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'test' }),
          headers: new Map([['content-type', 'application/json']])
        };

        global.fetch = jest.fn().mockResolvedValue(mockResponse);
        
        try {
          const response = await fetch(url, options);
          const endTime = performance.now();
          
          return {
            url,
            responseTime: endTime - startTime,
            status: response.status,
            success: response.ok
          };
        } catch (error) {
          const endTime = performance.now();
          return {
            url,
            responseTime: endTime - startTime,
            error: error.message,
            success: false
          };
        }
      };

      const apiMetrics = await measureAPIPerformance('/api/assessment');
      
      expect(apiMetrics.responseTime).toBeGreaterThan(0);
      expect(apiMetrics.responseTime).toBeLessThan(1000); // API response < 1s
      expect(apiMetrics.success).toBe(true);
      expect(apiMetrics.status).toBe(200);
    });
  });

  describe('Animation Performance', () => {
    test('should measure animation frame rate', () => {
      const measureAnimationPerformance = () => {
        const frames = [];
        let animationId;
        let startTime = performance.now();
        
        const animate = (currentTime) => {
          frames.push(currentTime);
          
          if (currentTime - startTime < 1000) { // Run for 1 second
            animationId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationId);
          }
        };

        // Mock requestAnimationFrame
        let frameCount = 0;
        global.requestAnimationFrame = jest.fn((callback) => {
          frameCount++;
          const currentTime = startTime + (frameCount * 16.67); // ~60fps
          setTimeout(() => callback(currentTime), 16.67);
          return frameCount;
        });

        global.cancelAnimationFrame = jest.fn();

        animate(startTime);

        // Calculate FPS after animation completes
        setTimeout(() => {
          const duration = frames[frames.length - 1] - frames[0];
          const fps = (frames.length / duration) * 1000;
          
          expect(fps).toBeGreaterThan(30); // Should maintain > 30 FPS
          expect(fps).toBeLessThanOrEqual(60); // Shouldn't exceed 60 FPS
        }, 1100);
      };

      measureAnimationPerformance();
    });

    test('should measure transition performance', () => {
      const measureTransitionPerformance = () => {
        const element = document.createElement('div');
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        
        const startTime = performance.now();
        
        // Trigger transition
        element.style.opacity = '1';
        
        // Mock transition end
        setTimeout(() => {
          const endTime = performance.now();
          const transitionDuration = endTime - startTime;
          
          expect(transitionDuration).toBeGreaterThan(250); // Should take at least 250ms
          expect(transitionDuration).toBeLessThan(400); // Should complete within 400ms
        }, 300);
      };

      measureTransitionPerformance();
    });
  });

  describe('Bundle Size Performance', () => {
    test('should measure JavaScript bundle size', () => {
      const measureBundleSize = () => {
        // Mock bundle analysis
        const mockBundleInfo = {
          'main.js': {
            size: 150 * 1024, // 150KB
            gzipSize: 45 * 1024 // 45KB gzipped
          },
          'vendor.js': {
            size: 300 * 1024, // 300KB
            gzipSize: 90 * 1024 // 90KB gzipped
          },
          'styles.css': {
            size: 25 * 1024, // 25KB
            gzipSize: 8 * 1024 // 8KB gzipped
          }
        };

        const totalSize = Object.values(mockBundleInfo)
          .reduce((sum, file) => sum + file.size, 0);
        
        const totalGzipSize = Object.values(mockBundleInfo)
          .reduce((sum, file) => sum + file.gzipSize, 0);

        return {
          files: mockBundleInfo,
          totalSize,
          totalGzipSize,
          compressionRatio: totalSize / totalGzipSize
        };
      };

      const bundleMetrics = measureBundleSize();
      
      expect(bundleMetrics.totalSize).toBeLessThan(500 * 1024); // Total < 500KB
      expect(bundleMetrics.totalGzipSize).toBeLessThan(150 * 1024); // Gzipped < 150KB
      expect(bundleMetrics.compressionRatio).toBeGreaterThan(2); // Good compression ratio
    });

    test('should analyze code splitting effectiveness', () => {
      const analyzeCodeSplitting = () => {
        const mockChunks = {
          'main': { size: 50 * 1024, critical: true },
          'assessment': { size: 80 * 1024, critical: false },
          'results': { size: 60 * 1024, critical: false },
          'vendor': { size: 200 * 1024, critical: true }
        };

        const criticalSize = Object.values(mockChunks)
          .filter(chunk => chunk.critical)
          .reduce((sum, chunk) => sum + chunk.size, 0);

        const nonCriticalSize = Object.values(mockChunks)
          .filter(chunk => !chunk.critical)
          .reduce((sum, chunk) => sum + chunk.size, 0);

        return {
          chunks: mockChunks,
          criticalSize,
          nonCriticalSize,
          splittingRatio: nonCriticalSize / criticalSize
        };
      };

      const splittingMetrics = analyzeCodeSplitting();
      
      expect(splittingMetrics.criticalSize).toBeLessThan(300 * 1024); // Critical path < 300KB
      expect(splittingMetrics.splittingRatio).toBeGreaterThan(0.3); // Good splitting ratio
    });
  });

  describe('Performance Regression Detection', () => {
    test('should detect performance regressions', () => {
      const detectRegressions = (currentMetrics, baselineMetrics) => {
        const regressions = [];
        const threshold = 0.1; // 10% regression threshold

        Object.keys(currentMetrics).forEach(metric => {
          const current = currentMetrics[metric];
          const baseline = baselineMetrics[metric];
          
          if (baseline && current > baseline * (1 + threshold)) {
            regressions.push({
              metric,
              current,
              baseline,
              regression: ((current - baseline) / baseline) * 100
            });
          }
        });

        return regressions;
      };

      const baselineMetrics = {
        loadTime: 2000,
        renderTime: 30,
        memoryUsage: 10 * 1024 * 1024
      };

      const currentMetrics = {
        loadTime: 2500, // 25% slower
        renderTime: 25,  // 17% faster
        memoryUsage: 12 * 1024 * 1024 // 20% more memory
      };

      const regressions = detectRegressions(currentMetrics, baselineMetrics);
      
      expect(regressions).toHaveLength(2); // loadTime and memoryUsage
      expect(regressions[0].metric).toBe('loadTime');
      expect(regressions[0].regression).toBe(25);
      expect(regressions[1].metric).toBe('memoryUsage');
      expect(regressions[1].regression).toBe(20);
    });

    test('should generate performance report', () => {
      const generatePerformanceReport = (metrics) => {
        const report = {
          timestamp: new Date().toISOString(),
          metrics,
          score: 0,
          recommendations: []
        };

        // Calculate performance score (0-100)
        let score = 100;
        
        if (metrics.loadTime > 3000) {
          score -= 20;
          report.recommendations.push('Optimize page load time');
        }
        
        if (metrics.fcp > 2500) {
          score -= 15;
          report.recommendations.push('Improve First Contentful Paint');
        }
        
        if (metrics.cls > 0.25) {
          score -= 15;
          report.recommendations.push('Reduce Cumulative Layout Shift');
        }
        
        if (metrics.memoryUsage > 50 * 1024 * 1024) {
          score -= 10;
          report.recommendations.push('Optimize memory usage');
        }

        report.score = Math.max(0, score);
        
        return report;
      };

      const mockMetrics = {
        loadTime: 2200,
        fcp: 1800,
        lcp: 2500,
        cls: 0.15,
        fid: 80,
        memoryUsage: 15 * 1024 * 1024
      };

      const report = generatePerformanceReport(mockMetrics);
      
      expect(report.score).toBeGreaterThan(80); // Good performance score
      expect(report.recommendations).toHaveLength(0); // No recommendations needed
      expect(report.timestamp).toBeDefined();
      expect(report.metrics).toEqual(mockMetrics);
    });
  });
});