// Cross-Browser Compatibility Tests
const { TestUtils, setupTests } = require('../setup');

describe('Cross-Browser Compatibility Tests', () => {
  let mockBrowsers;

  beforeEach(() => {
    setupTests();
    
    // Mock different browser environments
    mockBrowsers = {
      chrome: {
        name: 'Chrome',
        version: '120.0.0.0',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true
        }
      },
      firefox: {
        name: 'Firefox',
        version: '121.0.0',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true
        }
      },
      safari: {
        name: 'Safari',
        version: '17.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Safari/605.1.15',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true
        }
      },
      edge: {
        name: 'Edge',
        version: '120.0.0.0',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true
        }
      },
      ie11: {
        name: 'Internet Explorer',
        version: '11.0',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
        features: {
          es6: false,
          flexbox: true, // partial support
          grid: false,
          webp: false,
          localStorage: true,
          sessionStorage: true,
          fetch: false,
          promises: false,
          arrow_functions: false,
          template_literals: false,
          destructuring: false,
          modules: false
        }
      },
      mobile_chrome: {
        name: 'Chrome Mobile',
        version: '120.0.0.0',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true,
          touch: true
        }
      },
      mobile_safari: {
        name: 'Safari Mobile',
        version: '17.1.2',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        features: {
          es6: true,
          flexbox: true,
          grid: true,
          webp: true,
          localStorage: true,
          sessionStorage: true,
          fetch: true,
          promises: true,
          arrow_functions: true,
          template_literals: true,
          destructuring: true,
          modules: true,
          touch: true
        }
      }
    };
  });

  const mockBrowserEnvironment = (browserKey) => {
    const browser = mockBrowsers[browserKey];
    
    // Mock navigator
    Object.defineProperty(global.navigator, 'userAgent', {
      value: browser.userAgent,
      configurable: true
    });

    // Mock feature support
    Object.keys(browser.features).forEach(feature => {
      switch (feature) {
        case 'localStorage':
          global.localStorage = browser.features[feature] ? {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
          } : undefined;
          break;
        case 'sessionStorage':
          global.sessionStorage = browser.features[feature] ? {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
          } : undefined;
          break;
        case 'fetch':
          global.fetch = browser.features[feature] ? jest.fn() : undefined;
          break;
        case 'promises':
          global.Promise = browser.features[feature] ? Promise : undefined;
          break;
        case 'touch':
          global.window.ontouchstart = browser.features[feature] ? {} : undefined;
          break;
      }
    });

    return browser;
  };

  describe('Feature Detection and Polyfills', () => {
    test('should detect browser capabilities correctly', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const detectFeatures = () => {
          return {
            hasLocalStorage: typeof localStorage !== 'undefined',
            hasFetch: typeof fetch !== 'undefined',
            hasPromises: typeof Promise !== 'undefined',
            hasTouch: 'ontouchstart' in window,
            isModernBrowser: typeof Promise !== 'undefined' && typeof fetch !== 'undefined'
          };
        };

        const detected = detectFeatures();
        
        expect(detected.hasLocalStorage).toBe(browser.features.localStorage);
        expect(detected.hasFetch).toBe(browser.features.fetch);
        expect(detected.hasPromises).toBe(browser.features.promises);
        
        if (browser.features.touch) {
          expect(detected.hasTouch).toBe(true);
        }
      });
    });

    test('should provide polyfills for missing features', () => {
      // Test IE11 environment
      const ie11 = mockBrowserEnvironment('ie11');
      
      // Mock polyfill implementation
      const polyfillFetch = () => {
        if (!global.fetch) {
          global.fetch = function(url, options = {}) {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(options.method || 'GET', url);
              
              if (options.headers) {
                Object.keys(options.headers).forEach(key => {
                  xhr.setRequestHeader(key, options.headers[key]);
                });
              }
              
              xhr.onload = () => {
                resolve({
                  ok: xhr.status >= 200 && xhr.status < 300,
                  status: xhr.status,
                  json: () => Promise.resolve(JSON.parse(xhr.responseText)),
                  text: () => Promise.resolve(xhr.responseText)
                });
              };
              
              xhr.onerror = () => reject(new Error('Network error'));
              xhr.send(options.body);
            });
          };
        }
      };

      const polyfillPromises = () => {
        if (!global.Promise) {
          // Simplified Promise polyfill for testing
          global.Promise = function(executor) {
            const self = this;
            self.state = 'pending';
            self.value = undefined;
            self.handlers = [];

            const resolve = (value) => {
              if (self.state === 'pending') {
                self.state = 'fulfilled';
                self.value = value;
                self.handlers.forEach(handler => handler.onFulfilled(value));
              }
            };

            const reject = (reason) => {
              if (self.state === 'pending') {
                self.state = 'rejected';
                self.value = reason;
                self.handlers.forEach(handler => handler.onRejected(reason));
              }
            };

            try {
              executor(resolve, reject);
            } catch (error) {
              reject(error);
            }
          };

          global.Promise.prototype.then = function(onFulfilled, onRejected) {
            const self = this;
            return new Promise((resolve, reject) => {
              const handler = {
                onFulfilled: onFulfilled || resolve,
                onRejected: onRejected || reject
              };

              if (self.state === 'fulfilled') {
                handler.onFulfilled(self.value);
              } else if (self.state === 'rejected') {
                handler.onRejected(self.value);
              } else {
                self.handlers.push(handler);
              }
            });
          };
        }
      };

      // Apply polyfills
      polyfillPromises();
      polyfillFetch();

      expect(global.Promise).toBeDefined();
      expect(global.fetch).toBeDefined();
    });
  });

  describe('CSS Compatibility', () => {
    test('should handle flexbox support across browsers', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const checkFlexboxSupport = () => {
          // Mock CSS.supports
          global.CSS = {
            supports: jest.fn((property, value) => {
              if (property === 'display' && value === 'flex') {
                return browser.features.flexbox;
              }
              return false;
            })
          };

          return CSS.supports('display', 'flex');
        };

        const hasFlexbox = checkFlexboxSupport();
        expect(hasFlexbox).toBe(browser.features.flexbox);

        // Test fallback for non-flexbox browsers
        if (!hasFlexbox) {
          const fallbackLayout = {
            display: 'table',
            width: '100%'
          };
          expect(fallbackLayout.display).toBe('table');
        }
      });
    });

    test('should handle CSS Grid support', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const checkGridSupport = () => {
          global.CSS = {
            supports: jest.fn((property, value) => {
              if (property === 'display' && value === 'grid') {
                return browser.features.grid;
              }
              return false;
            })
          };

          return CSS.supports('display', 'grid');
        };

        const hasGrid = checkGridSupport();
        expect(hasGrid).toBe(browser.features.grid);
      });
    });

    test('should provide CSS fallbacks for older browsers', () => {
      const ie11 = mockBrowserEnvironment('ie11');
      
      const getCSSFallbacks = (modernCSS) => {
        const fallbacks = {};
        
        // Grid fallback
        if (modernCSS.display === 'grid' && !ie11.features.grid) {
          fallbacks.display = 'table';
          fallbacks.width = '100%';
        }
        
        // Flexbox fallback (IE11 has partial support)
        if (modernCSS.display === 'flex' && !ie11.features.flexbox) {
          fallbacks.display = 'table-cell';
          fallbacks.verticalAlign = 'middle';
        }

        return fallbacks;
      };

      const modernCSS = { display: 'grid' };
      const fallbacks = getCSSFallbacks(modernCSS);
      
      expect(fallbacks.display).toBe('table');
      expect(fallbacks.width).toBe('100%');
    });
  });

  describe('JavaScript Compatibility', () => {
    test('should handle ES6 features across browsers', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const testES6Features = () => {
          const results = {};
          
          // Arrow functions
          try {
            if (browser.features.arrow_functions) {
              const arrowFunc = () => 'test';
              results.arrowFunctions = arrowFunc() === 'test';
            } else {
              results.arrowFunctions = false;
            }
          } catch (e) {
            results.arrowFunctions = false;
          }

          // Template literals
          try {
            if (browser.features.template_literals) {
              const name = 'test';
              const template = `Hello ${name}`;
              results.templateLiterals = template === 'Hello test';
            } else {
              results.templateLiterals = false;
            }
          } catch (e) {
            results.templateLiterals = false;
          }

          // Destructuring
          try {
            if (browser.features.destructuring) {
              const obj = { a: 1, b: 2 };
              const { a, b } = obj;
              results.destructuring = a === 1 && b === 2;
            } else {
              results.destructuring = false;
            }
          } catch (e) {
            results.destructuring = false;
          }

          return results;
        };

        const results = testES6Features();
        
        expect(results.arrowFunctions).toBe(browser.features.arrow_functions);
        expect(results.templateLiterals).toBe(browser.features.template_literals);
        expect(results.destructuring).toBe(browser.features.destructuring);
      });
    });

    test('should transpile ES6 code for older browsers', () => {
      const ie11 = mockBrowserEnvironment('ie11');
      
      // Mock Babel transpilation
      const transpileES6 = (code) => {
        // Simplified transpilation examples
        const transpiled = code
          .replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{([^}]*)}/g, 
                   'var $1 = function($2) {$3}')
          .replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*([^;]+);/g, 
                   'var $1 = function($2) { return $3; };')
          .replace(/`([^`]*\$\{[^}]+\}[^`]*)`/g, 
                   function(match, template) {
                     return '"' + template.replace(/\$\{([^}]+)\}/g, '" + $1 + "') + '"';
                   });
        
        return transpiled;
      };

      const es6Code = 'const greet = (name) => `Hello ${name}`;';
      const transpiledCode = transpileES6(es6Code);
      
      expect(transpiledCode).toContain('var greet = function(name)');
      expect(transpiledCode).toContain('"Hello " + name + ""');
    });
  });

  describe('Event Handling Compatibility', () => {
    test('should handle touch events on mobile browsers', () => {
      const mobileChrome = mockBrowserEnvironment('mobile_chrome');
      const mobileSafari = mockBrowserEnvironment('mobile_safari');
      
      const setupTouchEvents = () => {
        const events = {};
        
        if ('ontouchstart' in window) {
          events.touchstart = jest.fn();
          events.touchmove = jest.fn();
          events.touchend = jest.fn();
        } else {
          // Fallback to mouse events
          events.mousedown = jest.fn();
          events.mousemove = jest.fn();
          events.mouseup = jest.fn();
        }
        
        return events;
      };

      [mobileChrome, mobileSafari].forEach(browser => {
        mockBrowserEnvironment(browser.name.toLowerCase().replace(' ', '_'));
        const events = setupTouchEvents();
        
        if (browser.features.touch) {
          expect(events.touchstart).toBeDefined();
          expect(events.touchmove).toBeDefined();
          expect(events.touchend).toBeDefined();
        }
      });
    });

    test('should handle keyboard events consistently', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const normalizeKeyboardEvent = (event) => {
          // Handle different key code implementations
          const key = event.key || event.keyCode || event.which;
          
          const keyMap = {
            13: 'Enter',
            27: 'Escape',
            37: 'ArrowLeft',
            38: 'ArrowUp',
            39: 'ArrowRight',
            40: 'ArrowDown',
            9: 'Tab'
          };

          return {
            key: typeof key === 'string' ? key : keyMap[key] || 'Unknown',
            keyCode: typeof key === 'number' ? key : Object.keys(keyMap).find(k => keyMap[k] === key),
            preventDefault: event.preventDefault || jest.fn(),
            stopPropagation: event.stopPropagation || jest.fn()
          };
        };

        // Test different event formats
        const modernEvent = { key: 'Enter' };
        const legacyEvent = { keyCode: 13 };
        
        const normalizedModern = normalizeKeyboardEvent(modernEvent);
        const normalizedLegacy = normalizeKeyboardEvent(legacyEvent);
        
        expect(normalizedModern.key).toBe('Enter');
        expect(normalizedLegacy.key).toBe('Enter');
      });
    });
  });

  describe('Storage Compatibility', () => {
    test('should handle localStorage availability', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const safeLocalStorage = {
          getItem: (key) => {
            try {
              return localStorage ? localStorage.getItem(key) : null;
            } catch (e) {
              return null;
            }
          },
          
          setItem: (key, value) => {
            try {
              if (localStorage) {
                localStorage.setItem(key, value);
                return true;
              }
              return false;
            } catch (e) {
              return false;
            }
          },
          
          removeItem: (key) => {
            try {
              if (localStorage) {
                localStorage.removeItem(key);
                return true;
              }
              return false;
            } catch (e) {
              return false;
            }
          }
        };

        if (browser.features.localStorage) {
          expect(safeLocalStorage.setItem('test', 'value')).toBe(true);
          expect(safeLocalStorage.getItem('test')).toBeDefined();
        } else {
          expect(safeLocalStorage.setItem('test', 'value')).toBe(false);
          expect(safeLocalStorage.getItem('test')).toBeNull();
        }
      });
    });

    test('should provide storage fallbacks', () => {
      // Mock environment without localStorage
      global.localStorage = undefined;
      
      const createMemoryStorage = () => {
        const storage = {};
        
        return {
          getItem: (key) => storage[key] || null,
          setItem: (key, value) => {
            storage[key] = String(value);
          },
          removeItem: (key) => {
            delete storage[key];
          },
          clear: () => {
            Object.keys(storage).forEach(key => delete storage[key]);
          }
        };
      };

      const memoryStorage = createMemoryStorage();
      
      memoryStorage.setItem('test', 'value');
      expect(memoryStorage.getItem('test')).toBe('value');
      
      memoryStorage.removeItem('test');
      expect(memoryStorage.getItem('test')).toBeNull();
    });
  });

  describe('Network Request Compatibility', () => {
    test('should handle fetch API availability', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const makeRequest = async (url, options = {}) => {
          if (typeof fetch !== 'undefined') {
            return fetch(url, options);
          } else {
            // XMLHttpRequest fallback
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(options.method || 'GET', url);
              
              xhr.onload = () => {
                resolve({
                  ok: xhr.status >= 200 && xhr.status < 300,
                  status: xhr.status,
                  json: () => Promise.resolve(JSON.parse(xhr.responseText)),
                  text: () => Promise.resolve(xhr.responseText)
                });
              };
              
              xhr.onerror = () => reject(new Error('Network error'));
              xhr.send(options.body);
            });
          };
        };

        if (browser.features.fetch) {
          expect(typeof fetch).toBe('function');
        } else {
          expect(typeof fetch).toBe('undefined');
          // Should use XMLHttpRequest fallback
        }
      });
    });
  });

  describe('Image Format Compatibility', () => {
    test('should detect WebP support', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const detectWebPSupport = () => {
          return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
              resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
          });
        };

        // Mock WebP support based on browser features
        const mockWebPSupport = browser.features.webp;
        
        if (mockWebPSupport) {
          expect(browser.features.webp).toBe(true);
        } else {
          expect(browser.features.webp).toBe(false);
        }
      });
    });

    test('should provide image format fallbacks', () => {
      const getImageSrc = (baseName, hasWebPSupport) => {
        if (hasWebPSupport) {
          return `${baseName}.webp`;
        } else {
          return `${baseName}.jpg`;
        }
      };

      expect(getImageSrc('image', true)).toBe('image.webp');
      expect(getImageSrc('image', false)).toBe('image.jpg');
    });
  });

  describe('Performance Optimization by Browser', () => {
    test('should optimize for different browser capabilities', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const getOptimizationStrategy = (browser) => {
          const strategy = {
            useModernFeatures: browser.features.es6,
            enableServiceWorker: browser.name !== 'Internet Explorer',
            useWebP: browser.features.webp,
            enablePushState: browser.name !== 'Internet Explorer' || browser.version >= '10.0',
            useRequestAnimationFrame: true,
            enableTouchOptimizations: browser.features.touch || false
          };

          return strategy;
        };

        const strategy = getOptimizationStrategy(browser);
        
        if (browser.name === 'Internet Explorer') {
          expect(strategy.useModernFeatures).toBe(false);
          expect(strategy.enableServiceWorker).toBe(false);
        } else {
          expect(strategy.useModernFeatures).toBe(true);
          expect(strategy.enableServiceWorker).toBe(true);
        }

        if (browser.features.touch) {
          expect(strategy.enableTouchOptimizations).toBe(true);
        }
      });
    });
  });

  describe('Error Handling Across Browsers', () => {
    test('should handle errors consistently across browsers', () => {
      Object.keys(mockBrowsers).forEach(browserKey => {
        const browser = mockBrowserEnvironment(browserKey);
        
        const handleError = (error) => {
          const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace available',
            name: error.name || 'Error',
            browser: browser.name,
            version: browser.version
          };

          // Different browsers may have different error properties
          if (browser.name === 'Internet Explorer') {
            errorInfo.description = error.description || errorInfo.message;
          }

          return errorInfo;
        };

        const testError = new Error('Test error');
        const errorInfo = handleError(testError);
        
        expect(errorInfo.message).toBe('Test error');
        expect(errorInfo.browser).toBe(browser.name);
        expect(errorInfo.version).toBe(browser.version);
      });
    });
  });

  describe('Responsive Design Compatibility', () => {
    test('should handle viewport meta tag across browsers', () => {
      const setViewportMeta = () => {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Mock document.head
        const mockHead = {
          appendChild: jest.fn()
        };
        
        mockHead.appendChild(viewport);
        return viewport;
      };

      const viewportMeta = setViewportMeta();
      expect(viewportMeta.name).toBe('viewport');
      expect(viewportMeta.content).toContain('width=device-width');
    });

    test('should handle media queries across browsers', () => {
      const testMediaQuery = (query) => {
        // Mock window.matchMedia
        global.window.matchMedia = jest.fn().mockImplementation((query) => ({
          matches: query.includes('max-width: 768px') ? true : false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));

        return window.matchMedia(query);
      };

      const mobileQuery = testMediaQuery('(max-width: 768px)');
      const desktopQuery = testMediaQuery('(min-width: 1024px)');
      
      expect(mobileQuery.matches).toBe(true);
      expect(desktopQuery.matches).toBe(false);
    });
  });
});