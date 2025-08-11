/**
 * Foundation Section 组件
 * 第三屏基座功能区域组件，展示六大核心功能模块
 */

class FoundationSection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "六大基座功能，构建您的媒体AI生态",
      foundations: [
        {
          id: "ai-engine",
          title: "核心AI引擎管理",
          description: "统一管理多个AI大模型，智能调度最适合的引擎处理不同任务。",
          icon: "icon-ai-engine",
          category: "engine"
        },
        {
          id: "knowledge-base",
          title: "媒体专属知识库",
          description: "构建您单位的智慧大脑，让AI在您的专属知识体系内创作。",
          icon: "icon-knowledge-base",
          category: "knowledge"
        },
        {
          id: "cost-control",
          title: "AI引擎成本与安全管控",
          description: "精准控制AI使用成本，确保数据安全与合规使用。",
          icon: "icon-cost-control",
          category: "control"
        },
        {
          id: "data-security",
          title: "数据安全与私有化",
          description: "本地部署，数据不出域，满足媒体行业严格的安全要求。",
          icon: "icon-data-security",
          category: "security"
        },
        {
          id: "content-compliance",
          title: "内容安全与合规",
          description: "内置内容审核机制，确保生成内容符合媒体行业规范。",
          icon: "icon-content-compliance",
          category: "compliance"
        },
        {
          id: "reliability",
          title: "稳定与可靠性",
          description: "7×24小时稳定运行，为您的新闻生产提供可靠保障。",
          icon: "icon-reliability",
          category: "reliability"
        }
      ]
    };
    this.init();
  }

  /**
   * 初始化组件
   */
  init() {
    this.render();
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  /**
   * 渲染组件
   */
  render() {
    this.container.innerHTML = `
      <h2 class="foundation-title fade-in">${this.data.title}</h2>
      <div class="foundation-grid">
        ${this.renderFoundations()}
      </div>
    `;
  }

  /**
   * 渲染基座功能卡片
   * @returns {string} HTML字符串
   */
  renderFoundations() {
    return this.data.foundations.map((foundation, index) => `
      <div class="foundation-card fade-in ${index === 1 ? 'featured' : ''}" 
           data-foundation-id="${foundation.id}" 
           data-category="${foundation.category}">
        <div class="foundation-icon">
          <span style="font-size: 2rem;">${this.getIconEmoji(foundation.category)}</span>
        </div>
        <h3 class="foundation-card-title">${foundation.title}</h3>
        <p class="foundation-card-description">${foundation.description}</p>
      </div>
    `).join('');
  }

  /**
   * 根据类别获取图标emoji
   * @param {string} category - 功能类别
   * @returns {string} emoji图标
   */
  getIconEmoji(category) {
    const iconMap = {
      engine: '🤖',
      knowledge: '🧠',
      control: '💰',
      security: '🔐',
      compliance: '✅',
      reliability: '🛡️'
    };
    return iconMap[category] || '⚙️';
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const foundationCards = this.container.querySelectorAll('.foundation-card');
    
    foundationCards.forEach(card => {
      card.addEventListener('click', this.handleFoundationClick.bind(this));
      card.addEventListener('mouseenter', this.handleFoundationHover.bind(this));
      card.addEventListener('mouseleave', this.handleFoundationLeave.bind(this));
    });
  }

  /**
   * 设置交叉观察器
   */
  setupIntersectionObserver() {
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

    const animatedElements = this.container.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * 处理基座功能卡片点击
   * @param {Event} event - 点击事件
   */
  handleFoundationClick(event) {
    const card = event.currentTarget;
    const foundationId = card.dataset.foundationId;
    const category = card.dataset.category;
    const foundation = this.data.foundations.find(f => f.id === foundationId);

    // 触发自定义事件
    const customEvent = new CustomEvent('foundationCardClick', {
      detail: {
        foundationId,
        category,
        foundation,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理基座功能卡片悬浮
   * @param {Event} event - 悬浮事件
   */
  handleFoundationHover(event) {
    const card = event.currentTarget;
    const foundationId = card.dataset.foundationId;
    const category = card.dataset.category;
    const foundation = this.data.foundations.find(f => f.id === foundationId);

    // 触发自定义事件
    const customEvent = new CustomEvent('foundationCardHover', {
      detail: {
        foundationId,
        category,
        foundation,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理基座功能卡片离开
   * @param {Event} event - 离开事件
   */
  handleFoundationLeave(event) {
    // 可以添加离开效果
  }

  /**
   * 更新组件数据
   * @param {Object} newData - 新的数据
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    this.render();
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  /**
   * 销毁组件
   */
  destroy() {
    // 清理事件监听器
    const foundationCards = this.container.querySelectorAll('.foundation-card');
    foundationCards.forEach(card => {
      card.removeEventListener('click', this.handleFoundationClick);
      card.removeEventListener('mouseenter', this.handleFoundationHover);
      card.removeEventListener('mouseleave', this.handleFoundationLeave);
    });

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FoundationSection;
} else {
  window.FoundationSection = FoundationSection;
}