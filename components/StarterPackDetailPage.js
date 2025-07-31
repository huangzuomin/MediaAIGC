function StarterPackDetailPage({ onBack }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white" data-name="starter-pack-detail" data-file="components/StarterPackDetailPage.js">
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern id="starter-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.4" />
                <circle cx="10" cy="10" r="0.8" fill="white" opacity="0.3" />
                <circle cx="50" cy="50" r="0.8" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#starter-pattern)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-full text-lg font-bold mb-6">
              🚀 限时特惠
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">AI赋能启动包</h1>
            <p className="text-xl md:text-2xl text-green-200 mb-8">超值入门方案 · 立竿见影效果</p>
            <div className="flex items-center justify-center mb-8">
              <div className="text-6xl font-bold text-[var(--accent-color)]">¥9,800</div>
              <div className="ml-4 text-left">
                <div className="text-lg text-green-200">特惠价格</div>
                <div className="text-sm text-green-300 line-through">原价 ¥15,800</div>
              </div>
            </div>
            <p className="text-lg text-green-100 max-w-3xl mx-auto leading-relaxed">
              专为预算有限但希望快速体验AI价值的媒体机构设计，一次投入，立即见效！
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[var(--accent-color)] mb-1">1天</div>
              <p className="text-green-200 text-sm">培训时间</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[var(--accent-color)] mb-1">10+</div>
              <p className="text-green-200 text-sm">AI工具</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[var(--accent-color)] mb-1">30天</div>
              <p className="text-green-200 text-sm">后续支持</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[var(--accent-color)] mb-1">100%</div>
              <p className="text-green-200 text-sm">满意保证</p>
            </div>
          </div>
        </div>
      </section>

      {/* 包含内容 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">启动包包含什么？</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "1天精华培训",
                value: "价值 ¥5,000",
                description: "AI工具使用精华培训",
                details: [
                  "ChatGPT高效提示词技巧",
                  "图像生成AI实战操作",
                  "视频制作AI工具应用",
                  "音频处理AI解决方案"
                ]
              },
              {
                icon: "🛠️",
                title: "AI工具包",
                value: "价值 ¥3,000",
                description: "精选10+款AI工具账号",
                details: [
                  "ChatGPT Plus 账号（1个月）",
                  "Midjourney 订阅（1个月）",
                  "剪映专业版会员",
                  "其他7款专业AI工具"
                ]
              },
              {
                icon: "📖",
                title: "实战手册",
                value: "价值 ¥2,000",
                description: "媒体AI应用实战指南",
                details: [
                  "50+个实用提示词模板",
                  "20+个应用场景案例",
                  "常见问题解决方案",
                  "最佳实践经验分享"
                ]
              },
              {
                icon: "💬",
                title: "专家答疑",
                value: "价值 ¥2,000",
                description: "30天在线专家支持",
                details: [
                  "微信群实时答疑",
                  "每周2次在线答疑",
                  "个性化问题解答",
                  "进阶学习建议"
                ]
              },
              {
                icon: "🎯",
                title: "定制建议",
                value: "价值 ¥2,000",
                description: "针对性应用建议",
                details: [
                  "业务场景分析",
                  "AI应用优先级建议",
                  "实施路径规划",
                  "效果评估方法"
                ]
              },
              {
                icon: "🎁",
                title: "额外赠送",
                value: "价值 ¥1,800",
                description: "超值赠品大礼包",
                details: [
                  "AI素材库访问权限",
                  "行业报告合集",
                  "专家录制视频教程",
                  "后续服务优惠券"
                ]
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[var(--primary-color)] mb-1">{item.title}</h3>
                  <div className="text-green-600 font-bold text-sm">{item.value}</div>
                </div>
                <p className="text-gray-600 text-center mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-4">总价值超过 ¥15,800</h3>
            <p className="text-lg text-gray-600 mb-6">现在只需 <span className="text-3xl font-bold text-green-600">¥9,800</span></p>
            <div className="text-sm text-gray-500">
              * 限时特惠，仅限前100名客户 * 不满意30天内全额退款
            </div>
          </div>
        </div>
      </section>

      {/* 适合对象 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">谁最适合启动包？</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏢",
                title: "小型媒体机构",
                description: "预算有限但希望快速上手AI",
                scenarios: [
                  "县级融媒体中心",
                  "地方新闻网站",
                  "社区媒体平台",
                  "自媒体工作室"
                ]
              },
              {
                icon: "👨‍💼",
                title: "媒体管理者",
                description: "需要快速了解AI应用价值",
                scenarios: [
                  "总编辑/主编",
                  "技术负责人",
                  "运营总监",
                  "项目经理"
                ]
              },
              {
                icon: "🎯",
                title: "试水用户",
                description: "想先体验再决定深度合作",
                scenarios: [
                  "AI转型初期探索",
                  "预算审批前验证",
                  "团队接受度测试",
                  "效果评估需求"
                ]
              }
            ].map((target, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-5xl mb-4">{target.icon}</div>
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4">{target.title}</h3>
                <p className="text-gray-600 mb-6">{target.description}</p>
                <div className="space-y-2">
                  {target.scenarios.map((scenario, idx) => (
                    <div key={idx} className="flex items-center justify-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      <span>{scenario}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 暂时屏蔽客户反馈展示 */}
      {/* 
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] text-center mb-12">客户真实反馈</h2>
          ...客户反馈内容已暂时屏蔽...
        </div>
      </section>
      */}

      {/* 立即购买 */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">限时特惠，立即抢购！</h2>
          <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">仅限100名</div>
                <p className="text-green-200">特惠名额</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">30天</div>
                <p className="text-green-200">退款保证</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">24小时</div>
                <p className="text-green-200">快速交付</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[var(--accent-color)] text-[var(--primary-color)] px-10 py-4 rounded-lg font-bold text-xl hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
            >
              立即购买 ¥9,800
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              咨询客服
            </button>
          </div>

          <div className="text-sm text-green-200">
            * 支持对公转账、支付宝、微信支付 * 开具正规发票 * 签订正式合同
          </div>
        </div>
      </section>
    </div>
  );
}