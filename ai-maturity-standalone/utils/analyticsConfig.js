// Analytics Configuration and Setup
const AnalyticsConfig = {
  // Google Analytics 4 Configuration
  ga4: {
    measurementId: 'GA_MEASUREMENT_ID', // Replace with actual measurement ID
    
    // Enhanced measurement settings
    enhancedMeasurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: false,
      video_engagement: false,
      file_downloads: true,
      page_changes: true
    },
    
    // Custom dimensions mapping
    customDimensions: {
      session_id: 'custom_parameter_1',
      device_type: 'custom_parameter_2',
      user_segment: 'custom_parameter_3',
      conversion_source: 'custom_parameter_4',
      assessment_level: 'custom_parameter_5',
      question_dimension: 'custom_parameter_6',
      completion_time: 'custom_parameter_7',
      referrer_type: 'custom_parameter_8'
    },
    
    // Conversion events configuration
    conversions: {
      assessment_completed: {
        event_name: 'assessment_completed',
        conversion_id: 'GA_MEASUREMENT_ID/assessment_completed',
        value: 10, // Assign value for conversion tracking
        currency: 'CNY'
      },
      consultation_request: {
        event_name: 'consultation_request',
        conversion_id: 'GA_MEASUREMENT_ID/consultation_request',
        value: 100,
        currency: 'CNY'
      },
      service_inquiry: {
        event_name: 'service_inquiry',
        conversion_id: 'GA_MEASUREMENT_ID/service_inquiry',
        value: 50,
        currency: 'CNY'
      },
      email_signup: {
        event_name: 'email_signup',
        conversion_id: 'GA_MEASUREMENT_ID/email_signup',
        value: 25,
        currency: 'CNY'
      }
    },
    
    // Ecommerce items configuration
    ecommerceItems: {
      consultation_request: {
        item_id: 'consultation_001',
        item_name: '专家咨询服务',
        item_category: 'consultation',
        item_category2: 'ai_maturity',
        item_brand: '智媒变革中心',
        price: 100
      },
      assessment_report: {
        item_id: 'report_001',
        item_name: 'AI成熟度评估报告',
        item_category: 'report',
        item_category2: 'assessment',
        item_brand: '智媒变革中心',
        price: 50
      }
    }
  },
  
  // Event tracking configuration
  events: {
    // Assessment events
    assessment: {
      started: {
        event_name: 'assessment_started',
        event_category: 'assessment',
        event_label: 'user_started_assessment'
      },
      question_viewed: {
        event_name: 'question_viewed',
        event_category: 'assessment',
        event_label: 'question_displayed'
      },
      question_answered: {
        event_name: 'question_answered',
        event_category: 'assessment',
        event_label: 'question_completed'
      },
      completed: {
        event_name: 'assessment_completed',
        event_category: 'assessment',
        event_label: 'assessment_finished'
      },
      abandoned: {
        event_name: 'assessment_abandoned',
        event_category: 'assessment',
        event_label: 'user_left_assessment'
      }
    },
    
    // Result events
    results: {
      viewed: {
        event_name: 'result_viewed',
        event_category: 'results',
        event_label: 'result_displayed'
      },
      shared: {
        event_name: 'result_shared',
        event_category: 'results',
        event_label: 'result_shared'
      },
      downloaded: {
        event_name: 'result_downloaded',
        event_category: 'results',
        event_label: 'result_pdf_downloaded'
      }
    },
    
    // Conversion events
    conversion: {
      consultation_clicked: {
        event_name: 'consultation_clicked',
        event_category: 'conversion',
        event_label: 'consultation_cta_clicked'
      },
      contact_form_opened: {
        event_name: 'contact_form_opened',
        event_category: 'conversion',
        event_label: 'contact_form_displayed'
      },
      phone_number_clicked: {
        event_name: 'phone_clicked',
        event_category: 'conversion',
        event_label: 'phone_number_clicked'
      },
      email_clicked: {
        event_name: 'email_clicked',
        event_category: 'conversion',
        event_label: 'email_address_clicked'
      }
    },
    
    // Engagement events
    engagement: {
      scroll_depth: {
        event_name: 'scroll_depth',
        event_category: 'engagement',
        event_label: 'page_scroll_percentage'
      },
      time_on_page: {
        event_name: 'time_on_page',
        event_category: 'engagement',
        event_label: 'page_engagement_time'
      },
      button_clicked: {
        event_name: 'button_clicked',
        event_category: 'engagement',
        event_label: 'ui_interaction'
      }
    }
  },
  
  // Funnel configuration
  funnel: {
    steps: [
      {
        name: 'page_view',
        displayName: '页面访问',
        order: 1,
        required: true
      },
      {
        name: 'assessment_start',
        displayName: '开始测试',
        order: 2,
        required: true
      },
      {
        name: 'question_1_answered',
        displayName: '第1题完成',
        order: 3,
        required: false
      },
      {
        name: 'question_5_answered',
        displayName: '第5题完成',
        order: 4,
        required: false
      },
      {
        name: 'question_10_answered',
        displayName: '第10题完成',
        order: 5,
        required: false
      },
      {
        name: 'assessment_completed',
        displayName: '测试完成',
        order: 6,
        required: true
      },
      {
        name: 'result_viewed',
        displayName: '查看结果',
        order: 7,
        required: true
      },
      {
        name: 'share_initiated',
        displayName: '分享结果',
        order: 8,
        required: false
      },
      {
        name: 'conversion',
        displayName: '转化行为',
        order: 9,
        required: false
      }
    ],
    
    // Funnel goals
    goals: {
      primary: 'assessment_completed',
      secondary: 'result_viewed',
      conversion: 'conversion'
    }
  },
  
  // User segmentation
  segments: {
    device: {
      mobile: 'width < 768px',
      tablet: '768px <= width < 1024px',
      desktop: 'width >= 1024px'
    },
    
    behavior: {
      quick_completer: 'completion_time < 180', // Less than 3 minutes
      thorough_user: 'completion_time > 300', // More than 5 minutes
      returner: 'previous_sessions > 0'
    },
    
    source: {
      direct: 'referrer === ""',
      social: 'referrer includes social platforms',
      search: 'referrer includes search engines',
      referral: 'referrer includes other domains'
    }
  },
  
  // Privacy and compliance settings
  privacy: {
    anonymizeIP: true,
    respectDoNotTrack: true,
    cookieConsent: true,
    dataRetentionDays: 90,
    allowPersonalization: false
  },
  
  // Performance settings
  performance: {
    batchSize: 10,
    flushInterval: 30000, // 30 seconds
    maxRetries: 3,
    enableOfflineTracking: true,
    compressionEnabled: true
  },
  
  // Debug settings
  debug: {
    enabled: false, // Set to true for development
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    showConsoleEvents: false,
    enableTestMode: false
  }
};

// Initialize analytics with configuration
const initializeAnalytics = () => {
  // Set debug mode based on environment
  const isDebug = window.location.hostname === 'localhost' || 
                  window.location.search.includes('debug=true');
  
  AnalyticsConfig.debug.enabled = isDebug;
  AnalyticsConfig.debug.showConsoleEvents = isDebug;
  
  // Initialize Analytics with configuration
  if (typeof Analytics !== 'undefined') {
    Analytics.init(AnalyticsConfig.ga4.measurementId, {
      debug: AnalyticsConfig.debug.enabled,
      enableOfflineTracking: AnalyticsConfig.performance.enableOfflineTracking,
      batchSize: AnalyticsConfig.performance.batchSize,
      flushInterval: AnalyticsConfig.performance.flushInterval,
      maxRetries: AnalyticsConfig.performance.maxRetries
    });
    
    console.log('Analytics initialized with configuration');
  }
};

// Helper functions for event tracking
const trackConfiguredEvent = (category, action, additionalData = {}) => {
  const eventConfig = AnalyticsConfig.events[category]?.[action];
  
  if (eventConfig && typeof Analytics !== 'undefined') {
    Analytics.trackCustomEvent(eventConfig.event_name, {
      event_category: eventConfig.event_category,
      event_label: eventConfig.event_label,
      ...additionalData
    });
  }
};

// Helper function for conversion tracking
const trackConfiguredConversion = (conversionType, additionalData = {}) => {
  const conversionConfig = AnalyticsConfig.ga4.conversions[conversionType];
  
  if (conversionConfig && typeof Analytics !== 'undefined') {
    Analytics.trackConversion(conversionType, {
      value: conversionConfig.value,
      currency: conversionConfig.currency,
      ...additionalData
    });
  }
};

// Helper function for ecommerce tracking
const trackEcommerceEvent = (eventType, itemType, additionalData = {}) => {
  const itemConfig = AnalyticsConfig.ga4.ecommerceItems[itemType];
  
  if (itemConfig && typeof Analytics !== 'undefined') {
    const eventData = {
      currency: 'CNY',
      value: itemConfig.price,
      items: [{
        ...itemConfig,
        quantity: 1,
        ...additionalData.itemData
      }],
      ...additionalData
    };
    
    Analytics.sendEvent(eventType, eventData);
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAnalytics);

// Export configuration and helpers
window.AnalyticsConfig = AnalyticsConfig;
window.trackConfiguredEvent = trackConfiguredEvent;
window.trackConfiguredConversion = trackConfiguredConversion;
window.trackEcommerceEvent = trackEcommerceEvent;