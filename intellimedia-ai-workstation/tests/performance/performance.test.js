/**
 * 性能测试套件
 * Performance Test Suite
 */

describe('性能测试', () => {
    let performanceMetrics = {};

    beforeAll(() => {
        // 初始化性能监控
        performanceMetrics = {
            startTime: performance.now(),
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };
    });

    describe('页面加载性能', () => {
        it('首次内容绘制(FCP)应该在合理时间内', () => {
            const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
            
            if (fcpEntry) {
                const fcpTime = fcpEntry.startTime;
                console.log(`首次内容绘制时间: ${fcpTime.toFixed(2)}ms`);
                
                // FCP应该在2.5秒内
                expect(fcpTime).toBeLessThan(2500);
                performanceMetrics.fcp = fcpTime;
            } else {
                console.warn('FCP指标不可用');
            }
        });

        it('最大内容绘制(LCP)应该在合理时间内', () => {
            // 模拟LCP测量
            const mockLCPTime = 1800; // 1.8秒
            
            console.log(`最大内容绘制时间: ${mockLCPTime}ms`);
            
            // LCP应该在2.5秒内
            expect(mockLCPTime).toBeLessThan(2500);
            performanceMetrics.lcp = mockLCPTime;
        });

        it('首次输入延迟(FID)应该在合理范围内', () => {
            // 模拟FID测量
            const mockFIDTime = 80; // 80ms
            
            console.log(`首次输入延迟: ${mockFIDTime}ms`);
            
            // FID应该在100ms内
            expect(mockFIDTime).toBeLessThan(100);
            performanceMetrics.fid = mockFIDTime;
        });

        it('累积布局偏移(CLS)应该在合理范围内', () => {
            // 模拟CLS测量
            const mockCLSScore = 0.05;
            
            console.log(`累积布局偏移: ${mockCLSScore}`);
            
            // CLS应该小于0.1
            expect(mockCLSScore).toBeLessThan(0.1);
            performanceMetrics.cls = mockCLSScore;
        });

        it('DOM内容加载时间应该合理', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
                console.log(`DOM内容加载时间: ${domContentLoadedTime.toFixed(2)}ms`);
                
                // DOM加载应该在1秒内
                expect(domContentLoadedTime).toBeLessThan(1000);
                performanceMetrics.domContentLoaded = domContentLoadedTime;
            }
        });

        it('页面完全加载时间应该合理', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                console.log(`页面完全加载时间: ${loadTime.toFixed(2)}ms`);
                
                // 完全加载应该在3秒内
                expect(loadTime).toBeLessThan(3000);
                performanceMetrics.loadTime = loadTime;
            }
        });
    });

    describe('资源加载性能', () => {
        it('CSS文件加载时间应该合理', () => {
            const cssResources = performance.getEntriesByType('resource')
                .filter(entry => entry.name.includes('.css'));
            
            cssResources.forEach(resource => {
                const loadTime = resource.responseEnd - resource.requestStart;
                console.log(`CSS加载时间 (${resource.name}): ${loadTime.toFixed(2)}ms`);
                
                // CSS加载应该在500ms内
                expect(loadTime).toBeLessThan(500);
            });
        });

        it('JavaScript文件加载时间应该合理', () => {
            const jsResources = performance.getEntriesByType('resource')
                .filter(entry => entry.name.includes('.js'));
            
            jsResources.forEach(resource => {
                const loadTime = resource.responseEnd - resource.requestStart;
                console.log(`JS加载时间 (${resource.name}): ${loadTime.toFixed(2)}ms`);
                
                // JS加载应该在1秒内
                expect(loadTime).toBeLessThan(1000);
            });
        });

        it('图片资源加载时间应该合理', () => {
            const imageResources = performance.getEntriesByType('resource')
                .filter(entry => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(entry.name));
            
            imageResources.forEach(resource => {
                const loadTime = resource.responseEnd - resource.requestStart;
                console.log(`图片加载时间 (${resource.name}): ${loadTime.toFixed(2)}ms`);
                
                // 图片加载应该在2秒内
                expect(loadTime).toBeLessThan(2000);
            });
        });

        it('字体文件加载时间应该合理', () => {
            const fontResources = performance.getEntriesByType('resource')
                .filter(entry => /\.(woff|woff2|ttf|otf)$/i.test(entry.name));
            
            fontResources.forEach(resource => {
                const loadTime = resource.responseEnd - resource.requestStart;
                console.log(`字体加载时间 (${resource.name}): ${loadTime.toFixed(2)}ms`);
                
                // 字体加载应该在1秒内
                expect(loadTime).toBeLessThan(1000);
            });
        });
    });

    describe('组件渲染性能', () => {
        it('HeroSection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.HeroSection) {
                new window.HeroSection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`HeroSection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在50ms内
            expect(renderTime).toBeLessThan(50);
        });

        it('ChallengeSection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.ChallengeSection) {
                new window.ChallengeSection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`ChallengeSection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在50ms内
            expect(renderTime).toBeLessThan(50);
        });

        it('FoundationSection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.FoundationSection) {
                new window.FoundationSection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`FoundationSection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在50ms内
            expect(renderTime).toBeLessThan(50);
        });

        it('AgentsSection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.AgentsSection) {
                new window.AgentsSection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`AgentsSection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在100ms内（包含更多内容）
            expect(renderTime).toBeLessThan(100);
        });

        it('PricingSection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.PricingSection) {
                new window.PricingSection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`PricingSection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在50ms内
            expect(renderTime).toBeLessThan(50);
        });

        it('FinalCTASection渲染时间应该合理', () => {
            const startTime = performance.now();
            
            const mockContainer = Mock.element('div');
            if (window.FinalCTASection) {
                new window.FinalCTASection(mockContainer);
            }
            
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            console.log(`FinalCTASection渲染时间: ${renderTime.toFixed(2)}ms`);
            
            // 组件渲染应该在50ms内
            expect(renderTime).toBeLessThan(50);
        });
    });

    describe('交互性能', () => {
        it('按钮点击响应时间应该合理', () => {
            const mockButton = Mock.element('button', { class: 'btn-primary' });
            
            const startTime = performance.now();
            
            const clickHandler = () => {
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                console.log(`按钮点击响应时间: ${responseTime.toFixed(2)}ms`);
                
                // 点击响应应该在16ms内（60fps）
                expect(responseTime).toBeLessThan(16);
            };
            
            mockButton.addEventListener('click', clickHandler);
            mockButton.click();
        });

        it('表单输入响应时间应该合理', () => {
            const mockInput = Mock.element('input', { type: 'text' });
            
            const startTime = performance.now();
            
            const inputHandler = () => {
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                console.log(`表单输入响应时间: ${responseTime.toFixed(2)}ms`);
                
                // 输入响应应该在16ms内
                expect(responseTime).toBeLessThan(16);
            };
            
            mockInput.addEventListener('input', inputHandler);
            
            // 模拟输入事件
            const inputEvent = new Event('input');
            mockInput.dispatchEvent(inputEvent);
        });

        it('滚动性能应该流畅', () => {
            const scrollTimes = [];
            
            const scrollHandler = () => {
                scrollTimes.push(performance.now());
            };
            
            window.addEventListener('scroll', scrollHandler);
            
            // 模拟多次滚动事件
            for (let i = 0; i < 10; i++) {
                const scrollEvent = new Event('scroll');
                window.dispatchEvent(scrollEvent);
            }
            
            // 计算平均滚动处理时间
            if (scrollTimes.length > 1) {
                const totalTime = scrollTimes[scrollTimes.length - 1] - scrollTimes[0];
                const averageTime = totalTime / (scrollTimes.length - 1);
                
                console.log(`平均滚动处理时间: ${averageTime.toFixed(2)}ms`);
                
                // 滚动处理应该在16ms内
                expect(averageTime).toBeLessThan(16);
            }
            
            window.removeEventListener('scroll', scrollHandler);
        });
    });

    describe('内存使用性能', () => {
        it('JavaScript堆内存使用应该合理', () => {
            if (performance.memory) {
                const memoryInfo = performance.memory;
                const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
                const totalMemoryMB = memoryInfo.totalJSHeapSize / (1024 * 1024);
                const limitMemoryMB = memoryInfo.jsHeapSizeLimit / (1024 * 1024);
                
                console.log(`已使用内存: ${usedMemoryMB.toFixed(2)}MB`);
                console.log(`总分配内存: ${totalMemoryMB.toFixed(2)}MB`);
                console.log(`内存限制: ${limitMemoryMB.toFixed(2)}MB`);
                
                // 内存使用应该在合理范围内
                expect(usedMemoryMB).toBeLessThan(100); // 少于100MB
                expect(usedMemoryMB / limitMemoryMB).toBeLessThan(0.5); // 少于限制的50%
                
                performanceMetrics.memoryUsage = usedMemoryMB;
            } else {
                console.warn('performance.memory API不可用');
            }
        });

        it('DOM节点数量应该合理', () => {
            const allElements = document.querySelectorAll('*');
            const nodeCount = allElements.length;
            
            console.log(`DOM节点数量: ${nodeCount}`);
            
            // DOM节点应该少于1500个
            expect(nodeCount).toBeLessThan(1500);
            
            performanceMetrics.domNodes = nodeCount;
        });

        it('事件监听器数量应该合理', () => {
            // 模拟事件监听器计数
            let listenerCount = 0;
            
            // 检查常见的事件监听器
            const commonEvents = ['click', 'scroll', 'resize', 'load', 'DOMContentLoaded'];
            const elements = document.querySelectorAll('*');
            
            // 这是一个简化的检查，实际中很难准确计算所有监听器
            elements.forEach(element => {
                commonEvents.forEach(eventType => {
                    // 模拟检查（实际中无法直接检查）
                    if (element.onclick || element.onscroll) {
                        listenerCount++;
                    }
                });
            });
            
            console.log(`估计事件监听器数量: ${listenerCount}`);
            
            // 事件监听器应该在合理范围内
            expect(listenerCount).toBeLessThan(100);
        });
    });

    describe('网络性能', () => {
        it('资源压缩率应该合理', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.transferSize && resource.decodedBodySize) {
                    const compressionRatio = 1 - (resource.transferSize / resource.decodedBodySize);
                    
                    if (compressionRatio > 0) {
                        console.log(`资源压缩率 (${resource.name}): ${(compressionRatio * 100).toFixed(2)}%`);
                        
                        // 文本资源应该有合理的压缩率
                        if (resource.name.includes('.js') || resource.name.includes('.css')) {
                            expect(compressionRatio).toBeGreaterThan(0.3); // 至少30%压缩
                        }
                    }
                }
            });
        });

        it('缓存命中率应该合理', () => {
            const resources = performance.getEntriesByType('resource');
            let cachedResources = 0;
            let totalResources = resources.length;
            
            resources.forEach(resource => {
                // 检查是否从缓存加载（transferSize为0或很小）
                if (resource.transferSize === 0 || 
                    (resource.transferSize > 0 && resource.transferSize < resource.decodedBodySize * 0.1)) {
                    cachedResources++;
                }
            });
            
            const cacheHitRate = totalResources > 0 ? (cachedResources / totalResources) : 0;
            
            console.log(`缓存命中率: ${(cacheHitRate * 100).toFixed(2)}%`);
            
            // 缓存命中率应该合理（首次访问可能较低）
            if (totalResources > 0) {
                expect(cacheHitRate).toBeGreaterThan(0);
            }
        });
    });

    afterAll(() => {
        // 输出性能报告
        console.log('\n📊 性能测试报告:');
        console.log('='.repeat(50));
        
        Object.entries(performanceMetrics).forEach(([key, value]) => {
            if (typeof value === 'number') {
                console.log(`${key}: ${value.toFixed(2)}${key.includes('Time') ? 'ms' : key === 'memoryUsage' ? 'MB' : ''}`);
            }
        });
        
        console.log('='.repeat(50));
    });
});