/**
 * Pricing Section 组件
 * 第五屏订阅方案区域组件，展示三个版本的价格卡片
 */

class PricingSection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "选择适合您的版本，即刻开启AI生产力变革",
      plans: [
        {
          id: "basic",
          name: "基础版",
          badge: null,
          target: "适合初步体验AI新闻生产的小型媒体机构",
          features: [
            "工作站基础版授权(5账号)",
            "3个预置智能体",
            "基础AI引擎调用",
            "标准技术支持",
            "在线培训资料",
            "社区支持"
          ],
          cta: {
            text: "立即订阅",
            style: "outline",
            action: "subscribe-basic"
          },
          featured: false
        },
        {
          id: "professional",
          name: "专业版",
          badge: "推荐之选",
          target: "希望解决核心痛点、打造AI样板工程的地市级媒体",
          features: [
            "工作站专业版授权(20账号)",
            "专属智能体定制(2个)",
            "项目制流程改造服务",
            "全员实战培训",
            "7x24小时技术支持",
            "专属客户成功经理",
            "私有化部署选项",
            "数据安全保障"
          ],
          cta: {
            text: "咨询定制方案",
            style: "primary",
            action: "consult-professional"
          },
          featured: true
        },
        {
          id: "enterprise",
          name: "旗舰版",
          badge: null,
          target: "需要深度定制和全面AI转型的大型媒体集团",
          features: [
            "工作站旗舰版授权(无限账号)",
            "全套智能体定制开发",
            "端到端流程重构",
            "高级管理驾驶舱",
            "多机构统一管理",
            "API接口开放",
            "专属部署团队",
            "首席顾问服务"
          ],
          cta: {
            text: "联系首席顾问",
            style: "outline",
            action: "contact-enterprise"
          },
          featured: false
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
      <div class="pricing-header fade-in">
        <h2 class="pricing-title">${this.data.title}</h2>
      </div>
      <div class="pricing-grid">
        ${this.renderPricingCards()}
      </div>
    `;
  }

  /**
   * 渲染价格卡片
   * @returns {string} HTML字符串
   */
  renderPricingCards() {
    return this.data.plans.map((plan, index) => `
      <div class="pricing-card ${plan.featured ? 'featured' : ''} fade-in" 
           data-plan-id="${plan.id}"
           style="animation-delay: ${index * 0.2}s">
        ${plan.badge ? `<div class="pricing-badge">${plan.badge}</div>` : ''}
        
        <h3 class="pricing-plan-name">${plan.name}</h3>
        <p class="pricing-target">${plan.target}</p>
        
        <ul class="pricing-features">
          ${this.renderFeatures(plan.features)}
        </ul>
        
        <div class="pricing-cta">
          <button class="btn ${plan.cta.style === 'primary' ? 'btn-primary' : 'btn-outline'}" 
                  data-action="${plan.cta.action}"
                  data-plan="${plan.id}">
            ${plan.cta.text}
          </button>
          ${plan.featured ? '<p class="pricing-note">专业团队将在24小时内联系您</p>' : ''}
        </div>
      </div>
    `).join('');
  }

  /**
   * 渲染功能列表
   * @param {Array} features - 功能列表
   * @returns {string} HTML字符串
   */
  renderFeatures(features) {
    return features.map(feature => `
      <li class="pricing-feature">
        <svg class="pricing-feature-icon">
          <use href="assets/icons.svg#icon-check"></use>
        </svg>
        <span>${feature}</span>
      </li>
    `).join('');
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const ctaButtons = this.container.querySelectorAll('.pricing-cta .btn');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', this.handleCTAClick.bind(this));
    });

    // 卡片悬浮效果
    const pricingCards = this.container.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.addEventListener('mouseenter', this.handleCardHover.bind(this));
      card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
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
          
          // 为价格卡片添加交错动画
          if (entry.target.classList.contains('pricing-card')) {
            const cards = this.container.querySelectorAll('.pricing-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
                card.style.transform = card.classList.contains('featured') ? 'scale(1.05)' : 'translateY(0)';
                card.style.opacity = '1';
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
   * 处理CTA按钮点击
   * @param {Event} event - 点击事件
   */
  handleCTAClick(event) {
    const button = event.target;
    const action = button.dataset.action;
    const planId = button.dataset.plan;
    
    // 添加点击动画
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    // 触发自定义事件
    const customEvent = new CustomEvent('pricingCTAClick', {
      detail: {
        action,
        planId,
        plan: this.data.plans.find(p => p.id === planId),
        element: button
      }
    });
    document.dispatchEvent(customEvent);
    
    // 根据不同的行动执行不同的操作
    this.handlePricingAction(action, planId);
  }

  /**
   * 处理价格方案行动
   * @param {string} action - 行动类型
   * @param {string} planId - 方案ID
   */
  handlePricingAction(action, planId) {
    switch (action) {
      case 'subscribe-basic':
        // 基础版订阅
        this.showSubscriptionForm(planId);
        break;
      case 'consult-professional':
        // 专业版咨询
        this.showConsultationForm(planId);
        break;
      case 'contact-enterprise':
        // 旗舰版联系
        this.showContactForm(planId);
        break;
      default:
        // 默认跳转到最终CTA
        if (window.Utils) {
          window.Utils.smoothScrollTo('#final-cta', 80);
        }
    }
  }

  /**
   * 显示订阅表单
   * @param {string} planId - 方案ID
   */
  showSubscriptionForm(planId) {
    console.log(`显示${planId}订阅表单`);
    // 跳转到最终CTA区域
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    }
  }

  /**
   * 显示咨询表单
   * @param {string} planId - 方案ID
   */
  showConsultationForm(planId) {
    console.log(`显示${planId}咨询表单`);
    // 跳转到最终CTA区域
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    }
  }

  /**
   * 显示联系表单
   * @param {string} planId - 方案ID
   */
  showContactForm(planId) {
    console.log(`显示${planId}联系表单`);
    // 跳转到最终CTA区域
    if (window.Utils) {
      window.Utils.smoothScrollTo('#final-cta', 80);
    }
  }

  /**
   * 处理卡片悬浮
   * @param {Event} event - 鼠标事件
   */
  handleCardHover(event) {
    const card = event.currentTarget;
    const planId = card.dataset.planId;
    
    // 触发自定义事件
    const customEvent = new CustomEvent('pricingCardHover', {
      detail: {
        planId,
        plan: this.data.plans.find(p => p.id === planId),
        element: card
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理卡片离开
   * @param {Event} event - 鼠标事件
   */
  handleCardLeave(event) {
    const card = event.currentTarget;
    const planId = card.dataset.planId;
    
    // 触发自定义事件
    const customEvent = new CustomEvent('pricingCardLeave', {
      detail: {
        planId,
        plan: this.data.plans.find(p => p.id === planId),
        element: card
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 高亮特定价格方案
   * @param {string} planId - 方案ID
   */
  highlightPlan(planId) {
    const cards = this.container.querySelectorAll('.pricing-card');
    cards.forEach(card => {
      if (card.dataset.planId === planId) {
        card.classList.add('highlighted');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        card.classList.remove('highlighted');
      }
    });
  }

  /**
   * 比较方案功能
   * @param {string} planId1 - 方案1 ID
   * @param {string} planId2 - 方案2 ID
   * @returns {Object} 比较结果
   */
  comparePlans(planId1, planId2) {
    const plan1 = this.data.plans.find(p => p.id === planId1);
    const plan2 = this.data.plans.find(p => p.id === planId2);
    
    if (!plan1 || !plan2) return null;
    
    return {
      plan1: plan1,
      plan2: plan2,
      commonFeatures: plan1.features.filter(f => plan2.features.includes(f)),
      uniqueFeatures1: plan1.features.filter(f => !plan2.features.includes(f)),
      uniqueFeatures2: plan2.features.filter(f => !plan1.features.includes(f))
    };
  }

  /**
   * 获取推荐方案
   * @returns {Object} 推荐方案
   */
  getRecommendedPlan() {
    return this.data.plans.find(plan => plan.featured);
  }

  /**
   * 获取方案数据
   * @param {string} planId - 方案ID
   * @returns {Object|null} 方案数据
   */
  getPlanData(planId) {
    return this.data.plans.find(plan => plan.id === planId) || null;
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
    const ctaButtons = this.container.querySelectorAll('.pricing-cta .btn');
    ctaButtons.forEach(button => {
      button.removeEventListener('click', this.handleCTAClick);
    });

    const pricingCards = this.container.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
      card.removeEventListener('mouseenter', this.handleCardHover);
      card.removeEventListener('mouseleave', this.handleCardLeave);
    });

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingSection;
} else {
  window.PricingSection = PricingSection;
}