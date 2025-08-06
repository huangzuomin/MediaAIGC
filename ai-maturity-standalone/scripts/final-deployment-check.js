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

// 最终部署检查清单
async function finalDeploymentCheck() {
  log('开始最终部署检查...', 'info');
  
  const checklist = [
    {
      name: '构建文件完整性',
      check: async () => {
        const requiredFiles = [
          'index.html',
          'assets/styles.css',
          '.htaccess',
          'nginx.conf',
          'Dockerfile',
          'docker-compose.yml',
          'deploy.sh'
        ];
        
        for (const file of requiredFiles) {
          const filePath = path.join(BUILD_DIR, file);
          if (!await fs.pathExists(filePath)) {
            return { success: false, message: `缺少文件: ${file}` };
          }
        }
        
        return { success: true, message: '所有必需文件存在' };
      }
    },
    {
      name: 'HTML文件有效性',
      check: async () => {
        const indexPath = path.join(BUILD_DIR, 'index.html');
        const content = await fs.readFile(indexPath, 'utf8');
        
        const checks = [
          { name: 'DOCTYPE', test: content.includes('<!doctype html>') || content.includes('<!DOCTYPE html>') },
          { name: 'HTML标签', test: content.includes('<html') && content.includes('</html>') },
          { name: '字符编码', test: content.includes('charset="UTF-8"') },
          { name: '视口设置', test: content.includes('name="viewport"') },
          { name: 'React脚本', test: content.includes('react') },
          { name: 'SEO元数据', test: content.includes('og:title') && content.includes('twitter:card') }
        ];
        
        const failed = checks.filter(c => !c.test);
        if (failed.length > 0) {
          return { success: false, message: `HTML检查失败: ${failed.map(f => f.name).join(', ')}` };
        }
        
        return { success: true, message: 'HTML文件有效' };
      }
    },
    {
      name: 'CSS文件压缩',
      check: async () => {
        const cssPath = path.join(BUILD_DIR, 'assets', 'styles.css');
        const content = await fs.readFile(cssPath, 'utf8');
        
        // 检查是否已压缩（没有多余的空格和换行）
        const isMinified = !content.includes('\n\n') && content.length > 10000;
        
        if (!isMinified) {
          return { success: false, message: 'CSS文件未正确压缩' };
        }
        
        return { success: true, message: `CSS文件已压缩 (${Math.round(content.length / 1024)}KB)` };
      }
    },
    {
      name: '安全配置',
      check: async () => {
        const htaccessPath = path.join(BUILD_DIR, '.htaccess');
        const nginxPath = path.join(BUILD_DIR, 'nginx.conf');
        
        const htaccessContent = await fs.readFile(htaccessPath, 'utf8');
        const nginxContent = await fs.readFile(nginxPath, 'utf8');
        
        const securityChecks = [
          { name: 'Apache安全头', test: htaccessContent.includes('X-Frame-Options') },
          { name: 'Apache压缩', test: htaccessContent.includes('mod_deflate') },
          { name: 'Apache缓存', test: htaccessContent.includes('mod_expires') },
          { name: 'Nginx安全头', test: nginxContent.includes('add_header X-Frame-Options') },
          { name: 'Nginx压缩', test: nginxContent.includes('gzip on') },
          { name: 'SSL配置', test: nginxContent.includes('ssl_certificate') }
        ];
        
        const failed = securityChecks.filter(c => !c.test);
        if (failed.length > 0) {
          return { success: false, message: `安全配置缺失: ${failed.map(f => f.name).join(', ')}` };
        }
        
        return { success: true, message: '安全配置完整' };
      }
    },
    {
      name: 'Docker配置',
      check: async () => {
        const dockerfilePath = path.join(BUILD_DIR, 'Dockerfile');
        const composePath = path.join(BUILD_DIR, 'docker-compose.yml');
        
        const dockerfileContent = await fs.readFile(dockerfilePath, 'utf8');
        const composeContent = await fs.readFile(composePath, 'utf8');
        
        const dockerChecks = [
          { name: 'Dockerfile基础镜像', test: dockerfileContent.includes('FROM nginx:alpine') },
          { name: 'Dockerfile复制文件', test: dockerfileContent.includes('COPY . /usr/share/nginx/html') },
          { name: 'Docker Compose服务', test: composeContent.includes('ai-maturity-standalone:') },
          { name: 'Docker Compose端口', test: composeContent.includes('80:80') }
        ];
        
        const failed = dockerChecks.filter(c => !c.test);
        if (failed.length > 0) {
          return { success: false, message: `Docker配置问题: ${failed.map(f => f.name).join(', ')}` };
        }
        
        return { success: true, message: 'Docker配置正确' };
      }
    },
    {
      name: '部署脚本',
      check: async () => {
        const deployPath = path.join(BUILD_DIR, 'deploy.sh');
        const content = await fs.readFile(deployPath, 'utf8');
        
        const scriptChecks = [
          { name: '脚本头', test: content.includes('#!/bin/bash') },
          { name: 'rsync命令', test: content.includes('rsync') },
          { name: '权限设置', test: content.includes('chmod') },
          { name: '服务重启', test: content.includes('nginx') }
        ];
        
        const failed = scriptChecks.filter(c => !c.test);
        if (failed.length > 0) {
          return { success: false, message: `部署脚本问题: ${failed.map(f => f.name).join(', ')}` };
        }
        
        return { success: true, message: '部署脚本完整' };
      }
    },
    {
      name: '文件大小检查',
      check: async () => {
        const files = await getDirectorySize(BUILD_DIR);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        // 检查总大小是否合理（应该小于5MB）
        if (totalSize > 5 * 1024 * 1024) {
          return { success: false, message: `构建文件过大: ${formatBytes(totalSize)}` };
        }
        
        // 检查单个文件大小
        const largeFiles = files.filter(f => f.size > 500 * 1024); // 大于500KB的文件
        if (largeFiles.length > 2) {
          return { success: false, message: `过多大文件: ${largeFiles.length}个文件 > 500KB` };
        }
        
        return { success: true, message: `总大小: ${formatBytes(totalSize)}, ${files.length}个文件` };
      }
    },
    {
      name: '功能完整性',
      check: async () => {
        const indexPath = path.join(BUILD_DIR, 'index.html');
        const content = await fs.readFile(indexPath, 'utf8');
        
        const featureChecks = [
          { name: '评估问题', test: content.includes('questions') && content.includes('AI成熟度') },
          { name: '结果计算', test: content.includes('calculateResult') },
          { name: '分享功能', test: content.includes('handleShare') && content.includes('分享结果') },
          { name: '转化引导', test: content.includes('预约专家咨询') && content.includes('了解更多服务') },
          { name: '无障碍支持', test: content.includes('AccessibilityManager') && content.includes('aria-') },
          { name: '移动端优化', test: content.includes('viewport') && content.includes('width=device-width') }
        ];
        
        const failed = featureChecks.filter(c => !c.test);
        if (failed.length > 0) {
          return { success: false, message: `功能缺失: ${failed.map(f => f.name).join(', ')}` };
        }
        
        return { success: true, message: '所有核心功能完整' };
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  log('=== 部署检查清单 ===', 'info');
  
  for (const item of checklist) {
    try {
      const result = await item.check();
      results.push({ name: item.name, ...result });
      
      if (result.success) {
        log(`✓ ${item.name}: ${result.message}`, 'success');
        passed++;
      } else {
        log(`✗ ${item.name}: ${result.message}`, 'error');
        failed++;
      }
    } catch (error) {
      log(`✗ ${item.name}: 检查失败 - ${error.message}`, 'error');
      results.push({ name: item.name, success: false, message: error.message });
      failed++;
    }
  }
  
  log(`\n部署检查完成: ${passed} 通过, ${failed} 失败`, failed === 0 ? 'success' : 'error');
  
  return {
    passed,
    failed,
    total: checklist.length,
    success: failed === 0,
    results
  };
}

// 获取目录大小
async function getDirectorySize(dir) {
  const files = [];
  
  async function scanDir(currentDir) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await scanDir(fullPath);
      } else {
        files.push({
          path: path.relative(dir, fullPath),
          size: stat.size
        });
      }
    }
  }
  
  await scanDir(dir);
  return files;
}

// 格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成部署报告
async function generateDeploymentReport(checkResults) {
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production',
    checks: checkResults,
    summary: {
      total: checkResults.total,
      passed: checkResults.passed,
      failed: checkResults.failed,
      success: checkResults.success
    },
    deployment: {
      ready: checkResults.success,
      recommendations: checkResults.success ? [
        '所有检查通过，可以安全部署到生产环境',
        '建议在部署后进行功能验证测试',
        '监控应用性能和用户反馈'
      ] : [
        '请修复失败的检查项后再部署',
        '建议在测试环境中验证修复',
        '确保所有安全配置正确'
      ]
    }
  };
  
  const reportPath = path.join(BUILD_DIR, 'deployment-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  log(`部署报告已生成: ${reportPath}`, 'info');
  return report;
}

// 主函数
async function main() {
  try {
    log('🚀 AI成熟度自测工具 - 最终部署检查', 'info');
    log('='.repeat(50), 'info');
    
    // 检查构建目录是否存在
    if (!await fs.pathExists(BUILD_DIR)) {
      log('构建目录不存在，请先运行 npm run build', 'error');
      process.exit(1);
    }
    
    const checkResults = await finalDeploymentCheck();
    const report = await generateDeploymentReport(checkResults);
    
    log('\n' + '='.repeat(50), 'info');
    log('🎯 最终部署状态', 'info');
    log('='.repeat(50), 'info');
    
    if (report.deployment.ready) {
      log('✅ 部署就绪！', 'success');
      log('', 'info');
      log('📋 部署建议:', 'info');
      report.deployment.recommendations.forEach(rec => {
        log(`  • ${rec}`, 'info');
      });
      log('', 'info');
      log('🚀 部署命令:', 'info');
      log('  npm run deploy production', 'info');
      log('  或使用 Docker: docker-compose up -d', 'info');
      log('', 'info');
      log('📊 构建统计:', 'info');
      log(`  检查项目: ${report.summary.total}`, 'info');
      log(`  通过: ${report.summary.passed}`, 'success');
      log(`  失败: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
      
      process.exit(0);
    } else {
      log('❌ 部署未就绪', 'error');
      log('', 'info');
      log('🔧 需要修复的问题:', 'error');
      report.checks.results.filter(r => !r.success).forEach(result => {
        log(`  • ${result.name}: ${result.message}`, 'error');
      });
      log('', 'info');
      log('💡 修复建议:', 'info');
      report.deployment.recommendations.forEach(rec => {
        log(`  • ${rec}`, 'warning');
      });
      
      process.exit(1);
    }
    
  } catch (error) {
    log(`最终检查失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { finalDeploymentCheck };