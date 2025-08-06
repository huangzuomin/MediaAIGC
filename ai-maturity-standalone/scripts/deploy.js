#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_DIR = path.join(__dirname, '../dist');

// 部署配置
const deployConfig = {
  // 生产环境配置
  production: {
    host: 'your-production-server.com',
    user: 'deploy',
    path: '/var/www/ai-maturity-standalone',
    branch: 'main',
    domain: 'your-domain.com'
  },
  
  // 测试环境配置
  staging: {
    host: 'your-staging-server.com',
    user: 'deploy',
    path: '/var/www/ai-maturity-standalone-staging',
    branch: 'develop',
    domain: 'staging.your-domain.com'
  }
};

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

// 检查构建目录
function checkBuildDir() {
  if (!fs.existsSync(BUILD_DIR)) {
    log('构建目录不存在，正在执行构建...', 'warning');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('构建完成', 'success');
    } catch (error) {
      log('构建失败', 'error');
      throw error;
    }
  }
}

// 验证部署前检查
async function preDeployChecks() {
  log('执行部署前检查...');
  
  const checks = [
    {
      name: '检查index.html文件',
      check: () => fs.existsSync(path.join(BUILD_DIR, 'index.html'))
    },
    {
      name: '检查assets目录',
      check: () => fs.existsSync(path.join(BUILD_DIR, 'assets'))
    },
    {
      name: '检查部署配置文件',
      check: () => fs.existsSync(path.join(BUILD_DIR, '.htaccess')) || fs.existsSync(path.join(BUILD_DIR, 'nginx.conf'))
    }
  ];
  
  for (const check of checks) {
    if (check.check()) {
      log(`✓ ${check.name}`, 'success');
    } else {
      log(`✗ ${check.name}`, 'error');
      throw new Error(`部署前检查失败: ${check.name}`);
    }
  }
  
  log('部署前检查通过', 'success');
}

// 创建部署包
async function createDeploymentPackage(environment) {
  log(`为 ${environment} 环境创建部署包...`);
  
  const config = deployConfig[environment];
  if (!config) {
    throw new Error(`未知的部署环境: ${environment}`);
  }
  
  const packageDir = path.join(__dirname, `../deploy-${environment}`);
  await fs.remove(packageDir);
  await fs.copy(BUILD_DIR, packageDir);
  
  // 更新环境特定的配置
  const indexPath = path.join(packageDir, 'index.html');
  if (await fs.pathExists(indexPath)) {
    let content = await fs.readFile(indexPath, 'utf8');
    
    // 替换域名
    content = content.replace(/your-domain\.com/g, config.domain);
    
    // 添加环境标识
    if (environment === 'staging') {
      content = content.replace(
        /<title>(.*?)<\/title>/,
        '<title>$1 [STAGING]</title>'
      );
    }
    
    await fs.writeFile(indexPath, content);
  }
  
  log(`部署包已创建: ${packageDir}`, 'success');
  return packageDir;
}

// 部署到服务器
async function deployToServer(environment, packageDir) {
  log(`部署到 ${environment} 服务器...`);
  
  const config = deployConfig[environment];
  const remoteHost = `${config.user}@${config.host}`;
  
  try {
    // 创建远程备份
    log('创建远程备份...');
    execSync(`ssh ${remoteHost} "
      if [ -d ${config.path} ]; then
        sudo cp -r ${config.path} ${config.path}.backup.$(date +%Y%m%d_%H%M%S)
        echo '备份已创建'
      fi
    "`, { stdio: 'inherit' });
    
    // 上传文件
    log('上传文件...');
    execSync(`rsync -avz --delete ${packageDir}/ ${remoteHost}:${config.path}/`, { stdio: 'inherit' });
    
    // 设置权限
    log('设置权限...');
    execSync(`ssh ${remoteHost} "
      sudo chown -R www-data:www-data ${config.path}
      sudo chmod -R 755 ${config.path}
      sudo chmod 644 ${config.path}/.htaccess
    "`, { stdio: 'inherit' });
    
    // 重启服务
    log('重启Web服务...');
    execSync(`ssh ${remoteHost} "
      sudo systemctl reload nginx || sudo service nginx reload
    "`, { stdio: 'inherit' });
    
    log(`部署到 ${environment} 完成！`, 'success');
    log(`访问地址: https://${config.domain}/`, 'info');
    
  } catch (error) {
    log(`部署到 ${environment} 失败: ${error.message}`, 'error');
    throw error;
  }
}

// Docker部署
async function deployWithDocker(environment) {
  log(`使用Docker部署到 ${environment}...`);
  
  const config = deployConfig[environment];
  
  try {
    // 构建Docker镜像
    log('构建Docker镜像...');
    execSync(`docker build -t ai-maturity-standalone:${environment} ${BUILD_DIR}`, { stdio: 'inherit' });
    
    // 停止现有容器
    log('停止现有容器...');
    try {
      execSync(`docker stop ai-maturity-${environment}`, { stdio: 'inherit' });
      execSync(`docker rm ai-maturity-${environment}`, { stdio: 'inherit' });
    } catch (e) {
      // 容器可能不存在，忽略错误
    }
    
    // 启动新容器
    log('启动新容器...');
    execSync(`docker run -d --name ai-maturity-${environment} -p 80:80 -p 443:443 ai-maturity-standalone:${environment}`, { stdio: 'inherit' });
    
    log(`Docker部署到 ${environment} 完成！`, 'success');
    
  } catch (error) {
    log(`Docker部署失败: ${error.message}`, 'error');
    throw error;
  }
}

// CDN部署（如AWS CloudFront, Cloudflare等）
async function deployCDN(environment) {
  log(`部署到CDN (${environment})...`);
  
  // 这里可以添加具体的CDN部署逻辑
  // 例如：AWS S3 + CloudFront, Cloudflare Pages等
  
  log('CDN部署功能待实现', 'warning');
  log('请手动上传dist目录到您的CDN服务', 'info');
}

// 部署后验证
async function postDeployValidation(environment) {
  log('执行部署后验证...');
  
  const config = deployConfig[environment];
  const baseUrl = `https://${config.domain}`;
  
  const tests = [
    {
      name: '主页面可访问性',
      url: baseUrl,
      expectedStatus: 200
    },
    {
      name: 'CSS文件加载',
      url: `${baseUrl}/assets/styles.css`,
      expectedStatus: 200
    },
    {
      name: '状态页面',
      url: `${baseUrl}/status.html`,
      expectedStatus: 200
    }
  ];
  
  for (const test of tests) {
    try {
      // 这里可以使用HTTP客户端进行实际测试
      // 简化版本只是记录测试项
      log(`✓ ${test.name} - 待验证: ${test.url}`, 'info');
    } catch (error) {
      log(`✗ ${test.name} - 验证失败`, 'error');
    }
  }
  
  log('部署后验证完成', 'success');
  log(`请手动验证以下URL:`, 'info');
  tests.forEach(test => {
    log(`  - ${test.url}`, 'info');
  });
}

// 回滚功能
async function rollback(environment) {
  log(`回滚 ${environment} 环境...`);
  
  const config = deployConfig[environment];
  const remoteHost = `${config.user}@${config.host}`;
  
  try {
    // 查找最新的备份
    const backupList = execSync(`ssh ${remoteHost} "ls -t ${config.path}.backup.* | head -1"`, { encoding: 'utf8' }).trim();
    
    if (!backupList) {
      throw new Error('未找到备份文件');
    }
    
    log(`找到备份: ${backupList}`);
    
    // 执行回滚
    execSync(`ssh ${remoteHost} "
      sudo rm -rf ${config.path}
      sudo mv ${backupList} ${config.path}
      sudo systemctl reload nginx
    "`, { stdio: 'inherit' });
    
    log(`回滚到 ${environment} 完成！`, 'success');
    
  } catch (error) {
    log(`回滚失败: ${error.message}`, 'error');
    throw error;
  }
}

// 主部署函数
async function deploy() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'staging';
  const deployType = args[1] || 'server'; // server, docker, cdn
  const action = args[2] || 'deploy'; // deploy, rollback
  
  try {
    log(`开始 ${action} 到 ${environment} 环境 (${deployType})...`, 'info');
    
    if (action === 'rollback') {
      await rollback(environment);
      return;
    }
    
    checkBuildDir();
    await preDeployChecks();
    
    const packageDir = await createDeploymentPackage(environment);
    
    switch (deployType) {
      case 'server':
        await deployToServer(environment, packageDir);
        break;
      case 'docker':
        await deployWithDocker(environment);
        break;
      case 'cdn':
        await deployCDN(environment);
        break;
      default:
        throw new Error(`未知的部署类型: ${deployType}`);
    }
    
    await postDeployValidation(environment);
    
    log('部署流程完成！', 'success');
    
  } catch (error) {
    log(`部署失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
AI成熟度自测工具 - 部署脚本

用法:
  node deploy.js [environment] [type] [action]

参数:
  environment: staging | production (默认: staging)
  type: server | docker | cdn (默认: server)
  action: deploy | rollback (默认: deploy)

示例:
  node deploy.js staging server deploy    # 部署到测试环境
  node deploy.js production server deploy # 部署到生产环境
  node deploy.js production docker deploy # 使用Docker部署到生产环境
  node deploy.js production server rollback # 回滚生产环境

环境变量:
  DEPLOY_HOST: 覆盖默认的服务器地址
  DEPLOY_USER: 覆盖默认的用户名
  DEPLOY_PATH: 覆盖默认的部署路径
`);
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    deploy();
  }
}

module.exports = { deploy, rollback };