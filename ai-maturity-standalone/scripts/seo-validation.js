#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../dist');

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

// 验证SEO元数据
async function validateSEO() {
  log('开始SEO验证...', 'info');
  
  const indexPath = path.join(BUILD_DIR, 'index.html');
  
  if (!await fs.pathExists(indexPath)) {
    log('index.html文件不存在', 'error');
    return false;
  }
  
  const content = await fs.readFile(indexPath, 'utf8');
  
  const seoChecks = [
    {
      name: '页面标题',
      test: () => {
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        return titleMatch && titleMatch[1].length > 10 && titleMatch[1].length < 60;
      },
      extract: () => {
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        return titleMatch ? titleMatch[1] : '未找到';
      }
    },
    {
      name: '页面描述',
      test: () => {
        const descMatch = content.match(/<meta name="description" content="(.*?)"/i);
        return descMatch && descMatch[1].length > 50 && descMatch[1].length < 160;
      },
      extract: () => {
        const descMatch = content.match(/<meta name="description" content="(.*?)"/i);
        return descMatch ? descMatch[1] : '未找到';
      }
    },
    {
      name: '语言声明',
      test: () => content.includes('lang="zh-CN"'),
      extract: () => {
        const langMatch = content.match(/lang="([^"]+)"/i);
        return langMatch ? langMatch[1] : '未找到';
      }
    },
    {
      name: 'Viewport元标签',
      test: () => content.includes('name="viewport"'),
      extract: () => {
        const viewportMatch = content.match(/<meta name="viewport" content="([^"]+)"/i);
        return viewportMatch ? viewportMatch[1] : '未找到';
      }
    },
    {
      name: 'Open Graph标题',
      test: () => content.includes('property="og:title"'),
      extract: () => {
        const ogTitleMatch = content.match(/<meta property="og:title" content="([^"]+)"/i);
        return ogTitleMatch ? ogTitleMatch[1] : '未设置';
      }
    },
    {
      name: 'Open Graph描述',
      test: () => content.includes('property="og:description"'),
      extract: () => {
        const ogDescMatch = content.match(/<meta property="og:description" content="([^"]+)"/i);
        return ogDescMatch ? ogDescMatch[1] : '未设置';
      }
    },
    {
      name: 'Open Graph图片',
      test: () => content.includes('property="og:image"'),
      extract: () => {
        const ogImageMatch = content.match(/<meta property="og:image" content="([^"]+)"/i);
        return ogImageMatch ? ogImageMatch[1] : '未设置';
      }
    },
    {
      name: 'Twitter Card',
      test: () => content.includes('name="twitter:card"'),
      extract: () => {
        const twitterCardMatch = content.match(/<meta name="twitter:card" content="([^"]+)"/i);
        return twitterCardMatch ? twitterCardMatch[1] : '未设置';
      }
    },
    {
      name: 'Canonical URL',
      test: () => content.includes('rel="canonical"'),
      extract: () => {
        const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/i);
        return canonicalMatch ? canonicalMatch[1] : '未设置';
      }
    },
    {
      name: '结构化数据',
      test: () => content.includes('application/ld+json'),
      extract: () => {
        const jsonLdMatch = content.match(/<script type="application\/ld\+json">(.*?)<\/script>/is);
        return jsonLdMatch ? '已设置' : '未设置';
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  log('=== SEO元数据检查结果 ===', 'info');
  
  for (const check of seoChecks) {
    const result = check.test();
    const value = check.extract();
    
    if (result) {
      log(`✓ ${check.name}: ${value}`, 'success');
      passed++;
    } else {
      log(`✗ ${check.name}: ${value}`, 'warning');
      failed++;
    }
  }
  
  log(`\nSEO验证完成: ${passed} 通过, ${failed} 需要改进`, failed === 0 ? 'success' : 'warning');
  
  return failed === 0;
}

// 验证分享功能
async function validateSharingFeatures() {
  log('验证分享功能...', 'info');
  
  const indexPath = path.join(BUILD_DIR, 'index.html');
  const content = await fs.readFile(indexPath, 'utf8');
  
  const sharingChecks = [
    {
      name: '分享模态框组件',
      test: () => content.includes('ShareModal') || content.includes('分享')
    },
    {
      name: '社交媒体分享API',
      test: () => content.includes('socialMediaAPI') || content.includes('sharing.js')
    },
    {
      name: '复制链接功能',
      test: () => content.includes('复制') || content.includes('copy')
    },
    {
      name: '微信分享支持',
      test: () => content.includes('微信') || content.includes('wechat')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  log('=== 分享功能检查结果 ===', 'info');
  
  for (const check of sharingChecks) {
    const result = check.test();
    
    if (result) {
      log(`✓ ${check.name}`, 'success');
      passed++;
    } else {
      log(`✗ ${check.name}`, 'warning');
      failed++;
    }
  }
  
  log(`\n分享功能验证完成: ${passed} 通过, ${failed} 需要改进`, failed === 0 ? 'success' : 'warning');
  
  return failed === 0;
}

// 验证性能优化
async function validatePerformance() {
  log('验证性能优化...', 'info');
  
  const indexPath = path.join(BUILD_DIR, 'index.html');
  const content = await fs.readFile(indexPath, 'utf8');
  
  const performanceChecks = [
    {
      name: 'CSS内联优化',
      test: () => content.includes('<style>') && content.includes(':root')
    },
    {
      name: 'JavaScript压缩',
      test: () => {
        // 检查是否使用了压缩的React库
        return content.includes('react.production.min.js');
      }
    },
    {
      name: 'CDN资源使用',
      test: () => content.includes('unpkg.com') || content.includes('cdn.')
    },
    {
      name: '懒加载支持',
      test: () => content.includes('lazyLoader') || content.includes('lazy')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  log('=== 性能优化检查结果 ===', 'info');
  
  for (const check of performanceChecks) {
    const result = check.test();
    
    if (result) {
      log(`✓ ${check.name}`, 'success');
      passed++;
    } else {
      log(`✗ ${check.name}`, 'warning');
      failed++;
    }
  }
  
  log(`\n性能优化验证完成: ${passed} 通过, ${failed} 需要改进`, failed === 0 ? 'success' : 'warning');
  
  return failed === 0;
}

// 主验证函数
async function main() {
  try {
    log('开始完整的SEO和功能验证...', 'info');
    
    const seoResult = await validateSEO();
    const sharingResult = await validateSharingFeatures();
    const performanceResult = await validatePerformance();
    
    const overallResult = seoResult && sharingResult && performanceResult;
    
    log('\n=== 总体验证结果 ===', 'info');
    log(`SEO优化: ${seoResult ? '✓ 通过' : '✗ 需要改进'}`, seoResult ? 'success' : 'warning');
    log(`分享功能: ${sharingResult ? '✓ 通过' : '✗ 需要改进'}`, sharingResult ? 'success' : 'warning');
    log(`性能优化: ${performanceResult ? '✓ 通过' : '✗ 需要改进'}`, performanceResult ? 'success' : 'warning');
    
    if (overallResult) {
      log('\n🎉 所有验证通过！应用已准备好部署。', 'success');
      process.exit(0);
    } else {
      log('\n⚠️ 部分验证未通过，建议优化后再部署。', 'warning');
      process.exit(1);
    }
    
  } catch (error) {
    log(`验证失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { validateSEO, validateSharingFeatures, validatePerformance };