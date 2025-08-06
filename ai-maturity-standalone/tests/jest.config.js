// Jest Configuration for AI Maturity Standalone Tests
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/tests/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Files to collect coverage from
  collectCoverageFrom: [
    '<rootDir>/components/**/*.js',
    '<rootDir>/utils/**/*.js',
    '<rootDir>/standalone-app.js',
    '!<rootDir>/tests/**',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/scripts/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    },
    './components/': {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85
    },
    './utils/': {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90
    }
  },
  
  // Module name mapping for aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Mock configuration
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',
  
  // Test results processor
  testResultsProcessor: '<rootDir>/tests/testResultsProcessor.js',
  
  // Custom reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: '<rootDir>/tests/reports',
      filename: 'test-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'AI Maturity Standalone Test Report'
    }],
    ['jest-junit', {
      outputDirectory: '<rootDir>/tests/reports',
      outputName: 'junit.xml',
      suiteName: 'AI Maturity Standalone Tests'
    }]
  ],
  
  // Performance budget
  maxWorkers: '50%',
  
  // Snapshot configuration
  snapshotSerializers: ['jest-serializer-html'],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Error handling
  errorOnDeprecated: true,
  
  // Test categories configuration
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/components/**/*.test.js', '<rootDir>/tests/utils/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
    },
    {
      displayName: 'E2E Tests',
      testMatch: ['<rootDir>/tests/e2e/**/*.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js']
    },
    {
      displayName: 'Performance Tests',
      testMatch: ['<rootDir>/tests/performance/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      testTimeout: 30000
    },
    {
      displayName: 'Compatibility Tests',
      testMatch: ['<rootDir>/tests/compatibility/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
    }
  ]
};