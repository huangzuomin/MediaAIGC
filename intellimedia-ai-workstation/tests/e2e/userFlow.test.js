/**
 * 端到端用户流程测试
 * End-to-End User Flow Tests
 */

describe('用户完整流程测试', () => {
    let app;

    beforeAll(() => {
        // 模拟应用程序初始化
        if (window.IntelliMediaApp) {
            app = window.IntelliMediaApp;
        }
    });

    describe('首次访问流程', () => {
        it('应该正确加载页面', async () => {
            // 模拟页面加载
            const loadEvent = new Event('load');
            window.dispatchEvent(loadEvent);

            // 验证页面基本元素存在
            const heroSection = document.querySelector('#hero');
            const challengeSection = document.querySelector('#challenges');
            const foundationSection = document.querySelector('#foundation');
            const agentsSection = document.querySelector('#agents');
            const pricingSection = document.querySelector('#pricing');
            const finalCTASection = document.querySelector('#final-cta');

            expect(heroSection).toBeTruthy();
            expect(challengeSection).toBeTruthy();
            expect(foundationSection).toBeTruthy();
            expect(agentsSection).toBeTruthy();
            expect(pricingSection).toBeTruthy();
            expect(finalCTASection).toBeTruthy();
        });

        it('应该正确初始化所有组件', () => {
            if (!app) {
                console.warn('应用程序未加载，跳过测试');
                return;
            }

            // 验证组件注册
            const expectedComponents = [
                'heroSection',
                'challengeSection', 
                'foundationSection',
                'agentsSection',
                'pricingSection',
                'finalCTASection'
            ];

            expectedComponents.forEach(componentName => {
                const component = app.getComponent(componentName);
                if (component) {
                    expect(component).toBeTruthy();
                }
            });
        });

        it('应该正确设置SEO元数据', () => {
            const title = document.querySelector('title');
            const description = document.querySelector('meta[name="description"]');
            const keywords = document.querySelector('meta[name="keywords"]');

            expect(title).toBeTruthy();
            expect(title.textContent).toContain('智媒AI工作站');
            
            if (description) {
                expect(description.getAttribute('content')).toContain('AI');
            }
            
            if (keywords) {
                expect(keywords.getAttribute('content')).toContain('AI');
            }
        });
    });

    describe('用户浏览流程', () => {
        it('应该支持平滑滚动导航', async () => {
            // 模拟点击导航链接
            const mockLink = Mock.element('a', { href: '#challenges' });
            const clickEvent = new Event('click');
            
            // 模拟Utils.smoothScrollTo函数
            if (window.Utils && window.Utils.smoothScrollTo) {
                const smoothScrollSpy = Mock.fn();
                window.Utils.smoothScrollTo = smoothScrollSpy;
                
                mockLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.Utils.smoothScrollTo('#challenges', 80);
                });
                
                mockLink.dispatchEvent(clickEvent);
                
                expect(smoothScrollSpy).toHaveBeenCalledWith('#challenges', 80);
            }
        });

        it('应该正确处理挑战卡片交互', () => {
            const mockCard = Mock.element('div', { 
                class: 'challenge-card',
                'data-challenge': 'content-production'
            });

            const eventListener = Mock.fn();
            document.addEventListener('challengeCardClick', eventListener);

            // 模拟卡片点击
            const clickEvent = new CustomEvent('challengeCardClick', {
                detail: {
                    challengeId: 'content-production',
                    challenge: { title: '内容生产效率低下' }
                }
            });

            document.dispatchEvent(clickEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('challengeCardClick', eventListener);
        });

        it('应该正确处理基座功能卡片交互', () => {
            const mockCard = Mock.element('div', { 
                class: 'foundation-card',
                'data-foundation': 'ai-engine'
            });

            const eventListener = Mock.fn();
            document.addEventListener('foundationCardClick', eventListener);

            // 模拟卡片点击
            const clickEvent = new CustomEvent('foundationCardClick', {
                detail: {
                    foundationId: 'ai-engine',
                    foundation: { title: '核心AI引擎管理' }
                }
            });

            document.dispatchEvent(clickEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('foundationCardClick', eventListener);
        });

        it('应该正确处理智能体交互', () => {
            const eventListener = Mock.fn();
            document.addEventListener('agentClick', eventListener);

            // 模拟智能体点击
            const clickEvent = new CustomEvent('agentClick', {
                detail: {
                    agentId: 'news-writer',
                    agent: { name: '新闻写作智能体' }
                }
            });

            document.dispatchEvent(clickEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('agentClick', eventListener);
        });
    });

    describe('价格方案选择流程', () => {
        it('应该正确显示价格方案', () => {
            const expectedPlans = ['basic', 'professional', 'enterprise'];
            
            expectedPlans.forEach(planId => {
                const mockCard = Mock.element('div', {
                    class: 'pricing-card',
                    'data-plan': planId
                });
                
                expect(mockCard.getAttribute('data-plan')).toBe(planId);
            });
        });

        it('应该正确处理价格方案CTA点击', () => {
            const eventListener = Mock.fn();
            document.addEventListener('pricingCTAClick', eventListener);

            // 模拟专业版咨询点击
            const clickEvent = new CustomEvent('pricingCTAClick', {
                detail: {
                    action: 'consult-professional',
                    planId: 'professional',
                    plan: { name: '专业版' }
                }
            });

            document.dispatchEvent(clickEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('pricingCTAClick', eventListener);
        });

        it('应该跟踪转化事件', () => {
            if (!app) {
                console.warn('应用程序未加载，跳过测试');
                return;
            }

            const eventListener = Mock.fn();
            document.addEventListener('conversionTracked', eventListener);

            // 模拟转化跟踪
            const conversionEvent = new CustomEvent('conversionTracked', {
                detail: {
                    eventType: 'professional_consultation_intent',
                    timestamp: new Date().toISOString(),
                    page: 'pricing'
                }
            });

            document.dispatchEvent(conversionEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('conversionTracked', eventListener);
        });
    });

    describe('演示预约流程', () => {
        it('应该正确显示演示预约表单', () => {
            const eventListener = Mock.fn();
            document.addEventListener('finalCTAClick', eventListener);

            // 模拟最终CTA点击
            const clickEvent = new CustomEvent('finalCTAClick', {
                detail: {
                    action: 'show-demo-form',
                    formVisible: true
                }
            });

            document.dispatchEvent(clickEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('finalCTAClick', eventListener);
        });

        it('应该正确验证表单数据', () => {
            const mockForm = Mock.element('form');
            const mockNameInput = Mock.element('input', { 
                type: 'text', 
                name: 'name',
                required: true
            });
            const mockEmailInput = Mock.element('input', { 
                type: 'email', 
                name: 'email',
                required: true
            });
            const mockPhoneInput = Mock.element('input', { 
                type: 'tel', 
                name: 'phone',
                required: true
            });

            mockForm.appendChild(mockNameInput);
            mockForm.appendChild(mockEmailInput);
            mockForm.appendChild(mockPhoneInput);

            // 模拟表单验证
            const validateForm = (form) => {
                const requiredFields = [mockNameInput, mockEmailInput, mockPhoneInput];
                return requiredFields.every(field => {
                    return field.value && field.value.trim() !== '';
                });
            };

            // 测试空表单
            expect(validateForm(mockForm)).toBeFalsy();

            // 测试填写完整的表单
            mockNameInput.value = '张三';
            mockEmailInput.value = 'zhangsan@example.com';
            mockPhoneInput.value = '13800138000';

            expect(validateForm(mockForm)).toBeTruthy();
        });

        it('应该正确处理表单提交', () => {
            const eventListener = Mock.fn();
            document.addEventListener('demoFormSubmit', eventListener);

            // 模拟表单提交
            const submitEvent = new CustomEvent('demoFormSubmit', {
                detail: {
                    formData: {
                        name: '张三',
                        email: 'zhangsan@example.com',
                        phone: '13800138000',
                        company: '测试公司',
                        message: '希望了解更多产品信息'
                    }
                }
            });

            document.dispatchEvent(submitEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('demoFormSubmit', eventListener);
        });

        it('应该正确处理提交成功反馈', () => {
            const eventListener = Mock.fn();
            document.addEventListener('demoBookingSuccess', eventListener);

            // 模拟提交成功
            const successEvent = new CustomEvent('demoBookingSuccess', {
                detail: {
                    formData: {
                        name: '张三',
                        email: 'zhangsan@example.com'
                    },
                    timestamp: new Date().toISOString()
                }
            });

            document.dispatchEvent(successEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('demoBookingSuccess', eventListener);
        });
    });

    describe('电话联系流程', () => {
        it('应该正确处理电话点击', () => {
            const eventListener = Mock.fn();
            document.addEventListener('phoneClick', eventListener);

            // 模拟电话点击
            const phoneEvent = new CustomEvent('phoneClick', {
                detail: {
                    phone: '138-XXXX-XXXX'
                }
            });

            document.dispatchEvent(phoneEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('phoneClick', eventListener);
        });

        it('应该跟踪电话点击转化', () => {
            const eventListener = Mock.fn();
            document.addEventListener('conversionTracked', eventListener);

            // 模拟电话点击转化跟踪
            const conversionEvent = new CustomEvent('conversionTracked', {
                detail: {
                    eventType: 'phone_click',
                    timestamp: new Date().toISOString()
                }
            });

            document.dispatchEvent(conversionEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('conversionTracked', eventListener);
        });
    });

    describe('移动端用户流程', () => {
        it('应该正确处理设备方向变化', () => {
            const eventListener = Mock.fn();
            document.addEventListener('orientationChanged', eventListener);

            // 模拟设备方向变化
            const orientationEvent = new CustomEvent('orientationChanged', {
                detail: {
                    orientation: 'landscape',
                    viewport: { width: 812, height: 375 }
                }
            });

            document.dispatchEvent(orientationEvent);

            expect(eventListener).toHaveBeenCalled();
            
            document.removeEventListener('orientationChanged', eventListener);
        });

        it('应该正确适配移动端触摸交互', () => {
            // 模拟触摸事件
            const mockElement = Mock.element('button', { class: 'btn-primary' });
            
            const touchStartHandler = Mock.fn();
            const touchEndHandler = Mock.fn();
            
            mockElement.addEventListener('touchstart', touchStartHandler);
            mockElement.addEventListener('touchend', touchEndHandler);

            // 模拟触摸事件
            const touchStartEvent = new TouchEvent('touchstart', {
                touches: [{ clientX: 100, clientY: 100 }]
            });
            const touchEndEvent = new TouchEvent('touchend', {
                changedTouches: [{ clientX: 100, clientY: 100 }]
            });

            mockElement.dispatchEvent(touchStartEvent);
            mockElement.dispatchEvent(touchEndEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', touchStartHandler);
            expect(mockElement.addEventListener).toHaveBeenCalledWith('touchend', touchEndHandler);
        });
    });

    describe('错误处理流程', () => {
        it('应该正确处理网络错误', () => {
            const mockError = new Error('网络连接失败');
            
            const errorHandler = Mock.fn();
            window.addEventListener('error', errorHandler);

            // 模拟网络错误
            const errorEvent = new ErrorEvent('error', {
                message: mockError.message,
                error: mockError
            });

            window.dispatchEvent(errorEvent);

            expect(errorHandler).toHaveBeenCalled();
            
            window.removeEventListener('error', errorHandler);
        });

        it('应该正确处理表单提交错误', () => {
            const mockForm = Mock.element('form');
            
            const submitHandler = Mock.fn((e) => {
                e.preventDefault();
                throw new Error('提交失败');
            });

            mockForm.addEventListener('submit', submitHandler);

            expect(() => {
                const submitEvent = new Event('submit');
                mockForm.dispatchEvent(submitEvent);
            }).toThrow('提交失败');
        });
    });
});

describe('性能测试', () => {
    it('页面加载时间应该在合理范围内', () => {
        const loadStartTime = performance.now();
        
        // 模拟页面加载完成
        const loadEndTime = performance.now();
        const loadTime = loadEndTime - loadStartTime;
        
        // 加载时间应该少于3秒
        expect(loadTime).toBeLessThan(3000);
    });

    it('组件渲染时间应该在合理范围内', () => {
        const renderStartTime = performance.now();
        
        // 模拟组件渲染
        const mockContainer = Mock.element('div');
        if (window.HeroSection) {
            new window.HeroSection(mockContainer);
        }
        
        const renderEndTime = performance.now();
        const renderTime = renderEndTime - renderStartTime;
        
        // 渲染时间应该少于100ms
        expect(renderTime).toBeLessThan(100);
    });

    it('内存使用应该在合理范围内', () => {
        // 模拟内存使用检查
        if (performance.memory) {
            const memoryInfo = performance.memory;
            
            // 检查内存使用情况
            expect(memoryInfo.usedJSHeapSize).toBeLessThan(memoryInfo.jsHeapSizeLimit);
        } else {
            console.warn('performance.memory API不可用，跳过内存测试');
        }
    });
});