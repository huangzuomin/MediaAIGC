// Enhanced Error Boundary Component for Standalone AI Maturity Assessment
class StandaloneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRetrying: false
    };
    
    // Bind methods
    this.handleRestart = this.handleRestart.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.reportError = this.reportError.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substring(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Enhanced error logging
    this.logError(error, errorInfo);
  }

  logError(error, errorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount
    };

    // Log to console for debugging
    console.error('StandaloneErrorBoundary caught an error:', errorData);

    // Log to analytics if available
    if (window.Analytics && typeof window.Analytics.trackError === 'function') {
      window.Analytics.trackError(error, {
        component_stack: errorInfo.componentStack,
        error_boundary: true,
        error_id: this.state.errorId,
        retry_count: this.state.retryCount
      });
    }

    // Fallback to gtag
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        custom_map: {
          error_id: this.state.errorId,
          retry_count: this.state.retryCount
        }
      });
    }

    // Store error for potential reporting
    try {
      const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
      errorLog.push(errorData);
      // Keep only last 10 errors
      const trimmedLog = errorLog.slice(-10);
      localStorage.setItem('error_log', JSON.stringify(trimmedLog));
    } catch (e) {
      console.warn('Could not store error log:', e);
    }
  }

  handleRestart() {
    // Clear error state and restart the app
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRetrying: false
    });

    // Clear any stored data that might be causing issues
    try {
      if (window.Storage && typeof window.Storage.clearAllUserData === 'function') {
        window.Storage.clearAllUserData();
      } else {
        // Fallback manual cleanup
        localStorage.removeItem('ai-maturity-assessment-data');
        localStorage.removeItem('ai-maturity-session');
        localStorage.removeItem('ai-maturity-result');
      }
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }

    // Track restart action
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('error_boundary_restart', {
        error_id: this.state.errorId,
        retry_count: this.state.retryCount
      });
    }
  }

  handleRetry() {
    this.setState({ 
      isRetrying: true,
      retryCount: this.state.retryCount + 1
    });

    // Track retry action
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('error_boundary_retry', {
        error_id: this.state.errorId,
        retry_count: this.state.retryCount + 1
      });
    }

    // Attempt to recover after a short delay
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        isRetrying: false
      });
    }, 1000);
  }

  reportError() {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };

    // Create downloadable error report
    const blob = new Blob([JSON.stringify(errorReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.state.errorId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Track error report
    if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
      window.Analytics.trackEvent('error_report_generated', {
        error_id: this.state.errorId
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, retryCount, isRetrying, errorId } = this.state;
      const canRetry = retryCount < 3; // Allow up to 3 retries
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-3">页面遇到了问题</h2>
            <p className="text-gray-600 mb-6">
              抱歉，AI成熟度自测工具遇到了技术问题。我们已经记录了这个错误，请尝试以下解决方案。
            </p>

            {/* Error details (collapsible) */}
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                查看错误详情
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                <div><strong>错误ID:</strong> {errorId}</div>
                <div><strong>重试次数:</strong> {retryCount}</div>
                <div><strong>错误信息:</strong> {error?.message}</div>
                <div><strong>时间:</strong> {new Date().toLocaleString()}</div>
              </div>
            </details>
            
            <div className="space-y-3">
              {/* Retry button */}
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRetrying ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      重试中...
                    </span>
                  ) : (
                    `重试 (${retryCount}/3)`
                  )}
                </button>
              )}

              {/* Restart button */}
              <button
                onClick={this.handleRestart}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                重新开始评估
              </button>

              {/* Reload button */}
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                刷新页面
              </button>

              {/* Alternative options */}
              <div className="flex space-x-2">
                <button
                  onClick={this.reportError}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  下载错误报告
                </button>
                <button
                  onClick={() => window.open('working-app.html', '_blank')}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  使用备用版本
                </button>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-6 text-xs text-gray-500">
              <p>如果问题持续存在，请尝试：</p>
              <ul className="mt-2 text-left space-y-1">
                <li>• 清除浏览器缓存和Cookie</li>
                <li>• 使用无痕/隐私模式</li>
                <li>• 尝试其他浏览器</li>
                <li>• 检查网络连接</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component to wrap any component with error boundary
function withErrorBoundary(Component, fallbackComponent = null) {
  return function WrappedComponent(props) {
    return (
      <StandaloneErrorBoundary fallback={fallbackComponent}>
        <Component {...props} />
      </StandaloneErrorBoundary>
    );
  };
}

// Export for use in other components
window.StandaloneErrorBoundary = StandaloneErrorBoundary;
window.withErrorBoundary = withErrorBoundary;