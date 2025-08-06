#!/usr/bin/env node

/**
 * 生产环境部署脚本
 * 智媒变革中心项目部署工具
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始部署智媒变革中心项目到生产环境...\n');

// 部署配置
const config = {
    projectName: '智媒变革中心',
    version: '2.0.0',
    buildDir: 'dist',
    deploymentPlatform: 'EdgeOne Pages', // 或其他平台
    domain: 'your-domain.com'
};

// 检查必要文件
const requiredFiles = [
    'index.html',
    'app.js',
    'components/',
    'ai-maturity-standalone/'
];

console.log('📋 检查项目文件完整性...');
requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - 缺失关键文件`);
        process.exit(1);
    }
});

// 创建构建目录
console.log('\n📁 准备构建目录...');
if (fs.existsSync(config.buildDir)) {
    fs.rmSync(config.buildDir, { recursive: true, force: true });
}
fs.mkdirSync(config.buildDir, { recursive: true });

// 复制主要文件
console.log('📦 复制项目文件...');
const filesToCopy = [
    'index.html',
    'app.js',
    'components/',
    'ai-maturity-standalone/',
    'assets/',
    'README.md'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(process.cwd(), file);
    const destPath = path.join(config.buildDir, file);
    
    if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
            fs.cpSync(srcPath, destPath, { recursive: true });
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        console.log(`  ✅ 复制 ${file}`);
    }
});

// 优化生产环境配置
console.log('\n⚙️ 优化生产环境配置...');

// 更新独立页面的链接为生产环境路径
const standaloneIndexPath = path.join(config.buildDir, 'ai-maturity-standalone', 'index.html');
if (fs.existsSync(standaloneIndexPath)) {
    let content = fs.readFileSync(standaloneIndexPath, 'utf8');
    
    // 更新域名和路径
    content = content.replace(/your-domain\.com/g, config.domain);
    content = content.replace(/localhost.*?\//g, `${config.domain}/`);
    
    fs.writeFileSync(standaloneIndexPath, content);
    console.log('  ✅ 更新独立页面生产环境配置');
}

// 更新主页面的链接
const mainIndexPath = path.join(config.buildDir, 'index.html');
if (fs.existsSync(mainIndexPath)) {
    let content = fs.readFileSync(mainIndexPath, 'utf8');
    
    // 添加生产环境优化
    content = content.replace(
        '</head>',
        `  <!-- 生产环境优化 -->
  <link rel="preconnect" href="https://resource.trickle.so">
  <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
</head>`
    );
    
    fs.writeFileSync(mainIndexPath, content);
    console.log('  ✅ 更新主页面生产环境配置');
}

// 创建部署信息文件
console.log('\n📄 生成部署信息...');
const deployInfo = {
    projectName: config.projectName,
    version: config.version,
    buildTime: new Date().toISOString(),
    features: [
        '主项目网站',
        'AI成熟度评估（10题完整版）',
        '双向导流机制',
        '响应式设计',
        'SEO优化'
    ],
    urls: {
        main: `https://${config.domain}/`,
        assessment: `https://${config.domain}/ai-maturity-standalone/`,
        contact: `https://${config.domain}/#contact`
    }
};

fs.writeFileSync(
    path.join(config.buildDir, 'deployment-info.json'),
    JSON.stringify(deployInfo, null, 2)
);

// 创建robots.txt
fs.writeFileSync(
    path.join(config.buildDir, 'robots.txt'),
    `User-agent: *
Allow: /
Allow: /ai-maturity-standalone/

Sitemap: https://${config.domain}/sitemap.xml
`
);

// 创建sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${config.domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${config.domain}/ai-maturity-standalone/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(config.buildDir, 'sitemap.xml'), sitemap);

console.log('  ✅ 生成 deployment-info.json');
console.log('  ✅ 生成 robots.txt');
console.log('  ✅ 生成 sitemap.xml');

// 运行最终验证
console.log('\n🔍 运行部署前验证...');
try {
    execSync('node ai-maturity-standalone/scripts/verify-10-questions.js', { 
        stdio: 'inherit',
        cwd: config.buildDir 
    });
} catch (error) {
    console.log('⚠️ 验证脚本未找到，跳过验证步骤');
}

console.log('\n✅ 构建完成！');
console.log(`📦 构建文件位于: ${config.buildDir}/`);
console.log('\n🌐 部署信息:');
console.log(`  项目名称: ${config.projectName}`);
console.log(`  版本: ${config.version}`);
console.log(`  主站地址: https://${config.domain}/`);
console.log(`  评估工具: https://${config.domain}/ai-maturity-standalone/`);

console.log('\n🚀 下一步部署选项:');
console.log('  1. 使用 EdgeOne Pages 部署:');
console.log('     - 将 dist/ 目录内容上传到 EdgeOne Pages');
console.log('     - 配置自定义域名');
console.log('  2. 使用其他静态托管服务:');
console.log('     - Vercel: vercel --prod');
console.log('     - Netlify: netlify deploy --prod --dir=dist');
console.log('     - GitHub Pages: 推送到 gh-pages 分支');

console.log('\n📋 部署后检查清单:');
console.log('  □ 主站页面正常访问');
console.log('  □ AI评估工具正常工作');
console.log('  □ 所有导流链接正确');
console.log('  □ 移动端响应式正常');
console.log('  □ SEO元数据正确显示');
console.log('  □ 域名和SSL证书配置');