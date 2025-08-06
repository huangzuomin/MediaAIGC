#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// 需要清理的目录和文件
const CLEAN_TARGETS = [
  'dist',
  'deploy-staging',
  'deploy-production',
  'node_modules/.cache',
  'build-report.json',
  'resource-manifest.json',
  'performance-report.json'
];

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

// 格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 计算目录大小
async function calculateDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        totalSize += await calculateDirectorySize(fullPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // 目录不存在或无法访问
    return 0;
  }
  
  return totalSize;
}

// 清理单个目标
async function cleanTarget(target) {
  const targetPath = path.resolve(target);
  
  try {
    const exists = await fs.pathExists(targetPath);
    if (!exists) {
      log(`跳过 ${target} (不存在)`, 'info');
      return 0;
    }
    
    const stats = await fs.stat(targetPath);
    let size = 0;
    
    if (stats.isDirectory()) {
      size = await calculateDirectorySize(targetPath);
      await fs.remove(targetPath);
      log(`已删除目录 ${target} (${formatBytes(size)})`, 'success');
    } else {
      size = stats.size;
      await fs.remove(targetPath);
      log(`已删除文件 ${target} (${formatBytes(size)})`, 'success');
    }
    
    return size;
    
  } catch (error) {
    log(`清理 ${target} 失败: ${error.message}`, 'error');
    return 0;
  }
}

// 清理临时文件
async function cleanTempFiles() {
  log('清理临时文件...');
  
  const tempPatterns = [
    '**/*.tmp',
    '**/*.temp',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.log',
    '**/*.bak'
  ];
  
  let totalCleaned = 0;
  
  for (const pattern of tempPatterns) {
    try {
      // 这里可以使用glob库来匹配文件模式
      // 简化版本：只检查当前目录
      const files = await fs.readdir('.');
      
      for (const file of files) {
        if (file.endsWith('.tmp') || 
            file.endsWith('.temp') || 
            file.endsWith('.log') || 
            file.endsWith('.bak') ||
            file === '.DS_Store' ||
            file === 'Thumbs.db') {
          
          const filePath = path.resolve(file);
          const exists = await fs.pathExists(filePath);
          
          if (exists) {
            const stats = await fs.stat(filePath);
            await fs.remove(filePath);
            totalCleaned += stats.size;
            log(`已删除临时文件 ${file} (${formatBytes(stats.size)})`, 'success');
          }
        }
      }
    } catch (error) {
      log(`清理临时文件时出错: ${error.message}`, 'warning');
    }
  }
  
  if (totalCleaned > 0) {
    log(`临时文件清理完成，释放空间 ${formatBytes(totalCleaned)}`, 'success');
  } else {
    log('未找到需要清理的临时文件', 'info');
  }
  
  return totalCleaned;
}

// 清理node_modules缓存
async function cleanNodeModulesCache() {
  log('清理node_modules缓存...');
  
  const cacheTargets = [
    'node_modules/.cache',
    'node_modules/.bin/.cache',
    '.npm',
    '.yarn/cache'
  ];
  
  let totalCleaned = 0;
  
  for (const target of cacheTargets) {
    const targetPath = path.resolve(target);
    const exists = await fs.pathExists(targetPath);
    
    if (exists) {
      const size = await calculateDirectorySize(targetPath);
      await fs.remove(targetPath);
      totalCleaned += size;
      log(`已清理 ${target} (${formatBytes(size)})`, 'success');
    }
  }
  
  if (totalCleaned > 0) {
    log(`缓存清理完成，释放空间 ${formatBytes(totalCleaned)}`, 'success');
  } else {
    log('未找到需要清理的缓存', 'info');
  }
  
  return totalCleaned;
}

// 生成清理报告
async function generateCleanReport(totalCleaned, cleanedItems) {
  const report = {
    timestamp: new Date().toISOString(),
    totalSpaceFreed: totalCleaned,
    totalSpaceFreedFormatted: formatBytes(totalCleaned),
    cleanedItems: cleanedItems,
    summary: {
      directories: cleanedItems.filter(item => item.type === 'directory').length,
      files: cleanedItems.filter(item => item.type === 'file').length,
      tempFiles: cleanedItems.filter(item => item.type === 'temp').length,
      cacheFiles: cleanedItems.filter(item => item.type === 'cache').length
    }
  };
  
  const reportPath = path.resolve('clean-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  log(`清理报告已生成: ${reportPath}`, 'info');
  return report;
}

// 主清理函数
async function clean() {
  const args = process.argv.slice(2);
  const options = {
    all: args.includes('--all') || args.includes('-a'),
    temp: args.includes('--temp') || args.includes('-t'),
    cache: args.includes('--cache') || args.includes('-c'),
    build: args.includes('--build') || args.includes('-b'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };
  
  try {
    log('开始清理...', 'info');
    
    let totalCleaned = 0;
    const cleanedItems = [];
    
    // 清理构建文件
    if (options.all || options.build || args.length === 0) {
      log('清理构建文件和目录...', 'info');
      
      for (const target of CLEAN_TARGETS) {
        const size = await cleanTarget(target);
        if (size > 0) {
          totalCleaned += size;
          cleanedItems.push({
            name: target,
            size: size,
            sizeFormatted: formatBytes(size),
            type: target.includes('.') ? 'file' : 'directory'
          });
        }
      }
    }
    
    // 清理临时文件
    if (options.all || options.temp) {
      const tempSize = await cleanTempFiles();
      if (tempSize > 0) {
        totalCleaned += tempSize;
        cleanedItems.push({
          name: 'temporary files',
          size: tempSize,
          sizeFormatted: formatBytes(tempSize),
          type: 'temp'
        });
      }
    }
    
    // 清理缓存
    if (options.all || options.cache) {
      const cacheSize = await cleanNodeModulesCache();
      if (cacheSize > 0) {
        totalCleaned += cacheSize;
        cleanedItems.push({
          name: 'cache files',
          size: cacheSize,
          sizeFormatted: formatBytes(cacheSize),
          type: 'cache'
        });
      }
    }
    
    // 生成报告
    if (options.verbose || totalCleaned > 0) {
      await generateCleanReport(totalCleaned, cleanedItems);
    }
    
    if (totalCleaned > 0) {
      log(`清理完成！总计释放空间: ${formatBytes(totalCleaned)}`, 'success');
    } else {
      log('没有找到需要清理的文件', 'info');
    }
    
  } catch (error) {
    log(`清理失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
AI成熟度自测工具 - 清理脚本

用法:
  node clean.js [options]

选项:
  --all, -a      清理所有文件（默认）
  --build, -b    只清理构建文件
  --temp, -t     只清理临时文件
  --cache, -c    只清理缓存文件
  --verbose, -v  显示详细信息
  --help, -h     显示帮助信息

示例:
  node clean.js           # 清理构建文件（默认）
  node clean.js --all     # 清理所有文件
  node clean.js --temp    # 只清理临时文件
  node clean.js --cache   # 只清理缓存文件
  node clean.js --verbose # 显示详细清理报告

清理目标:
  - dist/                 # 构建输出目录
  - deploy-*/             # 部署包目录
  - node_modules/.cache/  # npm缓存
  - *.tmp, *.temp         # 临时文件
  - *.log, *.bak          # 日志和备份文件
  - .DS_Store, Thumbs.db  # 系统文件
`);
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    clean();
  }
}

module.exports = { clean };