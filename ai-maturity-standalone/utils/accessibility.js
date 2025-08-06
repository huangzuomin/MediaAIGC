// Comprehensive Accessibility and UX Enhancement Utilities
const AccessibilityManager = {
  // Initialize accessibility features
  init: function() {
    console.log('Initializing accessibility features...');
    
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.optimizeColorContrast();
    this.setupFocusManagement();
    this.addLoadingAnimations();
    this.setupInteractionFeedback();
    this.setupReducedMotionSupport();
    this.setupHighContrastSupport();
    this.addSkipLinks();
    this.setupLiveRegions();
    
    console.log('Accessibility features initialized');
  },

  // Enhanced keyboard navigation
  setupKeyboardNavigation: function() {
    // Add keyboard navigation styles
    const keyboardStyles = document.createElement('style');
    keyboardStyles.id = 'keyboard-navigation-styles';
    keyboardStyles.textContent = `
      /* Enhanced focus indicators */
      .keyboard-navigation *:focus {
        outline: 3px solid var(--primary-color) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 1px white, 0 0 0 4px var(--primary-color) !important;
        border-radius: 4px;
      }
      
      /* Skip to content link */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        font-weight: bold;
        transition: top 0.3s ease;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      /* Enhanced button focus states */
      .btn:focus-visible {
        outline: 3px solid var(--accent-color) !important;
        outline-offset: 2px !important;
        transform: translateY(-1px);
      }
      
      /* Radio option focus states */
      .radio-option:focus-within {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.2) !important;
        background-color: rgba(0, 51, 102, 0.05) !important;
      }
      
      /* Mobile-specific focus improvements */
      .mobile-option:focus-within {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.2) !important;
        transform: scale(1.02);
      }
      
      /* Navigation button focus */
      .mobile-nav-button:focus-visible {
        outline: 3px solid var(--accent-color) !important;
        outline-offset: 2px !important;
      }
      
      /* Tab navigation indicators */
      .tab-navigation .mobile-tab:focus {
        background: rgba(0, 51, 102, 0.1) !important;
        outline: 2px solid var(--primary-color) !important;
        outline-offset: -2px !important;
      }
    `;
    document.head.appendChild(keyboardStyles);

    // Enhanced keyboard event handling
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    
    // Track keyboard usage
    document.addEventListener('keydown', () => {
      document.body.classList.add('keyboard-navigation');
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  },

  // Global keyboard navigation handler
  handleGlobalKeydown: function(event) {
    const { key, ctrlKey, altKey, shiftKey } = event;
    
    // Skip if user is typing in an input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      return;
    }
    
    switch (key) {
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
      case 'Escape':
        this.handleEscape(event);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this.handleArrowNavigation(event);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        if (!ctrlKey && !altKey) {
          this.handleNumberKeySelection(event);
        }
        break;
      case 'h':
        if (altKey) {
          event.preventDefault();
          this.showKeyboardHelp();
        }
        break;
    }
  },

  // Handle tab navigation
  handleTabNavigation: function(event) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(event.target);
    
    if (currentIndex === -1) return;
    
    // Announce navigation context to screen readers
    this.announceNavigationContext(event.target);
  },

  // Handle activation (Enter/Space)
  handleActivation: function(event) {
    const target = event.target;
    
    if (target.classList.contains('radio-option') || target.classList.contains('mobile-option')) {
      event.preventDefault();
      const radioInput = target.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.click();
        this.announceSelection(target);
      }
    }
  },

  // Handle escape key
  handleEscape: function(event) {
    // Close modals, return to main content
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal) {
      event.preventDefault();
      this.closeModal(modal);
    }
  },

  // Handle arrow key navigation
  handleArrowNavigation: function(event) {
    const currentQuestion = document.querySelector('.question-container');
    if (!currentQuestion) return;
    
    const options = currentQuestion.querySelectorAll('.radio-option, .mobile-option');
    const currentIndex = Array.from(options).findIndex(option => 
      option.contains(event.target) || option === event.target
    );
    
    if (currentIndex === -1) return;
    
    event.preventDefault();
    
    let nextIndex;
    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % options.length;
    } else {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    }
    
    options[nextIndex].focus();
    this.announceOption(options[nextIndex]);
  },

  // Handle number key selection
  handleNumberKeySelection: function(event) {
    const questionContainer = document.querySelector('.question-container');
    if (!questionContainer) return;
    
    const optionNumber = parseInt(event.key);
    const options = questionContainer.querySelectorAll('.radio-option, .mobile-option');
    
    if (optionNumber > 0 && optionNumber <= options.length) {
      event.preventDefault();
      const targetOption = options[optionNumber - 1];
      const radioInput = targetOption.querySelector('input[type="radio"]');
      
      if (radioInput) {
        radioInput.click();
        targetOption.focus();
        this.announceSelection(targetOption);
      }
    }
  },

  // Get all focusable elements
  getFocusableElements: function() {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '.radio-option',
      '.mobile-option'
    ].join(', ');
    
    return Array.from(document.querySelectorAll(selector))
      .filter(el => this.isVisible(el));
  },

  // Check if element is visible
  isVisible: function(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetParent !== null;
  },

  // Screen reader support
  setupScreenReaderSupport: function() {
    // Add ARIA labels and descriptions
    this.addAriaLabels();
    this.setupLiveRegions();
    this.addLandmarks();
    this.improveFormLabeling();
  },

  // Add comprehensive ARIA labels
  addAriaLabels: function() {
    // Progress indicators
    const progressBars = document.querySelectorAll('.progress-bar, .mobile-progress-bar');
    progressBars.forEach(bar => {
      if (!bar.getAttribute('role')) {
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-label', '评估进度');
      }
    });

    // Question containers
    const questionContainers = document.querySelectorAll('.question-container, .card-body');
    questionContainers.forEach((container, index) => {
      if (!container.getAttribute('role')) {
        container.setAttribute('role', 'group');
        container.setAttribute('aria-labelledby', `question-title-${index}`);
      }
    });

    // Radio options
    const radioOptions = document.querySelectorAll('.radio-option, .mobile-option');
    radioOptions.forEach((option, index) => {
      if (!option.getAttribute('role')) {
        option.setAttribute('role', 'radio');
        option.setAttribute('tabindex', '0');
        
        const text = option.querySelector('.mobile-option-text, .radio-text')?.textContent || 
                    option.textContent.trim();
        const level = option.querySelector('.mobile-level-badge, .level-badge')?.textContent || '';
        
        option.setAttribute('aria-label', `选项 ${index + 1}: ${text} (等级: ${level})`);
      }
    });

    // Navigation buttons
    const navButtons = document.querySelectorAll('.mobile-nav-button, .btn');
    navButtons.forEach(button => {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        const isNext = button.classList.contains('next') || button.textContent.includes('下一');
        const isPrev = button.classList.contains('prev') || button.textContent.includes('上一');
        
        if (isNext) {
          button.setAttribute('aria-label', '下一题');
        } else if (isPrev) {
          button.setAttribute('aria-label', '上一题');
        }
      }
    });

    // Result elements
    const resultElements = document.querySelectorAll('.mobile-result-badge, .level-badge-inner');
    resultElements.forEach(element => {
      const level = element.textContent.trim();
      if (level && !element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', `AI成熟度等级: ${level}`);
      }
    });
  },

  // Setup live regions for dynamic announcements
  setupLiveRegions: function() {
    // Create main announcement region
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }

    // Create assertive region for urgent announcements
    if (!document.getElementById('aria-live-assertive')) {
      const assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'aria-live-assertive';
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(assertiveRegion);
    }
  },

  // Add semantic landmarks
  addLandmarks: function() {
    // Main content area
    const mainContent = document.querySelector('.container, .min-h-screen > div');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
      mainContent.setAttribute('aria-label', 'AI成熟度评估主要内容');
    }

    // Navigation areas
    const navAreas = document.querySelectorAll('.mobile-navigation, .navigation');
    navAreas.forEach(nav => {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', '评估导航');
      }
    });

    // Form regions
    const formAreas = document.querySelectorAll('.question-container');
    formAreas.forEach(form => {
      if (!form.getAttribute('role')) {
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', '评估问题');
      }
    });
  },

  // Improve form labeling
  improveFormLabeling: function() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
      if (!input.getAttribute('aria-describedby')) {
        const option = input.closest('.radio-option, .mobile-option');
        const description = option?.querySelector('.option-description, .mobile-option-text');
        
        if (description && !description.id) {
          description.id = `desc-${input.name}-${input.value}`;
          input.setAttribute('aria-describedby', description.id);
        }
      }
    });
  },

  // Color contrast optimization
  optimizeColorContrast: function() {
    const contrastStyles = document.createElement('style');
    contrastStyles.id = 'contrast-optimization';
    contrastStyles.textContent = `
      /* Enhanced contrast for better readability */
      .high-contrast {
        --text-primary: #000000;
        --text-secondary: #333333;
        --text-light: #666666;
        --border-light: #000000;
        --border-medium: #333333;
      }
      
      /* Ensure minimum contrast ratios */
      .mobile-option-text,
      .radio-option .radio-text,
      .question-text {
        color: #1a1a1a !important;
        font-weight: 500;
      }
      
      .mobile-level-badge,
      .level-badge {
        background: var(--accent-color) !important;
        color: var(--primary-color) !important;
        font-weight: 600;
        border: 1px solid var(--primary-color);
      }
      
      /* Enhanced button contrast */
      .btn-primary {
        background: var(--primary-color) !important;
        color: white !important;
        border: 2px solid var(--primary-color);
      }
      
      .btn-secondary {
        background: var(--accent-color) !important;
        color: var(--primary-color) !important;
        border: 2px solid var(--primary-color);
      }
      
      /* Progress bar contrast */
      .progress-fill,
      .mobile-progress-fill {
        background: linear-gradient(90deg, var(--primary-color) 0%, #004080 100%) !important;
      }
      
      /* Result display contrast */
      .mobile-result-title,
      .result-title {
        color: white !important;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      }
    `;
    document.head.appendChild(contrastStyles);

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }
  },

  // Focus management
  setupFocusManagement: function() {
    // Track focus for better UX
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', (event) => {
      lastFocusedElement = event.target;
      this.updateFocusContext(event.target);
    });

    // Restore focus when needed
    window.restoreFocus = () => {
      if (lastFocusedElement && this.isVisible(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
    };

    // Focus trap for modals
    this.setupFocusTrap();
  },

  // Update focus context for screen readers
  updateFocusContext: function(element) {
    const context = this.getFocusContext(element);
    if (context) {
      this.announce(context, 'polite');
    }
  },

  // Get contextual information for focused element
  getFocusContext: function(element) {
    if (element.classList.contains('radio-option') || element.classList.contains('mobile-option')) {
      const questionContainer = element.closest('.question-container, .card-body');
      const questionText = questionContainer?.querySelector('.question-text, .mobile-question-text')?.textContent;
      const optionText = element.querySelector('.mobile-option-text, .radio-text')?.textContent;
      const level = element.querySelector('.mobile-level-badge, .level-badge')?.textContent;
      
      return `问题: ${questionText}. 选项: ${optionText}. 等级: ${level}`;
    }
    
    if (element.classList.contains('mobile-nav-button') || element.classList.contains('btn')) {
      const buttonText = element.textContent.trim();
      const isDisabled = element.disabled;
      
      return `按钮: ${buttonText}${isDisabled ? ' (不可用)' : ''}`;
    }
    
    return null;
  },

  // Setup focus trap for modals
  setupFocusTrap: function() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal:not(.hidden)');
        if (modal) {
          this.trapFocus(event, modal);
        }
      }
    });
  },

  // Trap focus within modal
  trapFocus: function(event, container) {
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  },

  // Loading animations and feedback
  addLoadingAnimations: function() {
    const loadingStyles = document.createElement('style');
    loadingStyles.id = 'loading-animations';
    loadingStyles.textContent = `
      /* Enhanced loading spinner with accessibility */
      .loading-spinner {
        width: 2.5rem;
        height: 2.5rem;
        border: 3px solid var(--border-light);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }
      
      .loading-spinner[aria-label]::after {
        content: attr(aria-label);
        position: absolute;
        left: -10000px;
      }
      
      /* Skeleton loading for better perceived performance */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
      }
      
      @keyframes loading-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      /* Progress indicators */
      .progress-indicator {
        position: relative;
        overflow: hidden;
      }
      
      .progress-indicator::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: progress-shine 2s infinite;
      }
      
      @keyframes progress-shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      /* Smooth transitions */
      .smooth-transition {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .fade-in {
        animation: fadeIn 0.6s ease-out;
      }
      
      .slide-up {
        animation: slideUp 0.6s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `;
    document.head.appendChild(loadingStyles);
  },

  // Interactive feedback
  setupInteractionFeedback: function() {
    // Add haptic feedback for mobile devices
    this.setupHapticFeedback();
    
    // Add visual feedback for interactions
    this.setupVisualFeedback();
    
    // Add audio feedback (optional)
    this.setupAudioFeedback();
  },

  // Haptic feedback for mobile
  setupHapticFeedback: function() {
    if ('vibrate' in navigator) {
      document.addEventListener('click', (event) => {
        if (event.target.matches('.mobile-option, .mobile-nav-button, .btn')) {
          navigator.vibrate(50); // Short vibration
        }
      });
    }
  },

  // Visual feedback
  setupVisualFeedback: function() {
    const feedbackStyles = document.createElement('style');
    feedbackStyles.id = 'interaction-feedback';
    feedbackStyles.textContent = `
      /* Button press feedback */
      .btn:active,
      .mobile-nav-button:active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
      }
      
      /* Option selection feedback */
      .radio-option:active,
      .mobile-option:active {
        transform: scale(0.99);
        background-color: rgba(0, 51, 102, 0.1);
        transition: all 0.1s ease;
      }
      
      /* Success feedback */
      .success-feedback {
        background-color: rgba(0, 194, 146, 0.1);
        border-color: var(--success-color);
        animation: success-pulse 0.6s ease;
      }
      
      @keyframes success-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      
      /* Error feedback */
      .error-feedback {
        background-color: rgba(255, 107, 107, 0.1);
        border-color: var(--error-color);
        animation: error-shake 0.6s ease;
      }
      
      @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      /* Loading state feedback */
      .loading-state {
        opacity: 0.7;
        pointer-events: none;
        position: relative;
      }
      
      .loading-state::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid var(--primary-color);
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(feedbackStyles);
  },

  // Audio feedback (subtle)
  setupAudioFeedback: function() {
    // Create audio context for subtle feedback sounds
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create subtle click sound
      this.createClickSound = () => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
      };
    }
  },

  // Reduced motion support
  setupReducedMotionSupport: function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedMotionStyles = document.createElement('style');
      reducedMotionStyles.id = 'reduced-motion';
      reducedMotionStyles.textContent = `
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .reduced-motion .loading-spinner {
          animation: none;
          border-top-color: var(--primary-color);
        }
        
        .reduced-motion .progress-indicator::after {
          display: none;
        }
      `;
      document.head.appendChild(reducedMotionStyles);
      document.body.classList.add('reduced-motion');
    }
  },

  // High contrast support
  setupHighContrastSupport: function() {
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
      
      const highContrastStyles = document.createElement('style');
      highContrastStyles.id = 'high-contrast-mode';
      highContrastStyles.textContent = `
        .high-contrast {
          --primary-color: #000000;
          --accent-color: #FFFF00;
          --success-color: #00FF00;
          --error-color: #FF0000;
          --text-primary: #000000;
          --text-secondary: #000000;
          --bg-light: #FFFFFF;
          --border-light: #000000;
        }
        
        .high-contrast .mobile-option,
        .high-contrast .radio-option {
          border-width: 3px !important;
          border-color: #000000 !important;
        }
        
        .high-contrast .mobile-option.selected,
        .high-contrast .radio-option.selected {
          background: #FFFF00 !important;
          border-color: #000000 !important;
        }
        
        .high-contrast .btn {
          border: 3px solid #000000 !important;
        }
      `;
      document.head.appendChild(highContrastStyles);
    }
  },

  // Add skip links
  addSkipLinks: function() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = '跳转到主要内容';
    skipLink.setAttribute('aria-label', '跳过导航，直接到主要内容');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has the ID
    const mainContent = document.querySelector('[role="main"], .container, .min-h-screen > div');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  },

  // Announcement functions
  announce: function(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-region';
    const region = document.getElementById(regionId);
    
    if (region) {
      // Clear previous message
      region.textContent = '';
      
      // Add new message after a brief delay to ensure it's announced
      setTimeout(() => {
        region.textContent = message;
      }, 100);
      
      // Clear message after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 3000);
    }
  },

  // Announce navigation context
  announceNavigationContext: function(element) {
    const context = this.getFocusContext(element);
    if (context) {
      this.announce(context);
    }
  },

  // Announce option selection
  announceSelection: function(optionElement) {
    const text = optionElement.querySelector('.mobile-option-text, .radio-text')?.textContent;
    const level = optionElement.querySelector('.mobile-level-badge, .level-badge')?.textContent;
    
    if (text) {
      this.announce(`已选择: ${text}, 等级 ${level}`, 'assertive');
    }
  },

  // Announce option focus
  announceOption: function(optionElement) {
    const text = optionElement.querySelector('.mobile-option-text, .radio-text')?.textContent;
    const level = optionElement.querySelector('.mobile-level-badge, .level-badge')?.textContent;
    
    if (text) {
      this.announce(`选项: ${text}, 等级 ${level}`);
    }
  },

  // Show keyboard help
  showKeyboardHelp: function() {
    const helpModal = document.createElement('div');
    helpModal.className = 'modal keyboard-help-modal';
    helpModal.setAttribute('role', 'dialog');
    helpModal.setAttribute('aria-labelledby', 'keyboard-help-title');
    helpModal.setAttribute('aria-modal', 'true');
    
    helpModal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="keyboard-help-title">键盘快捷键帮助</h2>
          <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="关闭帮助">×</button>
        </div>
        <div class="modal-body">
          <div class="keyboard-shortcuts">
            <div class="shortcut-group">
              <h3>导航</h3>
              <div class="shortcut-item">
                <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>
                <span>在元素间导航</span>
              </div>
              <div class="shortcut-item">
                <kbd>↑</kbd> / <kbd>↓</kbd>
                <span>在选项间移动</span>
              </div>
            </div>
            <div class="shortcut-group">
              <h3>选择</h3>
              <div class="shortcut-item">
                <kbd>Enter</kbd> / <kbd>Space</kbd>
                <span>选择当前选项</span>
              </div>
              <div class="shortcut-item">
                <kbd>1-5</kbd>
                <span>直接选择对应选项</span>
              </div>
            </div>
            <div class="shortcut-group">
              <h3>其他</h3>
              <div class="shortcut-item">
                <kbd>Escape</kbd>
                <span>关闭弹窗或返回</span>
              </div>
              <div class="shortcut-item">
                <kbd>Alt + H</kbd>
                <span>显示此帮助</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .keyboard-help-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      
      .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
      }
      
      .modal-close:hover {
        background: #f1f5f9;
      }
      
      .modal-body {
        padding: 1.5rem;
      }
      
      .shortcut-group {
        margin-bottom: 1.5rem;
      }
      
      .shortcut-group h3 {
        margin-bottom: 0.75rem;
        color: var(--primary-color);
      }
      
      .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f5f9;
      }
      
      .shortcut-item:last-child {
        border-bottom: none;
      }
      
      kbd {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: monospace;
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(modalStyles);
    
    document.body.appendChild(helpModal);
    
    // Focus the close button
    const closeButton = helpModal.querySelector('.modal-close');
    closeButton.focus();
    
    // Announce modal opening
    this.announce('键盘快捷键帮助已打开', 'assertive');
  },

  // Close modal
  closeModal: function(modal) {
    modal.remove();
    this.announce('弹窗已关闭');
    
    // Restore focus if needed
    if (window.restoreFocus) {
      window.restoreFocus();
    }
  },

  // Utility functions for external use
  utils: {
    // Add loading state to element
    addLoadingState: function(element) {
      element.classList.add('loading-state');
      element.setAttribute('aria-busy', 'true');
      
      const loadingText = element.getAttribute('data-loading-text') || '加载中...';
      AccessibilityManager.announce(loadingText);
    },

    // Remove loading state
    removeLoadingState: function(element) {
      element.classList.remove('loading-state');
      element.removeAttribute('aria-busy');
    },

    // Add success feedback
    addSuccessFeedback: function(element, message) {
      element.classList.add('success-feedback');
      AccessibilityManager.announce(message || '操作成功', 'assertive');
      
      setTimeout(() => {
        element.classList.remove('success-feedback');
      }, 1000);
    },

    // Add error feedback
    addErrorFeedback: function(element, message) {
      element.classList.add('error-feedback');
      AccessibilityManager.announce(message || '操作失败', 'assertive');
      
      setTimeout(() => {
        element.classList.remove('error-feedback');
      }, 1000);
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AccessibilityManager.init());
} else {
  AccessibilityManager.init();
}

// Export for global use
window.AccessibilityManager = AccessibilityManager;