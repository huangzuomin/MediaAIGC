/**
 * 简单的测试框架
 * Simple Testing Framework
 */

class TestFramework {
    constructor() {
        this.tests = [];
        this.suites = new Map();
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * 创建测试套件
     * @param {string} name - 套件名称
     * @param {Function} callback - 套件回调函数
     */
    describe(name, callback) {
        const suite = {
            name,
            tests: [],
            beforeEach: null,
            afterEach: null,
            beforeAll: null,
            afterAll: null
        };

        this.suites.set(name, suite);
        
        // 设置当前套件上下文
        this.currentSuite = suite;
        
        // 执行套件定义
        callback();
        
        // 清除当前套件上下文
        this.currentSuite = null;
    }

    /**
     * 定义测试用例
     * @param {string} description - 测试描述
     * @param {Function} testFunction - 测试函数
     */
    it(description, testFunction) {
        const test = {
            description,
            testFunction,
            suite: this.currentSuite ? this.currentSuite.name : 'Global',
            status: 'pending',
            error: null,
            duration: 0
        };

        if (this.currentSuite) {
            this.currentSuite.tests.push(test);
        } else {
            this.tests.push(test);
        }
    }

    /**
     * 设置每个测试前执行的函数
     * @param {Function} callback - 回调函数
     */
    beforeEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = callback;
        }
    }

    /**
     * 设置每个测试后执行的函数
     * @param {Function} callback - 回调函数
     */
    afterEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = callback;
        }
    }

    /**
     * 设置套件开始前执行的函数
     * @param {Function} callback - 回调函数
     */
    beforeAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeAll = callback;
        }
    }

    /**
     * 设置套件结束后执行的函数
     * @param {Function} callback - 回调函数
     */
    afterAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterAll = callback;
        }
    }

    /**
     * 运行所有测试
     */
    async runTests() {
        this.startTime = performance.now();
        console.log('🚀 开始运行测试...\n');

        // 运行全局测试
        for (const test of this.tests) {
            await this.runTest(test);
        }

        // 运行套件测试
        for (const [suiteName, suite] of this.suites) {
            console.log(`📦 测试套件: ${suiteName}`);
            
            // 执行beforeAll
            if (suite.beforeAll) {
                try {
                    await suite.beforeAll();
                } catch (error) {
                    console.error(`❌ beforeAll失败: ${error.message}`);
                }
            }

            // 运行套件中的测试
            for (const test of suite.tests) {
                // 执行beforeEach
                if (suite.beforeEach) {
                    try {
                        await suite.beforeEach();
                    } catch (error) {
                        console.error(`❌ beforeEach失败: ${error.message}`);
                    }
                }

                await this.runTest(test);

                // 执行afterEach
                if (suite.afterEach) {
                    try {
                        await suite.afterEach();
                    } catch (error) {
                        console.error(`❌ afterEach失败: ${error.message}`);
                    }
                }
            }

            // 执行afterAll
            if (suite.afterAll) {
                try {
                    await suite.afterAll();
                } catch (error) {
                    console.error(`❌ afterAll失败: ${error.message}`);
                }
            }

            console.log(''); // 空行分隔
        }

        this.endTime = performance.now();
        this.printResults();
    }

    /**
     * 运行单个测试
     * @param {Object} test - 测试对象
     */
    async runTest(test) {
        const startTime = performance.now();
        
        try {
            await test.testFunction();
            test.status = 'passed';
            test.duration = performance.now() - startTime;
            this.results.passed++;
            console.log(`  ✅ ${test.description} (${test.duration.toFixed(2)}ms)`);
        } catch (error) {
            test.status = 'failed';
            test.error = error;
            test.duration = performance.now() - startTime;
            this.results.failed++;
            console.log(`  ❌ ${test.description}`);
            console.log(`     错误: ${error.message}`);
            if (error.stack) {
                console.log(`     堆栈: ${error.stack}`);
            }
        }

        this.results.total++;
    }

    /**
     * 打印测试结果
     */
    printResults() {
        const duration = this.endTime - this.startTime;
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(2);

        console.log('\n📊 测试结果汇总:');
        console.log('='.repeat(50));
        console.log(`总计: ${this.results.total}`);
        console.log(`✅ 通过: ${this.results.passed}`);
        console.log(`❌ 失败: ${this.results.failed}`);
        console.log(`⏭️ 跳过: ${this.results.skipped}`);
        console.log(`📈 通过率: ${passRate}%`);
        console.log(`⏱️ 总耗时: ${duration.toFixed(2)}ms`);
        console.log('='.repeat(50));

        if (this.results.failed > 0) {
            console.log('\n❌ 存在失败的测试，请检查上述错误信息');
        } else {
            console.log('\n🎉 所有测试都通过了！');
        }
    }

    /**
     * 获取测试结果
     */
    getResults() {
        return {
            ...this.results,
            duration: this.endTime - this.startTime,
            passRate: (this.results.passed / this.results.total) * 100
        };
    }
}

/**
 * 断言工具类
 */
class Expect {
    constructor(actual) {
        this.actual = actual;
    }

    /**
     * 断言相等
     */
    toBe(expected) {
        if (this.actual !== expected) {
            throw new Error(`期望 ${this.actual} 等于 ${expected}`);
        }
        return this;
    }

    /**
     * 断言深度相等
     */
    toEqual(expected) {
        if (!this.deepEqual(this.actual, expected)) {
            throw new Error(`期望 ${JSON.stringify(this.actual)} 深度等于 ${JSON.stringify(expected)}`);
        }
        return this;
    }

    /**
     * 断言为真
     */
    toBeTruthy() {
        if (!this.actual) {
            throw new Error(`期望 ${this.actual} 为真值`);
        }
        return this;
    }

    /**
     * 断言为假
     */
    toBeFalsy() {
        if (this.actual) {
            throw new Error(`期望 ${this.actual} 为假值`);
        }
        return this;
    }

    /**
     * 断言为null
     */
    toBeNull() {
        if (this.actual !== null) {
            throw new Error(`期望 ${this.actual} 为 null`);
        }
        return this;
    }

    /**
     * 断言为undefined
     */
    toBeUndefined() {
        if (this.actual !== undefined) {
            throw new Error(`期望 ${this.actual} 为 undefined`);
        }
        return this;
    }

    /**
     * 断言包含
     */
    toContain(expected) {
        if (Array.isArray(this.actual)) {
            if (!this.actual.includes(expected)) {
                throw new Error(`期望数组 ${JSON.stringify(this.actual)} 包含 ${expected}`);
            }
        } else if (typeof this.actual === 'string') {
            if (!this.actual.includes(expected)) {
                throw new Error(`期望字符串 "${this.actual}" 包含 "${expected}"`);
            }
        } else {
            throw new Error(`toContain 只能用于数组或字符串`);
        }
        return this;
    }

    /**
     * 断言长度
     */
    toHaveLength(expected) {
        if (!this.actual || typeof this.actual.length !== 'number') {
            throw new Error(`期望 ${this.actual} 有 length 属性`);
        }
        if (this.actual.length !== expected) {
            throw new Error(`期望长度为 ${expected}，实际为 ${this.actual.length}`);
        }
        return this;
    }

    /**
     * 断言抛出异常
     */
    toThrow(expectedError) {
        if (typeof this.actual !== 'function') {
            throw new Error('toThrow 只能用于函数');
        }

        let threwError = false;
        let actualError = null;

        try {
            this.actual();
        } catch (error) {
            threwError = true;
            actualError = error;
        }

        if (!threwError) {
            throw new Error('期望函数抛出异常，但没有抛出');
        }

        if (expectedError && actualError.message !== expectedError) {
            throw new Error(`期望抛出异常消息 "${expectedError}"，实际为 "${actualError.message}"`);
        }

        return this;
    }

    /**
     * 断言大于
     */
    toBeGreaterThan(expected) {
        if (this.actual <= expected) {
            throw new Error(`期望 ${this.actual} 大于 ${expected}`);
        }
        return this;
    }

    /**
     * 断言小于
     */
    toBeLessThan(expected) {
        if (this.actual >= expected) {
            throw new Error(`期望 ${this.actual} 小于 ${expected}`);
        }
        return this;
    }

    /**
     * 深度比较对象
     */
    deepEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (typeof a !== typeof b) return false;

        if (typeof a === 'object') {
            if (Array.isArray(a) !== Array.isArray(b)) return false;
            
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!this.deepEqual(a[key], b[key])) return false;
            }
            
            return true;
        }

        return false;
    }
}

/**
 * Mock工具类
 */
class Mock {
    constructor() {
        this.calls = [];
        this.returnValue = undefined;
        this.implementation = null;
    }

    /**
     * 创建mock函数
     */
    static fn(implementation) {
        const mock = new Mock();
        if (implementation) {
            mock.implementation = implementation;
        }

        const mockFunction = function(...args) {
            mock.calls.push(args);
            
            if (mock.implementation) {
                return mock.implementation(...args);
            }
            
            return mock.returnValue;
        };

        // 添加mock方法到函数
        mockFunction.mockReturnValue = (value) => {
            mock.returnValue = value;
            return mockFunction;
        };

        mockFunction.mockImplementation = (impl) => {
            mock.implementation = impl;
            return mockFunction;
        };

        mockFunction.mockClear = () => {
            mock.calls = [];
            return mockFunction;
        };

        mockFunction.toHaveBeenCalled = () => {
            return mock.calls.length > 0;
        };

        mockFunction.toHaveBeenCalledTimes = (times) => {
            return mock.calls.length === times;
        };

        mockFunction.toHaveBeenCalledWith = (...args) => {
            return mock.calls.some(call => 
                call.length === args.length && 
                call.every((arg, index) => arg === args[index])
            );
        };

        mockFunction.calls = mock.calls;

        return mockFunction;
    }

    /**
     * 模拟DOM元素
     */
    static element(tagName, attributes = {}) {
        const element = {
            tagName: tagName.toUpperCase(),
            attributes: { ...attributes },
            children: [],
            parentNode: null,
            textContent: '',
            innerHTML: '',
            style: {},
            classList: {
                add: Mock.fn(),
                remove: Mock.fn(),
                contains: Mock.fn().mockReturnValue(false),
                toggle: Mock.fn()
            },
            addEventListener: Mock.fn(),
            removeEventListener: Mock.fn(),
            getAttribute: Mock.fn((name) => element.attributes[name]),
            setAttribute: Mock.fn((name, value) => {
                element.attributes[name] = value;
            }),
            removeAttribute: Mock.fn((name) => {
                delete element.attributes[name];
            }),
            querySelector: Mock.fn(),
            querySelectorAll: Mock.fn().mockReturnValue([]),
            appendChild: Mock.fn((child) => {
                element.children.push(child);
                child.parentNode = element;
            }),
            removeChild: Mock.fn((child) => {
                const index = element.children.indexOf(child);
                if (index > -1) {
                    element.children.splice(index, 1);
                    child.parentNode = null;
                }
            }),
            click: Mock.fn(),
            focus: Mock.fn(),
            blur: Mock.fn()
        };

        return element;
    }
}

// 全局测试函数
function expect(actual) {
    return new Expect(actual);
}

// 创建全局测试框架实例
const testFramework = new TestFramework();

// 导出全局函数
window.describe = testFramework.describe.bind(testFramework);
window.it = testFramework.it.bind(testFramework);
window.beforeEach = testFramework.beforeEach.bind(testFramework);
window.afterEach = testFramework.afterEach.bind(testFramework);
window.beforeAll = testFramework.beforeAll.bind(testFramework);
window.afterAll = testFramework.afterAll.bind(testFramework);
window.expect = expect;
window.Mock = Mock;

// 导出测试框架
window.TestFramework = testFramework;

// 如果是Node.js环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TestFramework,
        Expect,
        Mock,
        expect,
        describe: testFramework.describe.bind(testFramework),
        it: testFramework.it.bind(testFramework),
        beforeEach: testFramework.beforeEach.bind(testFramework),
        afterEach: testFramework.afterEach.bind(testFramework),
        beforeAll: testFramework.beforeAll.bind(testFramework),
        afterAll: testFramework.afterAll.bind(testFramework)
    };
}