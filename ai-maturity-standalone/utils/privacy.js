// Privacy compliance utilities for AI Maturity Assessment
const Privacy = {
  // Privacy compliance constants
  CONSTANTS: {
    CONSENT_EXPIRY_DAYS: 365, // 1 year
    DATA_RETENTION_DAYS: 7,   // 7 days for temporary data
    ENCRYPTION_KEY_LENGTH: 32,
    GDPR_COMPLIANCE: true,
    CCPA_COMPLIANCE: true
  },

  // Initialize privacy system
  init: function () {
    this.checkComplianceStatus();
    this.setupDataRetentionSchedule();
    this.bindPrivacyEvents();

    console.log('Privacy system initialized');
  },

  // Check overall compliance status
  checkComplianceStatus: function () {
    const status = {
      consentValid: this.isConsentValid(),
      dataRetentionCompliant: this.checkDataRetention(),
      encryptionActive: this.checkEncryption(),
      userRightsSupported: this.checkUserRights()
    };

    if (!status.consentValid) {
      this.requestConsent();
    }

    return status;
  },

  // Check if user consent is valid
  isConsentValid: function () {
    if (!window.Storage) return false;

    const consent = window.Storage.getConsentStatus();
    if (!consent.lastUpdated) return false;

    const consentDate = new Date(consent.lastUpdated);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - this.CONSTANTS.CONSENT_EXPIRY_DAYS);

    return consentDate > expiryDate;
  },

  // Request user consent
  requestConsent: function () {
    if (window.PrivacyNotice) {
      window.PrivacyNotice.show();
    }
  },

  // Check data retention compliance
  checkDataRetention: function () {
    if (!window.Storage) return false;

    try {
      // Check session data age
      const session = window.Storage.getSession();
      if (session && session.lastUpdated) {
        const sessionDate = new Date(session.lastUpdated);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.CONSTANTS.DATA_RETENTION_DAYS);

        if (sessionDate < cutoffDate) {
          window.Storage.clearSession();
          console.log('Expired session data cleared for compliance');
        }
      }

      // Check analytics data age
      const analyticsData = window.Storage.getAnalyticsData();
      if (analyticsData.length > 0) {
        const cutoffTime = Date.now() - (this.CONSTANTS.DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        const validData = analyticsData.filter(item => item.timestamp > cutoffTime);

        if (validData.length !== analyticsData.length) {
          window.Storage.setItem(window.Storage.KEYS.ANALYTICS_DATA, validData);
          console.log('Expired analytics data cleared for compliance');
        }
      }

      return true;
    } catch (e) {
      console.error('Error checking data retention:', e);
      return false;
    }
  },

  // Check encryption status
  checkEncryption: function () {
    if (!window.Storage) return false;

    try {
      // Test encryption/decryption
      const testData = { test: 'encryption_test', timestamp: Date.now() };
      const encrypted = window.Storage.encrypt(testData);
      const decrypted = window.Storage.decrypt(encrypted);

      return JSON.stringify(testData) === JSON.stringify(decrypted);
    } catch (e) {
      console.error('Encryption check failed:', e);
      return false;
    }
  },

  // Check user rights support
  checkUserRights: function () {
    const requiredMethods = [
      'clearAllUserData',
      'exportData',
      'getDataSummary',
      'updateConsent'
    ];

    return requiredMethods.every(method =>
      window.Storage && typeof window.Storage[method] === 'function'
    );
  },

  // Setup automatic data retention schedule
  setupDataRetentionSchedule: function () {
    // Run cleanup every hour
    setInterval(() => {
      this.performScheduledCleanup();
    }, 60 * 60 * 1000); // 1 hour

    // Run initial cleanup
    this.performScheduledCleanup();
  },

  // Perform scheduled data cleanup
  performScheduledCleanup: function () {
    if (!window.Storage) return;

    try {
      window.Storage.cleanupExpiredData();
      console.log('Scheduled privacy cleanup completed');
    } catch (e) {
      console.error('Error during scheduled cleanup:', e);
    }
  },

  // Handle data subject access request (GDPR Article 15)
  handleAccessRequest: function () {
    if (!window.Storage) {
      return {
        error: 'Storage system not available',
        data: null
      };
    }

    try {
      const summary = window.Storage.getDataSummary();
      const exportData = window.Storage.exportData();

      return {
        success: true,
        summary: summary,
        exportData: exportData,
        generatedAt: new Date().toISOString(),
        rights: this.getUserRights()
      };
    } catch (e) {
      return {
        error: 'Error accessing user data: ' + e.message,
        data: null
      };
    }
  },

  // Handle data portability request (GDPR Article 20)
  handlePortabilityRequest: function () {
    if (!window.Storage) return null;

    try {
      const data = {
        userData: window.Storage.exportData(),
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          format: 'JSON',
          source: 'AI Maturity Assessment Tool'
        },
        instructions: {
          import: 'Use the importData function to restore this data',
          format: 'Standard JSON format compatible with the assessment tool'
        }
      };

      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error('Error creating portable data:', e);
      return null;
    }
  },

  // Handle erasure request (GDPR Article 17 - Right to be forgotten)
  handleErasureRequest: function (reason = 'user_request') {
    if (!window.Storage) return false;

    try {
      const success = window.Storage.clearAllUserData();

      if (success) {
        // Log erasure for compliance audit
        this.logPrivacyEvent('data_erasure', {
          reason: reason,
          timestamp: Date.now(),
          success: true
        });

        // Clear any remaining traces
        this.clearBrowserData();

        console.log('User data erasure completed');
        return true;
      }

      return false;
    } catch (e) {
      console.error('Error during data erasure:', e);
      return false;
    }
  },

  // Handle rectification request (GDPR Article 16)
  handleRectificationRequest: function (dataType, newData) {
    if (!window.Storage) return false;

    try {
      let success = false;

      switch (dataType) {
        case 'preferences':
          success = window.Storage.savePreferences(newData);
          break;
        case 'consent':
          success = window.Storage.updateConsent(newData);
          break;
        default:
          console.warn('Rectification not supported for data type:', dataType);
          return false;
      }

      if (success) {
        this.logPrivacyEvent('data_rectification', {
          dataType: dataType,
          timestamp: Date.now(),
          success: true
        });
      }

      return success;
    } catch (e) {
      console.error('Error during data rectification:', e);
      return false;
    }
  },

  // Handle restriction request (GDPR Article 18)
  handleRestrictionRequest: function (restrictions) {
    if (!window.Storage) return false;

    try {
      const currentPrefs = window.Storage.getPreferences();
      const restrictedPrefs = {
        ...currentPrefs,
        dataProcessingRestricted: true,
        restrictions: restrictions,
        restrictionDate: new Date().toISOString()
      };

      const success = window.Storage.savePreferences(restrictedPrefs);

      if (success) {
        this.logPrivacyEvent('data_restriction', {
          restrictions: restrictions,
          timestamp: Date.now(),
          success: true
        });
      }

      return success;
    } catch (e) {
      console.error('Error applying data restrictions:', e);
      return false;
    }
  },

  // Get user rights information
  getUserRights: function () {
    return {
      access: {
        description: '您有权了解我们处理的关于您的个人数据',
        available: true,
        method: 'handleAccessRequest'
      },
      rectification: {
        description: '您有权要求更正不准确的个人数据',
        available: true,
        method: 'handleRectificationRequest'
      },
      erasure: {
        description: '您有权要求删除您的个人数据',
        available: true,
        method: 'handleErasureRequest'
      },
      restriction: {
        description: '您有权限制对您个人数据的处理',
        available: true,
        method: 'handleRestrictionRequest'
      },
      portability: {
        description: '您有权以结构化、常用和机器可读的格式接收您的个人数据',
        available: true,
        method: 'handlePortabilityRequest'
      },
      objection: {
        description: '您有权反对处理您的个人数据',
        available: true,
        method: 'updateConsent'
      }
    };
  },

  // Clear browser data beyond localStorage
  clearBrowserData: function () {
    try {
      // Clear session storage
      sessionStorage.clear();

      // Clear any cookies (if any)
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('ai-maturity')) {
              caches.delete(name);
            }
          });
        });
      }

      console.log('Browser data cleared');
    } catch (e) {
      console.warn('Could not clear all browser data:', e);
    }
  },

  // Log privacy events for audit trail
  logPrivacyEvent: function (eventType, data) {
    try {
      const event = {
        type: eventType,
        timestamp: Date.now(),
        data: data,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Store in a separate privacy log (not user data)
      const privacyLog = JSON.parse(localStorage.getItem('ai-maturity-privacy-log') || '[]');
      privacyLog.push(event);

      // Keep only last 100 events
      const trimmedLog = privacyLog.slice(-100);
      localStorage.setItem('ai-maturity-privacy-log', JSON.stringify(trimmedLog));

      console.log('Privacy event logged:', eventType);
    } catch (e) {
      console.error('Error logging privacy event:', e);
    }
  },

  // Get privacy compliance report
  getComplianceReport: function () {
    const status = this.checkComplianceStatus();
    const userRights = this.getUserRights();

    return {
      timestamp: new Date().toISOString(),
      compliance: {
        gdpr: this.CONSTANTS.GDPR_COMPLIANCE,
        ccpa: this.CONSTANTS.CCPA_COMPLIANCE,
        consentValid: status.consentValid,
        dataRetentionCompliant: status.dataRetentionCompliant,
        encryptionActive: status.encryptionActive,
        userRightsSupported: status.userRightsSupported
      },
      dataProcessing: {
        purposes: [
          'AI成熟度评估计算',
          '用户体验优化',
          '匿名使用统计（可选）'
        ],
        legalBasis: '用户同意',
        retention: `${this.CONSTANTS.DATA_RETENTION_DAYS}天（临时数据）`,
        encryption: '是',
        thirdPartySharing: '否'
      },
      userRights: userRights,
      contactInfo: {
        dataController: 'AI成熟度评估工具',
        email: 'privacy@example.com',
        address: '请联系网站管理员'
      }
    };
  },

  // Validate data processing consent
  validateConsent: function (purpose) {
    if (!window.Storage) return false;

    const consent = window.Storage.getConsentStatus();

    switch (purpose) {
      case 'storage':
        return consent.storage && this.isConsentValid();
      case 'analytics':
        return consent.analytics && this.isConsentValid();
      case 'sharing':
        return consent.sharing && this.isConsentValid();
      default:
        return false;
    }
  },

  // Anonymize data for analytics
  anonymizeData: function (data) {
    const anonymized = { ...data };

    // Remove or hash identifying information
    const sensitiveFields = ['sessionId', 'userId', 'ip', 'userAgent'];

    sensitiveFields.forEach(field => {
      if (anonymized[field]) {
        // Simple hash for anonymization
        anonymized[field] = this.simpleHash(anonymized[field]);
      }
    });

    // Remove precise timestamps, keep only hour
    if (anonymized.timestamp) {
      const date = new Date(anonymized.timestamp);
      date.setMinutes(0, 0, 0);
      anonymized.timestamp = date.getTime();
    }

    return anonymized;
  },

  // Simple hash function for anonymization
  simpleHash: function (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // Bind privacy-related events
  bindPrivacyEvents: function () {
    // Handle page unload - ensure data is properly saved
    window.addEventListener('beforeunload', () => {
      this.performScheduledCleanup();
    });

    // Handle visibility change - pause data collection when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseDataCollection();
      } else {
        this.resumeDataCollection();
      }
    });

    // Handle storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'ai-maturity-privacy-consent-revoked') {
        this.handleConsentRevocation();
      }
    });
  },

  // Pause data collection
  pauseDataCollection: function () {
    if (window.Analytics && typeof window.Analytics.pause === 'function') {
      window.Analytics.pause();
      console.log('Data collection paused');
    } else {
      console.log('Analytics pause method not available');
    }
  },

  // Resume data collection
  resumeDataCollection: function () {
    if (window.Analytics && typeof window.Analytics.resume === 'function' && this.validateConsent('analytics')) {
      window.Analytics.resume();
      console.log('Data collection resumed');
    } else {
      console.log('Analytics resume method not available or no consent');
    }
  },

  // Handle consent revocation
  handleConsentRevocation: function () {
    console.log('Consent revocation detected');
    this.handleErasureRequest('consent_revoked');

    // Reload page to reset state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },

  // Export privacy utilities for testing
  test: {
    checkEncryption: () => Privacy.checkEncryption(),
    validateConsent: (purpose) => Privacy.validateConsent(purpose),
    anonymizeData: (data) => Privacy.anonymizeData(data),
    getComplianceReport: () => Privacy.getComplianceReport()
  }
};

// Auto-initialize privacy system (with delay to prevent blocking)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Privacy.init(), 50);
  });
} else {
  setTimeout(() => Privacy.init(), 50);
}

// Export for global use
window.Privacy = Privacy;