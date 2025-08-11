/**
 * 元标签管理工具
 * 提供动态元标签管理功能
 */

class MetaTagsManager {
  constructor() {
    this.defaultTags = {
      title: '智媒AI工作站 - 为下一代媒体打造的AI操作系统',
      description: '智媒AI工作站集成核心AI引擎与媒体场景智能体，为地市县级媒体提供专业的新闻生产AI解决方案。开箱即用、私有部署、流程自动化，让您的新闻生产力即刻进入新纪元。',
      keywords: '智媒AI工作站,媒体AI,新闻生产,AI操作系统,媒体智能体,新闻自动化,AI新闻,媒体科技,智能媒体,新闻AI助手',
      author: '智媒AI工作站',
      image: 'https://intellimedia-ai-workstation.com/assets/og-image.png',
      url: 'https://intellimedia-ai-workstation.com/'
    };
    
    this.currentTags = { ...this.defaultTags };
    this.init();
  }

  /**
   * 初始化元标签管理器
   */
  init() {
    this.setupBasicTags();
    this.setupOpenGraphTags();
    this.setupTwitterCardTags();
    this.setupAdditionalTags();
    
    console.log('元标签管理器初始化完成');
  }

  /**
   * 设置基础元标签
   */
  setupBasicTags() {
    this.setTitle(this.currentTags.title);
    this.setMetaTag('description', this.currentTags.description);
    this.setMetaTag('keywords', this.currentTags.keywords);
    this.setMetaTag('author', this.currentTags.author);
    this.setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    this.setMetaTag('googlebot', 'index, follow');
    this.setMetaTag('bingbot', 'index, follow');
  }

  /**
   * 设置Open Graph标签
   */
  setupOpenGraphTags() {
    this.setMetaProperty('og:type', 'website');
    this.setMetaProperty('og:title', this.currentTags.title);
    this.setMetaProperty('og:description', this.currentTags.description);
    this.setMetaProperty('og:image', this.currentTags.image);
    this.setMetaProperty('og:url', this.currentTags.url);
    this.setMetaProperty('og:site_name', '智媒AI工作站');
    this.setMetaProperty('og:locale', 'zh_CN');
    this.setMetaProperty('og:image:width', '1200');
    this.setMetaProperty('og:image:height', '630');
    this.setMetaProperty('og:image:alt', '智媒AI工作站产品界面展示');
  }

  /**
   * 设置Twitter Card标签
   */
  setupTwitterCardTags() {
    this.setMetaProperty('twitter:card', 'summary_large_image');
    this.setMetaProperty('twitter:title', this.currentTags.title);
    this.setMetaProperty('twitter:description', this.currentTags.description);
    this.setMetaProperty('twitter:image', this.currentTags.image);
    this.setMetaProperty('twitter:image:alt', '智媒AI工作站产品界面展示');
    this.setMetaProperty('twitter:site', '@intellimedia');
    this.setMetaProperty('twitter:creator', '@intellimedia');
    this.setMetaProperty('twitter:url', this.currentTags.url);
  }

  /**
   * 设置额外的元标签
   */
  setupAdditionalTags() {
    this.setMetaTag('theme-color', '#003366');
    this.setMetaTag('application-name', '智媒AI工作站');
    this.setMetaTag('msapplication-TileColor', '#003366');
    this.setMetaTag('format-detection', 'telephone=no');
    this.setMetaTag('mobile-web-app-capable', 'yes');
    this.setMetaTag('apple-mobile-web-app-capable', 'yes');
    this.setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    this.setMetaTag('apple-mobile-web-app-title', '智媒AI工作站');
    this.setMetaTag('generator', 'IntelliMedia AI Workstation');
    this.setMetaTag('rating', 'general');
    this.setMetaTag('distribution', 'global');
    this.setMetaTag('revisit-after', '7 days');
    this.setMetaTag('language', 'zh-CN');
    this.setMetaTag('geo.region', 'CN');
    this.setMetaTag('geo.placename', '中国');
    this.setMetaTag('category', '媒体科技,AI工具,新闻生产');
    this.setMetaTag('coverage', 'Worldwide');
    this.setMetaTag('target', '媒体从业者,新闻工作者,媒体决策者');
    this.setMetaTag('audience', '媒体行业专业人士');
  }

  /**
   * 设置页面标题
   * @param {string} title - 页面标题
   */
  setTitle(title) {
    document.title = title;
    this.currentTags.title = title;
    
    // 同时更新Open Graph和Twitter Card标题
    this.setMetaProperty('og:title', title);
    this.setMetaProperty('twitter:title', title);
  }

  /**
   * 设置元标签
   * @param {string} name - 标签名称
   * @param {string} content - 标签内容
   */
  setMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  /**
   * 设置元属性标签
   * @param {string} property - 属性名称
   * @param {string} content - 属性内容
   */
  setMetaProperty(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
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
    this.currentTags.url = url;
    
    // 同时更新Open Graph和Twitter Card URL
    this.setMetaProperty('og:url', url);
    this.setMetaProperty('twitter:url', url);
  }

  /**
   * 更新页面元数据
   * @param {Object} data - 元数据对象
   */
  updatePageMeta(data) {
    if (data.title) {
      this.setTitle(data.title);
    }
    
    if (data.description) {
      this.setMetaTag('description', data.description);
      this.setMetaProperty('og:description', data.description);
      this.setMetaProperty('twitter:description', data.description);
      this.currentTags.description = data.description;
    }
    
    if (data.keywords) {
      this.setMetaTag('keywords', data.keywords);
      this.currentTags.keywords = data.keywords;
    }
    
    if (data.image) {
      this.setMetaProperty('og:image', data.image);
      this.setMetaProperty('twitter:image', data.image);
      this.currentTags.image = data.image;
    }
    
    if (data.url) {
      this.setCanonicalUrl(data.url);
    }
    
    if (data.author) {
      this.setMetaTag('author', data.author);
      this.currentTags.author = data.author;
    }
  }

  /**
   * 为特定页面设置元数据
   * @param {string} pageType - 页面类型
   * @param {Object} pageData - 页面数据
   */
  setPageMeta(pageType, pageData = {}) {
    const pageConfigs = {
      home: {
        title: '智媒AI工作站 - 为下一代媒体打造的AI操作系统',
        description: '智媒AI工作站集成核心AI引擎与媒体场景智能体，为地市县级媒体提供专业的新闻生产AI解决方案。开箱即用、私有部署、流程自动化。',
        keywords: '智媒AI工作站,媒体AI,新闻生产,AI操作系统,媒体智能体'
      },
      features: {
        title: '产品功能 - 智媒AI工作站',
        description: '了解智媒AI工作站的核心功能：AI引擎管理、媒体知识库、安全管控、数据私有化、内容合规、稳定可靠。',
        keywords: 'AI引擎,媒体知识库,数据安全,内容合规,智媒功能'
      },
      agents: {
        title: '智能体库 - 智媒AI工作站',
        description: '探索智媒AI工作站的六大专业智能体：选题策划官、新闻助理官、稿件精编官、视频快创官、全网分发官、舆情分析官。',
        keywords: '智能体,选题策划,新闻助理,稿件编辑,视频制作,内容分发,舆情分析'
      },
      pricing: {
        title: '价格方案 - 智媒AI工作站',
        description: '查看智媒AI工作站的订阅方案：基础版、专业版、旗舰版。选择适合您媒体机构的AI解决方案。',
        keywords: '价格方案,订阅计划,基础版,专业版,旗舰版,媒体AI定价'
      },
      contact: {
        title: '联系我们 - 智媒AI工作站',
        description: '联系智媒AI工作站团队，预约产品演示，获取专业的媒体AI解决方案咨询服务。',
        keywords: '联系方式,产品演示,咨询服务,媒体AI咨询'
      },
      demo: {
        title: '产品演示 - 智媒AI工作站',
        description: '预约智媒AI工作站免费产品演示，体验专为媒体打造的AI操作系统，了解如何提升新闻生产效率。',
        keywords: '产品演示,免费试用,媒体AI体验,新闻生产效率'
      }
    };
    
    const config = pageConfigs[pageType] || pageConfigs.home;
    const finalConfig = { ...config, ...pageData };
    
    this.updatePageMeta(finalConfig);
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
  }

  /**
   * 设置多语言支持
   * @param {Object} languages - 语言配置
   */
  setupMultiLanguage(languages) {
    Object.entries(languages).forEach(([lang, url]) => {
      this.addHreflang(lang, url);
    });
    
    // 添加x-default
    if (languages['x-default']) {
      this.addHreflang('x-default', languages['x-default']);
    }
  }

  /**
   * 设置面包屑导航
   * @param {Array} breadcrumbs - 面包屑数组
   */
  setBreadcrumbs(breadcrumbs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
    
    this.addStructuredData('breadcrumb', structuredData);
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
  }

  /**
   * 获取当前元标签信息
   * @returns {Object} 当前元标签信息
   */
  getCurrentMeta() {
    return {
      title: document.title,
      description: this.getMetaContent('description'),
      keywords: this.getMetaContent('keywords'),
      author: this.getMetaContent('author'),
      ogTitle: this.getMetaContent('og:title', 'property'),
      ogDescription: this.getMetaContent('og:description', 'property'),
      ogImage: this.getMetaContent('og:image', 'property'),
      ogUrl: this.getMetaContent('og:url', 'property'),
      twitterTitle: this.getMetaContent('twitter:title', 'property'),
      twitterDescription: this.getMetaContent('twitter:description', 'property'),
      twitterImage: this.getMetaContent('twitter:image', 'property'),
      canonical: this.getCanonicalUrl()
    };
  }

  /**
   * 获取元标签内容
   * @param {string} name - 标签名称
   * @param {string} attribute - 属性类型 ('name' 或 'property')
   * @returns {string} 标签内容
   */
  getMetaContent(name, attribute = 'name') {
    const meta = document.querySelector(`meta[${attribute}="${name}"]`);
    return meta ? meta.content : '';
  }

  /**
   * 获取规范URL
   * @returns {string} 规范URL
   */
  getCanonicalUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.href : '';
  }

  /**
   * 验证元标签
   * @returns {Object} 验证结果
   */
  validateMeta() {
    const validation = {
      valid: true,
      issues: [],
      warnings: []
    };
    
    // 验证标题
    const title = document.title;
    if (!title) {
      validation.valid = false;
      validation.issues.push('缺少页面标题');
    } else if (title.length < 30 || title.length > 60) {
      validation.warnings.push(`标题长度不理想: ${title.length}字符 (建议30-60字符)`);
    }
    
    // 验证描述
    const description = this.getMetaContent('description');
    if (!description) {
      validation.valid = false;
      validation.issues.push('缺少页面描述');
    } else if (description.length < 120 || description.length > 160) {
      validation.warnings.push(`描述长度不理想: ${description.length}字符 (建议120-160字符)`);
    }
    
    // 验证关键词
    const keywords = this.getMetaContent('keywords');
    if (!keywords) {
      validation.warnings.push('缺少关键词标签');
    }
    
    // 验证Open Graph
    const ogTitle = this.getMetaContent('og:title', 'property');
    const ogDescription = this.getMetaContent('og:description', 'property');
    const ogImage = this.getMetaContent('og:image', 'property');
    
    if (!ogTitle || !ogDescription || !ogImage) {
      validation.warnings.push('Open Graph标签不完整');
    }
    
    // 验证Twitter Card
    const twitterCard = this.getMetaContent('twitter:card', 'property');
    const twitterTitle = this.getMetaContent('twitter:title', 'property');
    const twitterDescription = this.getMetaContent('twitter:description', 'property');
    
    if (!twitterCard || !twitterTitle || !twitterDescription) {
      validation.warnings.push('Twitter Card标签不完整');
    }
    
    // 验证规范URL
    if (!this.getCanonicalUrl()) {
      validation.warnings.push('缺少规范URL');
    }
    
    return validation;
  }

  /**
   * 重置为默认标签
   */
  resetToDefault() {
    this.currentTags = { ...this.defaultTags };
    this.updatePageMeta(this.currentTags);
  }

  /**
   * 销毁元标签管理器
   */
  destroy() {
    // 清理动态添加的标签
    const dynamicTags = document.querySelectorAll('meta[data-dynamic="true"]');
    dynamicTags.forEach(tag => tag.remove());
    
    const dynamicLinks = document.querySelectorAll('link[data-dynamic="true"]');
    dynamicLinks.forEach(link => link.remove());
    
    const dynamicScripts = document.querySelectorAll('script[data-dynamic="true"]');
    dynamicScripts.forEach(script => script.remove());
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetaTagsManager;
} else {
  window.MetaTagsManager = MetaTagsManager;
}