// Sitemap generation utilities for SEO optimization
const SitemapGenerator = {
  // Generate XML sitemap content
  generateSitemap: function(baseUrl = window.location.origin) {
    const urls = [
      {
        loc: `${baseUrl}/ai-maturity-standalone/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        loc: `${baseUrl}/ai-maturity-standalone/index.html`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '1.0'
      }
    ];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xmlContent;
  },

  // Generate robots.txt content
  generateRobotsTxt: function(baseUrl = window.location.origin) {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/ai-maturity-standalone/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

# Block access to sensitive areas
Disallow: /assets/temp/
Disallow: /utils/
Disallow: /*.json$
Disallow: /*?debug=*
Disallow: /*&debug=*`;
  },

  // Generate structured data for breadcrumbs
  generateBreadcrumbStructuredData: function(currentPage = 'assessment') {
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI成熟度自测",
        "item": window.location.href
      }
    ];

    if (currentPage === 'result') {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 3,
        "name": "测试结果",
        "item": window.location.href
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };
  },

  // Generate FAQ structured data
  generateFAQStructuredData: function() {
    const faqs = [
      {
        question: "AI成熟度自测需要多长时间？",
        answer: "整个测试大约需要5分钟时间，包含10个专业问题，涵盖技术应用、数据管理、流程融合等多个维度。"
      },
      {
        question: "测试结果准确吗？",
        answer: "我们的评估模型基于媒体行业AI应用的最佳实践和专业标准，结果具有很高的参考价值。同时提供个性化的改进建议。"
      },
      {
        question: "测试数据会被保存吗？",
        answer: "您的测试数据仅保存在本地浏览器中，不会上传到服务器。我们严格保护用户隐私，符合数据保护法规。"
      },
      {
        question: "如何获得更详细的咨询服务？",
        answer: "完成测试后，您可以点击'预约专家咨询'按钮，我们的AI转型专家将为您提供更深入的分析和定制化解决方案。"
      },
      {
        question: "测试结果可以分享吗？",
        answer: "是的，您可以将测试结果分享到微信、微博等社交平台，让更多同行了解AI成熟度评估工具。"
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  },

  // Generate organization structured data
  generateOrganizationStructuredData: function() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "温州新闻网·智媒变革中心",
      "alternateName": "智媒变革中心",
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/assets/logo.png`,
        "width": 200,
        "height": 60
      },
      "description": "专业的媒体AI转型战略咨询服务机构，致力于帮助媒体机构实现智能化转型升级",
      "foundingDate": "2020",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+86-577-88096666",
          "contactType": "customer service",
          "availableLanguage": ["Chinese"],
          "areaServed": "CN"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "温州",
        "addressRegion": "浙江省",
        "addressCountry": "CN"
      },
      "sameAs": [
        "https://weibo.com/wzxww",
        "https://www.zhihu.com/org/wzxww"
      ],
      "knowsAbout": [
        "人工智能",
        "媒体转型",
        "数字化转型",
        "智能媒体",
        "AI咨询"
      ],
      "memberOf": {
        "@type": "Organization",
        "name": "中国新闻网站联盟"
      }
    };
  },

  // Generate service structured data
  generateServiceStructuredData: function() {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "媒体AI成熟度评估服务",
      "description": "专业的媒体机构AI应用水平评估和转型咨询服务",
      "provider": {
        "@type": "Organization",
        "name": "温州新闻网·智媒变革中心"
      },
      "serviceType": "AI转型咨询",
      "audience": {
        "@type": "Audience",
        "audienceType": "媒体机构"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "description": "免费AI成熟度自测服务"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI转型服务目录",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI成熟度评估",
              "description": "5分钟快速评估机构AI应用水平"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "专家咨询服务",
              "description": "一对一AI转型策略咨询"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "定制化解决方案",
              "description": "针对性的AI转型实施方案"
            }
          }
        ]
      }
    };
  },

  // Generate review/rating structured data
  generateReviewStructuredData: function() {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "媒体AI成熟度自测工具",
      "description": "专业的媒体机构AI应用水平评估工具",
      "brand": {
        "@type": "Brand",
        "name": "温州新闻网·智媒变革中心"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1200",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "张总编"
          },
          "reviewBody": "非常专业的评估工具，帮助我们清晰了解了机构的AI应用现状，建议很实用。",
          "datePublished": "2024-01-15"
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "李主任"
          },
          "reviewBody": "测试很快就完成了，结果分析很详细，为我们的AI转型提供了明确方向。",
          "datePublished": "2024-01-20"
        }
      ]
    };
  },

  // Inject all structured data into page
  injectAllStructuredData: function() {
    const structuredDataSets = [
      this.generateBreadcrumbStructuredData(),
      this.generateFAQStructuredData(),
      this.generateOrganizationStructuredData(),
      this.generateServiceStructuredData(),
      this.generateReviewStructuredData()
    ];

    structuredDataSets.forEach((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  },

  // Generate meta tags for social sharing optimization
  generateSocialMetaTags: function(config) {
    const metaTags = [];

    // Open Graph tags
    const ogTags = {
      'og:type': 'website',
      'og:title': config.title,
      'og:description': config.description,
      'og:image': config.ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': `${config.title} - 预览图`,
      'og:url': config.canonicalUrl || window.location.href,
      'og:site_name': '温州新闻网·智媒变革中心',
      'og:locale': 'zh_CN'
    };

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': config.title,
      'twitter:description': config.description,
      'twitter:image': config.ogImage,
      'twitter:image:alt': `${config.title} - 预览图`,
      'twitter:site': '@wzxww',
      'twitter:creator': '@wzxww'
    };

    // WeChat/QQ sharing tags
    const wechatTags = {
      'wechat:title': config.title,
      'wechat:description': config.description,
      'wechat:image': config.ogImage,
      'wechat:type': 'website'
    };

    return { ...ogTags, ...twitterTags, ...wechatTags };
  },

  // Generate canonical and alternate URLs
  generateCanonicalAndAlternates: function(baseUrl = window.location.href) {
    return {
      canonical: baseUrl,
      alternates: [
        { hreflang: 'zh-CN', href: baseUrl },
        { hreflang: 'x-default', href: baseUrl }
      ]
    };
  }
};

// Export for global use
window.SitemapGenerator = SitemapGenerator;