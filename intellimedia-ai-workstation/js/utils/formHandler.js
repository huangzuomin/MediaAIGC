/**
 * 表单处理工具
 * 提供表单验证、提交、错误处理等功能
 */

class FormHandler {
  constructor() {
    this.forms = new Map();
    this.validators = new Map();
    this.submitHandlers = new Map();
    
    this.init();
  }

  /**
   * 初始化表单处理
   */
  init() {
    this.setupDefaultValidators();
    this.setupFormSubmissionHandling();
    this.setupRealTimeValidation();
    
    console.log('表单处理工具初始化完成');
  }

  /**
   * 设置默认验证器
   */
  setupDefaultValidators() {
    // 必填字段验证器
    this.addValidator('required', (value, field) => {
      if (!value || !value.trim()) {
        return '此字段为必填项';
      }
      return null;
    });

    // 邮箱验证器
    this.addValidator('email', (value, field) => {
      if (value && !this.isValidEmail(value)) {
        return '请输入有效的邮箱地址';
      }
      return null;
    });

    // 手机号验证器
    this.addValidator('phone', (value, field) => {
      if (value && !this.isValidPhone(value)) {
        return '请输入有效的手机号码';
      }
      return null;
    });

    // 姓名验证器
    this.addValidator('name', (value, field) => {
      if (value && (value.length < 2 || value.length > 20)) {
        return '姓名长度应在2-20个字符之间';
      }
      if (value && !/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(value)) {
        return '姓名只能包含中文、英文和空格';
      }
      return null;
    });

    // 公司名称验证器
    this.addValidator('company', (value, field) => {
      if (value && (value.length < 2 || value.length > 50)) {
        return '机构名称长度应在2-50个字符之间';
      }
      return null;
    });

    // 职位验证器
    this.addValidator('position', (value, field) => {
      if (value && (value.length < 2 || value.length > 30)) {
        return '职位长度应在2-30个字符之间';
      }
      return null;
    });

    // 需求描述验证器
    this.addValidator('requirements', (value, field) => {
      if (value && value.length > 500) {
        return '需求描述不能超过500个字符';
      }
      return null;
    });
  }

  /**
   * 添加验证器
   * @param {string} name - 验证器名称
   * @param {Function} validator - 验证函数
   */
  addValidator(name, validator) {
    this.validators.set(name, validator);
  }

  /**
   * 注册表单
   * @param {string} formId - 表单ID
   * @param {Object} config - 表单配置
   */
  registerForm(formId, config = {}) {
    const form = document.getElementById(formId);
    if (!form) {
      console.warn(`表单 ${formId} 未找到`);
      return;
    }

    const formConfig = {
      validateOnBlur: true,
      validateOnInput: false,
      showSuccessMessage: true,
      resetAfterSubmit: true,
      submitEndpoint: null,
      onSuccess: null,
      onError: null,
      customValidators: {},
      ...config
    };

    this.forms.set(formId, {
      element: form,
      config: formConfig,
      fields: this.getFormFields(form),
      isValid: false,
      isSubmitting: false
    });

    this.setupFormEventListeners(formId);
    console.log(`表单 ${formId} 注册成功`);
  }

  /**
   * 获取表单字段
   * @param {HTMLFormElement} form - 表单元素
   * @returns {Map} 字段映射
   */
  getFormFields(form) {
    const fields = new Map();
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      fields.set(input.name, {
        element: input,
        value: input.value,
        isValid: true,
        errors: []
      });
    });

    return fields;
  }

  /**
   * 设置表单事件监听器
   * @param {string} formId - 表单ID
   */
  setupFormEventListeners(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    const { element: form, config } = formData;

    // 表单提交事件
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(formId);
    });

    // 字段事件监听
    formData.fields.forEach((fieldData, fieldName) => {
      const field = fieldData.element;

      if (config.validateOnBlur) {
        field.addEventListener('blur', () => {
          this.validateField(formId, fieldName);
        });
      }

      if (config.validateOnInput) {
        field.addEventListener('input', Utils.debounce(() => {
          this.validateField(formId, fieldName);
        }, 300));
      }

      // 清除错误状态
      field.addEventListener('focus', () => {
        this.clearFieldError(formId, fieldName);
      });
    });
  }

  /**
   * 设置表单提交处理
   */
  setupFormSubmissionHandling() {
    // 自动发现并注册页面上的表单
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form.id) {
        this.registerForm(form.id);
      }
    });
  }

  /**
   * 设置实时验证
   */
  setupRealTimeValidation() {
    // 监听动态添加的表单
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.tagName === 'FORM' && node.id) {
            this.registerForm(node.id);
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
   * 验证字段
   * @param {string} formId - 表单ID
   * @param {string} fieldName - 字段名称
   * @returns {boolean} 验证结果
   */
  validateField(formId, fieldName) {
    const formData = this.forms.get(formId);
    if (!formData) return false;

    const fieldData = formData.fields.get(fieldName);
    if (!fieldData) return false;

    const field = fieldData.element;
    const value = field.value.trim();
    const errors = [];

    // 更新字段值
    fieldData.value = value;

    // 必填验证
    if (field.required) {
      const error = this.validators.get('required')(value, field);
      if (error) errors.push(error);
    }

    // 类型验证
    const fieldType = field.type || field.name;
    if (value && this.validators.has(fieldType)) {
      const error = this.validators.get(fieldType)(value, field);
      if (error) errors.push(error);
    }

    // 自定义验证
    const customValidators = formData.config.customValidators[fieldName];
    if (customValidators && Array.isArray(customValidators)) {
      customValidators.forEach(validator => {
        const error = validator(value, field);
        if (error) errors.push(error);
      });
    }

    // 更新字段状态
    fieldData.errors = errors;
    fieldData.isValid = errors.length === 0;

    // 显示/清除错误
    if (errors.length > 0) {
      this.showFieldError(formId, fieldName, errors[0]);
    } else {
      this.clearFieldError(formId, fieldName);
    }

    // 更新表单整体状态
    this.updateFormValidationState(formId);

    return fieldData.isValid;
  }

  /**
   * 验证整个表单
   * @param {string} formId - 表单ID
   * @returns {boolean} 验证结果
   */
  validateForm(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return false;

    let isValid = true;

    // 验证所有字段
    formData.fields.forEach((fieldData, fieldName) => {
      const fieldValid = this.validateField(formId, fieldName);
      if (!fieldValid) isValid = false;
    });

    formData.isValid = isValid;
    return isValid;
  }

  /**
   * 更新表单验证状态
   * @param {string} formId - 表单ID
   */
  updateFormValidationState(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    let isValid = true;
    formData.fields.forEach((fieldData) => {
      if (!fieldData.isValid) isValid = false;
    });

    formData.isValid = isValid;

    // 更新提交按钮状态
    const submitButton = formData.element.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = !isValid || formData.isSubmitting;
      
      if (isValid && !formData.isSubmitting) {
        submitButton.classList.add('form-valid');
      } else {
        submitButton.classList.remove('form-valid');
      }
    }
  }

  /**
   * 显示字段错误
   * @param {string} formId - 表单ID
   * @param {string} fieldName - 字段名称
   * @param {string} message - 错误消息
   */
  showFieldError(formId, fieldName, message) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    const fieldData = formData.fields.get(fieldName);
    if (!fieldData) return;

    const field = fieldData.element;
    const fieldContainer = field.closest('.form-group') || field.parentNode;

    // 添加错误样式
    field.classList.add('field-error');
    fieldContainer.classList.add('has-error');

    // 显示错误消息
    let errorElement = fieldContainer.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      fieldContainer.appendChild(errorElement);
    }
    errorElement.textContent = message;

    // 添加错误动画
    const pageAnimations = window.IntelliMediaApp?.getComponent('pageAnimations');
    if (pageAnimations) {
      pageAnimations.playErrorAnimation(field);
    }
  }

  /**
   * 清除字段错误
   * @param {string} formId - 表单ID
   * @param {string} fieldName - 字段名称
   */
  clearFieldError(formId, fieldName) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    const fieldData = formData.fields.get(fieldName);
    if (!fieldData) return;

    const field = fieldData.element;
    const fieldContainer = field.closest('.form-group') || field.parentNode;

    // 移除错误样式
    field.classList.remove('field-error');
    fieldContainer.classList.remove('has-error');

    // 移除错误消息
    const errorElement = fieldContainer.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * 处理表单提交
   * @param {string} formId - 表单ID
   */
  async handleFormSubmit(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    // 验证表单
    if (!this.validateForm(formId)) {
      this.showFormError(formId, '请检查并修正表单中的错误');
      return;
    }

    // 设置提交状态
    this.setSubmissionState(formId, 'loading');

    try {
      // 收集表单数据
      const data = this.collectFormData(formId);
      
      // 提交表单
      const result = await this.submitForm(formId, data);
      
      if (result.success) {
        this.handleSubmissionSuccess(formId, data, result);
      } else {
        this.handleSubmissionError(formId, result.error || '提交失败，请重试');
      }
    } catch (error) {
      console.error('表单提交错误:', error);
      this.handleSubmissionError(formId, '网络错误，请检查网络连接后重试');
    }
  }

  /**
   * 收集表单数据
   * @param {string} formId - 表单ID
   * @returns {Object} 表单数据
   */
  collectFormData(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return {};

    const data = {};
    formData.fields.forEach((fieldData, fieldName) => {
      data[fieldName] = fieldData.element.value.trim();
    });

    // 添加元数据
    data._metadata = {
      formId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href
    };

    return data;
  }

  /**
   * 提交表单
   * @param {string} formId - 表单ID
   * @param {Object} data - 表单数据
   * @returns {Promise<Object>} 提交结果
   */
  async submitForm(formId, data) {
    const formData = this.forms.get(formId);
    if (!formData) return { success: false, error: '表单未找到' };

    const { config } = formData;

    // 如果有自定义提交处理器
    if (config.submitEndpoint) {
      return await this.submitToEndpoint(config.submitEndpoint, data);
    }

    // 默认模拟提交
    return await this.simulateSubmission(data);
  }

  /**
   * 提交到端点
   * @param {string} endpoint - 提交端点
   * @param {Object} data - 表单数据
   * @returns {Promise<Object>} 提交结果
   */
  async submitToEndpoint(endpoint, data) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        return { success: false, error: `服务器错误: ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: '网络连接失败' };
    }
  }

  /**
   * 模拟提交
   * @param {Object} data - 表单数据
   * @returns {Promise<Object>} 提交结果
   */
  async simulateSubmission(data) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // 模拟成功率（95%成功）
    if (Math.random() > 0.05) {
      return {
        success: true,
        data: {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          message: '提交成功',
          submittedData: data
        }
      };
    } else {
      return {
        success: false,
        error: '服务器暂时无法处理请求，请稍后重试'
      };
    }
  }

  /**
   * 处理提交成功
   * @param {string} formId - 表单ID
   * @param {Object} data - 表单数据
   * @param {Object} result - 提交结果
   */
  handleSubmissionSuccess(formId, data, result) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    // 设置成功状态
    this.setSubmissionState(formId, 'success');

    // 显示成功消息
    if (formData.config.showSuccessMessage) {
      this.showFormSuccess(formId, '提交成功！我们将尽快与您联系。');
    }

    // 触发成功回调
    if (formData.config.onSuccess) {
      formData.config.onSuccess(data, result);
    }

    // 触发全局成功事件
    const event = new CustomEvent('formSubmissionSuccess', {
      detail: { formId, data, result }
    });
    document.dispatchEvent(event);

    // 重置表单
    if (formData.config.resetAfterSubmit) {
      setTimeout(() => {
        this.resetForm(formId);
      }, 3000);
    }

    // 显示成功动画
    const pageAnimations = window.IntelliMediaApp?.getComponent('pageAnimations');
    if (pageAnimations) {
      pageAnimations.playSuccessAnimation(formData.element);
    }
  }

  /**
   * 处理提交错误
   * @param {string} formId - 表单ID
   * @param {string} error - 错误消息
   */
  handleSubmissionError(formId, error) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    // 设置错误状态
    this.setSubmissionState(formId, 'error');

    // 显示错误消息
    this.showFormError(formId, error);

    // 触发错误回调
    if (formData.config.onError) {
      formData.config.onError(error);
    }

    // 触发全局错误事件
    const event = new CustomEvent('formSubmissionError', {
      detail: { formId, error }
    });
    document.dispatchEvent(event);

    // 显示错误动画
    const pageAnimations = window.IntelliMediaApp?.getComponent('pageAnimations');
    if (pageAnimations) {
      pageAnimations.playErrorAnimation(formData.element);
    }
  }

  /**
   * 设置提交状态
   * @param {string} formId - 表单ID
   * @param {string} state - 状态：loading, success, error, normal
   */
  setSubmissionState(formId, state) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    const submitButton = formData.element.querySelector('[type="submit"]');
    if (!submitButton) return;

    // 更新提交状态
    formData.isSubmitting = state === 'loading';

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
      case 'normal':
      default:
        submitButton.disabled = !formData.isValid;
        submitButton.innerHTML = `
          <svg width="20" height="20" style="margin-right: 8px;">
            <use href="assets/icons.svg#icon-calendar"></use>
          </svg>
          提交预约申请
        `;
        break;
    }
  }

  /**
   * 显示表单成功消息
   * @param {string} formId - 表单ID
   * @param {string} message - 成功消息
   */
  showFormSuccess(formId, message) {
    const uxEnhancements = window.IntelliMediaApp?.getComponent('uxEnhancements');
    if (uxEnhancements) {
      uxEnhancements.showNotification('提交成功', message, 'success', 8000);
    }
  }

  /**
   * 显示表单错误消息
   * @param {string} formId - 表单ID
   * @param {string} message - 错误消息
   */
  showFormError(formId, message) {
    const uxEnhancements = window.IntelliMediaApp?.getComponent('uxEnhancements');
    if (uxEnhancements) {
      uxEnhancements.showNotification('提交失败', message, 'error', 8000);
    }
  }

  /**
   * 重置表单
   * @param {string} formId - 表单ID
   */
  resetForm(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    // 重置表单元素
    formData.element.reset();

    // 重置字段状态
    formData.fields.forEach((fieldData, fieldName) => {
      fieldData.value = '';
      fieldData.isValid = true;
      fieldData.errors = [];
      this.clearFieldError(formId, fieldName);
    });

    // 重置表单状态
    formData.isValid = false;
    formData.isSubmitting = false;
    this.setSubmissionState(formId, 'normal');
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
   * 销毁表单处理器
   */
  destroy() {
    this.forms.clear();
    this.validators.clear();
    this.submitHandlers.clear();
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
} else {
  window.FormHandler = FormHandler;
}