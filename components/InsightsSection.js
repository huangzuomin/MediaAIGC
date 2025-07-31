function InsightsSection() {
  try {
    const insights = [
      {
        title: '超越"降本增效"：AI在媒体行业的终极价值是什么？',
        excerpt: '深度解析AI技术在媒体转型中的战略价值，从工具思维转向生态思维',
        readTime: '8分钟阅读'
      },
      {
        title: '为什么说"媒体大脑"是地方媒体未来的战略核心资产？',
        excerpt: '探讨知识库构建对媒体机构长期竞争力的重要意义',
        readTime: '6分钟阅读'
      },
      {
        title: 'AI如何重塑媒体内容的价值链？从理论到实践的思考',
        excerpt: '深入探讨AI技术在内容生产、分发和变现环节的应用潜力',
        readTime: '10分钟阅读'
      }
    ];

    return (
      <section 
        id="insights"
        className="py-20 bg-white"
        data-name="insights-section" 
        data-file="components/InsightsSection.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">我们的洞察与观点</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              基于一线实践的深度思考，为行业提供前瞻性洞察
            </p>
          </div>

          {/* 白皮书下载 */}
          <div className="bg-white border-2 border-[var(--accent-color)] rounded-2xl p-8 mb-12 text-center shadow-lg">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-[var(--accent-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-download text-2xl text-[var(--primary-color)]"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">
                《2025中国媒体AI转型白皮书》
              </h3>
              <p className="text-lg mb-6 text-gray-600">
                基于温州新闻网实践经验，深度解析媒体AI转型的路径与方法
              </p>
              <button className="bg-[var(--primary-color)] text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg">
                立即下载白皮书
              </button>
            </div>
          </div>

          {/* 观点文章 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {insights.map((article, index) => (
              <div key={index} className="bg-white border border-[var(--border-light)] rounded-xl p-6 card-hover">
                <h4 className="text-lg font-semibold text-[var(--primary-color)] mb-3 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <button className="text-[var(--primary-color)] text-sm font-medium hover:underline">
                    阅读全文
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 研讨会预告 */}
          <div className="bg-[var(--bg-light)] rounded-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-[var(--success-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-calendar text-2xl text-white"></div>
              </div>
              <h3 className="text-xl font-bold text-[var(--primary-color)] mb-3">
                线上研讨会预告
              </h3>
              <p className="text-gray-600 mb-6">
                下一期主题：《数据新闻的AI破局之道》<br />
                时间：2025年8月15日 14:00-16:00
              </p>
              <button className="btn-primary">
                预约席位
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('InsightsSection component error:', error);
    return null;
  }
}