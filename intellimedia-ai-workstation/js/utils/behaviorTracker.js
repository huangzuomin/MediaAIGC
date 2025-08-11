/**
 * 用户行为跟踪系统
 * User Behavior Tracking System
 */

class BehaviorTracker {
    constructor() {
        this.interactions = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.isTracking = true;
        this.trackingEndpoint = '/api/analytics'; // 可配置的分析端点
        this.batchSize = 10;
        this.flushInterval = 30000; // 30秒
        
        this.init();
    }

    /**
     * 初始化行为跟踪系统
     */
    init() {
        this.setupEventListeners();
        this.startPeriodicFlush();
        this.trackPageView();
        this.setupVisibilityTracking();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 点击事件跟踪
        document.addEventListener('click', (event) => {
            this.trackClick(event);
        });

        // 滚动事件跟踪
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScroll();
            }, 100);
        });

        // 表单交互跟踪
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                this.trackFormInteraction(event);
            }
        });

        // 表单提交跟踪
        document.addEventListener('submit', (event) => {
            this.trackFormSubmit(event);
        });

        // 悬浮事件跟踪（节流处理）
        let hoverTimeout;
        document.addEventListener('mouseover', (event) => {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                this.trackHover(event);
            }, 500);
        });

        // 页面离开跟踪
        window.addEventListener('beforeunload', () => {
            this.trackPageExit();
            this.flush();
        });
    }

    /**
     * 跟踪页面浏览
     */
    trackPageView() {
        this.recordInteraction({
            type: 'page_view',
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: Date.now()
        });
    }

    /**
     * 跟踪点击事件
     */
    trackClick(event) {
        const element = event.target;
        const elementInfo = this.getElementInfo(element);
        
        // 特别关注CTA按钮和重要链接
        const isImportantElement = this.isImportantElement(element);
        
        this.recordInteraction({
            type: 'click',
            element: elementInfo,
            coordinates: {
                x: event.clientX,
                y: event.clientY
            },
            isImportant: isImportantElement,
            section: this.getCurrentSection(element),
            timestamp: Date.now()
        });

        // 如果是重要元素，立即上报
        if (isImportantElement) {
            this.flush();
        }
    }

    /**
     * 跟踪滚动事件
     */
    trackScroll() {
        const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        const currentSection = this.getCurrentSectionByScroll();
        
        this.recordInteraction({
            type: 'scroll',
            scrollY: window.scrollY,
            scrollPercentage: scrollPercentage,
            section: currentSection,
            timestamp: Date.now()
        });
    }

    /**
     * 跟踪表单交互
     */
    trackFormInteraction(event) {
        const element = event.target;
        
        this.recordInteraction({
            type: 'form_input',
            fieldName: element.name || element.id,
            fieldType: element.type,
            formId: element.form ? element.form.id : null,
            hasValue: element.value.length > 0,
            timestamp: Date.now()
        });
    }

    /**
     * 跟踪表单提交
     */
    trackFormSubmit(event) {
        const form = event.target;
        const formData = new FormData(form);
        const fields = {};
        
        for (let [key, value] of formData.entries()) {
            fields[key] = value ? 'has_value' : 'empty'; // 不记录实际值，只记录是否有值
        }
        
        this.recordInteraction({
            type: 'form_submit',
            formId: form.id,
            formAction: form.action,
            fields: fields,
            timestamp: Date.now()
        });

        // 表单提交是重要事件，立即上报
        this.flush();
    }

    /**
     * 跟踪悬浮事件
     */
    trackHover(event) {
        const element = event.target;
        const elementInfo = this.getElementInfo(element);
        
        // 只跟踪重要元素的悬浮
        if (this.isImportantElement(element)) {
            this.recordInteraction({
                type: 'hover',
                element: elementInfo,
                section: this.getCurrentSection(element),
                timestamp: Date.now()
            });
        }
    }

    /**
     * 跟踪页面离开
     */
    trackPageExit() {
        const timeOnPage = Date.now() - this.startTime;
        
        this.recordInteraction({
            type: 'page_exit',
            timeOnPage: timeOnPage,
            finalScrollPosition: window.scrollY,
            finalScrollPercentage: Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            ),
            timestamp: Date.now()
        });
    }

    /**
     * 设置页面可见性跟踪
     */
    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.recordInteraction({
                type: 'visibility_change',
                isVisible: !document.hidden,
                timestamp: Date.now()
            });
        });
    }

    /**
     * 获取元素信息
     */
    getElementInfo(element) {
        return {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            text: element.textContent ? element.textContent.substring(0, 100) : '',
            href: element.href || null,
            type: element.type || null
        };
    }

    /**
     * 判断是否为重要元素
     */
    isImportantElement(element) {
        const importantSelectors = [
            'button',
            'a[href]',
            '.cta-button',
            '.primary-button',
            '.secondary-button',
            '[data-track="important"]',
            'input[type="submit"]',
            '.pricing-card',
            '.agent-card',
            '.foundation-card'
        ];
        
        return importantSelectors.some(selector => {
            try {
                return element.matches(selector);
            } catch (e) {
                return false;
            }
        });
    }

    /**
     * 根据元素获取当前区域
     */
    getCurrentSection(element) {
        const sections = [
            { selector: '.hero-section', name: 'hero' },
            { selector: '.challenge-section', name: 'challenge' },
            { selector: '.foundation-section', name: 'foundation' },
            { selector: '.agents-section', name: 'agents' },
            { selector: '.pricing-section', name: 'pricing' },
            { selector: '.final-cta-section', name: 'final-cta' }
        ];
        
        let currentElement = element;
        while (currentElement && currentElement !== document.body) {
            for (let section of sections) {
                if (currentElement.matches && currentElement.matches(section.selector)) {
                    return section.name;
                }
            }
            currentElement = currentElement.parentElement;
        }
        
        return 'unknown';
    }

    /**
     * 根据滚动位置获取当前区域
     */
    getCurrentSectionByScroll() {
        const sections = document.querySelectorAll('section[class*="section"]');
        const scrollY = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop && scrollY <= sectionBottom) {
                return section.className.split(' ').find(cls => cls.includes('section')) || 'unknown';
            }
        }
        
        return 'unknown';
    }

    /**
     * 记录交互事件
     */
    recordInteraction(interaction) {
        if (!this.isTracking) return;
        
        interaction.sessionId = this.sessionId;
        interaction.id = this.generateInteractionId();
        
        this.interactions.push(interaction);
        
        // 如果达到批量大小，立即上报
        if (this.interactions.length >= this.batchSize) {
            this.flush();
        }
    }

    /**
     * 开始定期上报
     */
    startPeriodicFlush() {
        setInterval(() => {
            if (this.interactions.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }

    /**
     * 上报数据到服务器
     */
    async flush() {
        if (this.interactions.length === 0) return;
        
        const dataToSend = {
            sessionId: this.sessionId,
            interactions: [...this.interactions],
            timestamp: Date.now(),
            url: window.location.href
        };
        
        // 清空本地数据
        this.interactions = [];
        
        try {
            // 模拟数据上报（实际项目中替换为真实的API端点）
            console.log('Sending behavior data:', dataToSend);
            
            // 实际的数据上报代码：
            // await fetch(this.trackingEndpoint, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(dataToSend)
            // });
            
        } catch (error) {
            console.warn('Failed to send behavior data:', error);
            // 如果上报失败，可以选择重新加入队列或丢弃
        }
    }

    /**
     * 生成会话ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 生成交互ID
     */
    generateInteractionId() {
        return 'interaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 手动跟踪自定义事件
     */
    trackCustomEvent(eventType, eventData = {}) {
        this.recordInteraction({
            type: 'custom_event',
            eventType: eventType,
            eventData: eventData,
            timestamp: Date.now()
        });
    }

    /**
     * 跟踪转化事件
     */
    trackConversion(conversionType, value = null) {
        this.recordInteraction({
            type: 'conversion',
            conversionType: conversionType,
            value: value,
            timestamp: Date.now()
        });
        
        // 转化事件立即上报
        this.flush();
    }

    /**
     * 获取会话统计信息
     */
    getSessionStats() {
        const timeOnPage = Date.now() - this.startTime;
        const clickCount = this.interactions.filter(i => i.type === 'click').length;
        const scrollEvents = this.interactions.filter(i => i.type === 'scroll').length;
        
        return {
            sessionId: this.sessionId,
            timeOnPage: timeOnPage,
            interactionCount: this.interactions.length,
            clickCount: clickCount,
            scrollEvents: scrollEvents,
            currentUrl: window.location.href
        };
    }

    /**
     * 停止跟踪
     */
    stopTracking() {
        this.isTracking = false;
        this.flush(); // 上报剩余数据
    }

    /**
     * 恢复跟踪
     */
    resumeTracking() {
        this.isTracking = true;
    }
}

// 创建全局行为跟踪实例
window.BehaviorTracker = new BehaviorTracker();

// 导出行为跟踪类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BehaviorTracker;
}