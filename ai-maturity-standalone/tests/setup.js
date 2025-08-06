// Test Setup and Configuration
// Mock DOM environment for testing
const { JSDOM } = require('jsdom');

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

// Mock React for testing
global.React = {
  useState: jest.fn(),
  useEffect: jest.fn(),
  useMemo: jest.fn(),
  useCallback: jest.fn(),
  createElement: jest.fn(),
  Component: class Component {}
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
};

// Mock window methods
global.window.gtag = jest.fn();
global.window.dataLayer = [];
global.window.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.window.cancelAnimationFrame = jest.fn();

// Mock screen object
global.screen = {
  width: 1920,
  height: 1080
};

// Mock matchMedia
global.window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Setup test utilities
global.TestUtils = {
  // Create mock component props
  createMockProps: (overrides = {}) => ({
    onRestart: jest.fn(),
    onShare: jest.fn(),
    onConsult: jest.fn(),
    onLearnMore: jest.fn(),
    ...overrides
  }),

  // Create mock assessment result
  createMockResult: (overrides = {}) => ({
    level: 'L3',
    levelName: '流程化融合阶段',
    score: '3.2',
    rawScore: 3.2,
    description: '测试描述',
    color: '#17A2B8',
    dimensionalScores: {
      '技术与工具': { score: 3, level: 'L3', weight: 1.2 },
      '数据与资产': { score: 3, level: 'L3', weight: 1.1 }
    },
    strengths: ['技术与工具', '数据与资产'],
    weaknesses: ['人才与组织'],
    opportunities: ['流程与工作'],
    recommendations: ['建议1', '建议2'],
    nextSteps: ['步骤1', '步骤2'],
    characteristics: ['特征1', '特征2'],
    completionRate: 100,
    confidenceScore: 85,
    answeredQuestions: 10,
    totalQuestions: 10,
    answers: { tech_awareness: 3, data_management: 3 },
    completedAt: new Date().toISOString(),
    sessionId: 'test-session-123',
    timeSpent: 300000,
    industryBenchmark: { percentile: 65, description: '超过行业平均水平' },
    improvementPotential: {
      '技术与工具': {
        currentScore: 3,
        maxScore: 5,
        potential: '2.4',
        impact: 'high',
        priority: 'high'
      }
    },
    ...overrides
  }),

  // Create mock questions
  createMockQuestions: () => [
    {
      id: 'tech_awareness',
      dimension: '技术与工具',
      question: '您的机构目前对AI技术的认知和应用情况是？',
      options: [
        { value: 1, text: '仅在讨论概念', level: 'L1' },
        { value: 2, text: '员工自发使用', level: 'L2' },
        { value: 3, text: '采购专门工具', level: 'L3' }
      ]
    },
    {
      id: 'data_management',
      dimension: '数据与资产',
      question: '您的机构在数据管理和资产化方面的现状是？',
      options: [
        { value: 1, text: '数据孤岛严重', level: 'L1' },
        { value: 2, text: '个人处理数据', level: 'L2' },
        { value: 3, text: '数据已打通', level: 'L3' }
      ]
    }
  ],

  // Simulate user interaction
  simulateClick: (element) => {
    const event = new Event('click', { bubbles: true });
    element.dispatchEvent(event);
  },

  // Wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock component render
  mockRender: (component, props = {}) => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `<div data-testid="${component.name || 'component'}">${JSON.stringify(props)}</div>`;
    return mockElement;
  }
};

// Export for use in tests
module.exports = {
  TestUtils: global.TestUtils,
  setupTests: () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  }
};