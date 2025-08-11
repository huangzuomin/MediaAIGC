/**
 * Challenge Section 组件
 * 第二屏挑战与共鸣区域组件，展示媒体行业面临的核心挑战
 */

class ChallengeSection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "您的新闻团队，是否正在面临这些挑战？",
      challenges: [
        {
          id: "content-production",
          title: "内容生产跟不上时代？",
          description: "短视频、快讯、深度图文...多平台内容需求激增，传统采编模式已不堪重负。",
          icon: "icon-content-production"
        },
        {
          id: "repetitive-work",
          title: "重复性工作消耗精力？",
          description: "稿件一稿多投靠复制粘贴，热点追踪靠人工刷新，宝贵的创作时间被大量事务性工作占据。",
          icon: "icon-repetitive-work"
        },
        {
          id: "ai-adoption",
          title: "想用AI，却不知从何下手？",
          description: "市面上的AI工具眼花缭乱，无法与业务流程结合，更担心数据安全与内容合规问题。",
          icon: "icon-ai-confusion"
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
      <h2 class="challenge-title fade-in">${this.data.title}</h2>
      <div class="challenge-grid">
        ${this.renderChallenges()}
      </div>
    `;
  }

  /**
   * 渲染挑战卡片
   * @returns {string} HTML字符串
   */
  renderChallenges() {
    return this.data.challenges.map(challenge => `
      <div class="challenge-card fade-in" data-challenge-id="${challenge.id}">
        <div class="challenge-icon">
          <span style="font-size: 2rem;">⚡</span>
        </div>
        <h3 class="challenge-card-title">${challenge.title}</h3>
        <p class="challenge-card-description">${challenge.description}</p>
      </div>
    `).join('');
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const challengeCards = this.container.querySelectorAll('.challenge-card');
    
    challengeCards.forEach(card => {
      card.addEventListener('click', this.handleChallengeClick.bind(this));
      card.addEventListener('mouseenter', this.handleChallengeHover.bind(this));
      card.addEventListener('mouseleave', this.handleChallengeLeave.bind(this));
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
   * 处理挑战卡片点击
   * @param {Event} event - 点击事件
   */
  handleChallengeClick(event) {
    const card = event.currentTarget;
    const challengeId = card.dataset.challengeId;
    const challenge = this.data.challenges.find(c => c.id === challengeId);

    // 触发自定义事件
    const customEvent = new CustomEvent('challengeCardClick', {
      detail: {
        challengeId,
        challenge,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理挑战卡片悬浮
   * @param {Event} event - 悬浮事件
   */
  handleChallengeHover(event) {
    const card = event.currentTarget;
    const challengeId = card.dataset.challengeId;
    const challenge = this.data.challenges.find(c => c.id === challengeId);

    // 触发自定义事件
    const customEvent = new CustomEvent('challengeCardHover', {
      detail: {
        challengeId,
        challenge,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理挑战卡片离开
   * @param {Event} event - 离开事件
   */
  handleChallengeLeave(event) {
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
    const challengeCards = this.container.querySelectorAll('.challenge-card');
    challengeCards.forEach(card => {
      card.removeEventListener('click', this.handleChallengeClick);
      card.removeEventListener('mouseenter', this.handleChallengeHover);
      card.removeEventListener('mouseleave', this.handleChallengeLeave);
    });

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChallengeSection;
} else {
  window.ChallengeSection = ChallengeSection;
}