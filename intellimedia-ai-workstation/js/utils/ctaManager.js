/**
 * CTA管理工具
 * 管理页面上所有的行动号召按钮和转化跟踪
 */

class CTAManager {
  constructor() {
    this.ctas = new Map();
    this.conversionTracking = new Map();
    this.abTests = new Map();
    
    this.init();
  }

  /**
   * 初始化CTA管理
   */
  init() {
    this.discoverCTAs();
    this.setupEventListeners();
    this.setupConversionTracking();
    this.setupABTesting();
    
    console.log('CTA管理工具初始化完成');
  }

  /**
   * 发现页面上的CTA
   */
  discoverCTAs() {
    const ctaSelectors = [
      '.btn-primary',
      '.btn-secondary', 
      '.btn[data-cta]',
      '[data-action]',
      '.final-cta-primary',
      '.pricing-cta .btn'
    ];

    ctaSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.registerCTA(element);
      });
    });
  }

  /**
   * 注册CTA
   * @param {HTMLElement} element - CTA元素
   * @param {Object} config - CTA配置
   */
  registerCTA(element, config = {}) {
    const ctaId = this.generateCTAId(element);
    
    const ctaConfig = {
      id: ctaId,
      element: element,
      type: this.determineCTAType(element),
      priority: this.determineCTAPriority(element),
      section: this.determineCTASection(element),
      text: element.textContent.trim(),
      action: element.dataset.action || 'click',
      trackConversion: true,
      conversionValue: 1,
      abTestVariant: null,
      ...config
    };

    this.ctas.set(ctaId, ctaConfig);
    element.dataset.ctaId = ctaId;

    console.log(`CTA注册: ${ctaId}`, ctaConfig);
  }

  /**
   * 生成CTA ID
   * @param {HTMLElement} element - CTA元素
   * @returns {string} CTA ID
   */
  generateCTAId(element) {
    const section = this.determineCTASection(element);
    const text = element.textContent.trim().replace(/\s+/g, '-').toLowerCase();
    const timestamp = Date.now().toString(36);
    return `${section}-${text}-${timestamp}`.substring(0, 50);
  }

  /**
   * 确定CTA类型
   * @param {HTMLElement} element - CTA元素
   * @returns {string} CTA类型
   */
  determineCTAType(element) {
    if (element.classList.contains('btn-primary')) return 'primary';
    if (element.classList.contains('btn-secondary')) return 'secondary';
    if (element.classList.contains('btn-outline')) return 'outline';
    if (element.classList.contains('btn-link')) return 'link';
    return 'default';
  }

  /**
   * 确定CTA优先级
   * @param {HTMLElement} element - CTA元素
   * @returns {number} 优先级
   */
  determineCTAPriority(element) {
    if (element.classList.contains('final-cta-primary')) return 10;
    if (element.classList.contains('btn-primary')) return 8;
    if (element.classList.contains('btn-secondary')) return 6;
    if (element.classList.contains('btn-outline')) return 4;
    if (element.classList.contains('btn-link')) return 2;
    return 1;
  }

  /**
   * 确定CTA所在区域
   * @param {HTMLElement} element - CTA元素
   * @returns {string} 区域名称
   */
  determineCTASection(element) {
    const section = element.closest('section');
    if (section) {
      return section.id || 'unknown-section';
    }
    return 'global';
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 使用事件委托监听所有CTA点击
    document.addEventListener('click', (event) => {
      const ctaElement = event.target.closest('[data-cta-id]');
      if (ctaElement) {
        this.handleCTAClick(ctaElement, event);
      }
    });

    // 监听CTA悬浮
    document.addEventListener('mouseenter', (event) => {
      const ctaElement = event.target.closest('[data-cta-id]');
      if (ctaElement) {
        this.handleCTAHover(ctaElement, event);
      }
    }, true);

    // 监听CTA可见性
    this.setupVisibilityTracking();
  }

  /**
   * 处理CTA点击
   * @param {HTMLElement} element - CTA元素
   * @param {Event} event - 点击事件
   */
  handleCTAClick(element, event) {
    const ctaId = element.dataset.ctaId;
    const cta = this.ctas.get(ctaId);
    
    if (!cta) return;

    // 记录点击
    this.trackCTAInteraction(ctaId, 'click', {
      timestamp: new Date().toISOString(),
      position: this.getElementPosition(element),
      viewport: this.getViewportInfo()
    });

    // 添加点击动画
    this.addClickAnimation(element);

    // 处理特定动作
    this.handleCTAAction(cta, event);

    // 转化跟踪
    if (cta.trackConversion) {
      this.trackConversion(ctaId, cta.conversionValue);
    }

    console.log(`CTA点击: ${ctaId}`, cta);
  }

  /**
   * 处理CTA悬浮
   * @param {HTMLElement} element - CTA元素
   * @param {Event} event - 悬浮事件
   */
  handleCTAHover(element, event) {
    const ctaId = element.dataset.ctaId;
    const cta = this.ctas.get(ctaId);
    
    if (!cta) return;

    // 记录悬浮
    this.trackCTAInteraction(ctaId, 'hover', {
      timestamp: new Date().toISOString(),
      duration: 0 // 将在mouseleave时更新
    });

    // 添加悬浮效果
    this.addHoverEffect(element);
  }

  /**
   * 处理CTA动作
   * @param {Object} cta - CTA配置
   * @param {Event} event - 事件
   */
  handleCTAAction(cta, event) {
    const { action, element } = cta;

    switch (action) {
      case 'demo':
      case 'show-demo-form':
        this.handleDemoAction(cta);
        break;
      case 'scroll':
        this.handleScrollAction(cta, event);
        break;
      case 'subscribe-basic':
      case 'consult-professional':
      case 'contact-enterprise':
        this.handlePricingAction(cta);
        break;
      case 'phone':
        this.handlePhoneAction(cta);
        break;
      default:
        this.handleDefaultAction(cta);
    }
  }

  /**
   * 处理演示动作
   * @param {Object} cta - CTA配置
   */
  handleDemoAction(cta) {
    // 滚动到演示表单
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    }

    // 显示表单
    const finalCTASection = window.IntelliMediaApp?.getComponent('finalCTASection');
    if (finalCTASection && !finalCTASection.formVisible) {
      finalCTASection.toggleDemoForm();
    }

    // 跟踪演示请求意图
    this.trackConversion('demo-request-intent', 5);
  }

  /**
   * 处理滚动动作
   * @param {Object} cta - CTA配置
   * @param {Event} event - 事件
   */
  handleScrollAction(cta, event) {
    event.preventDefault();
    const target = cta.element.getAttribute('href');
    if (target && window.Utils) {
      window.Utils.smoothScrollTo(target, 80);
    }
  }

  /**
   * 处理价格动作
   * @param {Object} cta - CTA配置
   */
  handlePricingAction(cta) {
    const { action } = cta;
    
    // 跟踪价格方案兴趣
    this.trackConversion(`pricing-${action}`, 3);

    // 滚动到最终CTA
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    }
  }

  /**
   * 处理电话动作
   * @param {Object} cta - CTA配置
   */
  handlePhoneAction(cta) {
    // 跟踪电话点击
    this.trackConversion('phone-click', 8);
  }

  /**
   * 处理默认动作
   * @param {Object} cta - CTA配置
   */
  handleDefaultAction(cta) {
    console.log('默认CTA动作:', cta);
  }

  /**
   * 添加点击动画
   * @param {HTMLElement} element - 元素
   */
  addClickAnimation(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = '';
    }, 150);

    // 添加波纹效果
    this.addRippleEffect(element);
  }

  /**
   * 添加波纹效果
   * @param {HTMLElement} element - 元素
   */
  addRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * 添加悬浮效果
   * @param {HTMLElement} element - 元素
   */
  addHoverEffect(element) {
    element.style.transform = 'translateY(-2px)';
    element.style.boxShadow = 'var(--shadow-lg)';
  }

  /**
   * 设置可见性跟踪
   */
  setupVisibilityTracking() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ctaId = entry.target.dataset.ctaId;
        if (ctaId) {
          this.trackCTAInteraction(ctaId, 'visibility', {
            isVisible: entry.isIntersecting,
            visibilityRatio: entry.intersectionRatio,
            timestamp: new Date().toISOString()
          });
        }
      });
    }, {
      threshold: [0.1, 0.5, 0.9]
    });

    // 观察所有CTA
    this.ctas.forEach(cta => {
      observer.observe(cta.element);
    });
  }

  /**
   * 跟踪CTA交互
   * @param {string} ctaId - CTA ID
   * @param {string} type - 交互类型
   * @param {Object} data - 交互数据
   */
  trackCTAInteraction(ctaId, type, data) {
    if (!this.conversionTracking.has(ctaId)) {
      this.conversionTracking.set(ctaId, []);
    }

    const interactions = this.conversionTracking.get(ctaId);
    interactions.push({
      type,
      data,
      timestamp: new Date().toISOString()
    });

    // 触发跟踪事件
    const event = new CustomEvent('ctaInteraction', {
      detail: { ctaId, type, data }
    });
    document.dispatchEvent(event);
  }

  /**
   * 跟踪转化
   * @param {string} conversionType - 转化类型
   * @param {number} value - 转化价值
   */
  trackConversion(conversionType, value = 1) {
    const conversionData = {
      type: conversionType,
      value: value,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      url: window.location.href,
      referrer: document.referrer
    };

    // 存储转化数据
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
    conversions.push(conversionData);
    localStorage.setItem('conversions', JSON.stringify(conversions));

    // 触发转化事件
    const event = new CustomEvent('conversionTracked', {
      detail: conversionData
    });
    document.dispatchEvent(event);

    console.log('转化跟踪:', conversionData);
  }

  /**
   * 设置转化跟踪
   */
  setupConversionTracking() {
    // 监听页面卸载，发送跟踪数据
    window.addEventListener('beforeunload', () => {
      this.sendTrackingData();
    });

    // 定期发送跟踪数据
    setInterval(() => {
      this.sendTrackingData();
    }, 30000); // 每30秒发送一次
  }

  /**
   * 发送跟踪数据
   */
  sendTrackingData() {
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
    if (conversions.length === 0) return;

    // 这里可以发送到分析服务
    console.log('发送转化数据:', conversions);

    // 清空本地存储
    localStorage.removeItem('conversions');
  }

  /**
   * 设置A/B测试
   */
  setupABTesting() {
    // 简单的A/B测试实现
    const abTests = {
      'hero-cta-text': {
        variants: ['预约产品演示', '立即免费体验', '获取专属方案'],
        weights: [0.4, 0.3, 0.3]
      },
      'pricing-cta-color': {
        variants: ['primary', 'accent', 'gradient'],
        weights: [0.5, 0.25, 0.25]
      }
    };

    Object.entries(abTests).forEach(([testName, config]) => {
      const variant = this.selectABTestVariant(config);
      this.applyABTestVariant(testName, variant);
    });
  }

  /**
   * 选择A/B测试变体
   * @param {Object} config - 测试配置
   * @returns {string} 选中的变体
   */
  selectABTestVariant(config) {
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < config.variants.length; i++) {
      cumulative += config.weights[i];
      if (random <= cumulative) {
        return config.variants[i];
      }
    }
    
    return config.variants[0];
  }

  /**
   * 应用A/B测试变体
   * @param {string} testName - 测试名称
   * @param {string} variant - 变体
   */
  applyABTestVariant(testName, variant) {
    switch (testName) {
      case 'hero-cta-text':
        const heroCTA = document.querySelector('.hero-cta .btn-primary');
        if (heroCTA) {
          heroCTA.textContent = variant;
        }
        break;
      case 'pricing-cta-color':
        const pricingCTAs = document.querySelectorAll('.pricing-cta .btn-primary');
        pricingCTAs.forEach(cta => {
          cta.classList.remove('btn-primary', 'btn-accent', 'btn-gradient');
          cta.classList.add(`btn-${variant}`);
        });
        break;
    }

    // 记录A/B测试
    this.abTests.set(testName, variant);
    console.log(`A/B测试应用: ${testName} = ${variant}`);
  }

  /**
   * 获取元素位置
   * @param {HTMLElement} element - 元素
   * @returns {Object} 位置信息
   */
  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * 获取视口信息
   * @returns {Object} 视口信息
   */
  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    };
  }

  /**
   * 获取会话ID
   * @returns {string} 会话ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * 获取CTA统计
   * @returns {Object} 统计数据
   */
  getCTAStats() {
    const stats = {
      totalCTAs: this.ctas.size,
      ctasByType: {},
      ctasBySection: {},
      interactions: {},
      conversions: JSON.parse(localStorage.getItem('conversions') || '[]')
    };

    this.ctas.forEach(cta => {
      // 按类型统计
      stats.ctasByType[cta.type] = (stats.ctasByType[cta.type] || 0) + 1;
      
      // 按区域统计
      stats.ctasBySection[cta.section] = (stats.ctasBySection[cta.section] || 0) + 1;
      
      // 交互统计
      const interactions = this.conversionTracking.get(cta.id) || [];
      stats.interactions[cta.id] = interactions.length;
    });

    return stats;
  }

  /**
   * 销毁CTA管理器
   */
  destroy() {
    this.ctas.clear();
    this.conversionTracking.clear();
    this.abTests.clear();
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CTAManager;
} else {
  window.CTAManager = CTAManager;
}