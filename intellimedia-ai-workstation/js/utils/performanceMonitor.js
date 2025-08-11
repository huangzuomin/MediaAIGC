/**
 * 性能监控系统
 * Performance Monitoring System
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.observers = {};
        this.thresholds = {
            loadTime: 3000,        // 页面加载时间阈值 (ms)
            firstPaint: 1000,      // 首次绘制时间阈值 (ms)
            largestContentfulPaint: 2500, // LCP阈值 (ms)
            firstInputDelay: 100,  // FID阈值 (ms)
            cumulativeLayoutShift: 0.1,   // CLS阈值
            memoryUsage: 50 * 1024 * 1024 // 内存使用阈值 (50MB)
        };
        
        this.init();
    }

    /**
     * 初始化性能监控
     */
    init() {
        this.setupPerformanceObservers();
        this.monitorPageLoad();
        this.monitorResourceLoading();
        this.monitorMemoryUsage();
        this.setupNetworkMonitoring();
    }

    /**
     * 设置性能观察器
     */
    setupPerformanceObservers() {
        // 监控 Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    this.recordMetric({
                        type: 'largest_contentful_paint',
                        value: lastEntry.startTime,
                        element: lastEntry.element ? lastEntry.element.tagName : 'unknown',
                        timestamp: Date.now()
                    });
                    
                    if (lastEntry.startTime > this.thresholds.largestContentfulPaint) {
                        this.reportPerformanceIssue('slow_lcp', {
                            value: lastEntry.startTime,
                            threshold: this.thresholds.largestContentfulPaint
                        });
                    }
                });
                
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.lcp = lcpObserver;
            } catch (e) {
                console.warn('LCP observer not supported:', e);
            }

            // 监控 First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        this.recordMetric({
                            type: 'first_input_delay',
                            value: entry.processingStart - entry.startTime,
                            inputType: entry.name,
                            timestamp: Date.now()
                        });
                        
                        const fid = entry.processingStart - entry.startTime;
                        if (fid > this.thresholds.firstInputDelay) {
                            this.reportPerformanceIssue('slow_fid', {
                                value: fid,
                                threshold: this.thresholds.firstInputDelay
                            });
                        }
                    });
                });
                
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.fid = fidObserver;
            } catch (e) {
                console.warn('FID observer not supported:', e);
            }

            // 监控 Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    
                    this.recordMetric({
                        type: 'cumulative_layout_shift',
                        value: clsValue,
                        timestamp: Date.now()
                    });
                    
                    if (clsValue > this.thresholds.cumulativeLayoutShift) {
                        this.reportPerformanceIssue('high_cls', {
                            value: clsValue,
                            threshold: this.thresholds.cumulativeLayoutShift
                        });
                    }
                });
                
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.cls = clsObserver;
            } catch (e) {
                console.warn('CLS observer not supported:', e);
            }
        }
    }

    /**
     * 监控页面加载性能
     */
    monitorPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectLoadMetrics();
            }, 0);
        });

        // 监控 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            this.recordMetric({
                type: 'dom_content_loaded',
                value: performance.now(),
                timestamp: Date.now()
            });
        });
    }

    /**
     * 收集页面加载指标
     */
    collectLoadMetrics() {
        if (!performance.timing) return;

        const timing = performance.timing;
        const navigation = performance.navigation;
        
        const metrics = {
            // 基础时间指标
            navigationStart: timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstByte: timing.responseStart - timing.navigationStart,
            
            // 网络时间
            dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnect: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            
            // 处理时间
            domProcessing: timing.domComplete - timing.domLoading,
            
            // 导航类型
            navigationType: navigation.type,
            redirectCount: navigation.redirectCount,
            
            timestamp: Date.now()
        };

        // 记录所有指标
        Object.entries(metrics).forEach(([key, value]) => {
            if (typeof value === 'number' && value > 0) {
                this.recordMetric({
                    type: `load_${key}`,
                    value: value,
                    timestamp: Date.now()
                });
            }
        });

        // 检查加载时间是否超过阈值
        if (metrics.loadComplete > this.thresholds.loadTime) {
            this.reportPerformanceIssue('slow_page_load', {
                loadTime: metrics.loadComplete,
                threshold: this.thresholds.loadTime,
                breakdown: {
                    dns: metrics.dnsLookup,
                    tcp: metrics.tcpConnect,
                    request: metrics.request,
                    response: metrics.response,
                    domProcessing: metrics.domProcessing
                }
            });
        }

        // 获取首次绘制时间
        this.getFirstPaintMetrics();
    }

    /**
     * 获取首次绘制指标
     */
    getFirstPaintMetrics() {
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            
            paintEntries.forEach(entry => {
                this.recordMetric({
                    type: entry.name.replace('-', '_'),
                    value: entry.startTime,
                    timestamp: Date.now()
                });
                
                if (entry.name === 'first-paint' && entry.startTime > this.thresholds.firstPaint) {
                    this.reportPerformanceIssue('slow_first_paint', {
                        value: entry.startTime,
                        threshold: this.thresholds.firstPaint
                    });
                }
            });
        }
    }

    /**
     * 监控资源加载
     */
    monitorResourceLoading() {
        // 监控所有资源加载
        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                this.analyzeResourcePerformance(resource);
            });
        }

        // 监控新的资源加载
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        this.analyzeResourcePerformance(entry);
                    });
                });
                
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.resource = resourceObserver;
            } catch (e) {
                console.warn('Resource observer not supported:', e);
            }
        }
    }

    /**
     * 分析资源性能
     */
    analyzeResourcePerformance(resource) {
        const loadTime = resource.responseEnd - resource.startTime;
        const resourceType = this.getResourceType(resource.name);
        
        this.recordMetric({
            type: 'resource_load',
            resourceType: resourceType,
            url: resource.name,
            loadTime: loadTime,
            size: resource.transferSize || 0,
            cached: resource.transferSize === 0 && resource.decodedBodySize > 0,
            timestamp: Date.now()
        });

        // 检查慢资源
        const slowThresholds = {
            image: 2000,
            script: 3000,
            stylesheet: 2000,
            font: 3000,
            other: 5000
        };

        if (loadTime > (slowThresholds[resourceType] || slowThresholds.other)) {
            this.reportPerformanceIssue('slow_resource', {
                resourceType: resourceType,
                url: resource.name,
                loadTime: loadTime,
                threshold: slowThresholds[resourceType] || slowThresholds.other
            });
        }
    }

    /**
     * 获取资源类型
     */
    getResourceType(url) {
        const extension = url.split('.').pop().toLowerCase();
        const typeMap = {
            'js': 'script',
            'css': 'stylesheet',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'svg': 'image',
            'webp': 'image',
            'woff': 'font',
            'woff2': 'font',
            'ttf': 'font',
            'eot': 'font'
        };
        
        return typeMap[extension] || 'other';
    }

    /**
     * 监控内存使用
     */
    monitorMemoryUsage() {
        if (!performance.memory) return;

        const checkMemory = () => {
            const memory = performance.memory;
            
            this.recordMetric({
                type: 'memory_usage',
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                timestamp: Date.now()
            });

            // 检查内存使用是否过高
            if (memory.usedJSHeapSize > this.thresholds.memoryUsage) {
                this.reportPerformanceIssue('high_memory_usage', {
                    usedMemory: memory.usedJSHeapSize,
                    threshold: this.thresholds.memoryUsage,
                    totalMemory: memory.totalJSHeapSize
                });
            }
        };

        // 立即检查一次
        checkMemory();
        
        // 每30秒检查一次
        setInterval(checkMemory, 30000);
    }

    /**
     * 设置网络监控
     */
    setupNetworkMonitoring() {
        if (navigator.connection) {
            const connection = navigator.connection;
            
            this.recordMetric({
                type: 'network_info',
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                timestamp: Date.now()
            });

            // 监控网络变化
            connection.addEventListener('change', () => {
                this.recordMetric({
                    type: 'network_change',
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    timestamp: Date.now()
                });
            });
        }
    }

    /**
     * 记录性能指标
     */
    recordMetric(metric) {
        this.metrics.push(metric);
        
        // 限制指标数量，避免内存泄漏
        if (this.metrics.length > 1000) {
            this.metrics = this.metrics.slice(-500);
        }
        
        console.log('Performance metric:', metric);
    }

    /**
     * 报告性能问题
     */
    reportPerformanceIssue(issueType, details) {
        const issue = {
            type: 'performance_issue',
            issueType: issueType,
            details: details,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };

        console.warn('Performance issue detected:', issue);
        
        // 通过错误处理系统报告性能问题
        if (window.ErrorHandler) {
            window.ErrorHandler.logCustomError('performance_issue', issueType, details);
        }
    }

    /**
     * 获取性能摘要
     */
    getPerformanceSummary() {
        const summary = {
            totalMetrics: this.metrics.length,
            timestamp: Date.now()
        };

        // 计算各类指标的统计信息
        const metricTypes = [...new Set(this.metrics.map(m => m.type))];
        
        metricTypes.forEach(type => {
            const typeMetrics = this.metrics.filter(m => m.type === type);
            if (typeMetrics.length > 0 && typeof typeMetrics[0].value === 'number') {
                const values = typeMetrics.map(m => m.value);
                summary[type] = {
                    count: values.length,
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    latest: values[values.length - 1]
                };
            }
        });

        return summary;
    }

    /**
     * 手动测量性能
     */
    measurePerformance(name, fn) {
        const startTime = performance.now();
        
        try {
            const result = fn();
            
            // 如果返回Promise，等待完成
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    const endTime = performance.now();
                    this.recordMetric({
                        type: 'custom_measurement',
                        name: name,
                        value: endTime - startTime,
                        timestamp: Date.now()
                    });
                });
            } else {
                const endTime = performance.now();
                this.recordMetric({
                    type: 'custom_measurement',
                    name: name,
                    value: endTime - startTime,
                    timestamp: Date.now()
                });
                return result;
            }
        } catch (error) {
            const endTime = performance.now();
            this.recordMetric({
                type: 'custom_measurement',
                name: name,
                value: endTime - startTime,
                error: error.message,
                timestamp: Date.now()
            });
            throw error;
        }
    }

    /**
     * 清理观察器
     */
    cleanup() {
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers = {};
    }
}

// 创建全局性能监控实例
window.PerformanceMonitor = new PerformanceMonitor();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.PerformanceMonitor) {
        window.PerformanceMonitor.cleanup();
    }
});

// 导出性能监控类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}