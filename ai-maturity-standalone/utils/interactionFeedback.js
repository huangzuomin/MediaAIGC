// Enhanced Interaction Feedback Utilities
const InteractionFeedback = {
  // Initialize feedback systems
  init: function() {
    console.log('Initializing interaction feedback...');
    
    this.setupHapticFeedback();
    this.setupVisualFeedback();
    this.setupAudioFeedback();
    this.setupGestureRecognition();
    this.addFeedbackStyles();
    
    console.log('Interaction feedback initialized');
  },

  // Haptic feedback for mobile devices
  setupHapticFeedback: function() {
    this.hapticSupported = 'vibrate' in navigator;
    
    if (this.hapticSupported) {
      // Different vibration patterns for different interactions
      this.vibrationPatterns = {
        light: 50,
        medium: 100,
        heavy: 200,
        success: [50, 50, 50],
        error: [100, 50, 100, 50, 100],
        warning: [50, 100, 50],
        selection: 30,
        navigation: 40,
        completion: [100, 50, 100, 50, 200]
      };
    }
  },

  // Visual feedback system
  setupVisualFeedback: function() {
    // Create feedback overlay for visual effects
    this.createFeedbackOverlay();
    
    // Setup ripple effect system
    this.setupRippleEffect();
    
    // Setup focus indicators
    this.setupFocusIndicators();
  },

  // Audio feedback system
  setupAudioFeedback: function() {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioEnabled = true;
        
        // Create different sound types
        this.soundTypes = {
          click: { frequency: 800, duration: 0.1, volume: 0.1 },
          success: { frequency: 1000, duration: 0.2, volume: 0.15 },
          error: { frequency: 400, duration: 0.3, volume: 0.2 },
          navigation: { frequency: 600, duration: 0.15, volume: 0.1 },
          selection: { frequency: 900, duration: 0.1, volume: 0.08 }
        };
      } catch (e) {
        console.warn('Audio feedback not available:', e);
        this.audioEnabled = false;
      }
    }
  },

  // Gesture recognition for enhanced interactions
  setupGestureRecognition: function() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Detect swipe gestures
      if (Math.abs(deltaX) > 50 && deltaTime < 300) {
        const direction = deltaX > 0 ? 'right' : 'left';
        this.handleSwipeGesture(direction, e.target);
      }
      
      // Detect long press
      if (deltaTime > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        this.handleLongPress(e.target);
      }
    }, { passive: true });
  },

  // Add CSS styles for feedback effects
  addFeedbackStyles: function() {
    const styles = document.createElement('style');
    styles.id = 'interaction-feedback-styles';
    styles.textContent = `
      /* Ripple effect */
      .ripple-container {
        position: relative;
        overflow: hidden;
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 51, 102, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      /* Press feedback */
      .press-feedback {
        transform: scale(0.98);
        transition: transform 0.1s ease;
      }
      
      /* Success feedback */
      .success-feedback {
        background-color: rgba(0, 194, 146, 0.1) !important;
        border-color: var(--success-color) !important;
        animation: success-pulse 0.6s ease;
      }
      
      @keyframes success-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      
      /* Error feedback */
      .error-feedback {
        background-color: rgba(255, 107, 107, 0.1) !important;
        border-color: var(--error-color) !important;
        animation: error-shake 0.6s ease;
      }
      
      @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      /* Focus enhancement */
      .enhanced-focus {
        box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.3) !important;
        border-color: var(--primary-color) !important;
      }
      
      /* Loading pulse */
      .loading-pulse {
        animation: loading-pulse 1.5s infinite;
      }
      
      @keyframes loading-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      /* Hover enhancement */
      .hover-enhance:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }
      
      /* Selection highlight */
      .selection-highlight {
        background: linear-gradient(135deg, rgba(0, 51, 102, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%);
        border-left: 4px solid var(--primary-color);
        animation: selection-glow 0.8s ease;
      }
      
      @keyframes selection-glow {
        0% { box-shadow: 0 0 0 rgba(0, 51, 102, 0.5); }
        50% { box-shadow: 0 0 20px rgba(0, 51, 102, 0.3); }
        100% { box-shadow: 0 0 0 rgba(0, 51, 102, 0.5); }
      }
      
      /* Progress feedback */
      .progress-feedback {
        position: relative;
        overflow: hidden;
      }
      
      .progress-feedback::after {
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
    `;
    document.head.appendChild(styles);
  },

  // Create feedback overlay for visual effects
  createFeedbackOverlay: function() {
    this.feedbackOverlay = document.createElement('div');
    this.feedbackOverlay.id = 'feedback-overlay';
    this.feedbackOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.feedbackOverlay);
  },

  // Setup ripple effect
  setupRippleEffect: function() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.mobile-option, .btn, .mobile-nav-button');
      if (target && !target.disabled) {
        this.createRipple(e, target);
      }
    });
  },

  // Create ripple effect
  createRipple: function(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    
    // Ensure element has ripple container class
    element.classList.add('ripple-container');
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  },

  // Setup enhanced focus indicators
  setupFocusIndicators: function() {
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('.mobile-option, .btn, .mobile-nav-button, input, select, textarea')) {
        e.target.classList.add('enhanced-focus');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('enhanced-focus');
    });
  },

  // Provide haptic feedback
  haptic: function(type = 'light') {
    if (!this.hapticSupported) return;
    
    const pattern = this.vibrationPatterns[type] || this.vibrationPatterns.light;
    navigator.vibrate(pattern);
  },

  // Play audio feedback
  playSound: function(type = 'click') {
    if (!this.audioEnabled || !this.audioContext) return;
    
    try {
      const soundConfig = this.soundTypes[type] || this.soundTypes.click;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(soundConfig.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + soundConfig.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  },

  // Handle swipe gestures
  handleSwipeGesture: function(direction, target) {
    // Check if we're in a question context
    const questionContainer = target.closest('.question-container, .card-body');
    if (!questionContainer) return;
    
    // Trigger navigation based on swipe direction
    if (direction === 'left') {
      // Swipe left = next question
      const nextButton = document.querySelector('.mobile-nav-button.primary, .btn-primary');
      if (nextButton && !nextButton.disabled) {
        this.haptic('navigation');
        this.playSound('navigation');
        nextButton.click();
        
        // Announce swipe action
        if (window.AccessibilityManager) {
          window.AccessibilityManager.announce('向左滑动，进入下一题', 'polite');
        }
      }
    } else if (direction === 'right') {
      // Swipe right = previous question
      const prevButton = document.querySelector('.mobile-nav-button.secondary');
      if (prevButton && !prevButton.disabled) {
        this.haptic('navigation');
        this.playSound('navigation');
        prevButton.click();
        
        // Announce swipe action
        if (window.AccessibilityManager) {
          window.AccessibilityManager.announce('向右滑动，返回上一题', 'polite');
        }
      }
    }
  },

  // Handle long press
  handleLongPress: function(target) {
    if (target.matches('.mobile-option, .radio-option')) {
      // Long press on option shows additional info
      this.haptic('medium');
      this.showOptionDetails(target);
    }
  },

  // Show option details on long press
  showOptionDetails: function(optionElement) {
    const text = optionElement.querySelector('.mobile-option-text, .radio-text')?.textContent;
    const level = optionElement.querySelector('.mobile-level-badge, .level-badge')?.textContent;
    
    if (text && level) {
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'option-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-content">
          <strong>选项详情</strong><br>
          等级: ${level}<br>
          描述: ${text}
        </div>
      `;
      
      tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        text-align: center;
        animation: fadeIn 0.3s ease;
      `;
      
      document.body.appendChild(tooltip);
      
      // Remove tooltip after 3 seconds
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 3000);
      
      // Announce tooltip content
      if (window.AccessibilityManager) {
        window.AccessibilityManager.announce(`选项详情: 等级 ${level}, ${text}`, 'polite');
      }
    }
  },

  // Provide feedback for different interaction types
  feedback: {
    // Button press feedback
    buttonPress: function(element, type = 'primary') {
      InteractionFeedback.haptic('selection');
      InteractionFeedback.playSound('click');
      
      element.classList.add('press-feedback');
      setTimeout(() => {
        element.classList.remove('press-feedback');
      }, 150);
    },

    // Option selection feedback
    optionSelect: function(element) {
      InteractionFeedback.haptic('selection');
      InteractionFeedback.playSound('selection');
      
      element.classList.add('selection-highlight');
      setTimeout(() => {
        element.classList.remove('selection-highlight');
      }, 800);
    },

    // Success feedback
    success: function(element, message) {
      InteractionFeedback.haptic('success');
      InteractionFeedback.playSound('success');
      
      element.classList.add('success-feedback');
      setTimeout(() => {
        element.classList.remove('success-feedback');
      }, 1000);
      
      if (message && window.AccessibilityManager) {
        window.AccessibilityManager.announce(message, 'assertive');
      }
    },

    // Error feedback
    error: function(element, message) {
      InteractionFeedback.haptic('error');
      InteractionFeedback.playSound('error');
      
      element.classList.add('error-feedback');
      setTimeout(() => {
        element.classList.remove('error-feedback');
      }, 1000);
      
      if (message && window.AccessibilityManager) {
        window.AccessibilityManager.announce(message, 'assertive');
      }
    },

    // Loading feedback
    loading: function(element) {
      element.classList.add('loading-pulse');
      element.setAttribute('aria-busy', 'true');
    },

    // Stop loading feedback
    stopLoading: function(element) {
      element.classList.remove('loading-pulse');
      element.removeAttribute('aria-busy');
    },

    // Progress feedback
    progress: function(element) {
      element.classList.add('progress-feedback');
    },

    // Navigation feedback
    navigation: function(direction) {
      InteractionFeedback.haptic('navigation');
      InteractionFeedback.playSound('navigation');
      
      // Visual indication of navigation direction
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 50%;
        ${direction === 'next' ? 'right: 20px' : 'left: 20px'};
        transform: translateY(-50%);
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      indicator.textContent = direction === 'next' ? '→' : '←';
      
      document.body.appendChild(indicator);
      
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 500);
    }
  },

  // Utility functions
  utils: {
    // Check if reduced motion is preferred
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Check if device supports haptic feedback
    supportsHaptic: function() {
      return InteractionFeedback.hapticSupported;
    },

    // Check if audio feedback is available
    supportsAudio: function() {
      return InteractionFeedback.audioEnabled;
    },

    // Enable/disable feedback types
    toggleHaptic: function(enabled) {
      InteractionFeedback.hapticEnabled = enabled;
    },

    toggleAudio: function(enabled) {
      InteractionFeedback.audioEnabled = enabled;
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => InteractionFeedback.init());
} else {
  InteractionFeedback.init();
}

// Export for global use
window.InteractionFeedback = InteractionFeedback;