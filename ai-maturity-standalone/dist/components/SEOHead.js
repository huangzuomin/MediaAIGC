// Enhanced SEO Head Component for Dynamic Meta Management
function SEOHead({ 
  title = "媒体AI成熟度5分钟自测 | 免费评估您的AI转型水平",
  description = "专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平，获得个性化转型建议和专家指导",
  keywords = "AI成熟度测试,媒体AI转型,AI自测,智媒变革,AI评估工具",
  ogImage = "",
  canonicalUrl = "",
  structuredData = null,
  author = "温州新闻网·智媒变革中心",
  publishedTime = null,
  modifiedTime = null,
  articleSection = "AI转型评估",
  locale = "zh_CN",
  siteName = "温州新闻网·智媒变革中心"
}) {
  
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Update Open Graph tags
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', ogImage || generateDefaultOGImage());
    updateMetaProperty('og:image:width', '1200');
    updateMetaProperty('og:image:height', '630');
    updateMetaProperty('og:image:alt', `${title} - 预览图`);
    updateMetaProperty('og:url', canonicalUrl || window.location.href);
    updateMetaProperty('og:site_name', siteName);
    updateMetaProperty('og:locale', locale);
    
    if (publishedTime) {
      updateMetaProperty('article:published_time', publishedTime);
    }
    if (modifiedTime) {
      updateMetaProperty('article:modified_time', modifiedTime);
    }
    if (articleSection) {
      updateMetaProperty('article:section', articleSection);
    }
    updateMetaProperty('article:author', author);
    
    // Update Twitter Card tags
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:title', title);
    updateMetaProperty('twitter:description', description);
    updateMetaProperty('twitter:image', ogImage || generateDefaultOGImage());
    updateMetaProperty('twitter:image:alt', `${title} - 预览图`);
    updateMetaProperty('twitter:url', canonicalUrl || window.location.href);
    updateMetaProperty('twitter:site', '@wzxww');
    updateMetaProperty('twitter:creator', '@wzxww');
    
    // Update additional meta tags for better SEO
    updateMetaTag('theme-color', '#003366');
    updateMetaTag('msapplication-TileColor', '#003366');
    updateMetaTag('application-name', siteName);
    updateMetaTag('apple-mobile-web-app-title', siteName);
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('format-detection', 'telephone=no');
    
    // Update canonical URL
    updateCanonicalUrl(canonicalUrl || window.location.href);
    
    // Update alternate URLs for different languages (future enhancement)
    updateAlternateUrls();
    
    // Update structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    } else {
      updateDefaultStructuredData();
    }
    
    // Update preconnect and DNS prefetch for performance
    updateResourceHints();
    
  }, [title, description, keywords, ogImage, canonicalUrl, structuredData, author, publishedTime, modifiedTime, articleSection, locale, siteName]);

  const updateMetaTag = (name, content) => {
    if (!content) return;
    
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateMetaProperty = (property, content) => {
    if (!content) return;
    
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateCanonicalUrl = (url) => {
    if (!url) return;
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };

  const updateStructuredData = (data) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-structured-data';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const updateDefaultStructuredData = () => {
    const defaultData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${window.location.origin}/#webapp`,
          "name": "媒体AI成熟度自测",
          "description": description,
          "url": canonicalUrl || window.location.href,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "1.0",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CNY",
            "availability": "https://schema.org/InStock"
          },
          "provider": {
            "@type": "Organization",
            "@id": `${window.location.origin}/#organization`,
            "name": siteName,
            "url": window.location.origin,
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/assets/logo.png`
            }
          },
          "featureList": [
            "AI成熟度评估",
            "个性化建议",
            "专家咨询引导",
            "结果分享"
          ],
          "screenshot": ogImage || generateDefaultOGImage()
        },
        {
          "@type": "WebPage",
          "@id": canonicalUrl || window.location.href,
          "url": canonicalUrl || window.location.href,
          "name": title,
          "description": description,
          "inLanguage": locale.replace('_', '-'),
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${window.location.origin}/#website`,
            "name": siteName,
            "url": window.location.origin
          },
          "about": {
            "@type": "Thing",
            "name": "AI成熟度评估",
            "description": "媒体机构AI应用水平评估工具"
          },
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "媒体AI成熟度自测",
            "applicationCategory": "BusinessApplication"
          }
        },
        {
          "@type": "Organization",
          "@id": `${window.location.origin}/#organization`,
          "name": siteName,
          "url": window.location.origin,
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/assets/logo.png`,
            "width": 200,
            "height": 60
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Chinese"]
          },
          "sameAs": [
            "https://weibo.com/wzxww",
            "https://www.zhihu.com/org/wzxww"
          ]
        }
      ]
    };
    
    updateStructuredData(defaultData);
  };

  const generateDefaultOGImage = () => {
    // Generate a default OG image URL or return a placeholder
    return `${window.location.origin}/assets/og-image-default.jpg`;
  };

  const updateAlternateUrls = () => {
    // Remove existing alternate links
    const existingAlternates = document.querySelectorAll('link[rel="alternate"]');
    existingAlternates.forEach(link => link.remove());
    
    // Add alternate URLs for different languages (future enhancement)
    const alternates = [
      { hreflang: 'zh-CN', href: canonicalUrl || window.location.href },
      { hreflang: 'x-default', href: canonicalUrl || window.location.href }
    ];
    
    alternates.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alt.hreflang;
      link.href = alt.href;
      document.head.appendChild(link);
    });
  };

  const updateResourceHints = () => {
    // Remove existing resource hints
    const existingHints = document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"], link[rel="preload"]');
    existingHints.forEach(link => link.remove());
    
    // Add preconnect for external resources
    const preconnects = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://resource.trickle.so'
    ];
    
    preconnects.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Add DNS prefetch for social sharing domains
    const dnsPrefetch = [
      'https://platform.twitter.com',
      'https://connect.facebook.net',
      'https://apis.google.com'
    ];
    
    dnsPrefetch.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
    
    // Preload critical resources
    if (ogImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = ogImage;
      link.as = 'image';
      document.head.appendChild(link);
    }
  };

  // This component doesn't render anything visible
  return null;
}

// Predefined SEO configurations for different pages/states
const SEOConfigs = {
  assessment: {
    title: "媒体AI成熟度5分钟自测 | 免费评估您的AI转型水平",
    description: "专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平，获得个性化转型建议和专家指导。10个维度全面分析，L1-L5等级评估，助力媒体智能化转型。",
    keywords: "AI成熟度测试,媒体AI转型,AI自测,智媒变革,AI评估工具,媒体数字化,人工智能评估,AI转型咨询,媒体智能化,AI应用水平",
    ogImage: "/assets/og-image-assessment.jpg",
    articleSection: "AI转型评估",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "媒体AI成熟度自测",
      "description": "专业的媒体AI成熟度自测工具，5分钟快速评估您机构的AI应用水平",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY",
        "availability": "https://schema.org/InStock"
      },
      "provider": {
        "@type": "Organization",
        "name": "温州新闻网·智媒变革中心",
        "url": "https://wzxww.com"
      },
      "featureList": [
        "10个维度AI成熟度评估",
        "L1-L5等级专业评定",
        "个性化转型建议",
        "专家咨询引导",
        "结果分享功能"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1200",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  },
  
  result: (level, levelName, score) => ({
    title: `AI成熟度测试结果：${levelName}(${level}) | 获得专业转型建议`,
    description: `您的机构AI成熟度评估结果为${levelName}(${level})，综合得分${score}/5.0。查看详细分析报告和个性化转型建议，联系专家获得更多指导。`,
    keywords: `AI成熟度${level},${levelName},AI转型建议,媒体AI咨询,AI评估结果,智媒变革方案`,
    ogImage: `/assets/og-image-result-${level.toLowerCase()}.jpg`,
    articleSection: "评估结果",
    publishedTime: new Date().toISOString(),
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `AI成熟度测试结果：${levelName}`,
      "description": `AI成熟度评估结果为${levelName}，包含详细分析和转型建议`,
      "mainEntity": {
        "@type": "Quiz",
        "name": "媒体AI成熟度评估",
        "description": "专业的媒体机构AI应用水平评估工具",
        "educationalLevel": "professional",
        "assesses": "AI应用成熟度",
        "teaches": "AI转型策略",
        "result": {
          "@type": "QuizResult",
          "name": levelName,
          "value": level,
          "score": score,
          "maxScore": "5.0",
          "description": `您的机构AI成熟度达到${levelName}水平`
        }
      },
      "about": {
        "@type": "Thing",
        "name": "AI成熟度评估",
        "description": "媒体机构人工智能应用水平专业评估"
      }
    }
  }),

  loading: {
    title: "正在分析您的AI成熟度 | 媒体AI转型评估",
    description: "正在为您分析AI成熟度评估结果，请稍候。我们将为您生成个性化的转型建议和专业指导方案。",
    keywords: "AI成熟度分析,评估结果生成,AI转型建议",
    ogImage: "/assets/og-image-loading.jpg"
  },

  error: {
    title: "页面遇到问题 | 媒体AI成熟度自测",
    description: "AI成熟度自测工具遇到技术问题，请刷新页面重试。如问题持续存在，请联系技术支持。",
    keywords: "技术支持,页面错误,AI自测工具",
    ogImage: "/assets/og-image-error.jpg"
  },

  // Dynamic configurations for different question stages
  question: (questionNumber, totalQuestions, dimension) => ({
    title: `第${questionNumber}题 - ${dimension} | 媒体AI成熟度自测`,
    description: `正在进行媒体AI成熟度自测，当前第${questionNumber}题，共${totalQuestions}题。评估维度：${dimension}。完成测试获得专业转型建议。`,
    keywords: `AI成熟度测试,${dimension},第${questionNumber}题,媒体AI评估`,
    ogImage: "/assets/og-image-question.jpg"
  }),

  // Configurations for sharing
  share: (level, levelName) => ({
    title: `我的AI成熟度是${levelName}(${level}) | 你也来测测吧`,
    description: `我刚完成了媒体AI成熟度自测，结果是${levelName}！这个5分钟测试很专业，还有个性化建议。推荐你也来试试！`,
    keywords: `AI成熟度分享,${levelName},AI自测推荐`,
    ogImage: `/assets/og-image-share-${level.toLowerCase()}.jpg`
  })
};

// Hook for easy SEO management
function useSEO(configKey, ...params) {
  const config = typeof configKey === 'string' 
    ? (typeof SEOConfigs[configKey] === 'function' 
        ? SEOConfigs[configKey](...params) 
        : SEOConfigs[configKey])
    : configKey;
    
  return config;
}

// Export components and utilities
window.SEOHead = SEOHead;
window.SEOConfigs = SEOConfigs;
window.useSEO = useSEO;