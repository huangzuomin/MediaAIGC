function Navigation() {
  try {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        data-name="navigation" 
        data-file="components/Navigation.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-[var(--primary-color)]">
                温州新闻网·智媒变革中心
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('framework')}
                  className="text-gray-700 hover:text-[var(--primary-color)] transition-colors"
                >
                  核心框架
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-[var(--primary-color)] transition-colors"
                >
                  服务矩阵
                </button>
                <button 
                  onClick={() => scrollToSection('insights')}
                  className="text-gray-700 hover:text-[var(--primary-color)] transition-colors"
                >
                  我们的洞察
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-[var(--primary-color)] transition-colors"
                >
                  联系我们
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}