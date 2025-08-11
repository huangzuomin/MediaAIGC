/**
 * 前端错误处理和监控系统
 * Frontend Error Handling and Monitoring System
 */

class ErrorHandler {
    constructor() {
        this.errorQueue = [];
        this.maxQueueSize = 50;
        this.reportingEndpoint = '/api/errors'; // 可配置的错误上报端点
        this.init();
    }

    /**
     * 初始化错误处理系统
     */
    init() {
        this.setupGlobalErrorHandlers();
        this.setupUnhandledRejectionHandler();
        this.setupResourceErrorHandlers();
        this.startPerformanceMonitoring();
    }

    /**
     * 设置全局JavaScript错误处理
     */
    setupGlobalErrorHandlers() {
        window.addEventListener('error', (event) => {
            this.handleJavaScriptError({
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
    }

    /**
     * 设置未处理的Promise拒绝处理
     */
    setupUnhandledRejectionHandler() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection({
                type: 'unhandled_promise_rejection',
                reason: event.reason,
                promise: event.promise,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        });
    }

    /**
     * 设置资源加载错误处理
     */
    setupResourceErrorHandlers() {
        // 图片加载错误处理
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                this.handleImageError(event.target);
            } else if (event.target.tagName === 'LINK' && event.target.rel === 'stylesheet') {
                this.handleStylesheetError(event.target);
            } else if (event.target.tagName === 'SCRIPT') {
                this.handleScriptError(event.target);
            }
        }, true);
    }

    /**
     * 处理JavaScript错误
     */
    handleJavaScriptError(errorInfo) {
        console.error('JavaScript Error:', errorInfo);
        this.queueError(errorInfo);
        
        // 显示用户友好的错误提示（如果是关键错误）
        if (this.isCriticalError(errorInfo)) {
            this.showUserErrorMessage('页面遇到了一些问题，请刷新页面重试');
        }
    }

    /**
     * 处理Promise拒绝错误
     */
    handlePromiseRejection(errorInfo) {
        console.error('Unhandled Promise Rejection:', errorInfo);
        this.queueError(errorInfo);
    }

    /**
     * 处理图片加载错误
     */
    handleImageError(imgElement) {
        const originalSrc = imgElement.src;
        
        // 设置备用图片
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2ZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4=';
        imgElement.alt = '图片加载失败';
        imgElement.classList.add('error-fallback');
        
        // 记录错误
        this.queueError({
            type: 'resource_error',
            resourceType: 'image',
            originalSrc: originalSrc,
            element: imgElement.outerHTML,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    /**
     * 处理样式表加载错误
     */
    handleStylesheetError(linkElement) {
        console.warn('Stylesheet failed to load:', linkElement.href);
        
        // 添加备用样式类
        document.body.classList.add('fallback-styles');
        
        this.queueError({
            type: 'resource_error',
            resourceType: 'stylesheet',
            href: linkElement.href,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    /**
     * 处理脚本加载错误
     */
    handleScriptError(scriptElement) {
        console.warn('Script failed to load:', scriptElement.src);
        
        this.queueError({
            type: 'resource_error',
            resourceType: 'script',
            src: scriptElement.src,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    /**
     * 判断是否为关键错误
     */
    isCriticalError(errorInfo) {
        const criticalPatterns = [
            /Cannot read property/,
            /is not defined/,
            /is not a function/,
            /Network Error/
        ];
        
        return criticalPatterns.some(pattern => 
            pattern.test(errorInfo.message)
        );
    }

    /**
     * 显示用户错误消息
     */
    showUserErrorMessage(message) {
        // 创建错误提示元素
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // 添加样式
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        document.body.appendChild(errorDiv);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * 将错误加入队列
     */
    queueError(errorInfo) {
        this.errorQueue.push(errorInfo);
        
        // 限制队列大小
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.shift();
        }
        
        // 尝试立即上报（如果网络可用）
        this.reportErrors();
    }

    /**
     * 上报错误到服务器
     */
    async reportErrors() {
        if (this.errorQueue.length === 0) return;
        
        try {
            const errors = [...this.errorQueue];
            this.errorQueue = []; // 清空队列
            
            // 模拟错误上报（实际项目中替换为真实的API端点）
            console.log('Reporting errors to server:', errors);
            
            // 实际的错误上报代码：
            // await fetch(this.reportingEndpoint, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         errors: errors,
            //         sessionId: this.getSessionId(),
            //         timestamp: new Date().toISOString()
            //     })
            // });
            
        } catch (error) {
            console.warn('Failed to report errors:', error);
            // 如果上报失败，将错误重新加入队列
            this.errorQueue.unshift(...errors);
        }
    }

    /**
     * 开始性能监控
     */
    startPerformanceMonitoring() {
        // 页面加载性能监控
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
            }, 0);
        });
        
        // 定期收集性能数据
        setInterval(() => {
            this.collectRuntimeMetrics();
        }, 30000); // 每30秒收集一次
    }

    /**
     * 收集页面加载性能指标
     */
    collectPerformanceMetrics() {
        if (!window.performance || !window.performance.timing) return;
        
        const timing = window.performance.timing;
        const metrics = {
            type: 'performance_metrics',
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: this.getFirstPaint(),
            resourceCount: performance.getEntriesByType('resource').length,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // 如果加载时间超过3秒，记录为性能问题
        if (metrics.loadTime > 3000) {
            console.warn('Slow page load detected:', metrics.loadTime + 'ms');
            this.queueError({
                type: 'performance_issue',
                issue: 'slow_page_load',
                loadTime: metrics.loadTime,
                ...metrics
            });
        }
        
        console.log('Performance metrics:', metrics);
    }

    /**
     * 获取首次绘制时间
     */
    getFirstPaint() {
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : null;
        }
        return null;
    }

    /**
     * 收集运行时性能指标
     */
    collectRuntimeMetrics() {
        const metrics = {
            type: 'runtime_metrics',
            memoryUsage: this.getMemoryUsage(),
            connectionType: this.getConnectionType(),
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        // 检查内存使用情况
        if (metrics.memoryUsage && metrics.memoryUsage.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
            console.warn('High memory usage detected:', metrics.memoryUsage);
        }
        
        console.log('Runtime metrics:', metrics);
    }

    /**
     * 获取内存使用情况
     */
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    /**
     * 获取网络连接类型
     */
    getConnectionType() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    /**
     * 获取会话ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('error_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('error_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * 手动记录自定义错误
     */
    logCustomError(errorType, message, additionalData = {}) {
        this.queueError({
            type: 'custom_error',
            errorType: errorType,
            message: message,
            additionalData: additionalData,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    /**
     * 获取错误统计信息
     */
    getErrorStats() {
        return {
            queueLength: this.errorQueue.length,
            sessionId: this.getSessionId(),
            timestamp: new Date().toISOString()
        };
    }
}

// 创建全局错误处理实例
window.ErrorHandler = new ErrorHandler();

// 导出错误处理类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}