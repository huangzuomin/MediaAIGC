# 智媒AI工作站 - 部署指南

## 概述

本文档提供了智媒AI工作站项目的完整部署指南，包括开发环境、测试环境和生产环境的部署流程。

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [构建配置](#构建配置)
- [部署流程](#部署流程)
- [环境配置](#环境配置)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

## 环境要求

### 基础要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Git**: >= 2.20.0
- **操作系统**: Linux/macOS/Windows

### 生产环境要求

- **服务器**: 2核CPU, 4GB内存, 20GB存储
- **网络**: 带宽 >= 10Mbps
- **域名**: 已备案的域名（中国大陆）
- **SSL证书**: 有效的HTTPS证书
- **CDN**: 推荐使用阿里云CDN或腾讯云CDN

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-org/intellimedia-ai-workstation.git
cd intellimedia-ai-workstation
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

### 4. 开发环境启动

```bash
npm run dev
```

### 5. 构建生产版本

```bash
npm run build
```

### 6. 部署到生产环境

```bash
npm run deploy:production
```

## 构建配置

### 配置文件结构

```
build.config.js          # 主构建配置
├── environment          # 环境特定配置
├── paths                # 文件路径配置
├── optimization         # 优化配置
├── caching              # 缓存策略
├── cdn                  # CDN配置
├── compression          # 压缩配置
├── security             # 安全配置
├── monitoring           # 监控配置
└── deployment           # 部署配置
```

### 环境配置

#### 开发环境 (development)

```javascript
{
  minify: false,
  compress: false,
  sourceMaps: true,
  removeComments: false,
  optimizeImages: false,
  bundleAnalysis: false
}
```

#### 生产环境 (production)

```javascript
{
  minify: true,
  compress: true,
  sourceMaps: false,
  removeComments: true,
  optimizeImages: true,
  bundleAnalysis: true
}
```

## 部署流程

### 自动化部署

项目提供了完整的自动化部署脚本，支持以下环境：

- **开发环境** (development)
- **测试环境** (staging)
- **生产环境** (production)

### 部署步骤

1. **预部署检查**
   - 验证构建配置
   - 检查环境变量
   - 验证Git状态
   - 安全漏洞扫描

2. **项目构建**
   - 清理输出目录
   - 处理HTML/CSS/JS文件
   - 优化图片资源
   - 生成Service Worker

3. **测试验证**
   - 单元测试
   - 端到端测试
   - 性能测试
   - 可访问性测试

4. **资源上传**
   - 上传静态资源到CDN
   - 配置缓存策略
   - 设置压缩选项

5. **服务器部署**
   - 创建部署包
   - 上传到服务器
   - 配置Web服务器
   - 更新负载均衡

6. **基础设施更新**
   - 更新CDN配置
   - 配置DNS解析
   - 设置SSL证书

7. **健康检查**
   - 页面可访问性检查
   - API健康检查
   - 性能指标验证

8. **部署完成**
   - 生成部署报告
   - 发送通知
   - 记录部署日志

### 部署命令

```bash
# 部署到开发环境
npm run deploy:dev

# 部署到测试环境
npm run deploy:staging

# 部署到生产环境
npm run deploy:production

# 回滚部署
npm run rollback

# 查看部署状态
npm run deploy:status
```

## 环境配置

### 环境变量

创建 `.env` 文件并配置以下变量：

```bash
# 基础配置
NODE_ENV=production
APP_VERSION=1.0.0
APP_URL=https://intellimedia-ai-workstation.com

# CDN配置
CDN_ENABLED=true
CDN_BASE_URL=https://cdn.intellimedia-ai-workstation.com
CDN_ACCESS_KEY=your_access_key
CDN_SECRET_KEY=your_secret_key

# 服务器配置
DEPLOY_SERVER_HOST=your.server.com
DEPLOY_SERVER_USER=deploy
DEPLOY_SERVER_PATH=/var/www/html

# 数据库配置（如果需要）
DB_HOST=localhost
DB_PORT=3306
DB_NAME=intellimedia
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# 监控配置
GOOGLE_ANALYTICS_ID=GA_TRACKING_ID
BAIDU_ANALYTICS_ID=BAIDU_SITE_ID
SENTRY_DSN=your_sentry_dsn

# 通知配置
SLACK_WEBHOOK_URL=your_slack_webhook
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_USER=your_email
EMAIL_SMTP_PASSWORD=your_password
```

### Nginx配置

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name intellimedia-ai-workstation.com www.intellimedia-ai-workstation.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name intellimedia-ai-workstation.com www.intellimedia-ai-workstation.com;

    # SSL配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # 根目录
    root /var/www/html;
    index index.html;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 启用gzip压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/css application/javascript image/svg+xml;
    }

    # HTML文件缓存
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # 主页面
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 安全配置
    location ~ /\. {
        deny all;
    }

    location ~ ~$ {
        deny all;
    }
}
```

### CDN配置

#### 阿里云CDN配置示例

```javascript
{
  "domain": "cdn.intellimedia-ai-workstation.com",
  "origins": [
    {
      "content": "intellimedia-ai-workstation.com",
      "type": "domain",
      "port": 443,
      "priority": "20",
      "weight": "10"
    }
  ],
  "cacheRules": [
    {
      "pathPattern": "*.css,*.js,*.png,*.jpg,*.jpeg,*.gif,*.ico,*.svg,*.woff,*.woff2,*.ttf,*.eot",
      "cacheTime": 31536000,
      "ignoreQueryString": true
    },
    {
      "pathPattern": "*.html",
      "cacheTime": 3600,
      "ignoreQueryString": false
    }
  ],
  "compression": {
    "enable": true,
    "types": ["text/css", "application/javascript", "text/html", "image/svg+xml"]
  },
  "https": {
    "enable": true,
    "forceRedirect": true
  }
}
```

## 监控和维护

### 性能监控

1. **Core Web Vitals监控**
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. **自定义指标**
   - 页面加载时间
   - 资源加载时间
   - 用户交互响应时间

3. **错误监控**
   - JavaScript错误
   - 网络请求错误
   - 资源加载失败

### 日志管理

```bash
# 查看部署日志
tail -f /var/log/deployment.log

# 查看Nginx访问日志
tail -f /var/log/nginx/access.log

# 查看Nginx错误日志
tail -f /var/log/nginx/error.log

# 查看系统资源使用
htop
df -h
free -m
```

### 备份策略

1. **代码备份**
   - Git仓库自动备份
   - 定期创建发布标签

2. **配置备份**
   - 服务器配置文件备份
   - 数据库配置备份

3. **静态资源备份**
   - CDN资源备份
   - 本地资源备份

### 更新流程

1. **准备更新**
   ```bash
   git pull origin main
   npm install
   npm run test
   ```

2. **构建新版本**
   ```bash
   npm run build
   ```

3. **部署更新**
   ```bash
   npm run deploy:production
   ```

4. **验证更新**
   ```bash
   npm run health-check
   ```

## 故障排除

### 常见问题

#### 1. 构建失败

**问题**: 构建过程中出现错误

**解决方案**:
```bash
# 清理缓存
npm run clean
rm -rf node_modules
npm install

# 检查Node.js版本
node --version
npm --version

# 重新构建
npm run build
```

#### 2. 部署失败

**问题**: 部署过程中连接服务器失败

**解决方案**:
```bash
# 检查服务器连接
ssh user@your.server.com

# 检查服务器磁盘空间
df -h

# 检查服务器内存
free -m

# 检查服务器进程
ps aux | grep nginx
```

#### 3. 页面无法访问

**问题**: 部署后页面无法正常访问

**解决方案**:
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 检查防火墙
sudo ufw status
```

#### 4. CDN资源加载失败

**问题**: 静态资源无法从CDN加载

**解决方案**:
```bash
# 检查CDN配置
curl -I https://cdn.intellimedia-ai-workstation.com/assets/styles.css

# 检查DNS解析
nslookup cdn.intellimedia-ai-workstation.com

# 重新上传资源
npm run upload:cdn
```

### 性能问题

#### 1. 页面加载慢

**诊断步骤**:
1. 使用Chrome DevTools分析网络请求
2. 检查资源大小和加载时间
3. 分析关键渲染路径
4. 检查CDN缓存命中率

**优化方案**:
```bash
# 优化图片
npm run optimize:images

# 压缩资源
npm run compress

# 分析包大小
npm run analyze
```

#### 2. 内存使用过高

**诊断步骤**:
```bash
# 检查内存使用
free -m
ps aux --sort=-%mem | head

# 检查Node.js进程
ps aux | grep node
```

**优化方案**:
- 优化JavaScript代码
- 减少内存泄漏
- 使用更高效的算法

### 安全问题

#### 1. SSL证书过期

**解决方案**:
```bash
# 检查证书有效期
openssl x509 -in certificate.crt -text -noout | grep "Not After"

# 更新证书
sudo certbot renew

# 重启Nginx
sudo systemctl restart nginx
```

#### 2. 安全漏洞

**解决方案**:
```bash
# 扫描依赖漏洞
npm audit

# 修复漏洞
npm audit fix

# 更新依赖
npm update
```

## 最佳实践

### 部署最佳实践

1. **版本控制**
   - 使用语义化版本号
   - 为每个发布创建Git标签
   - 维护详细的变更日志

2. **测试策略**
   - 在部署前运行完整测试套件
   - 使用自动化测试
   - 进行性能回归测试

3. **渐进式部署**
   - 使用蓝绿部署策略
   - 实施金丝雀发布
   - 准备快速回滚方案

4. **监控和告警**
   - 设置关键指标监控
   - 配置告警通知
   - 建立事故响应流程

### 安全最佳实践

1. **HTTPS配置**
   - 使用强加密算法
   - 启用HSTS
   - 配置安全头

2. **访问控制**
   - 限制服务器访问权限
   - 使用SSH密钥认证
   - 定期更新密码

3. **数据保护**
   - 加密敏感数据
   - 定期备份数据
   - 实施访问日志记录

### 性能最佳实践

1. **资源优化**
   - 压缩CSS和JavaScript
   - 优化图片格式和大小
   - 使用CDN分发静态资源

2. **缓存策略**
   - 设置合适的缓存头
   - 使用浏览器缓存
   - 实施Service Worker缓存

3. **代码优化**
   - 减少HTTP请求数量
   - 使用代码分割
   - 延迟加载非关键资源

## 支持和联系

如果在部署过程中遇到问题，请通过以下方式获取支持：

- **技术文档**: [https://docs.intellimedia-ai-workstation.com](https://docs.intellimedia-ai-workstation.com)
- **问题反馈**: [https://github.com/your-org/intellimedia-ai-workstation/issues](https://github.com/your-org/intellimedia-ai-workstation/issues)
- **技术支持**: support@intellimedia-ai-workstation.com
- **社区讨论**: [https://community.intellimedia-ai-workstation.com](https://community.intellimedia-ai-workstation.com)

---

**版本**: 1.0.0  
**更新时间**: 2024年1月  
**维护者**: 智媒AI工作站开发团队