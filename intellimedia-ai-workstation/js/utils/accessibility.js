/**
 * 可访问性工具类
 * Accessibility Utilities
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];
        
        this.keyboardNavigationEnabled = true;
        this.screenReaderAnnouncements = [];
        this.focusTrapStack = [];
        
        this.init();
    }

    /**
     * 初始化可访问性功能
     */
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALiveRegion();
        this.setupSkipLinks();
        this.enhanceFormAccessibility();
        this.setupColorContrastValidation();
        this.detectScreenReader();
    }

    /**
     * 设置键盘导航
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardNavigation(event);
        });

        // Tab键导航增强
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            }
        });

        // 回车键和空格键激活
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                this.handleActivationKeys(event);
            }
        });

        // Escape键处理
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.handleEscapeKey(event);
            }
        });
    }

    /**
     * 处理键盘导航
     */
    handleKeyboardNavigation(event) {
        const { key, target } = event;
        
        // 箭头键导航（用于菜单、选项卡等）
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            this.handleArrowKeyNavigation(event);
        }

        // Home/End键导航
        if (key === 'Home' || key === 'End') {
            this.handleHomeEndNavigation(event);
        }

        // 字母键快速导航
        if (key.length === 1 && key.match(/[a-zA-Z]/)) {
            this.handleLetterNavigation(event);
        }
    }

    /**
     * 处理Tab键导航
     */
    handleTabNavigation(event) {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (event.shiftKey) {
            // Shift+Tab 向前导航
            if (currentIndex <= 0) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab 向后导航
            if (currentIndex >= focusableElements.length - 1) {
                event.preventDefault();
                focusableElements[0].focus();
            }
        }
    }

    /**
     * 处理激活键（回车和空格）
     */
    handleActivationKeys(event) {
        const { target, key } = event;
        
        // 对于按钮和链接，回车和空格都应该激活
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            if (key === 'Enter' || (key === ' ' && target.tagName === 'BUTTON')) {
                event.preventDefault();
                target.click();
            }
        }

        // 对于自定义可点击元素
        if (target.hasAttribute('role') && 
            ['button', 'link', 'menuitem'].includes(target.getAttribute('role'))) {
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                target.click();
            }
        }
    }

    /**
     * 处理Escape键
     */
    handleEscapeKey(event) {
        // 关闭模态框
        const modal = document.querySelector('.modal.active, .dialog[open]');
        if (modal) {
            this.closeModal(modal);
            return;
        }

        // 退出焦点陷阱
        if (this.focusTrapStack.length > 0) {
            this.exitFocusTrap();
            return;
        }

        // 关闭下拉菜单
        const openDropdown = document.querySelector('.dropdown.open, .menu.open');
        if (openDropdown) {
            this.closeDropdown(openDropdown);
            return;
        }
    }

    /**
     * 处理箭头键导航
     */
    handleArrowKeyNavigation(event) {
        const { target, key } = event;
        const role = target.getAttribute('role');
        
        // 菜单导航
        if (role === 'menuitem' || target.closest('[role="menu"]')) {
            this.handleMenuNavigation(event);
        }
        
        // 选项卡导航
        if (role === 'tab' || target.closest('[role="tablist"]')) {
            this.handleTabListNavigation(event);
        }
        
        // 网格导航
        if (role === 'gridcell' || target.closest('[role="grid"]')) {
            this.handleGridNavigation(event);
        }
    }

    /**
     * 处理菜单导航
     */
    handleMenuNavigation(event) {
        const menu = event.target.closest('[role="menu"]');
        if (!menu) return;

        const menuItems = menu.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).indexOf(event.target);
        
        let nextIndex;
        switch (event.key) {
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % menuItems.length;
                break;
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = menuItems.length - 1;
                break;
            default:
                return;
        }
        
        event.preventDefault();
        menuItems[nextIndex].focus();
    }

    /**
     * 处理选项卡列表导航
     */
    handleTabListNavigation(event) {
        const tabList = event.target.closest('[role="tablist"]');
        if (!tabList) return;

        const tabs = tabList.querySelectorAll('[role="tab"]');
        const currentIndex = Array.from(tabs).indexOf(event.target);
        
        let nextIndex;
        switch (event.key) {
            case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                break;
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % tabs.length;
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = tabs.length - 1;
                break;
            default:
                return;
        }
        
        event.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click(); // 激活选项卡
    }

    /**
     * 设置焦点管理
     */
    setupFocusManagement() {
        // 焦点可见性指示器
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // 焦点陷阱管理
        this.setupFocusTrap();
    }

    /**
     * 设置焦点陷阱
     */
    setupFocusTrap() {
        // 监听模态框打开
        document.addEventListener('modalOpened', (event) => {
            this.trapFocus(event.detail.modal);
        });

        // 监听模态框关闭
        document.addEventListener('modalClosed', (event) => {
            this.exitFocusTrap();
        });
    }

    /**
     * 陷阱焦点在指定容器内
     */
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(this.focusableElements.join(','));
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // 保存当前焦点元素
        const previousFocus = document.activeElement;
        
        this.focusTrapStack.push({
            container,
            previousFocus,
            firstElement,
            lastElement
        });

        // 设置初始焦点
        firstElement.focus();

        // 监听Tab键
        const trapHandler = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', trapHandler);
        this.focusTrapStack[this.focusTrapStack.length - 1].trapHandler = trapHandler;
    }

    /**
     * 退出焦点陷阱
     */
    exitFocusTrap() {
        if (this.focusTrapStack.length === 0) return;

        const trap = this.focusTrapStack.pop();
        trap.container.removeEventListener('keydown', trap.trapHandler);
        
        // 恢复之前的焦点
        if (trap.previousFocus) {
            trap.previousFocus.focus();
        }
    }

    /**
     * 设置ARIA Live区域
     */
    setupARIALiveRegion() {
        // 创建屏幕阅读器公告区域
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);

        // 创建紧急公告区域
        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'aria-assertive-region';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.style.cssText = liveRegion.style.cssText;
        document.body.appendChild(assertiveRegion);
    }

    /**
     * 向屏幕阅读器公告消息
     */
    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-assertive-region' : 'aria-live-region';
        const region = document.getElementById(regionId);
        
        if (region) {
            // 清空区域然后设置新消息
            region.textContent = '';
            setTimeout(() => {
                region.textContent = message;
            }, 100);

            // 记录公告
            this.screenReaderAnnouncements.push({
                message,
                priority,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * 设置跳转链接
     */
    setupSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">跳转到主要内容</a>
            <a href="#navigation" class="skip-link">跳转到导航</a>
            <a href="#footer" class="skip-link">跳转到页脚</a>
        `;

        // 添加跳转链接样式
        const skipLinkStyles = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                z-index: 10001;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;

        // 添加样式到页面
        const styleElement = document.createElement('style');
        styleElement.textContent = skipLinkStyles;
        document.head.appendChild(styleElement);

        // 添加跳转链接到页面顶部
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    /**
     * 增强表单可访问性
     */
    enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.enhanceFormFields(form);
            this.setupFormValidationAnnouncements(form);
        });
    }

    /**
     * 增强表单字段
     */
    enhanceFormFields(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            // 确保每个字段都有标签
            this.ensureFieldLabel(field);
            
            // 添加必填字段指示
            if (field.hasAttribute('required')) {
                this.markRequiredField(field);
            }
            
            // 添加字段描述
            this.addFieldDescription(field);
            
            // 设置错误消息关联
            this.setupFieldErrorAssociation(field);
        });
    }

    /**
     * 确保字段有标签
     */
    ensureFieldLabel(field) {
        const existingLabel = document.querySelector(`label[for="${field.id}"]`);
        
        if (!existingLabel && field.id) {
            // 尝试找到相邻的标签文本
            const labelText = this.findLabelText(field);
            if (labelText) {
                const label = document.createElement('label');
                label.setAttribute('for', field.id);
                label.textContent = labelText;
                label.className = 'sr-only'; // 屏幕阅读器专用
                field.parentNode.insertBefore(label, field);
            }
        }
        
        // 如果仍然没有标签，使用aria-label
        if (!existingLabel && !field.getAttribute('aria-label')) {
            const placeholder = field.getAttribute('placeholder');
            if (placeholder) {
                field.setAttribute('aria-label', placeholder);
            }
        }
    }

    /**
     * 查找标签文本
     */
    findLabelText(field) {
        // 查找前面的文本节点或元素
        let sibling = field.previousSibling;
        while (sibling) {
            if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent.trim()) {
                return sibling.textContent.trim();
            }
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling.textContent.trim()) {
                return sibling.textContent.trim();
            }
            sibling = sibling.previousSibling;
        }
        
        // 查找父元素中的文本
        const parent = field.parentElement;
        if (parent) {
            const textContent = parent.textContent.replace(field.value || '', '').trim();
            if (textContent) {
                return textContent;
            }
        }
        
        return null;
    }

    /**
     * 标记必填字段
     */
    markRequiredField(field) {
        field.setAttribute('aria-required', 'true');
        
        // 添加视觉指示器
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label && !label.querySelector('.required-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'required-indicator';
            indicator.textContent = ' *';
            indicator.setAttribute('aria-label', '必填');
            label.appendChild(indicator);
        }
    }

    /**
     * 添加字段描述
     */
    addFieldDescription(field) {
        const description = field.getAttribute('data-description');
        if (description) {
            const descId = field.id + '-description';
            let descElement = document.getElementById(descId);
            
            if (!descElement) {
                descElement = document.createElement('div');
                descElement.id = descId;
                descElement.className = 'field-description';
                descElement.textContent = description;
                field.parentNode.insertBefore(descElement, field.nextSibling);
            }
            
            // 关联描述
            const describedBy = field.getAttribute('aria-describedby');
            if (describedBy) {
                field.setAttribute('aria-describedby', describedBy + ' ' + descId);
            } else {
                field.setAttribute('aria-describedby', descId);
            }
        }
    }

    /**
     * 设置字段错误关联
     */
    setupFieldErrorAssociation(field) {
        const errorId = field.id + '-error';
        
        // 监听验证事件
        field.addEventListener('invalid', () => {
            let errorElement = document.getElementById(errorId);
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'field-error';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            
            errorElement.textContent = field.validationMessage;
            field.setAttribute('aria-invalid', 'true');
            
            // 关联错误消息
            const describedBy = field.getAttribute('aria-describedby');
            if (describedBy && !describedBy.includes(errorId)) {
                field.setAttribute('aria-describedby', describedBy + ' ' + errorId);
            } else if (!describedBy) {
                field.setAttribute('aria-describedby', errorId);
            }
            
            // 公告错误
            this.announceToScreenReader(`字段 ${this.getFieldLabel(field)} 有错误: ${field.validationMessage}`, 'assertive');
        });
        
        // 清除错误状态
        field.addEventListener('input', () => {
            if (field.validity.valid) {
                field.removeAttribute('aria-invalid');
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.remove();
                }
            }
        });
    }

    /**
     * 获取字段标签
     */
    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        
        const ariaLabel = field.getAttribute('aria-label');
        if (ariaLabel) {
            return ariaLabel;
        }
        
        return field.name || field.id || '未知字段';
    }

    /**
     * 设置表单验证公告
     */
    setupFormValidationAnnouncements(form) {
        form.addEventListener('submit', (event) => {
            const invalidFields = form.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                event.preventDefault();
                
                const firstInvalidField = invalidFields[0];
                firstInvalidField.focus();
                
                this.announceToScreenReader(
                    `表单提交失败，发现 ${invalidFields.length} 个错误。请检查并修正错误后重新提交。`,
                    'assertive'
                );
            } else {
                this.announceToScreenReader('表单提交成功', 'polite');
            }
        });
    }

    /**
     * 设置颜色对比度验证
     */
    setupColorContrastValidation() {
        // 在开发模式下检查颜色对比度
        if (this.isDevelopmentMode()) {
            this.validateColorContrast();
        }
    }

    /**
     * 验证颜色对比度
     */
    validateColorContrast() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
        
        textElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrastRatio(color, backgroundColor);
                const fontSize = parseFloat(styles.fontSize);
                const fontWeight = styles.fontWeight;
                
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
                const minContrast = isLargeText ? 3 : 4.5;
                
                if (contrast < minContrast) {
                    console.warn(`颜色对比度不足: ${element.tagName} 元素的对比度为 ${contrast.toFixed(2)}, 需要至少 ${minContrast}`, element);
                }
            }
        });
    }

    /**
     * 计算颜色对比度
     */
    calculateContrastRatio(color1, color2) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        const l1 = this.getRelativeLuminance(rgb1);
        const l2 = this.getRelativeLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * 解析颜色值
     */
    parseColor(color) {
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        
        const computedColor = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        
        return null;
    }

    /**
     * 获取相对亮度
     */
    getRelativeLuminance(rgb) {
        const { r, g, b } = rgb;
        
        const sR = r / 255;
        const sG = g / 255;
        const sB = b / 255;
        
        const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
        const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
        const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }

    /**
     * 检测屏幕阅读器
     */
    detectScreenReader() {
        // 检测常见的屏幕阅读器
        const userAgent = navigator.userAgent.toLowerCase();
        const screenReaders = ['nvda', 'jaws', 'dragon', 'zoomtext', 'fusion'];
        
        const hasScreenReader = screenReaders.some(sr => userAgent.includes(sr));
        
        if (hasScreenReader) {
            document.body.classList.add('screen-reader-detected');
            this.announceToScreenReader('屏幕阅读器支持已启用', 'polite');
        }
        
        // 检测是否启用了高对比度模式
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast-mode');
        }
        
        // 检测是否启用了减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    /**
     * 获取可聚焦元素
     */
    getFocusableElements(container = document) {
        return Array.from(container.querySelectorAll(this.focusableElements.join(',')))
            .filter(element => {
                return element.offsetWidth > 0 && 
                       element.offsetHeight > 0 && 
                       !element.disabled &&
                       element.tabIndex !== -1;
            });
    }

    /**
     * 检查是否为开发模式
     */
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');
    }

    /**
     * 关闭模态框
     */
    closeModal(modal) {
        modal.classList.remove('active');
        modal.removeAttribute('open');
        
        // 触发关闭事件
        const closeEvent = new CustomEvent('modalClosed', {
            detail: { modal }
        });
        document.dispatchEvent(closeEvent);
        
        this.announceToScreenReader('对话框已关闭', 'polite');
    }

    /**
     * 关闭下拉菜单
     */
    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        
        // 恢复触发元素焦点
        const trigger = dropdown.querySelector('[aria-expanded="true"]');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
        }
        
        this.announceToScreenReader('菜单已关闭', 'polite');
    }

    /**
     * 添加ARIA标签到元素
     */
    addARIALabels() {
        // 为重要的交互元素添加ARIA标签
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                const purpose = this.inferButtonPurpose(button);
                if (purpose) {
                    button.setAttribute('aria-label', purpose);
                }
            }
        });

        // 为链接添加描述性标签
        const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            if (!link.textContent.trim() || link.textContent.trim() === '更多' || link.textContent.trim() === '点击这里') {
                const purpose = this.inferLinkPurpose(link);
                if (purpose) {
                    link.setAttribute('aria-label', purpose);
                }
            }
        });

        // 为图片添加替代文本
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            const altText = this.generateImageAltText(img);
            img.setAttribute('alt', altText);
        });
    }

    /**
     * 推断按钮用途
     */
    inferButtonPurpose(button) {
        const className = button.className;
        const parent = button.parentElement;
        
        if (className.includes('close')) return '关闭';
        if (className.includes('menu')) return '菜单';
        if (className.includes('search')) return '搜索';
        if (className.includes('submit')) return '提交';
        if (className.includes('cta')) return '行动号召按钮';
        
        if (parent) {
            const parentText = parent.textContent.replace(button.textContent, '').trim();
            if (parentText) {
                return `${parentText}按钮`;
            }
        }
        
        return '按钮';
    }

    /**
     * 推断链接用途
     */
    inferLinkPurpose(link) {
        const href = link.getAttribute('href');
        const className = link.className;
        
        if (href) {
            if (href.startsWith('tel:')) return `拨打电话 ${href.replace('tel:', '')}`;
            if (href.startsWith('mailto:')) return `发送邮件到 ${href.replace('mailto:', '')}`;
            if (href.startsWith('#')) return `跳转到 ${href.replace('#', '')} 部分`;
        }
        
        if (className.includes('cta')) return '行动号召链接';
        if (className.includes('download')) return '下载链接';
        
        return '链接';
    }

    /**
     * 生成图片替代文本
     */
    generateImageAltText(img) {
        const src = img.src;
        const className = img.className;
        
        if (className.includes('logo')) return '公司标志';
        if (className.includes('icon')) return '图标';
        if (className.includes('avatar')) return '用户头像';
        if (className.includes('product')) return '产品图片';
        
        // 从文件名推断
        if (src) {
            const filename = src.split('/').pop().split('.')[0];
            return `图片: ${filename}`;
        }
        
        return '图片';
    }

    /**
     * 获取可访问性报告
     */
    getAccessibilityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            focusableElements: this.getFocusableElements().length,
            missingAltText: document.querySelectorAll('img:not([alt]), img[alt=""]').length,
            missingLabels: document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').length,
            screenReaderAnnouncements: this.screenReaderAnnouncements.length,
            keyboardNavigationEnabled: this.keyboardNavigationEnabled,
            colorContrastIssues: 0 // 需要实际检测
        };
        
        return report;
    }
}

// 创建全局可访问性管理器实例
window.AccessibilityManager = new AccessibilityManager();

// 导出可访问性管理器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}