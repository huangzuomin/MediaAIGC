function HeroSection() {
  try {
    const scrollToFramework = () => {
      document.getElementById('framework').scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToContact = () => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        data-name="hero-section" 
        data-file="components/HeroSection.js"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0, 51, 102, 0.9) 0%, rgba(0, 64, 128, 0.8) 100%), url("trickle/assets/photo-1451187580459-43490279c0fa.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
        }}
      >
        {/* 流动粒子背景动效 */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* 神经网络线条 */}
            <g stroke="white" strokeWidth="1" fill="none">
              <path d="M100,200 Q400,100 700,300 T1100,200" className="animate-pulse">
                <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="8s" repeatCount="indefinite" />
              </path>
              <path d="M200,600 Q500,400 800,500 T1000,600" className="animate-pulse" style={{animationDelay: '2s'}}>
                <animate attributeName="stroke-dasharray" values="0,800;800,0;0,800" dur="10s" repeatCount="indefinite" />
              </path>
              <path d="M50,400 Q300,200 600,400 T1150,350" className="animate-pulse" style={{animationDelay: '4s'}}>
                <animate attributeName="stroke-dasharray" values="0,1200;1200,0;0,1200" dur="12s" repeatCount="indefinite" />
              </path>
            </g>
            {/* 浮动节点 */}
            <g fill="white" opacity="0.6">
              <circle cx="150" cy="250" r="3" className="animate-pulse" />
              <circle cx="450" cy="150" r="2" className="animate-pulse" style={{animationDelay: '1s'}} />
              <circle cx="750" cy="350" r="2.5" className="animate-pulse" style={{animationDelay: '2s'}} />
              <circle cx="950" cy="500" r="2" className="animate-pulse" style={{animationDelay: '3s'}} />
            </g>
          </svg>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
            智媒变革的领航伙伴
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            我们认为，AI不是工具的叠加，而是驱动媒体重塑未来的核心战略。<br />
            源自一线，我们比任何人都懂您的挑战。
          </p>

          {/* 核心优势 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30 group-hover:rotate-3">
                <svg className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">源自媒体的深刻洞察</h3>
              <p className="text-gray-200">实践者，而非旁观者</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30 group-hover:rotate-3">
                <svg className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">经过验证的转型方法论</h3>
              <p className="text-gray-200">战略，而非空谈</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30 group-hover:rotate-3">
                <svg className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">长期主义的伙伴关系</h3>
              <p className="text-gray-200">共创，而非交付</p>
            </div>
          </div>

          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToFramework}
              className="btn-outline bg-white bg-opacity-10 border-white text-white hover:bg-white hover:text-[var(--primary-color)]"
            >
              了解MAML方法论
            </button>
            <button 
              onClick={scrollToContact}
              className="bg-[var(--accent-color)] text-[var(--primary-color)] px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-opacity-90"
            >
              与我们的首席顾问对话
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('HeroSection component error:', error);
    return null;
  }
}