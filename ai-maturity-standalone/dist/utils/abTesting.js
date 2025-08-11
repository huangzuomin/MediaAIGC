// A/B Testing Framework for AI Maturity Assessment
const ABTesting = {
  // Configuration
  config: {
    enabled: true,
    debug: false,
    persistVariants: true,
    trackingEnabled: true,
    defaultTrafficAllocation: 1.0, // 100% of traffic
    cookieExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
    storageKey: 'ab_test_variants'
  },

  // Internal state
  state: {
    initialized: false,
    activeTests: new Map(),
    userVariants: new Map(),
    testResults: new Map(),
    userId: null,
    sessionId: null
  },

  // Test definitions
  tests: {
    // CTA文案A/B测试
    cta_messaging: {
      name: 'CTA Messaging Test',
      description: '测试不同CTA文案对转化率的影响',
      status: 'active',
      trafficAllocation: 1.0,
      variants: {
        control: {
          weight: 0.25,
          name: '标准版本',
          config: {
            type: 'primary',
            urgency: false,
            valueProposition: 'standard'
          }
        },
        urgent: {
          weight: 0.25,
          name: '紧迫感版本',
          config: {
            type: 'urgent',
            urgency: true,
            valueProposition: 'time_sensitive'
          }
        },
        value: {
          weight: 0.25,
          name: '价值导向版本',
          config: {
            type: 'value',
            urgency: false,
            valueProposition: 'value_focused'
          }
        },
        social: {
          weight: 0.25,
          name: '社会证明版本',
          config: {
            type: 'social',
            urgency: false,
            valueProposition: 'social_proof'
          }
        }
      },
      targetMetrics: ['conversion_rate', 'click_through_rate', 'engagement_time'],
      segmentation: {
        enabled: true,
        criteria: ['result_level', 'device_type', 'user_segment']
      }
    },

    // 结果展示方式A/B测试
    results_display: {
      name: 'Results Display Test',
      description: '测试不同结果展示方式对用户参与度的影响',
      status: 'active',
      trafficAllocation: 1.0,
      variants: {
        standard: {
          weight: 0.33,
          name: '标准展示',
          config: {
            layout: 'standard',
            animations: 'basic',
            chartType: 'radar',
            detailLevel: 'medium'
          }
        },
        enhanced: {
          weight: 0.33,
          name: '增强展示',
          config: {
            layout: 'enhanced',
            animations: 'advanced',
            chartType: 'multi_chart',
            detailLevel: 'high'
          }
        },
        simplified: {
          weight: 0.34,
          name: '简化展示',
          config: {
            layout: 'simplified',
            animations: 'minimal',
            chartType: 'bar',
            detailLevel: 'low'
          }
        }
      },
      targetMetrics: ['time_on_results', 'share_rate', 'conversion_rate'],
      segmentation: {
        enabled: true,
        criteria: ['device_type', 'result_level']
      }
    },

    // 分享功能A/B测试
    share_modal: {
      name: 'Share Modal Test',
      description: '测试不同分享模态框设计对分享率的影响',
      status: 'active',
      trafficAllocation: 0.8, // 80% traffic allocation
      variants: {
        minimal: {
          weight: 0.5,
          name: '简洁版本',
          config: {
            style: 'minimal',
            platforms: ['wechat', 'weibo'],
            copyText: 'short'
          }
        },
        comprehensive: {
          weight: 0.5,
          name: '完整版本',
          config: {
            style: 'comprehensive',
            platforms: ['wechat', 'weibo', 'qq', 'linkedin'],
            copyText: 'detailed'
          }
        }
      },
      targetMetrics: ['share_completion_rate', 'platform_selection'],
      segmentation: {
        enabled: true,
        criteria: ['device_type']
      }
    }
  },

  // Initialize A/B testing framework
  init: function(options = {}) {
    this.config = { ...this.config, ...options };
    
    // Generate or retrieve user ID
    this.state.userId = this.getUserId();
    this.state.sessionId = this.getSessionId();
    
    // Load persisted variants
    if (this.config.persistVariants) {
      this.loadPersistedVariants();
    }
    
    // Initialize active tests
    this.initializeTests();
    
    this.state.initialized = true;
    
    if (this.config.debug) {
      console.log('A/B Testing framework initialized', {
        userId: this.state.userId,
        sessionId: this.state.sessionId,
        activeTests: Array.from(this.state.activeTests.keys())
      });
    }
    
    // Track initialization
    this.trackEvent('ab_testing_initialized', {
      user_id: this.state.userId,
      session_id: this.state.sessionId,
      active_tests: Array.from(this.state.activeTests.keys())
    });
  },

  // Initialize all active tests
  initializeTests: function() {
    Object.entries(this.tests).forEach(([testId, testConfig]) => {
      if (testConfig.status === 'active') {
        this.initializeTest(testId, testConfig);
      }
    });
  },

  // Initialize a specific test
  initializeTest: function(testId, testConfig) {
    // Check if user should be included in this test
    if (!this.shouldIncludeUser(testConfig)) {
      return;
    }
    
    // Get or assign variant for this user
    let variant = this.getUserVariant(testId);
    if (!variant) {
      variant = this.assignVariant(testId, testConfig);
      this.setUserVariant(testId, variant);
    }
    
    // Store active test
    this.state.activeTests.set(testId, {
      config: testConfig,
      variant: variant,
      startTime: Date.now()
    });
    
    // Track test participation
    this.trackTestParticipation(testId, variant, testConfig);
    
    if (this.config.debug) {
      console.log(`Test ${testId} initialized with variant: ${variant}`);
    }
  },

  // Check if user should be included in test
  shouldIncludeUser: function(testConfig) {
    // Check traffic allocation
    const random = Math.random();
    if (random > testConfig.trafficAllocation) {
      return false;
    }
    
    // Check segmentation criteria if enabled
    if (testConfig.segmentation && testConfig.segmentation.enabled) {
      return this.matchesSegmentation(testConfig.segmentation);
    }
    
    return true;
  },

  // Check if user matches segmentation criteria
  matchesSegmentation: function(segmentation) {
    // This would be expanded based on actual segmentation logic
    // For now, include all users
    return true;
  },

  // Assign variant to user based on weights
  assignVariant: function(testId, testConfig) {
    const variants = testConfig.variants;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [variantId, variantConfig] of Object.entries(variants)) {
      cumulativeWeight += variantConfig.weight;
      if (random <= cumulativeWeight) {
        return variantId;
      }
    }
    
    // Fallback to first variant
    return Object.keys(variants)[0];
  },

  // Get variant for a specific test
  getVariant: function(testId) {
    if (!this.state.initialized) {
      console.warn('A/B Testing not initialized');
      return null;
    }
    
    const activeTest = this.state.activeTests.get(testId);
    if (!activeTest) {
      // Return default variant if test not active
      const testConfig = this.tests[testId];
      if (testConfig) {
        return Object.keys(testConfig.variants)[0]; // First variant as default
      }
      return null;
    }
    
    return activeTest.variant;
  },

  // Get variant configuration
  getVariantConfig: function(testId, variantId = null) {
    const testConfig = this.tests[testId];
    if (!testConfig) {
      return null;
    }
    
    const variant = variantId || this.getVariant(testId);
    if (!variant) {
      return null;
    }
    
    return testConfig.variants[variant]?.config || null;
  },

  // Track test participation
  trackTestParticipation: function(testId, variant, testConfig) {
    const eventData = {
      test_id: testId,
      test_name: testConfig.name,
      variant: variant,
      variant_name: testConfig.variants[variant]?.name,
      user_id: this.state.userId,
      session_id: this.state.sessionId,
      timestamp: Date.now()
    };
    
    this.trackEvent('ab_test_participation', eventData);
    
    // Store participation data
    this.storeTestParticipation(testId, variant, eventData);
  },

  // Track test conversion
  trackConversion: function(testId, conversionType, data = {}) {
    const activeTest = this.state.activeTests.get(testId);
    if (!activeTest) {
      return;
    }
    
    const eventData = {
      test_id: testId,
      variant: activeTest.variant,
      conversion_type: conversionType,
      user_id: this.state.userId,
      session_id: this.state.sessionId,
      timestamp: Date.now(),
      time_in_test: Date.now() - activeTest.startTime,
      ...data
    };
    
    this.trackEvent('ab_test_conversion', eventData);
    
    // Store conversion data
    this.storeTestConversion(testId, activeTest.variant, conversionType, eventData);
    
    if (this.config.debug) {
      console.log(`Conversion tracked for test ${testId}:`, eventData);
    }
  },

  // Track test interaction
  trackInteraction: function(testId, interactionType, data = {}) {
    const activeTest = this.state.activeTests.get(testId);
    if (!activeTest) {
      return;
    }
    
    const eventData = {
      test_id: testId,
      variant: activeTest.variant,
      interaction_type: interactionType,
      user_id: this.state.userId,
      session_id: this.state.sessionId,
      timestamp: Date.now(),
      ...data
    };
    
    this.trackEvent('ab_test_interaction', eventData);
    
    // Store interaction data
    this.storeTestInteraction(testId, activeTest.variant, interactionType, eventData);
  },

  // Get test results and statistics
  getTestResults: function(testId) {
    const testData = this.getStoredTestData(testId);
    if (!testData) {
      return null;
    }
    
    const results = {
      testId: testId,
      testName: this.tests[testId]?.name,
      variants: {},
      summary: {
        totalParticipants: 0,
        totalConversions: 0,
        overallConversionRate: 0
      }
    };
    
    // Calculate metrics for each variant
    Object.keys(this.tests[testId]?.variants || {}).forEach(variant => {
      const variantData = testData.variants[variant] || {
        participants: [],
        conversions: [],
        interactions: []
      };
      
      const participants = variantData.participants.length;
      const conversions = variantData.conversions.length;
      const conversionRate = participants > 0 ? (conversions / participants) * 100 : 0;
      
      results.variants[variant] = {
        participants: participants,
        conversions: conversions,
        conversionRate: conversionRate,
        interactions: variantData.interactions.length,
        avgTimeInTest: this.calculateAverageTimeInTest(variantData.conversions),
        conversionsByType: this.groupConversionsByType(variantData.conversions)
      };
      
      results.summary.totalParticipants += participants;
      results.summary.totalConversions += conversions;
    });
    
    results.summary.overallConversionRate = results.summary.totalParticipants > 0 
      ? (results.summary.totalConversions / results.summary.totalParticipants) * 100 
      : 0;
    
    // Calculate statistical significance
    results.statisticalSignificance = this.calculateStatisticalSignificance(results);
    
    return results;
  },

  // Calculate statistical significance
  calculateStatisticalSignificance: function(results) {
    const variants = Object.keys(results.variants);
    if (variants.length < 2) {
      return { significant: false, confidence: 0 };
    }
    
    // Simple chi-square test implementation
    // In production, you'd want a more robust statistical library
    const controlVariant = variants[0];
    const testVariant = variants[1];
    
    const control = results.variants[controlVariant];
    const test = results.variants[testVariant];
    
    if (control.participants < 30 || test.participants < 30) {
      return { significant: false, confidence: 0, reason: 'insufficient_sample_size' };
    }
    
    // Calculate z-score for conversion rate difference
    const p1 = control.conversions / control.participants;
    const p2 = test.conversions / test.participants;
    const pooledP = (control.conversions + test.conversions) / (control.participants + test.participants);
    
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/control.participants + 1/test.participants));
    const zScore = Math.abs(p2 - p1) / se;
    
    // Convert z-score to confidence level (simplified)
    let confidence = 0;
    if (zScore > 1.96) confidence = 95;
    else if (zScore > 1.645) confidence = 90;
    else if (zScore > 1.28) confidence = 80;
    
    return {
      significant: confidence >= 95,
      confidence: confidence,
      zScore: zScore,
      effect: p2 - p1,
      relativeImprovement: p1 > 0 ? ((p2 - p1) / p1) * 100 : 0
    };
  },

  // Generate test report
  generateTestReport: function(testId) {
    const results = this.getTestResults(testId);
    if (!results) {
      return null;
    }
    
    const testConfig = this.tests[testId];
    const report = {
      testInfo: {
        id: testId,
        name: testConfig.name,
        description: testConfig.description,
        status: testConfig.status,
        startDate: this.getTestStartDate(testId),
        duration: this.getTestDuration(testId)
      },
      results: results,
      recommendations: this.generateRecommendations(results),
      exportedAt: new Date().toISOString()
    };
    
    return report;
  },

  // Generate recommendations based on test results
  generateRecommendations: function(results) {
    const recommendations = [];
    
    // Find best performing variant
    let bestVariant = null;
    let bestConversionRate = 0;
    
    Object.entries(results.variants).forEach(([variant, data]) => {
      if (data.conversionRate > bestConversionRate) {
        bestConversionRate = data.conversionRate;
        bestVariant = variant;
      }
    });
    
    if (bestVariant && results.statisticalSignificance.significant) {
      recommendations.push({
        type: 'winner',
        message: `变体 "${bestVariant}" 表现最佳，转化率为 ${bestConversionRate.toFixed(2)}%`,
        action: `建议采用 "${bestVariant}" 变体作为默认版本`,
        confidence: results.statisticalSignificance.confidence
      });
    } else if (bestVariant) {
      recommendations.push({
        type: 'trending',
        message: `变体 "${bestVariant}" 目前表现最佳，但统计显著性不足`,
        action: '建议继续测试以获得更多数据',
        confidence: results.statisticalSignificance.confidence
      });
    }
    
    // Check for low sample sizes
    Object.entries(results.variants).forEach(([variant, data]) => {
      if (data.participants < 100) {
        recommendations.push({
          type: 'warning',
          message: `变体 "${variant}" 样本量较小 (${data.participants} 参与者)`,
          action: '建议增加流量分配或延长测试时间'
        });
      }
    });
    
    return recommendations;
  },

  // Export test data for analysis
  exportTestData: function(testId, format = 'json') {
    const results = this.getTestResults(testId);
    const rawData = this.getStoredTestData(testId);
    
    const exportData = {
      testId: testId,
      testConfig: this.tests[testId],
      results: results,
      rawData: rawData,
      exportedAt: new Date().toISOString(),
      format: format
    };
    
    if (format === 'csv') {
      return this.convertToCSV(exportData);
    }
    
    return JSON.stringify(exportData, null, 2);
  },

  // Convert data to CSV format
  convertToCSV: function(data) {
    // Simplified CSV conversion
    // In production, you'd want a more robust CSV library
    const headers = ['user_id', 'session_id', 'test_id', 'variant', 'event_type', 'timestamp'];
    let csv = headers.join(',') + '\n';
    
    // Add participation data
    Object.entries(data.rawData.variants || {}).forEach(([variant, variantData]) => {
      variantData.participants.forEach(participant => {
        csv += [
          participant.user_id,
          participant.session_id,
          data.testId,
          variant,
          'participation',
          participant.timestamp
        ].join(',') + '\n';
      });
      
      variantData.conversions.forEach(conversion => {
        csv += [
          conversion.user_id,
          conversion.session_id,
          data.testId,
          variant,
          `conversion_${conversion.conversion_type}`,
          conversion.timestamp
        ].join(',') + '\n';
      });
    });
    
    return csv;
  },

  // Helper methods for data storage and retrieval
  getUserId: function() {
    if (window.Storage) {
      let userId = Storage.getItem('ab_test_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        Storage.setItem('ab_test_user_id', userId);
      }
      return userId;
    }
    return `temp_${Math.random().toString(36).substr(2, 9)}`;
  },

  getSessionId: function() {
    if (window.Analytics && window.Analytics.state.sessionId) {
      return window.Analytics.state.sessionId;
    }
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  getUserVariant: function(testId) {
    return this.state.userVariants.get(testId);
  },

  setUserVariant: function(testId, variant) {
    this.state.userVariants.set(testId, variant);
    
    if (this.config.persistVariants && window.Storage) {
      const variants = Storage.getItem(this.config.storageKey) || {};
      variants[testId] = {
        variant: variant,
        timestamp: Date.now(),
        userId: this.state.userId
      };
      Storage.setItem(this.config.storageKey, variants);
    }
  },

  loadPersistedVariants: function() {
    if (!window.Storage) return;
    
    const variants = Storage.getItem(this.config.storageKey) || {};
    const now = Date.now();
    
    Object.entries(variants).forEach(([testId, data]) => {
      // Check if variant hasn't expired
      if (now - data.timestamp < this.config.cookieExpiry && data.userId === this.state.userId) {
        this.state.userVariants.set(testId, data.variant);
      }
    });
  },

  storeTestParticipation: function(testId, variant, data) {
    const testData = this.getStoredTestData(testId) || { variants: {} };
    
    if (!testData.variants[variant]) {
      testData.variants[variant] = {
        participants: [],
        conversions: [],
        interactions: []
      };
    }
    
    testData.variants[variant].participants.push(data);
    this.setStoredTestData(testId, testData);
  },

  storeTestConversion: function(testId, variant, conversionType, data) {
    const testData = this.getStoredTestData(testId) || { variants: {} };
    
    if (!testData.variants[variant]) {
      testData.variants[variant] = {
        participants: [],
        conversions: [],
        interactions: []
      };
    }
    
    testData.variants[variant].conversions.push(data);
    this.setStoredTestData(testId, testData);
  },

  storeTestInteraction: function(testId, variant, interactionType, data) {
    const testData = this.getStoredTestData(testId) || { variants: {} };
    
    if (!testData.variants[variant]) {
      testData.variants[variant] = {
        participants: [],
        conversions: [],
        interactions: []
      };
    }
    
    testData.variants[variant].interactions.push(data);
    this.setStoredTestData(testId, testData);
  },

  getStoredTestData: function(testId) {
    if (!window.Storage) return null;
    return Storage.getItem(`ab_test_data_${testId}`);
  },

  setStoredTestData: function(testId, data) {
    if (!window.Storage) return;
    Storage.setItem(`ab_test_data_${testId}`, data);
  },

  calculateAverageTimeInTest: function(conversions) {
    if (conversions.length === 0) return 0;
    
    const totalTime = conversions.reduce((sum, conversion) => {
      return sum + (conversion.time_in_test || 0);
    }, 0);
    
    return totalTime / conversions.length;
  },

  groupConversionsByType: function(conversions) {
    return conversions.reduce((acc, conversion) => {
      const type = conversion.conversion_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  },

  getTestStartDate: function(testId) {
    const testData = this.getStoredTestData(testId);
    if (!testData) return null;
    
    let earliestTimestamp = Date.now();
    Object.values(testData.variants || {}).forEach(variant => {
      variant.participants.forEach(participant => {
        if (participant.timestamp < earliestTimestamp) {
          earliestTimestamp = participant.timestamp;
        }
      });
    });
    
    return new Date(earliestTimestamp).toISOString();
  },

  getTestDuration: function(testId) {
    const startDate = this.getTestStartDate(testId);
    if (!startDate) return 0;
    
    return Date.now() - new Date(startDate).getTime();
  },

  trackEvent: function(eventName, data) {
    if (!this.config.trackingEnabled) return;
    
    // Use existing Analytics system if available
    if (window.Analytics) {
      window.Analytics.trackCustomEvent(eventName, data);
    } else {
      console.log('A/B Test Event:', eventName, data);
    }
  },

  // Clear all A/B test data (for privacy compliance)
  clearAllData: function() {
    if (!window.Storage) return;
    
    // Clear user variants
    Storage.removeItem(this.config.storageKey);
    Storage.removeItem('ab_test_user_id');
    
    // Clear test data
    Object.keys(this.tests).forEach(testId => {
      Storage.removeItem(`ab_test_data_${testId}`);
    });
    
    // Reset state
    this.state.userVariants.clear();
    this.state.activeTests.clear();
    this.state.testResults.clear();
    
    console.log('All A/B test data cleared');
  }
};

// Export for global use
window.ABTesting = ABTesting;