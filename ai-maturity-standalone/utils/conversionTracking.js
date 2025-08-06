// Comprehensive Conversion Tracking and Analytics
const ConversionTracking = {
  // Conversion events configuration
  events: {
    consultation_click: {
      category: 'conversion',
      action: 'consultation_request',
      value: 100, // Estimated value
      priority: 'high'
    },
    learn_more_click: {
      category: 'engagement',
      action: 'learn_more',
      value: 20,
      priority: 'medium'
    },
    restart_click: {
      category: 'engagement',
      action: 'restart_assessment',
      value: 10,
      priority: 'low'
    },
    share_click: {
      category: 'viral',
      action: 'share_result',
      value: 30,
      priority: 'medium'
    },
    external_link_click: {
      category: 'conversion',
      action: 'external_navigation',
      value: 50,
      priority: 'high'
    }
  },

  // Conversion funnel stages
  funnelStages: {
    page_load: { stage: 1, name: '页面加载' },
    assessment_start: { stage: 2, name: '开始测评' },
    assessment_progress: { stage: 3, name: '测评进行中' },
    assessment_complete: { stage: 4, name: '完成测评' },
    result_view: { stage: 5, name: '查看结果' },
    cta_view: { stage: 6, name: '查看转化引导' },
    conversion_intent: { stage: 7, name: '转化意向' },
    conversion_complete: { stage: 8, name: '转化完成' }
  },

  // User session data
  sessionData: {
    sessionId: null,
    startTime: null,
    currentStage: 1,
    events: [],
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    utmParams: null
  },

  // Initialize tracking
  init: function() {
    this.sessionData.sessionId = this.generateSessionId();
    this.sessionData.startTime = Date.now();
    this.sessionData.utmParams = this.extractUTMParams();
    
    // Track initial page load
    this.trackFunnelStage('page_load', {
      referrer: document.referrer,
      utm_params: this.sessionData.utmParams,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });

    // Set up exit intent tracking
    this.setupExitIntentTracking();
    
    // Set up scroll tracking
    this.setupScrollTracking();
    
    // Set up time on page tracking
    this.setupTimeTracking();

    return this.sessionData.sessionId;
  },

  // Generate unique session ID
  generateSessionId: function() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Extract UTM parameters
  extractUTMParams: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });

    return Object.keys(utmParams).length > 0 ? utmParams : null;
  },

  // Track conversion events
  trackConversion: function(eventType, data = {}) {
    const eventConfig = this.events[eventType];
    if (!eventConfig) {
      console.warn('Unknown conversion event:', eventType);
      return;
    }

    const eventData = {
      event_type: eventType,
      session_id: this.sessionData.sessionId,
      timestamp: Date.now(),
      category: eventConfig.category,
      action: eventConfig.action,
      value: eventConfig.value,
      priority: eventConfig.priority,
      ...data
    };

    // Add to session events
    this.sessionData.events.push(eventData);

    // Send to analytics
    this.sendToAnalytics(eventData);

    // Send to conversion tracking
    this.sendToConversionAPI(eventData);

    // Update funnel stage if applicable
    if (eventType === 'consultation_click' || eventType === 'external_link_click') {
      this.trackFunnelStage('conversion_intent', eventData);
    }

    return eventData;
  },

  // Track funnel progression
  trackFunnelStage: function(stageName, data = {}) {
    const stage = this.funnelStages[stageName];
    if (!stage) {
      console.warn('Unknown funnel stage:', stageName);
      return;
    }

    // Only progress forward in the funnel
    if (stage.stage > this.sessionData.currentStage) {
      this.sessionData.currentStage = stage.stage;
    }

    const stageData = {
      event_type: 'funnel_stage',
      session_id: this.sessionData.sessionId,
      stage_name: stageName,
      stage_number: stage.stage,
      stage_display_name: stage.name,
      timestamp: Date.now(),
      time_since_start: Date.now() - this.sessionData.startTime,
      ...data
    };

    this.sessionData.events.push(stageData);
    this.sendToAnalytics(stageData);

    return stageData;
  },

  // Track A/B test variants
  trackABTest: function(testName, variant, data = {}) {
    const testData = {
      event_type: 'ab_test',
      session_id: this.sessionData.sessionId,
      test_name: testName,
      variant: variant,
      timestamp: Date.now(),
      ...data
    };

    this.sessionData.events.push(testData);
    this.sendToAnalytics(testData);

    return testData;
  },

  // Track user engagement
  trackEngagement: function(engagementType, data = {}) {
    const engagementData = {
      event_type: 'engagement',
      session_id: this.sessionData.sessionId,
      engagement_type: engagementType,
      timestamp: Date.now(),
      time_since_start: Date.now() - this.sessionData.startTime,
      ...data
    };

    this.sessionData.events.push(engagementData);
    this.sendToAnalytics(engagementData);

    return engagementData;
  },

  // Setup exit intent tracking
  setupExitIntentTracking: function() {
    let exitIntentTriggered = false;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        this.trackEngagement('exit_intent', {
          mouse_position: { x: e.clientX, y: e.clientY },
          time_on_page: Date.now() - this.sessionData.startTime,
          current_stage: this.sessionData.currentStage
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
  },

  // Setup scroll tracking
  setupScrollTracking: function() {
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const triggeredMilestones = new Set();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !triggeredMilestones.has(milestone)) {
          triggeredMilestones.add(milestone);
          this.trackEngagement('scroll_milestone', {
            milestone: milestone,
            max_scroll: maxScroll,
            time_to_milestone: Date.now() - this.sessionData.startTime
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  // Setup time tracking
  setupTimeTracking: function() {
    const timeMilestones = [30, 60, 120, 300, 600]; // seconds
    const triggeredTimes = new Set();

    setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
      
      timeMilestones.forEach(milestone => {
        if (timeOnPage >= milestone && !triggeredTimes.has(milestone)) {
          triggeredTimes.add(milestone);
          this.trackEngagement('time_milestone', {
            milestone: milestone,
            total_time: timeOnPage,
            current_stage: this.sessionData.currentStage
          });
        }
      });
    }, 10000); // Check every 10 seconds
  },

  // Send data to analytics
  sendToAnalytics: function(data) {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', data.event_type, {
        event_category: data.category || 'conversion',
        event_label: data.action || data.event_type,
        value: data.value || 0,
        custom_parameters: {
          session_id: data.session_id,
          priority: data.priority,
          timestamp: data.timestamp
        }
      });
    }

    // Custom Analytics
    if (window.Analytics) {
      window.Analytics.trackCustomEvent(data.event_type, data);
    }
  },

  // Send to conversion API
  sendToConversionAPI: function(data) {
    // In a real implementation, this would send to your conversion tracking API
    // For now, we'll store in localStorage for analysis
    try {
      const conversionData = JSON.parse(localStorage.getItem('conversion_events') || '[]');
      conversionData.push(data);
      
      // Keep only last 100 events
      if (conversionData.length > 100) {
        conversionData.splice(0, conversionData.length - 100);
      }
      
      localStorage.setItem('conversion_events', JSON.stringify(conversionData));
    } catch (e) {
      console.warn('Could not save conversion data:', e);
    }

    // Example API call (commented out)
    // fetch('/api/conversions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).catch(err => console.log('Conversion API failed:', err));
  },

  // Get conversion statistics
  getConversionStats: function() {
    try {
      const events = JSON.parse(localStorage.getItem('conversion_events') || '[]');
      const sessionEvents = events.filter(e => e.session_id === this.sessionData.sessionId);
      
      return {
        totalEvents: events.length,
        sessionEvents: sessionEvents.length,
        conversionEvents: events.filter(e => e.category === 'conversion').length,
        engagementEvents: events.filter(e => e.category === 'engagement').length,
        currentStage: this.sessionData.currentStage,
        timeOnPage: Date.now() - this.sessionData.startTime,
        sessionId: this.sessionData.sessionId
      };
    } catch (e) {
      return {
        totalEvents: 0,
        sessionEvents: 0,
        conversionEvents: 0,
        engagementEvents: 0,
        currentStage: this.sessionData.currentStage,
        timeOnPage: Date.now() - this.sessionData.startTime,
        sessionId: this.sessionData.sessionId
      };
    }
  },

  // Generate conversion report
  generateReport: function() {
    const stats = this.getConversionStats();
    const events = this.sessionData.events;
    
    // Calculate conversion rate
    const totalSessions = 1; // Current session
    const conversions = events.filter(e => 
      e.event_type === 'consultation_click' || e.event_type === 'external_link_click'
    ).length;
    
    const conversionRate = conversions > 0 ? (conversions / totalSessions) * 100 : 0;

    // Calculate engagement metrics
    const engagementEvents = events.filter(e => e.category === 'engagement');
    const avgTimeOnPage = stats.timeOnPage / 1000; // Convert to seconds
    
    // Funnel analysis
    const funnelProgress = {};
    Object.keys(this.funnelStages).forEach(stage => {
      const stageEvents = events.filter(e => e.stage_name === stage);
      funnelProgress[stage] = stageEvents.length > 0;
    });

    return {
      sessionId: this.sessionData.sessionId,
      conversionRate: conversionRate.toFixed(2),
      totalEvents: stats.totalEvents,
      engagementScore: engagementEvents.length,
      timeOnPage: avgTimeOnPage.toFixed(0),
      currentStage: stats.currentStage,
      funnelProgress: funnelProgress,
      utmParams: this.sessionData.utmParams,
      events: events,
      generatedAt: new Date().toISOString()
    };
  },

  // Track specific conversion actions
  trackConsultationClick: function(data = {}) {
    return this.trackConversion('consultation_click', {
      ...data,
      conversion_type: 'consultation',
      lead_quality: this.assessLeadQuality(data)
    });
  },

  trackLearnMoreClick: function(data = {}) {
    return this.trackConversion('learn_more_click', {
      ...data,
      engagement_level: this.assessEngagementLevel()
    });
  },

  trackExternalNavigation: function(url, data = {}) {
    return this.trackConversion('external_link_click', {
      ...data,
      destination_url: url,
      navigation_type: 'external'
    });
  },

  // Assess lead quality based on behavior
  assessLeadQuality: function(data = {}) {
    let score = 0;
    
    // Time on page (higher is better)
    const timeOnPage = (Date.now() - this.sessionData.startTime) / 1000;
    if (timeOnPage > 300) score += 3; // 5+ minutes
    else if (timeOnPage > 120) score += 2; // 2+ minutes
    else if (timeOnPage > 60) score += 1; // 1+ minute
    
    // Assessment completion
    if (data.result_level) score += 2;
    
    // High maturity level (more likely to convert)
    if (['L4', 'L5'].includes(data.result_level)) score += 2;
    else if (['L2', 'L3'].includes(data.result_level)) score += 1;
    
    // Engagement events
    const engagementEvents = this.sessionData.events.filter(e => e.category === 'engagement');
    score += Math.min(engagementEvents.length, 3);
    
    // UTM source (organic/direct traffic often higher quality)
    if (!this.sessionData.utmParams) score += 1; // Direct traffic
    else if (this.sessionData.utmParams.utm_source === 'organic') score += 1;
    
    return Math.min(score, 10); // Cap at 10
  },

  // Assess engagement level
  assessEngagementLevel: function() {
    const timeOnPage = (Date.now() - this.sessionData.startTime) / 1000;
    const engagementEvents = this.sessionData.events.filter(e => e.category === 'engagement').length;
    const currentStage = this.sessionData.currentStage;
    
    let level = 'low';
    
    if (timeOnPage > 180 && engagementEvents > 3 && currentStage >= 6) {
      level = 'high';
    } else if (timeOnPage > 60 && engagementEvents > 1 && currentStage >= 4) {
      level = 'medium';
    }
    
    return level;
  },

  // Clean up on page unload
  cleanup: function() {
    // Track session end
    this.trackEngagement('session_end', {
      total_time: Date.now() - this.sessionData.startTime,
      final_stage: this.sessionData.currentStage,
      total_events: this.sessionData.events.length
    });
  }
};

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ConversionTracking.init());
} else {
  ConversionTracking.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => ConversionTracking.cleanup());

// Export for global use
window.ConversionTracking = ConversionTracking;