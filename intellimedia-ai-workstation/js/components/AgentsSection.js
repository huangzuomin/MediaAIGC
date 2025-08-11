/**
 * Agents Section 组件
 * 第四屏智能体库区域组件，展示六个专业AI智能体
 */

class AgentsSection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "不止于工具，我们为您预置了AI专家团队",
      subtitle: "我们将一线媒体的最佳实践，封装为开箱即用的场景智能体(Agent)，覆盖新闻生产全流程。",
      agents: [
        {
          id: "topic-planner",
          name: "选题策划官",
          description: "7x24小时监控全网，自动发现有价值的新闻线索与选题。",
          icon: "icon-topic-planner",
          capabilities: ["热点监控", "选题推荐", "趋势分析", "竞品追踪"]
        },
        {
          id: "news-assistant",
          name: "新闻助理官",
          description: "记者的第二大脑，辅助资料搜集、提纲生成与录音转写。",
          icon: "icon-news-assistant",
          capabilities: ["资料搜集", "提纲生成", "录音转写", "事实核查"]
        },
        {
          id: "content-editor",
          name: "稿件精编官",
          description: "编辑的金牌校对，智能润色、核查、生成多版本标题。",
          icon: "icon-content-editor",
          capabilities: ["智能润色", "语法检查", "标题生成", "风格统一"]
        },
        {
          id: "video-creator",
          name: "视频快创官",
          description: "图文稿件一键转换为带AI配音和字幕的短视频。",
          icon: "icon-video-creator",
          capabilities: ["视频生成", "AI配音", "字幕制作", "素材匹配"]
        },
        {
          id: "distribution-manager",
          name: "全网分发官",
          description: "一稿多发终极方案，自动适配并分发至各大主流平台。",
          icon: "icon-distribution-manager",
          capabilities: ["多平台发布", "格式适配", "定时发布", "数据统计"]
        },
        {
          id: "sentiment-analyst",
          name: "舆情分析官",
          description: "稿件发布后，自动追踪相关评论和网络舆情，生成用户情绪分析报告。",
          icon: "icon-sentiment-analyst",
          capabilities: ["舆情监控", "情感分析", "热度追踪", "报告生成"]
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
      <div class="agents-header fade-in">
        <h2 class="agents-title">${this.data.title}</h2>
        <p class="agents-subtitle">${this.data.subtitle}</p>
      </div>
      <div class="agents-grid">
        ${this.renderAgentItems()}
      </div>
    `;
  }

  /**
   * 渲染智能体项目
   * @returns {string} HTML字符串
   */
  renderAgentItems() {
    return this.data.agents.map((agent, index) => `
      <div class="agent-item fade-in" 
           data-agent-id="${agent.id}"
           style="animation-delay: ${index * 0.2}s">
        <div class="agent-visual">
          <div class="agent-icon-container">
            <svg class="agent-icon">
              <use href="assets/icons.svg#${agent.icon}"></use>
            </svg>
          </div>
        </div>
        <div class="agent-content">
          <h3 class="agent-name">${agent.name}</h3>
          <p class="agent-description">${agent.description}</p>
          <div class="agent-capabilities">
            ${this.renderCapabilities(agent.capabilities)}
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * 渲染能力标签
   * @param {Array} capabilities - 能力列表
   * @returns {string} HTML字符串
   */
  renderCapabilities(capabilities) {
    return capabilities.map(capability => `
      <span class="capability-tag">${capability}</span>
    `).join('');
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const agentItems = this.container.querySelectorAll('.agent-item');
    
    agentItems.forEach(item => {
      item.addEventListener('mouseenter', this.handleAgentHover.bind(this));
      item.addEventListener('mouseleave', this.handleAgentLeave.bind(this));
      item.addEventListener('click', this.handleAgentClick.bind(this));
    });

    // 能力标签点击事件
    const capabilityTags = this.container.querySelectorAll('.capability-tag');
    capabilityTags.forEach(tag => {
      tag.addEventListener('click', this.handleCapabilityClick.bind(this));
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
          
          // 为智能体项目添加交错动画
          if (entry.target.classList.contains('agent-item')) {
            const items = this.container.querySelectorAll('.agent-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('visible');
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
              }, index * 200);
            });
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // 观察所有动画元素
    const animatedElements = this.container.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * 处理智能体悬浮
   * @param {Event} event - 鼠标事件
   */
  handleAgentHover(event) {
    const item = event.currentTarget;
    const agentId = item.dataset.agentId;
    
    // 添加悬浮效果
    const iconContainer = item.querySelector('.agent-icon-container');
    if (iconContainer) {
      iconContainer.style.transform = 'scale(1.05)';
    }
    
    // 触发自定义事件
    const customEvent = new CustomEvent('agentHover', {
      detail: {
        agentId,
        agent: this.data.agents.find(a => a.id === agentId),
        element: item
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理智能体离开
   * @param {Event} event - 鼠标事件
   */
  handleAgentLeave(event) {
    const item = event.currentTarget;
    const agentId = item.dataset.agentId;
    
    // 移除悬浮效果
    const iconContainer = item.querySelector('.agent-icon-container');
    if (iconContainer) {
      iconContainer.style.transform = 'scale(1)';
    }
    
    // 触发自定义事件
    const customEvent = new CustomEvent('agentLeave', {
      detail: {
        agentId,
        agent: this.data.agents.find(a => a.id === agentId),
        element: item
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理智能体点击
   * @param {Event} event - 点击事件
   */
  handleAgentClick(event) {
    const item = event.currentTarget;
    const agentId = item.dataset.agentId;
    
    // 添加点击动画
    const iconContainer = item.querySelector('.agent-icon-container');
    if (iconContainer) {
      iconContainer.style.transform = 'scale(0.95)';
      setTimeout(() => {
        iconContainer.style.transform = 'scale(1.05)';
      }, 150);
    }
    
    // 触发自定义事件
    const customEvent = new CustomEvent('agentClick', {
      detail: {
        agentId,
        agent: this.data.agents.find(a => a.id === agentId),
        element: item
      }
    });
    document.dispatchEvent(customEvent);
    
    // 跳转到订阅方案
    if (window.Utils) {
      window.Utils.smoothScrollTo('#pricing', 80);
    }
  }

  /**
   * 处理能力标签点击
   * @param {Event} event - 点击事件
   */
  handleCapabilityClick(event) {
    event.stopPropagation();
    const tag = event.target;
    const capability = tag.textContent;
    
    // 添加点击动画
    tag.style.transform = 'scale(0.95)';
    setTimeout(() => {
      tag.style.transform = 'scale(1)';
    }, 150);
    
    // 触发自定义事件
    const customEvent = new CustomEvent('capabilityClick', {
      detail: {
        capability,
        element: tag
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 高亮特定智能体
   * @param {string} agentId - 智能体ID
   */
  highlightAgent(agentId) {
    const items = this.container.querySelectorAll('.agent-item');
    items.forEach(item => {
      if (item.dataset.agentId === agentId) {
        item.classList.add('highlighted');
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  }

  /**
   * 播放智能体介绍动画
   */
  playIntroAnimation() {
    const items = this.container.querySelectorAll('.agent-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('intro-animation');
        const iconContainer = item.querySelector('.agent-icon-container');
        if (iconContainer) {
          iconContainer.style.transform = 'scale(1.1)';
          setTimeout(() => {
            iconContainer.style.transform = 'scale(1)';
          }, 500);
        }
      }, index * 300);
    });
  }

  /**
   * 获取智能体数据
   * @param {string} agentId - 智能体ID
   * @returns {Object|null} 智能体数据
   */
  getAgentData(agentId) {
    return this.data.agents.find(agent => agent.id === agentId) || null;
  }

  /**
   * 按能力筛选智能体
   * @param {string} capability - 能力名称
   * @returns {Array} 匹配的智能体列表
   */
  getAgentsByCapability(capability) {
    return this.data.agents.filter(agent => 
      agent.capabilities.includes(capability)
    );
  }

  /**
   * 获取所有能力列表
   * @returns {Array} 所有能力的唯一列表
   */
  getAllCapabilities() {
    const allCapabilities = this.data.agents.reduce((acc, agent) => {
      return acc.concat(agent.capabilities);
    }, []);
    return [...new Set(allCapabilities)];
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
    const agentItems = this.container.querySelectorAll('.agent-item');
    agentItems.forEach(item => {
      item.removeEventListener('mouseenter', this.handleAgentHover);
      item.removeEventListener('mouseleave', this.handleAgentLeave);
      item.removeEventListener('click', this.handleAgentClick);
    });

    const capabilityTags = this.container.querySelectorAll('.capability-tag');
    capabilityTags.forEach(tag => {
      tag.removeEventListener('click', this.handleCapabilityClick);
    });

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgentsSection;
} else {
  window.AgentsSection = AgentsSection;
}