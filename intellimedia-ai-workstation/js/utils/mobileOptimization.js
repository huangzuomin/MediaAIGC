/**
 * 移动端优化工具
 * 提供移动设备检测、触摸优化、性能优化等功能
 */

class MobileOptimization {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isTablet = this.detectTablet();
    this.isTouchDevice = this.detectTouch();
    this.orientation = this.getOrientation();
    this.viewport = this.getViewport();
    
    this.init();
  }

  /**
   * 初始化移动端优化
   */
  init() {
    this.setupViewport();
    this.setupTouchOptimization();
    this.setupOrientationHandling();
    this.setupPerformanceOptimization();
    this.setupAccessibilityEnhancements();
    
    // 添加设备类型到body类名
    this.addDeviceClasses();
    
    console.log('移动端优化初始化完成', {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isTouchDevice: this.isTouchDevice,
      orientation: this.orientation,
      viewport: this.viewport
    });
  }

  /**
   * 检测是否为移动设备
   * @returns {boolean} 是否为移动设备
   */
  detectMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'android', 'webos', 'iphone', 'ipad', 'ipod', 
      'blackberry', 'windows phone', 'mobile'
    ];
    
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
           window.innerWidth <= 768;
  }

  /**
   * 检测是否为平板设备
   * @returns {boolean} 是否为平板设备
   */
  detectTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIpad = userAgent.includes('ipad');
    const isAndroidTablet = userAgent.includes('android') && !userAgent.includes('mobile');
    const isLargeScreen = window.innerWidth >= 768 && window.innerWidth <= 1024;
    
    return isIpad || isAndroidTablet || (this.isMobile && isLargeScreen);
  }

  /**
   * 检测是否为触摸设备
   * @returns {boolean} 是否为触摸设备
   */
  detectTouch() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  }

  /**
   * 获取设备方向
   * @returns {string} 设备方向
   */
  getOrientation() {
    if (window.innerHeight > window.innerWidth) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  }

  /**
   * 获取视口信息
   * @returns {Object} 视口信息
   */
  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1
    };
  }

  /**
   * 设置视口优化
   */
  setupViewport() {
    // 防止iOS Safari缩放
    if (this.isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    // 处理iOS Safari地址栏高度变化
    if (navigator.userAgent.includes('Safari') && this.isMobile) {
      this.handleSafariViewportHeight();
    }
  }

  /**
   * 处理Safari视口高度
   */
  handleSafariViewportHeight() {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', Utils.debounce(setViewportHeight, 100));
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 500);
    });
  }

  /**
   * 设置触摸优化
   */
  setupTouchOptimization() {
    if (!this.isTouchDevice) return;

    // 添加触摸反馈
    this.addTouchFeedback();
    
    // 优化滚动性能
    this.optimizeScrolling();
    
    // 防止双击缩放
    this.preventDoubleClickZoom();
    
    // 优化触摸延迟
    this.reduceTouchDelay();
  }

  /**
   * 添加触摸反馈
   */
  addTouchFeedback() {
    const touchElements = document.querySelectorAll('.btn, .card, .value-tag, .capability-tag');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', (e) => {
        element.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', (e) => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
      
      element.addEventListener('touchcancel', (e) => {
        element.classList.remove('touch-active');
      }, { passive: true });
    });

    // 添加触摸反馈样式
    const style = document.createElement('style');
    style.textContent = `
      .touch-active {
        transform: scale(0.98) !important;
        opacity: 0.8 !important;
        transition: all 0.1s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 优化滚动性能
   */
  optimizeScrolling() {
    // 启用硬件加速滚动
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // 优化滚动容器
    const scrollContainers = document.querySelectorAll('.container, section');
    scrollContainers.forEach(container => {
      container.style.webkitOverflowScrolling = 'touch';
      container.style.overflowScrolling = 'touch';
    });
  }

  /**
   * 防止双击缩放
   */
  preventDoubleClickZoom() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }

  /**
   * 减少触摸延迟
   */
  reduceTouchDelay() {
    // 使用FastClick或类似的解决方案
    const clickableElements = document.querySelectorAll('.btn, a, [onclick]');
    
    clickableElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.style.cursor = 'pointer';
      }, { passive: true });
    });
  }

  /**
   * 设置方向变化处理
   */
  setupOrientationHandling() {
    const handleOrientationChange = () => {
      setTimeout(() => {
        this.orientation = this.getOrientation();
        this.viewport = this.getViewport();
        
        // 更新body类名
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(this.orientation);
        
        // 触发自定义事件
        const event = new CustomEvent('orientationChanged', {
          detail: {
            orientation: this.orientation,
            viewport: this.viewport
          }
        });
        document.dispatchEvent(event);
        
        // 重新计算布局
        this.recalculateLayout();
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', Utils.debounce(handleOrientationChange, 250));
  }

  /**
   * 重新计算布局
   */
  recalculateLayout() {
    // 重新计算容器高度
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && this.orientation === 'landscape' && this.isMobile) {
      heroSection.style.minHeight = '90vh';
    } else if (heroSection) {
      heroSection.style.minHeight = '100vh';
    }

    // 调整字体大小
    if (this.orientation === 'landscape' && this.isMobile) {
      document.body.classList.add('landscape-mobile');
    } else {
      document.body.classList.remove('landscape-mobile');
    }
  }

  /**
   * 设置性能优化
   */
  setupPerformanceOptimization() {
    if (!this.isMobile) return;

    // 延迟加载非关键资源
    this.lazyLoadResources();
    
    // 优化动画性能
    this.optimizeAnimations();
    
    // 减少重绘和回流
    this.optimizeRendering();
  }

  /**
   * 延迟加载资源
   */
  lazyLoadResources() {
    // 延迟加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * 优化动画性能
   */
  optimizeAnimations() {
    // 在移动设备上减少动画
    if (this.isMobile) {
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          .tech-line {
            animation-duration: 8s !important;
          }
          
          .fade-in, .slide-up {
            transition-duration: 0.2s !important;
          }
          
          .card:hover, .btn:hover {
            transition-duration: 0.1s !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 优化渲染性能
   */
  optimizeRendering() {
    // 使用transform代替改变位置属性
    const animatedElements = document.querySelectorAll('.card, .btn');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });

    // 在动画结束后移除will-change
    document.addEventListener('transitionend', (e) => {
      if (e.target.style.willChange) {
        e.target.style.willChange = 'auto';
      }
    });
  }

  /**
   * 设置无障碍增强
   */
  setupAccessibilityEnhancements() {
    if (!this.isTouchDevice) return;

    // 增强焦点管理
    this.enhanceFocusManagement();
    
    // 添加触摸辅助
    this.addTouchAssistance();
  }

  /**
   * 增强焦点管理
   */
  enhanceFocusManagement() {
    // 为触摸设备优化焦点样式
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) and (pointer: coarse) {
        .btn:focus,
        .form-input:focus,
        .form-textarea:focus {
          outline: 3px solid var(--accent-gold);
          outline-offset: 2px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 添加触摸辅助
   */
  addTouchAssistance() {
    // 为小目标添加触摸辅助
    const smallTargets = document.querySelectorAll('.value-tag, .capability-tag');
    smallTargets.forEach(target => {
      if (target.offsetHeight < 44 || target.offsetWidth < 44) {
        target.style.minHeight = '44px';
        target.style.minWidth = '44px';
        target.style.display = 'inline-flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
      }
    });
  }

  /**
   * 添加设备类型到body
   */
  addDeviceClasses() {
    const classes = [];
    
    if (this.isMobile) classes.push('mobile');
    if (this.isTablet) classes.push('tablet');
    if (this.isTouchDevice) classes.push('touch');
    classes.push(this.orientation);
    
    document.body.classList.add(...classes);
  }

  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isTouchDevice: this.isTouchDevice,
      orientation: this.orientation,
      viewport: this.viewport,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };
  }

  /**
   * 检查是否支持特定功能
   * @param {string} feature - 功能名称
   * @returns {boolean} 是否支持
   */
  supportsFeature(feature) {
    const features = {
      'touch': this.isTouchDevice,
      'orientation': 'orientation' in window,
      'devicemotion': 'DeviceMotionEvent' in window,
      'geolocation': 'geolocation' in navigator,
      'vibration': 'vibrate' in navigator,
      'fullscreen': document.fullscreenEnabled,
      'webgl': !!window.WebGLRenderingContext
    };
    
    return features[feature] || false;
  }

  /**
   * 销毁移动端优化
   */
  destroy() {
    // 移除事件监听器
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
    
    // 移除添加的样式
    const addedStyles = document.querySelectorAll('style[data-mobile-optimization]');
    addedStyles.forEach(style => style.remove());
    
    // 移除设备类名
    document.body.classList.remove('mobile', 'tablet', 'touch', 'portrait', 'landscape');
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileOptimization;
} else {
  window.MobileOptimization = MobileOptimization;
}