/**
 * 智媒AI工作站 - 主应用程序
 * 模块化架构和工具函数库
 */

// ===== 工具函数库 =====
const Utils = {
  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 限制时间（毫秒）
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 平滑滚动到指定元素
   * @param {string} selector - 目标元素选择器
   * @param {number} offset - 偏移量
   */
  smoothScrollTo(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  },

  /**
   * 检查元素是否在视口中
   * @param {Element} element - 要检查的元素
   * @param {number} threshold - 阈值（0-1）
   * @returns {boolean} 是否在视口中
   */
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return (vertInView && horInView);
  },

  /**
   * 格式化电话号码
   * @param {string} phone - 电话号码
   * @returns {string} 格式化后的电话号码
   */
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 深度克隆对象
   * @param {Object} obj - 要克隆的对象
   * @returns {Object} 克隆后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }
};

// ===== 动画控制器 =====
const AnimationController = {
  /**
   * 初始化滚动动画
   */
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  },

  /**
   * 添加悬浮效果
   * @param {string} selector - 元素选择器
   */
  addHoverEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-4px)';
        element.style.boxShadow = 'var(--shadow-xl)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = 'var(--shadow-md)';
      });
    });
  }
};

// ===== 表单处理器 =====
const FormHandler = {
  /**
   * 初始化表单处理
   */
  init() {
    this.setupFormValidation();
  },

  /**
   * 设置表单验证
   */
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    });
  },

  /**
   * 处理表单提交
   * @param {Event} event - 表单提交事件
   */
  handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // 基础验证
    if (!this.validateForm(form)) {
      return;
    }

    // 显示加载状态
    this.showLoadingState(form);

    // 模拟表单提交
    setTimeout(() => {
      this.showSuccessMessage(form);
      form.reset();
    }, 2000);
  },

  /**
   * 验证表单
   * @param {HTMLFormElement} form - 表单元素
   * @returns {boolean} 验证结果
   */
  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showFieldError(field, '此字段为必填项');
        isValid = false;
      } else {
        this.clearFieldError(field);
      }
    });

    return isValid;
  },

  /**
   * 显示字段错误
   * @param {HTMLElement} field - 字段元素
   * @param {string} message - 错误消息
   */
  showFieldError(field, message) {
    field.classList.add('error');
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  },

  /**
   * 清除字段错误
   * @param {HTMLElement} field - 字段元素
   */
  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  },

  /**
   * 显示加载状态
   * @param {HTMLFormElement} form - 表单元素
   */
  showLoadingState(form) {
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '提交中...';
    }
  },

  /**
   * 显示成功消息
   * @param {HTMLFormElement} form - 表单元素
   */
  showSuccessMessage(form) {
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = '提交成功';
      setTimeout(() => {
        submitButton.textContent = '预约演示';
      }, 3000);
    }
  }
};

// ===== 导航控制器 =====
const NavigationController = {
  /**
   * 初始化导航
   */
  init() {
    this.setupSmoothScrolling();
    this.setupScrollProgress();
  },

  /**
   * 设置平滑滚动
   */
  setupSmoothScrolling() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link) {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        Utils.smoothScrollTo(targetId, 80);
      }
    });
  },

  /**
   * 设置滚动进度指示器
   */
  setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--accent-gold);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    const updateProgress = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, 10);

    window.addEventListener('scroll', updateProgress);
  }
};

// ===== 性能监控器 =====
const PerformanceMonitor = {
  /**
   * 初始化性能监控
   */
  init() {
    this.trackPageLoad();
    this.trackErrors();
  },

  /**
   * 跟踪页面加载性能
   */
  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
      
      if (loadTime > 3000) {
        console.warn('页面加载时间超过3秒，需要优化');
      }
    });
  },

  /**
   * 跟踪JavaScript错误
   */
  trackErrors() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript错误:', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
    });
  }
};

// ===== 主应用程序类 =====
class IntelliMediaApp {
  constructor() {
    this.components = new Map();
    this.isInitialized = false;
  }

  /**
   * 初始化应用程序
   */
  init() {
    if (this.isInitialized) return;

    try {
      // 初始化各个模块
      AnimationController.initScrollAnimations();
      FormHandler.init();
      NavigationController.init();
      PerformanceMonitor.init();

      // 初始化错误处理和监控系统
      if (window.ErrorHandler) {
        this.errorHandler = window.ErrorHandler;
        this.registerComponent('errorHandler', this.errorHandler);
        console.log('错误处理系统已初始化');
      }

      // 初始化用户行为跟踪系统
      if (window.BehaviorTracker) {
        this.behaviorTracker = window.BehaviorTracker;
        this.registerComponent('behaviorTracker', this.behaviorTracker);
        console.log('用户行为跟踪系统已初始化');
      }

      // 初始化性能监控系统
      if (window.PerformanceMonitor) {
        this.performanceMonitor = window.PerformanceMonitor;
        this.registerComponent('performanceMonitor', this.performanceMonitor);
        console.log('性能监控系统已初始化');
      }

      // 初始化监控仪表盘
      if (window.MonitoringDashboard) {
        this.monitoringDashboard = window.MonitoringDashboard;
        this.registerComponent('monitoringDashboard', this.monitoringDashboard);
        console.log('监控仪表盘已初始化');
      }

      // 初始化移动端优化
      if (window.MobileOptimization) {
        this.mobileOptimization = new window.MobileOptimization();
        this.registerComponent('mobileOptimization', this.mobileOptimization);
      }

      // 初始化用户体验增强
      if (window.UXEnhancements) {
        this.uxEnhancements = new window.UXEnhancements();
        this.registerComponent('uxEnhancements', this.uxEnhancements);
      }

      // 初始化页面动画
      if (window.PageAnimations) {
        this.pageAnimations = new window.PageAnimations();
        this.registerComponent('pageAnimations', this.pageAnimations);
      }

      // 初始化表单处理器
      if (window.FormHandler) {
        this.formHandler = window.FormHandler;
        this.registerComponent('formHandler', this.formHandler);
      }

      // 初始化CTA管理器
      if (window.CTAManager) {
        this.ctaManager = new window.CTAManager();
        this.registerComponent('ctaManager', this.ctaManager);
      }

      // 初始化SEO管理器
      if (window.SEOManager) {
        this.seoManager = new window.SEOManager();
        this.registerComponent('seoManager', this.seoManager);
      }

      // 初始化SEO验证器
      if (window.SEOValidator) {
        this.seoValidator = new window.SEOValidator();
        this.registerComponent('seoValidator', this.seoValidator);
      }

      // 初始化元标签管理器
      if (window.MetaTagsManager) {
        this.metaTagsManager = new window.MetaTagsManager();
        this.registerComponent('metaTagsManager', this.metaTagsManager);
      }

      // 初始化站点地图生成器
      if (window.SitemapGenerator) {
        this.sitemapGenerator = new window.SitemapGenerator();
        this.registerComponent('sitemapGenerator', this.sitemapGenerator);
      }

      // 初始化可访问性管理器
      if (window.AccessibilityManager) {
        this.accessibilityManager = window.AccessibilityManager;
        this.registerComponent('accessibilityManager', this.accessibilityManager);
        console.log('可访问性管理器已初始化');
      }

      // 初始化浏览器兼容性管理器
      if (window.BrowserCompatibility) {
        this.browserCompatibility = window.BrowserCompatibility;
        this.registerComponent('browserCompatibility', this.browserCompatibility);
        console.log('浏览器兼容性管理器已初始化');
      }

      // 初始化页面组件
      this.initializeComponents();

      // 添加卡片悬浮效果
      AnimationController.addHoverEffect('.card');

      // 设置CTA按钮点击事件
      this.setupCTAButtons();

      // 设置电话点击事件
      this.setupPhoneLinks();

      // 设置演示预约事件监听
      this.setupDemoBookingListener();

      this.isInitialized = true;
      console.log('智媒AI工作站应用程序初始化完成');
    } catch (error) {
      console.error('应用程序初始化失败:', error);
    }
  }

  /**
   * 初始化页面组件
   */
  initializeComponents() {
    // 初始化Hero Section
    const heroContainer = document.getElementById('hero-container');
    if (heroContainer && window.HeroSection) {
      const heroSection = new window.HeroSection(heroContainer);
      this.registerComponent('heroSection', heroSection);
    }

    // 初始化Challenge Section
    const challengeContainer = document.getElementById('challenge-container');
    if (challengeContainer && window.ChallengeSection) {
      const challengeSection = new window.ChallengeSection(challengeContainer);
      this.registerComponent('challengeSection', challengeSection);
    }

    // 初始化Foundation Section
    const foundationContainer = document.getElementById('foundation-container');
    if (foundationContainer && window.FoundationSection) {
      const foundationSection = new window.FoundationSection(foundationContainer);
      this.registerComponent('foundationSection', foundationSection);
    }

    // 初始化Agents Section
    const agentsContainer = document.getElementById('agents-container');
    if (agentsContainer && window.AgentsSection) {
      const agentsSection = new window.AgentsSection(agentsContainer);
      this.registerComponent('agentsSection', agentsSection);
    }

    // 初始化Pricing Section
    const pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer && window.PricingSection) {
      const pricingSection = new window.PricingSection(pricingContainer);
      this.registerComponent('pricingSection', pricingSection);
    }

    // 初始化Final CTA Section
    const finalCTAContainer = document.getElementById('final-cta-container');
    if (finalCTAContainer && window.FinalCTASection) {
      const finalCTASection = new window.FinalCTASection(finalCTAContainer);
      this.registerComponent('finalCTASection', finalCTASection);
    }
  }

  /**
   * 设置CTA按钮事件
   */
  setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        // 添加点击动画效果
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);

        // 如果是演示预约按钮，显示表单
        if (button.textContent.includes('预约') || button.textContent.includes('演示')) {
          this.showDemoForm();
        }
      });
    });
  }

  /**
   * 设置电话链接
   */
  setupPhoneLinks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        console.log('用户点击了电话链接');
      });
    });
  }

  /**
   * 设置演示预约事件监听
   */
  setupDemoBookingListener() {
    document.addEventListener('demoBookingRequested', (event) => {
      console.log('演示预约请求:', event.detail);
      this.showDemoForm();
    });

    // 挑战卡片事件监听
    document.addEventListener('challengeCardClick', (event) => {
      console.log('挑战卡片点击:', event.detail);
      this.handleChallengeCardClick(event.detail);
    });

    document.addEventListener('challengeCardHover', (event) => {
      console.log('挑战卡片悬浮:', event.detail);
    });

    // 基座卡片事件监听
    document.addEventListener('foundationCardClick', (event) => {
      console.log('基座卡片点击:', event.detail);
      this.handleFoundationCardClick(event.detail);
    });

    document.addEventListener('foundationCardHover', (event) => {
      console.log('基座卡片悬浮:', event.detail);
    });

    // 智能体事件监听
    document.addEventListener('agentClick', (event) => {
      console.log('智能体点击:', event.detail);
      this.handleAgentClick(event.detail);
    });

    document.addEventListener('agentHover', (event) => {
      console.log('智能体悬浮:', event.detail);
    });

    document.addEventListener('capabilityClick', (event) => {
      console.log('能力标签点击:', event.detail);
      this.handleCapabilityClick(event.detail);
    });

    // 价格方案事件监听
    document.addEventListener('pricingCTAClick', (event) => {
      console.log('价格方案CTA点击:', event.detail);
      this.handlePricingCTAClick(event.detail);
    });

    document.addEventListener('pricingCardHover', (event) => {
      console.log('价格卡片悬浮:', event.detail);
    });

    // 最终CTA事件监听
    document.addEventListener('finalCTAClick', (event) => {
      console.log('最终CTA点击:', event.detail);
      this.handleFinalCTAClick(event.detail);
    });

    document.addEventListener('demoFormSubmit', (event) => {
      console.log('演示表单提交:', event.detail);
      this.handleDemoFormSubmit(event.detail);
    });

    document.addEventListener('phoneClick', (event) => {
      console.log('电话点击:', event.detail);
      this.handlePhoneClick(event.detail);
    });

    // 移动端优化事件监听
    document.addEventListener('orientationChanged', (event) => {
      console.log('设备方向改变:', event.detail);
      this.handleOrientationChange(event.detail);
    });
  }

  /**
   * 处理挑战卡片点击
   * @param {Object} detail - 事件详情
   */
  handleChallengeCardClick(detail) {
    // 可以根据不同的挑战类型执行不同的操作
    const { challengeId, challenge } = detail;
    
    // 例如：跳转到对应的解决方案部分
    switch (challengeId) {
      case 'content-production':
        Utils.smoothScrollTo('#agents', 80);
        break;
      case 'repetitive-work':
        Utils.smoothScrollTo('#foundation', 80);
        break;
      case 'ai-adoption':
        Utils.smoothScrollTo('#pricing', 80);
        break;
      default:
        Utils.smoothScrollTo('#foundation', 80);
    }
  }

  /**
   * 处理智能体点击
   * @param {Object} detail - 事件详情
   */
  handleAgentClick(detail) {
    const { agentId, agent } = detail;
    
    console.log(`点击了智能体: ${agent.name}`);
    
    // 可以根据不同的智能体执行不同的操作
    // 例如：显示更多详情、跳转到相关功能等
    
    // 默认跳转到订阅方案
    Utils.smoothScrollTo('#pricing', 80);
  }

  /**
   * 处理能力标签点击
   * @param {Object} detail - 事件详情
   */
  handleCapabilityClick(detail) {
    const { capability } = detail;
    
    console.log(`点击了能力标签: ${capability}`);
    
    // 可以根据能力类型提供更多信息
    // 例如：显示相关智能体、功能介绍等
    
    // 获取智能体组件实例
    const agentsSection = this.getComponent('agentsSection');
    if (agentsSection) {
      const relatedAgents = agentsSection.getAgentsByCapability(capability);
      console.log(`相关智能体:`, relatedAgents);
    }
  }

  /**
   * 处理价格方案CTA点击
   * @param {Object} detail - 事件详情
   */
  handlePricingCTAClick(detail) {
    const { action, planId, plan } = detail;
    
    console.log(`价格方案CTA点击: ${plan.name} - ${action}`);
    
    // 根据不同的行动类型执行不同的操作
    switch (action) {
      case 'subscribe-basic':
        // 基础版订阅 - 可以显示订阅表单或跳转到支付页面
        this.trackConversion('basic_subscription_intent');
        break;
      case 'consult-professional':
        // 专业版咨询 - 跳转到咨询表单
        this.trackConversion('professional_consultation_intent');
        break;
      case 'contact-enterprise':
        // 旗舰版联系 - 跳转到联系表单
        this.trackConversion('enterprise_contact_intent');
        break;
    }
    
    // 所有CTA最终都跳转到最终行动号召区域
    Utils.smoothScrollTo('#final-cta', 80);
  }

  /**
   * 跟踪转化事件
   * @param {string} eventType - 事件类型
   */
  trackConversion(eventType) {
    // 这里可以集成分析工具，如Google Analytics、百度统计等
    console.log(`转化事件跟踪: ${eventType}`);
    
    // 触发自定义转化事件
    const conversionEvent = new CustomEvent('conversionTracked', {
      detail: {
        eventType,
        timestamp: new Date().toISOString(),
        page: 'pricing'
      }
    });
    document.dispatchEvent(conversionEvent);
  }

  /**
   * 处理最终CTA点击
   * @param {Object} detail - 事件详情
   */
  handleFinalCTAClick(detail) {
    const { action, formVisible } = detail;
    
    console.log(`最终CTA点击: ${action}, 表单可见: ${formVisible}`);
    
    // 跟踪CTA点击事件
    this.trackConversion('final_cta_click');
    
    if (action === 'show-demo-form' && formVisible) {
      // 表单显示时，跟踪表单展示事件
      this.trackConversion('demo_form_shown');
    }
  }

  /**
   * 处理演示表单提交
   * @param {Object} detail - 事件详情
   */
  handleDemoFormSubmit(detail) {
    const { formData } = detail;
    
    console.log('演示表单提交:', formData);
    
    // 跟踪表单提交事件
    this.trackConversion('demo_form_submitted');
    
    // 这里可以将数据发送到后端API
    // this.submitDemoRequest(formData);
    
    // 显示成功消息或跳转到感谢页面
    this.showSubmissionSuccess(formData);
  }

  /**
   * 处理电话点击
   * @param {Object} detail - 事件详情
   */
  handlePhoneClick(detail) {
    const { phone } = detail;
    
    console.log(`电话点击: ${phone}`);
    
    // 跟踪电话点击事件
    this.trackConversion('phone_click');
  }

  /**
   * 显示提交成功消息
   * @param {Object} formData - 表单数据
   */
  showSubmissionSuccess(formData) {
    // 显示成功通知
    const uxEnhancements = this.getComponent('uxEnhancements');
    if (uxEnhancements) {
      uxEnhancements.showNotification(
        '预约成功！',
        `感谢 ${formData.name} 的预约申请，我们将在24小时内联系您！`,
        'success',
        8000
      );
    }
    
    console.log(`感谢 ${formData.name} 的预约申请，我们将尽快联系您！`);
    
    // 触发成功事件
    const successEvent = new CustomEvent('demoBookingSuccess', {
      detail: {
        formData,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(successEvent);
  }

  /**
   * 处理设备方向变化
   * @param {Object} detail - 方向变化详情
   */
  handleOrientationChange(detail) {
    const { orientation, viewport } = detail;
    
    console.log(`设备方向变化: ${orientation}`, viewport);
    
    // 重新初始化某些组件以适应新的布局
    this.reinitializeComponentsForOrientation(orientation);
    
    // 调整动画和交互
    this.adjustInteractionsForOrientation(orientation);
  }

  /**
   * 为新方向重新初始化组件
   * @param {string} orientation - 设备方向
   */
  reinitializeComponentsForOrientation(orientation) {
    // 重新计算Hero Section的高度
    const heroSection = this.getComponent('heroSection');
    if (heroSection && orientation === 'landscape') {
      // 横屏时调整Hero Section
      const heroContainer = document.querySelector('.hero-section');
      if (heroContainer) {
        heroContainer.style.minHeight = '90vh';
      }
    }

    // 重新初始化滚动动画
    if (window.AnimationController) {
      window.AnimationController.initScrollAnimations();
    }
  }

  /**
   * 为新方向调整交互
   * @param {string} orientation - 设备方向
   */
  adjustInteractionsForOrientation(orientation) {
    const mobileOptimization = this.getComponent('mobileOptimization');
    if (mobileOptimization) {
      // 根据方向调整触摸目标大小
      if (orientation === 'landscape') {
        // 横屏时可以使用稍小的触摸目标
        document.body.classList.add('landscape-optimized');
      } else {
        document.body.classList.remove('landscape-optimized');
      }
    }
  }

  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  getDeviceInfo() {
    const mobileOptimization = this.getComponent('mobileOptimization');
    if (mobileOptimization) {
      return mobileOptimization.getDeviceInfo();
    }
    return null;
  }

  /**
   * 运行SEO验证
   * @returns {Promise<Object>} SEO验证报告
   */
  async runSEOValidation() {
    const seoValidator = this.getComponent('seoValidator');
    if (seoValidator) {
      const report = await seoValidator.validateAll();
      console.log('SEO验证报告:', report);
      return report;
    }
    return null;
  }

  /**
   * 生成SEO报告
   * @returns {Object} SEO报告
   */
  generateSEOReport() {
    const seoManager = this.getComponent('seoManager');
    if (seoManager) {
      const report = seoManager.generateSEOReport();
      console.log('SEO管理报告:', report);
      return report;
    }
    return null;
  }

  /**
   * 更新页面元数据
   * @param {Object} metaData - 元数据
   */
  updatePageMeta(metaData) {
    const metaTagsManager = this.getComponent('metaTagsManager');
    if (metaTagsManager) {
      metaTagsManager.updatePageMeta(metaData);
    }
  }

  /**
   * 生成并导出站点地图
   * @param {string} format - 导出格式 ('xml' 或 'json')
   */
  exportSitemap(format = 'xml') {
    const sitemapGenerator = this.getComponent('sitemapGenerator');
    if (sitemapGenerator) {
      sitemapGenerator.exportSitemap(format);
    }
  }

  /**
   * 处理基座卡片点击
   * @param {Object} detail - 事件详情
   */
  handleFoundationCardClick(detail) {
    const { foundationId, category, foundation } = detail;
    
    // 可以根据不同的基座功能执行不同的操作
    console.log(`点击了基座功能: ${foundation.title}`);
    
    // 根据功能类别提供更多信息或跳转
    switch (category) {
      case 'engine':
      case 'knowledge':
        // 跳转到智能体展示
        Utils.smoothScrollTo('#agents', 80);
        break;
      case 'control':
      case 'security':
      case 'compliance':
        // 跳转到订阅方案
        Utils.smoothScrollTo('#pricing', 80);
        break;
      case 'reliability':
        // 跳转到最终CTA
        Utils.smoothScrollTo('#final-cta', 80);
        break;
      default:
        Utils.smoothScrollTo('#agents', 80);
    }
  }

  /**
   * 显示演示预约表单
   */
  showDemoForm() {
    // 这里可以显示模态框或跳转到表单区域
    Utils.smoothScrollTo('#final-cta', 80);
  }

  /**
   * 注册组件
   * @param {string} name - 组件名称
   * @param {Object} component - 组件实例
   */
  registerComponent(name, component) {
    this.components.set(name, component);
  }

  /**
   * 获取组件
   * @param {string} name - 组件名称
   * @returns {Object} 组件实例
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * 获取可访问性报告
   * @returns {Object} 可访问性报告
   */
  getAccessibilityReport() {
    const accessibilityManager = this.getComponent('accessibilityManager');
    if (accessibilityManager) {
      return accessibilityManager.getAccessibilityReport();
    }
    return null;
  }

  /**
   * 获取浏览器兼容性报告
   * @returns {Object} 浏览器兼容性报告
   */
  getBrowserCompatibilityReport() {
    const browserCompatibility = this.getComponent('browserCompatibility');
    if (browserCompatibility) {
      return browserCompatibility.getCompatibilityReport();
    }
    return null;
  }

  /**
   * 向屏幕阅读器公告消息
   * @param {string} message - 消息内容
   * @param {string} priority - 优先级 ('polite' 或 'assertive')
   */
  announceToScreenReader(message, priority = 'polite') {
    const accessibilityManager = this.getComponent('accessibilityManager');
    if (accessibilityManager) {
      accessibilityManager.announceToScreenReader(message, priority);
    }
  }

  /**
   * 检查浏览器特性支持
   * @param {string} feature - 特性名称
   * @returns {boolean} 是否支持
   */
  isFeatureSupported(feature) {
    const browserCompatibility = this.getComponent('browserCompatibility');
    if (browserCompatibility) {
      return browserCompatibility.isFeatureSupported(feature);
    }
    return false;
  }

  /**
   * 获取浏览器信息
   * @returns {Object} 浏览器信息
   */
  getBrowserInfo() {
    const browserCompatibility = this.getComponent('browserCompatibility');
    if (browserCompatibility) {
      return browserCompatibility.getBrowserInfo();
    }
    return null;
  }

  /**
   * 运行完整的质量检查
   * @returns {Object} 质量检查报告
   */
  async runQualityCheck() {
    const report = {
      timestamp: new Date().toISOString(),
      accessibility: this.getAccessibilityReport(),
      browserCompatibility: this.getBrowserCompatibilityReport(),
      seo: await this.runSEOValidation(),
      performance: this.getPerformanceMetrics()
    };

    console.log('质量检查报告:', report);
    return report;
  }

  /**
   * 获取性能指标
   * @returns {Object} 性能指标
   */
  getPerformanceMetrics() {
    const performanceMonitor = this.getComponent('performanceMonitor');
    if (performanceMonitor) {
      return performanceMonitor.getMetrics();
    }
    
    // 基础性能指标
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    }
    
    return null;
  }
}

// ===== 应用程序启动 =====
document.addEventListener('DOMContentLoaded', () => {
  // 创建应用程序实例
  window.IntelliMediaApp = new IntelliMediaApp();
  
  // 初始化应用程序
  window.IntelliMediaApp.init();
});

// 导出工具函数供其他模块使用
window.Utils = Utils;
window.AnimationController = AnimationController;
window.FormHandler = FormHandler;
window.NavigationController = NavigationController;