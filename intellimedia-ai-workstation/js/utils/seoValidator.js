/**
 * SEO验证工具
 * 用于验证和监控页面SEO实施情况
 */

class SEOValidator {
  constructor() {
    this.validationRules = {
      title: {
        minLength: 30,
        maxLength: 60,
        required: true
      },
      description: {
        minLength: 120,
        maxLength: 160,
        required: true
      },
      keywords: {
        minCount: 5,
        maxCount: 15,
        required: true
      },
      h1: {
        count: 1,
        required: true
      },
      images: {
        altRequired: true,
        lazyLoadRecommended: true
      },
      links: {
        internalMinCount: 3,
        externalRelRequired: true
      },
      performance: {
        maxLoadTime: 3000,
        maxLCP: 2500,
        maxFID: 100,
        maxCLS: 0.1
      }
    };
    
    this.validationResults = {
      passed: [],
      warnings: [],
      errors: [],
      score: 0
    };
  }

  /**
   * 执行完整的SEO验证
   * @returns {Object} 验证结果
   */
  async validateAll() {
    console.log('开始SEO验证...');
    
    // 重置结果
    this.resetResults();
    
    // 执行各项验证
    this.validateTitle();
    this.validateDescription();
    this.validateKeywords();
    this.validateHeadings();
    this.validateImages();
    this.validateLinks();
    this.validateMetaTags();
    this.validateStructuredData();
    this.validateOpenGraph();
    this.validateTwitterCard();
    this.validateCanonical();
    this.validateRobots();
    await this.validatePerformance();
    this.validateAccessibility();
    this.validateMobile();
    
    // 计算总分
    this.calculateScore();
    
    // 生成报告
    const report = this.generateReport();
    
    console.log('SEO验证完成', report);
    return report;
  }

  /**
   * 重置验证结果
   */
  resetResults() {
    this.validationResults = {
      passed: [],
      warnings: [],
      errors: [],
      score: 0
    };
  }

  /**
   * 验证页面标题
   */
  validateTitle() {
    const title = document.title;
    const rule = this.validationRules.title;
    
    if (!title) {
      this.addError('页面缺少标题');
      return;
    }
    
    if (title.length < rule.minLength) {
      this.addWarning(`标题过短: ${title.length}字符 (建议${rule.minLength}-${rule.maxLength}字符)`);
    } else if (title.length > rule.maxLength) {
      this.addWarning(`标题过长: ${title.length}字符 (建议${rule.minLength}-${rule.maxLength}字符)`);
    } else {
      this.addPassed('标题长度合适');
    }
    
    // 检查标题是否包含关键词
    const keywords = ['智媒', 'AI', '工作站', '媒体'];
    const containsKeywords = keywords.some(keyword => title.includes(keyword));
    
    if (containsKeywords) {
      this.addPassed('标题包含关键词');
    } else {
      this.addWarning('标题建议包含核心关键词');
    }
  }

  /**
   * 验证页面描述
   */
  validateDescription() {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const rule = this.validationRules.description;
    
    if (!descriptionMeta || !descriptionMeta.content) {
      this.addError('页面缺少描述');
      return;
    }
    
    const description = descriptionMeta.content;
    
    if (description.length < rule.minLength) {
      this.addWarning(`描述过短: ${description.length}字符 (建议${rule.minLength}-${rule.maxLength}字符)`);
    } else if (description.length > rule.maxLength) {
      this.addWarning(`描述过长: ${description.length}字符 (建议${rule.minLength}-${rule.maxLength}字符)`);
    } else {
      this.addPassed('描述长度合适');
    }
  }

  /**
   * 验证关键词
   */
  validateKeywords() {
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    
    if (!keywordsMeta || !keywordsMeta.content) {
      this.addWarning('页面缺少关键词标签');
      return;
    }
    
    const keywords = keywordsMeta.content.split(',').map(k => k.trim());
    const rule = this.validationRules.keywords;
    
    if (keywords.length < rule.minCount) {
      this.addWarning(`关键词数量过少: ${keywords.length}个 (建议${rule.minCount}-${rule.maxCount}个)`);
    } else if (keywords.length > rule.maxCount) {
      this.addWarning(`关键词数量过多: ${keywords.length}个 (建议${rule.minCount}-${rule.maxCount}个)`);
    } else {
      this.addPassed('关键词数量合适');
    }
  }

  /**
   * 验证标题标签
   */
  validateHeadings() {
    const h1Tags = document.querySelectorAll('h1');
    const rule = this.validationRules.h1;
    
    if (h1Tags.length === 0) {
      this.addError('页面缺少H1标签');
    } else if (h1Tags.length > rule.count) {
      this.addWarning(`H1标签过多: ${h1Tags.length}个 (建议${rule.count}个)`);
    } else {
      this.addPassed('H1标签数量正确');
    }
    
    // 检查标题层级结构
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let structureValid = true;
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        structureValid = false;
      }
      previousLevel = currentLevel;
    });
    
    if (structureValid) {
      this.addPassed('标题层级结构正确');
    } else {
      this.addWarning('标题层级结构不规范');
    }
  }

  /**
   * 验证图片
   */
  validateImages() {
    const images = document.querySelectorAll('img');
    const rule = this.validationRules.images;
    
    if (images.length === 0) {
      this.addWarning('页面没有图片');
      return;
    }
    
    let imagesWithoutAlt = 0;
    let imagesWithLazyLoad = 0;
    
    images.forEach(img => {
      if (!img.alt || img.alt.trim() === '') {
        imagesWithoutAlt++;
      }
      
      if (img.loading === 'lazy' || img.hasAttribute('data-src')) {
        imagesWithLazyLoad++;
      }
    });
    
    if (imagesWithoutAlt === 0) {
      this.addPassed('所有图片都有alt属性');
    } else {
      this.addWarning(`${imagesWithoutAlt}张图片缺少alt属性`);
    }
    
    const lazyLoadPercentage = (imagesWithLazyLoad / images.length) * 100;
    if (lazyLoadPercentage > 50) {
      this.addPassed('大部分图片启用了懒加载');
    } else {
      this.addWarning('建议为更多图片启用懒加载');
    }
  }

  /**
   * 验证链接
   */
  validateLinks() {
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    const rule = this.validationRules.links;
    
    if (internalLinks.length < rule.internalMinCount) {
      this.addWarning(`内部链接数量较少: ${internalLinks.length}个 (建议至少${rule.internalMinCount}个)`);
    } else {
      this.addPassed('内部链接数量充足');
    }
    
    let externalLinksWithoutRel = 0;
    externalLinks.forEach(link => {
      if (!link.hasAttribute('rel')) {
        externalLinksWithoutRel++;
      }
    });
    
    if (externalLinksWithoutRel === 0) {
      this.addPassed('所有外部链接都有rel属性');
    } else {
      this.addWarning(`${externalLinksWithoutRel}个外部链接缺少rel属性`);
    }
  }

  /**
   * 验证元标签
   */
  validateMetaTags() {
    const requiredMetaTags = [
      'viewport',
      'charset',
      'robots',
      'author'
    ];
    
    requiredMetaTags.forEach(tagName => {
      const meta = document.querySelector(`meta[name="${tagName}"], meta[charset], meta[name="viewport"]`);
      if (meta) {
        this.addPassed(`${tagName}元标签存在`);
      } else {
        this.addWarning(`缺少${tagName}元标签`);
      }
    });
  }

  /**
   * 验证结构化数据
   */
  validateStructuredData() {
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (structuredDataScripts.length === 0) {
      this.addWarning('页面缺少结构化数据');
      return;
    }
    
    let validStructuredData = 0;
    structuredDataScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@context'] && data['@type']) {
          validStructuredData++;
        }
      } catch (e) {
        this.addError('结构化数据格式错误');
      }
    });
    
    if (validStructuredData > 0) {
      this.addPassed(`${validStructuredData}个有效的结构化数据`);
    }
  }

  /**
   * 验证Open Graph
   */
  validateOpenGraph() {
    const requiredOGTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
    let missingTags = [];
    
    requiredOGTags.forEach(tagName => {
      const meta = document.querySelector(`meta[property="${tagName}"]`);
      if (!meta || !meta.content) {
        missingTags.push(tagName);
      }
    });
    
    if (missingTags.length === 0) {
      this.addPassed('Open Graph标签完整');
    } else {
      this.addWarning(`缺少Open Graph标签: ${missingTags.join(', ')}`);
    }
  }

  /**
   * 验证Twitter Card
   */
  validateTwitterCard() {
    const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    let missingTags = [];
    
    requiredTwitterTags.forEach(tagName => {
      const meta = document.querySelector(`meta[property="${tagName}"], meta[name="${tagName}"]`);
      if (!meta || !meta.content) {
        missingTags.push(tagName);
      }
    });
    
    if (missingTags.length === 0) {
      this.addPassed('Twitter Card标签完整');
    } else {
      this.addWarning(`缺少Twitter Card标签: ${missingTags.join(', ')}`);
    }
  }

  /**
   * 验证规范URL
   */
  validateCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    
    if (canonical && canonical.href) {
      this.addPassed('规范URL已设置');
    } else {
      this.addWarning('缺少规范URL');
    }
  }

  /**
   * 验证robots标签
   */
  validateRobots() {
    const robots = document.querySelector('meta[name="robots"]');
    
    if (robots && robots.content) {
      if (robots.content.includes('noindex')) {
        this.addWarning('页面设置为不索引');
      } else {
        this.addPassed('robots标签配置正确');
      }
    } else {
      this.addWarning('缺少robots标签');
    }
  }

  /**
   * 验证性能
   */
  async validatePerformance() {
    if (!window.performance) {
      this.addWarning('浏览器不支持性能API');
      return;
    }
    
    const rule = this.validationRules.performance;
    
    // 页面加载时间
    const loadTime = performance.now();
    if (loadTime <= rule.maxLoadTime) {
      this.addPassed('页面加载时间良好');
    } else {
      this.addWarning(`页面加载时间过长: ${Math.round(loadTime)}ms`);
    }
    
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry.startTime <= rule.maxLCP) {
            this.addPassed('LCP性能良好');
          } else {
            this.addWarning(`LCP性能需要优化: ${Math.round(lastEntry.startTime)}ms`);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.processingStart - entry.startTime <= rule.maxFID) {
              this.addPassed('FID性能良好');
            } else {
              this.addWarning(`FID性能需要优化: ${Math.round(entry.processingStart - entry.startTime)}ms`);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          if (clsValue <= rule.maxCLS) {
            this.addPassed('CLS性能良好');
          } else {
            this.addWarning(`CLS性能需要优化: ${clsValue.toFixed(3)}`);
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
      } catch (e) {
        this.addWarning('无法获取Core Web Vitals数据');
      }
    }
  }

  /**
   * 验证可访问性
   */
  validateAccessibility() {
    // 检查语言属性
    if (document.documentElement.lang) {
      this.addPassed('页面设置了语言属性');
    } else {
      this.addWarning('页面缺少语言属性');
    }
    
    // 检查跳转链接
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    if (skipLinks.length > 0) {
      this.addPassed('页面有跳转链接');
    } else {
      this.addWarning('建议添加跳转链接以提高可访问性');
    }
    
    // 检查表单标签
    const inputs = document.querySelectorAll('input, textarea, select');
    let inputsWithoutLabels = 0;
    
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledby) {
        inputsWithoutLabels++;
      }
    });
    
    if (inputsWithoutLabels === 0) {
      this.addPassed('所有表单元素都有标签');
    } else {
      this.addWarning(`${inputsWithoutLabels}个表单元素缺少标签`);
    }
  }

  /**
   * 验证移动端优化
   */
  validateMobile() {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (viewport && viewport.content.includes('width=device-width')) {
      this.addPassed('页面设置了移动端视口');
    } else {
      this.addError('页面缺少移动端视口设置');
    }
    
    // 检查触摸友好的按钮尺寸
    const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    let smallButtons = 0;
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallButtons++;
      }
    });
    
    if (smallButtons === 0) {
      this.addPassed('所有按钮都符合触摸友好尺寸');
    } else {
      this.addWarning(`${smallButtons}个按钮尺寸过小，不利于触摸操作`);
    }
  }

  /**
   * 添加通过项
   */
  addPassed(message) {
    this.validationResults.passed.push(message);
  }

  /**
   * 添加警告项
   */
  addWarning(message) {
    this.validationResults.warnings.push(message);
  }

  /**
   * 添加错误项
   */
  addError(message) {
    this.validationResults.errors.push(message);
  }

  /**
   * 计算SEO分数
   */
  calculateScore() {
    const totalChecks = this.validationResults.passed.length + 
                       this.validationResults.warnings.length + 
                       this.validationResults.errors.length;
    
    if (totalChecks === 0) {
      this.validationResults.score = 0;
      return;
    }
    
    const passedWeight = 1;
    const warningWeight = 0.5;
    const errorWeight = 0;
    
    const weightedScore = (this.validationResults.passed.length * passedWeight + 
                          this.validationResults.warnings.length * warningWeight + 
                          this.validationResults.errors.length * errorWeight) / totalChecks;
    
    this.validationResults.score = Math.round(weightedScore * 100);
  }

  /**
   * 生成验证报告
   */
  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      score: this.validationResults.score,
      summary: {
        passed: this.validationResults.passed.length,
        warnings: this.validationResults.warnings.length,
        errors: this.validationResults.errors.length
      },
      details: {
        passed: this.validationResults.passed,
        warnings: this.validationResults.warnings,
        errors: this.validationResults.errors
      },
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * 生成改进建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.validationResults.errors.length > 0) {
      recommendations.push('优先修复所有错误项，这些会严重影响SEO效果');
    }
    
    if (this.validationResults.warnings.length > 5) {
      recommendations.push('建议逐步解决警告项，以进一步提升SEO表现');
    }
    
    if (this.validationResults.score < 80) {
      recommendations.push('SEO分数偏低，建议全面优化页面SEO设置');
    } else if (this.validationResults.score < 90) {
      recommendations.push('SEO表现良好，可以进一步优化细节');
    } else {
      recommendations.push('SEO表现优秀，继续保持');
    }
    
    return recommendations;
  }

  /**
   * 导出验证报告
   */
  exportReport(format = 'json') {
    const report = this.generateReport();
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    return report;
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOValidator;
} else {
  window.SEOValidator = SEOValidator;
}