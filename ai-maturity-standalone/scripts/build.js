#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

const BUILD_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '..');

// 构建配置
const config = {
  // HTML 压缩选项
  htmlMinifyOptions: {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: false,
    minifyCSS: true,
    minifyJS: true
  },
  
  // CSS 压缩选项
  cssMinifyOptions: {
    level: 2,
    returnPromise: false
  },
  
  // JS 压缩选项
  jsMinifyOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug']
    },
    mangle: true,
    format: {
      comments: false
    }
  }
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m',   // red
    reset: '\x1b[0m'     // reset
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

// 清理构建目录
async function cleanBuildDir() {
  log('清理构建目录...');
  await fs.remove(BUILD_DIR);
  await fs.ensureDir(BUILD_DIR);
  log('构建目录已清理', 'success');
}

// 复制静态资源
async function copyAssets() {
  log('复制静态资源...');
  
  const assetDirs = ['assets', 'components', 'utils'];
  
  for (const dir of assetDirs) {
    const srcPath = path.join(SRC_DIR, dir);
    const destPath = path.join(BUILD_DIR, dir);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      log(`已复制 ${dir}/`, 'success');
    }
  }
}

// 处理HTML文件
async function processHTML() {
  log('处理HTML文件...');
  
  const htmlFiles = [
    'index.html',
    'index-working.html',
    'index-minimal.html',
    'index-fixed-simple.html',
    'status.html',
    'test-basic.html',
    'debug-simple.html',
    'working-with-privacy.html',
    'test-privacy-ui.html',
    'test-minimal.html'
  ];
  
  for (const file of htmlFiles) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(BUILD_DIR, file);
    
    if (await fs.pathExists(srcPath)) {
      let content = await fs.readFile(srcPath, 'utf8');
      
      // 替换开发环境的CDN链接为生产环境优化版本
      content = content.replace(
        /https:\/\/resource\.trickle\.so\/vendor_lib\/unpkg\/react@18\/umd\/react\.production\.min\.js/g,
        'https://unpkg.com/react@18/umd/react.production.min.js'
      );
      
      content = content.replace(
        /https:\/\/resource\.trickle\.so\/vendor_lib\/unpkg\/react-dom@18\/umd\/react-dom\.production\.min\.js/g,
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'
      );
      
      content = content.replace(
        /https:\/\/resource\.trickle\.so\/vendor_lib\/unpkg\/@babel\/standalone\/babel\.min\.js/g,
        'https://unpkg.com/@babel/standalone/babel.min.js'
      );
      
      content = content.replace(
        /https:\/\/resource\.trickle\.so\/vendor_lib\/unpkg\/lucide-static@0\.516\.0\/font\/lucide\.css/g,
        'https://unpkg.com/lucide-static@0.516.0/font/lucide.css'
      );
      
      // 添加生产环境的元数据
      content = content.replace(
        /<meta property="og:url" content="">/g,
        '<meta property="og:url" content="https://your-domain.com/ai-maturity-standalone/">'
      );
      
      content = content.replace(
        /<meta property="twitter:url" content="">/g,
        '<meta property="twitter:url" content="https://your-domain.com/ai-maturity-standalone/">'
      );
      
      content = content.replace(
        /<link rel="canonical" href="">/g,
        '<link rel="canonical" href="https://your-domain.com/ai-maturity-standalone/">'
      );
      
      // 压缩HTML
      const minifiedContent = minify(content, config.htmlMinifyOptions);
      
      await fs.writeFile(destPath, minifiedContent);
      log(`已处理 ${file}`, 'success');
    }
  }
}

// 处理CSS文件
async function processCSS() {
  log('处理CSS文件...');
  
  const cssPath = path.join(SRC_DIR, 'assets', 'styles.css');
  const destPath = path.join(BUILD_DIR, 'assets', 'styles.css');
  
  if (await fs.pathExists(cssPath)) {
    const content = await fs.readFile(cssPath, 'utf8');
    const result = new CleanCSS(config.cssMinifyOptions).minify(content);
    
    if (result.errors.length > 0) {
      log(`CSS处理错误: ${result.errors.join(', ')}`, 'error');
    }
    
    await fs.writeFile(destPath, result.styles);
    log('CSS文件已压缩', 'success');
  }
}

// 创建部署配置文件
async function createDeployConfig() {
  log('创建部署配置文件...');
  
  // 创建 .htaccess 文件（Apache）
  const htaccessContent = `# AI成熟度自测工具 - Apache配置

# 启用压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# 安全头
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# 重写规则
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # 强制HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # 移除 .html 扩展名
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^([^\.]+)$ $1.html [NC,L]
</IfModule>`;

  await fs.writeFile(path.join(BUILD_DIR, '.htaccess'), htaccessContent);
  
  // 创建 nginx.conf 文件
  const nginxContent = `# AI成熟度自测工具 - Nginx配置

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;
    
    root /var/www/ai-maturity-standalone;
    index index.html;
    
    # SSL配置
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
    
    # 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 缓存
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \\.(html)$ {
        expires 1h;
        add_header Cache-Control "public";
    }
    
    # 移除 .html 扩展名
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
    
    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}`;

  await fs.writeFile(path.join(BUILD_DIR, 'nginx.conf'), nginxContent);
  
  log('部署配置文件已创建', 'success');
}

// 创建部署脚本
async function createDeployScripts() {
  log('创建部署脚本...');
  
  // 创建部署到服务器的脚本
  const deployScript = `#!/bin/bash

# AI成熟度自测工具 - 部署脚本

set -e

echo "开始部署 AI成熟度自测工具..."

# 配置变量
REMOTE_HOST="your-server.com"
REMOTE_USER="deploy"
REMOTE_PATH="/var/www/ai-maturity-standalone"
LOCAL_BUILD_PATH="./dist"

# 检查构建目录
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "错误: 构建目录不存在，请先运行 npm run build"
    exit 1
fi

# 创建备份
echo "创建远程备份..."
ssh $REMOTE_USER@$REMOTE_HOST "
    if [ -d $REMOTE_PATH ]; then
        sudo cp -r $REMOTE_PATH $REMOTE_PATH.backup.\$(date +%Y%m%d_%H%M%S)
    fi
"

# 上传文件
echo "上传文件到服务器..."
rsync -avz --delete $LOCAL_BUILD_PATH/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# 设置权限
echo "设置文件权限..."
ssh $REMOTE_USER@$REMOTE_HOST "
    sudo chown -R www-data:www-data $REMOTE_PATH
    sudo chmod -R 755 $REMOTE_PATH
"

# 重启服务
echo "重启Web服务..."
ssh $REMOTE_USER@$REMOTE_HOST "
    sudo systemctl reload nginx
"

echo "部署完成！"
echo "访问地址: https://your-domain.com/ai-maturity-standalone/"`;

  await fs.writeFile(path.join(BUILD_DIR, 'deploy.sh'), deployScript);
  
  // 创建Docker配置
  const dockerfileContent = `FROM nginx:alpine

# 复制构建文件
COPY . /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 443

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]`;

  await fs.writeFile(path.join(BUILD_DIR, 'Dockerfile'), dockerfileContent);
  
  // 创建docker-compose.yml
  const dockerComposeContent = `version: '3.8'

services:
  ai-maturity-standalone:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      - NGINX_HOST=your-domain.com
      - NGINX_PORT=80
    restart: unless-stopped
    
  # 可选：添加SSL证书自动更新
  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./certbot-var:/var/lib/letsencrypt
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@domain.com --agree-tos --no-eff-email -d your-domain.com`;

  await fs.writeFile(path.join(BUILD_DIR, 'docker-compose.yml'), dockerComposeContent);
  
  log('部署脚本已创建', 'success');
}

// 生成构建报告
async function generateBuildReport() {
  log('生成构建报告...');
  
  const report = {
    buildTime: new Date().toISOString(),
    version: '1.0.0',
    files: [],
    totalSize: 0
  };
  
  // 递归获取所有文件
  async function getFiles(dir, basePath = '') {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        await getFiles(fullPath, relativePath);
      } else {
        const size = stats.size;
        report.files.push({
          path: relativePath,
          size: size,
          sizeFormatted: formatBytes(size)
        });
        report.totalSize += size;
      }
    }
  }
  
  await getFiles(BUILD_DIR);
  
  report.totalSizeFormatted = formatBytes(report.totalSize);
  report.fileCount = report.files.length;
  
  await fs.writeFile(
    path.join(BUILD_DIR, 'build-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  log(`构建完成！总计 ${report.fileCount} 个文件，大小 ${report.totalSizeFormatted}`, 'success');
}

// 格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 主构建函数
async function build() {
  try {
    log('开始构建 AI成熟度自测工具...', 'info');
    
    await cleanBuildDir();
    await copyAssets();
    await processHTML();
    await processCSS();
    await createDeployConfig();
    await createDeployScripts();
    await generateBuildReport();
    
    log('构建成功完成！', 'success');
    log(`构建输出目录: ${BUILD_DIR}`, 'info');
    
  } catch (error) {
    log(`构建失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  build();
}

module.exports = { build };