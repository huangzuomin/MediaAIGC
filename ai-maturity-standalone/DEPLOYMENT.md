# AI成熟度自测工具 - 部署指南

## 📋 概述

本文档详细说明了如何部署AI成熟度自测工具到生产环境。该工具支持多种部署方式，包括传统服务器部署、Docker容器化部署和CDN静态部署。

## 🚀 快速开始

### 1. 环境准备

确保您的系统已安装以下软件：

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Git** (用于版本控制)

### 2. 安装依赖

```bash
cd ai-maturity-standalone
npm install
```

### 3. 构建项目

```bash
npm run build
```

构建完成后，所有文件将输出到 `dist/` 目录。

## 🛠️ 部署方式

### 方式一：传统服务器部署

#### Apache服务器

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传文件**
   ```bash
   # 手动上传dist目录内容到服务器
   scp -r dist/* user@server:/var/www/ai-maturity-standalone/
   ```

3. **配置Apache**
   ```apache
   <VirtualHost *:80>
       ServerName your-domain.com
       DocumentRoot /var/www/ai-maturity-standalone
       
       # 重定向到HTTPS
       RewriteEngine On
       RewriteCond %{HTTPS} off
       RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   </VirtualHost>
   
   <VirtualHost *:443>
       ServerName your-domain.com
       DocumentRoot /var/www/ai-maturity-standalone
       
       # SSL配置
       SSLEngine on
       SSLCertificateFile /path/to/certificate.crt
       SSLCertificateKeyFile /path/to/private.key
       
       # 包含.htaccess规则
       AllowOverride All
   </VirtualHost>
   ```

#### Nginx服务器

1. **构建和上传**
   ```bash
   npm run build
   npm run deploy staging  # 部署到测试环境
   npm run deploy production  # 部署到生产环境
   ```

2. **Nginx配置**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       root /var/www/ai-maturity-standalone;
       index index.html;
       
       # SSL配置
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       # 安全头
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       
       # 压缩
       gzip on;
       gzip_types text/css application/javascript text/html;
       
       # 缓存
       location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
       
       # 移除.html扩展名
       location / {
           try_files $uri $uri.html $uri/ =404;
       }
   }
   ```

### 方式二：Docker部署

#### 使用预构建的Docker配置

1. **构建项目**
   ```bash
   npm run build
   ```

2. **构建Docker镜像**
   ```bash
   cd dist
   docker build -t ai-maturity-standalone .
   ```

3. **运行容器**
   ```bash
   docker run -d \
     --name ai-maturity-app \
     -p 80:80 \
     -p 443:443 \
     ai-maturity-standalone
   ```

#### 使用Docker Compose

1. **配置环境变量**
   ```bash
   # 创建.env文件
   echo "DOMAIN=your-domain.com" > .env
   echo "EMAIL=your-email@domain.com" >> .env
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

### 方式三：CDN静态部署

#### Cloudflare Pages

1. **连接Git仓库**
   - 登录Cloudflare Dashboard
   - 选择Pages > Create a project
   - 连接您的Git仓库

2. **配置构建设置**
   ```yaml
   Build command: npm run build
   Build output directory: dist
   Root directory: ai-maturity-standalone
   ```

3. **环境变量**
   ```
   NODE_VERSION=18
   ```

#### Vercel部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel --prod
   ```

3. **配置文件** (`vercel.json`)
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "buildCommand": "npm run build",
           "outputDirectory": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/dist/$1"
       }
     ]
   }
   ```

#### AWS S3 + CloudFront

1. **创建S3存储桶**
   ```bash
   aws s3 mb s3://ai-maturity-standalone
   ```

2. **上传文件**
   ```bash
   npm run build
   aws s3 sync dist/ s3://ai-maturity-standalone --delete
   ```

3. **配置CloudFront**
   - 创建CloudFront分发
   - 设置S3为源
   - 配置缓存行为
   - 启用压缩

## ⚙️ 配置选项

### 环境变量

在部署前，您可以通过修改以下配置来自定义部署：

```bash
# 域名配置
DOMAIN=your-domain.com

# SSL证书路径
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key

# 部署用户和服务器
DEPLOY_USER=deploy
DEPLOY_HOST=your-server.com
DEPLOY_PATH=/var/www/ai-maturity-standalone
```

### 自定义构建配置

编辑 `scripts/build.js` 文件来自定义构建过程：

```javascript
// 修改压缩选项
const config = {
  htmlMinifyOptions: {
    removeComments: true,
    collapseWhitespace: true,
    // 添加更多选项...
  }
};
```

## 🔧 部署脚本

### 可用命令

```bash
# 构建项目
npm run build

# 部署到测试环境
npm run deploy staging

# 部署到生产环境
npm run deploy production

# 使用Docker部署
npm run deploy production docker

# 优化构建文件
npm run optimize

# 本地预览
npm run serve

# 清理构建文件
npm run clean

# 验证部署
npm run validate
```

### 自动化部署

#### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      working-directory: ai-maturity-standalone
    
    - name: Build project
      run: npm run build
      working-directory: ai-maturity-standalone
    
    - name: Deploy to server
      run: npm run deploy production
      working-directory: ai-maturity-standalone
      env:
        DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## 🔍 监控和维护

### 健康检查

部署后，您可以通过以下URL进行健康检查：

- **主页面**: `https://your-domain.com/`
- **状态页面**: `https://your-domain.com/status`
- **API健康检查**: `https://your-domain.com/health` (如果实现)

### 日志监控

#### Nginx访问日志

```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 分析访问统计
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
```

#### 错误监控

设置错误监控和告警：

```bash
# 监控404错误
grep "404" /var/log/nginx/access.log | tail -10

# 监控5xx错误
grep "50[0-9]" /var/log/nginx/access.log | tail -10
```

### 性能监控

#### 使用Google PageSpeed Insights

```bash
# 检查页面性能
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://your-domain.com/"
```

#### 使用Lighthouse CI

```bash
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

## 🔒 安全配置

### SSL/TLS配置

确保使用强加密套件：

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
```

### 安全头

确保设置了所有必要的安全头：

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 防火墙配置

```bash
# 只允许HTTP和HTTPS流量
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 🚨 故障排除

### 常见问题

#### 1. 页面无法访问

**症状**: 浏览器显示"无法访问此网站"

**解决方案**:
```bash
# 检查服务状态
systemctl status nginx

# 检查端口监听
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# 检查防火墙
ufw status
```

#### 2. CSS/JS文件404错误

**症状**: 页面显示但样式丢失

**解决方案**:
```bash
# 检查文件权限
ls -la /var/www/ai-maturity-standalone/assets/

# 检查Nginx配置
nginx -t

# 重新构建和部署
npm run build
npm run deploy production
```

#### 3. SSL证书错误

**症状**: 浏览器显示"不安全连接"

**解决方案**:
```bash
# 检查证书有效期
openssl x509 -in /path/to/certificate.crt -text -noout

# 更新Let's Encrypt证书
certbot renew

# 重启Nginx
systemctl reload nginx
```

### 回滚部署

如果部署出现问题，可以快速回滚：

```bash
# 回滚到上一个版本
npm run deploy production server rollback

# 或手动回滚
ssh user@server "
  sudo rm -rf /var/www/ai-maturity-standalone
  sudo mv /var/www/ai-maturity-standalone.backup.YYYYMMDD_HHMMSS /var/www/ai-maturity-standalone
  sudo systemctl reload nginx
"
```

## 📊 性能优化

### 缓存策略

```nginx
# 静态资源长期缓存
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML文件短期缓存
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

### 压缩配置

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

### CDN配置

如果使用CDN，确保正确配置缓存规则：

```javascript
// Cloudflare Page Rules示例
{
  "pattern": "your-domain.com/*.html",
  "cache_level": "standard",
  "edge_cache_ttl": 3600
}
```

## 📝 更新日志

### v1.0.0 (2024-12-XX)
- 初始部署配置
- 支持Apache和Nginx
- Docker容器化支持
- CDN部署选项
- 自动化部署脚本

---

## 📞 支持

如果您在部署过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查项目的GitHub Issues
3. 联系技术支持团队

**技术支持**: support@your-domain.com  
**文档更新**: 2024年12月