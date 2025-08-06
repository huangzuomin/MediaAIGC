#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');

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

// HTTP请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || 10000;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          responseTime: Date.now() - startTime
        });
      });
    });
    
    const startTime = Date.now();
    
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`请求超时 (${timeout}ms)`));
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

// 验证文件结构
async function validateFileStructure() {
  log('验证文件结构...');
  
  const requiredFiles = [
    'index.html',
    'assets/styles.css',
    '.htaccess',
    'nginx.conf',
    'Dockerfile'
  ];
  
  const optionalFiles = [
    'status.html',
    'test-basic.html',
    'debug-simple.html',
    'working-with-privacy.html'
  ];
  
  let passed = 0;
  let failed = 0;
  
  // 检查必需文件
  for (const file of requiredFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const exists = await fs.pathExists(filePath);
    
    if (exists) {
      log(`✓ ${file}`, 'success');
      passed++;
    } else {
      log(`✗ ${file} (必需文件缺失)`, 'error');
      failed++;
    }
  }
  
  // 检查可选文件
  for (const file of optionalFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const exists = await fs.pathExists(filePath);
    
    if (exists) {
      log(`✓ ${file} (可选)`, 'success');
    } else {
      log(`- ${file} (可选文件不存在)`, 'warning');
    }
  }
  
  log(`文件结构验证完成: ${passed} 通过, ${failed} 失败`, failed > 0 ? 'error' : 'success');
  return failed === 0;
}

// 验证HTML文件
async function validateHTML() {
  log('验证HTML文件...');
  
  const htmlFiles = ['index.html', 'status.html'];
  let passed = 0;
  let failed = 0;
  
  for (const file of htmlFiles) {
    const filePath = path.join(BUILD_DIR, file);
    
    if (await fs.pathExists(filePath)) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        
        // 基本HTML验证
        const checks = [
          {
            name: 'DOCTYPE声明',
            test: () => content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>')
          },
          {
            name: 'HTML标签',
            test: () => content.includes('<html') && content.includes('</html>')
          },
          {
            name: 'HEAD标签',
            test: () => content.includes('<head>') && content.includes('</head>')
          },
          {
            name: 'BODY标签',
            test: () => content.includes('<body>') && content.includes('</body>')
          },
          {
            name: 'TITLE标签',
            test: () => content.includes('<title>') && content.includes('</title>')
          },
          {
            name: 'META charset',
            test: () => content.includes('charset="UTF-8"')
          },
          {
            name: 'META viewport',
            test: () => content.includes('name="viewport"')
          }
        ];
        
        let filePassed = 0;
        let fileFailed = 0;
        
        for (const check of checks) {
          if (check.test()) {
            filePassed++;
          } else {
            log(`  ✗ ${file}: ${check.name}`, 'error');
            fileFailed++;
          }
        }
        
        if (fileFailed === 0) {
          log(`✓ ${file}: 所有检查通过`, 'success');
          passed++;
        } else {
          log(`✗ ${file}: ${fileFailed} 项检查失败`, 'error');
          failed++;
        }
        
      } catch (error) {
        log(`✗ ${file}: 读取失败 - ${error.message}`, 'error');
        failed++;
      }
    }
  }
  
  log(`HTML验证完成: ${passed} 通过, ${failed} 失败`, failed > 0 ? 'error' : 'success');
  return failed === 0;
}

// 验证CSS文件
async function validateCSS() {
  log('验证CSS文件...');
  
  const cssPath = path.join(BUILD_DIR, 'assets', 'styles.css');
  
  if (await fs.pathExists(cssPath)) {
    try {
      const content = await fs.readFile(cssPath, 'utf8');
      
      const checks = [
        {
          name: 'CSS变量定义',
          test: () => content.includes(':root') && content.includes('--primary-color')
        },
        {
          name: '响应式设计',
          test: () => content.includes('@media')
        },
        {
          name: '动画定义',
          test: () => content.includes('@keyframes')
        }
      ];
      
      let passed = 0;
      let failed = 0;
      
      for (const check of checks) {
        if (check.test()) {
          log(`  ✓ ${check.name}`, 'success');
          passed++;
        } else {
          log(`  ✗ ${check.name}`, 'warning');
          failed++;
        }
      }
      
      log(`CSS验证完成: ${passed} 通过, ${failed} 警告`, 'success');
      return true;
      
    } catch (error) {
      log(`CSS验证失败: ${error.message}`, 'error');
      return false;
    }
  } else {
    log('CSS文件不存在', 'error');
    return false;
  }
}

// 验证配置文件
async function validateConfig() {
  log('验证配置文件...');
  
  const configs = [
    {
      file: '.htaccess',
      checks: [
        { name: 'Gzip压缩', pattern: /mod_deflate|mod_gzip/ },
        { name: '缓存设置', pattern: /mod_expires|Cache-Control/ },
        { name: '安全头', pattern: /X-Frame-Options|X-Content-Type-Options/ },
        { name: 'HTTPS重定向', pattern: /RewriteRule.*https/ }
      ]
    },
    {
      file: 'nginx.conf',
      checks: [
        { name: 'Gzip压缩', pattern: /gzip\s+on/ },
        { name: 'SSL配置', pattern: /ssl_certificate/ },
        { name: '安全头', pattern: /add_header.*X-Frame-Options/ },
        { name: '缓存设置', pattern: /expires|Cache-Control/ }
      ]
    }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const config of configs) {
    const configPath = path.join(BUILD_DIR, config.file);
    
    if (await fs.pathExists(configPath)) {
      try {
        const content = await fs.readFile(configPath, 'utf8');
        
        let passed = 0;
        let failed = 0;
        
        for (const check of config.checks) {
          if (check.pattern.test(content)) {
            log(`  ✓ ${config.file}: ${check.name}`, 'success');
            passed++;
          } else {
            log(`  ✗ ${config.file}: ${check.name}`, 'warning');
            failed++;
          }
        }
        
        totalPassed += passed;
        totalFailed += failed;
        
      } catch (error) {
        log(`配置文件读取失败 ${config.file}: ${error.message}`, 'error');
        totalFailed++;
      }
    } else {
      log(`配置文件不存在: ${config.file}`, 'warning');
    }
  }
  
  log(`配置验证完成: ${totalPassed} 通过, ${totalFailed} 警告`, 'success');
  return true;
}

// 验证在线部署
async function validateDeployment(baseUrl) {
  log(`验证在线部署: ${baseUrl}`);
  
  const tests = [
    {
      name: '主页面可访问性',
      url: baseUrl,
      expectedStatus: 200,
      checks: [
        { name: 'HTML内容', test: (data) => data.includes('<html') },
        { name: '标题存在', test: (data) => data.includes('<title>') },
        { name: 'React加载', test: (data) => data.includes('React') }
      ]
    },
    {
      name: 'CSS文件加载',
      url: `${baseUrl}/assets/styles.css`,
      expectedStatus: 200,
      checks: [
        { name: 'CSS内容', test: (data) => data.includes(':root') }
      ]
    },
    {
      name: '状态页面',
      url: `${baseUrl}/status.html`,
      expectedStatus: 200,
      checks: [
        { name: '状态页面内容', test: (data) => data.includes('状态') }
      ]
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      log(`  测试: ${test.name}...`);
      const response = await makeRequest(test.url);
      
      if (response.statusCode === test.expectedStatus) {
        log(`    ✓ HTTP状态码: ${response.statusCode}`, 'success');
        
        // 运行内容检查
        if (test.checks) {
          for (const check of test.checks) {
            if (check.test(response.data)) {
              log(`    ✓ ${check.name}`, 'success');
            } else {
              log(`    ✗ ${check.name}`, 'warning');
            }
          }
        }
        
        log(`    响应时间: ${response.responseTime}ms`, 'info');
        passed++;
        
      } else {
        log(`    ✗ HTTP状态码: ${response.statusCode} (期望: ${test.expectedStatus})`, 'error');
        failed++;
      }
      
    } catch (error) {
      log(`    ✗ 请求失败: ${error.message}`, 'error');
      failed++;
    }
  }
  
  log(`在线验证完成: ${passed} 通过, ${failed} 失败`, failed > 0 ? 'error' : 'success');
  return failed === 0;
}

// 生成验证报告
async function generateValidationReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    results: results,
    summary: {
      totalTests: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      overallStatus: results.every(r => r.passed) ? 'PASS' : 'FAIL'
    }
  };
  
  const reportPath = path.join(BUILD_DIR, 'validation-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  log(`验证报告已生成: ${reportPath}`, 'info');
  return report;
}

// 主验证函数
async function validate() {
  const args = process.argv.slice(2);
  const baseUrl = args[0]; // 可选的在线URL
  
  try {
    log('开始验证部署...', 'info');
    
    const results = [];
    
    // 验证构建目录
    if (!await fs.pathExists(BUILD_DIR)) {
      log('构建目录不存在，请先运行 npm run build', 'error');
      process.exit(1);
    }
    
    // 文件结构验证
    const fileStructureResult = await validateFileStructure();
    results.push({
      name: '文件结构',
      passed: fileStructureResult,
      category: 'structure'
    });
    
    // HTML验证
    const htmlResult = await validateHTML();
    results.push({
      name: 'HTML文件',
      passed: htmlResult,
      category: 'content'
    });
    
    // CSS验证
    const cssResult = await validateCSS();
    results.push({
      name: 'CSS文件',
      passed: cssResult,
      category: 'content'
    });
    
    // 配置文件验证
    const configResult = await validateConfig();
    results.push({
      name: '配置文件',
      passed: configResult,
      category: 'config'
    });
    
    // 在线部署验证（如果提供了URL）
    if (baseUrl) {
      const deploymentResult = await validateDeployment(baseUrl);
      results.push({
        name: '在线部署',
        passed: deploymentResult,
        category: 'deployment'
      });
    }
    
    // 生成报告
    const report = await generateValidationReport(results);
    
    // 显示总结
    log('=== 验证总结 ===', 'info');
    log(`总测试数: ${report.summary.totalTests}`, 'info');
    log(`通过: ${report.summary.passed}`, 'success');
    log(`失败: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
    log(`整体状态: ${report.summary.overallStatus}`, report.summary.overallStatus === 'PASS' ? 'success' : 'error');
    
    if (report.summary.overallStatus === 'PASS') {
      log('验证通过！部署准备就绪。', 'success');
      process.exit(0);
    } else {
      log('验证失败！请修复问题后重新验证。', 'error');
      process.exit(1);
    }
    
  } catch (error) {
    log(`验证失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
AI成熟度自测工具 - 验证脚本

用法:
  node validate.js [url]

参数:
  url: 可选的在线部署URL，用于验证在线部署

示例:
  node validate.js                                    # 验证本地构建
  node validate.js https://your-domain.com           # 验证在线部署

验证项目:
  - 文件结构完整性
  - HTML文件有效性
  - CSS文件完整性
  - 配置文件正确性
  - 在线部署可访问性（如果提供URL）

输出:
  - 控制台日志
  - validation-report.json 报告文件
`);
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    validate();
  }
}

module.exports = { validate };