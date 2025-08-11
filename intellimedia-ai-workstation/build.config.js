/**
 * 生产环境构建配置
 * Production Build Configuration
 */

const BuildConfig = {
    // 构建环境配置
    environment: {
        production: {
            minify: true,
            compress: true,
            sourceMaps: false,
            removeComments: true,
            optimizeImages: true,
            bundleAnalysis: true
        },
        development: {
            minify: false,
            compress: false,
            sourceMaps: true,
            removeComments: false,
            optimizeImages: false,
            bundleAnalysis: false
        }
    },

    // 文件路径配置
    paths: {
        src: './js',
        assets: './assets',
        output: './dist',
        temp: './temp'
    },

    // 优化配置
    optimization: {
        // CSS优化
        css: {
            minify: true,
            autoprefixer: true,
            purgeUnused: true,
            inlineCritical: true,
            extractCritical: true
        },
        
        // JavaScript优化
        js: {
            minify: true,
            mangle: true,
            compress: true,
            treeshake: true,
            splitChunks: true,
            moduleConcat: true
        },
        
        // HTML优化
        html: {
            minify: true,
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true
        },
        
        // 图片优化
        images: {
            webp: true,
            avif: false, // 可选，支持度还不够广
            quality: 85,
            progressive: true,
            optimizationLevel: 7
        }
    },

    // 缓存策略
    caching: {
        // 静态资源缓存
        static: {
            css: '1y', // 1年
            js: '1y',
            images: '1y',
            fonts: '1y'
        },
        
        // HTML缓存
        html: '1h', // 1小时
        
        // API缓存
        api: '5m', // 5分钟
        
        // Service Worker缓存
        sw: {
            version: '1.0.0',
            cacheFirst: ['images', 'fonts', 'css'],
            networkFirst: ['html', 'api'],
            staleWhileRevalidate: ['js']
        }
    },

    // CDN配置
    cdn: {
        enabled: true,
        baseUrl: 'https://cdn.intellimedia-ai-workstation.com',
        domains: {
            static: 'static.intellimedia-ai-workstation.com',
            images: 'images.intellimedia-ai-workstation.com',
            api: 'api.intellimedia-ai-workstation.com'
        },
        
        // 资源分发策略
        distribution: {
            css: 'static',
            js: 'static',
            images: 'images',
            fonts: 'static'
        }
    },

    // 压缩配置
    compression: {
        gzip: {
            enabled: true,
            level: 9,
            threshold: 1024 // 1KB以上的文件才压缩
        },
        
        brotli: {
            enabled: true,
            quality: 11,
            threshold: 1024
        }
    },

    // 安全配置
    security: {
        csp: {
            enabled: true,
            directives: {
                'default-src': ["'self'"],
                'script-src': ["'self'", "'unsafe-inline'", 'https://www.google-analytics.com'],
                'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                'font-src': ["'self'", 'https://fonts.gstatic.com'],
                'img-src': ["'self'", 'data:', 'https:'],
                'connect-src': ["'self'", 'https://api.intellimedia-ai-workstation.com']
            }
        },
        
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
    },

    // 监控配置
    monitoring: {
        analytics: {
            google: {
                enabled: true,
                trackingId: 'GA_TRACKING_ID'
            },
            baidu: {
                enabled: true,
                siteId: 'BAIDU_SITE_ID'
            }
        },
        
        performance: {
            enabled: true,
            sampleRate: 0.1, // 10%采样率
            vitals: true,
            errors: true
        },
        
        sentry: {
            enabled: true,
            dsn: 'SENTRY_DSN',
            environment: 'production'
        }
    },

    // 部署配置
    deployment: {
        // 静态文件部署
        static: {
            provider: 'cdn', // 或 's3', 'oss' 等
            bucket: 'intellimedia-static',
            region: 'cn-beijing'
        },
        
        // 域名配置
        domains: {
            production: 'https://intellimedia-ai-workstation.com',
            staging: 'https://staging.intellimedia-ai-workstation.com',
            development: 'http://localhost:3000'
        },
        
        // SSL配置
        ssl: {
            enabled: true,
            hsts: true,
            redirect: true
        }
    }
};

// 根据环境获取配置
function getBuildConfig(env = 'production') {
    const config = { ...BuildConfig };
    
    // 应用环境特定配置
    if (config.environment[env]) {
        Object.assign(config, config.environment[env]);
    }
    
    return config;
}

// 验证配置
function validateConfig(config) {
    const required = ['paths', 'optimization', 'caching'];
    
    for (const key of required) {
        if (!config[key]) {
            throw new Error(`Missing required configuration: ${key}`);
        }
    }
    
    return true;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BuildConfig,
        getBuildConfig,
        validateConfig
    };
} else {
    window.BuildConfig = BuildConfig;
    window.getBuildConfig = getBuildConfig;
    window.validateConfig = validateConfig;
}