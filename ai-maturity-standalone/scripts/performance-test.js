#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs-extra');
const path = require('path');

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
    
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      let data = '';
      let firstByteTime = null;
      
      res.on('data', (chunk) => {
        if (!firstByteTime) {
          firstByteTime = Date.now();
        }
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          totalTime: endTime - startTime,
          firstByteTime: firstByteTime ? firstByteTime - startTime : null,
          size: Buffer.byteLength(data, 'utf8')
        });
      });
    });
    
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`请求超时 (${timeout}ms)`));
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

// 性能测试
async function performanceTest(baseUrl) {
  log('开始性能测试...', 'info');
  
  const tests = [
    {
      name: '主页面加载',
      url: baseUrl,
      expectedSize: 50000, // 预期大小约50KB
      maxTime: 3000 // 最大加载时间3秒
    },
    {
      name: 'CSS文件加载',
      url: `${baseUrl}/assets/styles.css`,
      expectedSize: 60000, // 预期大小约60KB（包含完整样式）
      maxTime: 1000 // 最大加载时间1秒
    },
    {
      name: '状态页面',
      url: `${baseUrl}/status.html`,
      expectedSize: 5000, // 预期大小约5KB
      maxTime: 2000 // 最大加载时间2秒
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      log(`测试: ${test.name}...`);
      
      // 执行多次请求取平均值
      const iterations = 3;
      let totalTime = 0;
      let totalSize = 0;
      let firstByteTotal = 0;
      
      for (let i = 0; i < iterations; i++) {
        const result = await makeRequest(test.url);
        totalTime += result.totalTime;
        totalSize += result.size;
        if (result.firstByteTime) {
          firstByteTotal += result.firstByteTime;
        }
      }
      
      const avgTime = totalTime / iterations;
      const avgSize = totalSize / iterations;
      const avgFirstByte = firstByteTotal / iterations;
      
      const testResult = {
        name: test.name,
        url: test.url,
        avgTime: Math.round(avgTime),
        avgSize: Math.round(avgSize),
        avgFirstByte: Math.round(avgFirstByte),
        passed: avgTime <= test.maxTime,
        sizeCheck: avgSize <= test.expectedSize * 2 // 允许2倍的大小差异
      };
      
      results.push(testResult);
      
      if (testResult.passed && testResult.sizeCheck) {
        log(`  ✓ ${test.name}: ${testResult.avgTime}ms, ${formatBytes(testResult.avgSize)}`, 'success');
      } else {
        log(`  ✗ ${test.name}: ${testResult.avgTime}ms, ${formatBytes(testResult.avgSize)}`, 'warning');
        if (!testResult.passed) {
          log(`    超时: ${testResult.avgTime}ms > ${test.maxTime}ms`, 'warning');
        }
        if (!testResult.sizeCheck) {
          log(`    文件过大: ${formatBytes(testResult.avgSize)} > ${formatBytes(test.expectedSize * 2)}`, 'warning');
        }
      }
      
    } catch (error) {
      log(`  ✗ ${test.name}: ${error.message}`, 'error');
      results.push({
        name: test.name,
        url: test.url,
        error: error.message,
        passed: false,
        sizeCheck: false
      });
    }
  }
  
  return results;
}

// 安全测试
async function securityTest(baseUrl) {
  log('开始安全测试...', 'info');
  
  const securityTests = [
    {
      name: 'X-Content-Type-Options',
      check: (headers) => headers['x-content-type-options'] === 'nosniff'
    },
    {
      name: 'X-Frame-Options',
      check: (headers) => headers['x-frame-options'] === 'DENY'
    },
    {
      name: 'X-XSS-Protection',
      check: (headers) => headers['x-xss-protection'] === '1; mode=block'
    },
    {
      name: 'Referrer-Policy',
      check: (headers) => headers['referrer-policy'] === 'strict-origin-when-cross-origin'
    },
    {
      name: 'Content-Type正确设置',
      check: (headers) => headers['content-type'] && headers['content-type'].includes('text/html')
    }
  ];
  
  try {
    const response = await makeRequest(baseUrl);
    const headers = response.headers;
    
    let passed = 0;
    let failed = 0;
    
    log('=== 安全头检查结果 ===', 'info');
    
    for (const test of securityTests) {
      const result = test.check(headers);
      
      if (result) {
        log(`  ✓ ${test.name}`, 'success');
        passed++;
      } else {
        log(`  ✗ ${test.name}`, 'warning');
        failed++;
      }
    }
    
    log(`\n安全测试完成: ${passed} 通过, ${failed} 失败`, failed === 0 ? 'success' : 'warning');
    
    return {
      passed,
      failed,
      total: securityTests.length,
      success: failed === 0
    };
    
  } catch (error) {
    log(`安全测试失败: ${error.message}`, 'error');
    return {
      passed: 0,
      failed: securityTests.length,
      total: securityTests.length,
      success: false,
      error: error.message
    };
  }
}

// 负载测试
async function loadTest(baseUrl) {
  log('开始负载测试...', 'info');
  
  const concurrentRequests = 10;
  const totalRequests = 50;
  
  try {
    const startTime = Date.now();
    const promises = [];
    
    for (let i = 0; i < totalRequests; i++) {
      promises.push(makeRequest(baseUrl));
      
      // 控制并发数
      if (promises.length >= concurrentRequests) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }
    
    // 处理剩余请求
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / totalRequests;
    const requestsPerSecond = (totalRequests / totalTime) * 1000;
    
    log(`负载测试完成:`, 'success');
    log(`  总请求数: ${totalRequests}`, 'info');
    log(`  总耗时: ${totalTime}ms`, 'info');
    log(`  平均响应时间: ${Math.round(avgTime)}ms`, 'info');
    log(`  每秒请求数: ${Math.round(requestsPerSecond)}`, 'info');
    
    return {
      totalRequests,
      totalTime,
      avgTime: Math.round(avgTime),
      requestsPerSecond: Math.round(requestsPerSecond),
      success: avgTime < 1000 // 平均响应时间小于1秒
    };
    
  } catch (error) {
    log(`负载测试失败: ${error.message}`, 'error');
    return {
      success: false,
      error: error.message
    };
  }
}

// 格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成测试报告
async function generateReport(performanceResults, securityResults, loadResults) {
  const report = {
    timestamp: new Date().toISOString(),
    performance: {
      tests: performanceResults,
      summary: {
        total: performanceResults.length,
        passed: performanceResults.filter(r => r.passed && r.sizeCheck).length,
        failed: performanceResults.filter(r => !r.passed || !r.sizeCheck).length
      }
    },
    security: securityResults,
    load: loadResults,
    overall: {
      success: performanceResults.every(r => r.passed && r.sizeCheck) && 
               securityResults.success && 
               loadResults.success
    }
  };
  
  const reportPath = path.join(__dirname, '../dist/performance-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  log(`性能测试报告已生成: ${reportPath}`, 'info');
  return report;
}

// 主测试函数
async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'http://localhost:3002';
  
  try {
    log(`开始完整的性能和安全测试: ${baseUrl}`, 'info');
    
    // 等待服务器启动
    log('等待服务器启动...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const performanceResults = await performanceTest(baseUrl);
    const securityResults = await securityTest(baseUrl);
    const loadResults = await loadTest(baseUrl);
    
    const report = await generateReport(performanceResults, securityResults, loadResults);
    
    log('\n=== 测试总结 ===', 'info');
    log(`性能测试: ${report.performance.summary.passed}/${report.performance.summary.total} 通过`, 
        report.performance.summary.failed === 0 ? 'success' : 'warning');
    log(`安全测试: ${securityResults.passed}/${securityResults.total} 通过`, 
        securityResults.success ? 'success' : 'warning');
    log(`负载测试: ${loadResults.success ? '通过' : '失败'}`, 
        loadResults.success ? 'success' : 'warning');
    
    if (report.overall.success) {
      log('\n🎉 所有测试通过！应用性能和安全性良好。', 'success');
      process.exit(0);
    } else {
      log('\n⚠️ 部分测试未通过，建议优化后再部署。', 'warning');
      process.exit(1);
    }
    
  } catch (error) {
    log(`测试失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { performanceTest, securityTest, loadTest };