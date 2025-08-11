/**
 * 用户体验增强工具
 * 提供交互动效、滚动进度、加载动画等用户体验增强功能
 */

class UXEnhancements {
  constructor() {
    this.scrollProgress = null;
    this.backToTop = null;
    this.loadingOverlay = null;
    this.tooltips = new Map();
    this.notifications = [];
    
    this.init();
  }

  /**
   * 初始化用户体验增强
   */
  init() {
    this.createScrollProgress();
    this.createBackToTop();
    this.setupSmoothScrolling();
    this.setupParallaxEffects();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupTooltips();
    this.setupNotifications();
    this.setupKeyboardNavigation();
    
    console.log('用户体验增强初始化完成');
  }

  /**
   * 创建滚动进度指示器
   */
  createScrollProgress() {
    this.scrollProgress = document.createElement('div');
    this.scrollProgress.className = 'scroll-progress';
    this.scrollProgress.innerHTML = `
      <div class="scroll-progress-bar"></div>
      <div class="scroll-progress-circle">
        <svg width="50" height="50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent-gold)" stroke-width="3" stroke-dasharray="125.6" stroke-dashoffset="125.6" class="progress-circle"></circle>
        </svg>
        <div class="progress-percentage">0%</div>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 9999;
        pointer-events: none;
      }
      
      .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-blue), var(--accent-gold));
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
      }
      
      .scroll-progress-circle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--neutral-white);
        border-radius: 50%;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
        opacity: 0;
        transform: scale(0.8);
        transition: all var(--transition-normal);
      }
      
      .scroll-progress-circle.visible {
        opacity: 1;
        transform: scale(1);
      }
      
      .scroll-progress-circle:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-xl);
      }
      
      .progress-circle {
        transform: rotate(-90deg);
        transition: stroke-dashoffset 0.1s ease;
      }
      
      .progress-percentage {
        position: absolute;
        font-size: 10px;
        font-weight: var(--font-weight-medium);
        color: var(--primary-blue);
      }
      
      @media (max-width: 768px) {
        .scroll-progress-circle {
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
        }
        
        .progress-percentage {
          font-size: 8px;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.scrollProgress);
    
    this.setupScrollProgressTracking();
  }

  /**
   * 设置滚动进度跟踪
   */
  setupScrollProgressTracking() {
    const progressBar = this.scrollProgress.querySelector('.scroll-progress-bar');
    const progressCircle = this.scrollProgress.querySelector('.scroll-progress-circle');
    const progressSVG = this.scrollProgress.querySelector('.progress-circle');
    const progressText = this.scrollProgress.querySelector('.progress-percentage');
    
    const updateProgress = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // 更新进度条
      progressBar.style.width = scrollPercent + '%';
      
      // 更新圆形进度
      const circumference = 125.6;
      const offset = circumference - (scrollPercent / 100) * circumference;
      progressSVG.style.strokeDashoffset = offset;
      progressText.textContent = Math.round(scrollPercent) + '%';
      
      // 显示/隐藏回到顶部按钮
      if (scrollPercent > 20) {
        progressCircle.classList.add('visible');
      } else {
        progressCircle.classList.remove('visible');
      }
    }, 10);
    
    window.addEventListener('scroll', updateProgress);
    
    // 点击回到顶部
    progressCircle.addEventListener('click', () => {
      this.scrollToTop();
    });
  }

  /**
   * 创建回到顶部按钮
   */
  createBackToTop() {
    // 回到顶部功能已集成到滚动进度圆形按钮中
  }

  /**
   * 滚动到顶部
   */
  scrollToTop() {
    const scrollToTop = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    };
    scrollToTop();
  }

  /**
   * 设置平滑滚动
   */
  setupSmoothScrolling() {
    // 增强现有的平滑滚动
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link) {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // 添加滚动动画
          this.smoothScrollToElement(targetElement);
        }
      }
    });
  }

  /**
   * 平滑滚动到元素
   * @param {HTMLElement} element - 目标元素
   * @param {number} offset - 偏移量
   */
  smoothScrollToElement(element, offset = 80) {
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000);
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  /**
   * 缓动函数
   * @param {number} t - 当前时间
   * @param {number} b - 起始值
   * @param {number} c - 变化量
   * @param {number} d - 持续时间
   * @returns {number} 计算值
   */
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  /**
   * 设置视差效果
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.tech-lines, .hero-background');
    
    const updateParallax = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16);
    
    window.addEventListener('scroll', updateParallax);
  }

  /**
   * 设置悬浮效果增强
   */
  setupHoverEffects() {
    // 为卡片添加磁性效果
    const cards = document.querySelectorAll('.card, .pricing-card, .challenge-card, .foundation-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) { // 只在桌面端启用
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // 为按钮添加波纹效果
    this.addRippleEffect();
  }

  /**
   * 添加波纹效果
   */
  addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // 添加波纹动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 设置加载动画
   */
  setupLoadingAnimations() {
    // 页面加载动画
    this.createLoadingOverlay();
    
    // 图片加载动画
    this.setupImageLoadingAnimation();
    
    // 内容加载动画
    this.setupContentLoadingAnimation();
  }

  /**
   * 创建加载遮罩
   */
  createLoadingOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'loading-overlay';
    this.loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">
          <div class="loading-spinner"></div>
          <h2>智媒AI工作站</h2>
        </div>
        <div class="loading-progress">
          <div class="loading-bar"></div>
        </div>
        <p class="loading-text">正在加载中...</p>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.5s ease;
      }
      
      .loading-overlay.hidden {
        opacity: 0;
        pointer-events: none;
      }
      
      .loading-content {
        text-align: center;
        color: var(--neutral-white);
      }
      
      .loading-logo h2 {
        margin: var(--spacing-md) 0;
        background: linear-gradient(135deg, var(--neutral-white), var(--accent-gold-light));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(212, 175, 55, 0.3);
        border-top: 4px solid var(--accent-gold);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--spacing-md);
      }
      
      .loading-progress {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin: var(--spacing-lg) auto;
        overflow: hidden;
      }
      
      .loading-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light));
        width: 0%;
        animation: loadingProgress 2s ease-in-out;
      }
      
      .loading-text {
        font-size: var(--font-size-small);
        opacity: 0.8;
      }
      
      @keyframes loadingProgress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.loadingOverlay);
    
    // 页面加载完成后隐藏
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoadingOverlay();
      }, 1000);
    });
  }

  /**
   * 隐藏加载遮罩
   */
  hideLoadingOverlay() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
      setTimeout(() => {
        this.loadingOverlay.remove();
      }, 500);
    }
  }

  /**
   * 设置图片加载动画
   */
  setupImageLoadingAnimation() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'all 0.5s ease';
        
        img.addEventListener('load', () => {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        });
      }
    });
  }

  /**
   * 设置内容加载动画
   */
  setupContentLoadingAnimation() {
    // 为动态加载的内容添加进入动画
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList) {
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
              node.style.transition = 'all 0.5s ease';
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 设置工具提示
   */
  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      const tooltip = this.createTooltip(element.dataset.tooltip);
      this.tooltips.set(element, tooltip);
      
      element.addEventListener('mouseenter', () => {
        this.showTooltip(element, tooltip);
      });
      
      element.addEventListener('mouseleave', () => {
        this.hideTooltip(tooltip);
      });
    });
  }

  /**
   * 创建工具提示
   * @param {string} text - 提示文本
   * @returns {HTMLElement} 工具提示元素
   */
  createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    // 添加样式
    if (!document.querySelector('#tooltip-styles')) {
      const style = document.createElement('style');
      style.id = 'tooltip-styles';
      style.textContent = `
        .tooltip {
          position: absolute;
          background: var(--neutral-dark);
          color: var(--neutral-white);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: var(--font-size-small);
          white-space: nowrap;
          z-index: 1000;
          opacity: 0;
          transform: translateY(10px);
          transition: all var(--transition-normal);
          pointer-events: none;
        }
        
        .tooltip.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .tooltip::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid var(--neutral-dark);
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(tooltip);
    return tooltip;
  }

  /**
   * 显示工具提示
   * @param {HTMLElement} element - 触发元素
   * @param {HTMLElement} tooltip - 工具提示元素
   */
  showTooltip(element, tooltip) {
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    tooltip.classList.add('visible');
  }

  /**
   * 隐藏工具提示
   * @param {HTMLElement} tooltip - 工具提示元素
   */
  hideTooltip(tooltip) {
    tooltip.classList.remove('visible');
  }

  /**
   * 设置通知系统
   */
  setupNotifications() {
    // 创建通知容器
    this.notificationContainer = document.createElement('div');
    this.notificationContainer.className = 'notification-container';
    
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      }
      
      .notification {
        background: var(--neutral-white);
        border-left: 4px solid var(--accent-gold);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--transition-normal);
        pointer-events: auto;
      }
      
      .notification.visible {
        opacity: 1;
        transform: translateX(0);
      }
      
      .notification.success {
        border-left-color: var(--success);
      }
      
      .notification.error {
        border-left-color: var(--error);
      }
      
      .notification.warning {
        border-left-color: var(--warning);
      }
      
      .notification-title {
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--spacing-xs);
      }
      
      .notification-message {
        font-size: var(--font-size-small);
        color: var(--neutral-medium);
      }
      
      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--neutral-medium);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.notificationContainer);
  }

  /**
   * 显示通知
   * @param {string} title - 通知标题
   * @param {string} message - 通知消息
   * @param {string} type - 通知类型
   * @param {number} duration - 显示时长
   */
  showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <button class="notification-close">&times;</button>
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    `;
    
    this.notificationContainer.appendChild(notification);
    
    // 显示动画
    requestAnimationFrame(() => {
      notification.classList.add('visible');
    });
    
    // 关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });
    
    // 自动关闭
    if (duration > 0) {
      setTimeout(() => {
        this.hideNotification(notification);
      }, duration);
    }
    
    this.notifications.push(notification);
  }

  /**
   * 隐藏通知
   * @param {HTMLElement} notification - 通知元素
   */
  hideNotification(notification) {
    notification.classList.remove('visible');
    setTimeout(() => {
      notification.remove();
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300);
  }

  /**
   * 设置键盘导航
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Home':
          e.preventDefault();
          this.scrollToTop();
          break;
        case 'End':
          e.preventDefault();
          window.scrollTo(0, document.body.scrollHeight);
          break;
        case 'PageUp':
          e.preventDefault();
          window.scrollBy(0, -window.innerHeight * 0.8);
          break;
        case 'PageDown':
          e.preventDefault();
          window.scrollBy(0, window.innerHeight * 0.8);
          break;
      }
    });
  }

  /**
   * 销毁用户体验增强
   */
  destroy() {
    // 移除滚动进度
    if (this.scrollProgress) {
      this.scrollProgress.remove();
    }
    
    // 移除通知容器
    if (this.notificationContainer) {
      this.notificationContainer.remove();
    }
    
    // 清理工具提示
    this.tooltips.forEach(tooltip => tooltip.remove());
    this.tooltips.clear();
    
    // 移除事件监听器
    window.removeEventListener('scroll', this.updateProgress);
    window.removeEventListener('load', this.hideLoadingOverlay);
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UXEnhancements;
} else {
  window.UXEnhancements = UXEnhancements;
}