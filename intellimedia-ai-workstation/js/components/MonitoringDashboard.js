/**
 * 监控仪表盘组件
 * Monitoring Dashboard Component
 */

class MonitoringDashboard {
    constructor() {
        this.isVisible = false;
        this.updateInterval = null;
        this.refreshRate = 5000; // 5秒更新一次
        
        this.init();
    }

    /**
     * 初始化监控仪表盘
     */
    init() {
        this.createDashboard();
        this.setupToggleShortcut();
    }

    /**
     * 创建仪表盘界面
     */
    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'monitoring-dashboard';
        dashboard.className = 'monitoring-dashboard hidden';
        
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>性能监控仪表盘</h3>
                <div class="dashboard-controls">
                    <button class="refresh-btn" onclick="window.MonitoringDashboard.refresh()">刷新</button>
                    <button class="close-btn" onclick="window.MonitoringDashboard.hide()">×</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h4>页面性能</h4>
                        <div id="page-performance-metrics"></div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>错误统计</h4>
                        <div id="error-metrics"></div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>用户行为</h4>
                        <div id="behavior-metrics"></div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>资源加载</h4>
                        <div id="resource-metrics"></div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>内存使用</h4>
                        <div id="memory-metrics"></div>
                    </div>
                    
                    <div class="metric-card">
                        <h4>网络状态</h4>
                        <div id="network-metrics"></div>
                    </div>
                </div>
                
                <div class="logs-section">
                    <h4>实时日志</h4>
                    <div id="real-time-logs"></div>
                </div>
            </div>
        `;

        // 添加样式
        this.addDashboardStyles();
        
        document.body.appendChild(dashboard);
        this.dashboardElement = dashboard;
    }

    /**
     * 添加仪表盘样式
     */
    addDashboardStyles() {
        const styles = `
            <style id="monitoring-dashboard-styles">
                .monitoring-dashboard {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 800px;
                    max-height: 80vh;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 14px;
                    overflow: hidden;
                }
                
                .monitoring-dashboard.hidden {
                    display: none;
                }
                
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: #003366;
                    color: white;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .dashboard-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .dashboard-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .dashboard-controls button {
                    padding: 5px 10px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }
                
                .dashboard-controls button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .dashboard-content {
                    padding: 20px;
                    max-height: calc(80vh - 70px);
                    overflow-y: auto;
                }
                
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .metric-card {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 15px;
                }
                
                .metric-card h4 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #003366;
                }
                
                .metric-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 12px;
                }
                
                .metric-label {
                    color: #666;
                }
                
                .metric-value {
                    font-weight: 500;
                    color: #333;
                }
                
                .metric-value.good {
                    color: #28a745;
                }
                
                .metric-value.warning {
                    color: #ffc107;
                }
                
                .metric-value.error {
                    color: #dc3545;
                }
                
                .logs-section {
                    border-top: 1px solid #e9ecef;
                    padding-top: 20px;
                }
                
                .logs-section h4 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #003366;
                }
                
                #real-time-logs {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 4px;
                    padding: 10px;
                    height: 200px;
                    overflow-y: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    line-height: 1.4;
                }
                
                .log-entry {
                    margin-bottom: 5px;
                    padding: 2px 0;
                }
                
                .log-entry.error {
                    color: #dc3545;
                }
                
                .log-entry.warning {
                    color: #ffc107;
                }
                
                .log-entry.info {
                    color: #17a2b8;
                }
                
                .log-timestamp {
                    color: #666;
                    margin-right: 8px;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * 设置快捷键切换
     */
    setupToggleShortcut() {
        document.addEventListener('keydown', (event) => {
            // Ctrl + Shift + M 切换仪表盘
            if (event.ctrlKey && event.shiftKey && event.key === 'M') {
                event.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * 显示仪表盘
     */
    show() {
        if (this.dashboardElement) {
            this.dashboardElement.classList.remove('hidden');
            this.isVisible = true;
            this.startAutoRefresh();
            this.refresh();
        }
    }

    /**
     * 隐藏仪表盘
     */
    hide() {
        if (this.dashboardElement) {
            this.dashboardElement.classList.add('hidden');
            this.isVisible = false;
            this.stopAutoRefresh();
        }
    }

    /**
     * 切换仪表盘显示状态
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * 开始自动刷新
     */
    startAutoRefresh() {
        this.stopAutoRefresh();
        this.updateInterval = setInterval(() => {
            this.refresh();
        }, this.refreshRate);
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * 刷新仪表盘数据
     */
    refresh() {
        this.updatePagePerformanceMetrics();
        this.updateErrorMetrics();
        this.updateBehaviorMetrics();
        this.updateResourceMetrics();
        this.updateMemoryMetrics();
        this.updateNetworkMetrics();
        this.updateRealTimeLogs();
    }

    /**
     * 更新页面性能指标
     */
    updatePagePerformanceMetrics() {
        const container = document.getElementById('page-performance-metrics');
        if (!container) return;

        let metrics = {};
        
        // 获取性能监控数据
        if (window.PerformanceMonitor) {
            const summary = window.PerformanceMonitor.getPerformanceSummary();
            metrics = summary;
        }

        // 获取基础性能数据
        if (performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            metrics.loadTime = loadTime;
            metrics.domReady = domReady;
        }

        container.innerHTML = this.renderMetricItems([
            { label: '页面加载时间', value: this.formatTime(metrics.loadTime), status: this.getTimeStatus(metrics.loadTime, 3000) },
            { label: 'DOM就绪时间', value: this.formatTime(metrics.domReady), status: this.getTimeStatus(metrics.domReady, 1500) },
            { label: 'LCP', value: this.formatTime(metrics.largest_contentful_paint?.latest), status: this.getTimeStatus(metrics.largest_contentful_paint?.latest, 2500) },
            { label: 'FID', value: this.formatTime(metrics.first_input_delay?.latest), status: this.getTimeStatus(metrics.first_input_delay?.latest, 100) },
            { label: 'CLS', value: this.formatNumber(metrics.cumulative_layout_shift?.latest, 3), status: this.getCLSStatus(metrics.cumulative_layout_shift?.latest) }
        ]);
    }

    /**
     * 更新错误指标
     */
    updateErrorMetrics() {
        const container = document.getElementById('error-metrics');
        if (!container) return;

        let errorStats = { queueLength: 0 };
        
        if (window.ErrorHandler) {
            errorStats = window.ErrorHandler.getErrorStats();
        }

        container.innerHTML = this.renderMetricItems([
            { label: '错误队列长度', value: errorStats.queueLength, status: errorStats.queueLength > 0 ? 'error' : 'good' },
            { label: '会话ID', value: errorStats.sessionId ? errorStats.sessionId.substring(0, 12) + '...' : 'N/A', status: 'info' },
            { label: '监控状态', value: '正常运行', status: 'good' }
        ]);
    }

    /**
     * 更新用户行为指标
     */
    updateBehaviorMetrics() {
        const container = document.getElementById('behavior-metrics');
        if (!container) return;

        let behaviorStats = {};
        
        if (window.BehaviorTracker) {
            behaviorStats = window.BehaviorTracker.getSessionStats();
        }

        container.innerHTML = this.renderMetricItems([
            { label: '页面停留时间', value: this.formatTime(behaviorStats.timeOnPage), status: 'info' },
            { label: '交互次数', value: behaviorStats.interactionCount || 0, status: 'info' },
            { label: '点击次数', value: behaviorStats.clickCount || 0, status: 'info' },
            { label: '滚动事件', value: behaviorStats.scrollEvents || 0, status: 'info' }
        ]);
    }

    /**
     * 更新资源指标
     */
    updateResourceMetrics() {
        const container = document.getElementById('resource-metrics');
        if (!container) return;

        let resourceCount = 0;
        let totalSize = 0;
        let cachedCount = 0;

        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            resourceCount = resources.length;
            
            resources.forEach(resource => {
                totalSize += resource.transferSize || 0;
                if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
                    cachedCount++;
                }
            });
        }

        container.innerHTML = this.renderMetricItems([
            { label: '资源总数', value: resourceCount, status: 'info' },
            { label: '传输大小', value: this.formatBytes(totalSize), status: this.getSizeStatus(totalSize) },
            { label: '缓存命中', value: cachedCount, status: 'good' },
            { label: '缓存率', value: resourceCount > 0 ? Math.round((cachedCount / resourceCount) * 100) + '%' : '0%', status: 'info' }
        ]);
    }

    /**
     * 更新内存指标
     */
    updateMemoryMetrics() {
        const container = document.getElementById('memory-metrics');
        if (!container) return;

        let memoryInfo = null;
        
        if (performance.memory) {
            memoryInfo = performance.memory;
        }

        if (memoryInfo) {
            container.innerHTML = this.renderMetricItems([
                { label: '已用内存', value: this.formatBytes(memoryInfo.usedJSHeapSize), status: this.getMemoryStatus(memoryInfo.usedJSHeapSize) },
                { label: '总内存', value: this.formatBytes(memoryInfo.totalJSHeapSize), status: 'info' },
                { label: '内存限制', value: this.formatBytes(memoryInfo.jsHeapSizeLimit), status: 'info' },
                { label: '使用率', value: Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100) + '%', status: 'info' }
            ]);
        } else {
            container.innerHTML = '<div class="metric-item"><span class="metric-label">内存信息不可用</span></div>';
        }
    }

    /**
     * 更新网络指标
     */
    updateNetworkMetrics() {
        const container = document.getElementById('network-metrics');
        if (!container) return;

        let networkInfo = null;
        
        if (navigator.connection) {
            networkInfo = navigator.connection;
        }

        if (networkInfo) {
            container.innerHTML = this.renderMetricItems([
                { label: '连接类型', value: networkInfo.effectiveType || 'unknown', status: 'info' },
                { label: '下行速度', value: networkInfo.downlink ? networkInfo.downlink + ' Mbps' : 'N/A', status: 'info' },
                { label: 'RTT', value: networkInfo.rtt ? networkInfo.rtt + ' ms' : 'N/A', status: 'info' },
                { label: '省流模式', value: networkInfo.saveData ? '开启' : '关闭', status: networkInfo.saveData ? 'warning' : 'good' }
            ]);
        } else {
            container.innerHTML = '<div class="metric-item"><span class="metric-label">网络信息不可用</span></div>';
        }
    }

    /**
     * 更新实时日志
     */
    updateRealTimeLogs() {
        const container = document.getElementById('real-time-logs');
        if (!container) return;

        // 这里可以显示最近的错误、性能问题等
        const logs = this.getRecentLogs();
        
        container.innerHTML = logs.map(log => 
            `<div class="log-entry ${log.level}">
                <span class="log-timestamp">${log.timestamp}</span>
                ${log.message}
            </div>`
        ).join('');
        
        // 自动滚动到底部
        container.scrollTop = container.scrollHeight;
    }

    /**
     * 获取最近的日志
     */
    getRecentLogs() {
        const logs = [];
        const now = new Date();
        
        // 添加一些示例日志
        logs.push({
            timestamp: this.formatTimestamp(now),
            level: 'info',
            message: '监控系统正常运行'
        });

        if (window.PerformanceMonitor && window.PerformanceMonitor.metrics) {
            const recentMetrics = window.PerformanceMonitor.metrics.slice(-5);
            recentMetrics.forEach(metric => {
                logs.push({
                    timestamp: this.formatTimestamp(new Date(metric.timestamp)),
                    level: 'info',
                    message: `性能指标: ${metric.type} = ${metric.value}`
                });
            });
        }

        return logs.slice(-20); // 只显示最近20条
    }

    /**
     * 渲染指标项目
     */
    renderMetricItems(items) {
        return items.map(item => 
            `<div class="metric-item">
                <span class="metric-label">${item.label}</span>
                <span class="metric-value ${item.status}">${item.value}</span>
            </div>`
        ).join('');
    }

    /**
     * 格式化时间
     */
    formatTime(ms) {
        if (ms === undefined || ms === null) return 'N/A';
        return Math.round(ms) + 'ms';
    }

    /**
     * 格式化数字
     */
    formatNumber(num, decimals = 0) {
        if (num === undefined || num === null) return 'N/A';
        return num.toFixed(decimals);
    }

    /**
     * 格式化字节
     */
    formatBytes(bytes) {
        if (bytes === undefined || bytes === null || bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /**
     * 格式化时间戳
     */
    formatTimestamp(date) {
        return date.toLocaleTimeString();
    }

    /**
     * 获取时间状态
     */
    getTimeStatus(time, threshold) {
        if (time === undefined || time === null) return 'info';
        return time > threshold ? 'error' : time > threshold * 0.7 ? 'warning' : 'good';
    }

    /**
     * 获取CLS状态
     */
    getCLSStatus(cls) {
        if (cls === undefined || cls === null) return 'info';
        return cls > 0.25 ? 'error' : cls > 0.1 ? 'warning' : 'good';
    }

    /**
     * 获取大小状态
     */
    getSizeStatus(size) {
        if (size > 5 * 1024 * 1024) return 'error'; // 5MB
        if (size > 2 * 1024 * 1024) return 'warning'; // 2MB
        return 'good';
    }

    /**
     * 获取内存状态
     */
    getMemoryStatus(memory) {
        if (memory > 100 * 1024 * 1024) return 'error'; // 100MB
        if (memory > 50 * 1024 * 1024) return 'warning'; // 50MB
        return 'good';
    }
}

// 创建全局监控仪表盘实例
window.MonitoringDashboard = new MonitoringDashboard();

// 导出监控仪表盘类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonitoringDashboard;
}