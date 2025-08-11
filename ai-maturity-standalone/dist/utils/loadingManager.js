// Loading State Management for Better UX
const LoadingManager = {
  // Loading states
  loadingStates: new Map(),
  
  // Loading callbacks
  callbacks: new Map(),
  
  // Global loading state
  globalLoading: false,

  // Set loading state for a specific component/operation
  setLoading: function(key, isLoading, message = '') {
    const previousState = this.loadingStates.get(key);
    
    this.loadingStates.set(key, {
      loading: isLoading,
      message: message,
      timestamp: Date.now(),
      previous: previousState
    });

    // Update global loading state
    this.updateGlobalLoading();

    // Trigger callbacks
    this.triggerCallbacks(key, isLoading, message);

    // Log for debugging
    console.log(`Loading state changed: ${key} = ${isLoading}${message ? ` (${message})` : ''}`);
  },

  // Get loading state
  getLoading: function(key) {
    const state = this.loadingStates.get(key);
    return state ? state.loading : false;
  },

  // Get loading message
  getLoadingMessage: function(key) {
    const state = this.loadingStates.get(key);
    return state ? state.message : '';
  },

  // Check if any component is loading
  isAnyLoading: function() {
    return Array.from(this.loadingStates.values()).some(state => state.loading);
  },

  // Update global loading state
  updateGlobalLoading: function() {
    const wasLoading = this.globalLoading;
    this.globalLoading = this.isAnyLoading();

    if (wasLoading !== this.globalLoading) {
      this.triggerCallbacks('global', this.globalLoading);
      
      // Update document class for CSS styling
      if (this.globalLoading) {
        document.body.classList.add('app-loading');
      } else {
        document.body.classList.remove('app-loading');
      }
    }
  },

  // Register callback for loading state changes
  onLoadingChange: function(key, callback) {
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }
    this.callbacks.get(key).push(callback);
  },

  // Remove callback
  removeCallback: function(key, callback) {
    const callbacks = this.callbacks.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  },

  // Trigger callbacks
  triggerCallbacks: function(key, isLoading, message = '') {
    const callbacks = this.callbacks.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(isLoading, message);
        } catch (error) {
          console.error('Error in loading callback:', error);
        }
      });
    }
  },

  // Create loading wrapper for async operations
  withLoading: function(key, asyncOperation, message = '') {
    this.setLoading(key, true, message);
    
    return Promise.resolve(asyncOperation)
      .then(result => {
        this.setLoading(key, false);
        return result;
      })
      .catch(error => {
        this.setLoading(key, false);
        throw error;
      });
  },

  // Create loading component
  createLoadingComponent: function(message = '加载中...', size = 'medium') {
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };

    return `
      <div class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full ${sizeClasses[size]} border-2 border-blue-600 border-t-transparent"></div>
        ${message ? `<span class="ml-3 text-gray-600">${message}</span>` : ''}
      </div>
    `;
  },

  // Create skeleton loader
  createSkeletonLoader: function(type = 'text', count = 1) {
    const skeletons = {
      text: '<div class="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>',
      card: `
        <div class="animate-pulse">
          <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div class="bg-gray-200 h-4 rounded mb-2"></div>
          <div class="bg-gray-200 h-4 rounded w-3/4"></div>
        </div>
      `,
      button: '<div class="animate-pulse bg-gray-200 h-10 rounded"></div>',
      avatar: '<div class="animate-pulse bg-gray-200 w-12 h-12 rounded-full"></div>'
    };

    return Array(count).fill(skeletons[type] || skeletons.text).join('');
  },

  // Progressive loading with stages
  progressiveLoad: function(stages, onProgress) {
    let currentStage = 0;
    const totalStages = stages.length;

    const executeStage = async (stage) => {
      try {
        this.setLoading('progressive', true, stage.message || `阶段 ${currentStage + 1}/${totalStages}`);
        
        if (onProgress) {
          onProgress(currentStage, totalStages, stage.message);
        }

        await stage.operation();
        currentStage++;

        if (currentStage < totalStages) {
          // Small delay between stages for better UX
          await new Promise(resolve => setTimeout(resolve, 100));
          return executeStage(stages[currentStage]);
        } else {
          this.setLoading('progressive', false);
          if (onProgress) {
            onProgress(totalStages, totalStages, '完成');
          }
        }
      } catch (error) {
        this.setLoading('progressive', false);
        throw error;
      }
    };

    return executeStage(stages[0]);
  },

  // Debounced loading state (prevents flickering)
  setLoadingDebounced: function(key, isLoading, message = '', delay = 300) {
    const timeoutKey = `${key}_timeout`;
    
    // Clear existing timeout
    if (this[timeoutKey]) {
      clearTimeout(this[timeoutKey]);
    }

    if (isLoading) {
      // Show loading immediately
      this.setLoading(key, true, message);
    } else {
      // Delay hiding loading to prevent flickering
      this[timeoutKey] = setTimeout(() => {
        this.setLoading(key, false);
        delete this[timeoutKey];
      }, delay);
    }
  },

  // Get loading statistics
  getStats: function() {
    const states = Array.from(this.loadingStates.entries());
    const activeLoading = states.filter(([key, state]) => state.loading);
    
    return {
      total: states.length,
      active: activeLoading.length,
      globalLoading: this.globalLoading,
      activeKeys: activeLoading.map(([key]) => key),
      longestRunning: this.getLongestRunning()
    };
  },

  // Get longest running loading operation
  getLongestRunning: function() {
    let longest = null;
    let maxDuration = 0;
    const now = Date.now();

    this.loadingStates.forEach((state, key) => {
      if (state.loading) {
        const duration = now - state.timestamp;
        if (duration > maxDuration) {
          maxDuration = duration;
          longest = { key, duration, message: state.message };
        }
      }
    });

    return longest;
  },

  // Clear all loading states
  clearAll: function() {
    this.loadingStates.clear();
    this.updateGlobalLoading();
    console.log('All loading states cleared');
  },

  // Monitor for stuck loading states
  monitorStuckLoading: function(threshold = 30000) { // 30 seconds
    setInterval(() => {
      const now = Date.now();
      this.loadingStates.forEach((state, key) => {
        if (state.loading && (now - state.timestamp) > threshold) {
          console.warn(`Loading state "${key}" has been active for ${Math.round((now - state.timestamp) / 1000)}s`);
          
          // Track stuck loading if analytics available
          if (window.Analytics && typeof window.Analytics.trackError === 'function') {
            window.Analytics.trackError(new Error(`Stuck loading: ${key}`), {
              duration: now - state.timestamp,
              message: state.message
            });
          }
        }
      });
    }, 10000); // Check every 10 seconds
  }
};

// Auto-start monitoring
LoadingManager.monitorStuckLoading();

// Add CSS for loading states
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  .app-loading {
    cursor: wait;
  }
  
  .app-loading * {
    pointer-events: none;
  }
  
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .skeleton-loader {
    animation: skeleton-loading 1.5s ease-in-out infinite alternate;
  }
  
  @keyframes skeleton-loading {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.4;
    }
  }
`;
document.head.appendChild(loadingStyles);

// Export for global use
window.LoadingManager = LoadingManager;