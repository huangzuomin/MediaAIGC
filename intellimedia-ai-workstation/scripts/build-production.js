/**
 * 生产环境构建脚本
 * Production Build Script
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class ProductionBuilder {
    constructor() {
        this.config = require('../build.config.js').getBuildConfig('production');
        this.startTime = Date.now();
        this.stats = {
            filesProcessed: 0,
            totalSize: 0,
            compressedSize: 0,
            errors: [],
            warnings: []
        };
    }

    /**
     * 执行完整的生产构建
     */
    async build() {
        console.log('🚀 开始生产环境构建...\n');
        
        try {
            // 1. 清理输出目录
            await this.cleanOutput();
            
            // 2. 复制静态资源
            await this.copyAssets();
            
            // 3. 处理HTML文件
            await this.processHTML();
            
            // 4. 处理CSS文件
            await this.processCSS();
            
            // 5. 处理JavaScript文件
            await this.processJavaScript();
            
            // 6. 优化图片
            await this.optimizeImages();
            
            // 7. 生成Service Worker
            await this.generateServiceWorker();
            
            // 8. 生成资源清单
            await this.generateManifest();
            
            // 9. 压缩文件
            await this.compressFiles();
            
            // 10. 生成构建报告
            await this.generateBuildReport();
            
            console.log('✅ 生产环境构建完成！');
            this.printStats();
            
        } catch (error) {
            console.error('❌ 构建失败:', error);
            process.exit(1);
        }
    }

    /**
     * 清理输出目录
     */
    async cleanOutput() {
        console.log('🧹 清理输出目录...');
        
        try {
            await fs.rmdir(this.config.paths.output, { recursive: true });
        } catch (error) {
            // 目录不存在，忽略错误
        }
        
        await fs.mkdir(this.config.paths.output, { recursive: true });
        await fs.mkdir(path.join(this.config.paths.output, 'assets'), { recursive: true });
        await fs.mkdir(path.join(this.config.paths.output, 'js'), { recursive: true });
    }

    /**
     * 复制静态资源
     */
    async copyAssets() {
        console.log('📁 复制静态资源...');
        
        const assetsDir = this.config.paths.assets;
        const outputAssetsDir = path.join(this.config.paths.output, 'assets');
        
        try {
            const files = await fs.readdir(assetsDir);
            
            for (const file of files) {
                const srcPath = path.join(assetsDir, file);
                const destPath = path.join(outputAssetsDir, file);
                
                const stat = await fs.stat(srcPath);
                if (stat.isFile()) {
                    await fs.copyFile(srcPath, destPath);
                    this.stats.filesProcessed++;
                }
            }
        } catch (error) {
            this.stats.errors.push(`复制资源失败: ${error.message}`);
        }
    }

    /**
     * 处理HTML文件
     */
    async processHTML() {
        console.log('📄 处理HTML文件...');
        
        try {
            const htmlContent = await fs.readFile('index.html', 'utf8');
            let processedHTML = htmlContent;
            
            // 内联关键CSS
            if (this.config.optimization.css.inlineCritical) {
                processedHTML = await this.inlineCriticalCSS(processedHTML);
            }
            
            // 添加资源预加载
            processedHTML = this.addResourcePreloads(processedHTML);
            
            // 添加安全头
            processedHTML = this.addSecurityHeaders(processedHTML);
            
            // 压缩HTML
            if (this.config.optimization.html.minify) {
                processedHTML = this.minifyHTML(processedHTML);
            }
            
            // 添加版本号
            processedHTML = this.addVersionInfo(processedHTML);
            
            await fs.writeFile(
                path.join(this.config.paths.output, 'index.html'),
                processedHTML
            );
            
            this.stats.filesProcessed++;
            
        } catch (error) {
            this.stats.errors.push(`处理HTML失败: ${error.message}`);
        }
    }

    /**
     * 处理CSS文件
     */
    async processCSS() {
        console.log('🎨 处理CSS文件...');
        
        try {
            const cssPath = path.join(this.config.paths.assets, 'styles.css');
            const cssContent = await fs.readFile(cssPath, 'utf8');
            
            let processedCSS = cssContent;
            
            // 添加浏览器前缀
            if (this.config.optimization.css.autoprefixer) {
                processedCSS = this.addAutoprefixes(processedCSS);
            }
            
            // 移除未使用的CSS
            if (this.config.optimization.css.purgeUnused) {
                processedCSS = await this.purgeUnusedCSS(processedCSS);
            }
            
            // 压缩CSS
            if (this.config.optimization.css.minify) {
                processedCSS = this.minifyCSS(processedCSS);
            }
            
            // 添加版本号到文件名
            const hashedFilename = this.addHashToFilename('styles.css', processedCSS);
            
            await fs.writeFile(
                path.join(this.config.paths.output, 'assets', hashedFilename),
                processedCSS
            );
            
            this.stats.filesProcessed++;
            
        } catch (error) {
            this.stats.errors.push(`处理CSS失败: ${error.message}`);
        }
    }

    /**
     * 处理JavaScript文件
     */
    async processJavaScript() {
        console.log('⚡ 处理JavaScript文件...');
        
        try {
            const jsDir = this.config.paths.src;
            await this.processJSDirectory(jsDir);
            
        } catch (error) {
            this.stats.errors.push(`处理JavaScript失败: ${error.message}`);
        }
    }

    /**
     * 递归处理JS目录
     */
    async processJSDirectory(dir) {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await this.processJSDirectory(filePath);
            } else if (file.endsWith('.js')) {
                await this.processJSFile(filePath);
            }
        }
    }

    /**
     * 处理单个JS文件
     */
    async processJSFile(filePath) {
        try {
            const jsContent = await fs.readFile(filePath, 'utf8');
            let processedJS = jsContent;
            
            // 移除注释和调试代码
            if (this.config.optimization.js.compress) {
                processedJS = this.removeDebugCode(processedJS);
            }
            
            // 压缩JavaScript
            if (this.config.optimization.js.minify) {
                processedJS = this.minifyJS(processedJS);
            }
            
            // 计算相对路径
            const relativePath = path.relative(this.config.paths.src, filePath);
            const outputPath = path.join(this.config.paths.output, 'js', relativePath);
            
            // 确保输出目录存在
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            
            // 添加版本号到文件名
            const hashedFilename = this.addHashToFilename(path.basename(outputPath), processedJS);
            const hashedOutputPath = path.join(path.dirname(outputPath), hashedFilename);
            
            await fs.writeFile(hashedOutputPath, processedJS);
            this.stats.filesProcessed++;
            
        } catch (error) {
            this.stats.errors.push(`处理JS文件失败 ${filePath}: ${error.message}`);
        }
    }

    /**
     * 优化图片
     */
    async optimizeImages() {
        console.log('🖼️ 优化图片...');
        
        if (!this.config.optimization.images) {
            return;
        }
        
        try {
            // 这里应该使用实际的图片优化库，如 sharp 或 imagemin
            console.log('图片优化功能需要安装相应的依赖包');
            
        } catch (error) {
            this.stats.warnings.push(`图片优化失败: ${error.message}`);
        }
    }

    /**
     * 生成Service Worker
     */
    async generateServiceWorker() {
        console.log('⚙️ 生成Service Worker...');
        
        const swConfig = this.config.caching.sw;
        
        const swContent = `
// Service Worker v${swConfig.version}
// 自动生成，请勿手动修改

const CACHE_NAME = 'intellimedia-ai-workstation-v${swConfig.version}';
const STATIC_CACHE = 'static-v${swConfig.version}';
const DYNAMIC_CACHE = 'dynamic-v${swConfig.version}';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/styles.css',
    '/js/app.js',
    '/assets/icons.svg'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker 安装中...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('缓存静态资源...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker 安装完成');
                return self.skipWaiting();
            })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker 激活完成');
                return self.clients.claim();
            })
    );
});

// 拦截请求
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }
    
    // HTML文件使用网络优先策略
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }
    
    // 静态资源使用缓存优先策略
    event.respondWith(
        caches.match(request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(request)
                    .then(response => {
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    });
            })
    );
});

// 后台同步
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 推送通知
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/assets/icon-192x192.png',
                badge: '/assets/badge-72x72.png'
            })
        );
    }
});

function doBackgroundSync() {
    // 后台同步逻辑
    return Promise.resolve();
}
`;

        await fs.writeFile(
            path.join(this.config.paths.output, 'sw.js'),
            swContent
        );
        
        this.stats.filesProcessed++;
    }

    /**
     * 生成资源清单
     */
    async generateManifest() {
        console.log('📋 生成资源清单...');
        
        const manifest = {
            name: '智媒AI工作站',
            short_name: '智媒AI',
            description: '为下一代媒体打造的AI操作系统',
            start_url: '/',
            display: 'standalone',
            background_color: '#003366',
            theme_color: '#003366',
            orientation: 'portrait-primary',
            icons: [
                {
                    src: '/assets/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/assets/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            categories: ['business', 'productivity', 'utilities'],
            lang: 'zh-CN',
            dir: 'ltr'
        };
        
        await fs.writeFile(
            path.join(this.config.paths.output, 'site.webmanifest'),
            JSON.stringify(manifest, null, 2)
        );
        
        this.stats.filesProcessed++;
    }

    /**
     * 压缩文件
     */
    async compressFiles() {
        console.log('🗜️ 压缩文件...');
        
        if (!this.config.compression.gzip.enabled && !this.config.compression.brotli.enabled) {
            return;
        }
        
        try {
            // 这里应该使用实际的压缩库
            console.log('文件压缩功能需要安装相应的依赖包');
            
        } catch (error) {
            this.stats.warnings.push(`文件压缩失败: ${error.message}`);
        }
    }

    /**
     * 生成构建报告
     */
    async generateBuildReport() {
        console.log('📊 生成构建报告...');
        
        const buildTime = Date.now() - this.startTime;
        
        const report = {
            timestamp: new Date().toISOString(),
            buildTime: buildTime,
            config: this.config,
            stats: this.stats,
            environment: 'production',
            version: require('../package.json').version || '1.0.0'
        };
        
        await fs.writeFile(
            path.join(this.config.paths.output, 'build-report.json'),
            JSON.stringify(report, null, 2)
        );
    }

    /**
     * 辅助方法
     */
    
    inlineCriticalCSS(html) {
        // 简化实现，实际应该提取关键CSS
        return html.replace(
            '<link rel="stylesheet" href="assets/styles.css">',
            '<style>/* Critical CSS would be inlined here */</style>\n<link rel="preload" href="assets/styles.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">'
        );
    }
    
    addResourcePreloads(html) {
        const preloads = [
            '<link rel="preload" href="/js/app.js" as="script">',
            '<link rel="preload" href="/assets/icons.svg" as="image">',
            '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
            '<link rel="dns-prefetch" href="//www.google-analytics.com">'
        ].join('\n    ');
        
        return html.replace('</head>', `    ${preloads}\n</head>`);
    }
    
    addSecurityHeaders(html) {
        const csp = this.generateCSP();
        const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
        
        return html.replace('</head>', `    ${meta}\n</head>`);
    }
    
    generateCSP() {
        const directives = this.config.security.csp.directives;
        return Object.entries(directives)
            .map(([key, values]) => `${key} ${values.join(' ')}`)
            .join('; ');
    }
    
    minifyHTML(html) {
        return html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/<!--[\s\S]*?-->/g, '')
            .trim();
    }
    
    addVersionInfo(html) {
        const version = require('../package.json').version || '1.0.0';
        const buildTime = new Date().toISOString();
        
        const comment = `<!-- Built: ${buildTime}, Version: ${version} -->`;
        return html.replace('</html>', `${comment}\n</html>`);
    }
    
    addAutoprefixes(css) {
        // 简化实现，实际应该使用autoprefixer
        return css
            .replace(/display: flex/g, 'display: -webkit-box; display: -ms-flexbox; display: flex')
            .replace(/transform:/g, '-webkit-transform: ; transform:');
    }
    
    async purgeUnusedCSS(css) {
        // 简化实现，实际应该分析HTML和JS文件中使用的类名
        console.log('CSS purging需要实际的HTML分析');
        return css;
    }
    
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .trim();
    }
    
    removeDebugCode(js) {
        return js
            .replace(/console\.(log|debug|info|warn)\([^)]*\);?/g, '')
            .replace(/debugger;?/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');
    }
    
    minifyJS(js) {
        // 简化实现，实际应该使用terser或uglify
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .trim();
    }
    
    addHashToFilename(filename, content) {
        const hash = this.generateHash(content).substring(0, 8);
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        return `${name}.${hash}${ext}`;
    }
    
    generateHash(content) {
        // 简化的哈希生成，实际应该使用crypto
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(16);
    }
    
    printStats() {
        const buildTime = Date.now() - this.startTime;
        
        console.log('\n📊 构建统计:');
        console.log('='.repeat(50));
        console.log(`处理文件数: ${this.stats.filesProcessed}`);
        console.log(`构建时间: ${(buildTime / 1000).toFixed(2)}秒`);
        console.log(`错误数: ${this.stats.errors.length}`);
        console.log(`警告数: ${this.stats.warnings.length}`);
        
        if (this.stats.errors.length > 0) {
            console.log('\n❌ 错误:');
            this.stats.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (this.stats.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            this.stats.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        console.log('='.repeat(50));
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const builder = new ProductionBuilder();
    builder.build().catch(console.error);
}

module.exports = ProductionBuilder;