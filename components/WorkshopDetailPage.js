function WorkshopDetailPage({ onBack }) {
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCardExpansion = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleDownloadProposal = () => {
    // 创建一个模拟的PDF下载
    const proposalContent = `
AI应用专题工作坊详细方案

一、工作坊概述
- 培训时长：1-3天（可根据需求定制）
- 参训人数：10-30人
- 培训方式：线下集中培训 + 线上跟踪指导
- 投资预算：2-5万元

二、核心培训内容
1. AIGC核心技能实战培训
   - ChatGPT高效提示词技巧
   - Midjourney图像生成实战
   - 视频AI工具操作指南
   - 音频AI应用场景演示

2. 内容生产流程演练
   - 新闻快讯AI写作模板
   - 短视频脚本自动生成
   - 海报设计AI辅助流程
   - 多媒体内容批量处理

3. 现场答疑诊断
   - 业务痛点深度分析
   - AI解决方案定制建议
   - 实施路径规划指导
   - 风险评估与应对策略

三、交付成果
- 开箱即用的AI效率工具包
- 精选AI工具清单及使用教程
- 最佳实践案例库
- 一个月线上跟踪指导服务

四、联系方式
温州新闻网·智媒变革中心
电话：138-0000-0000
邮箱：consult@wznews-aimedia.com
地址：浙江省温州市鹿城区温州新闻网大厦
    `;

    // 创建并下载文件
    const blob = new Blob([proposalContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI应用专题工作坊详细方案.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 显示下载提示
    alert('方案已开始下载！如需更详细的定制方案，请联系我们的专家顾问。');
  };

  return (
    <div className="min-h-screen bg-white" data-name="workshop-detail" data-file="components/WorkshopDetailPage.js">
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-[var(--primary-color)] to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern id="workshop-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="white" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#workshop-pattern)"/>
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[var(--accent-color)] text-[var(--primary-color)] rounded-full text-sm font-bold mb-6">
              ✨ 建议入门首选
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">AI应用专题工作坊</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">入门与赋能 · 1-3天集训</p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              风险最低、见效最快的AI能力"空投包"。让您的核心团队在几天内掌握AIGC的核心技能，并产出实际成果。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">2-5万</div>
              <p className="text-blue-200">投资预算</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">1-3天</div>
              <p className="text-blue-200">培训周期</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">立竿见影</div>
              <p className="text-blue-200">效果保证</p>
            </div>
          </div>
        </div>
      </section>

      {/* 适合对象 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">谁最适合参加这个工作坊？</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--primary-color)]">县市区融媒体中心</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>希望快速了解并上手AI工具的团队</span>
                </li>
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>预算有限但希望看到立竿见影效果</span>
                </li>
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>需要为领导层展示AI应用价值</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--accent-color)] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--primary-color)]">地市级媒体</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>需要为一线采编运营团队进行AI赋能</span>
                </li>
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>希望建立内部AI应用标准和流程</span>
                </li>
                <li className="flex items-start">
                  <div className="icon-check text-[var(--success-color)] mr-2 mt-1 flex-shrink-0"></div>
                  <span>寻求低风险的AI转型起步方案</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 核心内容 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">工作坊核心内容</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "一天掌握AIGC",
                description: "核心技能实战培训",
                details: ["ChatGPT高效提示词技巧", "Midjourney图像生成实战", "视频AI工具操作指南", "音频AI应用场景演示"]
              },
              {
                icon: "🎬",
                title: "内容生产流程演练",
                description: "AI辅助快讯、短视频、海报制作",
                details: ["新闻快讯AI写作模板", "短视频脚本自动生成", "海报设计AI辅助流程", "多媒体内容批量处理"]
              },
              {
                icon: "💡",
                title: "现场答疑诊断",
                description: "梳理您单位最迫切的AI应用点",
                details: ["业务痛点深度分析", "AI解决方案定制建议", "实施路径规划指导", "风险评估与应对策略"]
              },
              {
                icon: "🛠️",
                title: "工具包交付",
                description: "开箱即用的AI效率工具包",
                details: ["精选AI工具清单", "使用教程与模板", "最佳实践案例库", "常见问题解决方案"]
              },
              {
                icon: "📞",
                title: "后续跟踪指导",
                description: "一个月线上支持服务",
                details: ["每周在线答疑时间", "工具使用问题解答", "效果评估与优化建议", "进阶学习资源推荐"]
              },
              {
                icon: "📊",
                title: "成果展示",
                description: "现场产出实际作品",
                details: ["学员作品现场点评", "最佳实践案例分享", "改进建议与优化方向", "后续发展规划建议"]
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  expandedCard === index ? 'ring-2 ring-[var(--primary-color)] bg-blue-50' : ''
                }`}
                onClick={() => toggleCardExpansion(index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{item.icon}</div>
                  <svg 
                    className={`w-5 h-5 text-[var(--primary-color)] transition-transform duration-300 ${
                      expandedCard === index ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-2">{item.title}</h3>
                <p className="text-[var(--accent-color)] font-medium mb-4">{item.description}</p>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedCard === index ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'
                }`}>
                  <ul className="space-y-2">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {expandedCard !== index && (
                  <div className="text-xs text-gray-500 mt-2">点击查看详细内容</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 暂时屏蔽成功案例展示 */}
      {/* 
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">成功案例展示</h2>
          ...案例内容已暂时屏蔽...
        </div>
      </section>
      */}

      {/* 立即预约 */}
      <section className="py-20 bg-gradient-to-r from-[var(--primary-color)] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">准备开始您的AI转型之旅？</h2>
          <p className="text-xl text-blue-100 mb-8">
            现在预约工作坊，享受早鸟优惠价格，还可获得价值5000元的AI工具包
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setIsNavigating(true);
                onBack();
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setIsNavigating(false);
                }, 100);
              }}
              disabled={isNavigating}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isNavigating 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-opacity-90 hover:scale-105'
              }`}
            >
              {isNavigating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  跳转中...
                </span>
              ) : (
                '立即预约工作坊'
              )}
            </button>
            <button 
              onClick={handleDownloadProposal}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[var(--primary-color)] transition-all duration-300"
            >
              下载详细方案
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            * 我们承诺：如果培训后您的团队AI应用能力没有显著提升，全额退款
          </p>
        </div>
      </section>

      {/* 浮动预约按钮 */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => {
            setIsNavigating(true);
            onBack();
            setTimeout(() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              setIsNavigating(false);
            }, 100);
          }}
          disabled={isNavigating}
          className={`px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 ${
            isNavigating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[var(--primary-color)] hover:bg-opacity-90 hover:scale-110 hover:shadow-xl'
          }`}
          title="快速预约工作坊"
        >
          {isNavigating ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              预约
            </>
          )}
        </button>
      </div>
    </div>
  );
}