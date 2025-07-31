function ServiceDetails() {
  try {
    const serviceDetails = [
      {
        id: 'strategy',
        title: '战略与诊断咨询：谋定而后动，决胜于千里之外',
        services: [
          {
            name: 'AI转型成熟度诊断',
            what: '深入访谈您的决策层、执行层，全面扫描组织、流程、技术、数据四大维度',
            get: '一份超过30页的《AI转型成熟度诊断报告》，包含定性与定量分析、行业对标、以及明确的SWOT矩阵'
          },
          {
            name: 'AI转型战略路线图规划',
            what: '基于诊断结论，与您的核心团队共创，设计未来3年的实施路径、关键里程碑和资源配置计划',
            get: '一份CEO级别的战略决策简报和一份可执行的详细路线图，成为您未来AI投资和项目管理的行动纲领'
          }
        ]
      },
      {
        id: 'capability',
        title: '能力建设与人才赋能：AI转型的核心是人的转型',
        services: [
          {
            name: '全员AI素养与文化建设',
            what: '提供分层级的培训：决策层AI战略、编辑记者层AI实战应用、技术运营层AI工具管理',
            get: '一个人人懂AI、人人用AI的组织氛围，消除技术恐惧，激发创新活力'
          },
          {
            name: '高阶应用场景专题工作坊',
            what: 'AI辅助数据新闻、AIGC创意设计、沉浸式报道等前沿应用的深度实战训练',
            get: '掌握前沿报道形态的制作能力，打造机构的内容创新标杆'
          }
        ]
      }
    ];

    return (
      <section 
        className="py-20 bg-[var(--bg-light)]"
        data-name="service-details" 
        data-file="components/ServiceDetails.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">深度服务详解</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              每一项服务都经过精心设计，确保为您的AI转型之路提供最大价值
            </p>
          </div>

          <div className="space-y-16">
            {serviceDetails.map((category) => (
              <div 
                key={category.id}
                id={`service-${category.id}`}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-8">
                  {category.title}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {category.services.map((service, index) => (
                    <div key={index} className="border border-[var(--border-light)] rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-[var(--primary-color)] mb-4">
                        {service.name}
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">我们做什么：</h5>
                          <p className="text-gray-600 text-sm leading-relaxed">{service.what}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">您将获得：</h5>
                          <p className="text-gray-600 text-sm leading-relaxed">{service.get}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('ServiceDetails component error:', error);
    return null;
  }
}