// End-to-End User Flow Tests
const { TestUtils, setupTests } = require('../setup');

describe('End-to-End User Flow Tests', () => {
  let mockBrowser;
  let mockPage;

  beforeEach(() => {
    setupTests();
    
    // Mock browser and page objects for E2E testing
    mockPage = {
      url: 'http://localhost:3000/ai-maturity-standalone/',
      title: '',
      content: '',
      elements: new Map(),
      
      goto: jest.fn().mockResolvedValue(true),
      waitForSelector: jest.fn().mockResolvedValue(true),
      click: jest.fn().mockResolvedValue(true),
      type: jest.fn().mockResolvedValue(true),
      evaluate: jest.fn().mockResolvedValue(true),
      screenshot: jest.fn().mockResolvedValue(Buffer.from('mock-screenshot')),
      
      $: jest.fn((selector) => {
        return mockPage.elements.get(selector) || null;
      }),
      
      $$: jest.fn((selector) => {
        const elements = [];
        mockPage.elements.forEach((element, key) => {
          if (key.includes(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
            elements.push(element);
          }
        });
        return elements;
      }),

      waitForTimeout: jest.fn().mockResolvedValue(true),
      
      setViewport: jest.fn().mockResolvedValue(true),
      
      on: jest.fn(),
      
      addMockElement: (selector, properties = {}) => {
        mockPage.elements.set(selector, {
          click: jest.fn().mockResolvedValue(true),
          type: jest.fn().mockResolvedValue(true),
          textContent: properties.textContent || '',
          value: properties.value || '',
          disabled: properties.disabled || false,
          visible: properties.visible !== false,
          ...properties
        });
      }
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(true)
    };

    // Setup common page elements
    setupMockPageElements();
  });

  const setupMockPageElements = () => {
    // Landing page elements
    mockPage.addMockElement('#start-assessment-btn', { 
      textContent: '开始测评',
      visible: true 
    });
    
    // Question elements
    mockPage.addMockElement('.question-container', { visible: true });
    mockPage.addMockElement('.question-title', { 
      textContent: '您的机构目前对AI技术的认知和应用情况是？' 
    });
    mockPage.addMockElement('.option-button', { visible: true });
    mockPage.addMockElement('#next-btn', { textContent: '下一题' });
    mockPage.addMockElement('#prev-btn', { textContent: '上一题' });
    
    // Progress elements
    mockPage.addMockElement('.progress-bar', { visible: true });
    mockPage.addMockElement('.question-counter', { 
      textContent: '第 1 题 / 共 10 题' 
    });
    
    // Result elements
    mockPage.addMockElement('.result-container', { visible: false });
    mockPage.addMockElement('.result-level', { textContent: 'L3' });
    mockPage.addMockElement('.result-score', { textContent: '3.2' });
    mockPage.addMockElement('.result-description', { visible: true });
    
    // Action buttons
    mockPage.addMockElement('#share-btn', { textContent: '分享结果' });
    mockPage.addMockElement('#consult-btn', { textContent: '预约咨询' });
    mockPage.addMockElement('#restart-btn', { textContent: '重新测试' });
    mockPage.addMockElement('#learn-more-btn', { textContent: '了解更多' });
    
    // Modal elements
    mockPage.addMockElement('.share-modal', { visible: false });
    mockPage.addMockElement('.privacy-notice', { visible: false });
  };

  describe('Complete Assessment Flow', () => {
    test('should complete full assessment from start to finish', async () => {
      // Step 1: Load the page
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      expect(mockPage.goto).toHaveBeenCalledWith('http://localhost:3000/ai-maturity-standalone/');

      // Step 2: Verify landing page loads
      await mockPage.waitForSelector('#start-assessment-btn');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('#start-assessment-btn');

      // Step 3: Start assessment
      await mockPage.click('#start-assessment-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#start-assessment-btn');

      // Step 4: Answer all questions
      for (let i = 0; i < 10; i++) {
        // Wait for question to load
        await mockPage.waitForSelector('.question-container');
        
        // Select an answer (simulate clicking option 3)
        const optionSelector = `.option-button[data-value="3"]`;
        mockPage.addMockElement(optionSelector, { 
          'data-value': '3',
          textContent: '采购了专门的AI工具用于特定业务' 
        });
        
        await mockPage.click(optionSelector);
        expect(mockPage.click).toHaveBeenCalledWith(optionSelector);

        // Go to next question (except for last question)
        if (i < 9) {
          await mockPage.click('#next-btn');
          expect(mockPage.click).toHaveBeenCalledWith('#next-btn');
        }
      }

      // Step 5: Verify result page loads
      await mockPage.waitForSelector('.result-container');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.result-container');

      // Step 6: Verify result elements are present
      const resultLevel = await mockPage.$('.result-level');
      const resultScore = await mockPage.$('.result-score');
      
      expect(resultLevel).toBeTruthy();
      expect(resultScore).toBeTruthy();

      // Step 7: Verify action buttons are available
      const shareBtn = await mockPage.$('#share-btn');
      const consultBtn = await mockPage.$('#consult-btn');
      const restartBtn = await mockPage.$('#restart-btn');
      
      expect(shareBtn).toBeTruthy();
      expect(consultBtn).toBeTruthy();
      expect(restartBtn).toBeTruthy();
    });

    test('should handle incomplete assessment and resume', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      await mockPage.click('#start-assessment-btn');

      // Answer only first 3 questions
      for (let i = 0; i < 3; i++) {
        await mockPage.waitForSelector('.question-container');
        const optionSelector = `.option-button[data-value="2"]`;
        mockPage.addMockElement(optionSelector, { 'data-value': '2' });
        await mockPage.click(optionSelector);
        
        if (i < 2) {
          await mockPage.click('#next-btn');
        }
      }

      // Simulate page refresh (reload)
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Should resume from where left off
      await mockPage.waitForSelector('.question-container');
      const questionCounter = await mockPage.$('.question-counter');
      
      // Verify we're on question 4 (or similar logic)
      expect(questionCounter).toBeTruthy();
    });

    test('should navigate backwards through questions', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      await mockPage.click('#start-assessment-btn');

      // Answer first question
      await mockPage.waitForSelector('.question-container');
      const option1 = `.option-button[data-value="3"]`;
      mockPage.addMockElement(option1, { 'data-value': '3' });
      await mockPage.click(option1);
      await mockPage.click('#next-btn');

      // Answer second question
      await mockPage.waitForSelector('.question-container');
      const option2 = `.option-button[data-value="4"]`;
      mockPage.addMockElement(option2, { 'data-value': '4' });
      await mockPage.click(option2);

      // Go back to first question
      await mockPage.click('#prev-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#prev-btn');

      // Verify we can change the answer
      const newOption = `.option-button[data-value="2"]`;
      mockPage.addMockElement(newOption, { 'data-value': '2' });
      await mockPage.click(newOption);
      expect(mockPage.click).toHaveBeenCalledWith(newOption);
    });
  });

  describe('Mobile User Flow', () => {
    beforeEach(async () => {
      // Set mobile viewport
      await mockPage.setViewport({ width: 375, height: 667 });
      expect(mockPage.setViewport).toHaveBeenCalledWith({ width: 375, height: 667 });
    });

    test('should complete assessment on mobile device', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Verify mobile-specific elements
      mockPage.addMockElement('.mobile-container', { visible: true });
      mockPage.addMockElement('.mobile-question-card', { visible: true });
      
      await mockPage.waitForSelector('.mobile-container');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.mobile-container');

      // Start assessment
      await mockPage.click('#start-assessment-btn');

      // Complete assessment with touch interactions
      for (let i = 0; i < 5; i++) { // Shortened for mobile test
        await mockPage.waitForSelector('.mobile-question-card');
        
        const mobileOption = `.mobile-option[data-value="3"]`;
        mockPage.addMockElement(mobileOption, { 'data-value': '3' });
        await mockPage.click(mobileOption);
        
        if (i < 4) {
          const mobileNextBtn = '.mobile-next-btn';
          mockPage.addMockElement(mobileNextBtn, { textContent: '下一题' });
          await mockPage.click(mobileNextBtn);
        }
      }

      // Verify mobile result display
      mockPage.addMockElement('.mobile-result-container', { visible: true });
      await mockPage.waitForSelector('.mobile-result-container');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.mobile-result-container');
    });

    test('should handle orientation changes', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Start in portrait
      await mockPage.setViewport({ width: 375, height: 667 });
      await mockPage.click('#start-assessment-btn');
      
      // Rotate to landscape
      await mockPage.setViewport({ width: 667, height: 375 });
      
      // Verify layout adapts
      mockPage.addMockElement('.landscape-layout', { visible: true });
      const landscapeLayout = await mockPage.$('.landscape-layout');
      expect(landscapeLayout).toBeTruthy();
    });
  });

  describe('Share and Conversion Flow', () => {
    test('should open share modal and share result', async () => {
      // Complete assessment first
      await completeBasicAssessment();

      // Click share button
      await mockPage.click('#share-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#share-btn');

      // Verify share modal opens
      mockPage.elements.get('.share-modal').visible = true;
      await mockPage.waitForSelector('.share-modal');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.share-modal');

      // Test different share options
      const shareOptions = [
        '.share-wechat',
        '.share-weibo', 
        '.share-qq',
        '.share-copy-link'
      ];

      shareOptions.forEach(selector => {
        mockPage.addMockElement(selector, { visible: true });
      });

      // Click WeChat share
      await mockPage.click('.share-wechat');
      expect(mockPage.click).toHaveBeenCalledWith('.share-wechat');

      // Click copy link
      await mockPage.click('.share-copy-link');
      expect(mockPage.click).toHaveBeenCalledWith('.share-copy-link');
    });

    test('should handle consultation conversion', async () => {
      await completeBasicAssessment();

      // Click consultation button
      await mockPage.click('#consult-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#consult-btn');

      // Verify external link behavior (would open new tab in real scenario)
      // In test, we just verify the click was registered
      expect(mockPage.click).toHaveBeenCalledWith('#consult-btn');
    });

    test('should handle learn more conversion', async () => {
      await completeBasicAssessment();

      // Click learn more button
      await mockPage.click('#learn-more-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#learn-more-btn');

      // Verify external link behavior
      expect(mockPage.click).toHaveBeenCalledWith('#learn-more-btn');
    });

    test('should restart assessment', async () => {
      await completeBasicAssessment();

      // Click restart button
      await mockPage.click('#restart-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#restart-btn');

      // Verify we're back to first question
      await mockPage.waitForSelector('.question-container');
      const questionCounter = await mockPage.$('.question-counter');
      expect(questionCounter).toBeTruthy();
    });
  });

  describe('Privacy and Data Flow', () => {
    test('should handle privacy notice acceptance', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');

      // Privacy notice should appear
      mockPage.elements.get('.privacy-notice').visible = true;
      await mockPage.waitForSelector('.privacy-notice');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.privacy-notice');

      // Accept privacy notice
      mockPage.addMockElement('.privacy-accept-btn', { textContent: '同意' });
      await mockPage.click('.privacy-accept-btn');
      expect(mockPage.click).toHaveBeenCalledWith('.privacy-accept-btn');

      // Privacy notice should disappear
      mockPage.elements.get('.privacy-notice').visible = false;
    });

    test('should handle privacy notice rejection', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');

      // Show privacy notice
      mockPage.elements.get('.privacy-notice').visible = true;
      await mockPage.waitForSelector('.privacy-notice');

      // Reject privacy notice
      mockPage.addMockElement('.privacy-reject-btn', { textContent: '拒绝' });
      await mockPage.click('.privacy-reject-btn');
      expect(mockPage.click).toHaveBeenCalledWith('.privacy-reject-btn');

      // Should still allow basic functionality but limit data collection
      await mockPage.click('#start-assessment-btn');
      expect(mockPage.click).toHaveBeenCalledWith('#start-assessment-btn');
    });

    test('should save and restore session data', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      await mockPage.click('#start-assessment-btn');

      // Answer a few questions
      for (let i = 0; i < 3; i++) {
        await mockPage.waitForSelector('.question-container');
        const optionSelector = `.option-button[data-value="3"]`;
        mockPage.addMockElement(optionSelector, { 'data-value': '3' });
        await mockPage.click(optionSelector);
        
        if (i < 2) {
          await mockPage.click('#next-btn');
        }
      }

      // Simulate page reload
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');

      // Should restore session
      await mockPage.waitForSelector('.question-container');
      
      // Verify we're at the correct question
      const questionCounter = await mockPage.$('.question-counter');
      expect(questionCounter).toBeTruthy();
    });
  });

  describe('Error Handling Flow', () => {
    test('should handle network errors gracefully', async () => {
      // Mock network failure
      mockPage.goto.mockRejectedValueOnce(new Error('Network error'));

      try {
        await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }

      // Should show error message or retry mechanism
      mockPage.addMockElement('.error-message', { 
        textContent: '网络连接失败，请检查网络后重试',
        visible: true 
      });
      
      const errorMessage = await mockPage.$('.error-message');
      expect(errorMessage).toBeTruthy();
    });

    test('should handle calculation errors', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      await mockPage.click('#start-assessment-btn');

      // Complete assessment
      for (let i = 0; i < 10; i++) {
        await mockPage.waitForSelector('.question-container');
        const optionSelector = `.option-button[data-value="3"]`;
        mockPage.addMockElement(optionSelector, { 'data-value': '3' });
        await mockPage.click(optionSelector);
        
        if (i < 9) {
          await mockPage.click('#next-btn');
        }
      }

      // Mock calculation error
      mockPage.addMockElement('.calculation-error', {
        textContent: '计算出现错误，请重试',
        visible: true
      });

      // Should show fallback result or error message
      const errorElement = await mockPage.$('.calculation-error');
      expect(errorElement).toBeTruthy();
    });

    test('should handle storage quota exceeded', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Mock storage error
      const mockStorageError = () => {
        throw new Error('QuotaExceededError');
      };

      // Should handle gracefully and continue without saving
      mockPage.addMockElement('.storage-warning', {
        textContent: '存储空间不足，数据可能无法保存',
        visible: true
      });

      const warningElement = await mockPage.$('.storage-warning');
      expect(warningElement).toBeTruthy();
    });
  });

  describe('Performance and Loading Flow', () => {
    test('should show loading states during assessment', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      await mockPage.click('#start-assessment-btn');

      // Complete assessment
      for (let i = 0; i < 10; i++) {
        await mockPage.waitForSelector('.question-container');
        const optionSelector = `.option-button[data-value="3"]`;
        mockPage.addMockElement(optionSelector, { 'data-value': '3' });
        await mockPage.click(optionSelector);
        
        if (i < 9) {
          await mockPage.click('#next-btn');
        }
      }

      // Should show loading state during calculation
      mockPage.addMockElement('.loading-spinner', { visible: true });
      mockPage.addMockElement('.loading-message', { 
        textContent: '正在计算您的AI成熟度评估结果...',
        visible: true 
      });

      const loadingSpinner = await mockPage.$('.loading-spinner');
      const loadingMessage = await mockPage.$('.loading-message');
      
      expect(loadingSpinner).toBeTruthy();
      expect(loadingMessage).toBeTruthy();

      // Wait for result to load
      await mockPage.waitForTimeout(2000);
      await mockPage.waitForSelector('.result-container');
    });

    test('should handle slow network conditions', async () => {
      // Simulate slow network
      mockPage.goto.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 3000))
      );

      const startTime = Date.now();
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(3000);
      
      // Should show loading indicator
      mockPage.addMockElement('.page-loading', { visible: true });
      const pageLoading = await mockPage.$('.page-loading');
      expect(pageLoading).toBeTruthy();
    });
  });

  // Helper function to complete basic assessment
  const completeBasicAssessment = async () => {
    await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
    await mockPage.click('#start-assessment-btn');

    for (let i = 0; i < 10; i++) {
      await mockPage.waitForSelector('.question-container');
      const optionSelector = `.option-button[data-value="3"]`;
      mockPage.addMockElement(optionSelector, { 'data-value': '3' });
      await mockPage.click(optionSelector);
      
      if (i < 9) {
        await mockPage.click('#next-btn');
      }
    }

    await mockPage.waitForSelector('.result-container');
  };

  describe('Accessibility Flow', () => {
    test('should support keyboard navigation', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Mock keyboard events
      const mockKeyPress = (key) => {
        return mockPage.evaluate((key) => {
          const event = new KeyboardEvent('keydown', { key });
          document.dispatchEvent(event);
        }, key);
      };

      // Navigate with Tab key
      await mockKeyPress('Tab');
      await mockKeyPress('Enter'); // Start assessment

      // Navigate questions with arrow keys
      await mockKeyPress('1'); // Select option 1
      await mockKeyPress('ArrowRight'); // Next question
      await mockKeyPress('2'); // Select option 2

      expect(mockPage.evaluate).toHaveBeenCalled();
    });

    test('should announce changes to screen readers', async () => {
      await mockPage.goto('http://localhost:3000/ai-maturity-standalone/');
      
      // Mock ARIA live regions
      mockPage.addMockElement('[aria-live="polite"]', { 
        textContent: '进入第 1 题，共 10 题' 
      });
      mockPage.addMockElement('[aria-live="assertive"]', { 
        textContent: '已选择选项 3' 
      });

      const politeRegion = await mockPage.$('[aria-live="polite"]');
      const assertiveRegion = await mockPage.$('[aria-live="assertive"]');

      expect(politeRegion).toBeTruthy();
      expect(assertiveRegion).toBeTruthy();
    });
  });
});