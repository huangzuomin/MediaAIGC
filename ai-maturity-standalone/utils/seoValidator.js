// SEO Validation utilities for comprehensive SEO checking
const SEOValidator = {
  // Validate all SEO elements
  validateAll: function() {
    const results = {
      title: this.validateTitle(),
      description: this.validateDescription(),
      keywords: this.validateKeywords(),
      headings: this.validateHeadings(),
      images: this.validateImages(),
      links: this.validateLinks(),
      openGraph: this.validateOpenGraph(),
      twitterCard: this.validateTwitterCard(),
      structuredData: this.validateStructuredData(),
      canonical: this.validateCanonical(),
      robots: this.validateRobots(),
      performance: this.validatePerformance(),
      mobile: this.validateMobile(),
      accessibility: this.validateAccessibility()
    };

    // Calculate overall score
    const scores = Object.values(results).map(r => r.score || 0);
    const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

    return {
      overallScore,
      results,
      recommendations: this.generateRecommendations(results),
      timestamp: new Date().toISOString()
    };
  },

  // Validate page title
  validateTitle: function() {
    const title = document.title;
    const issues = [];
    let score = 100;

    if (!title) {
      issues.push('Missing page title');
      score = 0;
    } else {
      if (title.length < 30) {
        issues.push('Title too short (recommended 30-60 characters)');
        score -= 20;
      }
      if (title.length > 60) {
        issues.push('Title too long (recommended 30-60 characters)');
        score -= 15;
      }
      if (!title.includes('AI成熟度') && !title.includes('自测')) {
        issues.push('Title missing primary keywords');
        score -= 25;
      }
      if (!title.includes('|') && !title.includes('-')) {
        issues.push('Consider adding brand separator in title');
        score -= 10;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      value: title,
      length: title ? title.length : 0
    };
  },

  // Validate meta description
  validateDescription: function() {
    const meta = document.querySelector('meta[name="description"]');
    const description = meta ? meta.content : '';
    const issues = [];
    let score = 100;

    if (!description) {
      issues.push('Missing meta description');
      score = 0;
    } else {
      if (description.length < 120) {
        issues.push('Description too short (recommended 120-160 characters)');
        score -= 20;
      }
      if (description.length > 160) {
        issues.push('Description too long (recommended 120-160 characters)');
        score -= 15;
      }
      if (!description.includes('AI成熟度') || !description.includes('自测')) {
        issues.push('Description missing primary keywords');
        score -= 25;
      }
      if (!description.includes('专业') && !description.includes('免费')) {
        issues.push('Consider adding value propositions');
        score -= 10;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      value: description,
      length: description.length
    };
  },

  // Validate keywords
  validateKeywords: function() {
    const meta = document.querySelector('meta[name="keywords"]');
    const keywords = meta ? meta.content : '';
    const issues = [];
    let score = 100;

    if (!keywords) {
      issues.push('Missing meta keywords');
      score = 0;
    } else {
      const keywordArray = keywords.split(',').map(k => k.trim());
      if (keywordArray.length < 5) {
        issues.push('Too few keywords (recommended 5-10)');
        score -= 20;
      }
      if (keywordArray.length > 15) {
        issues.push('Too many keywords (recommended 5-10)');
        score -= 15;
      }
      
      const primaryKeywords = ['AI成熟度', '自测', '媒体', '转型'];
      const hasAllPrimary = primaryKeywords.every(keyword => 
        keywords.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (!hasAllPrimary) {
        issues.push('Missing some primary keywords');
        score -= 30;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      value: keywords,
      count: keywords ? keywords.split(',').length : 0
    };
  },

  // Validate heading structure
  validateHeadings: function() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const issues = [];
    let score = 100;

    const h1s = headings.filter(h => h.tagName === 'H1');
    if (h1s.length === 0) {
      issues.push('Missing H1 tag');
      score -= 30;
    } else if (h1s.length > 1) {
      issues.push('Multiple H1 tags found');
      score -= 20;
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy skip: ${heading.tagName} after H${previousLevel}`);
        score -= 10;
      }
      previousLevel = level;
    });

    // Check for empty headings
    const emptyHeadings = headings.filter(h => !h.textContent.trim());
    if (emptyHeadings.length > 0) {
      issues.push(`${emptyHeadings.length} empty heading(s) found`);
      score -= emptyHeadings.length * 15;
    }

    return {
      score: Math.max(0, score),
      issues,
      total: headings.length,
      h1Count: h1s.length,
      structure: headings.map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 50) }))
    };
  },

  // Validate images
  validateImages: function() {
    const images = Array.from(document.querySelectorAll('img'));
    const issues = [];
    let score = 100;

    const missingAlt = images.filter(img => !img.alt);
    if (missingAlt.length > 0) {
      issues.push(`${missingAlt.length} image(s) missing alt text`);
      score -= missingAlt.length * 20;
    }

    const emptyAlt = images.filter(img => img.alt === '');
    if (emptyAlt.length > 0) {
      issues.push(`${emptyAlt.length} image(s) with empty alt text`);
      score -= emptyAlt.length * 10;
    }

    const missingTitle = images.filter(img => !img.title && img.alt);
    if (missingTitle.length > 0) {
      issues.push(`${missingTitle.length} image(s) could benefit from title attribute`);
      score -= missingTitle.length * 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      total: images.length,
      withAlt: images.length - missingAlt.length,
      withTitle: images.filter(img => img.title).length
    };
  },

  // Validate links
  validateLinks: function() {
    const links = Array.from(document.querySelectorAll('a'));
    const issues = [];
    let score = 100;

    const externalLinks = links.filter(link => 
      link.href && 
      !link.href.startsWith(window.location.origin) && 
      !link.href.startsWith('#') &&
      !link.href.startsWith('mailto:') &&
      !link.href.startsWith('tel:')
    );

    const externalWithoutTarget = externalLinks.filter(link => link.target !== '_blank');
    if (externalWithoutTarget.length > 0) {
      issues.push(`${externalWithoutTarget.length} external link(s) without target="_blank"`);
      score -= externalWithoutTarget.length * 10;
    }

    const externalWithoutRel = externalLinks.filter(link => 
      !link.rel || (!link.rel.includes('noopener') && !link.rel.includes('noreferrer'))
    );
    if (externalWithoutRel.length > 0) {
      issues.push(`${externalWithoutRel.length} external link(s) without proper rel attribute`);
      score -= externalWithoutRel.length * 15;
    }

    const emptyLinks = links.filter(link => !link.textContent.trim() && !link.querySelector('img'));
    if (emptyLinks.length > 0) {
      issues.push(`${emptyLinks.length} empty link(s) found`);
      score -= emptyLinks.length * 20;
    }

    return {
      score: Math.max(0, score),
      issues,
      total: links.length,
      external: externalLinks.length,
      internal: links.length - externalLinks.length
    };
  },

  // Validate Open Graph tags
  validateOpenGraph: function() {
    const requiredOGTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
    const issues = [];
    let score = 100;

    const missingTags = requiredOGTags.filter(tag => 
      !document.querySelector(`meta[property="${tag}"]`)
    );

    if (missingTags.length > 0) {
      issues.push(`Missing OG tags: ${missingTags.join(', ')}`);
      score -= missingTags.length * 20;
    }

    // Check OG image dimensions
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogImageWidth = document.querySelector('meta[property="og:image:width"]');
    const ogImageHeight = document.querySelector('meta[property="og:image:height"]');

    if (ogImage && (!ogImageWidth || !ogImageHeight)) {
      issues.push('OG image missing width/height attributes');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      present: requiredOGTags.length - missingTags.length,
      missing: missingTags.length
    };
  },

  // Validate Twitter Card
  validateTwitterCard: function() {
    const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    const issues = [];
    let score = 100;

    const missingTags = requiredTwitterTags.filter(tag => 
      !document.querySelector(`meta[name="${tag}"], meta[property="${tag}"]`)
    );

    if (missingTags.length > 0) {
      issues.push(`Missing Twitter tags: ${missingTags.join(', ')}`);
      score -= missingTags.length * 25;
    }

    const cardType = document.querySelector('meta[name="twitter:card"], meta[property="twitter:card"]');
    if (cardType && cardType.content !== 'summary_large_image') {
      issues.push('Consider using "summary_large_image" for better visibility');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      present: requiredTwitterTags.length - missingTags.length,
      missing: missingTags.length
    };
  },

  // Validate structured data
  validateStructuredData: function() {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const issues = [];
    let score = 100;

    if (scripts.length === 0) {
      issues.push('No structured data found');
      score = 0;
    } else {
      let validScripts = 0;
      scripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@context'] && data['@type']) {
            validScripts++;
          } else {
            issues.push(`Structured data ${index + 1} missing @context or @type`);
            score -= 15;
          }
        } catch (e) {
          issues.push(`Invalid JSON in structured data ${index + 1}`);
          score -= 20;
        }
      });

      if (validScripts === 0) {
        issues.push('No valid structured data found');
        score = 0;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      total: scripts.length,
      valid: scripts.length - issues.length
    };
  },

  // Validate canonical URL
  validateCanonical: function() {
    const canonical = document.querySelector('link[rel="canonical"]');
    const issues = [];
    let score = 100;

    if (!canonical) {
      issues.push('Missing canonical URL');
      score = 0;
    } else {
      const href = canonical.href;
      if (!href) {
        issues.push('Canonical URL is empty');
        score = 0;
      } else if (href !== window.location.href) {
        issues.push('Canonical URL differs from current URL');
        score -= 20;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      value: canonical ? canonical.href : null
    };
  },

  // Validate robots meta
  validateRobots: function() {
    const robots = document.querySelector('meta[name="robots"]');
    const issues = [];
    let score = 100;

    if (!robots) {
      issues.push('Missing robots meta tag');
      score -= 20;
    } else {
      const content = robots.content.toLowerCase();
      if (content.includes('noindex')) {
        issues.push('Page set to noindex');
        score -= 50;
      }
      if (content.includes('nofollow')) {
        issues.push('Page set to nofollow');
        score -= 30;
      }
      if (!content.includes('index') && !content.includes('noindex')) {
        issues.push('Robots directive unclear');
        score -= 10;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      value: robots ? robots.content : null
    };
  },

  // Validate performance aspects
  validatePerformance: function() {
    const issues = [];
    let score = 100;

    // Check for resource hints
    const preconnects = document.querySelectorAll('link[rel="preconnect"]');
    if (preconnects.length === 0) {
      issues.push('No preconnect hints found');
      score -= 15;
    }

    const dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]');
    if (dnsPrefetch.length === 0) {
      issues.push('No DNS prefetch hints found');
      score -= 10;
    }

    // Check for inline styles (should be minimal)
    const inlineStyles = Array.from(document.querySelectorAll('[style]'));
    if (inlineStyles.length > 5) {
      issues.push(`Too many inline styles (${inlineStyles.length})`);
      score -= 10;
    }

    // Check for external scripts
    const externalScripts = Array.from(document.querySelectorAll('script[src]'));
    if (externalScripts.length > 10) {
      issues.push(`Many external scripts (${externalScripts.length})`);
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      preconnects: preconnects.length,
      dnsPrefetch: dnsPrefetch.length,
      inlineStyles: inlineStyles.length,
      externalScripts: externalScripts.length
    };
  },

  // Validate mobile optimization
  validateMobile: function() {
    const viewport = document.querySelector('meta[name="viewport"]');
    const issues = [];
    let score = 100;

    if (!viewport) {
      issues.push('Missing viewport meta tag');
      score -= 40;
    } else {
      const content = viewport.content;
      if (!content.includes('width=device-width')) {
        issues.push('Viewport missing width=device-width');
        score -= 20;
      }
      if (!content.includes('initial-scale=1')) {
        issues.push('Viewport missing initial-scale=1');
        score -= 15;
      }
    }

    // Check for mobile-specific meta tags
    const appleMobileCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobileCapable) {
      issues.push('Missing Apple mobile web app meta tags');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      viewport: viewport ? viewport.content : null
    };
  },

  // Validate accessibility
  validateAccessibility: function() {
    const issues = [];
    let score = 100;

    // Check for lang attribute
    const html = document.documentElement;
    if (!html.lang) {
      issues.push('Missing lang attribute on html element');
      score -= 20;
    }

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    if (skipLinks.length === 0) {
      issues.push('No skip links found');
      score -= 10;
    }

    // Check for ARIA labels
    const interactiveElements = document.querySelectorAll('button, input, select, textarea');
    const missingLabels = Array.from(interactiveElements).filter(el => 
      !el.getAttribute('aria-label') && 
      !el.getAttribute('aria-labelledby') && 
      !document.querySelector(`label[for="${el.id}"]`)
    );

    if (missingLabels.length > 0) {
      issues.push(`${missingLabels.length} interactive element(s) missing labels`);
      score -= missingLabels.length * 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      lang: html.lang,
      skipLinks: skipLinks.length,
      unlabeledElements: missingLabels.length
    };
  },

  // Generate recommendations based on validation results
  generateRecommendations: function(results) {
    const recommendations = [];

    if (results.title.score < 80) {
      recommendations.push({
        priority: 'high',
        category: 'Title',
        message: 'Optimize page title for better SEO',
        details: results.title.issues
      });
    }

    if (results.description.score < 80) {
      recommendations.push({
        priority: 'high',
        category: 'Description',
        message: 'Improve meta description',
        details: results.description.issues
      });
    }

    if (results.openGraph.score < 90) {
      recommendations.push({
        priority: 'medium',
        category: 'Social Media',
        message: 'Complete Open Graph tags for better social sharing',
        details: results.openGraph.issues
      });
    }

    if (results.structuredData.score < 70) {
      recommendations.push({
        priority: 'medium',
        category: 'Structured Data',
        message: 'Add or fix structured data markup',
        details: results.structuredData.issues
      });
    }

    if (results.performance.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'Performance',
        message: 'Optimize page performance',
        details: results.performance.issues
      });
    }

    if (results.accessibility.score < 90) {
      recommendations.push({
        priority: 'low',
        category: 'Accessibility',
        message: 'Improve accessibility features',
        details: results.accessibility.issues
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  },

  // Generate SEO report
  generateReport: function() {
    const validation = this.validateAll();
    
    return {
      ...validation,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: Object.values(validation.results).reduce((sum, result) => sum + result.issues.length, 0),
        criticalIssues: validation.recommendations.filter(r => r.priority === 'high').length,
        averageScore: validation.overallScore,
        status: validation.overallScore >= 90 ? 'excellent' : 
                validation.overallScore >= 70 ? 'good' : 
                validation.overallScore >= 50 ? 'needs improvement' : 'poor'
      }
    };
  }
};

// Export for global use
window.SEOValidator = SEOValidator;