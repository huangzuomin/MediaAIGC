function TeamSection() {
  try {
    const teamMembers = [
      {
        name: "王建华",
        title: "创始人 / 首席AI转型顾问",
        bio: "温州新闻网前总编辑，15年媒体从业经验，主导了温州新闻网的全面数字化转型，发表《媒体AI转型实践研究》等多篇论文",
        expertise: ["媒体战略规划", "AI转型咨询", "数字化变革"],
        image: "trickle/assets/photo-1472099645785-5658abf4ff4e.avif"
      },
      {
        name: "李雪梅",
        title: "技术总监 / AI应用专家",
        bio: "前阿里巴巴高级技术专家，专注于AI在媒体行业的应用研发，拥有10+项AI相关专利，《智媒时代》作者之一",
        expertise: ["AI技术架构", "智能内容生产", "数据驱动决策"],
        image: "trickle/assets/photo-1494790108755-2616b612b786.avif"
      },
      {
        name: "张志强",
        title: "战略合伙人 / 媒体运营专家",
        bio: "前人民日报数字传播公司副总经理，深度参与央媒融媒体建设，获得中国新闻奖等多项行业荣誉",
        expertise: ["融媒体建设", "内容运营", "品牌传播"],
        image: "trickle/assets/photo-1507003211169-0a1dd7228f2d.avif"
      }
    ];

    return (
      <section 
        id="team"
        className="py-20 bg-visual-break"
        data-name="team-section" 
        data-file="components/TeamSection.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-4xl font-bold">我们的核心专家顾问</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
                汇聚媒体行业资深专家与AI技术领军人才，为您的转型之路提供最专业的指导
              </p>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white border border-[var(--border-light)] rounded-2xl p-6 card-hover text-center group">
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.title}`}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[var(--primary-color)] transition-all duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-32 h-32 rounded-full mx-auto bg-[var(--primary-color)] text-white flex items-center justify-center text-2xl font-bold border-4 border-[var(--primary-color)] transition-all duration-300 group-hover:scale-110"
                    style={{display: 'none'}}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[var(--accent-color)] text-[var(--primary-color)] px-3 py-1 rounded-full text-xs font-medium">
                    核心专家
                  </div>
                  <div className="absolute inset-0 bg-[var(--accent-color)] bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-300"></div>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-2">
                  {member.name}
                </h3>
                <p className="text-[var(--accent-color)] font-medium mb-4">
                  {member.title}
                </p>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <p className="text-gray-500 text-xs italic mb-6 leading-relaxed">
                  {member.name === "王建华" && "曾主导温州新闻网数字化转型项目，研究成果发表于《新媒体研究》"}
                  {member.name === "李雪梅" && "拥有10+项AI相关专利，《智媒时代》核心作者，阿里云MVP"}
                  {member.name === "张志强" && "获得中国新闻奖二等奖，深度参与央媒融媒体建设标准制定"}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm">专业领域：</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 bg-[var(--bg-light)] text-[var(--primary-color)] rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 团队优势总结 */}
          <div className="mt-16 bg-[var(--bg-light)] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4">
              为什么我们的团队值得信赖？
            </h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div>
                <AnimatedNumber value="15" suffix="+" />
                <p className="text-sm text-gray-600">年媒体行业经验</p>
              </div>
              <div>
                <AnimatedNumber value="50" suffix="+" />
                <p className="text-sm text-gray-600">成功转型案例</p>
              </div>
              <div>
                <AnimatedNumber value="10" suffix="+" />
                <p className="text-sm text-gray-600">AI技术专利</p>
              </div>
              <div>
                <AnimatedNumber value="100" suffix="%" />
                <p className="text-sm text-gray-600">客户满意度</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TeamSection component error:', error);
    return null;
  }
}