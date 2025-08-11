/**
 * SEO管理工具
 * 提供SEO优化、元数据管理、结构化数据等功能
 */

class SEOManager {
  constructor() {
    this.metaTags = new Map();
    this.structuredData = new Map();
    this.canonicalUrl = null;
    this.hreflangTags = new Map();
    
    this.init();
  }

  /**
   * 初始化SEO管理
   */
  init() {
    this.setupBasicSEO();
    this.setupStructuredData();
    this.setupOpenGraph();
    this.setupTwitterCard();
    this.setupCanonicalUrl();
    this.setupSitemap();
    this.setupRobotsTxt();
    this.monitorSEOHealth();
    
    console.log('SEO管理工具初始化完成');
  }

  /**
   * 设置基础SEO
   */
  setupBasicSEO() {
    // 更新页面标题
    this.updateTitle('智媒AI工作站 - 为下一代媒体打造的AI操作系统');
    
    // 更新描述
    this.updateMetaTag('description', 
      '智媒AI工作站集成核心AI引擎与媒体场景智能体，为地市县级媒体提供专业的新闻生产AI解决方案。开箱即用、私有部署、流程自动化，让您的新闻生产力即刻进入新纪元。'
    );
    
    // 更新关键词
    this.updateMetaTag('keywords', 
      '智媒AI工作站,媒体AI,新闻生产,AI操作系统,媒体智能体,新闻自动化,AI新闻,媒体科技,智能媒体,新闻AI助手'
    );
    
    // 设置作者
    this.updateMetaTag('author', '智媒AI工作站');
    
    // 设置语言
    document.documentElement.lang = 'zh-CN';
    
    // 设置字符编码
    this.updateMetaTag('charset', 'UTF-8');
    
    // 设置视口
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // 设置主题色
    this.updateMetaTag('theme-color', '#003366');
    
    // 设置应用名称
    this.updateMetaTag('application-name', '智媒AI工作站');
  }

  /**
   * 设置结构化数据
   */
  setupStructuredData() {
    // 组织信息
    this.addStructuredData('organization', {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "智媒AI工作站",
      "alternateName": "IntelliMedia AI Workstation",
      "url": window.location.origin,
      "logo": `${window.location.origin}/assets/logo.png`,
      "description": "为下一代媒体打造的AI操作系统",
      "foundingDate": "2024",
      "industry": "媒体科技",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "138-XXXX-XXXX",
        "contactType": "销售咨询",
        "availableLanguage": "Chinese"
      },
      "sameAs": [
        "https://weibo.com/intellimedia",
        "https://www.zhihu.com/org/intellimedia"
      ]
    });

    // 软件产品信息
    this.addStructuredData('software', {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "智媒AI工作站",
      "alternateName": "IntelliMedia AI Workstation",
      "description": "集成核心AI引擎与媒体场景智能体的媒体AI操作系统",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY",
        "description": "免费演示预约",
        "availability": "https://schema.org/InStock"
      },
      "provider": {
        "@type": "Organization",
        "name": "智媒AI工作站"
      },
      "featureList": [
        "核心AI引擎管理",
        "媒体专属知识库",
        "AI引擎成本与安全管控",
        "数据安全与私有化",
        "内容安全与合规",
        "稳定与可靠性"
      ],
      "screenshot": `${window.location.origin}/assets/screenshot.png`
    });

    // 网站信息
    this.addStructuredData('website', {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "智媒AI工作站",
      "url": window.location.origin,
      "description": "为下一代媒体打造的AI操作系统",
      "inLanguage": "zh-CN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    // 面包屑导航
    this.addStructuredData('breadcrumb', {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "产品介绍",
          "item": window.location.href
        }
      ]
    });
  }

  /**
   * 设置Open Graph
   */
  setupOpenGraph() {
    this.updateMetaTag('og:type', 'website');
    this.updateMetaTag('og:title', '智媒AI工作站 - 为下一代媒体打造的AI操作系统');
    this.updateMetaTag('og:description', 
      '集成核心AI引擎与媒体场景智能体，让您的新闻生产力即刻进入新纪元。专为媒体、开箱即用、私有部署、流程自动化。'
    );
    this.updateMetaTag('og:url', window.location.href);
    this.updateMetaTag('og:site_name', '智媒AI工作站');
    this.updateMetaTag('og:image', `${window.location.origin}/assets/og-image.png`);
    this.updateMetaTag('og:image:width', '1200');
    this.updateMetaTag('og:image:height', '630');
    this.updateMetaTag('og:image:alt', '智媒AI工作站产品界面展示');
    this.updateMetaTag('og:locale', 'zh_CN');
  }

  /**
   * 设置Twitter Card
   */
  setupTwitterCard() {
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', '智媒AI工作站 - 为下一代媒体打造的AI操作系统');
    this.updateMetaTag('twitter:description', 
      '集成核心AI引擎与媒体场景智能体，让您的新闻生产力即刻进入新纪元。'
    );
    this.updateMetaTag('twitter:image', `${window.location.origin}/assets/twitter-card.png`);
    this.updateMetaTag('twitter:image:alt', '智媒AI工作站产品界面展示');
    this.updateMetaTag('twitter:site', '@intellimedia');
    this.updateMetaTag('twitter:creator', '@intellimedia');
  }

  /**
   * 设置规范URL
   */
  setupCanonicalUrl() {
    this.setCanonicalUrl(window.location.href);
  }

  /**
   * 设置站点地图
   */
  setupSitemap() {
    // 创建站点地图数据
    const sitemapData = {
      urls: [
        {
          loc: window.location.origin,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '1.0'
        },
        {
          loc: `${window.location.origin}/about`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8'
        },
        {
          loc: `${window.location.origin}/features`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.9'
        },
        {
          loc: `${window.location.origin}/pricing`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8'
        },
        {
          loc: `${window.location.origin}/contact`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        }
      ]
    };

    // 生成XML站点地图
    this.generateSitemap(sitemapData);
  }

  /**
   * 设置robots.txt
   */
  setupRobotsTxt() {
    const robotsContent = `User-agent: *
Allow: /

# 站点地图
Sitemap: ${window.location.origin}/sitemap.xml

# 爬取延迟
Crawl-delay: 1

# 禁止访问的路径
Disallow: /admin/
Disallow: /private/
Disallow: /temp/
Disallow: /*.json$
Disallow: /*.log$

# 允许访问的重要路径
Allow: /assets/
Allow: /js/
Allow: /css/
Allow: /images/`;

    console.log('Robots.txt内容:', robotsContent);
  }

  /**
   * 更新页面标题
   * @param {string} title - 页面标题
   */
  updateTitle(title) {
    document.title = title;
    this.updateMetaTag('og:title', title);
    this.updateMetaTag('twitter:title', title);
  }

  /**
   * 更新元标签
   * @param {string} name - 标签名称
   * @param {string} content - 标签内容
   */
  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"], meta[charset], meta[name="viewport"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (name === 'charset') {
        meta.setAttribute('charset', content);
      } else if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name);
        meta.setAttribute('content', content);
      } else {
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
      }
      document.head.appendChild(meta);
    } else {
      if (name === 'charset') {
        meta.setAttribute('charset', content);
      } else {
        meta.setAttribute('content', content);
      }
    }

    this.metaTags.set(name, content);
  }

  /**
   * 添加结构化数据
   * @param {string} type - 数据类型
   * @param {Object} data - 结构化数据
   */
  addStructuredData(type, data) {
    let script = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-type', type);
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data, null, 2);
    this.structuredData.set(type, data);
  }

  /**
   * 设置规范URL
   * @param {string} url - 规范URL
   */
  setCanonicalUrl(url) {
    let link = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    link.href = url;
    this.canonicalUrl = url;
  }

  /**
   * 添加hreflang标签
   * @param {string} lang - 语言代码
   * @param {string} url - URL
   */
  addHreflang(lang, url) {
    let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      document.head.appendChild(link);
    }
    
    link.href = url;
    this.hreflangTags.set(lang, url);
  }

  /**
   * 生成站点地图
   * @param {Object} data - 站点地图数据
   */
  generateSitemap(data) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data.urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    console.log('生成的站点地图:', xml);
    
    // 在实际应用中，这里应该将XML保存到服务器
    // 现在我们只是在控制台输出
  }

  /**
   * 监控SEO健康状况
   */
  monitorSEOHealth() {
    const issues = [];

    // 检查标题长度
    const title = document.title;
    if (title.length < 30 || title.length > 60) {
      issues.push(`标题长度不理想: ${title.length}字符 (建议30-60字符)`);
    }

    // 检查描述长度
    const description = this.metaTags.get('description');
    if (description && (description.length < 120 || description.length > 160)) {
      issues.push(`描述长度不理想: ${description.length}字符 (建议120-160字符)`);
    }

    // 检查H1标签
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push('页面缺少H1标签');
    } else if (h1Tags.length > 1) {
      issues.push(`页面有多个H1标签: ${h1Tags.length}个 (建议只有1个)`);
    }

    // 检查图片alt属性
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length}张图片缺少alt属性`);
    }

    // 检查内部链接
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    if (internalLinks.length < 3) {
      issues.push('内部链接数量较少，建议增加内部链接');
    }

    // 检查页面加载速度
    if (window.performance) {
      const loadTime = performance.now();
      if (loadTime > 3000) {
        issues.push(`页面加载时间较长: ${Math.round(loadTime)}ms (建议<3000ms)`);
      }
    }

    // 输出SEO健康报告
    if (issues.length > 0) {
      console.warn('SEO健康检查发现问题:', issues);
    } else {
      console.log('SEO健康检查通过');
    }

    return {
      healthy: issues.length === 0,
      issues: issues,
      score: Math.max(0, 100 - issues.length * 10)
    };
  }

  /**
   * 优化页面性能
   */
  optimizePerformance() {
    // 预加载关键资源
    this.preloadCriticalResources();
    
    // 延迟加载非关键资源
    this.lazyLoadResources();
    
    // 优化图片
    this.optimizeImages();
    
    // 压缩和缓存
    this.setupCaching();
  }

  /**
   * 预加载关键资源
   */
  preloadCriticalResources() {
    const criticalResources = [
      { href: 'assets/styles.css', as: 'style' },
      { href: 'assets/icons.svg', as: 'image' },
      { href: 'js/app.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  /**
   * 延迟加载资源
   */
  lazyLoadResources() {
    // 延迟加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * 优化图片
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // 添加loading="lazy"属性
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // 添加decoding="async"属性
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }
      
      // 检查是否有alt属性
      if (!img.alt) {
        console.warn('图片缺少alt属性:', img.src);
      }
    });
  }

  /**
   * 设置缓存
   */
  setupCaching() {
    // 设置缓存头（这通常在服务器端配置）
    const cacheableResources = [
      'assets/styles.css',
      'assets/icons.svg',
      'js/app.js'
    ];

    console.log('建议为以下资源设置缓存:', cacheableResources);
  }

  /**
   * 生成SEO报告
   * @returns {Object} SEO报告
   */
  generateSEOReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
      metaTags: Object.fromEntries(this.metaTags),
      structuredData: Object.fromEntries(this.structuredData),
      canonicalUrl: this.canonicalUrl,
      hreflangTags: Object.fromEntries(this.hreflangTags),
      healthCheck: this.monitorSEOHealth(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * 生成SEO建议
   * @returns {Array} 建议列表
   */
  generateRecommendations() {
    const recommendations = [];

    // 检查页面内容
    const textContent = document.body.textContent;
    if (textContent.length < 300) {
      recommendations.push('增加页面内容，建议至少300字');
    }

    // 检查关键词密度
    const keywords = ['智媒', 'AI', '工作站', '媒体', '新闻'];
    keywords.forEach(keyword => {
      const count = (textContent.match(new RegExp(keyword, 'gi')) || []).length;
      const density = (count / textContent.split(' ').length) * 100;
      if (density < 0.5) {
        recommendations.push(`增加关键词"${keyword}"的使用频率`);
      } else if (density > 3) {
        recommendations.push(`减少关键词"${keyword}"的使用频率，避免过度优化`);
      }
    });

    // 检查外部链接
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
      if (!link.hasAttribute('rel')) {
        recommendations.push('为外部链接添加rel="noopener"或rel="nofollow"属性');
      }
    });

    return recommendations;
  }

  /**
   * 销毁SEO管理器
   */
  destroy() {
    this.metaTags.clear();
    this.structuredData.clear();
    this.hreflangTags.clear();
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOManager;
} else {
  window.SEOManager = SEOManager;
}