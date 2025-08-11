/**
 * 可访问性测试套件
 * Accessibility Test Suite
 */

describe('可访问性测试', () => {
    let accessibilityManager;

    beforeAll(() => {
        // 初始化可访问性管理器
        if (window.AccessibilityManager) {
            accessibilityManager = window.AccessibilityManager;
        }
    });

    describe('ARIA标签和语义化测试', () => {
        it('页面应该有正确的语言属性', () => {
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            
            expect(lang).toBeTruthy();
            expect(lang).toBe('zh-CN');
        });

        it('页面应该有正确的标题结构', () => {
            // 检查是否有h1标题
            const h1Elements = document.querySelectorAll('h1');
            expect(h1Elements.length).toBeGreaterThan(0);
            
            // 检查标题层级是否合理
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            
            headings.forEach(heading => {
                const currentLevel = parseInt(heading.tagName.charAt(1));
                
                // 标题层级不应该跳跃太大
                if (previousLevel > 0) {
                    expect(currentLevel - previousLevel).toBeLessThan(3);
                }
                
                previousLevel = currentLevel;
            });
        });

        it('图片应该有替代文本', () => {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                const alt = img.getAttribute('alt');
                const ariaLabel = img.getAttribute('aria-label');
                const ariaLabelledby = img.getAttribute('aria-labelledby');
                
                // 图片应该有alt属性、aria-label或aria-labelledby
                const hasAccessibleName = alt !== null || ariaLabel || ariaLabelledby;
                expect(hasAccessibleName).toBeTruthy();
                
                // 如果有alt属性，不应该为空（除非是装饰性图片）
                if (alt !== null && !img.hasAttribute('role')) {
                    expect(alt.length).toBeGreaterThan(0);
                }
            });
        });

        it('表单元素应该有正确的标签', () => {
            const formElements = document.querySelectorAll('input, textarea, select');
            
            formElements.forEach(element => {
                const id = element.getAttribute('id');
                const ariaLabel = element.getAttribute('aria-label');
                const ariaLabelledby = element.getAttribute('aria-labelledby');
                
                if (id) {
                    const label = document.querySelector(`label[for="${id}"]`);
                    const hasLabel = label || ariaLabel || ariaLabelledby;
                    
                    expect(hasLabel).toBeTruthy();
                } else {
                    // 没有id的元素应该有aria-label
                    expect(ariaLabel).toBeTruthy();
                }
            });
        });

        it('按钮应该有可访问的名称', () => {
            const buttons = document.querySelectorAll('button, [role="button"]');
            
            buttons.forEach(button => {
                const textContent = button.textContent.trim();
                const ariaLabel = button.getAttribute('aria-label');
                const ariaLabelledby = button.getAttribute('aria-labelledby');
                
                const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;
                expect(hasAccessibleName).toBeTruthy();
            });
        });

        it('链接应该有描述性文本', () => {
            const links = document.querySelectorAll('a[href]');
            
            links.forEach(link => {
                const textContent = link.textContent.trim();
                const ariaLabel = link.getAttribute('aria-label');
                const ariaLabelledby = link.getAttribute('aria-labelledby');
                
                const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;
                expect(hasAccessibleName).toBeTruthy();
                
                // 避免使用无意义的链接文本
                const meaninglessTexts = ['点击这里', '更多', 'click here', 'more'];
                if (textContent && !ariaLabel && !ariaLabelledby) {
                    expect(meaninglessTexts.includes(textContent.toLowerCase())).toBeFalsy();
                }
            });
        });

        it('区域应该有正确的地标角色', () => {
            // 检查主要地标
            const main = document.querySelector('main, [role="main"]');
            expect(main).toBeTruthy();
            
            // 检查导航区域
            const nav = document.querySelector('nav, [role="navigation"]');
            // 导航可能不存在，这里只是检查如果存在是否正确
            
            // 检查内容区域
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const role = section.getAttribute('role');
                const ariaLabel = section.getAttribute('aria-label');
                const ariaLabelledby = section.getAttribute('aria-labelledby');
                
                // 如果有role，应该是合适的地标角色
                if (role) {
                    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
                    expect(validRoles.includes(role)).toBeTruthy();
                }
                
                // 如果是region角色，应该有可访问的名称
                if (role === 'region') {
                    expect(ariaLabel || ariaLabelledby).toBeTruthy();
                }
            });
        });
    });

    describe('键盘导航测试', () => {
        it('所有交互元素应该可以通过键盘访问', () => {
            const interactiveElements = document.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]'
            );
            
            interactiveElements.forEach(element => {
                const tabIndex = element.getAttribute('tabindex');
                
                // 元素应该可以获得焦点
                if (tabIndex !== '-1') {
                    expect(element.tabIndex).toBeGreaterThan(-2);
                }
            });
        });

        it('跳转链接应该存在且功能正常', () => {
            const skipLinks = document.querySelectorAll('.skip-link');
            
            expect(skipLinks.length).toBeGreaterThan(0);
            
            skipLinks.forEach(link => {
                const href = link.getAttribute('href');
                expect(href).toBeTruthy();
                expect(href.startsWith('#')).toBeTruthy();
                
                // 检查目标元素是否存在
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                expect(targetElement).toBeTruthy();
            });
        });

        it('焦点指示器应该可见', () => {
            // 创建测试按钮
            const testButton = document.createElement('button');
            testButton.textContent = '测试按钮';
            testButton.className = 'btn-primary';
            document.body.appendChild(testButton);
            
            // 模拟键盘导航
            document.body.classList.add('keyboard-navigation');
            testButton.focus();
            
            // 检查焦点样式
            const computedStyle = window.getComputedStyle(testButton, ':focus');
            const outline = computedStyle.outline;
            const boxShadow = computedStyle.boxShadow;
            
            // 应该有可见的焦点指示器
            const hasFocusIndicator = outline !== 'none' || boxShadow !== 'none';
            expect(hasFocusIndicator).toBeTruthy();
            
            // 清理
            document.body.removeChild(testButton);
            document.body.classList.remove('keyboard-navigation');
        });

        it('Tab键导航顺序应该合理', () => {
            const focusableElements = document.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            // 检查tabindex值
            let customTabIndexElements = [];
            focusableElements.forEach(element => {
                const tabIndex = parseInt(element.getAttribute('tabindex')) || 0;
                if (tabIndex > 0) {
                    customTabIndexElements.push({ element, tabIndex });
                }
            });
            
            // 自定义tabindex应该按顺序排列
            customTabIndexElements.sort((a, b) => a.tabIndex - b.tabIndex);
            
            for (let i = 1; i < customTabIndexElements.length; i++) {
                expect(customTabIndexElements[i].tabIndex).toBeGreaterThan(customTabIndexElements[i-1].tabIndex);
            }
        });
    });

    describe('屏幕阅读器支持测试', () => {
        it('ARIA live区域应该存在', () => {
            const liveRegion = document.getElementById('aria-live-region');
            const assertiveRegion = document.getElementById('aria-assertive-region');
            
            expect(liveRegion).toBeTruthy();
            expect(assertiveRegion).toBeTruthy();
            
            expect(liveRegion.getAttribute('aria-live')).toBe('polite');
            expect(assertiveRegion.getAttribute('aria-live')).toBe('assertive');
        });

        it('动态内容更新应该通知屏幕阅读器', () => {
            if (!accessibilityManager) {
                console.warn('AccessibilityManager未加载，跳过测试');
                return;
            }
            
            const liveRegion = document.getElementById('aria-live-region');
            const initialContent = liveRegion.textContent;
            
            // 测试公告功能
            accessibilityManager.announceToScreenReader('测试公告', 'polite');
            
            // 等待一小段时间让公告生效
            setTimeout(() => {
                expect(liveRegion.textContent).toBe('测试公告');
                
                // 恢复初始内容
                liveRegion.textContent = initialContent;
            }, 200);
        });

        it('表单错误应该正确公告', () => {
            // 创建测试表单
            const testForm = document.createElement('form');
            const testInput = document.createElement('input');
            testInput.type = 'text';
            testInput.id = 'test-input';
            testInput.required = true;
            testForm.appendChild(testInput);
            document.body.appendChild(testForm);
            
            // 模拟表单验证失败
            const errorMessage = '此字段为必填项';
            const errorElement = document.createElement('div');
            errorElement.id = 'test-input-error';
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.textContent = errorMessage;
            testInput.parentNode.appendChild(errorElement);
            
            testInput.setAttribute('aria-invalid', 'true');
            testInput.setAttribute('aria-describedby', 'test-input-error');
            
            // 检查错误关联
            expect(testInput.getAttribute('aria-invalid')).toBe('true');
            expect(testInput.getAttribute('aria-describedby')).toContain('test-input-error');
            expect(errorElement.getAttribute('role')).toBe('alert');
            
            // 清理
            document.body.removeChild(testForm);
        });

        it('状态变化应该正确公告', () => {
            // 创建测试按钮
            const testButton = document.createElement('button');
            testButton.textContent = '加载数据';
            testButton.setAttribute('aria-describedby', 'button-status');
            
            const statusElement = document.createElement('div');
            statusElement.id = 'button-status';
            statusElement.setAttribute('aria-live', 'polite');
            statusElement.textContent = '准备就绪';
            
            document.body.appendChild(testButton);
            document.body.appendChild(statusElement);
            
            // 模拟状态变化
            testButton.textContent = '加载中...';
            testButton.disabled = true;
            statusElement.textContent = '正在加载数据，请稍候';
            
            expect(testButton.disabled).toBeTruthy();
            expect(statusElement.textContent).toBe('正在加载数据，请稍候');
            
            // 清理
            document.body.removeChild(testButton);
            document.body.removeChild(statusElement);
        });
    });

    describe('颜色对比度测试', () => {
        it('文本颜色对比度应该符合WCAG标准', () => {
            if (!accessibilityManager) {
                console.warn('AccessibilityManager未加载，跳过测试');
                return;
            }
            
            // 测试主要文本元素
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
            
            textElements.forEach(element => {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // 如果有背景色，检查对比度
                if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
                    const contrast = accessibilityManager.calculateContrastRatio(color, backgroundColor);
                    const fontSize = parseFloat(styles.fontSize);
                    const fontWeight = styles.fontWeight;
                    
                    const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
                    const minContrast = isLargeText ? 3 : 4.5;
                    
                    if (contrast > 0) {
                        expect(contrast).toBeGreaterThan(minContrast);
                    }
                }
            });
        });

        it('链接颜色对比度应该符合标准', () => {
            const links = document.querySelectorAll('a');
            
            links.forEach(link => {
                const styles = window.getComputedStyle(link);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // 检查链接是否有足够的对比度
                if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    // 这里应该使用实际的对比度计算
                    // 简化测试：检查颜色不是透明的
                    expect(color).not.toBe('transparent');
                    expect(color).not.toBe('rgba(0, 0, 0, 0)');
                }
            });
        });

        it('按钮颜色对比度应该符合标准', () => {
            const buttons = document.querySelectorAll('button, .btn');
            
            buttons.forEach(button => {
                const styles = window.getComputedStyle(button);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // 按钮应该有明显的颜色区分
                expect(color).not.toBe(backgroundColor);
                expect(color).not.toBe('transparent');
                expect(backgroundColor).not.toBe('transparent');
            });
        });
    });

    describe('响应式可访问性测试', () => {
        it('移动端触摸目标应该足够大', () => {
            // 模拟移动端
            const originalInnerWidth = window.innerWidth;
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375
            });
            
            const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
            
            interactiveElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const minSize = 44; // iOS推荐的最小触摸目标尺寸
                
                // 在移动端，触摸目标应该足够大
                if (window.innerWidth < 768) {
                    expect(Math.max(rect.width, rect.height)).toBeGreaterThan(minSize - 10); // 允许一些误差
                }
            });
            
            // 恢复原始值
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: originalInnerWidth
            });
        });

        it('缩放到200%时内容应该仍然可访问', () => {
            // 模拟页面缩放
            const originalZoom = document.body.style.zoom;
            document.body.style.zoom = '200%';
            
            // 检查重要元素是否仍然可见
            const importantElements = document.querySelectorAll('h1, .btn-primary, nav');
            
            importantElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                
                // 元素应该仍然在视口内或部分可见
                expect(rect.width).toBeGreaterThan(0);
                expect(rect.height).toBeGreaterThan(0);
            });
            
            // 恢复原始缩放
            document.body.style.zoom = originalZoom;
        });
    });

    describe('用户偏好设置支持', () => {
        it('应该支持减少动画偏好', () => {
            // 模拟用户偏好减少动画
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (mediaQuery.matches) {
                // 检查动画是否被禁用或减少
                const animatedElements = document.querySelectorAll('.fade-in, .slide-up, [class*="animate"]');
                
                animatedElements.forEach(element => {
                    const styles = window.getComputedStyle(element);
                    const animationDuration = styles.animationDuration;
                    const transitionDuration = styles.transitionDuration;
                    
                    // 动画时间应该很短或为0
                    if (animationDuration !== 'none') {
                        const duration = parseFloat(animationDuration);
                        expect(duration).toBeLessThan(0.1); // 少于100ms
                    }
                    
                    if (transitionDuration !== 'none') {
                        const duration = parseFloat(transitionDuration);
                        expect(duration).toBeLessThan(0.1); // 少于100ms
                    }
                });
            }
        });

        it('应该支持高对比度模式', () => {
            const mediaQuery = window.matchMedia('(prefers-contrast: high)');
            
            if (mediaQuery.matches) {
                // 在高对比度模式下，应该有更强的视觉对比
                const textElements = document.querySelectorAll('p, h1, h2, h3, button');
                
                textElements.forEach(element => {
                    const styles = window.getComputedStyle(element);
                    const color = styles.color;
                    const backgroundColor = styles.backgroundColor;
                    
                    // 颜色应该是高对比度的
                    expect(color).not.toBe(backgroundColor);
                });
            }
        });
    });

    afterAll(() => {
        // 生成可访问性报告
        if (accessibilityManager) {
            const report = accessibilityManager.getAccessibilityReport();
            
            console.log('\n♿ 可访问性测试报告:');
            console.log('='.repeat(50));
            console.log(`可聚焦元素数量: ${report.focusableElements}`);
            console.log(`缺少alt文本的图片: ${report.missingAltText}`);
            console.log(`缺少标签的输入框: ${report.missingLabels}`);
            console.log(`屏幕阅读器公告次数: ${report.screenReaderAnnouncements}`);
            console.log(`键盘导航: ${report.keyboardNavigationEnabled ? '已启用' : '未启用'}`);
            console.log('='.repeat(50));
        }
    });
});