#!/usr/bin/env node

// Enhanced Test Script for AI Maturity Standalone
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class TestManager {
  constructor() {
    this.testDir = path.join(__dirname, '..', 'tests');
    this.reportsDir = path.join(this.testDir, 'reports');
    this.coverageDir = path.join(this.testDir, 'coverage');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.reportsDir, this.coverageDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runTests(options = {}) {
    console.log('🧪 Starting AI Maturity Standalone Test Suite...\n');
    
    const {
      category = 'all',
      coverage = false,
      watch = false,
      verbose = false,
      bail = false,
      parallel = true
    } = options;

    try {
      // Pre-test validation
      await this.validateTestEnvironment();
      
      // Run tests based on category
      switch (category) {
        case 'unit':
          await this.runUnitTests({ coverage, verbose });
          break;
        case 'e2e':
          await this.runE2ETests({ verbose });
          break;
        case 'performance':
          await this.runPerformanceTests({ verbose });
          break;
        case 'compatibility':
          await this.runCompatibilityTests({ verbose });
          break;
        case 'all':
        default:
          await this.runAllTests({ coverage, verbose, bail, parallel });
          break;
      }

      // Generate reports
      await this.generateReports();
      
      console.log('\n✅ Test suite completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async validateTestEnvironment() {
    console.log('🔍 Validating test environment...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = '16.0.0';
    
    if (!this.isVersionCompatible(nodeVersion.slice(1), requiredVersion)) {
      throw new Error(`Node.js ${requiredVersion} or higher is required. Current: ${nodeVersion}`);
    }

    // Check if test files exist
    const testFiles = this.findTestFiles();
    if (testFiles.length === 0) {
      throw new Error('No test files found');
    }

    // Check dependencies
    const packageJson = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', 'package.json'), 'utf8'
    ));
    
    const requiredDeps = ['jest', 'jsdom', '@babel/core'];
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.devDependencies[dep] && !packageJson.dependencies[dep]
    );
    
    if (missingDeps.length > 0) {
      console.warn(`⚠️ Missing dependencies: ${missingDeps.join(', ')}`);
      console.log('Installing missing dependencies...');
      
      try {
        execSync(`npm install ${missingDeps.join(' ')} --save-dev`, { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
      } catch (error) {
        throw new Error('Failed to install missing dependencies');
      }
    }

    console.log('✅ Test environment validated');
  }

  async runUnitTests(options = {}) {
    console.log('🔬 Running Unit Tests...');
    
    const TestRunner = require('../tests/testRunner');
    const runner = new TestRunner();
    
    runner.discoverTests();
    await runner.runCategory('components');
    await runner.runCategory('utils');
    
    if (options.coverage) {
      await this.generateCoverageReport();
    }
  }

  async runE2ETests(options = {}) {
    console.log('🌐 Running End-to-End Tests...');
    
    // Start local server for E2E tests
    const server = await this.startTestServer();
    
    try {
      const TestRunner = require('../tests/testRunner');
      const runner = new TestRunner();
      
      runner.discoverTests();
      await runner.runCategory('e2e');
      
    } finally {
      if (server) {
        server.kill();
      }
    }
  }

  async runPerformanceTests(options = {}) {
    console.log('⚡ Running Performance Tests...');
    
    const TestRunner = require('../tests/testRunner');
    const runner = new TestRunner();
    
    runner.discoverTests();
    await runner.runCategory('performance');
    
    // Generate performance report
    await this.generatePerformanceReport();
  }

  async runCompatibilityTests(options = {}) {
    console.log('🔧 Running Compatibility Tests...');
    
    const TestRunner = require('../tests/testRunner');
    const runner = new TestRunner();
    
    runner.discoverTests();
    await runner.runCategory('compatibility');
  }

  async runAllTests(options = {}) {
    console.log('🚀 Running All Tests...');
    
    const TestRunner = require('../tests/testRunner');
    const runner = new TestRunner();
    
    const testCount = runner.discoverTests();
    console.log(`📋 Found ${testCount} test suites`);
    
    const results = await runner.runAllTests();
    
    if (options.coverage) {
      await this.generateCoverageReport();
    }
    
    return results;
  }

  async startTestServer() {
    console.log('🌐 Starting test server...');
    
    const serverScript = path.join(__dirname, 'serve.js');
    const server = spawn('node', [serverScript, '--port=3001', '--quiet'], {
      stdio: 'pipe',
      detached: false
    });
    
    // Wait for server to start
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test server failed to start'));
      }, 10000);
      
      server.stdout.on('data', (data) => {
        if (data.toString().includes('Server running')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      
      server.stderr.on('data', (data) => {
        console.error('Server error:', data.toString());
      });
    });
    
    console.log('✅ Test server started on port 3001');
    return server;
  }

  async generateCoverageReport() {
    console.log('📊 Generating coverage report...');
    
    try {
      // Use Jest for coverage if available
      if (this.hasJest()) {
        execSync('npx jest --coverage --silent', {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
      } else {
        console.log('⚠️ Jest not available, skipping coverage report');
      }
    } catch (error) {
      console.warn('⚠️ Coverage report generation failed:', error.message);
    }
  }

  async generatePerformanceReport() {
    console.log('📈 Generating performance report...');
    
    const performanceData = {
      timestamp: new Date().toISOString(),
      metrics: {
        loadTime: Math.random() * 3000 + 1000, // Mock data
        renderTime: Math.random() * 50 + 10,
        memoryUsage: Math.random() * 50 * 1024 * 1024 + 10 * 1024 * 1024,
        bundleSize: Math.random() * 200 * 1024 + 300 * 1024
      },
      baseline: global.PERFORMANCE_BASELINE || {},
      recommendations: []
    };
    
    // Add recommendations based on metrics
    if (performanceData.metrics.loadTime > 3000) {
      performanceData.recommendations.push('Optimize page load time');
    }
    
    if (performanceData.metrics.renderTime > 50) {
      performanceData.recommendations.push('Optimize component render time');
    }
    
    const reportPath = path.join(this.reportsDir, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(performanceData, null, 2));
    
    console.log(`📄 Performance report saved to: ${reportPath}`);
  }

  async generateReports() {
    console.log('📋 Generating test reports...');
    
    const reportsIndex = path.join(this.reportsDir, 'index.html');
    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Maturity Standalone Test Reports</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .report-link { display: block; margin: 10px 0; padding: 10px; background: #f5f5f5; text-decoration: none; border-radius: 5px; }
        .report-link:hover { background: #e5e5e5; }
    </style>
</head>
<body>
    <h1>AI Maturity Standalone Test Reports</h1>
    <p>Generated on: ${new Date().toISOString()}</p>
    
    <h2>Available Reports</h2>
    <a href="test-report.html" class="report-link">📊 Test Results Report</a>
    <a href="test-report.md" class="report-link">📝 Markdown Report</a>
    <a href="performance-report.json" class="report-link">⚡ Performance Report</a>
    <a href="../coverage/lcov-report/index.html" class="report-link">📈 Coverage Report</a>
    
    <h2>Test Categories</h2>
    <ul>
        <li>Unit Tests - Component and utility function tests</li>
        <li>E2E Tests - End-to-end user flow tests</li>
        <li>Performance Tests - Performance benchmarks and monitoring</li>
        <li>Compatibility Tests - Cross-browser compatibility tests</li>
    </ul>
</body>
</html>`;
    
    fs.writeFileSync(reportsIndex, indexHtml);
    console.log(`📄 Reports index created at: ${reportsIndex}`);
  }

  findTestFiles() {
    const testFiles = [];
    
    const scanDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.test.js')) {
          testFiles.push(fullPath);
        }
      });
    };
    
    scanDir(this.testDir);
    return testFiles;
  }

  hasJest() {
    try {
      require.resolve('jest');
      return true;
    } catch (error) {
      return false;
    }
  }

  isVersionCompatible(current, required) {
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const requiredPart = requiredParts[i] || 0;
      
      if (currentPart > requiredPart) return true;
      if (currentPart < requiredPart) return false;
    }
    
    return true;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    category: args.find(arg => arg.startsWith('--category='))?.split('=')[1] || 'all',
    coverage: args.includes('--coverage'),
    watch: args.includes('--watch'),
    verbose: args.includes('--verbose'),
    bail: args.includes('--bail'),
    parallel: !args.includes('--no-parallel')
  };
  
  const testManager = new TestManager();
  testManager.runTests(options).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = TestManager;