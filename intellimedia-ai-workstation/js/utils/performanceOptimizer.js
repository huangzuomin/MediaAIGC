/**
 * 性能优化工具
 * 提供图片懒加载、资源预加载、代码分割等性能优化功能
 */

class PerformanceOptimizer {
  constructor() {
    this.lazyImages = new Set();
    this.preloadedResources = new Set();
    this.criticalResources = new Map();
    this.performanceMetrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0
    };
    
    this.init();
  }

  /**
   * 初始化性能优化器
   */
  init() {
    this.setupImageLazyLoading();
    this.preloadCriticalResources();
    this.setupResourceHints();
    this.optimizeCSS();
    this.setupCodeSplitting();
    this.monitorPerformance();
    this.setupCaching();
    
    console.log('性能优化器初始化完成');
  }

  /**
   * 设置图片懒加载
   */
  setupImageLazyLoading() {
    // 创建Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
          this.lazyImages.delete(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // 观察所有懒加载图片
    this.observeLazyImages(imageObserver);

    // 为动态添加的图片设置观察
    this.setupDynamicImageObserver(imageObserver);
  }

  /**
   * 观察懒加载图片
   * @param {IntersectionObserver} observer - 观察器实例
   */
  observeLazyImages(observer) {
    // 查找所有需要懒加载的图片
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      // 设置占位符
      if (!img.src && !img.dataset.src) {
        img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
      }
      
      // 添加懒加载类
      img.classList.add('lazy-loading');
      
      // 开始观察
      observer.observe(img);
      this.lazyImages.add(img);
    });

    console.log(`设置了 ${lazyImages.length} 张图片的懒加载`);
  }

  /**
   * 设置动态图片观察器
   * @param {IntersectionObserver} observer - 观察器实例
   */
  setupDynamicImageObserver(observer) {
    // 使用MutationObserver监听DOM变化
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新添加的图片
            const newImages = node.querySelectorAll ? 
              node.querySelectorAll('img[data-src], img[loading="lazy"]') : 
              (node.tagName === 'IMG' && (node.dataset.src || node.loading === 'lazy') ? [node] : []);
            
            newImages.forEach(img => {
              if (!this.lazyImages.has(img)) {
                observer.observe(img);
                this.lazyImages.add(img);
              }
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 加载图片
   * @param {HTMLImageElement} img - 图片元素
   */
  loadImage(img) {
    return new Promise((resolve, reject) => {
      const imageUrl = img.dataset.src || img.src;
      
      // 创建新的图片对象进行预加载
      const newImg = new Image();
      
      newImg.onload = () => {
        // 加载成功后更新原图片
        img.src = imageUrl;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        // 移除data-src属性
        if (img.dataset.src) {
          delete img.dataset.src;
        }
        
        // 添加淡入动画
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
        
        resolve(img);
      };
      
      newImg.onerror = () => {
        // 加载失败时使用备用图片
        img.src = this.generateErrorPlaceholder();
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
        reject(new Error(`图片加载失败: ${imageUrl}`));
      };
      
      // 开始加载
      newImg.src = imageUrl;
    });
  }

  /**
   * 生成占位符图片
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {string} 占位符数据URL
   */
  generatePlaceholder(width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 添加加载图标
    ctx.fillStyle = '#ccc';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('加载中...', width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
  }

  /**
   * 生成错误占位符
   * @returns {string} 错误占位符数据URL
   */
  generateErrorPlaceholder() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 200;
    
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 300, 200);
    
    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('图片加载失败', 150, 100);
    
    return canvas.toDataURL('image/png');
  }

  /**
   * 预加载关键资源
   */
  preloadCriticalResources() {
    const criticalResources = [
      { href: 'assets/styles.css', as: 'style', type: 'text/css' },
      { href: 'assets/icons.svg', as: 'image', type: 'image/svg+xml' },
      { href: 'js/app.js', as: 'script', type: 'text/javascript' },
      { href: 'assets/hero-bg.webp', as: 'image', type: 'image/webp' },
      { href: 'assets/logo.webp', as: 'image', type: 'image/webp' }
    ];

    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });

    console.log(`预加载了 ${criticalResources.length} 个关键资源`);
  }

  /**
   * 预加载单个资源
   * @param {Object} resource - 资源配置
   */
  preloadResource(resource) {
    if (this.preloadedResources.has(resource.href)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) {
      link.type = resource.type;
    }
    
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }

    // 添加加载事件监听
    link.onload = () => {
      console.log(`资源预加载完成: ${resource.href}`);
      this.criticalResources.set(resource.href, {
        ...resource,
        loaded: true,
        loadTime: performance.now()
      });
    };

    link.onerror = () => {
      console.warn(`资源预加载失败: ${resource.href}`);
    };

    document.head.appendChild(link);
    this.preloadedResources.add(resource.href);
  }

  /**
   * 设置资源提示
   */
  setupResourceHints() {
    // DNS预取
    const dnsPrefetchDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.jsdelivr.net',
      'unpkg.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // 预连接重要域名
    const preconnectDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    console.log('资源提示设置完成');
  }

  /**
   * 优化CSS
   */
  optimizeCSS() {
    // 内联关键CSS
    this.inlineCriticalCSS();
    
    // 异步加载非关键CSS
    this.loadNonCriticalCSS();
    
    // 移除未使用的CSS
    this.removeUnusedCSS();
  }

  /**
   * 内联关键CSS
   */
  inlineCriticalCSS() {
    const criticalCSS = `
      /* 关键CSS - 首屏渲染必需 */
      body { 
        margin: 0; 
        font-family: 'Source Han Sans CN', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .hero-section {
        min-height: 100vh;
        background: linear-gradient(135deg, #003366 0%, #004080 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .btn-primary {
        background: #D4AF37;
        color: #fff;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn-primary:hover {
        background: #B8941F;
        transform: translateY(-2px);
      }
      
      /* 懒加载图片样式 */
      .lazy-loading {
        filter: blur(5px);
        transition: filter 0.3s ease;
      }
      
      .lazy-loaded {
        filter: none;
      }
      
      /* 加载动画 */
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .loading {
        animation: pulse 1.5s ease-in-out infinite;
      }
    `;

    // 创建style标签并插入关键CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);

    console.log('关键CSS内联完成');
  }

  /**
   * 异步加载非关键CSS
   */
  loadNonCriticalCSS() {
    const nonCriticalCSS = [
      'assets/animations.css',
      'assets/components.css',
      'assets/responsive.css'
    ];

    nonCriticalCSS.forEach(href => {
      this.loadCSSAsync(href);
    });
  }

  /**
   * 异步加载CSS文件
   * @param {string} href - CSS文件路径
   */
  loadCSSAsync(href) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    
    link.onload = () => {
      link.rel = 'stylesheet';
      console.log(`非关键CSS加载完成: ${href}`);
    };

    document.head.appendChild(link);
  }

  /**
   * 移除未使用的CSS
   */
  removeUnusedCSS() {
    // 这里可以集成PurgeCSS或类似工具
    // 现在只是记录日志
    console.log('CSS优化：移除未使用的样式规则');
    
    // 实际实现中，可以分析DOM并移除未使用的CSS规则
    this.analyzeUsedCSS();
  }

  /**
   * 分析已使用的CSS
   */
  analyzeUsedCSS() {
    const usedClasses = new Set();
    const usedIds = new Set();
    
    // 收集所有使用的类名和ID
    document.querySelectorAll('*').forEach(element => {
      if (element.className) {
        element.className.split(' ').forEach(className => {
          if (className.trim()) {
            usedClasses.add(className.trim());
          }
        });
      }
      
      if (element.id) {
        usedIds.add(element.id);
      }
    });

    console.log(`发现 ${usedClasses.size} 个使用的CSS类`);
    console.log(`发现 ${usedIds.size} 个使用的CSS ID`);
    
    return { usedClasses, usedIds };
  }

  /**
   * 设置代码分割
   */
  setupCodeSplitting() {
    // 动态导入非关键JavaScript
    this.loadNonCriticalJS();
    
    // 设置模块懒加载
    this.setupModuleLazyLoading();
  }

  /**
   * 加载非关键JavaScript
   */
  loadNonCriticalJS() {
    const nonCriticalJS = [
      'js/utils/analytics.js',
      'js/utils/socialSharing.js',
      'js/utils/chatWidget.js'
    ];

    // 延迟加载非关键脚本
    setTimeout(() => {
      nonCriticalJS.forEach(src => {
        this.loadScriptAsync(src);
      });
    }, 2000);
  }

  /**
   * 异步加载脚本
   * @param {string} src - 脚本路径
   */
  loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log(`非关键脚本加载完成: ${src}`);
        resolve(script);
      };
      
      script.onerror = () => {
        console.warn(`脚本加载失败: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 设置模块懒加载
   */
  setupModuleLazyLoading() {
    // 使用Intersection Observer实现模块懒加载
    const moduleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const moduleName = element.dataset.module;
          
          if (moduleName) {
            this.loadModule(moduleName);
            moduleObserver.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    // 观察需要懒加载模块的元素
    document.querySelectorAll('[data-module]').forEach(element => {
      moduleObserver.observe(element);
    });
  }

  /**
   * 动态加载模块
   * @param {string} moduleName - 模块名称
   */
  async loadModule(moduleName) {
    try {
      const moduleMap = {
        'contact-form': () => import('./contactForm.js'),
        'video-player': () => import('./videoPlayer.js'),
        'chart-component': () => import('./chartComponent.js')
      };

      if (moduleMap[moduleName]) {
        const module = await moduleMap[moduleName]();
        console.log(`模块加载完成: ${moduleName}`);
        return module;
      }
    } catch (error) {
      console.error(`模块加载失败: ${moduleName}`, error);
    }
  }

  /**
   * 监控性能
   */
  monitorPerformance() {
    // 监控页面加载性能
    this.trackLoadPerformance();
    
    // 监控Core Web Vitals
    this.trackCoreWebVitals();
    
    // 监控资源加载
    this.trackResourceLoading();
    
    // 设置性能预算
    this.setupPerformanceBudget();
  }

  /**
   * 跟踪加载性能
   */
  trackLoadPerformance() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.performanceMetrics.loadTime = loadTime;
      
      console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
      
      // 发送性能数据
      this.sendPerformanceData('page_load', { loadTime });
      
      // 检查性能预算
      if (loadTime > 3000) {
        console.warn('页面加载时间超过3秒，需要优化');
        this.triggerPerformanceAlert('slow_load', { loadTime });
      }
    });
  }

  /**
   * 跟踪Core Web Vitals
   */
  trackCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      this.observePerformanceEntry('paint', (entries) => {
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.performanceMetrics.firstContentfulPaint = fcpEntry.startTime;
          console.log(`FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
          this.sendPerformanceData('fcp', { value: fcpEntry.startTime });
        }
      });

      // Largest Contentful Paint (LCP)
      this.observePerformanceEntry('largest-contentful-paint', (entries) => {
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
        console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        this.sendPerformanceData('lcp', { value: lastEntry.startTime });
        
        if (lastEntry.startTime > 2500) {
          this.triggerPerformanceAlert('slow_lcp', { value: lastEntry.startTime });
        }
      });

      // First Input Delay (FID)
      this.observePerformanceEntry('first-input', (entries) => {
        entries.forEach(entry => {
          const fid = entry.processingStart - entry.startTime;
          this.performanceMetrics.firstInputDelay = fid;
          console.log(`FID: ${fid.toFixed(2)}ms`);
          this.sendPerformanceData('fid', { value: fid });
          
          if (fid > 100) {
            this.triggerPerformanceAlert('slow_fid', { value: fid });
          }
        });
      });

      // Cumulative Layout Shift (CLS)
      this.observePerformanceEntry('layout-shift', (entries) => {
        let clsValue = 0;
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.performanceMetrics.cumulativeLayoutShift = clsValue;
        console.log(`CLS: ${clsValue.toFixed(3)}`);
        this.sendPerformanceData('cls', { value: clsValue });
        
        if (clsValue > 0.1) {
          this.triggerPerformanceAlert('high_cls', { value: clsValue });
        }
      });
    }
  }

  /**
   * 观察性能条目
   * @param {string} entryType - 条目类型
   * @param {Function} callback - 回调函数
   */
  observePerformanceEntry(entryType, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`无法观察性能条目: ${entryType}`, error);
    }
  }

  /**
   * 跟踪资源加载
   */
  trackResourceLoading() {
    // 监控资源加载时间
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime;
        
        if (loadTime > 1000) {
          console.warn(`资源加载缓慢: ${resource.name} (${loadTime.toFixed(2)}ms)`);
        }
        
        // 记录不同类型资源的加载时间
        this.sendPerformanceData('resource_load', {
          name: resource.name,
          type: this.getResourceType(resource.name),
          loadTime: loadTime,
          size: resource.transferSize
        });
      });
    });
  }

  /**
   * 获取资源类型
   * @param {string} url - 资源URL
   * @returns {string} 资源类型
   */
  getResourceType(url) {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'javascript';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'other';
  }

  /**
   * 设置性能预算
   */
  setupPerformanceBudget() {
    this.performanceBudget = {
      loadTime: 3000,        // 页面加载时间 < 3秒
      fcp: 1800,            // FCP < 1.8秒
      lcp: 2500,            // LCP < 2.5秒
      fid: 100,             // FID < 100ms
      cls: 0.1,             // CLS < 0.1
      totalSize: 2000000,   // 总资源大小 < 2MB
      imageSize: 1000000,   // 图片总大小 < 1MB
      jsSize: 500000,       // JS总大小 < 500KB
      cssSize: 200000       // CSS总大小 < 200KB
    };

    console.log('性能预算设置完成', this.performanceBudget);
  }

  /**
   * 设置缓存策略
   */
  setupCaching() {
    // 设置Service Worker缓存
    this.setupServiceWorkerCache();
    
    // 设置浏览器缓存提示
    this.setupBrowserCacheHints();
    
    // 设置本地存储缓存
    this.setupLocalStorageCache();
  }

  /**
   * 设置Service Worker缓存
   */
  setupServiceWorkerCache() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker注册成功:', registration);
          
          // 监听更新
          registration.addEventListener('updatefound', () => {
            console.log('发现Service Worker更新');
          });
        })
        .catch(error => {
          console.warn('Service Worker注册失败:', error);
        });
    }
  }

  /**
   * 设置浏览器缓存提示
   */
  setupBrowserCacheHints() {
    // 这些通常在服务器端设置，这里只是记录建议
    const cacheConfig = {
      'text/css': 'max-age=31536000', // CSS文件缓存1年
      'application/javascript': 'max-age=31536000', // JS文件缓存1年
      'image/': 'max-age=2592000', // 图片缓存30天
      'font/': 'max-age=31536000', // 字体缓存1年
      'text/html': 'max-age=3600' // HTML缓存1小时
    };

    console.log('建议的缓存配置:', cacheConfig);
  }

  /**
   * 设置本地存储缓存
   */
  setupLocalStorageCache() {
    // 缓存一些静态数据
    const cacheKey = 'intellimedia_cache_v1';
    const cacheData = {
      version: '1.0.0',
      timestamp: Date.now(),
      config: {
        apiEndpoint: '/api',
        features: ['lazy-loading', 'preloading', 'caching']
      }
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('本地存储缓存设置完成');
    } catch (error) {
      console.warn('本地存储缓存设置失败:', error);
    }
  }

  /**
   * 发送性能数据
   * @param {string} metric - 指标名称
   * @param {Object} data - 数据
   */
  sendPerformanceData(metric, data) {
    // 这里可以发送到分析服务
    const performanceData = {
      metric,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('性能数据:', performanceData);
    
    // 实际应用中可以发送到服务器
    // fetch('/api/performance', {
    //   method: 'POST',
    //   body: JSON.stringify(performanceData)
    // });
  }

  /**
   * 触发性能警报
   * @param {string} alertType - 警报类型
   * @param {Object} data - 数据
   */
  triggerPerformanceAlert(alertType, data) {
    console.warn(`性能警报: ${alertType}`, data);
    
    // 可以发送到监控系统
    const alert = {
      type: alertType,
      data,
      timestamp: Date.now(),
      severity: this.getAlertSeverity(alertType)
    };

    // 触发自定义事件
    const alertEvent = new CustomEvent('performanceAlert', {
      detail: alert
    });
    document.dispatchEvent(alertEvent);
  }

  /**
   * 获取警报严重程度
   * @param {string} alertType - 警报类型
   * @returns {string} 严重程度
   */
  getAlertSeverity(alertType) {
    const severityMap = {
      'slow_load': 'high',
      'slow_lcp': 'high',
      'slow_fid': 'medium',
      'high_cls': 'medium'
    };

    return severityMap[alertType] || 'low';
  }

  /**
   * 获取性能报告
   * @returns {Object} 性能报告
   */
  getPerformanceReport() {
    return {
      metrics: this.performanceMetrics,
      budget: this.performanceBudget,
      resources: {
        preloaded: this.preloadedResources.size,
        lazyImages: this.lazyImages.size,
        critical: this.criticalResources.size
      },
      timestamp: Date.now()
    };
  }

  /**
   * 优化图片格式
   * @param {HTMLImageElement} img - 图片元素
   */
  optimizeImageFormat(img) {
    // 检查浏览器支持的格式
    const supportsWebP = this.supportsWebP();
    const supportsAVIF = this.supportsAVIF();
    
    const originalSrc = img.src || img.dataset.src;
    
    if (supportsAVIF && !originalSrc.includes('.avif')) {
      // 尝试AVIF格式
      const avifSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      this.tryImageFormat(img, avifSrc, originalSrc);
    } else if (supportsWebP && !originalSrc.includes('.webp')) {
      // 尝试WebP格式
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      this.tryImageFormat(img, webpSrc, originalSrc);
    }
  }

  /**
   * 尝试图片格式
   * @param {HTMLImageElement} img - 图片元素
   * @param {string} newSrc - 新格式图片路径
   * @param {string} fallbackSrc - 备用图片路径
   */
  tryImageFormat(img, newSrc, fallbackSrc) {
    const testImg = new Image();
    testImg.onload = () => {
      img.src = newSrc;
    };
    testImg.onerror = () => {
      img.src = fallbackSrc;
    };
    testImg.src = newSrc;
  }

  /**
   * 检查WebP支持
   * @returns {boolean} 是否支持WebP
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * 检查AVIF支持
   * @returns {boolean} 是否支持AVIF
   */
  supportsAVIF() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * 销毁性能优化器
   */
  destroy() {
    this.lazyImages.clear();
    this.preloadedResources.clear();
    this.criticalResources.clear();
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
} else {
  window.PerformanceOptimizer = PerformanceOptimizer;
}