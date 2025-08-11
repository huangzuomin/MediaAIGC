/**
 * 页面动画工具
 * 提供页面进入、离开和过渡动画
 */

class PageAnimations {
  constructor() {
    this.animationQueue = [];
    this.isAnimating = false;
    
    this.init();
  }

  /**
   * 初始化页面动画
   */
  init() {
    this.setupPageEnterAnimation();
    this.setupSectionAnimations();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    
    console.log('页面动画初始化完成');
  }

  /**
   * 设置页面进入动画
   */
  setupPageEnterAnimation() {
    // 页面加载完成后的进入动画
    window.addEventListener('load', () => {
      this.playPageEnterAnimation();
    });
  }

  /**
   * 播放页面进入动画
   */
  playPageEnterAnimation() {
    const timeline = [
      { selector: '.hero-title', delay: 0, animation: 'fadeInUp' },
      { selector: '.hero-subtitle', delay: 200, animation: 'fadeInUp' },
      { selector: '.value-bar', delay: 400, animation: 'fadeInUp' },
      { selector: '.hero-cta', delay: 600, animation: 'fadeInUp' },
      { selector: '.dashboard-placeholder', delay: 800, animation: 'fadeInScale' }
    ];

    timeline.forEach(item => {
      setTimeout(() => {
        this.animateElement(item.selector, item.animation);
      }, item.delay);
    });
  }

  /**
   * 设置区域动画
   */
  setupSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * 动画化区域
   * @param {HTMLElement} section - 区域元素
   */
  animateSection(section) {
    const sectionId = section.id;
    
    switch (sectionId) {
      case 'challenges':
        this.animateChallengeSection(section);
        break;
      case 'foundation':
        this.animateFoundationSection(section);
        break;
      case 'agents':
        this.animateAgentsSection(section);
        break;
      case 'pricing':
        this.animatePricingSection(section);
        break;
      case 'final-cta':
        this.animateFinalCTASection(section);
        break;
    }
  }

  /**
   * 动画化挑战区域
   * @param {HTMLElement} section - 挑战区域
   */
  animateChallengeSection(section) {
    const title = section.querySelector('.challenge-title');
    const cards = section.querySelectorAll('.challenge-card');
    
    if (title) this.animateElement(title, 'fadeInUp');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        this.animateElement(card, 'fadeInUp');
      }, index * 150);
    });
  }

  /**
   * 动画化基座区域
   * @param {HTMLElement} section - 基座区域
   */
  animateFoundationSection(section) {
    const title = section.querySelector('.foundation-title');
    const cards = section.querySelectorAll('.foundation-card');
    
    if (title) this.animateElement(title, 'fadeInUp');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        this.animateElement(card, 'fadeInScale');
      }, index * 100);
    });
  }

  /**
   * 动画化智能体区域
   * @param {HTMLElement} section - 智能体区域
   */
  animateAgentsSection(section) {
    const header = section.querySelector('.agents-header');
    const items = section.querySelectorAll('.agent-item');
    
    if (header) this.animateElement(header, 'fadeInUp');
    
    items.forEach((item, index) => {
      setTimeout(() => {
        this.animateElement(item, 'slideInFromSide', index % 2 === 0 ? 'left' : 'right');
      }, index * 200);
    });
  }

  /**
   * 动画化价格区域
   * @param {HTMLElement} section - 价格区域
   */
  animatePricingSection(section) {
    const header = section.querySelector('.pricing-header');
    const cards = section.querySelectorAll('.pricing-card');
    
    if (header) this.animateElement(header, 'fadeInUp');
    
    // 专业版先出现，然后是两边
    const featuredCard = section.querySelector('.pricing-card.featured');
    const otherCards = Array.from(cards).filter(card => !card.classList.contains('featured'));
    
    if (featuredCard) {
      setTimeout(() => {
        this.animateElement(featuredCard, 'bounceIn');
      }, 200);
    }
    
    otherCards.forEach((card, index) => {
      setTimeout(() => {
        this.animateElement(card, 'fadeInUp');
      }, 400 + index * 150);
    });
  }

  /**
   * 动画化最终CTA区域
   * @param {HTMLElement} section - 最终CTA区域
   */
  animateFinalCTASection(section) {
    const content = section.querySelector('.final-cta-content');
    
    if (content) {
      this.animateElement(content, 'fadeInUp');
    }
  }

  /**
   * 动画化元素
   * @param {string|HTMLElement} selector - 选择器或元素
   * @param {string} animation - 动画类型
   * @param {string} direction - 方向（可选）
   */
  animateElement(selector, animation, direction = '') {
    const elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : [selector];
    
    elements.forEach(element => {
      if (!element) return;
      
      element.classList.add('animate-element');
      
      switch (animation) {
        case 'fadeInUp':
          this.fadeInUp(element);
          break;
        case 'fadeInScale':
          this.fadeInScale(element);
          break;
        case 'slideInFromSide':
          this.slideInFromSide(element, direction);
          break;
        case 'bounceIn':
          this.bounceIn(element);
          break;
        default:
          this.fadeIn(element);
      }
    });
  }

  /**
   * 淡入向上动画
   * @param {HTMLElement} element - 元素
   */
  fadeInUp(element) {
    element.style.cssText += `
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  /**
   * 淡入缩放动画
   * @param {HTMLElement} element - 元素
   */
  fadeInScale(element) {
    element.style.cssText += `
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  /**
   * 从侧面滑入动画
   * @param {HTMLElement} element - 元素
   * @param {string} direction - 方向
   */
  slideInFromSide(element, direction) {
    const translateX = direction === 'left' ? '-50px' : '50px';
    
    element.style.cssText += `
      opacity: 0;
      transform: translateX(${translateX});
      transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    });
  }

  /**
   * 弹跳进入动画
   * @param {HTMLElement} element - 元素
   */
  bounceIn(element) {
    element.style.cssText += `
      opacity: 0;
      transform: scale(0.3);
      transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  /**
   * 简单淡入动画
   * @param {HTMLElement} element - 元素
   */
  fadeIn(element) {
    element.style.cssText += `
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  /**
   * 设置滚动动画
   */
  setupScrollAnimations() {
    let ticking = false;
    
    const updateScrollAnimations = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // 视差效果
      const parallaxElements = document.querySelectorAll('.tech-lines');
      parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      // 滚动进度动画
      this.updateScrollProgress(scrollTop);
      
      ticking = false;
    };
    
    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestScrollUpdate);
  }

  /**
   * 更新滚动进度
   * @param {number} scrollTop - 滚动位置
   */
  updateScrollProgress(scrollTop) {
    const sections = document.querySelectorAll('section');
    const currentSection = this.getCurrentSection(scrollTop);
    
    // 更新导航状态
    this.updateNavigationState(currentSection);
  }

  /**
   * 获取当前区域
   * @param {number} scrollTop - 滚动位置
   * @returns {string} 当前区域ID
   */
  getCurrentSection(scrollTop) {
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        currentSection = section.id;
      }
    });
    
    return currentSection;
  }

  /**
   * 更新导航状态
   * @param {string} currentSection - 当前区域
   */
  updateNavigationState(currentSection) {
    // 触发导航更新事件
    const event = new CustomEvent('navigationUpdate', {
      detail: { currentSection }
    });
    document.dispatchEvent(event);
  }

  /**
   * 设置悬浮动画
   */
  setupHoverAnimations() {
    // 为卡片添加高级悬浮效果
    const cards = document.querySelectorAll('.card, .pricing-card, .challenge-card, .foundation-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverGlow(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverGlow(card);
      });
    });
  }

  /**
   * 添加悬浮光晕效果
   * @param {HTMLElement} element - 元素
   */
  addHoverGlow(element) {
    element.style.boxShadow = `
      var(--shadow-xl),
      0 0 30px rgba(212, 175, 55, 0.3)
    `;
  }

  /**
   * 移除悬浮光晕效果
   * @param {HTMLElement} element - 元素
   */
  removeHoverGlow(element) {
    element.style.boxShadow = '';
  }

  /**
   * 播放成功动画
   * @param {HTMLElement} element - 元素
   */
  playSuccessAnimation(element) {
    element.style.animation = 'successPulse 0.6s ease-out';
    
    // 添加成功动画样式
    if (!document.querySelector('#success-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'success-animation-styles';
      style.textContent = `
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(40, 167, 69, 0.5); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  /**
   * 播放错误动画
   * @param {HTMLElement} element - 元素
   */
  playErrorAnimation(element) {
    element.style.animation = 'errorShake 0.5s ease-out';
    
    // 添加错误动画样式
    if (!document.querySelector('#error-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'error-animation-styles';
      style.textContent = `
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  /**
   * 销毁页面动画
   */
  destroy() {
    // 清理动画队列
    this.animationQueue = [];
    
    // 移除事件监听器
    window.removeEventListener('load', this.playPageEnterAnimation);
    window.removeEventListener('scroll', this.requestScrollUpdate);
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageAnimations;
} else {
  window.PageAnimations = PageAnimations;
}