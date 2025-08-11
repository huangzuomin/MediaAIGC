/**
 * 站点地图生成工具
 * 提供动态站点地图生成和管理功能
 */

class SitemapGenerator {
  constructor() {
    this.baseUrl = window.location.origin;
    this.urls = new Map();
    this.defaultPriority = 0.5;
    this.defaultChangefreq = 'monthly';
    
    this.init();
  }

  /**
   * 初始化站点地图生成器
   */
  init() {
    this.setupDefaultUrls();
    console.log('站点地图生成器初始化完成');
  }

  /**
   * 设置默认URL
   */
  setupDefaultUrls() {
    const defaultUrls = [
      {
        loc: '/',
        priority: 1.0,
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/features',
        priority: 0.9,
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/agents',
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/pricing',
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        priority: 0.7,
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/demo',
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    defaultUrls.forEach(url => {
      this.addUrl(url.loc, url.priority, url.changefreq, url.lastmod);
    });
  }

  /**
   * 添加URL到站点地图
   * @param {string} path - URL路径
   * @param {number} priority - 优先级 (0.0-1.0)
   * @param {string} changefreq - 更新频率
   * @param {string} lastmod - 最后修改时间
   * @param {Object} options - 额外选项
   */
  addUrl(path, priority = this.defaultPriority, changefreq = this.defaultChangefreq, lastmod = null, options = {}) {
    const url = {
      loc: this.baseUrl + (path.startsWith('/') ? path : '/' + path),
      priority: Math.max(0.0, Math.min(1.0, priority)),
      changefreq: this.validateChangefreq(changefreq),
      lastmod: lastmod || new Date().toISOString().split('T')[0],
      ...options
    };

    this.urls.set(path, url);
  }

  /**
   * 验证更新频率
   * @param {string} changefreq - 更新频率
   * @returns {string} 有效的更新频率
   */
  validateChangefreq(changefreq) {
    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    return validFreqs.includes(changefreq) ? changefreq : this.defaultChangefreq;
  }

  /**
   * 更新URL信息
   * @param {string} path - URL路径
   * @param {Object} updates - 更新内容
   */
  updateUrl(path, updates) {
    if (this.urls.has(path)) {
      const existingUrl = this.urls.get(path);
      const updatedUrl = { ...existingUrl, ...updates };
      
      // 验证更新的数据
      if (updates.priority !== undefined) {
        updatedUrl.priority = Math.max(0.0, Math.min(1.0, updates.priority));
      }
      
      if (updates.changefreq !== undefined) {
        updatedUrl.changefreq = this.validateChangefreq(updates.changefreq);
      }
      
      this.urls.set(path, updatedUrl);
    }
  }

  /**
   * 删除URL
   * @param {string} path - URL路径
   */
  removeUrl(path) {
    this.urls.delete(path);
  }

  /**
   * 批量添加URL
   * @param {Array} urlList - URL列表
   */
  addUrls(urlList) {
    urlList.forEach(url => {
      this.addUrl(url.path, url.priority, url.changefreq, url.lastmod, url.options);
    });
  }

  /**
   * 自动发现页面URL
   */
  discoverUrls() {
    const links = document.querySelectorAll('a[href]');
    const discoveredUrls = new Set();

    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // 只处理内部链接
      if (href && (href.startsWith('/') || href.startsWith('./') || href.startsWith('../'))) {
        let path = href;
        
        // 标准化路径
        if (path.startsWith('./')) {
          path = path.substring(2);
        } else if (path.startsWith('../')) {
          // 简单处理，实际应用中需要更复杂的路径解析
          path = path.substring(3);
        }
        
        // 移除锚点和查询参数
        path = path.split('#')[0].split('?')[0];
        
        if (path && !this.urls.has(path)) {
          discoveredUrls.add(path);
        }
      }
    });

    // 添加发现的URL
    discoveredUrls.forEach(path => {
      this.addUrl(path, 0.5, 'monthly');
    });

    console.log(`发现并添加了 ${discoveredUrls.size} 个新URL`);
  }

  /**
   * 生成XML站点地图
   * @returns {string} XML格式的站点地图
   */
  generateXML() {
    const urlEntries = Array.from(this.urls.values())
      .sort((a, b) => b.priority - a.priority) // 按优先级排序
      .map(url => this.generateUrlXML(url))
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;

    return xml;
  }

  /**
   * 生成单个URL的XML
   * @param {Object} url - URL对象
   * @returns {string} URL的XML表示
   */
  generateUrlXML(url) {
    let xml = `  <url>
    <loc>${this.escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>`;

    // 添加额外的属性
    if (url.images && url.images.length > 0) {
      url.images.forEach(image => {
        xml += `
    <image:image>
      <image:loc>${this.escapeXML(image.loc)}</image:loc>
      <image:title>${this.escapeXML(image.title || '')}</image:title>
      <image:caption>${this.escapeXML(image.caption || '')}</image:caption>
    </image:image>`;
      });
    }

    if (url.videos && url.videos.length > 0) {
      url.videos.forEach(video => {
        xml += `
    <video:video>
      <video:thumbnail_loc>${this.escapeXML(video.thumbnail)}</video:thumbnail_loc>
      <video:title>${this.escapeXML(video.title)}</video:title>
      <video:description>${this.escapeXML(video.description)}</video:description>
      <video:content_loc>${this.escapeXML(video.content)}</video:content_loc>
    </video:video>`;
      });
    }

    xml += `
  </url>`;

    return xml;
  }

  /**
   * 转义XML特殊字符
   * @param {string} str - 需要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeXML(str) {
    if (!str) return '';
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * 生成JSON格式的站点地图
   * @returns {Object} JSON格式的站点地图
   */
  generateJSON() {
    return {
      version: '1.0',
      generated: new Date().toISOString(),
      baseUrl: this.baseUrl,
      urls: Array.from(this.urls.values())
    };
  }

  /**
   * 生成robots.txt内容
   * @param {Object} options - 配置选项
   * @returns {string} robots.txt内容
   */
  generateRobotsTxt(options = {}) {
    const {
      userAgent = '*',
      allow = ['/'],
      disallow = ['/admin/', '/private/', '/temp/', '/*.json$', '/*.log$'],
      crawlDelay = 1,
      sitemapUrl = `${this.baseUrl}/sitemap.xml`,
      additionalRules = []
    } = options;

    let robotsTxt = `User-agent: ${userAgent}\n`;
    
    allow.forEach(path => {
      robotsTxt += `Allow: ${path}\n`;
    });
    
    disallow.forEach(path => {
      robotsTxt += `Disallow: ${path}\n`;
    });
    
    robotsTxt += `\n# 站点地图\nSitemap: ${sitemapUrl}\n`;
    robotsTxt += `\n# 爬取延迟\nCrawl-delay: ${crawlDelay}\n`;
    
    // 添加额外规则
    if (additionalRules.length > 0) {
      robotsTxt += '\n# 额外规则\n';
      additionalRules.forEach(rule => {
        robotsTxt += `${rule}\n`;
      });
    }

    return robotsTxt;
  }

  /**
   * 验证站点地图
   * @returns {Object} 验证结果
   */
  validateSitemap() {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      stats: {
        totalUrls: this.urls.size,
        highPriorityUrls: 0,
        recentlyUpdated: 0
      }
    };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.urls.forEach((url, path) => {
      // 检查URL格式
      try {
        new URL(url.loc);
      } catch (e) {
        validation.valid = false;
        validation.errors.push(`无效的URL格式: ${url.loc}`);
      }

      // 统计高优先级URL
      if (url.priority >= 0.8) {
        validation.stats.highPriorityUrls++;
      }

      // 统计最近更新的URL
      const lastmod = new Date(url.lastmod);
      if (lastmod >= thirtyDaysAgo) {
        validation.stats.recentlyUpdated++;
      }

      // 检查优先级
      if (url.priority < 0 || url.priority > 1) {
        validation.warnings.push(`URL ${path} 的优先级超出范围: ${url.priority}`);
      }

      // 检查更新频率
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (!validFreqs.includes(url.changefreq)) {
        validation.warnings.push(`URL ${path} 的更新频率无效: ${url.changefreq}`);
      }
    });

    // 检查URL数量
    if (this.urls.size > 50000) {
      validation.warnings.push(`URL数量过多: ${this.urls.size} (建议少于50000)`);
    }

    // 检查是否有首页
    if (!this.urls.has('/')) {
      validation.warnings.push('缺少首页URL');
    }

    return validation;
  }

  /**
   * 导出站点地图文件
   * @param {string} format - 导出格式 ('xml' 或 'json')
   */
  exportSitemap(format = 'xml') {
    let content, filename, mimeType;

    if (format === 'xml') {
      content = this.generateXML();
      filename = 'sitemap.xml';
      mimeType = 'application/xml';
    } else if (format === 'json') {
      content = JSON.stringify(this.generateJSON(), null, 2);
      filename = 'sitemap.json';
      mimeType = 'application/json';
    } else {
      throw new Error('不支持的导出格式');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 提交站点地图到搜索引擎
   * @param {Array} searchEngines - 搜索引擎列表
   */
  async submitToSearchEngines(searchEngines = ['google', 'bing']) {
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    const results = {};

    for (const engine of searchEngines) {
      try {
        let submitUrl;
        
        switch (engine) {
          case 'google':
            submitUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
            break;
          case 'bing':
            submitUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
            break;
          case 'baidu':
            submitUrl = `https://data.zz.baidu.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
            break;
          default:
            throw new Error(`不支持的搜索引擎: ${engine}`);
        }

        // 注意：实际提交需要服务器端支持，这里只是示例
        console.log(`提交站点地图到 ${engine}: ${submitUrl}`);
        results[engine] = { success: true, url: submitUrl };
        
      } catch (error) {
        results[engine] = { success: false, error: error.message };
      }
    }

    return results;
  }

  /**
   * 获取站点地图统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const stats = {
      totalUrls: this.urls.size,
      priorityDistribution: { high: 0, medium: 0, low: 0 },
      changefreqDistribution: {},
      lastModified: null,
      oldestUrl: null
    };

    let newestDate = new Date(0);
    let oldestDate = new Date();

    this.urls.forEach(url => {
      // 优先级分布
      if (url.priority >= 0.8) {
        stats.priorityDistribution.high++;
      } else if (url.priority >= 0.5) {
        stats.priorityDistribution.medium++;
      } else {
        stats.priorityDistribution.low++;
      }

      // 更新频率分布
      stats.changefreqDistribution[url.changefreq] = 
        (stats.changefreqDistribution[url.changefreq] || 0) + 1;

      // 最新和最旧的修改时间
      const lastmod = new Date(url.lastmod);
      if (lastmod > newestDate) {
        newestDate = lastmod;
        stats.lastModified = url.lastmod;
      }
      if (lastmod < oldestDate) {
        oldestDate = lastmod;
        stats.oldestUrl = url.lastmod;
      }
    });

    return stats;
  }

  /**
   * 清空站点地图
   */
  clear() {
    this.urls.clear();
  }

  /**
   * 重置为默认URL
   */
  reset() {
    this.clear();
    this.setupDefaultUrls();
  }

  /**
   * 销毁站点地图生成器
   */
  destroy() {
    this.clear();
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SitemapGenerator;
} else {
  window.SitemapGenerator = SitemapGenerator;
}