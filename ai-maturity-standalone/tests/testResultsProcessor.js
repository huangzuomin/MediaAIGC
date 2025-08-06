// Test Results Processor
const fs = require('fs');
const path = require('path');

module.exports = (results) => {
  // Process and enhance test results
  const processedResults = {
    ...results,
    processed: true,
    processedAt: new Date().toISOString(),
    summary: {
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      skippedTests: results.numPendingTests,
      successRate: results.numTotalTests > 0 
        ? ((results.numPassedTests / results.numTotalTests) * 100).toFixed(2)
        : 0,
      duration: results.testResults.reduce((sum, result) => 
        sum + (result.perfStats?.end - result.perfStats?.start || 0), 0)
    },
    categories: {
      unit: {
        total: 0,
        passed: 0,
        failed: 0
      },
      e2e: {
        total: 0,
        passed: 0,
        failed: 0
      },
      performance: {
        total: 0,
        passed: 0,
        failed: 0
      },
      compatibility: {
        total: 0,
        passed: 0,
        failed: 0
      }
    },
    performance: {
      slowestTests: [],
      fastestTests: [],
      averageTestTime: 0
    },
    coverage: results.coverageMap ? {
      statements: results.coverageMap.getCoverageSummary().statements.pct,
      branches: results.coverageMap.getCoverageSummary().branches.pct,
      functions: results.coverageMap.getCoverageSummary().functions.pct,
      lines: results.coverageMap.getCoverageSummary().lines.pct
    } : null
  };

  // Categorize tests
  results.testResults.forEach(testResult => {
    const filePath = testResult.testFilePath;
    let category = 'unit';
    
    if (filePath.includes('/e2e/')) {
      category = 'e2e';
    } else if (filePath.includes('/performance/')) {
      category = 'performance';
    } else if (filePath.includes('/compatibility/')) {
      category = 'compatibility';
    }
    
    processedResults.categories[category].total += testResult.numPassingTests + testResult.numFailingTests;
    processedResults.categories[category].passed += testResult.numPassingTests;
    processedResults.categories[category].failed += testResult.numFailingTests;
  });

  // Analyze test performance
  const testTimes = results.testResults.map(result => ({
    file: path.basename(result.testFilePath),
    duration: result.perfStats?.end - result.perfStats?.start || 0
  })).filter(test => test.duration > 0);

  testTimes.sort((a, b) => b.duration - a.duration);
  
  processedResults.performance.slowestTests = testTimes.slice(0, 5);
  processedResults.performance.fastestTests = testTimes.slice(-5).reverse();
  processedResults.performance.averageTestTime = testTimes.length > 0
    ? testTimes.reduce((sum, test) => sum + test.duration, 0) / testTimes.length
    : 0;

  // Generate detailed report
  const reportPath = path.join(__dirname, 'reports', 'detailed-results.json');
  
  if (!fs.existsSync(path.dirname(reportPath))) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(processedResults, null, 2));

  // Generate markdown report
  generateMarkdownReport(processedResults);

  // Log summary to console
  console.log('\n📊 Test Results Summary:');
  console.log(`Total: ${processedResults.summary.totalTests}`);
  console.log(`Passed: ${processedResults.summary.passedTests}`);
  console.log(`Failed: ${processedResults.summary.failedTests}`);
  console.log(`Success Rate: ${processedResults.summary.successRate}%`);
  
  if (processedResults.coverage) {
    console.log('\n📈 Coverage Summary:');
    console.log(`Statements: ${processedResults.coverage.statements}%`);
    console.log(`Branches: ${processedResults.coverage.branches}%`);
    console.log(`Functions: ${processedResults.coverage.functions}%`);
    console.log(`Lines: ${processedResults.coverage.lines}%`);
  }

  return results;
};

function generateMarkdownReport(results) {
  const reportPath = path.join(__dirname, 'reports', 'test-report.md');
  
  const markdown = `# AI Maturity Standalone Test Report

## Summary
- **Total Tests**: ${results.summary.totalTests}
- **Passed**: ${results.summary.passedTests}
- **Failed**: ${results.summary.failedTests}
- **Skipped**: ${results.summary.skippedTests}
- **Success Rate**: ${results.summary.successRate}%
- **Duration**: ${(results.summary.duration / 1000).toFixed(2)}s

## Test Categories

### Unit Tests
- Total: ${results.categories.unit.total}
- Passed: ${results.categories.unit.passed}
- Failed: ${results.categories.unit.failed}

### End-to-End Tests
- Total: ${results.categories.e2e.total}
- Passed: ${results.categories.e2e.passed}
- Failed: ${results.categories.e2e.failed}

### Performance Tests
- Total: ${results.categories.performance.total}
- Passed: ${results.categories.performance.passed}
- Failed: ${results.categories.performance.failed}

### Compatibility Tests
- Total: ${results.categories.compatibility.total}
- Passed: ${results.categories.compatibility.passed}
- Failed: ${results.categories.compatibility.failed}

## Performance Analysis

### Slowest Tests
${results.performance.slowestTests.map(test => 
  `- ${test.file}: ${(test.duration / 1000).toFixed(2)}s`
).join('\n')}

### Fastest Tests
${results.performance.fastestTests.map(test => 
  `- ${test.file}: ${(test.duration / 1000).toFixed(2)}s`
).join('\n')}

### Average Test Time
${(results.performance.averageTestTime / 1000).toFixed(2)}s

${results.coverage ? `## Coverage Report
- **Statements**: ${results.coverage.statements}%
- **Branches**: ${results.coverage.branches}%
- **Functions**: ${results.coverage.functions}%
- **Lines**: ${results.coverage.lines}%` : ''}

---
*Report generated on ${results.processedAt}*
`;

  fs.writeFileSync(reportPath, markdown);
}