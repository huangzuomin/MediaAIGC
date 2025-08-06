// Enhanced Share Modal Component with Multi-platform Support
function ShareModal({ isOpen, onClose, result, shareUrl, isMobile = false }) {
  const [shareText, setShareText] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState(null);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [modalVariant, setModalVariant] = React.useState('comprehensive');

  // Initialize A/B testing and generate personalized share text
  React.useEffect(() => {
    if (result) {
      // Get A/B test variant for share modal
      if (window.ABTesting && window.ABTesting.state.initialized) {
        const assignedVariant = window.ABTesting.getVariant('share_modal');
        const variantConfig = window.ABTesting.getVariantConfig('share_modal', assignedVariant);
        
        if (assignedVariant && variantConfig) {
          setModalVariant(variantConfig.style || 'comprehensive');
          
          // Track A/B test participation
          window.ABTesting.trackInteraction('share_modal', 'modal_opened', {
            result_level: result.level,
            result_score: result.score,
            variant_config: variantConfig
          });
        }
      }
      
      const personalizedText = generateShareText(result);
      setShareText(personalizedText);
    }
  }, [result]);

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const generateShareText = (result) => {
    const templates = [
      `我刚完成了媒体AI成熟度自测，结果是${result.levelName}(${result.level})！综合得分${result.score}/5.0，这个专业测试很有价值，推荐你也来试试！`,
      `刚做了一个AI成熟度评估，我们机构达到了${result.levelName}水平！测试很专业，还给出了个性化的转型建议，值得一试！`,
      `分享一个不错的AI成熟度自测工具！我的结果是${result.level}级别，测试只需5分钟，但分析很深入，推荐给同行们！`,
      `刚用了一个媒体AI转型评估工具，我们是${result.levelName}，得到了很多实用的改进建议。免费的，推荐试试！`
    ];

    // Select template based on result level for variety
    const templateIndex = ['L1', 'L2', 'L3', 'L4', 'L5'].indexOf(result.level) % templates.length;
    return templates[templateIndex];
  };

  const shareToWeChat = () => {
    setSelectedPlatform('wechat');
    
    // WeChat sharing (mobile)
    if (isMobile && navigator.share) {
      navigator.share({
        title: '媒体AI成熟度自测结果',
        text: shareText,
        url: shareUrl
      }).then(() => {
        trackShare('wechat', 'native');
        onClose();
      }).catch(err => {
        console.log('WeChat sharing failed:', err);
        copyToClipboard();
      });
    } else {
      // Fallback: copy to clipboard with WeChat-optimized format
      const wechatText = `${shareText}\n\n🔗 ${shareUrl}\n\n#AI成熟度自测 #媒体转型 #智媒变革`;
      copyToClipboard(wechatText, 'wechat');
    }
  };

  const shareToWeibo = () => {
    setSelectedPlatform('weibo');
    
    const weiboText = encodeURIComponent(`${shareText} ${shareUrl} #AI成熟度自测# #媒体AI转型# #智媒变革#`);
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${weiboText}`;
    
    window.open(weiboUrl, '_blank', 'width=600,height=400');
    trackShare('weibo', 'web');
  };

  const shareToQQ = () => {
    setSelectedPlatform('qq');
    
    const qqTitle = encodeURIComponent('媒体AI成熟度自测结果');
    const qqSummary = encodeURIComponent(shareText);
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${qqTitle}&summary=${qqSummary}`;
    
    window.open(qqUrl, '_blank', 'width=600,height=400');
    trackShare('qq', 'web');
  };

  const shareToLinkedIn = () => {
    setSelectedPlatform('linkedin');
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
    trackShare('linkedin', 'web');
  };

  const shareToTwitter = () => {
    setSelectedPlatform('twitter');
    
    const twitterText = encodeURIComponent(`${shareText} #AIMaturity #MediaTransformation`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    trackShare('twitter', 'web');
  };

  const copyToClipboard = (customText = null, platform = 'clipboard') => {
    const textToCopy = customText || `${shareText}\n\n${shareUrl}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopySuccess(true);
        trackShare(platform, 'copy');
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(() => {
        fallbackCopy(textToCopy, platform);
      });
    } else {
      fallbackCopy(textToCopy, platform);
    }
  };

  const fallbackCopy = (text, platform) => {
    // Create temporary textarea for copying
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      trackShare(platform, 'copy');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      // Show manual copy dialog
      prompt('请手动复制以下内容：', text);
    }
    
    document.body.removeChild(textarea);
  };

  const generateShareImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      // This would integrate with a service to generate share images
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate an image with:
      // - Result level and score
      // - Branded design
      // - QR code to the assessment
      
      const imageUrl = await createShareImage(result);
      downloadImage(imageUrl);
      
      trackShare('image', 'generate');
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('图片生成失败，请稍后重试');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const createShareImage = async (result) => {
    // Simulate image generation
    // In production, this would call an API or use canvas to generate the image
    return '/assets/share-image-placeholder.jpg';
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `AI成熟度测试结果-${result.level}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const trackShare = (platform, method) => {
    // Track A/B test conversion
    if (window.ABTesting && window.ABTesting.state.initialized) {
      window.ABTesting.trackConversion('share_modal', 'share_completed', {
        platform: platform,
        method: method,
        result_level: result.level,
        result_score: result.score,
        modal_variant: modalVariant,
        share_text_length: shareText.length
      });
    }
    
    if (window.Analytics) {
      window.Analytics.trackCustomEvent('share_action', {
        platform: platform,
        method: method,
        result_level: result.level,
        result_score: result.score,
        share_text_length: shareText.length,
        modal_variant: modalVariant,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Mobile optimized render
  if (isMobile) {
    return (
      <div className="share-modal-overlay" onClick={onClose}>
        <div className="mobile-share-modal" onClick={e => e.stopPropagation()}>
          <div className="mobile-share-header">
            <h3 className="mobile-share-title">分享测试结果</h3>
            <button className="mobile-share-close" onClick={onClose}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mobile-share-content">
            <div className="share-preview">
              <div className="share-result-badge">
                <span className="share-level" style={{ backgroundColor: result.color }}>
                  {result.level}
                </span>
                <div className="share-result-info">
                  <div className="share-level-name">{result.levelName}</div>
                  <div className="share-score">得分: {result.score}/5.0</div>
                </div>
              </div>
            </div>

            <div className="share-text-preview">
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="share-text-input"
                placeholder="编辑分享文案..."
                rows={3}
              />
            </div>

            <div className="mobile-share-platforms">
              <button className="share-platform-btn wechat" onClick={shareToWeChat}>
                <div className="platform-icon">💬</div>
                <span>微信</span>
              </button>
              
              <button className="share-platform-btn weibo" onClick={shareToWeibo}>
                <div className="platform-icon">🔥</div>
                <span>微博</span>
              </button>
              
              <button className="share-platform-btn qq" onClick={shareToQQ}>
                <div className="platform-icon">🐧</div>
                <span>QQ</span>
              </button>
              
              <button className="share-platform-btn copy" onClick={() => copyToClipboard()}>
                <div className="platform-icon">📋</div>
                <span>复制链接</span>
              </button>
            </div>

            <div className="mobile-share-actions">
              <button 
                className="share-action-btn generate-image"
                onClick={generateShareImage}
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="loading-spinner-sm"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>生成分享图片</span>
                  </>
                )}
              </button>
            </div>

            {copySuccess && (
              <div className="copy-success-message">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已复制到剪贴板！</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop render
  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="desktop-share-modal" onClick={e => e.stopPropagation()}>
        <div className="desktop-share-header">
          <h3 className="desktop-share-title">分享测试结果</h3>
          <button className="desktop-share-close" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="desktop-share-content">
          <div className="share-preview-section">
            <h4 className="section-title">预览</h4>
            <div className="desktop-share-preview">
              <div className="share-result-card">
                <div className="result-badge-large">
                  <span className="level-badge" style={{ backgroundColor: result.color }}>
                    {result.level}
                  </span>
                  <div className="result-details">
                    <h5 className="level-name">{result.levelName}</h5>
                    <p className="score-text">综合得分: {result.score}/5.0</p>
                    <p className="benchmark-text">{result.industryBenchmark.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="share-text-section">
            <h4 className="section-title">分享文案</h4>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="desktop-share-text-input"
              placeholder="编辑分享文案..."
              rows={4}
            />
            <div className="text-counter">
              {shareText.length}/200 字符
            </div>
          </div>

          <div className="share-platforms-section">
            <h4 className="section-title">选择平台</h4>
            <div className="desktop-share-platforms">
              <button 
                className={`desktop-platform-btn wechat ${selectedPlatform === 'wechat' ? 'selected' : ''}`}
                onClick={shareToWeChat}
              >
                <div className="platform-icon-large">💬</div>
                <span className="platform-name">微信</span>
                <span className="platform-desc">朋友圈分享</span>
              </button>
              
              <button 
                className={`desktop-platform-btn weibo ${selectedPlatform === 'weibo' ? 'selected' : ''}`}
                onClick={shareToWeibo}
              >
                <div className="platform-icon-large">🔥</div>
                <span className="platform-name">微博</span>
                <span className="platform-desc">公开分享</span>
              </button>
              
              <button 
                className={`desktop-platform-btn linkedin ${selectedPlatform === 'linkedin' ? 'selected' : ''}`}
                onClick={shareToLinkedIn}
              >
                <div className="platform-icon-large">💼</div>
                <span className="platform-name">LinkedIn</span>
                <span className="platform-desc">职业网络</span>
              </button>
              
              <button 
                className={`desktop-platform-btn twitter ${selectedPlatform === 'twitter' ? 'selected' : ''}`}
                onClick={shareToTwitter}
              >
                <div className="platform-icon-large">🐦</div>
                <span className="platform-name">Twitter</span>
                <span className="platform-desc">全球分享</span>
              </button>
            </div>
          </div>

          <div className="share-actions-section">
            <div className="share-actions-grid">
              <button 
                className="share-action-btn copy-link"
                onClick={() => copyToClipboard()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>复制链接</span>
              </button>
              
              <button 
                className="share-action-btn generate-image"
                onClick={generateShareImage}
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="loading-spinner-sm"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>生成分享图片</span>
                  </>
                )}
              </button>
            </div>

            {copySuccess && (
              <div className="desktop-copy-success">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>链接已复制到剪贴板！</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export component
window.ShareModal = ShareModal;