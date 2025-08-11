/**
 * 资源管理器
 * 提供静态资源管理、缓存策略、压缩优化等功能
 */

class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.cache = new Map();
    this.compressionSupport = {
      gzip: false,
      brotli: false,
      webp: false,
      avif: false
    };
    
    this.config = {
      cacheExpiry: 24 * 60 * 60 * 1000, // 24小时
      maxCacheSize: 50 * 1024 * 1024,   // 50MB
      compressionThreshold: 1024,        // 1KB
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    this.init();
  }

  /**
   * 初始化资源管理器
   */
  init() {
    this.detectCompressionSupport();
    this.setupResourceCache();
    this.setupResourceMonitoring();
    this.setupErrorHandling();
    this.cleanupExpiredCache();
    
    console.log('资源管理器初始化完成');
  }

  /**
   * 检测压缩格式支持
   */
  detectCompressionSupport() {
    // 检测Gzip支持
    this.compressionSupport.gzip = 'CompressionStream' in window;
    
    // 检测Brotli支持
    this.compressionSupport.brotli = this.checkBrotliSupport();
    
    // 检测WebP支持
    this.compressionSupport.webp = this.checkWebPSupport();
    
    // 检测AVIF支持
    this.compressionSupport.avif = this.checkAVIFSupport();
    
    console.log('压缩格式支持:', this.compressionSupport);
  }

  /**
   * 检测Brotli支持
   * @returns {boolean} 是否支持Brotli
   */
  checkBrotliSupport() {
    const acceptEncoding = navigator.userAgent.toLowerCase();
    return acceptEncoding.includes('br') || 'DecompressionStream' in window;
  }

  /**
   * 检测WebP支持
   * @returns {boolean} 是否支持WebP
   */
  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * 检测AVIF支持
   * @returns {boolean} 是否支持AVIF
   */
  checkAVIFSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * 设置资源缓存
   */
  setupResourceCache() {
    // 检查浏览器存储支持
    this.storageSupport = {
      localStorage: this.checkStorageSupport('localStorage'),
      sessionStorage: this.checkStorageSupport('sessionStorage'),
      indexedDB: 'indexedDB' in window,
      cacheAPI: 'caches' in window
    };

    console.log('存储支持:', this.storageSupport);

    // 初始化IndexedDB缓存
    if (this.storageSupport.indexedDB) {
      this.initIndexedDBCache();
    }

    // 初始化Cache API
    if (this.storageSupport.cacheAPI) {
      this.initCacheAPI();
    }
  }

  /**
   * 检查存储支持
   * @param {string} storageType - 存储类型
   * @returns {boolean} 是否支持
   */
  checkStorageSupport(storageType) {
    try {
      const storage = window[storageType];
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 初始化IndexedDB缓存
   */
  async initIndexedDBCache() {
    try {
      const request = indexedDB.open('IntelliMediaCache', 1);
      
      request.onerror = () => {
        console.warn('IndexedDB初始化失败');
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB缓存初始化完成');
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建资源存储
        if (!db.objectStoreNames.contains('resources')) {
          const resourceStore = db.createObjectStore('resources', { keyPath: 'url' });
          resourceStore.createIndex('type', 'type', { unique: false });
          resourceStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 创建元数据存储
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    } catch (error) {
      console.warn('IndexedDB不可用:', error);
    }
  }

  /**
   * 初始化Cache API
   */
  async initCacheAPI() {
    try {
      this.cacheAPI = await caches.open('intellimedia-v1');
      console.log('Cache API初始化完成');
    } catch (error) {
      console.warn('Cache API初始化失败:', error);
    }
  }

  /**
   * 加载资源
   * @param {string} url - 资源URL
   * @param {Object} options - 加载选项
   * @returns {Promise} 资源数据
   */
  async loadResource(url, options = {}) {
    const {
      type = 'auto',
      cache = true,
      compress = true,
      retry = true,
      timeout = 10000
    } = options;

    // 检查缓存
    if (cache) {
      const cachedResource = await this.getCachedResource(url);
      if (cachedResource) {
        console.log(`从缓存加载资源: ${url}`);
        return cachedResource;
      }
    }

    // 加载资源
    try {
      const resource = await this.fetchResource(url, { type, timeout, compress });
      
      // 缓存资源
      if (cache) {
        await this.cacheResource(url, resource, type);
      }
      
      return resource;
    } catch (error) {
      if (retry && options.retryCount < this.config.retryAttempts) {
        console.warn(`资源加载失败，重试: ${url}`, error);
        await this.delay(this.config.retryDelay);
        return this.loadResource(url, { 
          ...options, 
          retryCount: (options.retryCount || 0) + 1 
        });
      }
      
      throw error;
    }
  }

  /**
   * 获取缓存资源
   * @param {string} url - 资源URL
   * @returns {Promise} 缓存的资源
   */
  async getCachedResource(url) {
    // 首先检查内存缓存
    if (this.cache.has(url)) {
      const cached = this.cache.get(url);
      if (Date.now() - cached.timestamp < this.config.cacheExpiry) {
        return cached.data;
      } else {
        this.cache.delete(url);
      }
    }

    // 检查IndexedDB缓存
    if (this.db) {
      try {
        const resource = await this.getFromIndexedDB(url);
        if (resource && Date.now() - resource.timestamp < this.config.cacheExpiry) {
          // 加载到内存缓存
          this.cache.set(url, {
            data: resource.data,
            timestamp: resource.timestamp
          });
          return resource.data;
        }
      } catch (error) {
        console.warn('IndexedDB读取失败:', error);
      }
    }

    // 检查Cache API
    if (this.cacheAPI) {
      try {
        const response = await this.cacheAPI.match(url);
        if (response) {
          const data = await this.parseResponse(response);
          return data;
        }
      } catch (error) {
        console.warn('Cache API读取失败:', error);
      }
    }

    return null;
  }

  /**
   * 从IndexedDB获取资源
   * @param {string} url - 资源URL
   * @returns {Promise} 资源数据
   */
  getFromIndexedDB(url) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['resources'], 'readonly');
      const store = transaction.objectStore('resources');
      const request = store.get(url);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * 获取资源
   * @param {string} url - 资源URL
   * @param {Object} options - 选项
   * @returns {Promise} 资源数据
   */
  async fetchResource(url, options = {}) {
    const { type, timeout, compress } = options;
    
    // 构建请求头
    const headers = new Headers();
    
    if (compress) {
      const acceptEncoding = [];
      if (this.compressionSupport.brotli) acceptEncoding.push('br');
      if (this.compressionSupport.gzip) acceptEncoding.push('gzip');
      if (acceptEncoding.length > 0) {
        headers.set('Accept-Encoding', acceptEncoding.join(', '));
      }
    }

    // 根据类型设置Accept头
    if (type === 'image') {
      const acceptFormats = ['image/*'];
      if (this.compressionSupport.avif) acceptFormats.unshift('image/avif');
      if (this.compressionSupport.webp) acceptFormats.unshift('image/webp');
      headers.set('Accept', acceptFormats.join(', '));
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        cache: 'default'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await this.parseResponse(response, type);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 解析响应
   * @param {Response} response - 响应对象
   * @param {string} type - 资源类型
   * @returns {Promise} 解析后的数据
   */
  async parseResponse(response, type = 'auto') {
    const contentType = response.headers.get('content-type') || '';
    
    // 自动检测类型
    if (type === 'auto') {
      if (contentType.includes('application/json')) {
        type = 'json';
      } else if (contentType.includes('text/')) {
        type = 'text';
      } else if (contentType.includes('image/')) {
        type = 'blob';
      } else {
        type = 'arrayBuffer';
      }
    }

    // 根据类型解析
    switch (type) {
      case 'json':
        return await response.json();
      case 'text':
      case 'css':
      case 'js':
        return await response.text();
      case 'blob':
      case 'image':
        return await response.blob();
      case 'arrayBuffer':
        return await response.arrayBuffer();
      default:
        return await response.text();
    }
  }

  /**
   * 缓存资源
   * @param {string} url - 资源URL
   * @param {*} data - 资源数据
   * @param {string} type - 资源类型
   */
  async cacheResource(url, data, type) {
    const timestamp = Date.now();
    const size = this.calculateSize(data);
    
    // 检查缓存大小限制
    if (size > this.config.maxCacheSize / 10) {
      console.warn(`资源过大，跳过缓存: ${url} (${this.formatSize(size)})`);
      return;
    }

    // 内存缓存
    this.cache.set(url, { data, timestamp, size, type });
    
    // 清理内存缓存
    this.cleanupMemoryCache();

    // IndexedDB缓存
    if (this.db) {
      try {
        await this.saveToIndexedDB(url, data, type, timestamp, size);
      } catch (error) {
        console.warn('IndexedDB缓存失败:', error);
      }
    }

    // Cache API缓存
    if (this.cacheAPI && (type === 'css' || type === 'js' || type === 'image')) {
      try {
        const response = new Response(data, {
          headers: {
            'Content-Type': this.getContentType(type),
            'Cache-Control': 'max-age=31536000'
          }
        });
        await this.cacheAPI.put(url, response);
      } catch (error) {
        console.warn('Cache API缓存失败:', error);
      }
    }

    console.log(`资源已缓存: ${url} (${this.formatSize(size)})`);
  }

  /**
   * 保存到IndexedDB
   * @param {string} url - 资源URL
   * @param {*} data - 资源数据
   * @param {string} type - 资源类型
   * @param {number} timestamp - 时间戳
   * @param {number} size - 大小
   */
  saveToIndexedDB(url, data, type, timestamp, size) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['resources'], 'readwrite');
      const store = transaction.objectStore('resources');
      
      const resource = {
        url,
        data,
        type,
        timestamp,
        size
      };
      
      const request = store.put(resource);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 计算数据大小
   * @param {*} data - 数据
   * @returns {number} 大小（字节）
   */
  calculateSize(data) {
    if (typeof data === 'string') {
      return new Blob([data]).size;
    } else if (data instanceof Blob) {
      return data.size;
    } else if (data instanceof ArrayBuffer) {
      return data.byteLength;
    } else {
      return new Blob([JSON.stringify(data)]).size;
    }
  }

  /**
   * 格式化大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化的大小
   */
  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)}${units[unitIndex]}`;
  }

  /**
   * 获取内容类型
   * @param {string} type - 资源类型
   * @returns {string} 内容类型
   */
  getContentType(type) {
    const contentTypes = {
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'text': 'text/plain',
      'image': 'image/*',
      'blob': 'application/octet-stream'
    };
    
    return contentTypes[type] || 'application/octet-stream';
  }

  /**
   * 清理内存缓存
   */
  cleanupMemoryCache() {
    const maxMemorySize = this.config.maxCacheSize / 4; // 使用1/4的最大缓存大小作为内存缓存限制
    let totalSize = 0;
    
    // 计算总大小
    for (const [url, cached] of this.cache) {
      totalSize += cached.size || 0;
    }
    
    // 如果超过限制，删除最旧的缓存
    if (totalSize > maxMemorySize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      for (const [url, cached] of entries) {
        this.cache.delete(url);
        totalSize -= cached.size || 0;
        
        if (totalSize <= maxMemorySize * 0.8) {
          break;
        }
      }
      
      console.log(`内存缓存清理完成，释放 ${this.formatSize(totalSize)}`);
    }
  }

  /**
   * 清理过期缓存
   */
  async cleanupExpiredCache() {
    const now = Date.now();
    
    // 清理内存缓存
    for (const [url, cached] of this.cache) {
      if (now - cached.timestamp > this.config.cacheExpiry) {
        this.cache.delete(url);
      }
    }
    
    // 清理IndexedDB缓存
    if (this.db) {
      try {
        const transaction = this.db.transaction(['resources'], 'readwrite');
        const store = transaction.objectStore('resources');
        const index = store.index('timestamp');
        const range = IDBKeyRange.upperBound(now - this.config.cacheExpiry);
        
        const request = index.openCursor(range);
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
      } catch (error) {
        console.warn('IndexedDB清理失败:', error);
      }
    }
    
    console.log('过期缓存清理完成');
  }

  /**
   * 设置资源监控
   */
  setupResourceMonitoring() {
    // 监控资源加载性能
    this.monitorResourcePerformance();
    
    // 监控缓存命中率
    this.monitorCacheHitRate();
    
    // 监控存储使用情况
    this.monitorStorageUsage();
  }

  /**
   * 监控资源加载性能
   */
  monitorResourcePerformance() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          const loadTime = entry.responseEnd - entry.startTime;
          const size = entry.transferSize;
          
          this.recordResourceMetrics(entry.name, {
            loadTime,
            size,
            type: this.getResourceTypeFromURL(entry.name),
            cached: entry.transferSize === 0
          });
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('资源性能监控设置失败:', error);
    }
  }

  /**
   * 从URL获取资源类型
   * @param {string} url - 资源URL
   * @returns {string} 资源类型
   */
  getResourceTypeFromURL(url) {
    if (url.match(/\.(css)$/i)) return 'css';
    if (url.match(/\.(js)$/i)) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    if (url.match(/\.(json)$/i)) return 'json';
    return 'other';
  }

  /**
   * 记录资源指标
   * @param {string} url - 资源URL
   * @param {Object} metrics - 指标数据
   */
  recordResourceMetrics(url, metrics) {
    if (!this.resources.has(url)) {
      this.resources.set(url, {
        url,
        loadCount: 0,
        totalLoadTime: 0,
        totalSize: 0,
        cacheHits: 0,
        type: metrics.type
      });
    }
    
    const resource = this.resources.get(url);
    resource.loadCount++;
    resource.totalLoadTime += metrics.loadTime;
    resource.totalSize += metrics.size;
    
    if (metrics.cached) {
      resource.cacheHits++;
    }
    
    // 记录性能问题
    if (metrics.loadTime > 2000) {
      console.warn(`资源加载缓慢: ${url} (${metrics.loadTime.toFixed(2)}ms)`);
    }
    
    if (metrics.size > 1024 * 1024) {
      console.warn(`资源过大: ${url} (${this.formatSize(metrics.size)})`);
    }
  }

  /**
   * 监控缓存命中率
   */
  monitorCacheHitRate() {
    setInterval(() => {
      let totalRequests = 0;
      let cacheHits = 0;
      
      for (const [url, resource] of this.resources) {
        totalRequests += resource.loadCount;
        cacheHits += resource.cacheHits;
      }
      
      const hitRate = totalRequests > 0 ? (cacheHits / totalRequests * 100).toFixed(1) : 0;
      console.log(`缓存命中率: ${hitRate}% (${cacheHits}/${totalRequests})`);
      
      // 触发缓存命中率事件
      const event = new CustomEvent('cacheHitRate', {
        detail: { hitRate: parseFloat(hitRate), cacheHits, totalRequests }
      });
      document.dispatchEvent(event);
    }, 60000); // 每分钟检查一次
  }

  /**
   * 监控存储使用情况
   */
  async monitorStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage / 1024 / 1024).toFixed(1);
        const quotaMB = (estimate.quota / 1024 / 1024).toFixed(1);
        const usagePercent = ((estimate.usage / estimate.quota) * 100).toFixed(1);
        
        console.log(`存储使用情况: ${usedMB}MB / ${quotaMB}MB (${usagePercent}%)`);
        
        // 如果使用率超过80%，触发清理
        if (parseFloat(usagePercent) > 80) {
          console.warn('存储空间不足，开始清理');
          await this.cleanupExpiredCache();
        }
      } catch (error) {
        console.warn('存储使用情况检查失败:', error);
      }
    }
  }

  /**
   * 设置错误处理
   */
  setupErrorHandling() {
    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target && event.target.tagName) {
        const element = event.target;
        const url = element.src || element.href;
        
        if (url) {
          console.error(`资源加载失败: ${url}`);
          this.handleResourceError(url, element);
        }
      }
    }, true);
    
    // 监听网络错误
    window.addEventListener('online', () => {
      console.log('网络连接恢复');
      this.retryFailedResources();
    });
    
    window.addEventListener('offline', () => {
      console.warn('网络连接断开，启用离线模式');
    });
  }

  /**
   * 处理资源错误
   * @param {string} url - 资源URL
   * @param {HTMLElement} element - 元素
   */
  handleResourceError(url, element) {
    // 记录错误
    if (!this.resources.has(url)) {
      this.resources.set(url, {
        url,
        loadCount: 0,
        errors: 0,
        type: this.getResourceTypeFromURL(url)
      });
    }
    
    const resource = this.resources.get(url);
    resource.errors = (resource.errors || 0) + 1;
    
    // 尝试备用资源
    this.tryFallbackResource(url, element);
  }

  /**
   * 尝试备用资源
   * @param {string} url - 原始URL
   * @param {HTMLElement} element - 元素
   */
  tryFallbackResource(url, element) {
    const fallbackMap = {
      'image': '/assets/placeholder.svg',
      'css': '/assets/fallback.css',
      'js': '/assets/fallback.js'
    };
    
    const resourceType = this.getResourceTypeFromURL(url);
    const fallbackUrl = fallbackMap[resourceType];
    
    if (fallbackUrl && element) {
      if (element.tagName === 'IMG') {
        element.src = fallbackUrl;
      } else if (element.tagName === 'LINK') {
        element.href = fallbackUrl;
      } else if (element.tagName === 'SCRIPT') {
        element.src = fallbackUrl;
      }
      
      console.log(`使用备用资源: ${fallbackUrl}`);
    }
  }

  /**
   * 重试失败的资源
   */
  async retryFailedResources() {
    const failedResources = Array.from(this.resources.entries())
      .filter(([url, resource]) => resource.errors > 0)
      .map(([url]) => url);
    
    for (const url of failedResources) {
      try {
        await this.loadResource(url, { cache: false, retry: false });
        console.log(`资源重试成功: ${url}`);
      } catch (error) {
        console.warn(`资源重试失败: ${url}`, error);
      }
    }
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise} Promise对象
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取资源统计
   * @returns {Object} 资源统计信息
   */
  getResourceStats() {
    const stats = {
      totalResources: this.resources.size,
      cacheSize: this.cache.size,
      totalRequests: 0,
      totalCacheHits: 0,
      totalErrors: 0,
      typeBreakdown: {},
      performanceMetrics: {
        averageLoadTime: 0,
        totalSize: 0
      }
    };
    
    let totalLoadTime = 0;
    let totalSize = 0;
    
    for (const [url, resource] of this.resources) {
      stats.totalRequests += resource.loadCount || 0;
      stats.totalCacheHits += resource.cacheHits || 0;
      stats.totalErrors += resource.errors || 0;
      
      // 类型统计
      const type = resource.type || 'other';
      if (!stats.typeBreakdown[type]) {
        stats.typeBreakdown[type] = { count: 0, size: 0, loadTime: 0 };
      }
      stats.typeBreakdown[type].count++;
      stats.typeBreakdown[type].size += resource.totalSize || 0;
      stats.typeBreakdown[type].loadTime += resource.totalLoadTime || 0;
      
      totalLoadTime += resource.totalLoadTime || 0;
      totalSize += resource.totalSize || 0;
    }
    
    stats.performanceMetrics.averageLoadTime = stats.totalRequests > 0 ? 
      totalLoadTime / stats.totalRequests : 0;
    stats.performanceMetrics.totalSize = totalSize;
    stats.cacheHitRate = stats.totalRequests > 0 ? 
      (stats.totalCacheHits / stats.totalRequests * 100).toFixed(1) : 0;
    
    return stats;
  }

  /**
   * 清空所有缓存
   */
  async clearAllCache() {
    // 清空内存缓存
    this.cache.clear();
    
    // 清空IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction(['resources'], 'readwrite');
        const store = transaction.objectStore('resources');
        await store.clear();
      } catch (error) {
        console.warn('IndexedDB清空失败:', error);
      }
    }
    
    // 清空Cache API
    if (this.cacheAPI) {
      try {
        const keys = await this.cacheAPI.keys();
        await Promise.all(keys.map(key => this.cacheAPI.delete(key)));
      } catch (error) {
        console.warn('Cache API清空失败:', error);
      }
    }
    
    console.log('所有缓存已清空');
  }

  /**
   * 销毁资源管理器
   */
  destroy() {
    this.cache.clear();
    this.resources.clear();
    
    if (this.db) {
      this.db.close();
    }
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResourceManager;
} else {
  window.ResourceManager = ResourceManager;
}