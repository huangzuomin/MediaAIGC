function PageLoader() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-[var(--primary-color)] z-[100] flex items-center justify-center"
      data-name="page-loader"
      data-file="components/PageLoader.js"
    >
      <div className="text-center">
        {/* Logo动画 */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-[var(--accent-color)] rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-2 border-2 border-white rounded-full animate-spin border-b-transparent" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl">智</span>
            </div>
          </div>
        </div>
        
        {/* 加载文字 */}
        <h2 className="text-2xl font-bold text-white mb-4">智媒变革中心</h2>
        <p className="text-[var(--accent-color)] text-sm">正在为您加载专业的AI转型解决方案...</p>
        
        {/* 进度条 */}
        <div className="w-64 h-1 bg-white bg-opacity-20 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-[var(--accent-color)] rounded-full loading-progress"></div>
        </div>
      </div>
    </div>
  );
}