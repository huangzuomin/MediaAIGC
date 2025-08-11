// Enhanced Analytics utilities for standalone AI maturity assessment
const Analytics = {
  // Configuration
  config: {
    measurementId: 'GA_MEASUREMENT_ID',
    debug: false,
    enableOfflineTracking: true,
    batchSize: 10,
    flushInterval: 30000, // 30 seconds
    maxRetries: 3
  },

  // Internal state
  state: {
    initialized: false,
    sessionId: null,
    userId: null,
    offlineEvents: [],
    batchQueue: [],
    retryQueue: []
  },

  // Initialize enhanced analytics
  init: function(measurementId = this.config.measurementId, options = {}) {
    this.config = { ...this.config, ...options };
    
    // Generate session and user IDs
    this.state.sessionId = this.generateSessionId();
    this.state.userId = this.getUserId();
    
    if (typeof gtag !== 'undefined') {
      // Enhanced GA4 configuration
      gtag('config', measurementId, {
        page_title: 'AI Maturity Assessment',
        page_location: window.location.href,
        session_id: this.state.sessionId,
        user_id: this.state.userId,
        custom_map: {
          'custom_parameter_1': 'session_id',
          'custom_parameter_2': 'device_type',
          'custom_parameter_3': 'user_segment',
          'custom_parameter_4': 'conversion_source'
        },
        // Enhanced ecommerce and conversion tracking
        send_page_view: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: false, // Privacy compliant
        cookie_expires: 63072000, // 2 years
        cookie_update: true,
        cookie_flags: 'SameSite=None;Secure'
      });

      // Set user properties
      gtag('set', {
        user_id: this.state.userId,
        session_id: this.state.sessionId,
        device_type: this.getDeviceType(),
        user_segment: this.getUserSegment(),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      this.state.initialized = true;
      console.log('Enhanced Analytics initialized:', measurementId);
    } else {
      console.warn('Google Analytics not loaded, using offline mode');
    }

    // Initialize offline tracking
    if (this.config.enableOfflineTracking) {
      this.initOfflineTracking();
    }

    // Start batch processing
    this.startBatchProcessing();

    // Track initialization
    this.trackCustomEvent('analytics_initialized', {
      measurement_id: measurementId,
      session_id: this.state.sessionId,
      user_id: this.state.userId
    });
  },

  // Enhanced page view tracking
  trackPageView: function(pageName, additionalData = {}) {
    const eventData = {
      page_title: pageName,
      page_location: window.location.href,
      page_referrer: document.referrer,
      session_id: this.state.sessionId,
      user_id: this.state.userId,
      timestamp: new Date().toISOString(),
      ...this.getUserProperties(),
      ...additionalData
    };

    this.sendEvent('page_view', eventData);
    
    // Store for funnel analysis
    this.trackFunnelStep('page_view', {
      page_name: pageName,
      ...eventData
    });
    
    console.log('Enhanced page view tracked:', pageName, eventData);
  },

  // Enhanced assessment event tracking
  trackAssessmentEvent: function(eventName, data = {}) {
    const eventData = {
      event_category: 'assessment',
      event_label: eventName,
      session_id: this.state.sessionId,
      user_id: this.state.userId,
      timestamp: new Date().toISOString(),
      ...this.getUserProperties(),
      ...data
    };

    this.sendEvent(eventName, eventData);
    
    // Store for offline analysis
    this.storeOfflineEvent('assessment', eventName, eventData);
    
    // Update funnel tracking
    this.updateConversionFunnel(eventName, eventData);
    
    console.log('Enhanced assessment event tracked:', eventName, eventData);
  },

  // Enhanced conversion tracking with GA4 ecommerce events
  trackConversion: function(action, data = {}) {
    const conversionData = {
      event_category: 'conversion',
      event_label: action,
      value: data.value || 1,
      currency: 'CNY',
      session_id: this.state.sessionId,
      user_id: this.state.userId,
      conversion_source: this.getConversionSource(),
      timestamp: new Date().toISOString(),
      ...this.getUserProperties(),
      ...data
    };

    // Send as GA4 conversion event
    this.sendEvent('conversion', conversionData);
    
    // Also send as purchase event for ecommerce tracking
    if (action === 'consultation_request' || action === 'service_inquiry') {
      this.sendEvent('purchase', {
        transaction_id: this.generateTransactionId(),
        value: conversionData.value,
        currency: 'CNY',
        items: [{
          item_id: action,
          item_name: this.getConversionItemName(action),
          item_category: 'consultation',
          quantity: 1,
          price: conversionData.value
        }],
        ...conversionData
      });
    }
    
    // Store conversion for analysis
    this.storeConversionData(action, conversionData);
    
    // Update funnel completion
    this.trackFunnelStep('conversion', {
      conversion_action: action,
      ...conversionData
    });
    
    console.log('Enhanced conversion tracked:', action, conversionData);
  },

  // Track user engagement
  trackEngagement: function(action, data = {}) {
    const engagementData = {
      event_category: 'engagement',
      event_label: action,
      ...data
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'engagement', engagementData);
    }

    console.log('Engagement tracked:', action, engagementData);
  },

  // Track errors
  trackError: function(error, additionalData = {}) {
    const errorData = {
      event_category: 'error',
      event_label: error.message || 'Unknown error',
      description: error.stack || error.toString(),
      fatal: false,
      ...additionalData
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', errorData);
    }

    console.error('Error tracked:', error, errorData);
  },

  // Track timing events
  trackTiming: function(category, variable, value, label = '') {
    const timingData = {
      event_category: 'timing',
      name: variable,
      value: value,
      event_label: label
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', timingData);
    }

    console.log('Timing tracked:', category, variable, value, label);
  },

  // Track custom events
  trackCustomEvent: function(eventName, data = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }

    console.log('Custom event tracked:', eventName, data);
  },

  // Get user properties
  getUserProperties: function() {
    return {
      device_type: this.getDeviceType(),
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      user_agent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
  },

  // Detect device type
  getDeviceType: function() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  // Track session duration
  startSession: function(sessionId) {
    this.sessionStartTime = Date.now();
    this.sessionId = sessionId;
    
    this.trackCustomEvent('session_start', {
      session_id: sessionId,
      ...this.getUserProperties()
    });
  },

  endSession: function() {
    if (this.sessionStartTime) {
      const duration = Date.now() - this.sessionStartTime;
      
      this.trackTiming('session', 'duration', duration, this.sessionId);
      this.trackCustomEvent('session_end', {
        session_id: this.sessionId,
        duration: duration
      });
    }
  },

  // Enhanced assessment tracking
  trackQuestionView: function(questionId, questionNumber, dimension) {
    this.trackAssessmentEvent('question_view', {
      question_id: questionId,
      question_number: questionNumber,
      dimension: dimension,
      session_id: this.sessionId
    });
  },

  trackQuestionAnswer: function(questionId, questionNumber, answer, dimension) {
    this.trackAssessmentEvent('question_answered', {
      question_id: questionId,
      question_number: questionNumber,
      answer_value: answer,
      dimension: dimension,
      session_id: this.sessionId
    });
  },

  trackAssessmentComplete: function(result) {
    this.trackAssessmentEvent('assessment_completed', {
      result_level: result.level,
      result_score: result.score,
      session_id: this.sessionId,
      completion_time: result.completedAt
    });
  },

  trackResultView: function(result) {
    this.trackAssessmentEvent('result_viewed', {
      result_level: result.level,
      result_score: result.score,
      session_id: this.sessionId
    });
  },

  // Enhanced conversion funnel tracking
  trackFunnelStep: function(step, data = {}) {
    const funnelData = {
      step: step,
      step_number: this.getFunnelStepNumber(step),
      session_id: this.state.sessionId,
      user_id: this.state.userId,
      timestamp: new Date().toISOString(),
      time_since_start: this.getTimeSinceStart(),
      ...this.getUserProperties(),
      ...data
    };

    this.sendEvent('funnel_step', funnelData);
    
    // Store funnel progression
    this.storeFunnelProgression(step, funnelData);
    
    // Calculate funnel metrics
    this.calculateFunnelMetrics();
    
    console.log('Funnel step tracked:', step, funnelData);
  },

  // Get funnel step number for analysis
  getFunnelStepNumber: function(step) {
    const funnelSteps = {
      'page_view': 1,
      'assessment_start': 2,
      'question_1_answered': 3,
      'question_5_answered': 4,
      'question_10_answered': 5,
      'assessment_completed': 6,
      'result_viewed': 7,
      'share_initiated': 8,
      'conversion': 9
    };
    return funnelSteps[step] || 0;
  },

  // Store funnel progression for analysis
  storeFunnelProgression: function(step, data) {
    const funnelData = Storage.getItem('funnel_progression') || [];
    funnelData.push({
      step,
      data,
      timestamp: Date.now()
    });
    
    // Keep only last 50 steps to prevent storage bloat
    const trimmedData = funnelData.slice(-50);
    Storage.setItem('funnel_progression', trimmedData);
  },

  // Calculate funnel conversion rates
  calculateFunnelMetrics: function() {
    const funnelData = Storage.getItem('funnel_progression') || [];
    const stepCounts = {};
    
    funnelData.forEach(item => {
      stepCounts[item.step] = (stepCounts[item.step] || 0) + 1;
    });
    
    const metrics = {
      total_sessions: stepCounts['page_view'] || 0,
      assessment_starts: stepCounts['assessment_start'] || 0,
      assessment_completions: stepCounts['assessment_completed'] || 0,
      result_views: stepCounts['result_viewed'] || 0,
      conversions: stepCounts['conversion'] || 0,
      start_rate: this.calculateRate(stepCounts['assessment_start'], stepCounts['page_view']),
      completion_rate: this.calculateRate(stepCounts['assessment_completed'], stepCounts['assessment_start']),
      conversion_rate: this.calculateRate(stepCounts['conversion'], stepCounts['result_viewed']),
      overall_conversion: this.calculateRate(stepCounts['conversion'], stepCounts['page_view'])
    };
    
    Storage.setItem('funnel_metrics', metrics);
    
    // Send metrics to GA4
    this.sendEvent('funnel_metrics_calculated', metrics);
    
    return metrics;
  },

  // Calculate conversion rate
  calculateRate: function(numerator, denominator) {
    if (!denominator || denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100 * 100) / 100; // Round to 2 decimal places
  },

  // A/B testing support
  trackExperiment: function(experimentName, variant, data = {}) {
    this.trackCustomEvent('experiment_view', {
      experiment_name: experimentName,
      variant: variant,
      session_id: this.sessionId,
      ...data
    });
  },

  // Performance tracking
  trackPerformance: function() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaint = timing.responseStart - timing.navigationStart;

      this.trackTiming('performance', 'page_load_time', loadTime);
      this.trackTiming('performance', 'dom_ready_time', domReady);
      this.trackTiming('performance', 'first_paint_time', firstPaint);
    }
  },

  // Error boundary integration
  trackComponentError: function(error, errorInfo, componentStack) {
    this.trackError(error, {
      component_stack: componentStack,
      error_boundary: true,
      session_id: this.state.sessionId,
      user_id: this.state.userId
    });
  },

  // Offline tracking initialization
  initOfflineTracking: function() {
    // Load offline events from storage
    this.state.offlineEvents = Storage.getItem('offline_analytics_events') || [];
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Connection restored, syncing offline events');
      this.syncOfflineEvents();
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost, enabling offline mode');
    });
    
    // Sync offline events if online
    if (navigator.onLine) {
      this.syncOfflineEvents();
    }
  },

  // Store event for offline tracking
  storeOfflineEvent: function(category, eventName, data) {
    const offlineEvent = {
      id: this.generateEventId(),
      category,
      eventName,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    this.state.offlineEvents.push(offlineEvent);
    
    // Persist to storage
    Storage.setItem('offline_analytics_events', this.state.offlineEvents);
    
    // Try to sync if online
    if (navigator.onLine) {
      this.syncOfflineEvents();
    }
  },

  // Sync offline events when connection is restored
  syncOfflineEvents: function() {
    if (this.state.offlineEvents.length === 0) return;
    
    console.log(`Syncing ${this.state.offlineEvents.length} offline events`);
    
    const eventsToSync = [...this.state.offlineEvents];
    this.state.offlineEvents = [];
    
    eventsToSync.forEach(event => {
      if (event.retryCount < this.config.maxRetries) {
        this.sendEvent(event.eventName, event.data, true);
        event.retryCount++;
      } else {
        console.warn('Max retries reached for event:', event);
      }
    });
    
    // Clear synced events from storage
    Storage.setItem('offline_analytics_events', this.state.offlineEvents);
  },

  // Batch processing for performance
  startBatchProcessing: function() {
    setInterval(() => {
      this.processBatch();
    }, this.config.flushInterval);
  },

  // Process batched events
  processBatch: function() {
    if (this.state.batchQueue.length === 0) return;
    
    const batch = this.state.batchQueue.splice(0, this.config.batchSize);
    
    if (typeof gtag !== 'undefined' && navigator.onLine) {
      batch.forEach(event => {
        gtag('event', event.name, event.data);
      });
      console.log(`Processed batch of ${batch.length} events`);
    } else {
      // Add back to offline events if can't send
      batch.forEach(event => {
        this.storeOfflineEvent('batch', event.name, event.data);
      });
    }
  },

  // Enhanced event sending with batching and retry logic
  sendEvent: function(eventName, data, skipBatch = false) {
    // Check if analytics is paused
    if (this.isPaused()) {
      console.log('Analytics paused, event not sent:', eventName);
      return;
    }

    const eventData = {
      ...data,
      event_timestamp: Date.now(),
      ga_session_id: this.state.sessionId,
      ga_user_id: this.state.userId
    };

    if (skipBatch || !this.config.enableOfflineTracking) {
      // Send immediately
      if (typeof gtag !== 'undefined' && navigator.onLine) {
        gtag('event', eventName, eventData);
      } else {
        this.storeOfflineEvent('immediate', eventName, eventData);
      }
    } else {
      // Add to batch queue
      this.state.batchQueue.push({
        name: eventName,
        data: eventData
      });
    }
  },

  // Store conversion data for analysis
  storeConversionData: function(action, data) {
    const conversions = Storage.getItem('conversion_data') || [];
    conversions.push({
      action,
      data,
      timestamp: Date.now(),
      id: this.generateEventId()
    });
    
    // Keep only last 100 conversions
    const trimmedConversions = conversions.slice(-100);
    Storage.setItem('conversion_data', trimmedConversions);
  },

  // Get conversion source
  getConversionSource: function() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || 
           urlParams.get('source') || 
           document.referrer || 
           'direct';
  },

  // Generate transaction ID for ecommerce tracking
  generateTransactionId: function() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get conversion item name
  getConversionItemName: function(action) {
    const itemNames = {
      'consultation_request': '专家咨询服务',
      'service_inquiry': '服务咨询',
      'contact_form': '联系表单',
      'phone_call': '电话咨询',
      'email_inquiry': '邮件咨询'
    };
    return itemNames[action] || action;
  },

  // Generate unique event ID
  generateEventId: function() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Generate session ID
  generateSessionId: function() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get or generate user ID
  getUserId: function() {
    let userId = Storage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Storage.setItem('analytics_user_id', userId);
    }
    return userId;
  },

  // Get user segment for personalization
  getUserSegment: function() {
    // Determine user segment based on behavior or properties
    const hour = new Date().getHours();
    const isBusinessHours = hour >= 9 && hour <= 17;
    const deviceType = this.getDeviceType();
    
    if (isBusinessHours && deviceType === 'desktop') {
      return 'business_professional';
    } else if (deviceType === 'mobile') {
      return 'mobile_user';
    } else {
      return 'general_user';
    }
  },

  // Get time since session start
  getTimeSinceStart: function() {
    if (this.sessionStartTime) {
      return Date.now() - this.sessionStartTime;
    }
    return 0;
  },

  // Update conversion funnel
  updateConversionFunnel: function(eventName, data) {
    // Map events to funnel steps
    const funnelMapping = {
      'assessment_started': 'assessment_start',
      'question_answered': `question_${data.question_number}_answered`,
      'assessment_completed': 'assessment_completed',
      'result_viewed': 'result_viewed',
      'share_clicked': 'share_initiated',
      'conversion': 'conversion'
    };
    
    const funnelStep = funnelMapping[eventName];
    if (funnelStep) {
      this.trackFunnelStep(funnelStep, data);
    }
  },

  // Get comprehensive analytics report
  getAnalyticsReport: function() {
    const funnelMetrics = Storage.getItem('funnel_metrics') || {};
    const conversionData = Storage.getItem('conversion_data') || [];
    const offlineEvents = Storage.getItem('offline_analytics_events') || [];
    const funnelProgression = Storage.getItem('funnel_progression') || [];
    
    return {
      session: {
        sessionId: this.state.sessionId,
        userId: this.state.userId,
        startTime: this.sessionStartTime,
        duration: this.getTimeSinceStart()
      },
      funnel: funnelMetrics,
      conversions: {
        total: conversionData.length,
        recent: conversionData.slice(-10),
        byAction: this.groupConversionsByAction(conversionData)
      },
      offline: {
        pendingEvents: offlineEvents.length,
        events: offlineEvents
      },
      progression: funnelProgression.slice(-20), // Last 20 steps
      userProperties: this.getUserProperties()
    };
  },

  // Group conversions by action
  groupConversionsByAction: function(conversions) {
    return conversions.reduce((acc, conv) => {
      acc[conv.action] = (acc[conv.action] || 0) + 1;
      return acc;
    }, {});
  },

  // Export analytics data for analysis
  exportAnalyticsData: function() {
    const report = this.getAnalyticsReport();
    const exportData = {
      ...report,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  // Clear all analytics data (for privacy compliance)
  clearAnalyticsData: function() {
    Storage.removeItem('offline_analytics_events');
    Storage.removeItem('conversion_data');
    Storage.removeItem('funnel_metrics');
    Storage.removeItem('funnel_progression');
    Storage.removeItem('analytics_user_id');
    
    this.state.offlineEvents = [];
    this.state.batchQueue = [];
    this.state.userId = this.getUserId(); // Generate new user ID
    
    console.log('All analytics data cleared');
  },

  // Pause analytics tracking (for privacy compliance)
  pause: function() {
    console.log('Analytics tracking paused');
    this.state.paused = true;
  },

  // Resume analytics tracking
  resume: function() {
    console.log('Analytics tracking resumed');
    this.state.paused = false;
  },

  // Check if analytics is paused
  isPaused: function() {
    return this.state.paused || false;
  }
};

// Auto-initialize analytics when script loads
document.addEventListener('DOMContentLoaded', function() {
  Analytics.init();
  Analytics.trackPerformance();
});

// Track page unload
window.addEventListener('beforeunload', function() {
  Analytics.endSession();
});

// Export for global use
window.Analytics = Analytics;