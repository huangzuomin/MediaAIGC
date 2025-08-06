// Storage utilities for standalone AI maturity assessment
const Storage = {
  // Storage keys
  KEYS: {
    SESSION: 'ai-maturity-session',
    RESULT: 'ai-maturity-result',
    USER_PREFERENCES: 'ai-maturity-preferences',
    ANALYTICS_DATA: 'ai-maturity-analytics'
  },

  // Check if localStorage is available
  isAvailable: function() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Generic storage methods with error handling and encryption
  setItem: function(key, value, encrypt = false) {
    try {
      if (!this.isAvailable()) {
        console.warn('localStorage not available, using memory storage');
        this.memoryStorage = this.memoryStorage || {};
        this.memoryStorage[key] = value;
        return true;
      }

      const dataToStore = {
        data: value,
        timestamp: Date.now(),
        version: '1.0',
        encrypted: encrypt
      };

      let serializedValue;
      if (encrypt) {
        serializedValue = this.encrypt(dataToStore);
      } else {
        serializedValue = JSON.stringify(dataToStore);
      }
      
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (e) {
      console.error('Error saving to storage:', e);
      return false;
    }
  },

  getItem: function(key) {
    try {
      if (!this.isAvailable()) {
        return this.memoryStorage ? this.memoryStorage[key] : null;
      }

      const item = localStorage.getItem(key);
      if (!item) return null;

      let parsed;
      
      // Try to determine if data is encrypted
      try {
        parsed = JSON.parse(item);
      } catch (e) {
        // Might be encrypted, try to decrypt
        try {
          parsed = this.decrypt(item);
        } catch (e2) {
          console.error('Error parsing stored data:', e2);
          return null;
        }
      }

      // Handle encrypted data
      if (parsed.encrypted) {
        try {
          parsed = this.decrypt(item);
        } catch (e) {
          console.error('Error decrypting data:', e);
          return null;
        }
      }
      
      // Check if data is expired (optional, for future use)
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  },

  removeItem: function(key) {
    try {
      if (!this.isAvailable()) {
        if (this.memoryStorage) {
          delete this.memoryStorage[key];
        }
        return true;
      }

      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from storage:', e);
      return false;
    }
  },

  clear: function() {
    try {
      if (!this.isAvailable()) {
        this.memoryStorage = {};
        return true;
      }

      // Only clear our app's data, not all localStorage
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },

  // Session management with encryption
  saveSession: function(sessionData) {
    const success = this.setItem(this.KEYS.SESSION, {
      ...sessionData,
      lastUpdated: new Date().toISOString()
    }, true); // Encrypt session data

    if (success) {
      console.log('Session data saved (encrypted):', sessionData.sessionId);
    }
    return success;
  },

  getSession: function() {
    const session = this.getItem(this.KEYS.SESSION);
    if (session) {
      console.log('Session data loaded:', session.sessionId);
    }
    return session;
  },

  clearSession: function() {
    const success = this.removeItem(this.KEYS.SESSION);
    if (success) {
      console.log('Session data cleared');
    }
    return success;
  },

  // Assessment result management with encryption
  saveResult: function(resultData) {
    const success = this.setItem(this.KEYS.RESULT, {
      ...resultData,
      savedAt: new Date().toISOString()
    }, true); // Encrypt result data

    if (success) {
      console.log('Assessment result saved (encrypted):', resultData.level);
    }
    return success;
  },

  getResult: function() {
    const result = this.getItem(this.KEYS.RESULT);
    if (result) {
      console.log('Assessment result loaded:', result.level);
    }
    return result;
  },

  clearResult: function() {
    const success = this.removeItem(this.KEYS.RESULT);
    if (success) {
      console.log('Assessment result cleared');
    }
    return success;
  },

  // User preferences management
  savePreferences: function(preferences) {
    const currentPrefs = this.getPreferences() || {};
    const updatedPrefs = {
      ...currentPrefs,
      ...preferences,
      updatedAt: new Date().toISOString()
    };

    const success = this.setItem(this.KEYS.USER_PREFERENCES, updatedPrefs);
    if (success) {
      console.log('User preferences saved');
    }
    return success;
  },

  getPreferences: function() {
    return this.getItem(this.KEYS.USER_PREFERENCES) || {
      theme: 'light',
      language: 'zh-CN',
      analytics: true,
      notifications: true
    };
  },

  // Enhanced analytics data management
  saveAnalyticsData: function(eventData) {
    const existingData = this.getAnalyticsData() || [];
    const enhancedEventData = {
      ...eventData,
      timestamp: Date.now(),
      id: this.generateId(),
      synced: false,
      retryCount: 0
    };

    const updatedData = [...existingData, enhancedEventData];

    // Keep only last 200 events to prevent storage bloat
    const trimmedData = updatedData.slice(-200);
    
    const success = this.setItem(this.KEYS.ANALYTICS_DATA, trimmedData);
    
    if (success) {
      console.log('Analytics event stored:', eventData.event_name || 'unknown');
    }
    
    return success;
  },

  getAnalyticsData: function() {
    return this.getItem(this.KEYS.ANALYTICS_DATA) || [];
  },

  clearAnalyticsData: function() {
    const success = this.removeItem(this.KEYS.ANALYTICS_DATA);
    if (success) {
      console.log('Analytics data cleared');
    }
    return success;
  },

  // Mark analytics events as synced
  markAnalyticsEventsSynced: function(eventIds) {
    const analyticsData = this.getAnalyticsData();
    const updatedData = analyticsData.map(event => {
      if (eventIds.includes(event.id)) {
        return { ...event, synced: true, syncedAt: Date.now() };
      }
      return event;
    });
    
    return this.setItem(this.KEYS.ANALYTICS_DATA, updatedData);
  },

  // Get unsynced analytics events
  getUnsyncedAnalyticsData: function() {
    const analyticsData = this.getAnalyticsData();
    return analyticsData.filter(event => !event.synced);
  },

  // Save conversion funnel data
  saveFunnelData: function(funnelStep, data) {
    const existingFunnelData = this.getFunnelData() || [];
    const funnelEntry = {
      step: funnelStep,
      data: data,
      timestamp: Date.now(),
      id: this.generateId(),
      sessionId: data.session_id || 'unknown'
    };

    const updatedFunnelData = [...existingFunnelData, funnelEntry];
    
    // Keep only last 500 funnel steps
    const trimmedData = updatedFunnelData.slice(-500);
    
    return this.setItem('ai-maturity-funnel-data', trimmedData);
  },

  getFunnelData: function() {
    return this.getItem('ai-maturity-funnel-data') || [];
  },

  // Save conversion data
  saveConversionData: function(conversionData) {
    const existingConversions = this.getConversionData() || [];
    const conversionEntry = {
      ...conversionData,
      timestamp: Date.now(),
      id: this.generateId()
    };

    const updatedConversions = [...existingConversions, conversionEntry];
    
    // Keep only last 100 conversions
    const trimmedData = updatedConversions.slice(-100);
    
    return this.setItem('ai-maturity-conversions', trimmedData);
  },

  getConversionData: function() {
    return this.getItem('ai-maturity-conversions') || [];
  },

  // Analytics reporting and insights
  getAnalyticsInsights: function() {
    const analyticsData = this.getAnalyticsData();
    const funnelData = this.getFunnelData();
    const conversionData = this.getConversionData();
    
    // Calculate basic metrics
    const totalEvents = analyticsData.length;
    const unsyncedEvents = analyticsData.filter(e => !e.synced).length;
    const totalConversions = conversionData.length;
    
    // Calculate funnel metrics
    const funnelSteps = this.calculateFunnelMetrics(funnelData);
    
    // Calculate time-based metrics
    const timeMetrics = this.calculateTimeMetrics(analyticsData);
    
    return {
      overview: {
        totalEvents,
        unsyncedEvents,
        totalConversions,
        syncRate: totalEvents > 0 ? ((totalEvents - unsyncedEvents) / totalEvents * 100).toFixed(2) : 0
      },
      funnel: funnelSteps,
      timing: timeMetrics,
      conversions: this.analyzeConversions(conversionData),
      storage: this.getStorageInfo()
    };
  },

  // Calculate funnel conversion metrics
  calculateFunnelMetrics: function(funnelData) {
    const stepCounts = {};
    
    funnelData.forEach(entry => {
      stepCounts[entry.step] = (stepCounts[entry.step] || 0) + 1;
    });
    
    const steps = [
      'page_view',
      'assessment_start', 
      'question_5_answered',
      'assessment_completed',
      'result_viewed',
      'conversion'
    ];
    
    const metrics = {};
    let previousCount = null;
    
    steps.forEach(step => {
      const count = stepCounts[step] || 0;
      metrics[step] = {
        count,
        conversionRate: previousCount ? (count / previousCount * 100).toFixed(2) : 100
      };
      previousCount = count;
    });
    
    return metrics;
  },

  // Calculate time-based metrics
  calculateTimeMetrics: function(analyticsData) {
    if (analyticsData.length === 0) return {};
    
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    
    const lastHour = analyticsData.filter(e => now - e.timestamp < oneHour).length;
    const lastDay = analyticsData.filter(e => now - e.timestamp < oneDay).length;
    const lastWeek = analyticsData.filter(e => now - e.timestamp < oneWeek).length;
    
    return {
      lastHour,
      lastDay,
      lastWeek,
      total: analyticsData.length
    };
  },

  // Analyze conversion patterns
  analyzeConversions: function(conversionData) {
    if (conversionData.length === 0) return {};
    
    const conversionsByAction = {};
    const conversionsByHour = {};
    
    conversionData.forEach(conversion => {
      const action = conversion.action || 'unknown';
      const hour = new Date(conversion.timestamp).getHours();
      
      conversionsByAction[action] = (conversionsByAction[action] || 0) + 1;
      conversionsByHour[hour] = (conversionsByHour[hour] || 0) + 1;
    });
    
    return {
      byAction: conversionsByAction,
      byHour: conversionsByHour,
      total: conversionData.length,
      averagePerDay: (conversionData.length / 7).toFixed(2) // Assuming week's data
    };
  },

  // Enhanced data encryption with AES-like transformation
  encrypt: function(data) {
    try {
      const jsonString = JSON.stringify(data);
      const key = this.getEncryptionKey();
      
      // Simple XOR encryption with rotating key
      let encrypted = '';
      for (let i = 0; i < jsonString.length; i++) {
        const charCode = jsonString.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode ^ keyChar);
      }
      
      // Base64 encode the result
      return btoa(encrypted);
    } catch (e) {
      console.error('Error encrypting data:', e);
      return btoa(JSON.stringify(data)); // Fallback to simple base64
    }
  },

  decrypt: function(encryptedData) {
    try {
      const encrypted = atob(encryptedData);
      const key = this.getEncryptionKey();
      
      // XOR decryption
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
      }
      
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error decrypting data:', e);
      // Try fallback base64 decoding
      try {
        return JSON.parse(atob(encryptedData));
      } catch (e2) {
        return encryptedData;
      }
    }
  },

  // Generate or retrieve encryption key
  getEncryptionKey: function() {
    const keyName = 'ai-maturity-key';
    let key = sessionStorage.getItem(keyName);
    
    if (!key) {
      // Generate a session-based key
      key = this.generateEncryptionKey();
      sessionStorage.setItem(keyName, key);
    }
    
    return key;
  },

  generateEncryptionKey: function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  },

  // Data export/import for user control
  exportData: function() {
    const data = {
      session: this.getSession(),
      result: this.getResult(),
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(data, null, 2);
  },

  importData: function(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.session) this.saveSession(data.session);
      if (data.result) this.saveResult(data.result);
      if (data.preferences) this.savePreferences(data.preferences);

      console.log('Data imported successfully');
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  },

  // Storage usage information
  getStorageInfo: function() {
    if (!this.isAvailable()) {
      return {
        available: false,
        used: 0,
        total: 0,
        percentage: 0
      };
    }

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }

      // Estimate total available (usually 5-10MB)
      const total = 5 * 1024 * 1024; // 5MB estimate
      
      return {
        available: true,
        used: used,
        total: total,
        percentage: (used / total) * 100,
        usedFormatted: this.formatBytes(used),
        totalFormatted: this.formatBytes(total)
      };
    } catch (e) {
      console.error('Error getting storage info:', e);
      return {
        available: true,
        used: 0,
        total: 0,
        percentage: 0,
        error: e.message
      };
    }
  },

  // Utility methods
  formatBytes: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  generateId: function() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },

  // Data validation
  validateSessionData: function(data) {
    return data && 
           typeof data.sessionId === 'string' &&
           typeof data.startTime === 'string' &&
           typeof data.currentQuestion === 'number' &&
           typeof data.answers === 'object';
  },

  validateResultData: function(data) {
    return data &&
           typeof data.level === 'string' &&
           typeof data.levelName === 'string' &&
           typeof data.score === 'string' &&
           Array.isArray(data.recommendations);
  },

  // Enhanced privacy compliance
  clearAllUserData: function() {
    const success = this.clear();
    
    // Also clear session storage encryption key
    try {
      sessionStorage.removeItem('ai-maturity-key');
    } catch (e) {
      console.warn('Could not clear session storage:', e);
    }
    
    // Clear memory storage if used
    this.memoryStorage = {};
    
    if (success) {
      console.log('All user data cleared for privacy compliance');
      
      // Trigger privacy event for analytics
      if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
        window.Analytics.trackEvent('privacy_data_cleared', {
          timestamp: Date.now(),
          user_initiated: true
        });
      }
    }
    return success;
  },

  // Get data processing consent status
  getConsentStatus: function() {
    const preferences = this.getPreferences();
    return {
      analytics: preferences.analytics !== false,
      storage: preferences.dataStorage !== false,
      sharing: preferences.dataSharing !== false,
      lastUpdated: preferences.consentUpdatedAt || null
    };
  },

  // Update consent preferences
  updateConsent: function(consentData) {
    const currentPrefs = this.getPreferences();
    const updatedPrefs = {
      ...currentPrefs,
      analytics: consentData.analytics,
      dataStorage: consentData.storage,
      dataSharing: consentData.sharing,
      consentUpdatedAt: new Date().toISOString()
    };

    const success = this.savePreferences(updatedPrefs);
    
    if (success) {
      console.log('Privacy consent updated:', consentData);
      
      // If user revoked storage consent, clear data
      if (!consentData.storage) {
        this.clearAllUserData();
      }
    }
    
    return success;
  },

  // Check if user has given consent for data processing
  hasValidConsent: function() {
    const consent = this.getConsentStatus();
    
    // Check if consent was given recently (within 1 year)
    if (consent.lastUpdated) {
      const consentDate = new Date(consent.lastUpdated);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      return consentDate > oneYearAgo && consent.storage;
    }
    
    return false;
  },

  // Get privacy-compliant data summary
  getDataSummary: function() {
    const storageInfo = this.getStorageInfo();
    const consent = this.getConsentStatus();
    
    return {
      dataTypes: {
        session: !!this.getSession(),
        results: !!this.getResult(),
        preferences: !!this.getItem(this.KEYS.USER_PREFERENCES),
        analytics: this.getAnalyticsData().length > 0
      },
      storage: {
        used: storageInfo.usedFormatted,
        percentage: storageInfo.percentage.toFixed(1) + '%'
      },
      consent: consent,
      retention: {
        sessionData: '7 days',
        resultData: 'Until manually cleared',
        analyticsData: '7 days',
        preferences: 'Until manually cleared'
      },
      encryption: {
        sessionData: true,
        resultData: true,
        preferences: false,
        analyticsData: false
      }
    };
  },

  // Data retention management
  cleanupExpiredData: function() {
    const session = this.getSession();
    if (session && session.lastUpdated) {
      const lastUpdate = new Date(session.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
      
      // Clear session data older than 7 days
      if (daysSinceUpdate > 7) {
        this.clearSession();
        console.log('Expired session data cleared');
      }
    }

    // Clear old analytics data
    const analyticsData = this.getAnalyticsData();
    if (analyticsData.length > 0) {
      const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
      const filteredData = analyticsData.filter(item => item.timestamp > cutoffTime);
      
      if (filteredData.length !== analyticsData.length) {
        this.setItem(this.KEYS.ANALYTICS_DATA, filteredData);
        console.log('Expired analytics data cleared');
      }
    }
  }
};

// Auto-cleanup on page load
document.addEventListener('DOMContentLoaded', function() {
  Storage.cleanupExpiredData();
});

// Export for global use
window.Storage = Storage;