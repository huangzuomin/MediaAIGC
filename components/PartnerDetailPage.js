function PartnerDetailPage({ onBack }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white" data-name="partner-detail" data-file="components/PartnerDetailPage.js">
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-900 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern id="partner-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="1" fill="white" opacity="0.3"/>
                <circle cx="20" cy="20" r="0.5" fill="white" opacity="0.2"/>
                <circle cx="100" cy="100" r="0.5" fill="white" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#partner-pattern)"/>
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-bold mb-6">
              🤝 长期战略成长
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">转型陪跑伙伴</h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">战略咨询伙伴 · 6-12个月深度合作</p>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed">
              我们将成为您"没有编制"的AI技术总监与战略顾问，为您在转型之路上的每一步提供专业的判断、建议和技术支持。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">面议</div>
              <p className="text-purple-200">定制报价</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">6-12个月</div>
              <p className="text-purple-200">合作周期</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">7x24</div>
              <p className="text-purple-200">专家支持</p>
            </div>
          </div>
        </div>
      </section>

      {/* 服务模式 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">陪跑服务模式</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-6">什么是"陪跑"？</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <span className="text-[var(--primary-color)] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">不是一次性交付</h4>
                    <p className="text-gray-600">而是持续的、长期的战略伙伴关系，陪伴您走过整个转型过程</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <span className="text-[var(--primary-color)] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">不是标准化服务</h4>
                    <p className="text-gray-600">而是根据您的实际情况和发展阶段，提供个性化的指导和支持</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <span className="text-[var(--primary-color)] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">不是外包服务</h4>
                    <p className="text-gray-600">而是帮助您建立内部AI能力，培养自己的技术团队和决策能力</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-[var(--primary-color)] mb-6 text-center">陪跑服务价值</h4>
              <div className="space-y-4">
                {[
                  { icon: "🎯", title: "战略清晰", desc: "明确的AI转型路线图" },
                  { icon: "⚡", title: "快速响应", desc: "遇到问题立即获得专业建议" },
                  { icon: "📈", title: "持续优化", desc: "根据实际效果动态调整策略" },
                  { icon: "🛡️", title: "风险控制", desc: "避免转型过程中的重大失误" },
                  { icon: "💡", title: "创新引领", desc: "第一时间了解最新AI技术趋势" },
                  { icon: "🏆", title: "成功保障", desc: "确保转型目标的最终实现" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务内容 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">全方位陪跑服务内容</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "基础服务包",
                icon: "📦",
                color: "bg-blue-500",
                services: [
                  "工作坊培训服务",
                  "项目制解决方案",
                  "工具包与资源库",
                  "基础技术支持"
                ]
              },
              {
                category: "战略咨询",
                icon: "🎯",
                color: "bg-purple-500",
                services: [
                  "每月战略复盘会议",
                  "转型路线图动态调整",
                  "竞争分析与对标",
                  "投资决策建议"
                ]
              },
              {
                category: "技术指导",
                icon: "⚙️",
                color: "bg-green-500",
                services: [
                  "新技术评估与引入",
                  "系统架构设计指导",
                  "技术选型建议",
                  "开发团队指导"
                ]
              },
              {
                category: "团队赋能",
                icon: "👥",
                color: "bg-orange-500",
                services: [
                  "核心团队能力建设",
                  "人才招聘与培养建议",
                  "组织架构优化",
                  "文化变革指导"
                ]
              },
              {
                category: "运营支持",
                icon: "📊",
                color: "bg-red-500",
                services: [
                  "效果监测与分析",
                  "KPI设计与优化",
                  "流程改进建议",
                  "质量控制体系"
                ]
              },
              {
                category: "应急响应",
                icon: "🚨",
                color: "bg-yellow-500",
                services: [
                  "7x24小时专家热线",
                  "紧急问题快速响应",
                  "危机处理指导",
                  "备用方案制定"
                ]
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mr-4`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--primary-color)]">{service.category}</h3>
                </div>
                <ul className="space-y-2">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 合作流程 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">12个月陪跑时间线</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--primary-color)] to-[var(--accent-color)]"></div>
            
            <div className="space-y-8">
              {[
                {
                  month: "第1-2月",
                  title: "深度诊断与规划",
                  activities: ["全面业务诊断", "转型战略制定", "团队能力评估", "年度规划制定"],
                  milestone: "转型蓝图确定"
                },
                {
                  month: "第3-4月",
                  title: "基础能力建设",
                  activities: ["核心团队培训", "基础工具部署", "试点项目启动", "流程标准化"],
                  milestone: "AI应用基础建立"
                },
                {
                  month: "第5-6月",
                  title: "重点项目实施",
                  activities: ["关键项目推进", "技术架构搭建", "效果监测体系", "问题解决优化"],
                  milestone: "样板工程上线"
                },
                {
                  month: "第7-8月",
                  title: "规模化推广",
                  activities: ["成功经验复制", "全员能力提升", "系统集成优化", "效果评估分析"],
                  milestone: "AI应用规模化"
                },
                {
                  month: "第9-10月",
                  title: "深度整合优化",
                  activities: ["业务流程重塑", "数据资产建设", "智能决策系统", "创新应用探索"],
                  milestone: "智能化转型升级"
                },
                {
                  month: "第11-12月",
                  title: "成果巩固与展望",
                  activities: ["成果总结评估", "经验固化沉淀", "未来规划制定", "持续发展建议"],
                  milestone: "转型成果固化"
                }
              ].map((phase, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-[var(--primary-color)] font-bold text-sm mr-6 relative z-10">
                    {index + 1}
                  </div>
                  <div className="flex-grow bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="text-sm text-[var(--accent-color)] font-bold">{phase.month}</div>
                        <h3 className="text-xl font-bold text-[var(--primary-color)]">{phase.title}</h3>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-flex items-center px-3 py-1 bg-[var(--primary-color)] text-white rounded-full text-sm">
                          🎯 {phase.milestone}
                        </span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {phase.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mr-2 flex-shrink-0"></div>
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 暂时屏蔽成功案例展示 */}
      {/* 
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">陪跑成功案例</h2>
          ...案例内容已暂时屏蔽...
        </div>
      </section>
      */}

      {/* 立即咨询 */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">准备开始您的AI转型陪跑之旅？</h2>
          <p className="text-xl text-purple-200 mb-8">
            我们提供免费的转型现状评估，帮您制定个性化的陪跑方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-[var(--accent-color)] text-[var(--primary-color)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
            >
              申请免费评估
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300">
              下载陪跑手册
            </button>
          </div>
          <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">免费评估包含：</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full mr-2"></div>
                <span>AI转型成熟度评估</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full mr-2"></div>
                <span>个性化陪跑方案设计</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full mr-2"></div>
                <span>投资回报预期分析</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}