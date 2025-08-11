// Enhanced Loading Animation Component with Accessibility
function LoadingAnimation({ 
  message = '正在加载...', 
  size = 'medium', 
  type = 'spinner',
  showProgress = false,
  progress = 0,
  ariaLabel,
  className = ''
}) {
  const [dots, setDots] = React.useState('');
  const [animationPhase, setAnimationPhase] = React.useState(0);

  // Animated dots for loading text
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Animation phase cycling for enhanced visual feedback
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  // Spinner component
  const Spinner = () => (
    <div 
      className={`${sizeClasses[size]} border-4 border-[var(--border-light)] border-t-[var(--primary-color)] rounded-full animate-spin`}
      role="status"
      aria-label={ariaLabel || message}
      aria-live="polite"
    >
      <span className="sr-only">{message}</span>
    </div>
  );

  // Pulse component
  const Pulse = () => (
    <div className="flex space-x-2" role="status" aria-label={ariaLabel || message}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-[var(--primary-color)] rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
      <span className="sr-only">{message}</span>
    </div>
  );

  // Dots component
  const Dots = () => (
    <div className="flex space-x-1" role="status" aria-label={ariaLabel || message}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <span className="sr-only">{message}</span>
    </div>
  );

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full max-w-md" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <div className="w-full bg-[var(--border-light)] rounded-full h-2 mb-4">
        <div 
          className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-sm text-[var(--text-secondary)]">
        {progress}% 完成
      </div>
    </div>
  );

  // Skeleton loader
  const Skeleton = () => (
    <div className="animate-pulse space-y-4" role="status" aria-label="内容加载中">
      <div className="h-4 bg-[var(--border-light)] rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-[var(--border-light)] rounded"></div>
        <div className="h-4 bg-[var(--border-light)] rounded w-5/6"></div>
      </div>
      <span className="sr-only">内容加载中，请稍候</span>
    </div>
  );

  // Enhanced spinner with phases
  const EnhancedSpinner = () => (
    <div className="relative" role="status" aria-label={ariaLabel || message}>
      <div className={`${sizeClasses[size]} border-4 border-[var(--border-light)] rounded-full`}>
        <div 
          className={`${sizeClasses[size]} border-4 border-transparent border-t-[var(--primary-color)] rounded-full animate-spin`}
          style={{
            animationDuration: '1s'
          }}
        />
      </div>
      
      {/* Outer ring for enhanced visual feedback */}
      <div 
        className={`absolute inset-0 ${sizeClasses[size]} border-2 border-[var(--accent-color)] rounded-full opacity-30`}
        style={{
          animation: 'pulse 2s infinite',
          transform: 'scale(1.2)'
        }}
      />
      
      <span className="sr-only">{message}</span>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return <Pulse />;
      case 'dots':
        return <Dots />;
      case 'progress':
        return <ProgressBar />;
      case 'skeleton':
        return <Skeleton />;
      case 'enhanced':
        return <EnhancedSpinner />;
      case 'spinner':
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      
      {showProgress && type !== 'progress' && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-[var(--border-light)] rounded-full h-1">
            <div 
              className="bg-[var(--primary-color)] h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {message && type !== 'skeleton' && (
        <div className={`text-center ${textSizeClasses[size]}`}>
          <p className="text-[var(--text-secondary)] font-medium" aria-live="polite">
            {message}{dots}
          </p>
          
          {/* Additional context for screen readers */}
          <div className="sr-only" aria-live="polite">
            加载进度: {animationPhase + 1} / 4 阶段
          </div>
        </div>
      )}
    </div>
  );
}

// Loading overlay component
function LoadingOverlay({ 
  isVisible = false, 
  message = '正在处理...', 
  type = 'enhanced',
  onCancel,
  cancelText = '取消',
  showCancel = false,
  backdrop = true,
  className = ''
}) {
  // Focus management
  const overlayRef = React.useRef(null);
  const previousFocus = React.useRef(null);

  React.useEffect(() => {
    if (isVisible) {
      // Store previous focus
      previousFocus.current = document.activeElement;
      
      // Focus the overlay
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Announce loading state
      if (window.AccessibilityManager) {
        window.AccessibilityManager.announce(message, 'assertive');
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, message]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showCancel && onCancel) {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, showCancel, onCancel]);

  if (!isVisible) return null;

  return (
    <div 
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
      tabIndex="-1"
    >
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div id="loading-title" className="sr-only">
          加载中
        </div>
        
        <div id="loading-description" className="sr-only">
          {message}，请稍候。{showCancel ? `按 Escape 键或点击取消按钮可以取消操作。` : ''}
        </div>
        
        <LoadingAnimation 
          message={message}
          type={type}
          size="large"
          ariaLabel={`${message}，请稍候`}
        />
        
        {showCancel && onCancel && (
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              aria-label={`取消当前操作: ${message}`}
            >
              {cancelText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export components
window.LoadingAnimation = LoadingAnimation;
window.LoadingOverlay = LoadingOverlay;