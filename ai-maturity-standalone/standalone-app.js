// Main Standalone App for AI Maturity Assessment
function StandaloneApp() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Initialize the app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing standalone app...');

      // Hide loading screen after a short delay
      setTimeout(() => {
        console.log('Hiding loading screen...');
        setIsLoading(false);
        hideLoadingScreen();
        console.log('App initialization completed');
      }, 1000);

      // Check for existing session (optional)
      try {
        if (window.Storage) {
          const existingSession = Storage.getSession();
          if (existingSession) {
            console.log('Existing session found:', existingSession.sessionId);
          }
        }
      } catch (e) {
        console.warn('Session check failed:', e);
      }

    } catch (err) {
      console.error('Error initializing app:', err);
      setError(err);
      setIsLoading(false);
      hideLoadingScreen();
    }
  };

  const hideLoadingScreen = () => {
    console.log('hideLoadingScreen called');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      console.log('Loading screen found, hiding...');
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        console.log('Loading screen hidden');
      }, 300);
    } else {
      console.warn('Loading screen element not found');
    }
  };

  const showErrorFallback = () => {
    const errorFallback = document.getElementById('error-fallback');
    if (errorFallback) {
      errorFallback.classList.remove('hidden');
    }
  };

  if (error) {
    showErrorFallback();
    return null;
  }

  if (isLoading) {
    return null; // Loading screen is handled by HTML
  }

  return (
    <div className="standalone-app">
      <StandaloneAssessment />
    </div>
  );
}

// Error handling for the entire app
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  
  if (window.Analytics) {
    Analytics.trackError(event.error, {
      source: 'global_error_handler',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (window.Analytics) {
    Analytics.trackError(new Error(event.reason), {
      source: 'unhandled_promise_rejection'
    });
  }
});

// Performance monitoring
window.addEventListener('load', function() {
  // Track page load performance
  if (window.Analytics && window.performance) {
    setTimeout(() => {
      Analytics.trackPerformance();
    }, 0);
  }
});

// Visibility change tracking
document.addEventListener('visibilitychange', function() {
  if (window.Analytics) {
    if (document.hidden) {
      Analytics.trackCustomEvent('page_hidden', {
        timestamp: new Date().toISOString()
      });
    } else {
      Analytics.trackCustomEvent('page_visible', {
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Initialize React app
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    // Use React 18 createRoot if available, fallback to ReactDOM.render
    if (ReactDOM.createRoot) {
      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(React.createElement(StandaloneApp));
    } else {
      ReactDOM.render(React.createElement(StandaloneApp), root);
    }
  } else {
    console.error('Root element not found');
  }
});

// Export for debugging
window.StandaloneApp = StandaloneApp;