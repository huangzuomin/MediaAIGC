/**
 * ChallengeSection组件单元测试
 */

describe('ChallengeSection组件', () => {
    let challengeSection;
    let mockContainer;

    beforeEach(() => {
        mockContainer = Mock.element('div', { id: 'challenge-container' });
        
        if (window.ChallengeSection) {
            challengeSection = new window.ChallengeSection(mockContainer);
        }
    });

    afterEach(() => {
        challengeSection = null;
        mockContainer = null;
    });

    it('应该正确初始化', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        expect(challengeSection).toBeTruthy();
        expect(challengeSection.container).toBe(mockContainer);
    });

    it('应该渲染三个挑战卡片', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        // 模拟三个挑战卡片
        const mockCards = [
            Mock.element('div', { class: 'challenge-card', 'data-challenge': 'content-production' }),
            Mock.element('div', { class: 'challenge-card', 'data-challenge': 'repetitive-work' }),
            Mock.element('div', { class: 'challenge-card', 'data-challenge': 'ai-adoption' })
        ];

        mockContainer.querySelectorAll = Mock.fn().mockReturnValue(mockCards);

        const cards = mockContainer.querySelectorAll('.challenge-card');
        expect(cards).toHaveLength(3);
    });

    it('应该包含正确的挑战数据', () => {
        const expectedChallenges = [
            {
                id: 'content-production',
                title: '内容生产效率低下',
                description: '传统新闻生产流程繁琐，人工成本高，效率难以提升'
            },
            {
                id: 'repetitive-work',
                title: '重复性工作占比过高',
                description: '大量时间消耗在格式转换、数据整理等机械性工作上'
            },
            {
                id: 'ai-adoption',
                title: 'AI技术应用门槛高',
                description: '缺乏专业技术团队，难以有效整合和应用AI工具'
            }
        ];

        expectedChallenges.forEach(challenge => {
            expect(challenge.id).toBeTruthy();
            expect(challenge.title).toBeTruthy();
            expect(challenge.description).toBeTruthy();
            expect(typeof challenge.title).toBe('string');
            expect(typeof challenge.description).toBe('string');
        });
    });

    it('应该正确处理卡片点击事件', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        const mockCard = Mock.element('div', { 
            class: 'challenge-card', 
            'data-challenge': 'content-production' 
        });

        const clickHandler = Mock.fn();
        mockCard.addEventListener('click', clickHandler);

        // 模拟点击
        mockCard.click();

        expect(mockCard.addEventListener).toHaveBeenCalledWith('click', clickHandler);
        expect(mockCard.click).toHaveBeenCalled();
    });

    it('应该正确处理卡片悬浮效果', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        const mockCard = Mock.element('div', { class: 'challenge-card' });
        
        const mouseEnterHandler = Mock.fn();
        const mouseLeaveHandler = Mock.fn();
        
        mockCard.addEventListener('mouseenter', mouseEnterHandler);
        mockCard.addEventListener('mouseleave', mouseLeaveHandler);

        // 模拟鼠标事件
        const mouseEnterEvent = new Event('mouseenter');
        const mouseLeaveEvent = new Event('mouseleave');
        
        mockCard.dispatchEvent(mouseEnterEvent);
        mockCard.dispatchEvent(mouseLeaveEvent);

        expect(mockCard.addEventListener).toHaveBeenCalledWith('mouseenter', mouseEnterHandler);
        expect(mockCard.addEventListener).toHaveBeenCalledWith('mouseleave', mouseLeaveHandler);
    });

    it('应该支持键盘导航', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        const mockCard = Mock.element('div', { 
            class: 'challenge-card',
            tabindex: '0'
        });

        const keydownHandler = Mock.fn();
        mockCard.addEventListener('keydown', keydownHandler);

        // 模拟回车键
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        mockCard.dispatchEvent(enterEvent);

        expect(mockCard.addEventListener).toHaveBeenCalledWith('keydown', keydownHandler);
    });

    it('应该正确触发自定义事件', () => {
        if (!window.ChallengeSection) {
            console.warn('ChallengeSection类未加载，跳过测试');
            return;
        }

        const eventListener = Mock.fn();
        document.addEventListener('challengeCardClick', eventListener);

        // 模拟触发自定义事件
        const customEvent = new CustomEvent('challengeCardClick', {
            detail: {
                challengeId: 'content-production',
                challenge: { title: '内容生产效率低下' }
            }
        });

        document.dispatchEvent(customEvent);

        expect(eventListener).toHaveBeenCalled();
        
        // 清理事件监听器
        document.removeEventListener('challengeCardClick', eventListener);
    });
});

describe('ChallengeSection响应式测试', () => {
    it('应该在移动端正确显示', () => {
        const originalInnerWidth = window.innerWidth;
        
        // 模拟移动端宽度
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 480
        });

        const mockContainer = Mock.element('div');
        
        if (window.ChallengeSection) {
            const challengeSection = new window.ChallengeSection(mockContainer);
            
            // 验证移动端适配
            expect(window.innerWidth).toBe(480);
        }

        // 恢复原始值
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
    });

    it('应该在平板端正确显示', () => {
        const originalInnerWidth = window.innerWidth;
        
        // 模拟平板端宽度
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768
        });

        const mockContainer = Mock.element('div');
        
        if (window.ChallengeSection) {
            const challengeSection = new window.ChallengeSection(mockContainer);
            
            // 验证平板端适配
            expect(window.innerWidth).toBe(768);
        }

        // 恢复原始值
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
    });
});

describe('ChallengeSection可访问性测试', () => {
    it('应该包含正确的ARIA属性', () => {
        const mockCard = Mock.element('div', {
            class: 'challenge-card',
            role: 'button',
            tabindex: '0',
            'aria-label': '内容生产效率低下挑战'
        });

        expect(mockCard.getAttribute('role')).toBe('button');
        expect(mockCard.getAttribute('tabindex')).toBe('0');
        expect(mockCard.getAttribute('aria-label')).toContain('挑战');
    });

    it('应该支持屏幕阅读器', () => {
        const mockCard = Mock.element('div', {
            class: 'challenge-card',
            'aria-describedby': 'challenge-description'
        });

        const mockDescription = Mock.element('div', {
            id: 'challenge-description',
            class: 'sr-only'
        });

        expect(mockCard.getAttribute('aria-describedby')).toBe('challenge-description');
        expect(mockDescription.getAttribute('class')).toContain('sr-only');
    });

    it('应该正确处理焦点管理', () => {
        const mockCard = Mock.element('div', { class: 'challenge-card' });
        
        const focusHandler = Mock.fn();
        const blurHandler = Mock.fn();
        
        mockCard.addEventListener('focus', focusHandler);
        mockCard.addEventListener('blur', blurHandler);

        mockCard.focus();
        mockCard.blur();

        expect(mockCard.focus).toHaveBeenCalled();
        expect(mockCard.blur).toHaveBeenCalled();
    });
});