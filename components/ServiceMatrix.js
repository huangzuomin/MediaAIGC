function ServiceMatrix() {
  try {
    const services = [
      {
        id: 'strategy',
        title: '战略与诊断咨询',
        subtitle: 'Strategy & Diagnostics',
        position: '合作的基石，确保方向正确',
        icon: 'search',
        services: ['AI成熟度诊断', '转型战略路线图规划'],
        cta: '了解如何精准诊断',
        color: 'blue'
      },
      {
        id: 'capability',
        title: '能力建设与人才赋能',
        subtitle: 'Capability Building',
        position: '变革的核心，投资于您的人才',
        icon: 'users',
        services: ['全员AI文化建设', '高阶应用场景工作坊'],
        cta: '了解如何构建AI团队',
        color: 'green'
      },
      {
        id: 'applications',
        title: '流程再造与智能应用',
        subtitle: 'Intelligent Applications',
        position: '转型的引擎，将战略转化为战斗力',
        icon: 'cog',
        services: ['超级编辑部工作流', 'AI视听生产线', '数据新闻驱动引擎'],
        cta: '了解如何重塑流程',
        color: 'purple'
      },
      {
        id: 'platform',
        title: '平台构建与数据资产化',
        subtitle: 'Platform & Data',
        position: '终极的壁垒，构筑未来的核心资产',
        icon: 'database',
        services: ['媒体"大脑"知识库构建', '一体化AI生产力平台搭建'],
        cta: '了解如何构建AI平台',
        color: 'orange'
      }
    ];

    const scrollToServiceDetail = (serviceId) => {
      const element = document.getElementById(`service-${serviceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <section 
        id="services"
        className="py-20 bg-white"
        data-name="service-matrix" 
        data-file="components/ServiceMatrix.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">全链路咨询与实施服务矩阵</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              围绕MAML模型，我们构建了四大服务支柱，提供从战略蓝图到平台落地的端到端、一站式解决方案。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white border border-[var(--border-light)] rounded-xl p-8 card-hover cursor-pointer"
                onClick={() => scrollToServiceDetail(service.id)}
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-300 hover:scale-110">
                    <div className={`icon-${service.icon} text-2xl text-white`}></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--primary-color)] mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{service.subtitle}</p>
                    <p className="text-[var(--text-secondary)] text-sm">{service.position}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">核心服务：</h4>
                  <ul className="space-y-2">
                    {service.services.map((item) => (
                      <li key={item} className="flex items-center text-sm text-gray-600">
                        <div className="icon-check text-[var(--success-color)] mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full text-[var(--primary-color)] border border-[var(--primary-color)] py-3 rounded-lg font-bold transition-all duration-300 hover:bg-[var(--primary-color)] hover:text-white hover:shadow-lg group">
                  {service.cta}
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('ServiceMatrix component error:', error);
    return null;
  }
}