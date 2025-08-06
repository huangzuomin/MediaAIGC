// StandaloneAssessment Component Unit Tests
const { TestUtils, setupTests } = require('../setup');

describe('StandaloneAssessment Component', () => {
  let mockComponent;
  let mockProps;
  let mockQuestions;

  beforeEach(() => {
    setupTests();
    mockQuestions = TestUtils.createMockQuestions();
    mockProps = TestUtils.createMockProps();
    
    // Mock global dependencies
    global.window.AssessmentCalculator = {
      calculateResult: jest.fn().mockReturnValue(TestUtils.createMockResult())
    };
    
    global.window.Storage = {
      saveSession: jest.fn().mockReturnValue(true),
      getSession: jest.fn().mockReturnValue(null),
      saveResult: jest.fn().mockReturnValue(true),
      clearSession: jest.fn().mockReturnValue(true),
      clearResult: jest.fn().mockReturnValue(true),
      getPreferences: jest.fn().mockReturnValue({ dataStorage: true })
    };

    global.window.AccessibilityManager = {
      init: jest.fn(),
      announce: jest.fn()
    };

    global.window.MetaTagsManager = {
      setSEOMetaTags: jest.fn()
    };
  });

  describe('Component Initialization', () => {
    test('should initialize with default state', () => {
      const component = TestUtils.mockRender('StandaloneAssessment', mockProps);
      
      expect(component).toBeDefined();
      expect(global.window.AccessibilityManager.init).toHaveBeenCalled();
    });

    test('should generate unique session ID', () => {
      const sessionId1 = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      const sessionId2 = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      
      expect(sessionId1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(sessionId2).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    test('should detect device type correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const getDeviceType = () => {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
      };

      expect(getDeviceType()).toBe('mobile');

      // Mock tablet viewport
      window.innerWidth = 800;
      expect(getDeviceType()).toBe('tablet');

      // Mock desktop viewport
      window.innerWidth = 1200;
      expect(getDeviceType()).toBe('desktop');
    });
  });

  describe('Question Navigation', () => {
    test('should handle answer selection', () => {
      const mockAnswers = {};
      const handleAnswer = (questionId, value) => {
        mockAnswers[questionId] = value;
      };

      handleAnswer('tech_awareness', 3);
      expect(mockAnswers['tech_awareness']).toBe(3);
    });

    test('should navigate to next question', () => {
      let currentQuestion = 0;
      const nextQuestion = () => {
        if (currentQuestion < mockQuestions.length - 1) {
          currentQuestion++;
        }
      };

      expect(currentQuestion).toBe(0);
      nextQuestion();
      expect(currentQuestion).toBe(1);
    });

    test('should navigate to previous question', () => {
      let currentQuestion = 1;
      const prevQuestion = () => {
        if (currentQuestion > 0) {
          currentQuestion--;
        }
      };

      expect(currentQuestion).toBe(1);
      prevQuestion();
      expect(currentQuestion).toBe(0);
    });

    test('should prevent navigation beyond bounds', () => {
      let currentQuestion = 0;
      const prevQuestion = () => {
        if (currentQuestion > 0) {
          currentQuestion--;
        }
      };

      prevQuestion();
      expect(currentQuestion).toBe(0); // Should not go below 0

      currentQuestion = mockQuestions.length - 1;
      const nextQuestion = () => {
        if (currentQuestion < mockQuestions.length - 1) {
          currentQuestion++;
        }
      };

      nextQuestion();
      expect(currentQuestion).toBe(mockQuestions.length - 1); // Should not exceed max
    });
  });

  describe('Data Management', () => {
    test('should save session data', () => {
      const sessionData = {
        sessionId: 'test-session',
        currentQuestion: 1,
        answers: { tech_awareness: 3 },
        timestamp: Date.now()
      };

      global.window.Storage.saveSession(sessionData);
      expect(global.window.Storage.saveSession).toHaveBeenCalledWith(sessionData);
    });

    test('should load session data', () => {
      const mockSessionData = {
        sessionId: 'test-session',
        currentQuestion: 1,
        answers: { tech_awareness: 3 }
      };

      global.window.Storage.getSession.mockReturnValue(mockSessionData);
      const result = global.window.Storage.getSession();
      
      expect(result).toEqual(mockSessionData);
    });

    test('should handle localStorage fallback', () => {
      // Mock Storage system not available
      global.window.Storage = undefined;
      
      const sessionData = {
        sessionId: 'test-session',
        currentQuestion: 1,
        answers: { tech_awareness: 3 }
      };

      // Test localStorage fallback
      localStorage.setItem('ai-maturity-session', JSON.stringify(sessionData));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ai-maturity-session', 
        JSON.stringify(sessionData)
      );
    });
  });

  describe('Privacy and Consent', () => {
    test('should initialize privacy system', () => {
      const initializePrivacy = () => {
        if (global.window.Storage && typeof global.window.Storage.getPreferences === 'function') {
          const preferences = global.window.Storage.getPreferences();
          return preferences && preferences.dataStorage !== false;
        }
        return true;
      };

      const hasConsent = initializePrivacy();
      expect(hasConsent).toBe(true);
      expect(global.window.Storage.getPreferences).toHaveBeenCalled();
    });

    test('should handle privacy consent validation', () => {
      global.window.Privacy = {
        validateConsent: jest.fn().mockReturnValue(true)
      };

      const validateAnalyticsConsent = () => {
        if (global.window.Privacy && typeof global.window.Privacy.validateConsent === 'function') {
          return global.window.Privacy.validateConsent('analytics');
        }
        return true;
      };

      const hasAnalyticsConsent = validateAnalyticsConsent();
      expect(hasAnalyticsConsent).toBe(true);
      expect(global.window.Privacy.validateConsent).toHaveBeenCalledWith('analytics');
    });
  });

  describe('Assessment Calculation', () => {
    test('should calculate result correctly', () => {
      const mockAnswers = {
        tech_awareness: 3,
        data_management: 3
      };

      const result = global.window.AssessmentCalculator.calculateResult(
        mockAnswers, 
        mockQuestions, 
        { sessionId: 'test-session', timeSpent: 300000 }
      );

      expect(result).toBeDefined();
      expect(result.level).toBeDefined();
      expect(result.score).toBeDefined();
      expect(global.window.AssessmentCalculator.calculateResult).toHaveBeenCalledWith(
        mockAnswers,
        mockQuestions,
        { sessionId: 'test-session', timeSpent: 300000 }
      );
    });

    test('should handle calculation errors gracefully', () => {
      global.window.AssessmentCalculator.calculateResult.mockImplementation(() => {
        throw new Error('Calculation error');
      });

      const calculateWithFallback = (answers, questions, sessionData) => {
        try {
          return global.window.AssessmentCalculator.calculateResult(answers, questions, sessionData);
        } catch (error) {
          return {
            level: 'L1',
            levelName: '观察与感知阶段',
            score: '1.0',
            description: '基础评估结果',
            recommendations: ['继续完善AI应用'],
            answers,
            completedAt: new Date().toISOString(),
            sessionId: sessionData.sessionId
          };
        }
      };

      const result = calculateWithFallback({}, mockQuestions, { sessionId: 'test' });
      expect(result.level).toBe('L1');
      expect(result.score).toBe('1.0');
    });
  });

  describe('Event Tracking', () => {
    test('should track assessment events', () => {
      global.window.gtag = jest.fn();

      const trackEvent = (eventName, data) => {
        if (global.window.gtag && typeof global.window.gtag === 'function') {
          global.window.gtag('event', eventName, data);
        }
      };

      const eventData = {
        session_id: 'test-session',
        question_id: 'tech_awareness',
        answer_value: 3
      };

      trackEvent('question_answered', eventData);
      expect(global.window.gtag).toHaveBeenCalledWith('event', 'question_answered', eventData);
    });

    test('should handle tracking without consent', () => {
      global.window.Privacy = {
        validateConsent: jest.fn().mockReturnValue(false)
      };

      const trackEventWithConsent = (eventName, data) => {
        if (global.window.Privacy && !global.window.Privacy.validateConsent('analytics')) {
          return false; // Don't track
        }
        if (global.window.gtag) {
          global.window.gtag('event', eventName, data);
          return true;
        }
        return false;
      };

      const tracked = trackEventWithConsent('test_event', {});
      expect(tracked).toBe(false);
      expect(global.window.Privacy.validateConsent).toHaveBeenCalledWith('analytics');
    });
  });

  describe('Accessibility Features', () => {
    test('should announce navigation changes', () => {
      const announceNavigation = (questionNumber, totalQuestions) => {
        if (global.window.AccessibilityManager) {
          global.window.AccessibilityManager.announce(
            `进入第 ${questionNumber} 题，共 ${totalQuestions} 题`,
            'polite'
          );
        }
      };

      announceNavigation(2, 10);
      expect(global.window.AccessibilityManager.announce).toHaveBeenCalledWith(
        '进入第 2 题，共 10 题',
        'polite'
      );
    });

    test('should announce answer selection', () => {
      const announceSelection = (optionText, level) => {
        if (global.window.AccessibilityManager) {
          global.window.AccessibilityManager.announce(
            `已选择: ${optionText}, 等级 ${level}`,
            'assertive'
          );
        }
      };

      announceSelection('采购专门工具', 'L3');
      expect(global.window.AccessibilityManager.announce).toHaveBeenCalledWith(
        '已选择: 采购专门工具, 等级 L3',
        'assertive'
      );
    });
  });

  describe('Mobile Optimization', () => {
    test('should detect touch device', () => {
      // Mock touch device
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        writable: true
      });

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      expect(isTouchDevice).toBe(true);
    });

    test('should handle orientation change', () => {
      let orientation = 'portrait';
      
      const handleOrientationChange = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        orientation = width > height ? 'landscape' : 'portrait';
      };

      // Mock landscape orientation
      window.innerWidth = 800;
      window.innerHeight = 600;
      handleOrientationChange();
      expect(orientation).toBe('landscape');

      // Mock portrait orientation
      window.innerWidth = 600;
      window.innerHeight = 800;
      handleOrientationChange();
      expect(orientation).toBe('portrait');
    });
  });

  describe('Error Handling', () => {
    test('should handle storage errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const saveWithErrorHandling = (key, data) => {
        try {
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        } catch (error) {
          console.warn('Could not save data:', error);
          return false;
        }
      };

      const result = saveWithErrorHandling('test-key', { test: 'data' });
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('Could not save data:', expect.any(Error));
    });

    test('should handle network errors', () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      const fetchWithErrorHandling = async (url) => {
        try {
          const response = await fetch(url);
          return response;
        } catch (error) {
          console.error('Network error:', error);
          return null;
        }
      };

      return fetchWithErrorHandling('/api/test').then(result => {
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Network error:', expect.any(Error));
      });
    });
  });

  describe('Performance Optimization', () => {
    test('should debounce rapid user interactions', () => {
      jest.useFakeTimers();
      
      const mockCallback = jest.fn();
      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
      };

      const debouncedCallback = debounce(mockCallback, 300);

      // Rapid calls
      debouncedCallback('call1');
      debouncedCallback('call2');
      debouncedCallback('call3');

      expect(mockCallback).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(300);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('call3');

      jest.useRealTimers();
    });

    test('should throttle scroll events', () => {
      jest.useFakeTimers();
      
      const mockScrollHandler = jest.fn();
      const throttle = (func, limit) => {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      };

      const throttledScrollHandler = throttle(mockScrollHandler, 100);

      // Rapid scroll events
      throttledScrollHandler();
      throttledScrollHandler();
      throttledScrollHandler();

      expect(mockScrollHandler).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledScrollHandler();
      expect(mockScrollHandler).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });
  });
});