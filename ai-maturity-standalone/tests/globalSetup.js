// Global Test Setup
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🚀 Setting up test environment...');
  
  // Create test directories
  const testDirs = [
    'tests/coverage',
    'tests/reports',
    'tests/screenshots',
    'tests/temp'
  ];
  
  testDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  
  // Setup global test configuration
  global.TEST_CONFIG = {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
    retries: 2,
    screenshotPath: path.join(__dirname, 'screenshots'),
    tempPath: path.join(__dirname, 'temp')
  };
  
  // Setup performance monitoring
  global.PERFORMANCE_BASELINE = {
    loadTime: 3000,
    renderTime: 50,
    memoryUsage: 50 * 1024 * 1024, // 50MB
    bundleSize: 500 * 1024, // 500KB
    fcp: 2500,
    lcp: 4000,
    cls: 0.25,
    fid: 100
  };
  
  // Initialize test database/storage if needed
  global.TEST_STORAGE = new Map();
  
  console.log('✅ Test environment setup complete');
};