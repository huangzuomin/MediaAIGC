function FrameworkSection({ onAssessmentClick }) {
  try {
    const [activeStage, setActiveStage] = React.useState(null);

    const stages = [
      {
        id: 1,
        title: "基础赋能",
        subtitle: "Foundation & Enablement",
        keywords: ["效率提升", "AI启蒙", "单点工具应用"],
        description: "聚焦于效率提升和AI启蒙，为组织打下坚实的AI应用基础"
      },
      {
        id: 2,
        title: "流程整合",
        subtitle: "Integration & Acceleration", 
        keywords: ["人机协同", "工作流重塑", "数据互通"],
        description: "聚焦于核心工作流的深度重塑和人机协同，实现系统性变革"
      },
      {
        id: 3,
        title: "生态创新",
        subtitle: "Innovation & Ecosystem",
        keywords: ["数据决策", "模式创新", "智慧中台"],
        description: "聚焦于数据驱动的智能决策和全新业务模式的孵化"
      }
    ];

    return (
      <section 
        id="framework"
        className="py-20 bg-visual-break"
        data-name="framework-section" 
        data-file="components/FrameworkSection.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">
              我们的核心方法论：媒体AI成熟度跃升模型 (MAML)
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto mb-8">
              我们独创的MAML模型，是为媒体机构量身定制的AI转型导航系统。它将帮助您清晰诊断当前所处阶段，并规划出从效率提升到生态创新的最优化跃升路径。
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  // 跳转到独立部署的AI成熟度测试页面
                  const standaloneUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
                    ? './ai-maturity-standalone/index.html' 
                    : '/ai-maturity-standalone/';
                  window.open(standaloneUrl, '_blank');
                  
                  // 记录用户点击事件
                  console.log('User clicked assessment from main site');
                }}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🎯 立即开始5分钟自测
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {stages.map((stage, index) => (
                <div 
                  key={stage.id}
                  className={`relative p-8 rounded-2xl cursor-pointer stage-card ${
                    index === 1 ? 'ml-12' : index === 2 ? 'ml-24' : ''
                  } ${
                    activeStage === stage.id 
                      ? 'bg-[var(--primary-color)] text-white shadow-2xl border-2 border-[var(--accent-color)] transform scale-105' 
                      : 'bg-white hover:shadow-xl border-2 border-transparent hover:border-[var(--primary-color)]'
                  }`}
                  onMouseEnter={() => setActiveStage(stage.id)}
                  onMouseLeave={() => setActiveStage(null)}
                >
                  <div className={`stage-accent absolute left-0 top-0 h-full transition-all duration-300 ${
                    activeStage === stage.id ? 'border-l-4 border-[var(--accent-color)]' : ''
                  }`}></div>
                  
                  <div className="flex items-start">
                    {/* 大号数字 */}
                    <div className={`text-7xl font-bold mr-8 transition-all duration-300 ${
                      activeStage === stage.id ? 'text-[var(--accent-color)] transform scale-110' : 'text-[var(--primary-color)]'
                    }`}>
                      {stage.id}
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold mb-3">{stage.title}</h3>
                        <p className={`text-xl ${activeStage === stage.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          {stage.subtitle}
                        </p>
                      </div>
                      
                      <p className={`text-lg mb-8 leading-relaxed ${activeStage === stage.id ? 'text-gray-200' : 'text-gray-600'}`}>
                        {stage.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        {stage.keywords.map((keyword) => (
                          <span 
                            key={keyword}
                            className={`pill-tag transition-all duration-300 ${
                              activeStage === stage.id 
                                ? 'bg-white bg-opacity-20 text-white border-white border-opacity-30' 
                                : ''
                            }`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* 悬浮时显示的洞察 */}
                  {activeStage === stage.id && (
                    <div className="absolute right-8 top-8 bg-[var(--accent-color)] text-[var(--primary-color)] px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                      核心阶段 {stage.id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('FrameworkSection component error:', error);
    return null;
  }
}