// Test Runner for AI Maturity Standalone Application
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testSuites = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      suites: []
    };
  }

  // Discover and load test files
  discoverTests(testDir = './tests') {
    const testFiles = this.findTestFiles(testDir);
    
    testFiles.forEach(file => {
      try {
        const testSuite = require(path.resolve(file));
        this.testSuites.push({
          file,
          suite: testSuite,
          name: path.basename(file, '.test.js')
        });
      } catch (error) {
        console.error(`Failed to load test file ${file}:`, error.message);
      }
    });

    return this.testSuites.length;
  }

  // Find all test files recursively
  findTestFiles(dir) {
    const testFiles = [];
    
    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.test.js')) {
          testFiles.push(fullPath);
        }
      });
    };

    scanDirectory(dir);
    return testFiles;
  }

  // Run all discovered tests
  async runAllTests() {
    console.log(`\n🧪 Running ${this.testSuites.length} test suites...\n`);
    
    const startTime = Date.now();
    
    for (const testSuite of this.testSuites) {
      await this.runTestSuite(testSuite);
    }
    
    this.results.duration = Date.now() - startTime;
    
    this.printSummary();
    return this.results;
  }

  // Run a specific test suite
  async runTestSuite(testSuite) {
    console.log(`📁 ${testSuite.name}`);
    
    const suiteResult = {
      name: testSuite.name,
      file: testSuite.file,
      tests: [],
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    };

    const suiteStartTime = Date.now();

    try {
      // Mock Jest-like describe and test functions
      const tests = [];
      
      global.describe = (description, callback) => {
        const testGroup = {
          description,
          tests: []
        };
        
        const originalTest = global.test;
        global.test = (testName, testCallback) => {
          testGroup.tests.push({
            name: testName,
            callback: testCallback,
            group: description
          });
        };

        callback();
        global.test = originalTest;
        tests.push(testGroup);
      };

      global.test = (testName, testCallback) => {
        tests.push({
          description: 'Default',
          tests: [{
            name: testName,
            callback: testCallback,
            group: 'Default'
          }]
        });
      };

      // Load and execute the test file
      delete require.cache[require.resolve(path.resolve(testSuite.file))];
      require(path.resolve(testSuite.file));

      // Run all tests in the suite
      for (const testGroup of tests) {
        for (const test of testGroup.tests) {
          const testResult = await this.runSingleTest(test);
          suiteResult.tests.push(testResult);
          
          if (testResult.status === 'passed') {
            suiteResult.passed++;
          } else if (testResult.status === 'failed') {
            suiteResult.failed++;
          } else {
            suiteResult.skipped++;
          }
        }
      }

    } catch (error) {
      console.error(`  ❌ Suite failed to load: ${error.message}`);
      suiteResult.failed++;
    }

    suiteResult.duration = Date.now() - suiteStartTime;
    this.results.suites.push(suiteResult);
    
    // Update overall results
    this.results.total += suiteResult.tests.length;
    this.results.passed += suiteResult.passed;
    this.results.failed += suiteResult.failed;
    this.results.skipped += suiteResult.skipped;

    console.log(`  ✅ ${suiteResult.passed} passed, ❌ ${suiteResult.failed} failed, ⏭️ ${suiteResult.skipped} skipped\n`);
  }

  // Run a single test
  async runSingleTest(test) {
    const testResult = {
      name: test.name,
      group: test.group,
      status: 'unknown',
      duration: 0,
      error: null
    };

    const testStartTime = Date.now();

    try {
      // Setup test environment
      this.setupTestEnvironment();
      
      // Run the test
      const result = test.callback();
      
      // Handle async tests
      if (result && typeof result.then === 'function') {
        await result;
      }
      
      testResult.status = 'passed';
      console.log(`    ✅ ${test.name}`);
      
    } catch (error) {
      testResult.status = 'failed';
      testResult.error = {
        message: error.message,
        stack: error.stack
      };
      console.log(`    ❌ ${test.name}`);
      console.log(`       ${error.message}`);
    }

    testResult.duration = Date.now() - testStartTime;
    return testResult;
  }

  // Setup test environment for each test
  setupTestEnvironment() {
    // Reset mocks
    if (global.jest) {
      global.jest.clearAllMocks();
    }

    // Setup expect function (simplified)
    global.expect = (actual) => ({
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toBeGreaterThan: (expected) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan: (expected) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual: (expected) => {
        if (actual < expected) {
          throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
        }
      },
      toBeLessThanOrEqual: (expected) => {
        if (actual > expected) {
          throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error(`Expected ${actual} to be defined`);
        }
      },
      toBeNull: () => {
        if (actual !== null) {
          throw new Error(`Expected ${actual} to be null`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      toHaveLength: (expected) => {
        if (actual.length !== expected) {
          throw new Error(`Expected ${actual} to have length ${expected}, but got ${actual.length}`);
        }
      },
      toHaveProperty: (property) => {
        if (!(property in actual)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to have property ${property}`);
        }
      },
      toHaveBeenCalled: () => {
        if (!actual.mock || actual.mock.calls.length === 0) {
          throw new Error(`Expected mock function to have been called`);
        }
      },
      toHaveBeenCalledWith: (...args) => {
        if (!actual.mock || !actual.mock.calls.some(call => 
          JSON.stringify(call) === JSON.stringify(args))) {
          throw new Error(`Expected mock function to have been called with ${JSON.stringify(args)}`);
        }
      },
      toBeCloseTo: (expected, precision = 2) => {
        const diff = Math.abs(actual - expected);
        const threshold = Math.pow(10, -precision) / 2;
        if (diff >= threshold) {
          throw new Error(`Expected ${actual} to be close to ${expected}`);
        }
      },
      toMatch: (pattern) => {
        if (!pattern.test(actual)) {
          throw new Error(`Expected ${actual} to match ${pattern}`);
        }
      },
      resolves: {
        toBe: async (expected) => {
          const resolved = await actual;
          if (resolved !== expected) {
            throw new Error(`Expected promise to resolve to ${expected}, but got ${resolved}`);
          }
        }
      },
      rejects: {
        toThrow: async (expectedError) => {
          try {
            await actual;
            throw new Error('Expected promise to reject, but it resolved');
          } catch (error) {
            if (expectedError && !error.message.includes(expectedError)) {
              throw new Error(`Expected promise to reject with "${expectedError}", but got "${error.message}"`);
            }
          }
        }
      }
    });

    // Setup jest mock functions
    global.jest = {
      fn: (implementation) => {
        const mockFn = implementation || (() => {});
        mockFn.mock = {
          calls: [],
          results: []
        };
        
        const wrappedFn = (...args) => {
          mockFn.mock.calls.push(args);
          try {
            const result = mockFn(...args);
            mockFn.mock.results.push({ type: 'return', value: result });
            return result;
          } catch (error) {
            mockFn.mock.results.push({ type: 'throw', value: error });
            throw error;
          }
        };
        
        Object.assign(wrappedFn, mockFn);
        wrappedFn.mock = mockFn.mock;
        wrappedFn.mockReturnValue = (value) => {
          mockFn.mockImplementation = () => value;
          return wrappedFn;
        };
        wrappedFn.mockResolvedValue = (value) => {
          mockFn.mockImplementation = () => Promise.resolve(value);
          return wrappedFn;
        };
        wrappedFn.mockRejectedValue = (value) => {
          mockFn.mockImplementation = () => Promise.reject(value);
          return wrappedFn;
        };
        wrappedFn.mockImplementation = (impl) => {
          Object.assign(mockFn, impl);
          return wrappedFn;
        };
        wrappedFn.mockClear = () => {
          mockFn.mock.calls = [];
          mockFn.mock.results = [];
          return wrappedFn;
        };
        
        return wrappedFn;
      },
      clearAllMocks: () => {
        // Implementation would clear all mocks
      },
      useFakeTimers: () => {
        // Mock timer implementation
      },
      useRealTimers: () => {
        // Restore real timers
      },
      advanceTimersByTime: (ms) => {
        // Advance fake timers
      }
    };
  }

  // Print test results summary
  printSummary() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️ Skipped: ${this.results.skipped}`);
    console.log(`⏱️ Duration: ${this.results.duration}ms`);
    
    const successRate = this.results.total > 0 
      ? ((this.results.passed / this.results.total) * 100).toFixed(1)
      : 0;
    console.log(`📈 Success Rate: ${successRate}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.suites.forEach(suite => {
        suite.tests.forEach(test => {
          if (test.status === 'failed') {
            console.log(`  - ${suite.name}: ${test.name}`);
            if (test.error) {
              console.log(`    Error: ${test.error.message}`);
            }
          }
        });
      });
    }

    console.log('\n');
  }

  // Generate detailed test report
  generateReport(outputPath = './test-report.json') {
    const report = {
      ...this.results,
      timestamp: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 Test report saved to: ${outputPath}`);
    
    return report;
  }

  // Run specific test categories
  async runCategory(category) {
    const categoryTests = this.testSuites.filter(suite => 
      suite.file.includes(`/${category}/`) || suite.name.includes(category)
    );

    if (categoryTests.length === 0) {
      console.log(`No tests found for category: ${category}`);
      return;
    }

    console.log(`\n🧪 Running ${categoryTests.length} test suites in category: ${category}\n`);
    
    const startTime = Date.now();
    
    for (const testSuite of categoryTests) {
      await this.runTestSuite(testSuite);
    }
    
    const duration = Date.now() - startTime;
    console.log(`\n✅ Category ${category} completed in ${duration}ms`);
  }
}

// CLI interface
if (require.main === module) {
  const runner = new TestRunner();
  
  const args = process.argv.slice(2);
  const category = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
  const reportPath = args.find(arg => arg.startsWith('--report='))?.split('=')[1];
  
  async function main() {
    try {
      const testCount = runner.discoverTests();
      console.log(`📋 Discovered ${testCount} test suites`);
      
      if (category) {
        await runner.runCategory(category);
      } else {
        await runner.runAllTests();
      }
      
      if (reportPath) {
        runner.generateReport(reportPath);
      }
      
      // Exit with error code if tests failed
      process.exit(runner.results.failed > 0 ? 1 : 0);
      
    } catch (error) {
      console.error('Test runner failed:', error);
      process.exit(1);
    }
  }
  
  main();
}

module.exports = TestRunner;