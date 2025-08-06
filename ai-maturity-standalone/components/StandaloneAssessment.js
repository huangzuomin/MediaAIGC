// Enhanced Standalone AI Maturity Assessment Component
function StandaloneAssessment() {
  // Core state management
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId] = React.useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
  
  // Enhanced state for better UX
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [questionHistory, setQuestionHistory] = React.useState([0]);
  const [startTime] = React.useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = React.useState(Date.now());
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);
  
  // Privacy state
  const [hasValidConsent, setHasValidConsent] = React.useState(false);
  const [privacyChecked, setPrivacyChecked] = React.useState(false);
  
  // Mobile-specific state
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLandscape, setIsLandscape] = React.useState(false);
  const [touchDevice, setTouchDevice] = React.useState(false);
  
  // Share modal state
  const [showShareModal, setShowShareModal] = React.useState(false);

  // SEO helper function
  const useSEO = (type, level = '', levelName = '', score = '') => {
    switch (type) {
      case 'loading':
        return {
          title: '正在加载AI成熟度自测...',
          description: '专业的媒体AI成熟度自测工具正在为您准备评估环境'
        };
      case 'result':
        return {
          title: `AI成熟度评估结果：${level} ${levelName} | 得分 ${score}`,
          description: `您的AI成熟度等级为${level}（${levelName}），评估得分${score}。获取专业的AI转型建议和实施方案。`
        };
      case 'assessment':
      default:
        return {
          title: '媒体AI成熟度5分钟自测 | 免费评估您的AI转型水平',
          description: '专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平，获得个性化转型建议和专家指导'
        };
    }
  };

  // Questions data (same as original but with enhanced structure)
  const questions = [
    {
      id: 'tech_awareness',
      dimension: '技术与工具',
      question: '您的机构目前对AI技术的认知和应用情况是？',
      options: [
        { value: 1, text: '仅在讨论概念，关注新闻报道', level: 'L1' },
        { value: 2, text: '员工自发使用ChatGPT等公网工具', level: 'L2' },
        { value: 3, text: '采购了专门的AI工具用于特定业务', level: 'L3' },
        { value: 4, text: '建设了统一的AI中台或平台', level: 'L4' },
        { value: 5, text: 'AI能力可灵活编排并对外提供服务', level: 'L5' }
      ]
    },
    {
      id: 'data_management',
      dimension: '数据与资产',
      question: '您的机构在数据管理和资产化方面的现状是？',
      options: [
        { value: 1, text: '数据孤岛严重，资产未被有效管理', level: 'L1' },
        { value: 2, text: '个人处理少量数据，缺乏统一管理', level: 'L2' },
        { value: 3, text: '特定业务线的数据已打通整合', level: 'L3' },
        { value: 4, text: '构建了私有化"媒体大脑"知识库', level: 'L4' },
        { value: 5, text: '数据已开发为可售卖的产品和洞察报告', level: 'L5' }
      ]
    },
    {
      id: 'workflow_integration',
      dimension: '流程与工作',
      question: 'AI与您机构核心工作流程的融合程度如何？',
      options: [
        { value: 1, text: '现有流程完全没有AI的影响', level: 'L1' },
        { value: 2, text: '仅辅助个人任务（文案、资料搜集等）', level: 'L2' },
        { value: 3, text: '嵌入标准化工作流（AI审校、视频生成等）', level: 'L3' },
        { value: 4, text: 'AI驱动核心流程自动化（选题、分发等）', level: 'L4' },
        { value: 5, text: '孵化全新智能业务（AI交互内容、社群运营）', level: 'L5' }
      ]
    },
    {
      id: 'team_capability',
      dimension: '人才与组织',
      question: '您的团队在AI能力建设方面处于什么阶段？',
      options: [
        { value: 1, text: '仅少数高层或技术人员关注AI', level: 'L1' },
        { value: 2, text: '少数"极客"员工自发探索学习', level: 'L2' },
        { value: 3, text: '开展了部门级专项技能培训', level: 'L3' },
        { value: 4, text: '设立AI专岗，建立体系化培训考核', level: 'L4' },
        { value: 5, text: 'AI驱动创新成为组织文化本能', level: 'L5' }
      ]
    },
    {
      id: 'strategy_value',
      dimension: '战略与价值',
      question: 'AI在您机构的战略定位和价值衡量如何？',
      options: [
        { value: 1, text: '停留在战略口号或规划文本', level: 'L1' },
        { value: 2, text: '无ROI衡量，主要靠个人兴趣驱动', level: 'L2' },
        { value: 3, text: '衡量特定流程的效率提升（时长、成本）', level: 'L3' },
        { value: 4, text: '纳入组织级KPI/OKR，衡量整体效能', level: 'L4' },
        { value: 5, text: '开辟了基于AI的第二、第三营收曲线', level: 'L5' }
      ]
    },
    {
      id: 'content_production',
      dimension: '内容生产',
      question: 'AI在您的内容生产环节发挥什么作用？',
      options: [
        { value: 1, text: '完全没有使用AI辅助内容生产', level: 'L1' },
        { value: 2, text: '偶尔用AI生成文案或图片素材', level: 'L2' },
        { value: 3, text: 'AI已成为日常内容生产的标准工具', level: 'L3' },
        { value: 4, text: 'AI驱动的内容生产流水线已建立', level: 'L4' },
        { value: 5, text: 'AI创造了全新的内容形态和互动方式', level: 'L5' }
      ]
    },
    {
      id: 'audience_engagement',
      dimension: '用户互动',
      question: '在用户互动和服务方面，AI的应用情况如何？',
      options: [
        { value: 1, text: '用户互动完全依靠人工处理', level: 'L1' },
        { value: 2, text: '使用简单的自动回复或客服机器人', level: 'L2' },
        { value: 3, text: 'AI辅助用户画像分析和精准推送', level: 'L3' },
        { value: 4, text: '智能化用户服务和个性化内容推荐', level: 'L4' },
        { value: 5, text: 'AI驱动的社群运营和价值服务生态', level: 'L5' }
      ]
    },
    {
      id: 'decision_making',
      dimension: '决策支持',
      question: 'AI在您的编辑决策和运营决策中起什么作用？',
      options: [
        { value: 1, text: '决策完全基于经验和直觉', level: 'L1' },
        { value: 2, text: '偶尔参考AI提供的数据分析', level: 'L2' },
        { value: 3, text: 'AI数据分析已成为决策的重要依据', level: 'L3' },
        { value: 4, text: 'AI提供实时决策支持和预测分析', level: 'L4' },
        { value: 5, text: 'AI驱动的智能决策系统已全面应用', level: 'L5' }
      ]
    },
    {
      id: 'resource_investment',
      dimension: '资源投入',
      question: '您的机构在AI转型方面的资源投入情况？',
      options: [
        { value: 1, text: '没有专门的AI转型预算', level: 'L1' },
        { value: 2, text: '少量预算用于购买AI工具订阅', level: 'L2' },
        { value: 3, text: '有专项预算用于AI能力建设', level: 'L3' },
        { value: 4, text: 'AI转型是机构重点投资方向', level: 'L4' },
        { value: 5, text: 'AI投入已产生显著的商业回报', level: 'L5' }
      ]
    },
    {
      id: 'future_planning',
      dimension: '未来规划',
      question: '对于AI转型的未来规划，您的机构处于什么状态？',
      options: [
        { value: 1, text: '还在观望，没有明确的转型计划', level: 'L1' },
        { value: 2, text: '有初步想法，但缺乏具体行动方案', level: 'L2' },
        { value: 3, text: '制定了明确的AI转型路线图', level: 'L3' },
        { value: 4, text: '正在系统性推进AI转型战略', level: 'L4' },
        { value: 5, text: '已成为行业AI转型的标杆和引领者', level: 'L5' }
      ]
    }
  ];

  // Initialize session tracking and load saved data
  React.useEffect(() => {
    console.log('Initializing StandaloneAssessment...');
    
    // Initialize device detection first
    detectDevice();
    
    // Initialize accessibility features
    if (window.AccessibilityManager) {
      window.AccessibilityManager.init();
    }
    
    // Initialize privacy system (non-blocking)
    setTimeout(() => {
      initializePrivacy();
    }, 100);

    // Try to load existing session immediately
    try {
      const savedSession = loadSessionData();
      if (savedSession && savedSession.sessionId !== sessionId) {
        console.log('Found existing session, restoring...');
        setCurrentQuestion(savedSession.currentQuestion || 0);
        setAnswers(savedSession.answers || {});
        setQuestionHistory(savedSession.questionHistory || [0]);
      }
    } catch (e) {
      console.warn('Could not load saved session:', e);
    }

    // Track assessment start
    trackEvent('assessment_started', {
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      device_type: getDeviceType(),
      is_returning_user: false
    });
    
    console.log('StandaloneAssessment initialized');
  }, [sessionId]);

  // Keyboard navigation support (disabled on mobile for better touch experience)
  React.useEffect(() => {
    if (isMobile || touchDevice) return; // Skip keyboard navigation on mobile/touch devices
    
    const handleKeyDown = (event) => {
      // Don't interfere if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'Backspace':
          event.preventDefault();
          if (currentQuestion > 0) {
            prevQuestion();
          }
          break;
        case 'ArrowRight':
        case 'Enter':
          event.preventDefault();
          if (answers[questions[currentQuestion].id]) {
            nextQuestion();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          event.preventDefault();
          const value = parseInt(event.key);
          if (value <= questions[currentQuestion].options.length) {
            handleAnswer(questions[currentQuestion].id, value);
          }
          break;
        case 'Escape':
          event.preventDefault();
          if (window.confirm('确定要退出测评吗？您的进度将会保存。')) {
            // Could implement exit logic here
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, answers, isMobile, touchDevice]);

  // Touch optimization for mobile devices
  React.useEffect(() => {
    if (!touchDevice) return;

    // Prevent zoom on double tap for better UX
    let lastTouchEnd = 0;
    const handleTouchEnd = (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent pull-to-refresh on mobile
    const handleTouchMove = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [touchDevice]);

  // Performance optimization: Preload next question
  React.useEffect(() => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = questions[currentQuestion + 1];
      // Preload any resources for next question if needed
      if (window.MetaTagsManager) {
        // Pre-generate SEO config for next question
        const nextConfig = useSEO('question', currentQuestion + 2, questions.length, nextQ.dimension);
      }
    }
  }, [currentQuestion]);

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSaveEnabled && hasUnsavedChanges) {
      const saveTimer = setTimeout(() => {
        saveSessionData({
          sessionId,
          currentQuestion,
          answers,
          questionHistory,
          lastUpdated: new Date().toISOString(),
          device: getDeviceType()
        });
        setHasUnsavedChanges(false);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimer);
    }
  }, [answers, currentQuestion, hasUnsavedChanges, autoSaveEnabled]);

  // Track question viewing time
  React.useEffect(() => {
    setQuestionStartTime(Date.now());
    
    // Track question view
    trackEvent('question_viewed', {
      session_id: sessionId,
      question_id: questions[currentQuestion].id,
      question_number: currentQuestion + 1,
      dimension: questions[currentQuestion].dimension,
      timestamp: new Date().toISOString()
    });
  }, [currentQuestion]);

  // Privacy initialization (safe and non-blocking)
  const initializePrivacy = () => {
    console.log('Initializing privacy...');
    
    // Always set privacy as checked to prevent blocking
    setPrivacyChecked(true);
    
    try {
      // Check if we have existing consent
      if (window.Storage && typeof window.Storage.getPreferences === 'function') {
        const preferences = window.Storage.getPreferences();
        const hasConsent = preferences && preferences.dataStorage !== false;
        setHasValidConsent(hasConsent);
        
        console.log('Privacy consent status:', hasConsent);
        
        // Temporarily disable privacy notice auto-display
        // TODO: Re-enable after fixing display issues
        /*
        if (!hasConsent && window.PrivacyNotice && typeof window.PrivacyNotice.show === 'function') {
          setTimeout(() => {
            try {
              if (Object.keys(answers).length === 0) {
                window.PrivacyNotice.show();
              }
            } catch (e) {
              console.warn('Could not show privacy notice:', e);
            }
          }, 5000);
        }
        */
        
        console.log('Privacy notice auto-display disabled for debugging');
      } else {
        console.log('Storage system not available, assuming consent');
        setHasValidConsent(true);
      }
    } catch (e) {
      console.warn('Privacy check failed:', e);
      // Default to allowing functionality
      setHasValidConsent(true);
    }
    
    console.log('Privacy initialization completed');
  };

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Enhanced device detection
  const detectDevice = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobileWidth = width < 768;
    const isLandscapeOrientation = width > height;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setIsMobile(isMobileWidth);
    setIsLandscape(isLandscapeOrientation);
    setTouchDevice(isTouchDevice);
    
    return {
      isMobile: isMobileWidth,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLandscape: isLandscapeOrientation,
      isTouch: isTouchDevice,
      screenSize: `${width}x${height}`
    };
  };

  // Handle window resize and orientation change
  React.useEffect(() => {
    const handleResize = () => {
      detectDevice();
    };

    const handleOrientationChange = () => {
      // Delay to get accurate dimensions after orientation change
      setTimeout(() => {
        detectDevice();
      }, 100);
    };

    // Initial detection
    detectDevice();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Privacy consent monitoring
  React.useEffect(() => {
    if (privacyChecked) {
      console.log('Privacy checked, loading session data...');
      
      try {
        if (hasValidConsent) {
          // Load session data when consent becomes available
          const savedSession = loadSessionData();
          if (savedSession && savedSession.sessionId !== sessionId) {
            // Different session, create new one
            console.log('Different session found, starting fresh');
          } else if (savedSession) {
            console.log('Restoring saved session:', savedSession.sessionId);
            setCurrentQuestion(savedSession.currentQuestion || 0);
            setAnswers(savedSession.answers || {});
            setQuestionHistory(savedSession.questionHistory || [0]);
            
            // Track returning user
            trackEvent('returning_user', {
              session_id: sessionId,
              previous_session: savedSession.sessionId,
              last_question: savedSession.currentQuestion
            });
          }
          
          // Save initial session data
          const initialSessionData = {
            sessionId: sessionId,
            startTime: new Date().toISOString(),
            currentQuestion: 0,
            answers: {},
            questionHistory: [0],
            device: getDeviceType(),
            userAgent: navigator.userAgent
          };
          
          saveSessionData(initialSessionData);
        }
      } catch (e) {
        console.warn('Error in privacy monitoring:', e);
      }
    }
  }, [hasValidConsent, privacyChecked]);

  const handleAnswer = (questionId, value) => {
    const previousAnswer = answers[questionId];
    const timeSpent = Date.now() - questionStartTime;
    
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    
    setAnswers(newAnswers);
    setHasUnsavedChanges(true);
    
    // Accessibility: Announce selection
    if (window.AccessibilityManager) {
      const currentQ = questions[currentQuestion];
      const selectedOption = currentQ.options.find(opt => opt.value === value);
      if (selectedOption) {
        window.AccessibilityManager.announce(
          `已选择: ${selectedOption.text}, 等级 ${selectedOption.level}`, 
          'assertive'
        );
      }
    }
    
    // Track answer selection with enhanced data
    trackEvent('question_answered', {
      session_id: sessionId,
      question_id: questionId,
      question_number: currentQuestion + 1,
      answer_value: value,
      previous_answer: previousAnswer,
      dimension: questions[currentQuestion].dimension,
      time_spent_ms: timeSpent,
      is_answer_change: previousAnswer !== undefined,
      timestamp: new Date().toISOString()
    });

    // Immediate save for important progress
    if (autoSaveEnabled) {
      saveSessionData({
        sessionId,
        currentQuestion,
        answers: newAnswers,
        questionHistory,
        lastUpdated: new Date().toISOString(),
        device: getDeviceType()
      });
      setHasUnsavedChanges(false);
    }
  };

  const nextQuestion = () => {
    if (isTransitioning) return; // Prevent double clicks
    
    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      const newQuestionIndex = currentQuestion + 1;
      const timeSpent = Date.now() - questionStartTime;
      
      // Accessibility: Announce navigation
      if (window.AccessibilityManager) {
        window.AccessibilityManager.announce(
          `进入第 ${newQuestionIndex + 1} 题，共 ${questions.length} 题`, 
          'polite'
        );
      }
      
      // Add smooth transition
      setTimeout(() => {
        setCurrentQuestion(newQuestionIndex);
        setQuestionHistory(prev => [...prev, newQuestionIndex]);
        setIsTransitioning(false);
        
        // Update SEO for new question
        const nextQ = questions[newQuestionIndex];
        if (window.MetaTagsManager) {
          const questionConfig = useSEO('question', newQuestionIndex + 1, questions.length, nextQ.dimension);
          MetaTagsManager.setSEOMetaTags(questionConfig);
        }
        
        trackEvent('question_navigation', {
          session_id: sessionId,
          action: 'next',
          from_question: currentQuestion + 1,
          to_question: newQuestionIndex + 1,
          dimension: nextQ.dimension,
          time_spent_on_previous: timeSpent,
          navigation_method: 'button'
        });
      }, 150);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (isTransitioning || currentQuestion === 0) return;
    
    setIsTransitioning(true);
    const newQuestionIndex = currentQuestion - 1;
    
    setTimeout(() => {
      setCurrentQuestion(newQuestionIndex);
      // Update history by removing the last entry
      setQuestionHistory(prev => prev.slice(0, -1));
      setIsTransitioning(false);
      
      // Update SEO for previous question
      const prevQ = questions[newQuestionIndex];
      if (window.MetaTagsManager) {
        const questionConfig = useSEO('question', newQuestionIndex + 1, questions.length, prevQ.dimension);
        MetaTagsManager.setSEOMetaTags(questionConfig);
      }
      
      trackEvent('question_navigation', {
        session_id: sessionId,
        action: 'previous',
        from_question: currentQuestion + 1,
        to_question: newQuestionIndex + 1,
        dimension: prevQ.dimension,
        navigation_method: 'button'
      });
    }, 150);
  };

  // Jump to specific question (for future use in question overview)
  const jumpToQuestion = (questionIndex) => {
    if (questionIndex < 0 || questionIndex >= questions.length || isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentQuestion(questionIndex);
      // Update history appropriately
      const newHistory = questionHistory.slice(0, questionHistory.indexOf(questionIndex) + 1);
      if (newHistory.length === 0) {
        setQuestionHistory([questionIndex]);
      } else {
        setQuestionHistory(newHistory);
      }
      setIsTransitioning(false);
      
      trackEvent('question_navigation', {
        session_id: sessionId,
        action: 'jump',
        to_question: questionIndex + 1,
        navigation_method: 'direct'
      });
    }, 150);
  };

  const calculateResult = () => {
    setIsLoading(true);
    
    // Accessibility: Announce calculation start
    if (window.AccessibilityManager) {
      window.AccessibilityManager.announce('正在计算您的AI成熟度评估结果，请稍候...', 'assertive');
    }
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      // Use enhanced assessment calculator
      const sessionData = {
        sessionId,
        timeSpent: Date.now() - startTime,
        startTime: new Date(startTime).toISOString()
      };

      const finalResult = window.AssessmentCalculator 
        ? AssessmentCalculator.calculateResult(answers, questions, sessionData)
        : {
            // Fallback to simple calculation if calculator not available
            level: 'L1',
            levelName: '观察与感知阶段',
            score: '1.0',
            description: '基础评估结果',
            recommendations: ['继续完善AI应用'],
            answers,
            completedAt: new Date().toISOString(),
            sessionId
          };

      setResult(finalResult);
      setShowResult(true);
      setIsLoading(false);

      // Accessibility: Announce result completion
      if (window.AccessibilityManager) {
        window.AccessibilityManager.announce(
          `评估完成！您的AI成熟度等级为 ${finalResult.level} ${finalResult.levelName}，综合得分 ${finalResult.score}`, 
          'assertive'
        );
      }

      // Enhanced completion tracking
      trackEvent('assessment_completed', {
        session_id: sessionId,
        result_level: finalResult.level,
        result_score: finalResult.score,
        completion_time: finalResult.completedAt,
        total_questions: questions.length,
        time_spent: sessionData.timeSpent,
        confidence_score: finalResult.confidenceScore,
        completion_rate: finalResult.completionRate,
        dimensional_scores: finalResult.dimensionalScores,
        strengths: finalResult.strengths,
        weaknesses: finalResult.weaknesses
      });

      // Save enhanced result
      saveAssessmentResult(finalResult);
    }, 1500);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setIsLoading(false);

    trackEvent('assessment_restarted', {
      session_id: sessionId,
      previous_result: result?.level
    });

    // Clear saved data
    clearSessionData();
  };

  const handleConsultation = () => {
    trackEvent('conversion_click', {
      session_id: sessionId,
      action: 'consultation',
      result_level: result?.level,
      source: 'result_page'
    });

    // Track conversion funnel stage
    if (window.ConversionTracking) {
      window.ConversionTracking.trackFunnelStage('conversion_intent', {
        conversion_type: 'consultation',
        result_level: result?.level,
        source: 'result_page'
      });
    }

    // Redirect to main website consultation page
    const mainSiteUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
      ? '../index.html#contact' 
      : '/#contact';
    window.open(mainSiteUrl, '_blank');
  };

  const handleLearnMore = () => {
    trackEvent('conversion_click', {
      session_id: sessionId,
      action: 'learn_more',
      result_level: result?.level,
      source: 'result_page'
    });

    // Track conversion funnel stage
    if (window.ConversionTracking) {
      window.ConversionTracking.trackFunnelStage('conversion_intent', {
        conversion_type: 'learn_more',
        result_level: result?.level,
        source: 'result_page'
      });
    }

    // Redirect to main website
    const mainSiteUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
      ? '../index.html' 
      : '/';
    window.open(mainSiteUrl, '_blank');
  };

  const handleShare = () => {
    trackEvent('share_click', {
      session_id: sessionId,
      action: 'share_modal_open',
      result_level: result?.level,
      source: 'result_page'
    });

    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    
    trackEvent('share_modal_close', {
      session_id: sessionId,
      result_level: result?.level
    });
  };

  // Enhanced data management functions
  const saveSessionData = (data) => {
    try {
      // Try to save with Storage system first
      if (window.Storage && typeof window.Storage.saveSession === 'function') {
        // Only check consent if privacy system is ready
        if (privacyChecked && !hasValidConsent) {
          console.log('Session data not saved - no valid consent');
          return false;
        }
        return window.Storage.saveSession(data);
      } else {
        // Fallback to direct localStorage
        const sessionData = {
          ...data,
          version: '1.0',
          timestamp: Date.now()
        };
        localStorage.setItem('ai-maturity-session', JSON.stringify(sessionData));
        return true;
      }
    } catch (e) {
      console.warn('Could not save session data:', e);
      return false;
    }
  };

  const loadSessionData = () => {
    try {
      if (window.Storage && typeof window.Storage.getSession === 'function') {
        return window.Storage.getSession();
      } else {
        const data = localStorage.getItem('ai-maturity-session');
        return data ? JSON.parse(data) : null;
      }
    } catch (e) {
      console.warn('Could not load session data:', e);
      return null;
    }
  };

  const saveAssessmentResult = (result) => {
    // Check privacy consent before saving
    if (!hasValidConsent || !privacyChecked) {
      console.log('Assessment result not saved - no valid consent');
      return false;
    }
    
    if (window.Storage) {
      return window.Storage.saveResult(result);
    } else {
      try {
        const resultData = {
          ...result,
          version: '1.0',
          timestamp: Date.now()
        };
        localStorage.setItem('ai-maturity-result', JSON.stringify(resultData));
        return true;
      } catch (e) {
        console.warn('Could not save assessment result:', e);
        return false;
      }
    }
  };

  const clearSessionData = () => {
    if (window.Storage) {
      return window.Storage.clearSession() && window.Storage.clearResult();
    } else {
      try {
        localStorage.removeItem('ai-maturity-session');
        localStorage.removeItem('ai-maturity-result');
        return true;
      } catch (e) {
        console.warn('Could not clear session data:', e);
        return false;
      }
    }
  };

  // Get assessment progress statistics
  const getProgressStats = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    const estimatedTimeRemaining = ((totalQuestions - currentQuestion - 1) * 30); // 30 seconds per question
    const timeSpent = Date.now() - startTime;
    
    return {
      totalQuestions,
      answeredQuestions,
      currentQuestion: currentQuestion + 1,
      progressPercentage,
      estimatedTimeRemaining,
      timeSpent,
      isComplete: answeredQuestions === totalQuestions
    };
  };

  const trackEvent = (eventName, data) => {
    try {
      // Check analytics consent before tracking (only if privacy system is ready)
      if (window.Privacy && typeof window.Privacy.validateConsent === 'function') {
        if (!window.Privacy.validateConsent('analytics')) {
          console.log('Event not tracked - no analytics consent:', eventName);
          return;
        }
      }
      
      // Google Analytics 4 tracking
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', eventName, data);
      }

      // Store in local analytics if available
      if (window.Storage && typeof window.Storage.saveAnalyticsData === 'function' && hasValidConsent) {
        window.Storage.saveAnalyticsData({
          event_name: eventName,
          ...data
        });
      }

      // Console log for debugging
      console.log('Event tracked:', eventName, data);
    } catch (e) {
      console.warn('Error tracking event:', eventName, e);
    }
  };

  // Loading state
  if (isLoading) {
    // Update meta tags for loading state
    React.useEffect(() => {
      if (window.MetaTagsManager) {
        MetaTagsManager.updateForPageState('loading');
      }
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" role="main" aria-live="polite">
        <SEOHead {...useSEO('loading')} />
        <div className={`text-center ${isMobile ? 'px-4' : ''}`}>
          <div 
            className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-6 loading-spinner`}
            role="status"
            aria-label="正在分析您的AI成熟度评估结果"
          ></div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-[var(--primary-color)] mb-2`}>
            正在分析您的AI成熟度
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm px-4' : ''}`}>
            请稍候，我们正在为您生成个性化的评估报告...
          </p>
          
          {isMobile && (
            <div className="mt-8 px-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>预计需要 2-3 秒</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Result display
  if (showResult && result) {
    // Update meta tags for result page
    React.useEffect(() => {
      if (window.MetaTagsManager) {
        MetaTagsManager.updateForPageState('result', {
          level: result.level,
          levelName: result.levelName,
          score: result.score
        });
      }
    }, [result]);

    // Use enhanced ResultsDisplay component
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SEOHead {...useSEO('result', result.level, result.levelName, result.score)} />
        
        {window.ResultsDisplay ? (
          <>
            <ResultsDisplay
              result={result}
              onRestart={restartAssessment}
              onShare={handleShare}
              onConsult={handleConsultation}
              onLearnMore={handleLearnMore}
              isMobile={isMobile}
            />
            
            {/* Share Modal */}
            {window.ShareModal && (
              <ShareModal
                isOpen={showShareModal}
                onClose={closeShareModal}
                result={result}
                shareUrl={window.location.href}
                isMobile={isMobile}
              />
            )}
          </>
        ) : (
          // Fallback to simple result display
          <div className="container-responsive">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{result.level}</span>
                </div>
                <h1 className="text-2xl font-bold text-[var(--primary-color)] mb-2">测评结果</h1>
                <h2 className="text-lg text-[var(--accent-color)] font-semibold">{result.levelName}</h2>
                <p className="text-gray-600 mt-2">综合得分: {result.score}/5.0</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--primary-color)] mb-3">现状分析</h3>
                <p className="text-gray-700 leading-relaxed">{result.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--primary-color)] mb-3">建议行动方案</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConsultation}
                  className="w-full bg-[var(--accent-color)] text-[var(--primary-color)] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
                >
                  预约专家咨询
                </button>
                <button 
                  onClick={restartAssessment}
                  className="w-full border-2 border-[var(--primary-color)] text-[var(--primary-color)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300"
                >
                  重新测评
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    // Desktop/Tablet result page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <SEOHead {...useSEO('result', result.level, result.levelName, result.score)} />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{result.level}</span>
              </div>
              <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">测评结果</h1>
              <h2 className="text-xl text-[var(--accent-color)] font-semibold">{result.levelName}</h2>
              <p className="text-gray-600 mt-2">综合得分: {result.score}/5.0</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4">现状分析</h3>
              <p className="text-gray-700 leading-relaxed">{result.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4">建议行动方案</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-lg font-bold mb-2">想要获得专业指导？</h3>
              <p className="mb-4">我们的AI转型专家可以为您提供更详细的诊断和定制化解决方案</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleConsultation}
                  className="bg-[var(--accent-color)] text-[var(--primary-color)] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
                >
                  预约专家咨询
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[var(--primary-color)] transition-all duration-300"
                >
                  了解更多服务
                </button>
                <button 
                  onClick={restartAssessment}
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[var(--primary-color)] transition-all duration-300"
                >
                  重新测评
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Temporarily disable privacy blocking to fix loading issue
  // TODO: Re-enable after debugging
  /*
  if (!privacyChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化隐私设置...</p>
        </div>
      </div>
    );
  }
  */

  // Assessment questions
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Mobile-optimized render
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SEOHead {...useSEO('assessment')} />
        
        <div className="container-responsive">
          <div className={`bg-white rounded-lg shadow-xl mobile-slide-in ${
            isTransitioning ? 'transitioning' : ''
          }`}>
            
            {/* Mobile Header */}
            <div className="mobile-header">
              <div className="mobile-question-counter">
                <span>第 {currentQuestion + 1} 题</span>
                <span>{questions.length} 题</span>
                <button
                  onClick={() => {
                    console.log('Privacy settings button clicked');
                    console.log('PrivacyNotice available:', typeof window.PrivacyNotice);
                    if (window.PrivacyNotice && typeof window.PrivacyNotice.showSettings === 'function') {
                      console.log('Calling PrivacyNotice.showSettings()');
                      window.PrivacyNotice.showSettings();
                    } else {
                      console.error('PrivacyNotice.showSettings not available');
                      alert('隐私设置功能暂时不可用，请稍后再试');
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="隐私设置"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              </div>
              
              <div className="mobile-progress-bar">
                <div 
                  className="mobile-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>已完成 {Object.keys(answers).length} 题</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Mobile Question Content */}
            <div className="p-4 question-container" role="group" aria-labelledby={`question-${currentQuestion}`}>
              <div className="mobile-dimension-tag mb-4" role="note" aria-label={`问题维度: ${currentQ.dimension}`}>
                {currentQ.dimension}
              </div>
              
              <h2 id={`question-${currentQuestion}`} className="mobile-question-text" tabIndex="-1">
                {currentQ.question}
              </h2>

              {/* Mobile Options */}
              <div className="space-y-3 mb-6" role="radiogroup" aria-labelledby={`question-${currentQuestion}`} aria-describedby={`question-help-${currentQuestion}`}>
                <div id={`question-help-${currentQuestion}`} className="sr-only">
                  使用方向键导航选项，按回车键或空格键选择，或按数字键 1-{currentQ.options.length} 直接选择
                </div>
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`mobile-option ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                    onClick={() => !isTransitioning && handleAnswer(currentQ.id, option.value)}
                  >
                    <div className="radio-indicator"></div>
                    <div className="mobile-option-content">
                      <span className="mobile-option-text">{option.text}</span>
                      <div className="mobile-option-meta">
                        <span className="mobile-level-badge">{option.level}</span>
                        <span className="mobile-option-number">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="mobile-navigation" role="navigation" aria-label="评估导航">
              {currentQuestion > 0 && (
                <button
                  onClick={prevQuestion}
                  disabled={isTransitioning}
                  className="mobile-nav-button secondary"
                  aria-label={`返回上一题 (第 ${currentQuestion} 题)`}
                  aria-describedby="prev-button-help"
                >
                  <div id="prev-button-help" className="sr-only">
                    返回到上一个问题
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  上一题
                </button>
              )}
              
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQ.id] || isTransitioning}
                className={`mobile-nav-button ${
                  currentQuestion === questions.length - 1 ? 'accent' : 'primary'
                }`}
                aria-label={
                  currentQuestion === questions.length - 1 
                    ? '完成评估并查看结果' 
                    : `进入下一题 (第 ${currentQuestion + 2} 题)`
                }
                aria-describedby="next-button-help"
              >
                <div id="next-button-help" className="sr-only">
                  {currentQuestion === questions.length - 1 
                    ? '完成所有问题并生成评估结果' 
                    : '继续到下一个问题'}
                </div>
                {currentQuestion === questions.length - 1 ? '查看结果' : '下一题'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <SEOHead {...useSEO('assessment')} />
      
      <div className="max-w-3xl mx-auto">
        <div className={`bg-white rounded-2xl shadow-xl p-8 fade-in question-transition ${
          isTransitioning ? 'transitioning' : ''
        }`}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[var(--primary-color)]">媒体AI成熟度5分钟自测</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{currentQuestion + 1} / {questions.length}</span>
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    保存中...
                  </span>
                )}
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>进度</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Progress bar shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
                {/* Question markers */}
                <div className="absolute inset-0 flex justify-between items-center px-1">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                        index < currentQuestion 
                          ? 'bg-[var(--primary-color)] border-[var(--primary-color)]' 
                          : index === currentQuestion
                          ? 'bg-white border-[var(--primary-color)] ring-2 ring-[var(--primary-color)] ring-opacity-50'
                          : 'bg-white border-gray-300'
                      }`}
                      title={`第${index + 1}题: ${questions[index].dimension}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Progress Statistics */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>已完成 {Object.keys(answers).length} 题</span>
                <span>预计剩余 {Math.max(0, Math.ceil(((questions.length - currentQuestion - 1) * 30) / 60))} 分钟</span>
              </div>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-[var(--accent-color)] text-[var(--primary-color)] px-3 py-1 rounded-full text-sm font-medium mb-4">
                {currentQ.dimension}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h2>
          </div>

          {/* Enhanced Options Display */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => (
              <label 
                key={index}
                className={`radio-option ${answers[currentQ.id] === option.value ? 'selected' : ''} ${
                  isTransitioning ? 'pointer-events-none opacity-50' : ''
                } group`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAnswer(currentQ.id, option.value);
                  }
                }}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={() => handleAnswer(currentQ.id, option.value)}
                  disabled={isTransitioning}
                />
                <div className="flex items-center">
                  {/* Enhanced Radio Indicator */}
                  <div className="radio-indicator relative">
                    {answers[currentQ.id] === option.value && (
                      <div className="absolute inset-0 bg-[var(--primary-color)] rounded-full animate-pulse opacity-20"></div>
                    )}
                  </div>
                  
                  {/* Option Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <span className="text-gray-800 group-hover:text-gray-900 transition-colors">
                        {option.text}
                      </span>
                      <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                        <span className="text-xs text-[var(--accent-color)] font-medium bg-[var(--accent-color)] bg-opacity-10 px-2 py-1 rounded">
                          {option.level}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    
                    {/* Option Description (if available) */}
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Selection Animation */}
                {answers[currentQ.id] === option.value && (
                  <div className="absolute inset-0 border-2 border-[var(--primary-color)] rounded-lg animate-pulse opacity-30 pointer-events-none"></div>
                )}
              </label>
            ))}
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0 || isTransitioning}
              className={`btn flex items-center space-x-2 ${
                currentQuestion === 0 || isTransitioning ? 'btn:disabled' : 'btn-outline'
              }`}
              title="上一题 (← 或 Backspace)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>上一题</span>
            </button>
            
            {/* Question Overview (for future enhancement) */}
            <div className="hidden md:flex items-center space-x-1">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => jumpToQuestion(index)}
                  disabled={isTransitioning}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                    index === currentQuestion
                      ? 'bg-[var(--primary-color)] text-white'
                      : answers[questions[index].id]
                      ? 'bg-[var(--accent-color)] text-[var(--primary-color)]'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title={`第${index + 1}题: ${questions[index].dimension}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id] || isTransitioning}
              className={`btn flex items-center space-x-2 ${
                !answers[currentQ.id] || isTransitioning
                  ? 'btn:disabled'
                  : currentQuestion === questions.length - 1
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
              title={currentQuestion === questions.length - 1 ? '查看结果' : '下一题 (→ 或 Enter)'}
            >
              <span>{currentQuestion === questions.length - 1 ? '查看结果' : '下一题'}</span>
              {currentQuestion === questions.length - 1 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Keyboard Shortcuts Help */}
          <div className="mt-4 text-center">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">键盘快捷键</summary>
              <div className="mt-2 space-y-1">
                <div>← / Backspace: 上一题</div>
                <div>→ / Enter: 下一题</div>
                <div>1-5: 快速选择选项</div>
                <div>Esc: 退出测评</div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

window.StandaloneAssessment = StandaloneAssessment;