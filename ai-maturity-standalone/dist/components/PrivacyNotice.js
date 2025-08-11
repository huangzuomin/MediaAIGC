// Privacy Notice Component for AI Maturity Assessment
const PrivacyNotice = {
  // Component state
  state: {
    isVisible: false,
    currentView: 'notice', // 'notice', 'details', 'settings'
    consentGiven: false,
    preferences: {
      analytics: true,
      storage: true,
      sharing: false
    }
  },

  // Initialize privacy notice
  init: function() {
    console.log('Initializing PrivacyNotice...');
    
    try {
      this.checkConsentStatus();
      this.createPrivacyElements();
      this.bindEvents();
      
      // Temporarily disable auto-showing privacy notice to prevent blocking
      // TODO: Re-enable after fixing display issues
      /*
      if (!this.state.consentGiven) {
        setTimeout(() => {
          console.log('Showing privacy notice after delay');
          this.show();
        }, 5000); // Show after 5 seconds
      }
      */
      
      console.log('Privacy notice auto-display disabled for debugging');
      
      console.log('PrivacyNotice initialized successfully');
    } catch (e) {
      console.error('PrivacyNotice initialization failed:', e);
    }
  },

  // Check existing consent status
  checkConsentStatus: function() {
    if (window.Storage) {
      this.state.consentGiven = window.Storage.hasValidConsent();
      const consent = window.Storage.getConsentStatus();
      this.state.preferences = {
        analytics: consent.analytics,
        storage: consent.storage,
        sharing: consent.sharing
      };
    }
  },

  // Create privacy notice elements
  createPrivacyElements: function() {
    // Create privacy notice container
    const container = document.createElement('div');
    container.id = 'privacy-notice';
    container.className = 'privacy-notice';
    container.innerHTML = this.getNoticeHTML();
    
    // Create privacy settings modal
    const modal = document.createElement('div');
    modal.id = 'privacy-modal';
    modal.className = 'privacy-modal';
    modal.innerHTML = this.getModalHTML();
    
    // Add to page
    document.body.appendChild(container);
    document.body.appendChild(modal);
    
    // Add styles
    this.addStyles();
  },

  // Get privacy notice HTML
  getNoticeHTML: function() {
    return `
      <div class="privacy-notice-content">
        <div class="privacy-notice-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="privacy-notice-text">
          <h4>数据隐私保护</h4>
          <p>我们重视您的隐私。此评估工具仅在您的设备本地存储数据，不会上传个人信息到服务器。</p>
        </div>
        <div class="privacy-notice-actions">
          <button class="privacy-btn privacy-btn-secondary" onclick="PrivacyNotice.showDetails()">
            了解详情
          </button>
          <button class="privacy-btn privacy-btn-primary" onclick="PrivacyNotice.acceptConsent()">
            同意并继续
          </button>
        </div>
      </div>
    `;
  },

  // Get privacy modal HTML
  getModalHTML: function() {
    return `
      <div class="privacy-modal-overlay" onclick="PrivacyNotice.hideModal()"></div>
      <div class="privacy-modal-content">
        <div class="privacy-modal-header">
          <h3 id="privacy-modal-title">隐私设置</h3>
          <button class="privacy-modal-close" onclick="PrivacyNotice.hideModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="privacy-modal-body" id="privacy-modal-body">
          <!-- Content will be dynamically loaded -->
        </div>
        <div class="privacy-modal-footer" id="privacy-modal-footer">
          <!-- Footer will be dynamically loaded -->
        </div>
      </div>
    `;
  },

  // Show privacy notice
  show: function() {
    this.state.isVisible = true;
    const notice = document.getElementById('privacy-notice');
    if (notice) {
      notice.classList.add('privacy-notice-visible');
    }
  },

  // Hide privacy notice
  hide: function() {
    this.state.isVisible = false;
    const notice = document.getElementById('privacy-notice');
    if (notice) {
      notice.classList.remove('privacy-notice-visible');
    }
  },

  // Show privacy details modal
  showDetails: function() {
    this.state.currentView = 'details';
    this.updateModalContent();
    this.showModal();
  },

  // Show privacy settings
  showSettings: function() {
    this.state.currentView = 'settings';
    this.updateModalContent();
    this.showModal();
  },

  // Show data summary
  showDataSummary: function() {
    this.state.currentView = 'summary';
    this.updateModalContent();
    this.showModal();
  },

  // Show modal
  showModal: function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
      modal.classList.add('privacy-modal-visible');
      document.body.classList.add('privacy-modal-open');
    }
  },

  // Hide modal
  hideModal: function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
      modal.classList.remove('privacy-modal-visible');
      document.body.classList.remove('privacy-modal-open');
    }
  },

  // Update modal content based on current view
  updateModalContent: function() {
    const title = document.getElementById('privacy-modal-title');
    const body = document.getElementById('privacy-modal-body');
    const footer = document.getElementById('privacy-modal-footer');

    switch (this.state.currentView) {
      case 'details':
        title.textContent = '隐私政策详情';
        body.innerHTML = this.getDetailsHTML();
        footer.innerHTML = this.getDetailsFooterHTML();
        break;
      case 'settings':
        title.textContent = '隐私设置';
        body.innerHTML = this.getSettingsHTML();
        footer.innerHTML = this.getSettingsFooterHTML();
        break;
      case 'summary':
        title.textContent = '数据使用概览';
        body.innerHTML = this.getDataSummaryHTML();
        footer.innerHTML = this.getSummaryFooterHTML();
        break;
    }
  },

  // Get privacy details HTML
  getDetailsHTML: function() {
    return `
      <div class="privacy-details">
        <section class="privacy-section">
          <h4>数据收集</h4>
          <p>我们仅收集以下数据来提供评估服务：</p>
          <ul>
            <li><strong>评估答案：</strong>您对10个问题的回答，用于计算AI成熟度等级</li>
            <li><strong>评估结果：</strong>计算得出的成熟度等级和建议</li>
            <li><strong>使用偏好：</strong>界面设置和语言偏好</li>
            <li><strong>匿名统计：</strong>页面访问和功能使用统计（可选）</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h4>数据存储</h4>
          <p>所有数据均存储在您的设备本地：</p>
          <ul>
            <li><strong>本地存储：</strong>使用浏览器localStorage技术</li>
            <li><strong>加密保护：</strong>敏感数据经过加密处理</li>
            <li><strong>自动清理：</strong>过期数据自动删除</li>
            <li><strong>无服务器传输：</strong>数据不会上传到我们的服务器</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h4>数据保留</h4>
          <ul>
            <li><strong>会话数据：</strong>7天后自动删除</li>
            <li><strong>评估结果：</strong>直到您手动清除</li>
            <li><strong>统计数据：</strong>7天后自动删除</li>
            <li><strong>用户偏好：</strong>直到您手动清除</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h4>您的权利</h4>
          <ul>
            <li><strong>访问权：</strong>随时查看存储的数据</li>
            <li><strong>删除权：</strong>随时清除所有数据</li>
            <li><strong>控制权：</strong>选择性启用/禁用功能</li>
            <li><strong>透明权：</strong>了解数据如何被使用</li>
          </ul>
        </section>
      </div>
    `;
  },

  // Get settings HTML
  getSettingsHTML: function() {
    return `
      <div class="privacy-settings">
        <div class="privacy-setting-item">
          <div class="privacy-setting-info">
            <h4>数据存储</h4>
            <p>允许在本地存储您的评估数据和偏好设置</p>
          </div>
          <div class="privacy-setting-control">
            <label class="privacy-toggle">
              <input type="checkbox" id="consent-storage" ${this.state.preferences.storage ? 'checked' : ''}>
              <span class="privacy-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="privacy-setting-item">
          <div class="privacy-setting-info">
            <h4>使用统计</h4>
            <p>收集匿名使用统计以改进产品体验</p>
          </div>
          <div class="privacy-setting-control">
            <label class="privacy-toggle">
              <input type="checkbox" id="consent-analytics" ${this.state.preferences.analytics ? 'checked' : ''}>
              <span class="privacy-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="privacy-setting-item">
          <div class="privacy-setting-info">
            <h4>结果分享</h4>
            <p>允许生成分享链接和社交媒体分享功能</p>
          </div>
          <div class="privacy-setting-control">
            <label class="privacy-toggle">
              <input type="checkbox" id="consent-sharing" ${this.state.preferences.sharing ? 'checked' : ''}>
              <span class="privacy-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="privacy-danger-zone">
          <h4>数据管理</h4>
          <p>您可以随时清除存储在设备上的所有数据</p>
          <button class="privacy-btn privacy-btn-danger" onclick="PrivacyNotice.clearAllData()">
            清除所有数据
          </button>
        </div>
      </div>
    `;
  },

  // Get data summary HTML
  getDataSummaryHTML: function() {
    let summaryHTML = '<div class="privacy-loading">正在加载数据概览...</div>';
    
    if (window.Storage) {
      try {
        const summary = window.Storage.getDataSummary();
        summaryHTML = `
          <div class="privacy-data-summary">
            <section class="privacy-summary-section">
              <h4>存储的数据类型</h4>
              <div class="privacy-data-types">
                <div class="privacy-data-type ${summary.dataTypes.session ? 'active' : 'inactive'}">
                  <span class="privacy-data-icon">📝</span>
                  <span>会话数据</span>
                  <span class="privacy-data-status">${summary.dataTypes.session ? '有' : '无'}</span>
                </div>
                <div class="privacy-data-type ${summary.dataTypes.results ? 'active' : 'inactive'}">
                  <span class="privacy-data-icon">📊</span>
                  <span>评估结果</span>
                  <span class="privacy-data-status">${summary.dataTypes.results ? '有' : '无'}</span>
                </div>
                <div class="privacy-data-type ${summary.dataTypes.preferences ? 'active' : 'inactive'}">
                  <span class="privacy-data-icon">⚙️</span>
                  <span>用户偏好</span>
                  <span class="privacy-data-status">${summary.dataTypes.preferences ? '有' : '无'}</span>
                </div>
                <div class="privacy-data-type ${summary.dataTypes.analytics ? 'active' : 'inactive'}">
                  <span class="privacy-data-icon">📈</span>
                  <span>统计数据</span>
                  <span class="privacy-data-status">${summary.dataTypes.analytics ? '有' : '无'}</span>
                </div>
              </div>
            </section>

            <section class="privacy-summary-section">
              <h4>存储使用情况</h4>
              <div class="privacy-storage-info">
                <div class="privacy-storage-bar">
                  <div class="privacy-storage-used" style="width: ${summary.storage.percentage}"></div>
                </div>
                <p>已使用 ${summary.storage.used} (${summary.storage.percentage})</p>
              </div>
            </section>

            <section class="privacy-summary-section">
              <h4>隐私设置状态</h4>
              <div class="privacy-consent-status">
                <div class="privacy-consent-item">
                  <span>数据存储：</span>
                  <span class="privacy-status ${summary.consent.storage ? 'enabled' : 'disabled'}">
                    ${summary.consent.storage ? '已启用' : '已禁用'}
                  </span>
                </div>
                <div class="privacy-consent-item">
                  <span>使用统计：</span>
                  <span class="privacy-status ${summary.consent.analytics ? 'enabled' : 'disabled'}">
                    ${summary.consent.analytics ? '已启用' : '已禁用'}
                  </span>
                </div>
                <div class="privacy-consent-item">
                  <span>结果分享：</span>
                  <span class="privacy-status ${summary.consent.sharing ? 'enabled' : 'disabled'}">
                    ${summary.consent.sharing ? '已启用' : '已禁用'}
                  </span>
                </div>
              </div>
            </section>

            <section class="privacy-summary-section">
              <h4>数据加密状态</h4>
              <div class="privacy-encryption-status">
                <div class="privacy-encryption-item">
                  <span>会话数据：</span>
                  <span class="privacy-encryption ${summary.encryption.sessionData ? 'encrypted' : 'plain'}">
                    ${summary.encryption.sessionData ? '已加密' : '未加密'}
                  </span>
                </div>
                <div class="privacy-encryption-item">
                  <span>评估结果：</span>
                  <span class="privacy-encryption ${summary.encryption.resultData ? 'encrypted' : 'plain'}">
                    ${summary.encryption.resultData ? '已加密' : '未加密'}
                  </span>
                </div>
              </div>
            </section>
          </div>
        `;
      } catch (e) {
        summaryHTML = '<div class="privacy-error">无法加载数据概览</div>';
      }
    }
    
    return summaryHTML;
  },

  // Get footer HTML for different views
  getDetailsFooterHTML: function() {
    return `
      <button class="privacy-btn privacy-btn-secondary" onclick="PrivacyNotice.showSettings()">
        隐私设置
      </button>
      <button class="privacy-btn privacy-btn-primary" onclick="PrivacyNotice.acceptConsent()">
        同意并继续
      </button>
    `;
  },

  getSettingsFooterHTML: function() {
    return `
      <button class="privacy-btn privacy-btn-secondary" onclick="PrivacyNotice.hideModal()">
        取消
      </button>
      <button class="privacy-btn privacy-btn-primary" onclick="PrivacyNotice.saveSettings()">
        保存设置
      </button>
    `;
  },

  getSummaryFooterHTML: function() {
    return `
      <button class="privacy-btn privacy-btn-secondary" onclick="PrivacyNotice.showSettings()">
        隐私设置
      </button>
      <button class="privacy-btn privacy-btn-secondary" onclick="PrivacyNotice.exportData()">
        导出数据
      </button>
    `;
  },

  // Accept consent
  acceptConsent: function() {
    this.state.consentGiven = true;
    
    if (window.Storage) {
      window.Storage.updateConsent({
        analytics: this.state.preferences.analytics,
        storage: this.state.preferences.storage,
        sharing: this.state.preferences.sharing
      });
    }
    
    this.hide();
    this.hideModal();
    
    // Track consent acceptance
    if (window.Analytics && this.state.preferences.analytics) {
      window.Analytics.trackEvent('privacy_consent_accepted', {
        timestamp: Date.now(),
        preferences: this.state.preferences
      });
    }
  },

  // Save privacy settings
  saveSettings: function() {
    // Get current form values
    const storage = document.getElementById('consent-storage')?.checked || false;
    const analytics = document.getElementById('consent-analytics')?.checked || false;
    const sharing = document.getElementById('consent-sharing')?.checked || false;
    
    this.state.preferences = { storage, analytics, sharing };
    
    if (window.Storage) {
      window.Storage.updateConsent(this.state.preferences);
    }
    
    this.hideModal();
    
    // Show confirmation
    this.showNotification('隐私设置已保存', 'success');
  },

  // Clear all data
  clearAllData: function() {
    if (confirm('确定要清除所有存储的数据吗？此操作无法撤销。')) {
      if (window.Storage) {
        const success = window.Storage.clearAllUserData();
        if (success) {
          this.showNotification('所有数据已清除', 'success');
          this.hideModal();
          
          // Reset state
          this.state.consentGiven = false;
          this.state.preferences = {
            analytics: true,
            storage: true,
            sharing: false
          };
        } else {
          this.showNotification('清除数据时出现错误', 'error');
        }
      }
    }
  },

  // Export user data
  exportData: function() {
    if (window.Storage) {
      try {
        const data = window.Storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-maturity-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('数据导出成功', 'success');
      } catch (e) {
        this.showNotification('导出数据时出现错误', 'error');
      }
    }
  },

  // Show notification
  showNotification: function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `privacy-notification privacy-notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('privacy-notification-visible');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('privacy-notification-visible');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  // Bind events
  bindEvents: function() {
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
    
    // Handle storage changes
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('ai-maturity-')) {
        this.checkConsentStatus();
      }
    });
  },

  // Add styles
  addStyles: function() {
    if (document.getElementById('privacy-notice-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'privacy-notice-styles';
    styles.textContent = `
      .privacy-notice {
        position: fixed;
        bottom: -200px;
        left: 20px;
        right: 20px;
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        z-index: 9999;
        transition: bottom 0.3s ease;
        pointer-events: auto;
      }

      .privacy-notice-visible {
        bottom: 20px;
      }

      .privacy-notice-content {
        padding: 20px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }

      .privacy-notice-icon {
        color: #003366;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .privacy-notice-text {
        flex: 1;
      }

      .privacy-notice-text h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
      }

      .privacy-notice-text p {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
      }

      .privacy-notice-actions {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }

      .privacy-btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .privacy-btn-primary {
        background: #003366;
        color: white;
      }

      .privacy-btn-primary:hover {
        background: #002244;
      }

      .privacy-btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
      }

      .privacy-btn-secondary:hover {
        background: #e5e7eb;
      }

      .privacy-btn-danger {
        background: #dc2626;
        color: white;
      }

      .privacy-btn-danger:hover {
        background: #b91c1c;
      }

      .privacy-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: none;
      }

      .privacy-modal-visible {
        display: block;
      }

      .privacy-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .privacy-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 64px rgba(0, 0, 0, 0.15);
        max-width: 600px;
        width: 90vw;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
      }

      .privacy-modal-header {
        padding: 24px 24px 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .privacy-modal-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111827;
      }

      .privacy-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #6b7280;
        border-radius: 4px;
      }

      .privacy-modal-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .privacy-modal-body {
        padding: 0 24px;
        flex: 1;
        overflow-y: auto;
      }

      .privacy-modal-footer {
        padding: 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .privacy-section {
        margin-bottom: 24px;
      }

      .privacy-section h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
      }

      .privacy-section p {
        margin: 0 0 12px 0;
        color: #6b7280;
        line-height: 1.6;
      }

      .privacy-section ul {
        margin: 0;
        padding-left: 20px;
        color: #6b7280;
      }

      .privacy-section li {
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .privacy-setting-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px 0;
        border-bottom: 1px solid #f3f4f6;
      }

      .privacy-setting-item:last-child {
        border-bottom: none;
      }

      .privacy-setting-info h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 500;
        color: #111827;
      }

      .privacy-setting-info p {
        margin: 0;
        font-size: 13px;
        color: #6b7280;
        line-height: 1.4;
      }

      .privacy-toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
      }

      .privacy-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .privacy-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #d1d5db;
        transition: 0.2s;
        border-radius: 24px;
      }

      .privacy-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.2s;
        border-radius: 50%;
      }

      .privacy-toggle input:checked + .privacy-toggle-slider {
        background-color: #003366;
      }

      .privacy-toggle input:checked + .privacy-toggle-slider:before {
        transform: translateX(20px);
      }

      .privacy-danger-zone {
        margin-top: 32px;
        padding: 20px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
      }

      .privacy-danger-zone h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #dc2626;
      }

      .privacy-danger-zone p {
        margin: 0 0 16px 0;
        font-size: 13px;
        color: #7f1d1d;
      }

      .privacy-data-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }

      .privacy-data-type {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
      }

      .privacy-data-type.active {
        background: #ecfdf5;
        border-color: #10b981;
      }

      .privacy-data-type.inactive {
        opacity: 0.6;
      }

      .privacy-data-icon {
        font-size: 16px;
      }

      .privacy-data-status {
        margin-left: auto;
        font-size: 12px;
        font-weight: 500;
      }

      .privacy-storage-bar {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .privacy-storage-used {
        height: 100%;
        background: #003366;
        transition: width 0.3s ease;
      }

      .privacy-consent-status,
      .privacy-encryption-status {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .privacy-consent-item,
      .privacy-encryption-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f9fafb;
        border-radius: 6px;
      }

      .privacy-status.enabled,
      .privacy-encryption.encrypted {
        color: #059669;
        font-weight: 500;
      }

      .privacy-status.disabled,
      .privacy-encryption.plain {
        color: #dc2626;
        font-weight: 500;
      }

      .privacy-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }

      .privacy-notification-visible {
        transform: translateX(0);
      }

      .privacy-notification-success {
        background: #059669;
      }

      .privacy-notification-error {
        background: #dc2626;
      }

      .privacy-notification-info {
        background: #0ea5e9;
      }

      body.privacy-modal-open {
        overflow: hidden;
      }

      @media (max-width: 640px) {
        .privacy-notice {
          left: 10px;
          right: 10px;
        }

        .privacy-notice-content {
          flex-direction: column;
          gap: 12px;
        }

        .privacy-notice-actions {
          align-self: stretch;
        }

        .privacy-btn {
          flex: 1;
        }

        .privacy-modal-content {
          width: 95vw;
          max-height: 90vh;
        }

        .privacy-modal-header,
        .privacy-modal-body,
        .privacy-modal-footer {
          padding-left: 16px;
          padding-right: 16px;
        }

        .privacy-data-types {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
};

// Auto-initialize when DOM is ready (with delay to prevent blocking)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => PrivacyNotice.init(), 100);
  });
} else {
  setTimeout(() => PrivacyNotice.init(), 100);
}

// Export for global use
window.PrivacyNotice = PrivacyNotice;