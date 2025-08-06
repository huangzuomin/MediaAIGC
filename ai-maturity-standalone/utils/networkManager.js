// Network Status and Offline Mode Management
const NetworkManager = {
  // Network state
  isOnline: navigator.onLine,
  connectionType: 'unknown',
  
  // Offline queue
  offlineQueue: [],
  
  // Retry configuration
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  },

  // Network status callbacks
  callbacks: {
    online: [],
    offline: [],
    connectionChange: []
  },

  // Initialize network monitoring
  init: function() {
    this.setupEventListeners();
    this.detectConnectionType();
    this.setupOfflineSupport();
    this.monitorNetworkQuality();
    
    console.log('NetworkManager initialized');
  },

  // Setup event listeners
  setupEventListeners: function() {
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.handleOffline();
    });

    // Monitor connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }
  },

  // Handle online event
  handleOnline: function() {
    console.log('Network: Back online');
    this.isOnline = true;
    this.hideOfflineNotification();
    this.processOfflineQueue();
    this.triggerCallbacks('online');
    
    // Track network recovery
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('network_online', {
        timestamp: Date.now(),
        queue_size: this.offlineQueue.length
      });
    }
  },

  // Handle offline event
  handleOffline: function() {
    console.log('Network: Gone offline');
    this.isOnline = false;
    this.showOfflineNotification();
    this.triggerCallbacks('offline');
    
    // Track network loss
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('network_offline', {
        timestamp: Date.now()
      });
    }
  },

  // Handle connection change
  handleConnectionChange: function() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.connectionType = connection.effectiveType || 'unknown';
      
      console.log(`Network: Connection changed to ${this.connectionType}`);
      this.triggerCallbacks('connectionChange', {
        type: this.connectionType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
    }
  },

  // Detect connection type
  detectConnectionType: function() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.connectionType = connection.effectiveType || 'unknown';
      
      return {
        type: this.connectionType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return { type: 'unknown' };
  },

  // Show offline notification
  showOfflineNotification: function() {
    // Remove existing notification
    this.hideOfflineNotification();
    
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.className = 'fixed top-4 left-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50 text-center';
    notification.innerHTML = `
      <div class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>您当前处于离线状态，某些功能可能受限</span>
      </div>
    `;
    
    document.body.appendChild(notification);
  },

  // Hide offline notification
  hideOfflineNotification: function() {
    const notification = document.getElementById('offline-notification');
    if (notification) {
      notification.remove();
    }
  },

  // Add request to offline queue
  queueRequest: function(request) {
    this.offlineQueue.push({
      ...request,
      timestamp: Date.now(),
      retries: 0
    });
    
    console.log(`Request queued for offline: ${request.url || request.type}`);
  },

  // Process offline queue when back online
  processOfflineQueue: function() {
    if (this.offlineQueue.length === 0) {
      return;
    }

    console.log(`Processing ${this.offlineQueue.length} queued requests`);
    
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    queue.forEach(async (request) => {
      try {
        await this.retryRequest(request);
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Re-queue if still relevant
        if (Date.now() - request.timestamp < 300000) { // 5 minutes
          this.offlineQueue.push(request);
        }
      }
    });
  },

  // Retry request with exponential backoff
  retryRequest: async function(request) {
    const { maxRetries, baseDelay, backoffFactor } = this.retryConfig;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (request.type === 'analytics') {
          return await this.sendAnalyticsData(request.data);
        } else if (request.type === 'storage') {
          return await this.syncStorageData(request.data);
        } else if (request.url) {
          return await fetch(request.url, request.options);
        }
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt),
          this.retryConfig.maxDelay
        );
        
        console.log(`Retry attempt ${attempt + 1} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },

  // Send analytics data
  sendAnalyticsData: async function(data) {
    if (window.Analytics && typeof window.Analytics.sendEvent === 'function') {
      return window.Analytics.sendEvent(data.eventName, data.eventData);
    }
  },

  // Sync storage data
  syncStorageData: async function(data) {
    // Implement storage sync logic here
    console.log('Syncing storage data:', data);
  },

  // Check network quality
  monitorNetworkQuality: function() {
    if (!('connection' in navigator)) {
      return;
    }

    const connection = navigator.connection;
    const checkQuality = () => {
      const quality = this.getNetworkQuality();
      
      if (quality === 'poor') {
        this.showSlowConnectionWarning();
      } else {
        this.hideSlowConnectionWarning();
      }
    };

    // Check initially and on connection changes
    checkQuality();
    connection.addEventListener('change', checkQuality);
  },

  // Get network quality assessment
  getNetworkQuality: function() {
    if (!('connection' in navigator)) {
      return 'unknown';
    }

    const connection = navigator.connection;
    const downlink = connection.downlink || 0;
    const rtt = connection.rtt || 0;

    if (downlink < 0.5 || rtt > 2000) {
      return 'poor';
    } else if (downlink < 1.5 || rtt > 1000) {
      return 'fair';
    } else {
      return 'good';
    }
  },

  // Show slow connection warning
  showSlowConnectionWarning: function() {
    if (document.getElementById('slow-connection-warning')) {
      return; // Already showing
    }

    const warning = document.createElement('div');
    warning.id = 'slow-connection-warning';
    warning.className = 'fixed bottom-4 left-4 right-4 bg-yellow-500 text-white p-3 rounded-lg shadow-lg z-50 text-center text-sm';
    warning.innerHTML = `
      <div class="flex items-center justify-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>网络连接较慢，加载可能需要更长时间</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-yellow-200 hover:text-white">×</button>
      </div>
    `;
    
    document.body.appendChild(warning);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideSlowConnectionWarning();
    }, 10000);
  },

  // Hide slow connection warning
  hideSlowConnectionWarning: function() {
    const warning = document.getElementById('slow-connection-warning');
    if (warning) {
      warning.remove();
    }
  },

  // Setup offline support
  setupOfflineSupport: function() {
    // Cache critical resources
    this.cacheResources([
      'index.html',
      'utils/storage.js',
      'components/StandaloneAssessment.js',
      'assets/styles.css'
    ]);

    // Setup offline fallbacks
    this.setupOfflineFallbacks();
  },

  // Cache resources for offline use
  cacheResources: function(resources) {
    if ('caches' in window) {
      caches.open('ai-maturity-v1').then(cache => {
        cache.addAll(resources).catch(error => {
          console.warn('Failed to cache resources:', error);
        });
      });
    }
  },

  // Setup offline fallbacks
  setupOfflineFallbacks: function() {
    // Override fetch for offline fallbacks
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        if (!this.isOnline) {
          return this.getOfflineFallback(args[0]);
        }
        throw error;
      }
    };
  },

  // Get offline fallback response
  getOfflineFallback: function(url) {
    // Return cached response or offline page
    if ('caches' in window) {
      return caches.match(url).then(response => {
        if (response) {
          return response;
        }
        
        // Return offline fallback
        return new Response(
          JSON.stringify({ error: 'Offline', message: '当前处于离线状态' }),
          { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      });
    }
    
    return Promise.reject(new Error('Offline and no cache available'));
  },

  // Register callback for network events
  onNetworkChange: function(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  },

  // Remove callback
  removeCallback: function(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  },

  // Trigger callbacks
  triggerCallbacks: function(event, data = null) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in network callback:', error);
        }
      });
    }
  },

  // Get network status
  getStatus: function() {
    return {
      online: this.isOnline,
      connectionType: this.connectionType,
      quality: this.getNetworkQuality(),
      queueSize: this.offlineQueue.length,
      connection: this.detectConnectionType()
    };
  },

  // Test network connectivity
  testConnectivity: async function() {
    try {
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
  NetworkManager.init();
});

// Export for global use
window.NetworkManager = NetworkManager;