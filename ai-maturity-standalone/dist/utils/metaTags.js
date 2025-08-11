// Meta tags management utilities for comprehensive SEO
const MetaTagsManager = {
  // Core meta tags for SEO
  coreMetaTags: {
    'charset': 'UTF-8',
    'viewport': 'width=device-width, initial-scale=1.0',
    'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    'googlebot': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    'bingbot': 'index, follow',
    'format-detection': 'telephone=no',
    'theme-color': '#003366',
    'msapplication-TileColor': '#003366',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  },

  // Initialize all meta tags
  init: function(config = {}) {
    this.setCoreMetaTags();
    this.setSEOMetaTags(config);
    this.setSocialMetaTags(config);
    this.setMobileMetaTags();
    this.setSecurityMetaTags();
    this.setPerformanceMetaTags();
  },

  // Set core meta tags
  setCoreMetaTags: function() {
    Object.entries(this.coreMetaTags).forEach(([name, content]) => {
      this.updateMetaTag(name, content);
    });
  },

  // Set SEO-specific meta tags
  setSEOMetaTags: function(config) {
    const seoTags = {
      'title': config.title || '媒体AI成熟度5分钟自测 | 免费评估您的AI转型水平',
      'description': config.description || '专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平，获得个性化转型建议和专家指导',
      'keywords': config.keywords || 'AI成熟度测试,媒体AI转型,AI自测,智媒变革,AI评估工具',
      'author': config.author || '温州新闻网·智媒变革中心',
      'publisher': config.publisher || '温州新闻网·智媒变革中心',
      'copyright': config.copyright || '© 2024 温州新闻网·智媒变革中心',
      'language': config.language || 'zh-CN',
      'revisit-after': '7 days',
      'distribution': 'global',
      'rating': 'general',
      'referrer': 'origin-when-cross-origin'
    };

    // Set document title
    if (seoTags.title) {
      document.title = seoTags.title;
    }

    // Set other SEO meta tags
    Object.entries(seoTags).forEach(([name, content]) => {
      if (name !== 'title' && content) {
        this.updateMetaTag(name, content);
      }
    });

    // Set canonical URL
    if (config.canonicalUrl) {
      this.setCanonicalUrl(config.canonicalUrl);
    }

    // Set alternate URLs
    this.setAlternateUrls(config.alternateUrls || []);
  },

  // Set social media meta tags
  setSocialMetaTags: function(config) {
    const baseUrl = window.location.origin;
    const currentUrl = config.canonicalUrl || window.location.href;
    const ogImage = config.ogImage || `${baseUrl}/assets/og-image-default.jpg`;

    // Open Graph tags
    const ogTags = {
      'og:type': 'website',
      'og:title': config.title || '媒体AI成熟度5分钟自测',
      'og:description': config.description || '专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平',
      'og:image': ogImage,
      'og:image:secure_url': ogImage.replace('http://', 'https://'),
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': `${config.title || '媒体AI成熟度自测'} - 预览图`,
      'og:image:type': 'image/jpeg',
      'og:url': currentUrl,
      'og:site_name': '温州新闻网·智媒变革中心',
      'og:locale': 'zh_CN',
      'og:locale:alternate': 'en_US'
    };

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@wzxww',
      'twitter:creator': '@wzxww',
      'twitter:title': config.title || '媒体AI成熟度5分钟自测',
      'twitter:description': config.description || '专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平',
      'twitter:image': ogImage,
      'twitter:image:alt': `${config.title || '媒体AI成熟度自测'} - 预览图`,
      'twitter:url': currentUrl,
      'twitter:domain': window.location.hostname
    };

    // Facebook specific tags
    const facebookTags = {
      'fb:app_id': config.facebookAppId || '',
      'fb:admins': config.facebookAdmins || ''
    };

    // WeChat/QQ sharing tags
    const wechatTags = {
      'wechat:title': config.title || '媒体AI成熟度5分钟自测',
      'wechat:description': config.description || '专业的媒体AI成熟度自测工具',
      'wechat:image': ogImage,
      'wechat:type': 'website'
    };

    // LinkedIn tags
    const linkedinTags = {
      'linkedin:owner': config.linkedinOwner || ''
    };

    // Combine all social tags
    const allSocialTags = { ...ogTags, ...twitterTags, ...facebookTags, ...wechatTags, ...linkedinTags };

    // Set social meta tags
    Object.entries(allSocialTags).forEach(([property, content]) => {
      if (content) {
        this.updateMetaProperty(property, content);
      }
    });
  },

  // Set mobile-specific meta tags
  setMobileMetaTags: function() {
    const mobileTags = {
      'mobile-web-app-capable': 'yes',
      'mobile-web-app-status-bar-style': 'default',
      'mobile-web-app-title': '媒体AI成熟度自测',
      'application-name': '媒体AI成熟度自测',
      'msapplication-tooltip': '专业的媒体AI成熟度评估工具',
      'msapplication-starturl': window.location.href,
      'msapplication-navbutton-color': '#003366',
      'msapplication-window': 'width=1024;height=768',
      'apple-mobile-web-app-title': '媒体AI成熟度自测',
      'apple-touch-fullscreen': 'yes'
    };

    Object.entries(mobileTags).forEach(([name, content]) => {
      this.updateMetaTag(name, content);
    });

    // Set apple touch icons
    this.setAppleTouchIcons();
  },

  // Set security-related meta tags
  setSecurityMetaTags: function() {
    const securityTags = {
      'referrer': 'origin-when-cross-origin',
      'x-dns-prefetch-control': 'on',
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff'
    };

    Object.entries(securityTags).forEach(([name, content]) => {
      this.updateMetaTag(name, content);
    });

    // Set Content Security Policy
    this.setCSP();
  },

  // Set performance-related meta tags
  setPerformanceMetaTags: function() {
    const performanceTags = {
      'dns-prefetch': 'on',
      'preconnect': 'on'
    };

    Object.entries(performanceTags).forEach(([name, content]) => {
      this.updateMetaTag(name, content);
    });

    // Set resource hints
    this.setResourceHints();
  },

  // Update meta tag by name
  updateMetaTag: function(name, content) {
    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  },

  // Update meta tag by property
  updateMetaProperty: function(property, content) {
    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  },

  // Set canonical URL
  setCanonicalUrl: function(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  },

  // Set alternate URLs for different languages
  setAlternateUrls: function(alternates = []) {
    // Remove existing alternate links
    const existingAlternates = document.querySelectorAll('link[rel="alternate"]');
    existingAlternates.forEach(link => link.remove());

    // Add default alternates if none provided
    if (alternates.length === 0) {
      alternates = [
        { hreflang: 'zh-CN', href: window.location.href },
        { hreflang: 'x-default', href: window.location.href }
      ];
    }

    // Add alternate links
    alternates.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alt.hreflang;
      link.href = alt.href;
      document.head.appendChild(link);
    });
  },

  // Set Apple touch icons
  setAppleTouchIcons: function() {
    const iconSizes = [
      { size: '57x57', rel: 'apple-touch-icon' },
      { size: '60x60', rel: 'apple-touch-icon' },
      { size: '72x72', rel: 'apple-touch-icon' },
      { size: '76x76', rel: 'apple-touch-icon' },
      { size: '114x114', rel: 'apple-touch-icon' },
      { size: '120x120', rel: 'apple-touch-icon' },
      { size: '144x144', rel: 'apple-touch-icon' },
      { size: '152x152', rel: 'apple-touch-icon' },
      { size: '180x180', rel: 'apple-touch-icon' }
    ];

    iconSizes.forEach(icon => {
      const link = document.createElement('link');
      link.rel = icon.rel;
      link.sizes = icon.size;
      link.href = `/assets/apple-touch-icon-${icon.size}.png`;
      document.head.appendChild(link);
    });

    // Set favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = '/favicon.ico';
    document.head.appendChild(favicon);
  },

  // Set Content Security Policy
  setCSP: function() {
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 
        https://resource.trickle.so 
        https://cdn.tailwindcss.com 
        https://www.googletagmanager.com 
        https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline' 
        https://resource.trickle.so 
        https://cdn.tailwindcss.com;
      img-src 'self' data: https: blob:;
      font-src 'self' 
        https://resource.trickle.so 
        https://fonts.googleapis.com 
        https://fonts.gstatic.com;
      connect-src 'self' 
        https://www.google-analytics.com 
        https://analytics.google.com;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim();

    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', csp);
    document.head.appendChild(meta);
  },

  // Set resource hints for performance
  setResourceHints: function() {
    const preconnects = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://resource.trickle.so',
      'https://cdn.tailwindcss.com'
    ];

    const dnsPrefetch = [
      'https://platform.twitter.com',
      'https://connect.facebook.net',
      'https://apis.google.com',
      'https://graph.facebook.com'
    ];

    // Add preconnect links
    preconnects.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Add DNS prefetch links
    dnsPrefetch.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // Generate meta tags for specific page states
  generatePageStateMeta: function(state, data = {}) {
    const configs = {
      loading: {
        title: '正在分析您的AI成熟度 | 媒体AI转型评估',
        description: '正在为您分析AI成熟度评估结果，请稍候。我们将为您生成个性化的转型建议和专业指导方案。',
        keywords: 'AI成熟度分析,评估结果生成,AI转型建议'
      },
      error: {
        title: '页面遇到问题 | 媒体AI成熟度自测',
        description: 'AI成熟度自测工具遇到技术问题，请刷新页面重试。如问题持续存在，请联系技术支持。',
        keywords: '技术支持,页面错误,AI自测工具'
      },
      result: {
        title: `AI成熟度测试结果：${data.levelName || ''}(${data.level || ''}) | 获得专业转型建议`,
        description: `您的机构AI成熟度评估结果为${data.levelName || ''}(${data.level || ''})，综合得分${data.score || ''}/5.0。查看详细分析报告和个性化转型建议。`,
        keywords: `AI成熟度${data.level || ''},${data.levelName || ''},AI转型建议,媒体AI咨询`
      }
    };

    return configs[state] || configs.loading;
  },

  // Update meta tags for different page states
  updateForPageState: function(state, data = {}) {
    const config = this.generatePageStateMeta(state, data);
    this.setSEOMetaTags(config);
    this.setSocialMetaTags(config);
  },

  // Validate meta tags
  validateMetaTags: function() {
    const requiredTags = [
      'title',
      'description',
      'keywords',
      'viewport',
      'og:title',
      'og:description',
      'og:image',
      'twitter:card',
      'twitter:title',
      'twitter:description'
    ];

    const missing = [];
    const warnings = [];

    requiredTags.forEach(tag => {
      const element = document.querySelector(`meta[name="${tag}"], meta[property="${tag}"]`) || 
                     (tag === 'title' ? document.querySelector('title') : null);
      
      if (!element) {
        missing.push(tag);
      } else {
        const content = element.content || element.textContent;
        if (!content || content.trim().length === 0) {
          warnings.push(`${tag} is empty`);
        }
        
        // Check content length
        if (tag === 'description' && content.length > 160) {
          warnings.push(`Description too long (${content.length} chars, recommended < 160)`);
        }
        if (tag === 'title' && content.length > 60) {
          warnings.push(`Title too long (${content.length} chars, recommended < 60)`);
        }
      }
    });

    return {
      valid: missing.length === 0,
      missing,
      warnings,
      score: Math.max(0, 100 - (missing.length * 10) - (warnings.length * 5))
    };
  },

  // Generate meta tags report
  generateReport: function() {
    const validation = this.validateMetaTags();
    const allMetas = Array.from(document.querySelectorAll('meta')).map(meta => ({
      name: meta.name || meta.property || meta.httpEquiv,
      content: meta.content,
      type: meta.name ? 'name' : (meta.property ? 'property' : 'http-equiv')
    }));

    return {
      validation,
      totalTags: allMetas.length,
      tags: allMetas,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
  }
};

// Export for global use
window.MetaTagsManager = MetaTagsManager;