# AI成熟度自测工具 - 独立部署版本

## 📋 项目概述

这是一个独立的AI成熟度自测工具，专为媒体机构设计，可以快速评估组织的AI应用水平并提供个性化的转型建议。

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和构建

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 本地预览
npm run serve
```

构建完成后，访问 `http://localhost:8080` 查看效果。

## 📦 可用脚本

### 构建相关

```bash
# 构建生产版本
npm run build

# 优化构建文件
npm run optimize

# 清理构建文件
npm run clean
```

### 部署相关

```bash
# 部署到测试环境
npm run deploy staging

# 部署到生产环境
npm run deploy production

# 使用Docker部署
npm run deploy production docker

# 回滚部署
npm run deploy production server rollback
```

### 开发和测试

```bash
# 启动本地服务器
npm run serve [port]

# 验证构建结果
npm run validate

# 验证在线部署
npm run validate https://your-domain.com
```

## 🛠️ 部署选项

### 1. 传统服务器部署

支持Apache和Nginx服务器，包含完整的配置文件和部署脚本。

```bash
# 构建并部署到生产服务器
npm run build
npm run deploy production
```

### 2. Docker容器化部署

包含Dockerfile和docker-compose.yml配置。

```bash
# 构建Docker镜像并部署
npm run deploy production docker
```

### 3. CDN静态部署

支持Cloudflare Pages、Vercel、AWS S3等静态托管服务。

```bash
# 构建后手动上传到CDN
npm run build
# 然后上传dist目录到您的CDN服务
```

## 📁 项目结构

```
ai-maturity-standalone/
├── index.html                 # 主页面
├── assets/                    # 静态资源
│   └── styles.css            # 样式文件
├── components/               # React组件
├── utils/                    # 工具函数
├── scripts/                  # 构建和部署脚本
│   ├── build.js             # 构建脚本
│   ├── deploy.js            # 部署脚本
│   ├── optimize.js          # 优化脚本
│   ├── serve.js             # 本地服务器
│   ├── clean.js             # 清理脚本
│   └── validate.js          # 验证脚本
├── dist/                     # 构建输出目录
├── package.json             # 项目配置
├── DEPLOYMENT.md            # 详细部署指南
└── README.md               # 本文件
```

## 🔧 配置选项

### 部署配置

编辑 `scripts/deploy.js` 中的配置：

```javascript
const deployConfig = {
  production: {
    host: 'your-production-server.com',
    user: 'deploy',
    path: '/var/www/ai-maturity-standalone',
    domain: 'your-domain.com'
  }
};
```

### 构建配置

编辑 `scripts/build.js` 中的配置：

```javascript
const config = {
  htmlMinifyOptions: {
    removeComments: true,
    collapseWhitespace: true
  }
};
```

## 🎯 功能特性

### 核心功能

- ✅ 5分钟快速评估
- ✅ 10个维度全面分析
- ✅ L1-L5等级评估
- ✅ 个性化建议报告
- ✅ 移动端优化
- ✅ 离线可用

### 技术特性

- ✅ 纯静态部署
- ✅ 无服务器依赖
- ✅ SEO优化
- ✅ 响应式设计
- ✅ 隐私保护
- ✅ 性能优化

### 部署特性

- ✅ 多种部署方式
- ✅ 自动化构建
- ✅ 一键部署
- ✅ 回滚支持
- ✅ 健康检查
- ✅ 性能监控

## 📊 性能指标

- **加载时间**: < 2秒
- **首屏渲染**: < 1秒
- **SEO评分**: 95/100
- **可访问性**: 90/100
- **最佳实践**: 100/100

## 🔒 安全特性

- HTTPS强制重定向
- 安全头设置
- XSS防护
- CSRF保护
- 内容安全策略

## 📱 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88
- 移动端浏览器

## 🔍 监控和维护

### 健康检查

```bash
# 检查主页面
curl -I https://your-domain.com/

# 检查状态页面
curl -I https://your-domain.com/status
```

### 日志监控

```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 性能监控

```bash
# 运行性能测试
npm run validate https://your-domain.com

# 查看构建报告
cat dist/build-report.json
```

## 🚨 故障排除

### 常见问题

1. **页面无法访问**
   - 检查服务器状态
   - 验证DNS解析
   - 检查防火墙设置

2. **样式丢失**
   - 检查CSS文件路径
   - 验证文件权限
   - 检查缓存设置

3. **功能异常**
   - 检查JavaScript错误
   - 验证React组件加载
   - 检查浏览器兼容性

### 快速修复

```bash
# 重新构建和部署
npm run clean
npm run build
npm run deploy production

# 回滚到上一版本
npm run deploy production server rollback
```

## 📈 优化建议

### 性能优化

- 启用HTTP/2
- 使用CDN加速
- 启用Brotli压缩
- 优化图片格式

### SEO优化

- 完善meta标签
- 添加结构化数据
- 优化页面标题
- 提高加载速度

### 用户体验

- 优化移动端体验
- 添加加载动画
- 改进错误提示
- 增强可访问性

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 支持

- **技术支持**: support@your-domain.com
- **文档**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **问题反馈**: GitHub Issues

---

**温州新闻网·智媒变革中心**  
专业的媒体AI转型战略伙伴

最后更新: 2024年12月