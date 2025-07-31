function ProjectDetailPage({ onBack }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white" data-name="project-detail" data-file="components/ProjectDetailPage.js">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-8 z-40">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-white shadow-lg rounded-lg text-[var(--primary-color)] hover:bg-gray-50 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回选择页面
        </button>
      </div>

      {/* 头部区域 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[var(--accent-color)] to-yellow-600 text-[var(--primary-color)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern id="project-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="2" height="2" fill="currentColor" opacity="0.4"/>
                <rect x="40" y="40" width="2" height="2" fill="currentColor" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#project-pattern)"/>
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-full text-sm font-bold mb-6">
              🎯 核心问题解决
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">"AI+"流程再造项目</h1>
            <p className="text-xl md:text-2xl text-yellow-800 mb-8">端到端解决方案 · 2-4个月交付</p>
            <p className="text-lg text-yellow-700 max-w-3xl mx-auto leading-relaxed">
              针对您最痛的一个业务环节，我们提供端到端的"交钥匙"解决方案，打造一个可展示、可量化的AI样板工程。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">10-30万</div>
              <p className="text-yellow-800">投资预算</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">2-4个月</div>
              <p className="text-yellow-800">项目周期</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">可量化</div>
              <p className="text-yellow-800">成果展示</p>
            </div>
          </div>
        </div>
      </section>

      {/* 项目流程 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">项目实施流程</h2>
          <div className="relative">
            {/* 流程线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--primary-color)] to-[var(--accent-color)] hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                {
                  phase: "第一阶段",
                  title: "深度诊断与方案设计",
                  duration: "2-3周",
                  icon: "🔍",
                  activities: [
                    "业务流程现状调研与分析",
                    "痛点识别与优先级排序",
                    "AI改造可行性评估",
                    "定制化解决方案设计",
                    "项目实施计划制定"
                  ],
                  deliverables: ["业务诊断报告", "AI改造方案", "项目实施计划"]
                },
                {
                  phase: "第二阶段",
                  title: "AI系统搭建与部署",
                  duration: "4-6周",
                  icon: "⚙️",
                  activities: [
                    "AI工具选型与定制开发",
                    "自动化工作流设计",
                    "系统集成与测试",
                    "数据迁移与配置",
                    "安全性与稳定性验证"
                  ],
                  deliverables: ["AI生产线系统", "自动化工作流", "系统文档"]
                },
                {
                  phase: "第三阶段",
                  title: "团队培训与试运行",
                  duration: "2-3周",
                  icon: "👥",
                  activities: [
                    "核心团队深度培训",
                    "操作手册编写与交付",
                    "试运行与问题修复",
                    "性能优化与调整",
                    "用户反馈收集与改进"
                  ],
                  deliverables: ["培训材料", "操作手册", "试运行报告"]
                },
                {
                  phase: "第四阶段",
                  title: "正式上线与效果评估",
                  duration: "1-2周",
                  icon: "📊",
                  activities: [
                    "系统正式上线部署",
                    "效果数据收集与分析",
                    "ROI计算与报告编制",
                    "后续优化建议",
                    "项目总结与交付"
                  ],
                  deliverables: ["量化评估报告", "ROI分析", "优化建议"]
                }
              ].map((phase, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">{phase.icon}</div>
                        <div>
                          <div className="text-sm text-[var(--accent-color)] font-bold">{phase.phase}</div>
                          <h3 className="text-xl font-bold text-[var(--primary-color)]">{phase.title}</h3>
                          <div className="text-sm text-gray-500">预计用时：{phase.duration}</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-3">主要活动：</h4>
                        <ul className="space-y-2">
                          {phase.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">交付成果：</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.deliverables.map((item, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-full text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 中心节点 */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-12 h-12 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-[var(--primary-color)] font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">典型应用场景</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎬",
                title: "AI视频生产线",
                description: "从脚本到成片的全自动化流程",
                features: ["自动脚本生成", "AI配音合成", "智能剪辑", "批量渲染"],
                roi: "效率提升300%"
              },
              {
                icon: "🎙️",
                title: "播客自动化制作",
                description: "音频内容的智能化生产",
                features: ["语音转文字", "自动摘要", "音频优化", "多平台分发"],
                roi: "成本降低70%"
              },
              {
                icon: "📱",
                title: "一键分发系统",
                description: "多平台内容自动化分发",
                features: ["格式自适应", "定时发布", "数据统计", "效果分析"],
                roi: "覆盖率提升200%"
              },
              {
                icon: "📰",
                title: "智能新闻编辑",
                description: "新闻内容的AI辅助编辑",
                features: ["自动校对", "风格统一", "SEO优化", "标签生成"],
                roi: "质量提升50%"
              },
              {
                icon: "📊",
                title: "数据新闻生成",
                description: "基于数据的自动化报道",
                features: ["数据可视化", "趋势分析", "报告生成", "图表制作"],
                roi: "响应速度提升500%"
              },
              {
                icon: "🎨",
                title: "创意素材库",
                description: "AI驱动的素材管理系统",
                features: ["智能标签", "相似搜索", "版权检测", "素材推荐"],
                roi: "创作效率提升150%"
              }
            ].map((scenario, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{scenario.icon}</div>
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-2">{scenario.title}</h3>
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                <ul className="space-y-2 mb-4">
                  {scenario.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mr-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[var(--accent-color)] bg-opacity-10 rounded-lg p-3 text-center">
                  <div className="text-sm font-bold text-[var(--primary-color)]">{scenario.roi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 暂时屏蔽成功案例展示 */}
      {/* 
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">项目成功案例</h2>
          ...案例内容已暂时屏蔽...
        </div>
      </section>
      */}

      {/* 立即咨询 */}
      <section className="py-20 bg-gradient-to-r from-[var(--accent-color)] to-yellow-600 text-[var(--primary-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">准备启动您的AI流程再造项目？</h2>
          <p className="text-xl text-yellow-800 mb-8">
            我们提供免费的业务诊断服务，帮您识别最适合AI改造的业务环节
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-[var(--primary-color)] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
            >
              申请免费诊断
            </button>
            <button className="border-2 border-[var(--primary-color)] text-[var(--primary-color)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300">
              查看更多案例
            </button>
          </div>
          <p className="text-sm text-yellow-700 mt-4">
            * 免费诊断包括：业务流程分析、AI改造建议、投资回报预估
          </p>
        </div>
      </section>
    </div>
  );
}