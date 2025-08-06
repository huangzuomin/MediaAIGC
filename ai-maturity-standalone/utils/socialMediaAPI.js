// Social Media API Integration for Enhanced Sharing
const SocialMediaAPI = {
  // API endpoints and configurations
  apis: {
    weibo: {
      shareUrl: 'https://service.weibo.com/share/share.php',
      apiUrl: 'https://api.weibo.com/2/',
      requiresAuth: false
    },
    wechat: {
      // WeChat sharing is handled through native mobile sharing or QR codes
      requiresApp: true,
      supportsWebShare: false
    },
    qq: {
      shareUrl: 'https://connect.qq.com/widget/shareqq/index.html',
      requiresAuth: false
    },
    linkedin: {
      shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
      apiUrl: 'https://api.linkedin.com/v2/',
      requiresAuth: false
    },
    twitter: {
      shareUrl: 'https://twitter.com/intent/tweet',
      apiUrl: 'https://api.twitter.com/2/',
      requiresAuth: false
    }
  },

  // Generate optimized share URLs
  generateShareUrl: function(platform, content, url, options = {}) {
    const api = this.apis[platform];
    if (!api || !api.shareUrl) return null;

    const params = new URLSearchParams();
    
    switch (platform) {
      case 'weibo':
        params.append('url', url);
        params.append('title', content.text);
        if (content.hashtags) {
          const hashtagText = content.hashtags.map(tag => `#${tag}#`).join(' ');
          params.append('title', `${content.text} ${hashtagText}`);
        }
        break;
        
      case 'qq':
        params.append('url', url);
        params.append('title', content.title || '媒体AI成熟度自测结果');
        params.append('summary', content.text);
        params.append('pics', options.imageUrl || '');
        break;
        
      case 'linkedin':
        params.append('url', url);
        params.append('mini', 'true');
        break;
        
      case 'twitter':
        params.append('text', content.text);
        params.append('url', url);
        if (content.hashtags) {
          params.append('hashtags', content.hashtags.join(','));
        }
        break;
        
      default:
        return null;
    }

    return `${api.shareUrl}?${params.toString()}`;
  },

  // Create platform-specific share content
  createPlatformContent: function(platform, result, baseContent) {
    const platformContent = { ...baseContent };
    
    switch (platform) {
      case 'weibo':
        platformContent.text = this.optimizeForWeibo(result, baseContent.text);
        platformContent.hashtags = ['AI成熟度自测', '媒体AI转型', '智媒变革', '数字化转型'];
        break;
        
      case 'wechat':
        platformContent.text = this.optimizeForWeChat(result, baseContent.text);
        break;
        
      case 'linkedin':
        platformContent.text = this.optimizeForLinkedIn(result, baseContent.text);
        break;
        
      case 'twitter':
        platformContent.text = this.optimizeForTwitter(result, baseContent.text);
        platformContent.hashtags = ['AIMaturity', 'MediaTransformation', 'DigitalTransformation'];
        break;
    }

    return platformContent;
  },

  // Platform-specific content optimization
  optimizeForWeibo: function(result, baseText) {
    const weiboText = `🎯 刚完成媒体AI成熟度自测！

📊 我的结果：${result.levelName} (${result.level}级)
⭐ 综合得分：${result.score}/5.0
📈 超过行业${result.industryBenchmark?.percentile || 50}%的机构

这个专业测试只需5分钟，分析很详细，还有个性化建议！推荐同行们也来测测👇`;

    return weiboText;
  },

  optimizeForWeChat: function(result, baseText) {
    return `🎯 AI成熟度自测结果出炉！

📊 等级：${result.levelName} (${result.level})
⭐ 得分：${result.score}/5.0
📈 超过行业${result.industryBenchmark?.percentile || 50}%的机构

这个5分钟测试很专业，分析很详细，还有个性化建议。推荐同行们也来测测！

👆 点击链接开始测试`;
  },

  optimizeForLinkedIn: function(result, baseText) {
    return `刚完成了一个专业的媒体AI成熟度评估，结果很有启发！

我们机构的AI应用水平达到了"${result.levelName}"(${result.level}级)，综合得分${result.score}/5.0。

这个评估工具从技术应用、数据管理、流程融合等10个维度进行分析，不仅给出了客观的评分，还提供了个性化的改进建议。

对于正在推进数字化转型的媒体机构来说，这样的自我评估很有价值。推荐同行们也来试试！`;
  },

  optimizeForTwitter: function(result, baseText) {
    const twitterText = `Just completed an AI maturity assessment for media organizations! 

📊 Result: ${result.levelName} (Level ${result.level})
⭐ Score: ${result.score}/5.0

Great tool for media digital transformation. Highly recommended! 🚀`;

    return twitterText;
  },

  // Generate QR code for WeChat sharing
  generateQRCode: function(url, options = {}) {
    const {
      size = 200,
      errorCorrectionLevel = 'M',
      margin = 4
    } = options;

    // In a real implementation, this would use a QR code library
    // For now, we'll use a QR code service
    const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/`;
    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: url,
      ecc: errorCorrectionLevel,
      margin: margin,
      format: 'png'
    });

    return `${qrServiceUrl}?${params.toString()}`;
  },

  // Create shareable image with result
  createShareImage: function(result, options = {}) {
    const {
      width = 1200,
      height = 630,
      template = 'default',
      includeQR = true
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f0f9ff');
      gradient.addColorStop(1, '#e0e7ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Brand header
      ctx.fillStyle = '#003366';
      ctx.fillRect(0, 0, width, 80);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('温州新闻网·智媒变革中心', 40, 50);

      // Title
      ctx.fillStyle = '#003366';
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('媒体AI成熟度自测结果', width / 2, 160);

      // Result circle
      const centerX = width / 2;
      const centerY = 300;
      const radius = 80;

      ctx.fillStyle = result.color || '#003366';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(result.level, centerX, centerY + 15);

      // Level name
      ctx.fillStyle = '#003366';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(result.levelName, centerX, 420);

      // Score
      ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`综合得分: ${result.score}/5.0`, centerX, 460);

      // Benchmark
      if (result.industryBenchmark) {
        ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(`超过行业${result.industryBenchmark.percentile}%的机构`, centerX, 500);
      }

      // QR Code area
      if (includeQR) {
        const qrSize = 120;
        const qrX = width - qrSize - 40;
        const qrY = height - qrSize - 60;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        
        ctx.fillStyle = '#666666';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('扫码测试', qrX + qrSize / 2, qrY + qrSize + 25);
      }

      // Call to action
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(40, height - 100, width - 80, 60);
      
      ctx.fillStyle = '#003366';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('立即测试您的AI成熟度', width / 2, height - 65);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Failed to create share image'));
        }
      }, 'image/jpeg', 0.9);
    });
  },

  // Track sharing analytics
  trackShare: function(platform, method, result, additionalData = {}) {
    const shareData = {
      platform: platform,
      method: method,
      result_level: result.level,
      result_score: result.score,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ...additionalData
    };

    // Send to analytics
    if (window.Analytics) {
      window.Analytics.trackCustomEvent('social_share', shareData);
    }

    // Send to backend for aggregation (if available)
    this.sendShareAnalytics(shareData);
  },

  // Send share analytics to backend
  sendShareAnalytics: function(data) {
    // In a real implementation, this would send data to your analytics backend
    // For now, we'll just log it
    console.log('Share analytics:', data);
    
    // Could implement with fetch:
    // fetch('/api/analytics/share', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).catch(err => console.log('Analytics send failed:', err));
  },

  // Get sharing statistics
  getShareStats: function() {
    // This would typically fetch from your analytics backend
    return {
      totalShares: 0,
      platformBreakdown: {},
      topResults: [],
      shareGrowth: []
    };
  },

  // Validate share content
  validateShareContent: function(platform, content) {
    const limits = {
      weibo: { text: 140, title: 100 },
      twitter: { text: 280, title: 100 },
      linkedin: { text: 1300, title: 200 },
      wechat: { text: 500, title: 100 },
      qq: { text: 200, title: 100 }
    };

    const limit = limits[platform];
    if (!limit) return { valid: true };

    const issues = [];
    
    if (content.text && content.text.length > limit.text) {
      issues.push(`Text too long: ${content.text.length}/${limit.text} characters`);
    }
    
    if (content.title && content.title.length > limit.title) {
      issues.push(`Title too long: ${content.title.length}/${limit.title} characters`);
    }

    return {
      valid: issues.length === 0,
      issues: issues,
      limits: limit
    };
  },

  // Auto-optimize content for platform limits
  optimizeContentLength: function(platform, content) {
    const limits = this.validateShareContent(platform, { text: '', title: '' }).limits;
    if (!limits) return content;

    const optimized = { ...content };

    if (optimized.text && optimized.text.length > limits.text) {
      optimized.text = optimized.text.substring(0, limits.text - 3) + '...';
    }

    if (optimized.title && optimized.title.length > limits.title) {
      optimized.title = optimized.title.substring(0, limits.title - 3) + '...';
    }

    return optimized;
  }
};

// Export for global use
window.SocialMediaAPI = SocialMediaAPI;