/**
 * Final CTA Section 组件
 * 第六屏最终行动号召区域组件，包含演示预约表单
 */

class FinalCTASection {
  constructor(container) {
    this.container = container;
    this.data = {
      title: "是时候，亲身体验智媒AI工作站的强大能力了",
      subtitle: "预约一次产品演示，我们的专家将为您展示它如何为您的新闻团队带来革命性的效率提升。",
      primaryCTA: {
        text: "立即预约免费演示",
        action: "show-demo-form"
      },
      contactInfo: {
        text: "或致电我们的产品顾问：",
        phone: "138-XXXX-XXXX"
      },
      form: {
        title: "预约产品演示",
        fields: [
          { name: "name", label: "姓名", type: "text", required: true, placeholder: "请输入您的姓名" },
          { name: "company", label: "机构名称", type: "text", required: true, placeholder: "请输入您的机构名称" },
          { name: "position", label: "职位", type: "text", required: true, placeholder: "请输入您的职位" },
          { name: "phone", label: "联系电话", type: "tel", required: true, placeholder: "请输入您的联系电话" },
          { name: "email", label: "邮箱", type: "email", required: false, placeholder: "请输入您的邮箱（可选）" },
          { name: "requirements", label: "需求描述", type: "textarea", required: false, placeholder: "请简要描述您的需求和期望了解的功能" }
        ]
      }
    };
    this.formVisible = false;
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
      <div class="final-cta-background">
        <div class="tech-lines">
          <div class="tech-line"></div>
          <div class="tech-line"></div>
          <div class="tech-line"></div>
        </div>
      </div>
      
      <div class="final-cta-content fade-in">
        <h1 class="final-cta-title">${this.data.title}</h1>
        <p class="final-cta-subtitle">${this.data.subtitle}</p>
        
        <div class="final-cta-actions">
          <button class="final-cta-primary btn" data-action="${this.data.primaryCTA.action}">
            ${this.data.primaryCTA.text}
          </button>
          
          <div class="final-cta-contact">
            <svg width="20" height="20">
              <use href="assets/icons.svg#icon-phone"></use>
            </svg>
            <span>${this.data.contactInfo.text}</span>
            <a href="tel:${this.data.contactInfo.phone}" class="final-cta-phone">
              ${this.data.contactInfo.phone}
            </a>
          </div>
        </div>
        
        <div class="final-cta-form" id="demo-form">
          ${this.renderDemoForm()}
        </div>
      </div>
    `;
  }

  /**
   * 渲染演示预约表单
   * @returns {string} HTML字符串
   */
  renderDemoForm() {
    return `
      <h3 style="color: var(--neutral-white); margin-bottom: var(--spacing-lg); text-align: center;">
        ${this.data.form.title}
      </h3>
      <form class="demo-form" id="demo-booking-form">
        ${this.renderFormFields()}
        <button type="submit" class="form-submit">
          <svg width="20" height="20" style="margin-right: 8px;">
            <use href="assets/icons.svg#icon-calendar"></use>
          </svg>
          提交预约申请
        </button>
      </form>
    `;
  }

  /**
   * 渲染表单字段
   * @returns {string} HTML字符串
   */
  renderFormFields() {
    return this.data.form.fields.map(field => `
      <div class="form-group">
        <label class="form-label" for="${field.name}">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        ${field.type === 'textarea' 
          ? `<textarea 
               class="form-input form-textarea" 
               id="${field.name}" 
               name="${field.name}" 
               placeholder="${field.placeholder}"
               ${field.required ? 'required' : ''}></textarea>`
          : `<input 
               type="${field.type}" 
               class="form-input" 
               id="${field.name}" 
               name="${field.name}" 
               placeholder="${field.placeholder}"
               ${field.required ? 'required' : ''}>`
        }
      </div>
    `).join('');
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 主CTA按钮点击事件
    const primaryCTA = this.container.querySelector('[data-action="show-demo-form"]');
    if (primaryCTA) {
      primaryCTA.addEventListener('click', this.handlePrimaryCTAClick.bind(this));
    }

    // 电话链接点击事件
    const phoneLink = this.container.querySelector('.final-cta-phone');
    if (phoneLink) {
      phoneLink.addEventListener('click', this.handlePhoneClick.bind(this));
    }

    // 注册表单到表单处理器
    setTimeout(() => {
      const formHandler = window.IntelliMediaApp?.getComponent('formHandler');
      if (formHandler) {
        formHandler.registerForm('demo-booking-form', {
          onSuccess: (data, result) => {
            this.handleFormSuccess(data, result);
          },
          onError: (error) => {
            this.handleFormError(error);
          },
          resetAfterSubmit: true,
          showSuccessMessage: false // 我们自己处理成功消息
        });
      }
    }, 100);
  }

  /**
   * 设置交叉观察器
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 启动背景动画
          this.startBackgroundAnimation();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // 观察动画元素
    const animatedElements = this.container.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * 处理主CTA按钮点击
   * @param {Event} event - 点击事件
   */
  handlePrimaryCTAClick(event) {
    event.preventDefault();
    
    // 添加点击动画
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'translateY(-4px)';
    }, 150);

    // 显示/隐藏表单
    this.toggleDemoForm();

    // 触发自定义事件
    const customEvent = new CustomEvent('finalCTAClick', {
      detail: {
        action: 'show-demo-form',
        formVisible: this.formVisible,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * 处理电话点击
   * @param {Event} event - 点击事件
   */
  handlePhoneClick(event) {
    // 触发自定义事件
    const customEvent = new CustomEvent('phoneClick', {
      detail: {
        phone: this.data.contactInfo.phone,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(customEvent);
  }





  /**
   * 切换演示表单显示
   */
  toggleDemoForm() {
    const form = this.container.querySelector('#demo-form');
    if (form) {
      this.formVisible = !this.formVisible;
      
      if (this.formVisible) {
        form.classList.add('active');
        // 滚动到表单位置
        setTimeout(() => {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else {
        form.classList.remove('active');
      }
    }
  }

  /**
   * 验证表单
   * @param {Object} data - 表单数据
   * @returns {boolean} 验证结果
   */
  validateForm(data) {
    let isValid = true;
    const form = this.container.querySelector('#demo-booking-form');

    // 验证必填字段
    this.data.form.fields.forEach(fieldConfig => {
      if (fieldConfig.required) {
        const value = data[fieldConfig.name];
        const field = form.querySelector(`[name="${fieldConfig.name}"]`);
        
        if (!value || !value.trim()) {
          this.showFieldError(field, '此字段为必填项');
          isValid = false;
        }
      }
    });

    // 验证邮箱格式
    if (data.email && !this.isValidEmail(data.email)) {
      const emailField = form.querySelector('[name="email"]');
      this.showFieldError(emailField, '请输入有效的邮箱地址');
      isValid = false;
    }

    // 验证手机号格式
    if (data.phone && !this.isValidPhone(data.phone)) {
      const phoneField = form.querySelector('[name="phone"]');
      this.showFieldError(phoneField, '请输入有效的手机号码');
      isValid = false;
    }

    return isValid;
  }

  /**
   * 显示字段错误
   * @param {HTMLElement} field - 字段元素
   * @param {string} message - 错误消息
   */
  showFieldError(field, message) {
    field.style.borderColor = 'var(--error)';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.style.cssText = `
        color: var(--error);
        font-size: var(--font-size-small);
        margin-top: var(--spacing-xs);
      `;
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * 清除字段错误
   * @param {HTMLElement} field - 字段元素
   */
  clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * 显示提交状态
   * @param {HTMLFormElement} form - 表单元素
   * @param {string} state - 状态：loading, success, error
   */
  showSubmissionState(form, state) {
    const submitButton = form.querySelector('.form-submit');
    
    switch (state) {
      case 'loading':
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <svg width="20" height="20" style="margin-right: 8px; animation: spin 1s linear infinite;">
            <use href="assets/icons.svg#icon-automation"></use>
          </svg>
          提交中...
        `;
        break;
      case 'success':
        submitButton.innerHTML = `
          <svg width="20" height="20" style="margin-right: 8px;">
            <use href="assets/icons.svg#icon-check"></use>
          </svg>
          提交成功
        `;
        break;
      case 'error':
        submitButton.disabled = false;
        submitButton.innerHTML = `
          <svg width="20" height="20" style="margin-right: 8px;">
            <use href="assets/icons.svg#icon-calendar"></use>
          </svg>
          重新提交
        `;
        break;
    }
  }

  /**
   * 处理成功提交
   * @param {Object} data - 表单数据
   */
  handleSuccessfulSubmission(data) {
    // 3秒后重置表单
    setTimeout(() => {
      const form = this.container.querySelector('#demo-booking-form');
      form.reset();
      this.showSubmissionState(form, 'normal');
      
      const submitButton = form.querySelector('.form-submit');
      submitButton.disabled = false;
      submitButton.innerHTML = `
        <svg width="20" height="20" style="margin-right: 8px;">
          <use href="assets/icons.svg#icon-calendar"></use>
        </svg>
        提交预约申请
      `;
    }, 3000);
  }

  /**
   * 启动背景动画
   */
  startBackgroundAnimation() {
    const techLines = this.container.querySelectorAll('.tech-line');
    
    techLines.forEach((line, index) => {
      const delay = Math.random() * 2;
      const duration = 4 + Math.random() * 3;
      
      line.style.animationDelay = `${delay}s`;
      line.style.animationDuration = `${duration}s`;
    });
  }

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证手机号格式
   * @param {string} phone - 手机号
   * @returns {boolean} 是否有效
   */
  isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
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
   * 处理表单成功
   * @param {Object} data - 表单数据
   * @param {Object} result - 提交结果
   */
  handleFormSuccess(data, result) {
    console.log('演示预约成功:', data);
    
    // 触发成功事件
    const event = new CustomEvent('demoBookingSuccess', {
      detail: { formData: data, result }
    });
    document.dispatchEvent(event);
  }

  /**
   * 处理表单错误
   * @param {string} error - 错误消息
   */
  handleFormError(error) {
    console.error('演示预约失败:', error);
    
    // 触发错误事件
    const event = new CustomEvent('demoBookingError', {
      detail: { error }
    });
    document.dispatchEvent(event);
  }

  /**
   * 销毁组件
   */
  destroy() {
    // 清理事件监听器
    const primaryCTA = this.container.querySelector('[data-action="show-demo-form"]');
    if (primaryCTA) {
      primaryCTA.removeEventListener('click', this.handlePrimaryCTAClick);
    }

    const phoneLink = this.container.querySelector('.final-cta-phone');
    if (phoneLink) {
      phoneLink.removeEventListener('click', this.handlePhoneClick);
    }

    // 清空容器
    this.container.innerHTML = '';
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinalCTASection;
} else {
  window.FinalCTASection = FinalCTASection;
}