// Global Test Teardown
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Clean up temporary files
  const tempPath = path.join(__dirname, 'temp');
  if (fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
  
  // Generate final test summary
  const summaryPath = path.join(__dirname, 'reports', 'test-summary.json');
  const summary = {
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    },
    configuration: global.TEST_CONFIG || {},
    baseline: global.PERFORMANCE_BASELINE || {}
  };
  
  if (!fs.existsSync(path.dirname(summaryPath))) {
    fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  }
  
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Clear global variables
  delete global.TEST_CONFIG;
  delete global.PERFORMANCE_BASELINE;
  delete global.TEST_STORAGE;
  
  console.log('✅ Test environment cleanup complete');
};