/**
 * 浏览器兼容性工具类
 * Browser Compatibility Utilities
 */

class BrowserCompatibility {
    constructor() {
        this.browserInfo = this.detectBrowser();
        this.supportedFeatures = {};
        this.polyfills = [];
        this.warnings = [];
        
        this.init();
    }

    /**
     * 初始化兼容性检查和处理
     */
    init() {
        this.checkBrowserSupport();
        this.loadPolyfills();
        this.setupCompatibilityFixes();
        this.addCompatibilityStyles();
        this.reportCompatibilityStatus();
    }

    /**
     * 检测浏览器信息
     */
    detectBrowser() {
        const userAgent = navigator.userAgent;
        const browserInfo = {
            name: 'unknown',
            version: 'unknown',
            engine: 'unknown',
            platform: navigator.platform,
            mobile: /Mobile|Android|iPhone|iPad/.test(userAgent)
        };

        // 检测浏览器名称和版本
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            browserInfo.name = 'Chrome';
            browserInfo.version = this.extractVersion(userAgent, /Chrome\/(\d+\.\d+)/);
            browserInfo.engine = 'Blink';
        } else if (userAgent.includes('Firefox')) {
            browserInfo.name = 'Firefox';
            browserInfo.version = this.extractVersion(userAgent, /Firefox\/(\d+\.\d+)/);
            browserInfo.engine = 'Gecko';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browserInfo.name = 'Safari';
            browserInfo.version = this.extractVersion(userAgent, /Version\/(\d+\.\d+)/);
            browserInfo.engine = 'WebKit';
        } else if (userAgent.includes('Edg')) {
            browserInfo.name = 'Edge';
            browserInfo.version = this.extractVersion(userAgent, /Edg\/(\d+\.\d+)/);
            browserInfo.engine = 'Blink';
        } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            browserInfo.name = 'IE';
            browserInfo.version = this.extractVersion(userAgent, /(?:MSIE |rv:)(\d+\.\d+)/);
            browserInfo.engine = 'Trident';
        }

        return browserInfo;
    }

    /**
     * 提取版本号
     */
    extractVersion(userAgent, regex) {
        const match = userAgent.match(regex);
        return match ? match[1] : 'unknown';
    }

    /**
     * 检查浏览器支持情况
     */
    checkBrowserSupport() {
        const features = {
            // ES6+ 特性
            es6Classes: this.checkES6Classes(),
            arrowFunctions: this.checkArrowFunctions(),
            templateLiterals: this.checkTemplateLiterals(),
            destructuring: this.checkDestructuring(),
            promises: this.checkPromises(),
            asyncAwait: this.checkAsyncAwait(),
            
            // DOM API
            querySelector: !!document.querySelector,
            addEventListener: !!document.addEventListener,
            classList: !!document.documentElement.classList,
            dataset: !!document.documentElement.dataset,
            
            // CSS 特性
            cssGrid: this.checkCSSGrid(),
            flexbox: this.checkFlexbox(),
            cssVariables: this.checkCSSVariables(),
            cssTransitions: this.checkCSSTransitions(),
            cssTransforms: this.checkCSSTransforms(),
            
            // HTML5 特性
            canvas: !!document.createElement('canvas').getContext,
            localStorage: this.checkLocalStorage(),
            sessionStorage: this.checkSessionStorage(),
            history: !!(window.history && window.history.pushState),
            
            // 现代 Web API
            fetch: !!window.fetch,
            intersectionObserver: !!window.IntersectionObserver,
            mutationObserver: !!window.MutationObserver,
            performanceObserver: !!window.PerformanceObserver,
            webWorkers: !!window.Worker,
            serviceWorkers: !!navigator.serviceWorker,
            
            // 媒体特性
            webp: this.checkWebPSupport(),
            avif: this.checkAVIFSupport(),
            
            // 输入特性
            touch: 'ontouchstart' in window,
            pointerEvents: !!window.PointerEvent,
            
            // 网络特性
            connection: !!navigator.connection,
            onLine: 'onLine' in navigator
        };

        this.supportedFeatures = features;
        this.identifyUnsupportedFeatures();
    }

    /**
     * 检查ES6类支持
     */
    checkES6Classes() {
        try {
            eval('class TestClass {}');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查箭头函数支持
     */
    checkArrowFunctions() {
        try {
            eval('(() => {})');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查模板字面量支持
     */
    checkTemplateLiterals() {
        try {
            eval('`template literal`');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查解构赋值支持
     */
    checkDestructuring() {
        try {
            eval('const {a} = {a: 1}');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查Promise支持
     */
    checkPromises() {
        return typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1;
    }

    /**
     * 检查async/await支持
     */
    checkAsyncAwait() {
        try {
            eval('async function test() { await Promise.resolve(); }');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查CSS Grid支持
     */
    checkCSSGrid() {
        const element = document.createElement('div');
        return 'grid' in element.style;
    }

    /**
     * 检查Flexbox支持
     */
    checkFlexbox() {
        const element = document.createElement('div');
        return 'flex' in element.style || 'webkitFlex' in element.style;
    }

    /**
     * 检查CSS变量支持
     */
    checkCSSVariables() {
        return window.CSS && CSS.supports && CSS.supports('color', 'var(--test)');
    }

    /**
     * 检查CSS过渡支持
     */
    checkCSSTransitions() {
        const element = document.createElement('div');
        return 'transition' in element.style || 'webkitTransition' in element.style;
    }

    /**
     * 检查CSS变换支持
     */
    checkCSSTransforms() {
        const element = document.createElement('div');
        return 'transform' in element.style || 'webkitTransform' in element.style;
    }

    /**
     * 检查localStorage支持
     */
    checkLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查sessionStorage支持
     */
    checkSessionStorage() {
        try {
            const test = 'test';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查WebP支持
     */
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * 检查AVIF支持
     */
    checkAVIFSupport() {
        return new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = () => {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }

    /**
     * 识别不支持的特性
     */
    identifyUnsupportedFeatures() {
        const unsupported = [];
        
        Object.entries(this.supportedFeatures).forEach(([feature, supported]) => {
            if (!supported) {
                unsupported.push(feature);
            }
        });

        if (unsupported.length > 0) {
            this.warnings.push(`不支持的特性: ${unsupported.join(', ')}`);
        }

        // 检查关键特性
        const criticalFeatures = ['querySelector', 'addEventListener', 'classList'];
        const missingCritical = criticalFeatures.filter(feature => !this.supportedFeatures[feature]);
        
        if (missingCritical.length > 0) {
            this.warnings.push(`缺少关键特性: ${missingCritical.join(', ')}`);
        }
    }

    /**
     * 加载Polyfills
     */
    loadPolyfills() {
        const polyfillsToLoad = [];

        // Promise polyfill
        if (!this.supportedFeatures.promises) {
            polyfillsToLoad.push(this.loadPromisePolyfill());
        }

        // Fetch polyfill
        if (!this.supportedFeatures.fetch) {
            polyfillsToLoad.push(this.loadFetchPolyfill());
        }

        // IntersectionObserver polyfill
        if (!this.supportedFeatures.intersectionObserver) {
            polyfillsToLoad.push(this.loadIntersectionObserverPolyfill());
        }

        // classList polyfill for IE
        if (!this.supportedFeatures.classList) {
            polyfillsToLoad.push(this.loadClassListPolyfill());
        }

        // CSS变量 polyfill
        if (!this.supportedFeatures.cssVariables) {
            polyfillsToLoad.push(this.loadCSSVariablesPolyfill());
        }

        // Object.assign polyfill
        if (!Object.assign) {
            this.loadObjectAssignPolyfill();
        }

        // Array.from polyfill
        if (!Array.from) {
            this.loadArrayFromPolyfill();
        }

        // 等待所有polyfills加载完成
        Promise.all(polyfillsToLoad).then(() => {
            console.log('所有polyfills加载完成');
            this.dispatchCompatibilityReady();
        });
    }

    /**
     * Promise polyfill
     */
    loadPromisePolyfill() {
        return new Promise((resolve) => {
            if (window.Promise) {
                resolve();
                return;
            }

            // 简单的Promise polyfill
            window.Promise = function(executor) {
                const self = this;
                self.state = 'pending';
                self.value = undefined;
                self.handlers = [];

                function resolve(result) {
                    if (self.state === 'pending') {
                        self.state = 'fulfilled';
                        self.value = result;
                        self.handlers.forEach(handle);
                        self.handlers = null;
                    }
                }

                function reject(error) {
                    if (self.state === 'pending') {
                        self.state = 'rejected';
                        self.value = error;
                        self.handlers.forEach(handle);
                        self.handlers = null;
                    }
                }

                function handle(handler) {
                    if (self.state === 'pending') {
                        self.handlers.push(handler);
                    } else {
                        if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
                            handler.onFulfilled(self.value);
                        }
                        if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
                            handler.onRejected(self.value);
                        }
                    }
                }

                self.then = function(onFulfilled, onRejected) {
                    return new Promise(function(resolve, reject) {
                        handle({
                            onFulfilled: function(result) {
                                try {
                                    resolve(onFulfilled ? onFulfilled(result) : result);
                                } catch (ex) {
                                    reject(ex);
                                }
                            },
                            onRejected: function(error) {
                                try {
                                    resolve(onRejected ? onRejected(error) : error);
                                } catch (ex) {
                                    reject(ex);
                                }
                            }
                        });
                    });
                };

                executor(resolve, reject);
            };

            this.polyfills.push('Promise');
            resolve();
        });
    }

    /**
     * Fetch polyfill
     */
    loadFetchPolyfill() {
        return new Promise((resolve) => {
            if (window.fetch) {
                resolve();
                return;
            }

            // 简单的fetch polyfill
            window.fetch = function(url, options) {
                return new Promise(function(resolve, reject) {
                    const xhr = new XMLHttpRequest();
                    const method = (options && options.method) || 'GET';
                    const headers = (options && options.headers) || {};
                    const body = options && options.body;

                    xhr.open(method, url);

                    Object.keys(headers).forEach(function(key) {
                        xhr.setRequestHeader(key, headers[key]);
                    });

                    xhr.onload = function() {
                        resolve({
                            ok: xhr.status >= 200 && xhr.status < 300,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            text: function() {
                                return Promise.resolve(xhr.responseText);
                            },
                            json: function() {
                                return Promise.resolve(JSON.parse(xhr.responseText));
                            }
                        });
                    };

                    xhr.onerror = function() {
                        reject(new Error('Network error'));
                    };

                    xhr.send(body);
                });
            };

            this.polyfills.push('fetch');
            resolve();
        });
    }

    /**
     * IntersectionObserver polyfill
     */
    loadIntersectionObserverPolyfill() {
        return new Promise((resolve) => {
            if (window.IntersectionObserver) {
                resolve();
                return;
            }

            // 简单的IntersectionObserver polyfill
            window.IntersectionObserver = function(callback, options) {
                this.callback = callback;
                this.options = options || {};
                this.elements = [];
            };

            window.IntersectionObserver.prototype.observe = function(element) {
                this.elements.push(element);
                this.checkIntersection();
            };

            window.IntersectionObserver.prototype.unobserve = function(element) {
                const index = this.elements.indexOf(element);
                if (index > -1) {
                    this.elements.splice(index, 1);
                }
            };

            window.IntersectionObserver.prototype.checkIntersection = function() {
                const self = this;
                this.elements.forEach(function(element) {
                    const rect = element.getBoundingClientRect();
                    const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    self.callback([{
                        target: element,
                        isIntersecting: isIntersecting,
                        intersectionRatio: isIntersecting ? 1 : 0
                    }]);
                });
            };

            this.polyfills.push('IntersectionObserver');
            resolve();
        });
    }

    /**
     * classList polyfill
     */
    loadClassListPolyfill() {
        return new Promise((resolve) => {
            if (document.documentElement.classList) {
                resolve();
                return;
            }

            // classList polyfill for IE
            (function() {
                if (!('classList' in document.documentElement)) {
                    Object.defineProperty(HTMLElement.prototype, 'classList', {
                        get: function() {
                            const self = this;
                            function update(fn) {
                                return function(value) {
                                    const classes = self.className.split(/\s+/);
                                    const index = classes.indexOf(value);
                                    fn(classes, index, value);
                                    self.className = classes.join(' ');
                                };
                            }

                            return {
                                add: update(function(classes, index, value) {
                                    if (index < 0) classes.push(value);
                                }),
                                remove: update(function(classes, index) {
                                    if (index >= 0) classes.splice(index, 1);
                                }),
                                toggle: update(function(classes, index, value) {
                                    if (index >= 0) classes.splice(index, 1);
                                    else classes.push(value);
                                }),
                                contains: function(value) {
                                    return self.className.split(/\s+/).indexOf(value) >= 0;
                                }
                            };
                        }
                    });
                }
            })();

            this.polyfills.push('classList');
            resolve();
        });
    }

    /**
     * CSS变量 polyfill
     */
    loadCSSVariablesPolyfill() {
        return new Promise((resolve) => {
            if (this.supportedFeatures.cssVariables) {
                resolve();
                return;
            }

            // 简单的CSS变量polyfill
            const cssVars = {};
            const styleSheets = document.styleSheets;

            // 解析CSS变量
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.style) {
                            for (let k = 0; k < rule.style.length; k++) {
                                const prop = rule.style[k];
                                if (prop.startsWith('--')) {
                                    cssVars[prop] = rule.style.getPropertyValue(prop);
                                }
                            }
                        }
                    }
                } catch (e) {
                    // 跨域样式表可能无法访问
                }
            }

            // 替换var()函数
            const elements = document.querySelectorAll('*');
            elements.forEach(function(element) {
                const computedStyle = window.getComputedStyle(element);
                for (let prop in computedStyle) {
                    const value = computedStyle[prop];
                    if (typeof value === 'string' && value.includes('var(')) {
                        const newValue = value.replace(/var\((--[^,)]+)(?:,([^)]+))?\)/g, function(match, varName, fallback) {
                            return cssVars[varName] || fallback || '';
                        });
                        element.style[prop] = newValue;
                    }
                }
            });

            this.polyfills.push('cssVariables');
            resolve();
        });
    }

    /**
     * Object.assign polyfill
     */
    loadObjectAssignPolyfill() {
        if (!Object.assign) {
            Object.assign = function(target) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                const to = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    const nextSource = arguments[index];
                    if (nextSource != null) {
                        for (const nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
            this.polyfills.push('Object.assign');
        }
    }

    /**
     * Array.from polyfill
     */
    loadArrayFromPolyfill() {
        if (!Array.from) {
            Array.from = function(arrayLike, mapFn, thisArg) {
                const C = this;
                const items = Object(arrayLike);
                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }
                const mapFunction = mapFn === undefined ? undefined : mapFn;
                if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }
                const len = parseInt(items.length);
                const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
                let k = 0;
                while (k < len) {
                    const kValue = items[k];
                    const mappedValue = mapFunction ? mapFunction.call(thisArg, kValue, k) : kValue;
                    A[k] = mappedValue;
                    k += 1;
                }
                A.length = len;
                return A;
            };
            this.polyfills.push('Array.from');
        }
    }

    /**
     * 设置兼容性修复
     */
    setupCompatibilityFixes() {
        // IE兼容性修复
        if (this.browserInfo.name === 'IE') {
            this.setupIEFixes();
        }

        // Safari兼容性修复
        if (this.browserInfo.name === 'Safari') {
            this.setupSafariFixes();
        }

        // 移动端兼容性修复
        if (this.browserInfo.mobile) {
            this.setupMobileFixes();
        }

        // 老版本浏览器修复
        this.setupLegacyBrowserFixes();
    }

    /**
     * IE兼容性修复
     */
    setupIEFixes() {
        // 修复IE的事件对象
        if (!window.event) {
            document.addEventListener('click', function(e) {
                window.event = e;
            });
        }

        // 修复IE的console对象
        if (!window.console) {
            window.console = {
                log: function() {},
                error: function() {},
                warn: function() {},
                info: function() {}
            };
        }

        // 修复IE的placeholder
        if (!('placeholder' in document.createElement('input'))) {
            this.setupPlaceholderFix();
        }

        // 添加IE特定的CSS类
        document.documentElement.classList.add('ie');
        if (this.browserInfo.version) {
            document.documentElement.classList.add('ie' + Math.floor(parseFloat(this.browserInfo.version)));
        }
    }

    /**
     * Safari兼容性修复
     */
    setupSafariFixes() {
        // Safari的日期解析修复
        const originalDateParse = Date.parse;
        Date.parse = function(dateString) {
            // Safari不支持YYYY-MM-DD格式，需要转换为YYYY/MM/DD
            if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
                dateString = dateString.replace(/-/g, '/');
            }
            return originalDateParse.call(this, dateString);
        };

        // 添加Safari特定的CSS类
        document.documentElement.classList.add('safari');
    }

    /**
     * 移动端兼容性修复
     */
    setupMobileFixes() {
        // 禁用iOS的自动缩放
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
            viewport.setAttribute('content', viewport.getAttribute('content') + ', user-scalable=no');
        }

        // 修复移动端的点击延迟
        if ('ontouchstart' in window) {
            this.setupFastClick();
        }

        // 添加移动端特定的CSS类
        document.documentElement.classList.add('mobile');
        
        // 检测具体的移动平台
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.documentElement.classList.add('ios');
        } else if (/Android/.test(navigator.userAgent)) {
            document.documentElement.classList.add('android');
        }
    }

    /**
     * 设置FastClick
     */
    setupFastClick() {
        // 简单的FastClick实现
        let touchStartX, touchStartY, touchStartTime;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        });

        document.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            
            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaTime = touchEndTime - touchStartTime;
            
            // 如果是快速点击且没有移动太多
            if (deltaTime < 200 && deltaX < 10 && deltaY < 10) {
                const target = document.elementFromPoint(touchEndX, touchEndY);
                if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.onclick)) {
                    e.preventDefault();
                    target.click();
                }
            }
        });
    }

    /**
     * 老版本浏览器修复
     */
    setupLegacyBrowserFixes() {
        // 修复老版本浏览器的JSON支持
        if (!window.JSON) {
            this.loadJSONPolyfill();
        }

        // 修复老版本浏览器的bind方法
        if (!Function.prototype.bind) {
            Function.prototype.bind = function(oThis) {
                if (typeof this !== 'function') {
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                const aArgs = Array.prototype.slice.call(arguments, 1);
                const fToBind = this;
                const fNOP = function() {};
                const fBound = function() {
                    return fToBind.apply(this instanceof fNOP ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

                if (this.prototype) {
                    fNOP.prototype = this.prototype;
                }
                fBound.prototype = new fNOP();

                return fBound;
            };
        }
    }

    /**
     * placeholder修复
     */
    setupPlaceholderFix() {
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        
        inputs.forEach(function(input) {
            const placeholder = input.getAttribute('placeholder');
            
            if (input.value === '') {
                input.value = placeholder;
                input.style.color = '#999';
            }
            
            input.addEventListener('focus', function() {
                if (this.value === placeholder) {
                    this.value = '';
                    this.style.color = '';
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.value = placeholder;
                    this.style.color = '#999';
                }
            });
        });
    }

    /**
     * 添加兼容性样式
     */
    addCompatibilityStyles() {
        const styles = `
            /* 浏览器兼容性样式 */
            .ie .flexbox-fallback {
                display: table;
                width: 100%;
            }
            
            .ie .flexbox-fallback > * {
                display: table-cell;
                vertical-align: top;
            }
            
            .no-cssGrid .grid-fallback {
                display: table;
                width: 100%;
            }
            
            .no-cssGrid .grid-fallback > * {
                display: table-cell;
                vertical-align: top;
            }
            
            /* 移动端兼容性样式 */
            .mobile input[type="text"],
            .mobile input[type="email"],
            .mobile input[type="tel"],
            .mobile textarea {
                font-size: 16px; /* 防止iOS缩放 */
            }
            
            /* Safari兼容性样式 */
            .safari input[type="search"] {
                -webkit-appearance: textfield;
            }
            
            .safari input[type="search"]::-webkit-search-decoration {
                -webkit-appearance: none;
            }
            
            /* 高对比度模式支持 */
            @media (prefers-contrast: high) {
                * {
                    border-color: ButtonText !important;
                }
            }
            
            /* 减少动画模式支持 */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // 根据支持情况添加CSS类
        if (!this.supportedFeatures.flexbox) {
            document.documentElement.classList.add('no-flexbox');
        }
        
        if (!this.supportedFeatures.cssGrid) {
            document.documentElement.classList.add('no-cssGrid');
        }
        
        if (!this.supportedFeatures.cssVariables) {
            document.documentElement.classList.add('no-cssVariables');
        }
    }

    /**
     * 报告兼容性状态
     */
    reportCompatibilityStatus() {
        const report = {
            browser: this.browserInfo,
            supportedFeatures: this.supportedFeatures,
            loadedPolyfills: this.polyfills,
            warnings: this.warnings,
            timestamp: new Date().toISOString()
        };

        console.log('浏览器兼容性报告:', report);

        // 如果有警告，显示给用户
        if (this.warnings.length > 0) {
            this.showCompatibilityWarning();
        }

        // 发送兼容性数据到分析服务
        this.sendCompatibilityData(report);
    }

    /**
     * 显示兼容性警告
     */
    showCompatibilityWarning() {
        const isOldBrowser = (
            (this.browserInfo.name === 'IE' && parseFloat(this.browserInfo.version) < 11) ||
            (this.browserInfo.name === 'Chrome' && parseFloat(this.browserInfo.version) < 60) ||
            (this.browserInfo.name === 'Firefox' && parseFloat(this.browserInfo.version) < 55) ||
            (this.browserInfo.name === 'Safari' && parseFloat(this.browserInfo.version) < 10)
        );

        if (isOldBrowser) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'browser-compatibility-warning';
            warningDiv.innerHTML = `
                <div class="warning-content">
                    <h3>浏览器兼容性提醒</h3>
                    <p>您正在使用较旧版本的浏览器，可能无法获得最佳的浏览体验。</p>
                    <p>建议您升级到最新版本的浏览器以获得更好的性能和安全性。</p>
                    <button onclick="this.parentElement.parentElement.style.display='none'">知道了</button>
                </div>
            `;

            const warningStyles = `
                .browser-compatibility-warning {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #fff3cd;
                    border-bottom: 1px solid #ffeaa7;
                    padding: 10px;
                    text-align: center;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                }
                
                .warning-content h3 {
                    margin: 0 0 10px 0;
                    color: #856404;
                }
                
                .warning-content p {
                    margin: 5px 0;
                    color: #856404;
                }
                
                .warning-content button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            `;

            const styleElement = document.createElement('style');
            styleElement.textContent = warningStyles;
            document.head.appendChild(styleElement);

            document.body.insertBefore(warningDiv, document.body.firstChild);
        }
    }

    /**
     * 发送兼容性数据
     */
    sendCompatibilityData(report) {
        // 这里可以发送数据到分析服务
        if (window.gtag) {
            gtag('event', 'browser_compatibility', {
                browser_name: report.browser.name,
                browser_version: report.browser.version,
                mobile: report.browser.mobile,
                polyfills_loaded: report.loadedPolyfills.length
            });
        }
    }

    /**
     * 分发兼容性就绪事件
     */
    dispatchCompatibilityReady() {
        const event = new CustomEvent('compatibilityReady', {
            detail: {
                browser: this.browserInfo,
                supportedFeatures: this.supportedFeatures,
                polyfills: this.polyfills
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * 获取兼容性报告
     */
    getCompatibilityReport() {
        return {
            browser: this.browserInfo,
            supportedFeatures: this.supportedFeatures,
            loadedPolyfills: this.polyfills,
            warnings: this.warnings,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 检查特定功能是否支持
     */
    isFeatureSupported(feature) {
        return this.supportedFeatures[feature] || false;
    }

    /**
     * 获取浏览器信息
     */
    getBrowserInfo() {
        return this.browserInfo;
    }
}

// 创建全局浏览器兼容性管理器实例
window.BrowserCompatibility = new BrowserCompatibility();

// 导出浏览器兼容性类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserCompatibility;
}