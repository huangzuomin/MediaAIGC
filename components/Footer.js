function Footer() {
  try {
    return (
      <footer 
        className="bg-[var(--primary-color)] text-white py-12"
        data-name="footer" 
        data-file="components/Footer.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* 公司信息 */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">
                温州新闻网·智媒变革中心
              </h3>
              <p className="text-blue-200 mb-4 leading-relaxed">
                源自媒体、洞悉未来，致力于成为您最信赖的AI转型领航伙伴。
                我们不认为AI是孤立的技术工具，而是驱动媒体组织系统性变革的核心引擎。
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <div className="icon-mail text-sm"></div>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <div className="icon-phone text-sm"></div>
                </div>
              </div>
            </div>

            {/* 服务导航 */}
            <div>
              <h4 className="font-semibold mb-4">核心服务</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">战略与诊断咨询</a></li>
                <li><a href="#" className="hover:text-white transition-colors">能力建设与人才赋能</a></li>
                <li><a href="#" className="hover:text-white transition-colors">流程再造与智能应用</a></li>
                <li><a href="#" className="hover:text-white transition-colors">平台构建与数据资产化</a></li>
              </ul>
            </div>

            {/* 快速链接 */}
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#framework" className="hover:text-white transition-colors">MAML方法论</a></li>
                <li><a href="#insights" className="hover:text-white transition-colors">我们的洞察</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">白皮书下载</a></li>
              </ul>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-blue-600 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-blue-200 text-sm mb-4 md:mb-0">
                © 2025 温州新闻网智媒变革中心. 保留所有权利.
              </div>
              <div className="flex space-x-6 text-sm text-blue-200">
                <a href="#" className="hover:text-white transition-colors">隐私政策</a>
                <a href="#" className="hover:text-white transition-colors">服务条款</a>
                <a href="#" className="hover:text-white transition-colors">联系我们</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}