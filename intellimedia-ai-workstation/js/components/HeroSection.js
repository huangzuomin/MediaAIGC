/**
 * Hero Section 组件
 * 第一屏英雄区域组件，包含价值定位、产品展示和CTA按钮
 */

class HeroSection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "为下一代媒体打造的AI操作系统",
      subtitle: "集成核心AI引擎与媒体场景智能体，让您的新闻生产力即刻进入新纪元。",
      valueTags: [
        { text: "专为媒体", icon: "icon-media" },
        { text: "开箱即用", icon: "icon-box" },
        { text: "私有部署", icon: "icon-security" },
        { text: "流程自动化", icon: "icon-automation" }
      ],
      primaryCTA: {
        text: "预约产品演示",
        action: "demo"
      },
      secondaryCTA: {
        text: "查看功能概览 ↓",
        action: "scroll",
        target: "#foundation"
      }
    };
    this.init();
  }

  /**
   * 初始化组件
   */
  init() {
    console.log('HeroSection 初始化开始');
    this.render();
    this.setupEventListeners();
    this.startBackgroundAnimation();
    console.log('HeroSection 初始化完成');
  }

  /**
   * 渲染组件
   */
  render() {
    console.log('HeroSection 开始渲染');
    this.container.innerHTML = `
      <div class="hero-background">
        <div class="tech-lines">
          <div class="tech-line"></div>
          <div class="tech-line"></div>
          <div class="tech-line"></div>
          <div class="tech-line"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title fade-in">${this.data.title}</h1>
          <p class="hero-subtitle fade-in">${this.data.subtitle}</p>
          
          <div class="value-bar fade-in">
            ${this.renderValueTags()}
          </div>
          
          <div class="hero-cta fade-in">
            <button class="btn btn-primary" data-action="${this.data.primaryCTA.action}">
              ${this.data.primaryCTA.text}
            </button>
            <a href="${this.data.secondaryCTA.target}" class="btn btn-link" data-action="${this.data.secondaryCTA.action}">
              ${this.data.secondaryCTA.text}
            </a>
          </div>
        </div>
        
        <div class="hero-visual fade-in">
          ${this.renderDashboardMockup()}
        </div>
      </div>
    `;
    console.log('HeroSection 渲染完成');
  }

  /**
   * 渲染价值标签
   * @returns {string} HTML字符串
   */
  renderValueTags() {
    return this.data.valueTags.map(tag => `
      <div class="value-tag">
        <span class="value-tag-icon">✨</span>
        <span>${tag.text}</span>
      </div>
    `).join('');
  }

  /**
   * 渲染仪表盘模型
   * @returns {string} HTML字符串
   */
  renderDashboardMockup() {
    return `
      <div class="dashboard-placeholder">
        <div>
          <div style="font-size: 2rem; margin-bottom: 1rem;">🖥️</div>
          <div>智媒AI工作站</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">产品演示界面</div>
        </div>
      </div>
    `;
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 主CTA按钮点击事件
    const primaryCTA = this.container.querySelector('[data-action="demo"]');
    if (primaryCTA) {
      primaryCTA.addEventListener('click', this.handleDemoClick.bind(this));
    }

    // 次级CTA按钮点击事件
    const secondaryCTA = this.container.querySelector('[data-action="scroll"]');
    if (secondaryCTA) {
      secondaryCTA.addEventListener('click', this.handleScrollClick.bind(this));
    }

    // 仪表盘悬浮效果
    const dashboard = this.container.querySelector('.dashboard-placeholder');
    if (dashboard) {
      dashboard.addEventListener('mouseenter', this.handleDashboardHover.bind(this));
      dashboard.addEventListener('mouseleave', this.handleDashboardLeave.bind(this));
    }
  }

  /**
   * 处理演示预约点击
   * @param {Event} event - 点击事件
   */
  handleDemoClick(event) {
    event.preventDefault();

    // 添加点击动画
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);

    // 触发演示预约流程
    this.triggerDemoBooking();
  }

  /**
   * 处理滚动点击
   * @param {Event} event - 点击事件
   */
  handleScrollClick(event) {
    event.preventDefault();
    const target = event.target.getAttribute('href');
    if (target && window.Utils) {
      window.Utils.smoothScrollTo(target, 80);
    } else {
      // 简单的滚动实现
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * 处理仪表盘悬浮
   */
  handleDashboardHover() {
    console.log('Dashboard hover effect');
  }

  /**
   * 处理仪表盘离开
   */
  handleDashboardLeave() {
    console.log('Dashboard leave effect');
  }

  /**
   * 触发演示预约流程
   */
  triggerDemoBooking() {
    // 可以显示模态框或跳转到表单
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    } else {
      // 简单的滚动实现
      const targetElement = document.querySelector('#final-cta');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('演示预约功能正在开发中，请稍后再试！');
      }
    }

    // 触发自定义事件
    const event = new CustomEvent('demoBookingRequested', {
      detail: {
        source: 'hero-section',
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 启动背景动画
   */
  startBackgroundAnimation() {
    const techLines = this.container.querySelectorAll('.tech-line');

    // 为每条线设置随机的动画延迟和持续时间
    techLines.forEach((line, index) => {
      const delay = Math.random() * 3;
      const duration = 6 + Math.random() * 4;

      line.style.animationDelay = `${delay}s`;
      line.style.animationDuration = `${duration}s`;
    });
  }

  /**
   * 更新组件数据
   * @param {Object} newData - 新的数据
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    this.render();
    this.setupEventListeners();
  }

  /**
   * 销毁组件
   */
  destroy() {
    // 清理事件监听器
    const buttons = this.container.querySelectorAll('button, a');
    buttons.forEach(button => {
      button.removeEventListener('click', this.handleDemoClick);
      button.removeEventListener('click', this.handleScrollClick);
    });

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroSection;
} else {
  window.HeroSection = HeroSection;
}