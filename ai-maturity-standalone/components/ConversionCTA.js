// Enhanced Conversion CTA Component with Personalized Messaging
function ConversionCTA({ result, variant = 'primary', onConsult, onLearnMore, onRestart, isMobile = false }) {
  const [ctaVariant, setCtaVariant] = React.useState(variant);
  const [isTracking, setIsTracking] = React.useState(false);
  const [showUrgency, setShowUrgency] = React.useState(false);

  // A/B testing variants
  const variants = {
    primary: {
      title: '想要获得专业指导？',
      description: '我们的AI转型专家可以为您提供更详细的诊断和定制化解决方案',
      consultText: '预约专家咨询',
      learnMoreText: '了解更多服务'
    },
    urgent: {
      title: '立即获取专业AI转型方案！',
      description: '基于您的评估结果，我们为您准备了专属的转型建议。限时免费咨询！',
      consultText: '立即预约咨询',
      learnMoreText: '查看转型方案'
    },
    value: {
      title: '免费获取价值¥5000的AI转型报告',
      description: '根据您的测试结果，我们将为您定制专业的AI转型路线图和实施建议',
      consultText: '免费获取报告',
      learnMoreText: '了解服务详情'
    },
    social: {
      title: '加入1000+成功转型的媒体机构',
      description: '已有众多媒体机构通过我们的专业指导成功实现AI转型，您也可以！',
      consultText: '加入成功案例',
      learnMoreText: '查看成功故事'
    }
  };

  // Personalized messaging based on result level
  const personalizedMessages = {
    'L1': {
      title: '从零开始，专业指导让您少走弯路',
      description: '作为AI转型的起步阶段，专业的指导和规划至关重要。我们将为您制定循序渐进的转型路线图。',
      urgency: '现在开始，抢占先机！',
      benefits: ['避免常见转型陷阱', '制定可行的实施计划', '获得行业最佳实践', '专家一对一指导']
    },
    'L2': {
      title: '整合现有资源，实现系统性突破',
      description: '您已有初步的AI应用经验，现在需要专业指导来整合资源，实现系统性提升。',
      urgency: '把握关键转型期！',
      benefits: ['整合分散的AI应用', '建立标准化流程', '提升应用效果', '扩大应用范围']
    },
    'L3': {
      title: '突破瓶颈，迈向平台化发展',
      description: '您的AI应用已有良好基础，我们将帮您突破当前瓶颈，实现平台化发展。',
      urgency: '突破瓶颈，再上台阶！',
      benefits: ['构建AI能力平台', '实现跨部门协同', '建立评估体系', '培养专业人才']
    },
    'L4': {
      title: '探索创新模式，引领行业发展',
      description: '您已达到行业领先水平，我们将协助您探索创新商业模式，成为行业标杆。',
      urgency: '引领创新，成为标杆！',
      benefits: ['开发新商业模式', '建设外部服务能力', '成为行业引领者', '建立创新机制']
    },
    'L5': {
      title: '持续创新，构建AI生态',
      description: '作为行业顶尖机构，我们将与您共同探索AI前沿应用，构建开放生态。',
      urgency: '共创未来，引领变革！',
      benefits: ['探索前沿技术', '建设开放生态', '输出方法论', '培养行业人才']
    }
  };

  // Initialize A/B testing
  React.useEffect(() => {
    // Use A/B testing framework if available
    if (window.ABTesting && window.ABTesting.state.initialized) {
      const assignedVariant = window.ABTesting.getVariant('cta_messaging');
      const variantConfig = window.ABTesting.getVariantConfig('cta_messaging', assignedVariant);
      
      if (assignedVariant && variantConfig) {
        setCtaVariant(variantConfig.type || 'primary');
        setShowUrgency(variantConfig.urgency || false);
        
        // Track A/B test participation
        window.ABTesting.trackInteraction('cta_messaging', 'cta_displayed', {
          result_level: result.level,
          result_score: result.score,
          variant_config: variantConfig
        });
      } else {
        // Fallback to level-based variant selection
        const levelBasedVariant = {
          'L1': 'value',
          'L2': 'urgent', 
          'L3': 'primary',
          'L4': 'social',
          'L5': 'social'
        }[result.level] || 'primary';
        
        setCtaVariant(levelBasedVariant);
      }
    } else {
      // Fallback when A/B testing not available
      const levelBasedVariant = {
        'L1': 'value',
        'L2': 'urgent', 
        'L3': 'primary',
        'L4': 'social',
        'L5': 'social'
      }[result.level] || 'primary';
      
      setCtaVariant(levelBasedVariant);
    }

    // Show urgency indicator for certain levels
    if (['L1', 'L2'].includes(result.level)) {
      setTimeout(() => setShowUrgency(true), 3000);
    }
  }, [result.level]);

  const currentVariant = variants[ctaVariant];
  const personalizedMsg = personalizedMessages[result.level];

  const handleConsultClick = () => {
    setIsTracking(true);
    
    // Track A/B test conversion
    if (window.ABTesting && window.ABTesting.state.initialized) {
      window.ABTesting.trackConversion('cta_messaging', 'consultation_click', {
        result_level: result.level,
        result_score: result.score,
        cta_variant: ctaVariant,
        personalized: true
      });
    }
    
    trackEvent('conversion_click', {
      action: 'consultation',
      variant: ctaVariant,
      result_level: result.level,
      result_score: result.score,
      source: 'cta_component',
      personalized: true
    });

    // Add slight delay for tracking
    setTimeout(() => {
      // Track external navigation
      if (window.ConversionTracking) {
        window.ConversionTracking.trackExternalNavigation('/#contact', {
          conversion_type: 'consultation',
          result_level: result.level,
          variant: ctaVariant
        });
      }
      
      onConsult();
      setIsTracking(false);
    }, 100);
  };

  const handleLearnMoreClick = () => {
    // Track A/B test conversion
    if (window.ABTesting && window.ABTesting.state.initialized) {
      window.ABTesting.trackConversion('cta_messaging', 'learn_more_click', {
        result_level: result.level,
        result_score: result.score,
        cta_variant: ctaVariant
      });
    }
    
    trackEvent('conversion_click', {
      action: 'learn_more',
      variant: ctaVariant,
      result_level: result.level,
      result_score: result.score,
      source: 'cta_component'
    });

    // Track external navigation
    if (window.ConversionTracking) {
      window.ConversionTracking.trackExternalNavigation('/', {
        conversion_type: 'learn_more',
        result_level: result.level,
        variant: ctaVariant
      });
    }

    onLearnMore();
  };

  const handleRestartClick = () => {
    trackEvent('restart_click', {
      result_level: result.level,
      result_score: result.score,
      source: 'cta_component'
    });

    // Track funnel stage for restart
    if (window.ConversionTracking) {
      window.ConversionTracking.trackFunnelStage('assessment_start', {
        restart_from_result: true,
        previous_level: result.level,
        previous_score: result.score
      });
    }

    onRestart();
  };

  const trackEvent = (eventName, data) => {
    // Use ConversionTracking utility if available
    if (window.ConversionTracking) {
      switch(eventName) {
        case 'conversion_click':
          if (data.action === 'consultation') {
            window.ConversionTracking.trackConsultationClick(data);
          } else if (data.action === 'learn_more') {
            window.ConversionTracking.trackLearnMoreClick(data);
          }
          break;
        case 'restart_click':
          window.ConversionTracking.trackEngagement('restart_assessment', data);
          break;
        case 'cta_variant_assigned':
          window.ConversionTracking.trackABTest('cta_variant', data.variant, data);
          break;
        default:
          window.ConversionTracking.trackEngagement(eventName, data);
      }
    }
    
    // Fallback to Analytics
    if (window.Analytics) {
      window.Analytics.trackCustomEvent(eventName, data);
    }
  };

  // Mobile optimized render
  if (isMobile) {
    return (
      <div className="mobile-conversion-cta">
        {/* Urgency Banner */}
        {showUrgency && (
          <div className="mobile-urgency-banner">
            <div className="urgency-icon">⚡</div>
            <span className="urgency-text">{personalizedMsg.urgency}</span>
          </div>
        )}

        {/* Main CTA Section */}
        <div className="mobile-cta-main">
          <div className="mobile-cta-header">
            <h3 className="mobile-cta-title">
              {personalizedMsg.title}
            </h3>
            <p className="mobile-cta-description">
              {personalizedMsg.description}
            </p>
          </div>

          {/* Benefits List */}
          <div className="mobile-benefits-list">
            {personalizedMsg.benefits.map((benefit, index) => (
              <div key={index} className="mobile-benefit-item">
                <div className="benefit-icon">✓</div>
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mobile-cta-buttons">
            <button 
              className="mobile-cta-primary"
              onClick={handleConsultClick}
              disabled={isTracking}
            >
              {isTracking ? (
                <>
                  <div className="loading-spinner-sm"></div>
                  <span>处理中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{currentVariant.consultText}</span>
                </>
              )}
            </button>

            <button 
              className="mobile-cta-secondary"
              onClick={handleLearnMoreClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{currentVariant.learnMoreText}</span>
            </button>

            <button 
              className="mobile-cta-tertiary"
              onClick={handleRestartClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>重新测评</span>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mobile-trust-indicators">
          <div className="trust-item">
            <div className="trust-number">1000+</div>
            <div className="trust-label">成功案例</div>
          </div>
          <div className="trust-item">
            <div className="trust-number">98%</div>
            <div className="trust-label">客户满意度</div>
          </div>
          <div className="trust-item">
            <div className="trust-number">5年+</div>
            <div className="trust-label">专业经验</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mobile-contact-info">
          <p className="contact-text">
            专业团队随时为您服务
          </p>
          <div className="contact-methods">
            <a href="tel:+86-577-88096666" className="contact-method">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>电话咨询</span>
            </a>
            <a href="mailto:ai@wzxww.com" className="contact-method">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>邮件咨询</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Desktop render
  return (
    <div className="desktop-conversion-cta">
      {/* Urgency Banner */}
      {showUrgency && (
        <div className="desktop-urgency-banner">
          <div className="urgency-content">
            <div className="urgency-icon">⚡</div>
            <span className="urgency-text">{personalizedMsg.urgency}</span>
            <div className="urgency-timer">
              <span className="timer-text">限时优惠</span>
            </div>
          </div>
        </div>
      )}

      <div className="desktop-cta-container">
        <div className="desktop-cta-content">
          {/* Left Section - Content */}
          <div className="desktop-cta-left">
            <div className="cta-badge">
              <span className="badge-text">专业服务</span>
            </div>
            
            <h3 className="desktop-cta-title">
              {personalizedMsg.title}
            </h3>
            
            <p className="desktop-cta-description">
              {personalizedMsg.description}
            </p>

            {/* Benefits Grid */}
            <div className="desktop-benefits-grid">
              {personalizedMsg.benefits.map((benefit, index) => (
                <div key={index} className="desktop-benefit-item">
                  <div className="benefit-icon-large">✓</div>
                  <span className="benefit-text-large">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="desktop-trust-section">
              <div className="trust-stats">
                <div className="trust-stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">成功转型案例</div>
                </div>
                <div className="trust-stat">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">客户满意度</div>
                </div>
                <div className="trust-stat">
                  <div className="stat-number">5年+</div>
                  <div className="stat-label">AI咨询经验</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="desktop-cta-right">
            <div className="cta-actions-card">
              <div className="actions-header">
                <h4 className="actions-title">立即行动</h4>
                <p className="actions-subtitle">选择最适合您的服务方式</p>
              </div>

              <div className="cta-buttons-stack">
                <button 
                  className="desktop-cta-primary"
                  onClick={handleConsultClick}
                  disabled={isTracking}
                >
                  {isTracking ? (
                    <>
                      <div className="loading-spinner-sm"></div>
                      <span>处理中...</span>
                    </>
                  ) : (
                    <>
                      <div className="button-icon">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="button-content">
                        <div className="button-title">{currentVariant.consultText}</div>
                        <div className="button-subtitle">专家一对一指导</div>
                      </div>
                    </>
                  )}
                </button>

                <button 
                  className="desktop-cta-secondary"
                  onClick={handleLearnMoreClick}
                >
                  <div className="button-icon">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="button-content">
                    <div className="button-title">{currentVariant.learnMoreText}</div>
                    <div className="button-subtitle">了解详细方案</div>
                  </div>
                </button>

                <button 
                  className="desktop-cta-tertiary"
                  onClick={handleRestartClick}
                >
                  <div className="button-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span>重新测评</span>
                </button>
              </div>

              {/* Contact Information */}
              <div className="contact-info-card">
                <div className="contact-header">
                  <h5 className="contact-title">联系方式</h5>
                </div>
                <div className="contact-methods-grid">
                  <a href="tel:+86-577-88096666" className="contact-method-card">
                    <div className="method-icon">📞</div>
                    <div className="method-info">
                      <div className="method-label">电话咨询</div>
                      <div className="method-value">0577-88096666</div>
                    </div>
                  </a>
                  <a href="mailto:ai@wzxww.com" className="contact-method-card">
                    <div className="method-icon">📧</div>
                    <div className="method-info">
                      <div className="method-label">邮件咨询</div>
                      <div className="method-value">ai@wzxww.com</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export component
window.ConversionCTA = ConversionCTA;