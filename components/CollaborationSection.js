function CollaborationSection({ onWorkshopClick, onProjectClick, onPartnerClick, onStarterPackClick }) {
  try {
    const collaborationModes = [
      {
        title: "AI应用专题工作坊",
        subtitle: "入门与赋能",
        duration: "1-3天",
        suitable: "希望快速了解并上手AI工具的县市区融媒体中心、需要为一线采编运营团队进行AI赋能的地市级媒体",
        positioning: "风险最低、见效最快的AI能力\"空投包\"。让您的核心团队在几天内掌握AIGC的核心技能，并产出实际成果。",
        features: [
          "\"一天掌握AIGC\" 核心技能实战培训",
          "AI辅助内容生产 (快讯、短视频、海报) 流程演练",
          "现场答疑，梳理您单位最迫切的AI应用点",
          "提供一套\"开箱即用\"的AI效率工具包",
          "后续一个月的线上跟踪与指导"
        ],
        price: "2-5万",
        highlight: "✨ 建议入门首选",
        cta: "预约一次工作坊",
        buttonStyle: "gold"
      },
      {
        title: "\"AI+\"流程再造项目",
        subtitle: "核心问题解决",
        duration: "2-4个月",
        suitable: "希望在特定领域（如视频、播客）快速建立AI生产线的地市级媒体、寻求采编发流程智能化改造的融媒体中心",
        positioning: "针对您最痛的一个业务环节（如短视频生产、多平台分发），我们提供端到端的\"交钥匙\"解决方案，打造一个可展示、可量化的AI样板工程。",
        features: [
          "业务流程深度诊断与AI改造方案设计",
          "AI视频/播客自动化生产线搭建与部署",
          "\"一键分发\"等自动化工作流定制开发",
          "核心团队深度培训与操作手册交付",
          "项目成果量化评估报告 "
        ],
        price: "10-30万",
        highlight: null,
        cta: "定制项目方案",
        buttonStyle: "secondary"
      },
      {
        title: "转型陪跑伙伴",
        subtitle: "长期战略成长",
        duration: "6-12个月",
        suitable: "已下定决心系统性推进AI转型，但缺乏核心技术决策者的地市级媒体、需要长期持续技术咨询和AI能力迭代的融媒体中心",
        positioning: "我们将成为您\"没有编制\"的AI技术总监与战略顾问，为您在转型之路上的每一步提供专业的判断、建议和技术支持。",
        features: [
          "享有\"项目制\"和\"工作坊\"的全部基础服务",
          "每月一次的战略复盘与次月规划",
          "全年AI转型路线图的动态调整与执行监督",
          "新技术、新工具的引入评估与培训",
          "7x24小时的首席专家热线支持"
        ],
        price: "面议",
        highlight: null,
        cta: "咨询陪跑详情",
        buttonStyle: "outline"
      }
    ];

    return (
      <section 
        id="collaboration"
        className="py-20 bg-[var(--bg-light)]"
        data-name="collaboration-section" 
        data-file="components/CollaborationSection.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl font-bold">与我们携手，选择最适合您的进化路径</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-4xl mx-auto">
              我们深知地市县级媒体的现实与挑战。因此，我们设计了灵活、务实的合作路径，旨在用最合理的投入，为您带来最显著的改变。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {collaborationModes.map((mode, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  mode.highlight ? 'border-[var(--accent-color)] shadow-lg' : 'border-[var(--border-light)] hover:border-[var(--primary-color)]'
                }`}
              >
                {mode.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--accent-color)] text-[var(--primary-color)] px-4 py-2 rounded-full text-sm font-bold">
                    {mode.highlight}
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-[var(--accent-color)] font-medium mb-4">{mode.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{mode.positioning}</p>
                  <p className="text-sm text-gray-500 mb-2">合作周期：{mode.duration}</p>
                  <div className="text-lg font-bold text-[var(--accent-color)]">
                    参考价格：{mode.price}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="icon-target text-[var(--primary-color)] mr-2"></div>
                    <h4 className="font-semibold text-gray-700">适合对象：</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{mode.suitable}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="icon-list text-[var(--primary-color)] mr-2"></div>
                    <h4 className="font-semibold text-gray-700">核心服务内容：</h4>
                  </div>
                  <ul className="space-y-2">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <div className="icon-check text-[var(--success-color)] mr-2 mt-0.5 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    mode.buttonStyle === 'gold' 
                      ? 'btn-gold' 
                      : mode.buttonStyle === 'secondary'
                      ? 'btn-secondary'
                      : 'btn-outline'
                  }`}
                  onClick={() => {
                    if (index === 0 && onWorkshopClick) onWorkshopClick();
                    else if (index === 1 && onProjectClick) onProjectClick();
                    else if (index === 2 && onPartnerClick) onPartnerClick();
                  }}
                >
                  {mode.cta}
                </button>
              </div>
            ))}
          </div>

          {/* 低门槛启动包 */}
          <div className="mt-16 bg-gradient-to-r from-[var(--primary-color)] to-blue-700 rounded-2xl p-8 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                不确定从何开始？
              </h3>
              <p className="text-lg mb-6 text-blue-100">
                不妨先从我们的<strong>9800元AI赋能启动包</strong>开始，为您的团队带来一次立竿见影的生产力风暴。
              </p>
              <button 
                className="bg-[var(--accent-color)] text-[var(--primary-color)] px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
                onClick={onStarterPackClick}
              >
                了解启动包详情
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('CollaborationSection component error:', error);
    return null;
  }
}