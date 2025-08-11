// Analytics Validation and Testing Utilities
const AnalyticsValidator = {
  // Test configuration
  testConfig: {
    timeout: 5000,
    maxRetries: 3,
    expectedEvents: [
      'page_view',
      'assessment_started',
      'question_answered',
      'assessment_completed',
      'result_viewed'
    ]
  },

  // Validation results
  validationResults: {
    ga4Integration: null,
    eventTracking: null,
    conversionTracking: null,
    offlineTracking: null,
    dataStorage: null,
    funnelAnalysis: null
  },

  // Initialize validation
  init: function() {
    console.log('Initializing Analytics Validator...');
    this.runAllValidations();
  },

  // Run all validation tests
  runAllValidations: async function() {
    try {
      console.log('Running comprehensive analytics validation...');
      
      // Test GA4 integration
      this.validationResults.ga4Integration = await this.validateGA4Integration();
      
      // Test event tracking
      this.validationResults.eventTracking = await this.validateEventTracking();
      
      // Test conversion tracking
      this.validationResults.conversionTracking = await this.validateConversionTracking();
      
      // Test offline tracking
      this.validationResults.offlineTracking = await this.validateOfflineTracking();
      
      // Test data storage
      this.validationResults.dataStorage = await this.validateDataStorage();
      
      // Test funnel analysis
      this.validationResults.funnelAnalysis = await this.validateFunnelAnalysis();
      
      // Generate validation report
      const report = this.generateValidationReport();
      console.log('Analytics Validation Report:', report);
      
      return report;
    } catch (error) {
      console.error('Error during analytics validation:', error);
      return { success: false, error: error.message };
    }
  },

  // Validate GA4 integration
  validateGA4Integration: async function() {
    console.log('Validating GA4 integration...');
    
    const tests = {
      gtagLoaded: typeof gtag !== 'undefined',
      dataLayerExists: Array.isArray(window.dataLayer),
      configurationSet: false,
      measurementIdValid: false
    };

    // Check if gtag configuration was called
    if (tests.gtagLoaded && tests.dataLayerExists) {
      const configEvents = window.dataLayer.filter(event => 
        Array.isArray(event) && event[0] === 'config'
      );
      tests.configurationSet = configEvents.length > 0;
      
      if (configEvents.length > 0) {
        const measurementId = configEvents[0][1];
        tests.measurementIdValid = measurementId && measurementId !== 'GA_MEASUREMENT_ID';
      }
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'GA4 integration is properly configured' : 'GA4 integration has issues'
    };
  },

  // Validate event tracking
  validateEventTracking: async function() {
    console.log('Validating event tracking...');
    
    const tests = {
      analyticsObjectExists: typeof Analytics !== 'undefined',
      trackingMethodsExist: false,
      eventsCanBeSent: false,
      customEventsWork: false
    };

    if (tests.analyticsObjectExists) {
      // Check if required methods exist
      const requiredMethods = [
        'trackPageView',
        'trackAssessmentEvent',
        'trackConversion',
        'trackCustomEvent'
      ];
      
      tests.trackingMethodsExist = requiredMethods.every(method => 
        typeof Analytics[method] === 'function'
      );

      // Test event sending
      try {
        Analytics.trackCustomEvent('validation_test', {
          test: true,
          timestamp: Date.now()
        });
        tests.eventsCanBeSent = true;
        tests.customEventsWork = true;
      } catch (error) {
        console.error('Error testing event tracking:', error);
      }
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'Event tracking is working correctly' : 'Event tracking has issues'
    };
  },

  // Validate conversion tracking
  validateConversionTracking: async function() {
    console.log('Validating conversion tracking...');
    
    const tests = {
      conversionMethodExists: typeof Analytics !== 'undefined' && 
                             typeof Analytics.trackConversion === 'function',
      conversionConfigExists: typeof AnalyticsConfig !== 'undefined' &&
                             AnalyticsConfig.ga4 && 
                             AnalyticsConfig.ga4.conversions,
      ecommerceTrackingWorks: false,
      conversionDataStored: false
    };

    if (tests.conversionMethodExists) {
      try {
        // Test conversion tracking
        Analytics.trackConversion('test_conversion', {
          value: 1,
          test: true
        });
        
        // Check if conversion data is stored
        const conversionData = Storage.getConversionData();
        tests.conversionDataStored = Array.isArray(conversionData);
        tests.ecommerceTrackingWorks = true;
      } catch (error) {
        console.error('Error testing conversion tracking:', error);
      }
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'Conversion tracking is working correctly' : 'Conversion tracking has issues'
    };
  },

  // Validate offline tracking
  validateOfflineTracking: async function() {
    console.log('Validating offline tracking...');
    
    const tests = {
      offlineStorageExists: typeof Storage !== 'undefined',
      offlineEventsCanBeStored: false,
      offlineEventsSyncable: false,
      networkStatusDetected: 'onLine' in navigator
    };

    if (tests.offlineStorageExists) {
      try {
        // Test offline event storage
        const testEvent = {
          event_name: 'offline_test',
          timestamp: Date.now(),
          test: true
        };
        
        Storage.saveAnalyticsData(testEvent);
        const storedEvents = Storage.getAnalyticsData();
        tests.offlineEventsCanBeStored = storedEvents.some(event => event.test === true);
        
        // Test sync capability
        if (typeof Analytics !== 'undefined' && Analytics.syncOfflineEvents) {
          tests.offlineEventsSyncable = true;
        }
      } catch (error) {
        console.error('Error testing offline tracking:', error);
      }
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'Offline tracking is working correctly' : 'Offline tracking has issues'
    };
  },

  // Validate data storage
  validateDataStorage: async function() {
    console.log('Validating data storage...');
    
    const tests = {
      localStorageAvailable: Storage.isAvailable(),
      analyticsDataCanBeSaved: false,
      funnelDataCanBeSaved: false,
      dataCanBeRetrieved: false,
      dataCanBeCleared: false
    };

    try {
      // Test analytics data storage
      const testAnalyticsData = {
        event_name: 'storage_test',
        timestamp: Date.now(),
        test: true
      };
      
      Storage.saveAnalyticsData(testAnalyticsData);
      tests.analyticsDataCanBeSaved = true;
      
      // Test funnel data storage
      Storage.saveFunnelData('test_step', { test: true });
      tests.funnelDataCanBeSaved = true;
      
      // Test data retrieval
      const retrievedData = Storage.getAnalyticsData();
      tests.dataCanBeRetrieved = Array.isArray(retrievedData) && 
                                retrievedData.some(item => item.test === true);
      
      // Test data clearing (but don't actually clear all data)
      const testKey = 'validation_test_key';
      Storage.setItem(testKey, { test: true });
      Storage.removeItem(testKey);
      tests.dataCanBeCleared = Storage.getItem(testKey) === null;
      
    } catch (error) {
      console.error('Error testing data storage:', error);
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'Data storage is working correctly' : 'Data storage has issues'
    };
  },

  // Validate funnel analysis
  validateFunnelAnalysis: async function() {
    console.log('Validating funnel analysis...');
    
    const tests = {
      funnelTrackingExists: typeof Analytics !== 'undefined' && 
                           typeof Analytics.trackFunnelStep === 'function',
      funnelConfigExists: typeof AnalyticsConfig !== 'undefined' &&
                         AnalyticsConfig.funnel && 
                         Array.isArray(AnalyticsConfig.funnel.steps),
      funnelMetricsCalculated: false,
      funnelDataStored: false
    };

    if (tests.funnelTrackingExists) {
      try {
        // Test funnel step tracking
        Analytics.trackFunnelStep('validation_test', {
          test: true,
          timestamp: Date.now()
        });
        
        // Check if funnel data is stored
        const funnelData = Storage.getFunnelData();
        tests.funnelDataStored = Array.isArray(funnelData);
        
        // Test funnel metrics calculation
        if (typeof Analytics.calculateFunnelMetrics === 'function') {
          const metrics = Analytics.calculateFunnelMetrics();
          tests.funnelMetricsCalculated = typeof metrics === 'object' && metrics !== null;
        }
      } catch (error) {
        console.error('Error testing funnel analysis:', error);
      }
    }

    const success = Object.values(tests).every(test => test === true);
    
    return {
      success,
      tests,
      message: success ? 'Funnel analysis is working correctly' : 'Funnel analysis has issues'
    };
  },

  // Generate comprehensive validation report
  generateValidationReport: function() {
    const results = this.validationResults;
    const overallSuccess = Object.values(results).every(result => 
      result && result.success === true
    );
    
    const summary = {
      overallSuccess,
      timestamp: new Date().toISOString(),
      totalTests: Object.keys(results).length,
      passedTests: Object.values(results).filter(result => 
        result && result.success === true
      ).length,
      failedTests: Object.values(results).filter(result => 
        result && result.success === false
      ).length
    };

    const detailedResults = {};
    Object.entries(results).forEach(([category, result]) => {
      if (result) {
        detailedResults[category] = {
          success: result.success,
          message: result.message,
          tests: result.tests
        };
      }
    });

    const recommendations = this.generateRecommendations(results);

    return {
      summary,
      results: detailedResults,
      recommendations,
      debugInfo: this.getDebugInfo()
    };
  },

  // Generate recommendations based on validation results
  generateRecommendations: function(results) {
    const recommendations = [];

    if (!results.ga4Integration?.success) {
      recommendations.push({
        category: 'GA4 Integration',
        priority: 'high',
        message: 'Fix Google Analytics 4 integration issues',
        actions: [
          'Verify GA4 measurement ID is correctly set',
          'Check if gtag library is properly loaded',
          'Ensure dataLayer is initialized before gtag calls'
        ]
      });
    }

    if (!results.eventTracking?.success) {
      recommendations.push({
        category: 'Event Tracking',
        priority: 'high',
        message: 'Fix event tracking functionality',
        actions: [
          'Verify Analytics object is properly initialized',
          'Check if all required tracking methods exist',
          'Test event sending in browser network tab'
        ]
      });
    }

    if (!results.conversionTracking?.success) {
      recommendations.push({
        category: 'Conversion Tracking',
        priority: 'medium',
        message: 'Improve conversion tracking setup',
        actions: [
          'Configure conversion events in GA4',
          'Set up ecommerce tracking properly',
          'Verify conversion data storage'
        ]
      });
    }

    if (!results.offlineTracking?.success) {
      recommendations.push({
        category: 'Offline Tracking',
        priority: 'medium',
        message: 'Fix offline tracking capabilities',
        actions: [
          'Implement proper offline event storage',
          'Add network status detection',
          'Create sync mechanism for offline events'
        ]
      });
    }

    if (!results.dataStorage?.success) {
      recommendations.push({
        category: 'Data Storage',
        priority: 'high',
        message: 'Fix data storage issues',
        actions: [
          'Check localStorage availability',
          'Implement fallback storage mechanism',
          'Add proper error handling for storage operations'
        ]
      });
    }

    if (!results.funnelAnalysis?.success) {
      recommendations.push({
        category: 'Funnel Analysis',
        priority: 'low',
        message: 'Improve funnel analysis functionality',
        actions: [
          'Configure funnel steps properly',
          'Implement funnel metrics calculation',
          'Add funnel visualization'
        ]
      });
    }

    return recommendations;
  },

  // Get debug information
  getDebugInfo: function() {
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      localStorage: Storage.isAvailable(),
      onlineStatus: navigator.onLine,
      screenSize: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      analyticsLoaded: typeof Analytics !== 'undefined',
      gtagLoaded: typeof gtag !== 'undefined',
      dataLayerSize: window.dataLayer ? window.dataLayer.length : 0,
      storageUsage: Storage.getStorageInfo()
    };
  },

  // Run quick validation (subset of tests)
  runQuickValidation: function() {
    const quickTests = {
      ga4Loaded: typeof gtag !== 'undefined',
      analyticsLoaded: typeof Analytics !== 'undefined',
      storageAvailable: Storage.isAvailable(),
      configLoaded: typeof AnalyticsConfig !== 'undefined'
    };

    const success = Object.values(quickTests).every(test => test === true);
    
    return {
      success,
      tests: quickTests,
      message: success ? 'Quick validation passed' : 'Quick validation failed'
    };
  },

  // Export validation report
  exportValidationReport: function() {
    const report = this.generateValidationReport();
    const exportData = {
      ...report,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }
};

// Auto-run validation in debug mode
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') === 'true' || 
                   urlParams.get('validate') === 'true' ||
                   window.location.hostname === 'localhost';
  
  if (debugMode) {
    setTimeout(() => {
      AnalyticsValidator.init();
    }, 2000); // Wait for other components to initialize
  }
});

// Export for global use
window.AnalyticsValidator = AnalyticsValidator;