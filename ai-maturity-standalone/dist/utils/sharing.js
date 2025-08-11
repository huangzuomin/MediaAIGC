// Comprehensive Sharing Utilities for Social Media Integration
const SharingUtils = {
  // Platform configurations
  platforms: {
    wechat: {
      name: '微信',
      icon: '💬',
      color: '#07C160',
      supportsNativeShare: true,
      requiresApp: true
    },
    weibo: {
      name: '微博',
      icon: '🔥',
      color: '#E6162D',
      shareUrl: 'https://service.weibo.com/share/share.php',
      supportsNativeShare: false
    },
    qq: {
      name: 'QQ',
      icon: '🐧',
      color: '#12B7F5',
      shareUrl: 'https://connect.qq.com/widget/shareqq/index.html',
      supportsNativeShare: false
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
      supportsNativeShare: false
    },
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: '#1DA1F2',
      shareUrl: 'https://twitter.com/intent/tweet',
      supportsNativeShare: false
    },
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      shareUrl: 'https://www.facebook.com/sharer/sharer.php',
      supportsNativeShare: false
    }
  },

  // Generate personalized share content
  generateShareContent: function(result, options = {}) {
    const {
      includeScore = true,
      includeLevel = true,
      includeBenchmark = false,
      customMessage = '',
      platform = 'generic'
    } = options;

    let content = customMessage || this.getRandomShareTemplate(result);
    
    // Platform-specific optimizations
    switch (platform) {
      case 'weibo':
        content += this.getWeiboHashtags();
        break;
      case 'twitter':
        content += this.getTwitterHashtags();
        break;
      case 'linkedin':
        content = this.getLinkedInFormat(result);
        break;
      case 'wechat':
        content = this.getWeChatFormat(result);
        break;
    }

    return {
      text: content,
      title: this.generateTitle(result),
      description: this.generateDescription(result),
      hashtags: this.getHashtags(platform)
    };
  },

  // Random share templates for variety
  getRandomShareTemplate: function(result) {
    const templates = [
      `我刚完成了媒体AI成熟度自测，结果是${result.levelName}(${result.level})！综合得分${result.score}/5.0，这个专业测试很有价值，推荐你也来试试！`,
      `刚做了一个AI成熟度评估，我们机构达到了${result.levelName}水平！测试很专业，还给出了个性化的转型建议，值得一试！`,
      `分享一个不错的AI成熟度自测工具！我的结果是${result.level}级别，测试只需5分钟，但分析很深入，推荐给同行们！`,
      `刚用了一个媒体AI转型评估工具，我们是${result.levelName}，得到了很多实用的改进建议。免费的，推荐试试！`,
      `完成了AI成熟度测试，结果${result.level}级${result.levelName}！这个工具帮我们清晰了解了AI应用现状，很实用！`,
      `推荐一个专业的AI成熟度评估！我们达到了${result.levelName}，获得了详细的分析报告和改进建议。同行们可以试试！`
    ];

    const index = Math.floor(Math.random() * templates.length);
    return templates[index];
  },

  // Platform-specific formatting
  getWeiboHashtags: function() {
    return ' #AI成熟度自测# #媒体AI转型# #智媒变革# #数字化转型#';
  },

  getTwitterHashtags: function() {
    return ' #AIMaturity #MediaTransformation #DigitalTransformation #AI';
  },

  getWeChatFormat: function(result) {
    return `🎯 AI成熟度自测结果出炉！

📊 等级：${result.levelName} (${result.level})
⭐ 得分：${result.score}/5.0
📈 超过行业${result.industryBenchmark?.percentile || 50}%的机构

这个5分钟测试很专业，分析很详细，还有个性化建议。推荐同行们也来测测！

👆 点击链接开始测试`;
  },

  getLinkedInFormat: function(result) {
    return `刚完成了一个专业的媒体AI成熟度评估，结果很有启发！

我们机构的AI应用水平达到了"${result.levelName}"(${result.level}级)，综合得分${result.score}/5.0。

这个评估工具从技术应用、数据管理、流程融合等10个维度进行分析，不仅给出了客观的评分，还提供了个性化的改进建议。

对于正在推进数字化转型的媒体机构来说，这样的自我评估很有价值。推荐同行们也来试试！

#数字化转型 #AI应用 #媒体创新`;
  },

  // Generate share title
  generateTitle: function(result) {
    return `我的AI成熟度是${result.levelName}(${result.level}) | 你也来测测吧`;
  },

  // Generate share description
  generateDescription: function(result) {
    return `专业的媒体AI成熟度自测工具，5分钟快速评估，获得个性化转型建议。我的结果是${result.levelName}，你的呢？`;
  },

  // Get platform-specific hashtags
  getHashtags: function(platform) {
    const hashtagMap = {
      weibo: ['AI成熟度自测', '媒体AI转型', '智媒变革', '数字化转型'],
      twitter: ['AIMaturity', 'MediaTransformation', 'DigitalTransformation', 'AI'],
      linkedin: ['数字化转型', 'AI应用', '媒体创新', '智能媒体'],
      generic: ['AI成熟度', '媒体转型', '数字化']
    };

    return hashtagMap[platform] || hashtagMap.generic;
  },

  // Share to specific platforms
  shareToWeibo: function(content, url) {
    const shareContent = encodeURIComponent(content.text);
    const shareUrl = encodeURIComponent(url);
    const weiboUrl = `${this.platforms.weibo.shareUrl}?url=${shareUrl}&title=${shareContent}`;
    
    this.openShareWindow(weiboUrl, 'weibo');
    this.trackShare('weibo', 'web');
  },

  shareToQQ: function(content, url) {
    const title = encodeURIComponent(content.title);
    const summary = encodeURIComponent(content.text);
    const shareUrl = encodeURIComponent(url);
    const qqUrl = `${this.platforms.qq.shareUrl}?url=${shareUrl}&title=${title}&summary=${summary}`;
    
    this.openShareWindow(qqUrl, 'qq');
    this.trackShare('qq', 'web');
  },

  shareToLinkedIn: function(content, url) {
    const shareUrl = encodeURIComponent(url);
    const linkedInUrl = `${this.platforms.linkedin.shareUrl}?url=${shareUrl}`;
    
    this.openShareWindow(linkedInUrl, 'linkedin');
    this.trackShare('linkedin', 'web');
  },

  shareToTwitter: function(content, url) {
    const text = encodeURIComponent(content.text);
    const shareUrl = encodeURIComponent(url);
    const twitterUrl = `${this.platforms.twitter.shareUrl}?text=${text}&url=${shareUrl}`;
    
    this.openShareWindow(twitterUrl, 'twitter');
    this.trackShare('twitter', 'web');
  },

  shareToFacebook: function(content, url) {
    const shareUrl = encodeURIComponent(url);
    const facebookUrl = `${this.platforms.facebook.shareUrl}?u=${shareUrl}`;
    
    this.openShareWindow(facebookUrl, 'facebook');
    this.trackShare('facebook', 'web');
  },

  // Native sharing (mobile)
  shareNative: function(content, url) {
    if (navigator.share) {
      return navigator.share({
        title: content.title,
        text: content.text,
        url: url
      }).then(() => {
        this.trackShare('native', 'mobile');
        return true;
      }).catch(err => {
        console.log('Native sharing failed:', err);
        return false;
      });
    }
    return Promise.resolve(false);
  },

  // Copy to clipboard
  copyToClipboard: function(content, url) {
    const textToCopy = `${content.text}\n\n${url}`;
    
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(textToCopy).then(() => {
        this.trackShare('clipboard', 'copy');
        return true;
      }).catch(() => {
        return this.fallbackCopy(textToCopy);
      });
    } else {
      return this.fallbackCopy(textToCopy);
    }
  },

  // Fallback copy method
  fallbackCopy: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (success) {
        this.trackShare('clipboard', 'fallback');
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (err) {
      document.body.removeChild(textarea);
      return Promise.resolve(false);
    }
  },

  // Open share window
  openShareWindow: function(url, platform) {
    const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
    const windowName = `share_${platform}_${Date.now()}`;
    
    window.open(url, windowName, windowFeatures);
  },

  // Generate share image
  generateShareImage: function(result, options = {}) {
    const {
      width = 1200,
      height = 630,
      format = 'jpeg',
      quality = 0.9
    } = options;

    return new Promise((resolve, reject) => {
      // Create canvas for image generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f0f9ff');
      gradient.addColorStop(1, '#e0e7ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Brand colors
      const primaryColor = '#003366';
      const accentColor = '#D4AF37';

      // Title
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('媒体AI成熟度自测结果', width / 2, 120);

      // Level badge
      const badgeSize = 120;
      const badgeX = width / 2 - badgeSize / 2;
      const badgeY = 180;
      
      ctx.fillStyle = result.color || primaryColor;
      ctx.beginPath();
      ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(result.level, badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 12);

      // Level name
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(result.levelName, width / 2, 360);

      // Score
      ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`综合得分: ${result.score}/5.0`, width / 2, 400);

      // Benchmark
      if (result.industryBenchmark) {
        ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(result.industryBenchmark.description, width / 2, 440);
      }

      // QR Code placeholder (in production, generate actual QR code)
      const qrSize = 100;
      const qrX = width - qrSize - 40;
      const qrY = height - qrSize - 40;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#cccccc';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      
      ctx.fillStyle = '#666666';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('扫码测试', qrX + qrSize / 2, qrY + qrSize + 20);

      // Brand info
      ctx.fillStyle = primaryColor;
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('温州新闻网·智媒变革中心', 40, height - 40);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to generate image'));
        }
      }, `image/${format}`, quality);
    });
  },

  // Download generated image
  downloadImage: function(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || `AI成熟度测试结果-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
  },

  // Track sharing events
  trackShare: function(platform, method, additionalData = {}) {
    if (window.Analytics) {
      window.Analytics.trackCustomEvent('share_action', {
        platform: platform,
        method: method,
        timestamp: new Date().toISOString(),
        ...additionalData
      });
    }
  },

  // Get available platforms based on device
  getAvailablePlatforms: function(isMobile = false) {
    const allPlatforms = Object.keys(this.platforms);
    
    if (isMobile) {
      // Prioritize mobile-friendly platforms
      return ['wechat', 'weibo', 'qq', 'twitter', 'linkedin'];
    } else {
      // Desktop platforms
      return ['weibo', 'linkedin', 'twitter', 'facebook', 'qq'];
    }
  },

  // Check if platform is available
  isPlatformAvailable: function(platform) {
    return platform in this.platforms;
  },

  // Get platform info
  getPlatformInfo: function(platform) {
    return this.platforms[platform] || null;
  },

  // Universal share function
  share: function(platform, result, url, options = {}) {
    const content = this.generateShareContent(result, { 
      platform, 
      ...options 
    });

    switch (platform) {
      case 'wechat':
        if (navigator.share && options.isMobile) {
          return this.shareNative(content, url);
        } else {
          return this.copyToClipboard(content, url);
        }
      case 'weibo':
        this.shareToWeibo(content, url);
        return Promise.resolve(true);
      case 'qq':
        this.shareToQQ(content, url);
        return Promise.resolve(true);
      case 'linkedin':
        this.shareToLinkedIn(content, url);
        return Promise.resolve(true);
      case 'twitter':
        this.shareToTwitter(content, url);
        return Promise.resolve(true);
      case 'facebook':
        this.shareToFacebook(content, url);
        return Promise.resolve(true);
      case 'native':
        return this.shareNative(content, url);
      case 'copy':
        return this.copyToClipboard(content, url);
      default:
        return Promise.resolve(false);
    }
  }
};

// Export for global use
window.SharingUtils = SharingUtils;