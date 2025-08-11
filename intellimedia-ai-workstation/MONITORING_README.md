# 错误处理和监控系统文档

## 概述

智媒AI工作站的错误处理和监控系统是一个完整的前端监控解决方案，包含错误捕获、用户行为跟踪、性能监控和可视化仪表盘等功能。

## 系统组件

### 1. 错误处理系统 (ErrorHandler)

**文件位置**: `js/utils/errorHandler.js`

**主要功能**:
- 全局JavaScript错误捕获
- 未处理的Promise拒绝监控
- 资源加载失败处理
- 错误队列管理和批量上报
- 用户友好的错误提示

**使用方法**:
```javascript
// 手动记录自定义错误
window.ErrorHandler.logCustomError('custom_error_type', '错误描述', { 
    additionalData: 'value' 
});

// 获取错误统计
const stats = window.ErrorHandler.getErrorStats();
```

**特性**:
- 自动图片加载失败降级处理
- 样式表加载失败备用方案
- 错误分级和关键错误识别
- 错误上报队列管理（最大50条）
- 会话级错误跟踪

### 2. 用户行为跟踪系统 (BehaviorTracker)

**文件位置**: `js/utils/behaviorTracker.js`

**主要功能**:
- 页面浏览跟踪
- 点击事件监控
- 滚动行为分析
- 表单交互跟踪
- 转化事件记录

**使用方法**:
```javascript
// 跟踪自定义事件
window.BehaviorTracker.trackCustomEvent('button_click', { 
    buttonType: 'cta' 
});

// 跟踪转化事件
window.BehaviorTracker.trackConversion('demo_request', 100);

// 获取会话统计
const stats = window.BehaviorTracker.getSessionStats();
```

**特性**:
- 智能元素识别（重要按钮、表单等）
- 区域级别的交互跟踪
- 批量数据上报（每10条或30秒）
- 页面可见性监控
- 隐私保护（不记录敏感数据）

### 3. 性能监控系统 (PerformanceMonitor)

**文件位置**: `js/utils/performanceMonitor.js`

**主要功能**:
- 页面加载性能监控
- Core Web Vitals 指标跟踪
- 资源加载分析
- 内存使用监控
- 网络状态检测

**使用方法**:
```javascript
// 手动性能测量
window.PerformanceMonitor.measurePerformance('operation_name', () => {
    // 要测量的操作
    return performOperation();
});

// 获取性能摘要
const summary = window.PerformanceMonitor.getPerformanceSummary();
```

**监控指标**:
- **LCP** (Largest Contentful Paint): 最大内容绘制时间
- **FID** (First Input Delay): 首次输入延迟
- **CLS** (Cumulative Layout Shift): 累积布局偏移
- **页面加载时间**: 完整页面加载耗时
- **资源加载**: 各类资源的加载性能
- **内存使用**: JavaScript堆内存监控

### 4. 监控仪表盘 (MonitoringDashboard)

**文件位置**: `js/components/MonitoringDashboard.js`

**主要功能**:
- 实时性能指标展示
- 错误统计可视化
- 用户行为数据展示
- 系统状态监控
- 实时日志查看

**使用方法**:
```javascript
// 显示仪表盘
window.MonitoringDashboard.show();

// 隐藏仪表盘
window.MonitoringDashboard.hide();

// 刷新数据
window.MonitoringDashboard.refresh();
```

**快捷键**: `Ctrl + Shift + M` 切换仪表盘显示

## 系统集成

### 自动初始化

监控系统在页面加载时自动初始化，无需手动配置：

```javascript
// 在 app.js 中自动集成
if (window.ErrorHandler) {
    this.errorHandler = window.ErrorHandler;
    this.registerComponent('errorHandler', this.errorHandler);
}

if (window.BehaviorTracker) {
    this.behaviorTracker = window.BehaviorTracker;
    this.registerComponent('behaviorTracker', this.behaviorTracker);
}

if (window.PerformanceMonitor) {
    this.performanceMonitor = window.PerformanceMonitor;
    this.registerComponent('performanceMonitor', this.performanceMonitor);
}
```

### HTML集成

在主页面中引入监控系统脚本：

```html
<!-- 错误处理和监控系统 -->
<script src="js/utils/errorHandler.js" defer></script>
<script src="js/utils/behaviorTracker.js" defer></script>
<script src="js/utils/performanceMonitor.js" defer></script>
<script src="js/components/MonitoringDashboard.js" defer></script>
```

## 配置选项

### 错误处理配置

```javascript
// 在 ErrorHandler 构造函数中可配置
{
    maxQueueSize: 50,           // 错误队列最大长度
    reportingEndpoint: '/api/errors',  // 错误上报端点
    showUserNotifications: true  // 是否显示用户错误提示
}
```

### 行为跟踪配置

```javascript
// 在 BehaviorTracker 构造函数中可配置
{
    batchSize: 10,              // 批量上报大小
    flushInterval: 30000,       // 上报间隔（毫秒）
    trackingEndpoint: '/api/analytics'  // 分析数据端点
}
```

### 性能监控配置

```javascript
// 性能阈值配置
{
    loadTime: 3000,             // 页面加载时间阈值
    firstPaint: 1000,           // 首次绘制时间阈值
    largestContentfulPaint: 2500, // LCP阈值
    firstInputDelay: 100,       // FID阈值
    cumulativeLayoutShift: 0.1, // CLS阈值
    memoryUsage: 50 * 1024 * 1024 // 内存使用阈值
}
```

## 数据上报

### 错误数据格式

```javascript
{
    errors: [
        {
            type: 'javascript_error',
            message: '错误消息',
            filename: '文件名',
            line: 行号,
            column: 列号,
            stack: '错误堆栈',
            timestamp: 'ISO时间戳',
            userAgent: '用户代理',
            url: '页面URL'
        }
    ],
    sessionId: '会话ID',
    timestamp: 'ISO时间戳'
}
```

### 行为数据格式

```javascript
{
    sessionId: '会话ID',
    interactions: [
        {
            type: 'click',
            element: {
                tagName: 'BUTTON',
                id: 'cta-button',
                className: 'btn-primary',
                text: '预约演示'
            },
            section: 'hero',
            timestamp: 时间戳
        }
    ],
    timestamp: 时间戳,
    url: '页面URL'
}
```

### 性能数据格式

```javascript
{
    type: 'performance_metrics',
    loadTime: 2500,
    domReady: 1200,
    firstPaint: 800,
    largestContentfulPaint: 1500,
    firstInputDelay: 50,
    cumulativeLayoutShift: 0.05,
    timestamp: 'ISO时间戳',
    url: '页面URL'
}
```

## 测试和调试

### 测试页面

访问 `test-monitoring.html` 进行系统功能测试：

- 错误处理测试
- 资源加载错误测试
- 用户行为跟踪测试
- 性能监控测试
- 监控仪表盘控制

### 调试工具

1. **浏览器控制台**: 查看详细的监控日志
2. **监控仪表盘**: 实时查看系统状态和指标
3. **网络面板**: 检查数据上报请求
4. **性能面板**: 分析页面性能问题

### 常用调试命令

```javascript
// 查看错误统计
console.log(window.ErrorHandler.getErrorStats());

// 查看行为统计
console.log(window.BehaviorTracker.getSessionStats());

// 查看性能摘要
console.log(window.PerformanceMonitor.getPerformanceSummary());

// 手动触发错误上报
window.ErrorHandler.reportErrors();

// 手动触发行为数据上报
window.BehaviorTracker.flush();
```

## 最佳实践

### 1. 错误处理

- 为关键操作添加try-catch包装
- 使用自定义错误类型便于分类
- 避免在错误处理代码中再次抛出错误
- 为用户提供友好的错误提示

### 2. 性能监控

- 设置合理的性能阈值
- 定期检查性能报告
- 优化识别出的性能瓶颈
- 监控内存使用避免内存泄漏

### 3. 用户行为跟踪

- 只跟踪必要的用户交互
- 保护用户隐私，不记录敏感信息
- 合理设置数据上报频率
- 分析用户行为优化用户体验

### 4. 数据隐私

- 不记录用户输入的具体内容
- 使用会话ID而非用户标识
- 遵循数据保护法规
- 提供数据删除机制

## 故障排除

### 常见问题

1. **监控系统未启动**
   - 检查脚本加载顺序
   - 确认没有JavaScript错误阻止初始化
   - 验证浏览器兼容性

2. **数据未上报**
   - 检查网络连接
   - 验证上报端点配置
   - 查看浏览器控制台错误

3. **性能指标异常**
   - 检查浏览器支持情况
   - 验证Performance API可用性
   - 确认页面加载完成

4. **仪表盘无法显示**
   - 检查CSS样式加载
   - 验证DOM结构完整性
   - 确认快捷键功能正常

### 浏览器兼容性

- **Chrome**: 完全支持
- **Firefox**: 完全支持
- **Safari**: 部分Performance API可能不支持
- **Edge**: 完全支持
- **IE**: 不支持（需要polyfill）

## 更新日志

### v1.0.0 (当前版本)
- 初始版本发布
- 完整的错误处理系统
- 用户行为跟踪功能
- 性能监控和Core Web Vitals支持
- 可视化监控仪表盘
- 测试页面和文档

## 技术支持

如有问题或建议，请联系开发团队或查看项目文档。