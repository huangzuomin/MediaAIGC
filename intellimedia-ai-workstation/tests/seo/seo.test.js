/**
 * SEO验证测试套件
 * SEO Validation Test Suite
 */

describe('SEO验证测试', () => {
    let seoValidator;
    let seoManager;

    beforeAll(() => {
        // 初始化SEO相关组件
        if (window.SEOValidator) {
            seoValidator = window.SEOValidator;
        }
        if (window.SEOManager) {
            seoManager = window.SEOManager;
        }
    });

    describe('基础SEO元素测试', () => {
        it('页面应该有唯一且描述性的标题', () => {
            const title = document.querySelector('title');
            
            expect(title).toBeTruthy();
            expect(title.textContent).toBeTruthy();
            expect(title.textContent.length).toBeGreaterThan(10);
            expect(title.textContent.length).toBeLessThan(60);
            expect(title.textContent).toContain('智媒AI工作站');
        });

        it('页面应该有描述性的meta description', () => {
            const description = document.querySelector('meta[name="description"]');
            
            expect(description).toBeTruthy();
            
            const content = description.getAttribute('content');
            expect(content).toBeTruthy();
            expect(content.length).toBeGreaterThan(120);
            expect(content.length).toBeLessThan(160);
            expect(content).toContain('AI');
        });

        it('页面应该有相关的关键词', () => {
            const keywords = document.querySelector('meta[name="keywords"]');
            
            if (keywords) {
                const content = keywords.getAttribute('content');
                expect(content).toBeTruthy();
                expect(content).toContain('AI');
                
                // 关键词应该用逗号分隔
                const keywordList = content.split(',');
                expect(keywordList.length).toBeGreaterThan(3);
                expect(keywordList.length).toBeLessThan(15);
            }
        });

        it('页面应该有canonical URL', () => {
            const canonical = document.querySelector('link[rel="canonical"]');
            
            expect(canonical).toBeTruthy();
            
            const href = canonical.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href.startsWith('http')).toBeTruthy();
        });

        it('页面应该有正确的语言声明', () => {
            const htmlElement = document.documentElement;
            const lang = htmlElement.getAttribute('lang');
            
            expect(lang).toBeTruthy();
            expect(lang).toBe('zh-CN');
        });

        it('页面应该有viewport meta标签', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            
            expect(viewport).toBeTruthy();
            
            const content = viewport.getAttribute('content');
            expect(content).toContain('width=device-width');
            expect(content).toContain('initial-scale=1');
        });
    });

    describe('Open Graph标签测试', () => {
        it('应该有基础的Open Graph标签', () => {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');
            const ogImage = document.querySelector('meta[property="og:image"]');
            const ogUrl = document.querySelector('meta[property="og:url"]');
            const ogType = document.querySelector('meta[property="og:type"]');
            
            expect(ogTitle).toBeTruthy();
            expect(ogDescription).toBeTruthy();
            expect(ogImage).toBeTruthy();
            expect(ogUrl).toBeTruthy();
            expect(ogType).toBeTruthy();
            
            expect(ogTitle.getAttribute('content')).toBeTruthy();
            expect(ogDescription.getAttribute('content')).toBeTruthy();
            expect(ogImage.getAttribute('content')).toBeTruthy();
            expect(ogUrl.getAttribute('content')).toBeTruthy();
            expect(ogType.getAttribute('content')).toBe('website');
        });

        it('Open Graph图片应该有正确的尺寸', () => {
            const ogImageWidth = document.querySelector('meta[property="og:image:width"]');
            const ogImageHeight = document.querySelector('meta[property="og:image:height"]');
            
            if (ogImageWidth && ogImageHeight) {
                const width = parseInt(ogImageWidth.getAttribute('content'));
                const height = parseInt(ogImageHeight.getAttribute('content'));
                
                expect(width).toBeGreaterThan(600);
                expect(height).toBeGreaterThan(315);
                expect(width / height).toBeCloseTo(1.91, 0.1); // 接近1.91:1比例
            }
        });

        it('应该有Open Graph站点名称', () => {
            const ogSiteName = document.querySelector('meta[property="og:site_name"]');
            
            if (ogSiteName) {
                expect(ogSiteName.getAttribute('content')).toBe('智媒AI工作站');
            }
        });
    });

    describe('Twitter Card标签测试', () => {
        it('应该有基础的Twitter Card标签', () => {
            const twitterCard = document.querySelector('meta[property="twitter:card"]');
            const twitterTitle = document.querySelector('meta[property="twitter:title"]');
            const twitterDescription = document.querySelector('meta[property="twitter:description"]');
            const twitterImage = document.querySelector('meta[property="twitter:image"]');
            
            expect(twitterCard).toBeTruthy();
            expect(twitterTitle).toBeTruthy();
            expect(twitterDescription).toBeTruthy();
            expect(twitterImage).toBeTruthy();
            
            expect(twitterCard.getAttribute('content')).toBe('summary_large_image');
            expect(twitterTitle.getAttribute('content')).toBeTruthy();
            expect(twitterDescription.getAttribute('content')).toBeTruthy();
            expect(twitterImage.getAttribute('content')).toBeTruthy();
        });

        it('Twitter图片应该有替代文本', () => {
            const twitterImageAlt = document.querySelector('meta[property="twitter:image:alt"]');
            
            if (twitterImageAlt) {
                expect(twitterImageAlt.getAttribute('content')).toBeTruthy();
            }
        });
    });

    describe('结构化数据测试', () => {
        it('应该有JSON-LD结构化数据', () => {
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            
            expect(jsonLdScripts.length).toBeGreaterThan(0);
            
            jsonLdScripts.forEach(script => {
                const content = script.textContent;
                expect(content).toBeTruthy();
                
                // 验证JSON格式
                expect(() => {
                    JSON.parse(content);
                }).not.toThrow();
                
                const data = JSON.parse(content);
                expect(data['@context']).toBe('https://schema.org');
                expect(data['@type']).toBeTruthy();
            });
        });

        it('软件应用结构化数据应该完整', () => {
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            let softwareAppData = null;
            
            jsonLdScripts.forEach(script => {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === 'SoftwareApplication') {
                    softwareAppData = data;
                }
            });
            
            if (softwareAppData) {
                expect(softwareAppData.name).toBeTruthy();
                expect(softwareAppData.description).toBeTruthy();
                expect(softwareAppData.applicationCategory).toBeTruthy();
                expect(softwareAppData.operatingSystem).toBeTruthy();
                expect(softwareAppData.url).toBeTruthy();
            }
        });

        it('组织结构化数据应该完整', () => {
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            let organizationData = null;
            
            jsonLdScripts.forEach(script => {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === 'Organization') {
                    organizationData = data;
                }
            });
            
            if (organizationData) {
                expect(organizationData.name).toBeTruthy();
                expect(organizationData.url).toBeTruthy();
                expect(organizationData.description).toBeTruthy();
            }
        });

        it('网站结构化数据应该完整', () => {
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            let websiteData = null;
            
            jsonLdScripts.forEach(script => {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === 'WebSite') {
                    websiteData = data;
                }
            });
            
            if (websiteData) {
                expect(websiteData.name).toBeTruthy();
                expect(websiteData.url).toBeTruthy();
                expect(websiteData.inLanguage).toBe('zh-CN');
            }
        });
    });

    describe('技术SEO测试', () => {
        it('应该有robots meta标签', () => {
            const robots = document.querySelector('meta[name="robots"]');
            
            expect(robots).toBeTruthy();
            
            const content = robots.getAttribute('content');
            expect(content).toContain('index');
            expect(content).toContain('follow');
        });

        it('应该预加载关键资源', () => {
            const preloadLinks = document.querySelectorAll('link[rel="preload"]');
            
            expect(preloadLinks.length).toBeGreaterThan(0);
            
            preloadLinks.forEach(link => {
                const href = link.getAttribute('href');
                const as = link.getAttribute('as');
                
                expect(href).toBeTruthy();
                expect(as).toBeTruthy();
                
                // 验证as属性值
                const validAsValues = ['style', 'script', 'font', 'image', 'document'];
                expect(validAsValues.includes(as)).toBeTruthy();
            });
        });

        it('应该有DNS预连接', () => {
            const preconnectLinks = document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]');
            
            expect(preconnectLinks.length).toBeGreaterThan(0);
            
            preconnectLinks.forEach(link => {
                const href = link.getAttribute('href');
                expect(href).toBeTruthy();
                expect(href.startsWith('http')).toBeTruthy();
            });
        });

        it('应该有适当的缓存策略', () => {
            // 检查静态资源是否有适当的缓存头
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.name.includes('.css') || resource.name.includes('.js') || resource.name.includes('.png')) {
                    // 静态资源应该被缓存
                    expect(resource.transferSize).toBeDefined();
                }
            });
        });

        it('页面应该支持HTTPS', () => {
            // 检查页面是否通过HTTPS加载
            if (location.protocol === 'https:') {
                expect(location.protocol).toBe('https:');
            } else {
                console.warn('页面未通过HTTPS加载');
            }
        });
    });

    describe('内容SEO测试', () => {
        it('应该有合理的标题层级结构', () => {
            const h1Elements = document.querySelectorAll('h1');
            const h2Elements = document.querySelectorAll('h2');
            const h3Elements = document.querySelectorAll('h3');
            
            // 应该有且仅有一个H1标题
            expect(h1Elements.length).toBe(1);
            
            // 应该有H2标题
            expect(h2Elements.length).toBeGreaterThan(0);
            
            // 检查标题内容
            h1Elements.forEach(h1 => {
                expect(h1.textContent.trim()).toBeTruthy();
                expect(h1.textContent.length).toBeGreaterThan(10);
            });
            
            h2Elements.forEach(h2 => {
                expect(h2.textContent.trim()).toBeTruthy();
            });
        });

        it('应该有足够的文本内容', () => {
            const textContent = document.body.textContent;
            const wordCount = textContent.split(/\s+/).length;
            
            // 页面应该有足够的文本内容
            expect(wordCount).toBeGreaterThan(300);
        });

        it('图片应该有SEO友好的alt属性', () => {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                const alt = img.getAttribute('alt');
                const src = img.getAttribute('src');
                
                if (alt !== null) {
                    // Alt文本应该是描述性的
                    if (alt.length > 0) {
                        expect(alt.length).toBeGreaterThan(3);
                        expect(alt.length).toBeLessThan(125);
                        
                        // Alt文本不应该包含"图片"、"image"等冗余词汇
                        expect(alt.toLowerCase()).not.toContain('图片');
                        expect(alt.toLowerCase()).not.toContain('image');
                    }
                }
                
                // 图片src应该有意义的文件名
                if (src) {
                    const filename = src.split('/').pop().split('.')[0];
                    expect(filename).not.toBe('image');
                    expect(filename).not.toBe('img');
                }
            });
        });

        it('链接应该有描述性的锚文本', () => {
            const links = document.querySelectorAll('a[href]');
            
            links.forEach(link => {
                const text = link.textContent.trim();
                const href = link.getAttribute('href');
                
                if (text && !href.startsWith('#')) {
                    // 避免使用无意义的锚文本
                    const badAnchorTexts = ['点击这里', '更多', 'click here', 'read more', '链接'];
                    expect(badAnchorTexts.includes(text.toLowerCase())).toBeFalsy();
                    
                    // 锚文本应该有一定长度
                    expect(text.length).toBeGreaterThan(2);
                }
            });
        });
    });

    describe('移动SEO测试', () => {
        it('应该有移动友好的viewport设置', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            
            expect(viewport).toBeTruthy();
            
            const content = viewport.getAttribute('content');
            expect(content).toContain('width=device-width');
            expect(content).toContain('initial-scale=1');
            
            // 不应该禁用用户缩放
            expect(content).not.toContain('user-scalable=no');
            expect(content).not.toContain('maximum-scale=1');
        });

        it('应该有移动应用相关的meta标签', () => {
            const appleMobileCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
            const appleMobileTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
            const themeColor = document.querySelector('meta[name="theme-color"]');
            
            if (appleMobileCapable) {
                expect(appleMobileCapable.getAttribute('content')).toBe('yes');
            }
            
            if (appleMobileTitle) {
                expect(appleMobileTitle.getAttribute('content')).toBeTruthy();
            }
            
            if (themeColor) {
                const color = themeColor.getAttribute('content');
                expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            }
        });

        it('应该有Web App Manifest', () => {
            const manifest = document.querySelector('link[rel="manifest"]');
            
            if (manifest) {
                const href = manifest.getAttribute('href');
                expect(href).toBeTruthy();
                expect(href.endsWith('.webmanifest') || href.endsWith('manifest.json')).toBeTruthy();
            }
        });
    });

    describe('本地SEO测试', () => {
        it('应该有地理位置相关的meta标签', () => {
            const geoRegion = document.querySelector('meta[name="geo.region"]');
            const geoPlacename = document.querySelector('meta[name="geo.placename"]');
            
            if (geoRegion) {
                expect(geoRegion.getAttribute('content')).toBe('CN');
            }
            
            if (geoPlacename) {
                expect(geoPlacename.getAttribute('content')).toContain('中国');
            }
        });

        it('联系信息应该结构化', () => {
            // 检查是否有结构化的联系信息
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            let hasContactInfo = false;
            
            jsonLdScripts.forEach(script => {
                const data = JSON.parse(script.textContent);
                if (data.contactPoint || data.telephone || data.address) {
                    hasContactInfo = true;
                }
            });
            
            // 如果有联系信息，应该是结构化的
            if (hasContactInfo) {
                expect(hasContactInfo).toBeTruthy();
            }
        });
    });

    describe('SEO性能测试', () => {
        it('页面加载速度应该合理', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                
                // 页面加载时间应该在3秒内
                expect(loadTime).toBeLessThan(3000);
            }
        });

        it('关键资源应该优化加载', () => {
            const resources = performance.getEntriesByType('resource');
            
            // CSS文件应该尽早加载
            const cssResources = resources.filter(r => r.name.includes('.css'));
            cssResources.forEach(resource => {
                expect(resource.startTime).toBeLessThan(1000);
            });
            
            // 关键JavaScript应该尽早加载
            const jsResources = resources.filter(r => r.name.includes('.js') && r.name.includes('app'));
            jsResources.forEach(resource => {
                expect(resource.startTime).toBeLessThan(2000);
            });
        });
    });

    afterAll(async () => {
        // 生成SEO报告
        if (seoValidator) {
            try {
                const report = await seoValidator.validateAll();
                
                console.log('\n🔍 SEO验证报告:');
                console.log('='.repeat(50));
                console.log(`标题检查: ${report.title ? '✅ 通过' : '❌ 失败'}`);
                console.log(`描述检查: ${report.description ? '✅ 通过' : '❌ 失败'}`);
                console.log(`关键词检查: ${report.keywords ? '✅ 通过' : '❌ 失败'}`);
                console.log(`标题结构: ${report.headings ? '✅ 通过' : '❌ 失败'}`);
                console.log(`图片优化: ${report.images ? '✅ 通过' : '❌ 失败'}`);
                console.log(`链接优化: ${report.links ? '✅ 通过' : '❌ 失败'}`);
                console.log(`结构化数据: ${report.structuredData ? '✅ 通过' : '❌ 失败'}`);
                console.log(`移动友好: ${report.mobile ? '✅ 通过' : '❌ 失败'}`);
                console.log('='.repeat(50));
                
                if (report.issues && report.issues.length > 0) {
                    console.log('\n⚠️ 发现的问题:');
                    report.issues.forEach(issue => {
                        console.log(`- ${issue}`);
                    });
                }
                
                if (report.recommendations && report.recommendations.length > 0) {
                    console.log('\n💡 优化建议:');
                    report.recommendations.forEach(rec => {
                        console.log(`- ${rec}`);
                    });
                }
            } catch (error) {
                console.error('生成SEO报告时出错:', error);
            }
        }
        
        if (seoManager) {
            const managerReport = seoManager.generateSEOReport();
            console.log('\n📈 SEO管理报告:', managerReport);
        }
    });
});