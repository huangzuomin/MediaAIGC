// A/B Test Dashboard Component for Monitoring and Analysis
function ABTestDashboard({ isVisible = false, onClose }) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedTest, setSelectedTest] = React.useState(null);
  const [testResults, setTestResults] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshInterval, setRefreshInterval] = React.useState(null);

  // Load test data on component mount
  React.useEffect(() => {
    if (isVisible) {
      loadTestData();
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(loadTestData, 30000);
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isVisible]);

  // Load all test data
  const loadTestData = async () => {
    if (!window.ABTesting || !window.ABTestAnalytics) return;
    
    setIsLoading(true);
    try {
      const results = {};
      const tests = Object.keys(window.ABTesting.tests);
      
      for (const testId of tests) {
        const testResult = window.ABTesting.getTestResults(testId);
        const analysis = window.ABTestAnalytics.analyzeTest(testId);
        
        if (testResult) {
          results[testId] = {
            ...testResult,
            analysis: analysis
          };
        }
      }
      
      setTestResults(results);
      
      // Select first test if none selected
      if (!selectedTest && tests.length > 0) {
        setSelectedTest(tests[0]);
      }
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle test selection
  const handleTestSelect = (testId) => {
    setSelectedTest(testId);
    setActiveTab('overview');
  };

  // Export test data
  const handleExport = (testId, format = 'json') => {
    if (!window.ABTestAnalytics) return;
    
    const data = window.ABTestAnalytics.exportAnalysis(testId, format);
    const blob = new Blob([data], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab_test_${testId}_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="ab-test-dashboard-overlay">
      <div className="ab-test-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h2 className="dashboard-title">A/B 测试控制台</h2>
            <div className="dashboard-status">
              {isLoading && (
                <div className="loading-indicator">
                  <div className="loading-spinner-sm"></div>
                  <span>加载中...</span>
                </div>
              )}
              <span className="last-updated">
                最后更新: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="refresh-button"
              onClick={loadTestData}
              disabled={isLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
            <button className="close-button" onClick={onClose}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="test-list">
              <h3 className="test-list-title">活跃测试</h3>
              {Object.entries(testResults).map(([testId, data]) => (
                <TestListItem
                  key={testId}
                  testId={testId}
                  testData={data}
                  isSelected={selectedTest === testId}
                  onClick={() => handleTestSelect(testId)}
                />
              ))}
              
              {Object.keys(testResults).length === 0 && !isLoading && (
                <div className="no-tests">
                  <p>暂无活跃测试</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-main">
            {selectedTest && testResults[selectedTest] ? (
              <>
                {/* Tab Navigation */}
                <div className="dashboard-tabs">
                  <button
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    概览
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analysis')}
                  >
                    分析
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'variants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('variants')}
                  >
                    变体对比
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                  >
                    建议
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <OverviewTab 
                      testId={selectedTest}
                      testData={testResults[selectedTest]}
                      onExport={handleExport}
                    />
                  )}
                  {activeTab === 'analysis' && (
                    <AnalysisTab 
                      testId={selectedTest}
                      testData={testResults[selectedTest]}
                    />
                  )}
                  {activeTab === 'variants' && (
                    <VariantsTab 
                      testId={selectedTest}
                      testData={testResults[selectedTest]}
                    />
                  )}
                  {activeTab === 'recommendations' && (
                    <RecommendationsTab 
                      testId={selectedTest}
                      testData={testResults[selectedTest]}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-content">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3>选择一个测试查看详情</h3>
                  <p>从左侧列表中选择一个A/B测试来查看详细的分析结果</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Test List Item Component
function TestListItem({ testId, testData, isSelected, onClick }) {
  const testConfig = window.ABTesting?.tests[testId];
  const hasSignificantResults = testData.analysis?.comparisons?.some(c => c.isSignificant) || false;
  const totalParticipants = testData.summary?.totalParticipants || 0;
  const overallConversionRate = testData.summary?.overallConversionRate || 0;

  return (
    <div 
      className={`test-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="test-item-header">
        <div className="test-name">{testConfig?.name || testId}</div>
        <div className="test-status">
          {hasSignificantResults && (
            <span className="status-badge significant">显著</span>
          )}
          <span className="status-badge active">活跃</span>
        </div>
      </div>
      
      <div className="test-item-stats">
        <div className="stat">
          <span className="stat-label">参与者</span>
          <span className="stat-value">{totalParticipants.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">转化率</span>
          <span className="stat-value">{overallConversionRate.toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="test-item-variants">
        {Object.keys(testData.variants || {}).length} 个变体
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ testId, testData, onExport }) {
  const testConfig = window.ABTesting?.tests[testId];
  const analysis = testData.analysis;

  return (
    <div className="overview-tab">
      {/* Test Summary */}
      <div className="overview-section">
        <div className="section-header">
          <h3 className="section-title">测试概览</h3>
          <div className="section-actions">
            <button 
              className="export-button"
              onClick={() => onExport(testId, 'json')}
            >
              导出 JSON
            </button>
            <button 
              className="export-button"
              onClick={() => onExport(testId, 'csv')}
            >
              导出 CSV
            </button>
          </div>
        </div>
        
        <div className="test-info-grid">
          <div className="info-card">
            <div className="info-label">测试名称</div>
            <div className="info-value">{testConfig?.name || testId}</div>
          </div>
          <div className="info-card">
            <div className="info-label">测试描述</div>
            <div className="info-value">{testConfig?.description || '无描述'}</div>
          </div>
          <div className="info-card">
            <div className="info-label">变体数量</div>
            <div className="info-value">{Object.keys(testData.variants).length}</div>
          </div>
          <div className="info-card">
            <div className="info-label">总参与者</div>
            <div className="info-value">{testData.summary.totalParticipants.toLocaleString()}</div>
          </div>
          <div className="info-card">
            <div className="info-label">总转化数</div>
            <div className="info-value">{testData.summary.totalConversions.toLocaleString()}</div>
          </div>
          <div className="info-card">
            <div className="info-label">整体转化率</div>
            <div className="info-value">{testData.summary.overallConversionRate.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="overview-section">
        <h3 className="section-title">关键指标</h3>
        <div className="metrics-grid">
          {Object.entries(testData.variants).map(([variantId, variantData]) => (
            <VariantMetricCard
              key={variantId}
              variantId={variantId}
              variantData={variantData}
              testConfig={testConfig}
            />
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      {analysis && (
        <div className="overview-section">
          <h3 className="section-title">快速洞察</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <div className="insight-title">统计显著性</div>
                <div className="insight-value">
                  {analysis.comparisons?.filter(c => c.isSignificant).length || 0} / {analysis.comparisons?.length || 0} 对比显著
                </div>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <div className="insight-title">测试有效性</div>
                <div className="insight-value">
                  {analysis.validity?.score || 0}% 有效性评分
                </div>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <div className="insight-title">建议数量</div>
                <div className="insight-value">
                  {analysis.recommendations?.length || 0} 条建议
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Variant Metric Card Component
function VariantMetricCard({ variantId, variantData, testConfig }) {
  const variantConfig = testConfig?.variants[variantId];
  const conversionRate = variantData.participants > 0 ? 
    (variantData.conversions / variantData.participants) * 100 : 0;

  return (
    <div className="variant-metric-card">
      <div className="variant-header">
        <div className="variant-name">
          {variantConfig?.name || variantId}
        </div>
        <div className="variant-type">
          {variantConfig?.config?.type || 'standard'}
        </div>
      </div>
      
      <div className="variant-metrics">
        <div className="metric">
          <div className="metric-label">参与者</div>
          <div className="metric-value">{variantData.participants.toLocaleString()}</div>
        </div>
        <div className="metric">
          <div className="metric-label">转化数</div>
          <div className="metric-value">{variantData.conversions.toLocaleString()}</div>
        </div>
        <div className="metric">
          <div className="metric-label">转化率</div>
          <div className="metric-value">{conversionRate.toFixed(2)}%</div>
        </div>
        <div className="metric">
          <div className="metric-label">交互数</div>
          <div className="metric-value">{variantData.interactions.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="variant-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(100, conversionRate * 10)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Analysis Tab Component
function AnalysisTab({ testId, testData }) {
  const analysis = testData.analysis;
  
  if (!analysis) {
    return (
      <div className="analysis-tab">
        <div className="no-analysis">
          <p>分析数据不可用</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-tab">
      {/* Statistical Summary */}
      <div className="analysis-section">
        <h3 className="section-title">统计分析摘要</h3>
        <div className="statistical-summary">
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">总体显著性</div>
              <div className="summary-value">
                {analysis.comparisons?.some(c => c.isSignificant) ? '是' : '否'}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">显著对比数</div>
              <div className="summary-value">
                {analysis.comparisons?.filter(c => c.isSignificant).length || 0}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">平均效应量</div>
              <div className="summary-value">
                {analysis.comparisons?.length > 0 ? 
                  (analysis.comparisons.reduce((sum, c) => sum + Math.abs(c.effectSize?.value || 0), 0) / analysis.comparisons.length).toFixed(3) : 
                  '0.000'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Analysis */}
      <div className="analysis-section">
        <h3 className="section-title">变体分析</h3>
        <div className="variant-analysis-grid">
          {Object.entries(analysis.variants || {}).map(([variantId, variantAnalysis]) => (
            <VariantAnalysisCard
              key={variantId}
              variantId={variantId}
              analysis={variantAnalysis}
            />
          ))}
        </div>
      </div>

      {/* Pairwise Comparisons */}
      <div className="analysis-section">
        <h3 className="section-title">变体对比分析</h3>
        <div className="comparisons-table">
          <div className="table-header">
            <div className="header-cell">变体 A</div>
            <div className="header-cell">变体 B</div>
            <div className="header-cell">转化率差异</div>
            <div className="header-cell">P 值</div>
            <div className="header-cell">显著性</div>
            <div className="header-cell">获胜者</div>
          </div>
          
          {analysis.comparisons?.map((comparison, index) => (
            <ComparisonRow key={index} comparison={comparison} />
          ))}
        </div>
      </div>

      {/* Test Validity */}
      {analysis.validity && (
        <div className="analysis-section">
          <h3 className="section-title">测试有效性</h3>
          <TestValidityCard validity={analysis.validity} />
        </div>
      )}
    </div>
  );
}

// Variant Analysis Card Component
function VariantAnalysisCard({ variantId, analysis }) {
  return (
    <div className="variant-analysis-card">
      <div className="card-header">
        <h4 className="variant-title">{variantId}</h4>
        <div className={`performance-badge ${analysis.performance?.rating || 'unknown'}`}>
          {analysis.performance?.rating || 'unknown'}
        </div>
      </div>
      
      <div className="analysis-metrics">
        <div className="metric-row">
          <span className="metric-label">转化率</span>
          <span className="metric-value">{(analysis.conversionRate * 100).toFixed(2)}%</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">置信区间</span>
          <span className="metric-value">
            [{(analysis.confidenceInterval?.lower * 100).toFixed(2)}%, {(analysis.confidenceInterval?.upper * 100).toFixed(2)}%]
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">参与度评分</span>
          <span className="metric-value">{analysis.performance?.engagementScore || 0}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">质量评分</span>
          <span className="metric-value">{analysis.performance?.qualityScore || 0}</span>
        </div>
      </div>
    </div>
  );
}

// Comparison Row Component
function ComparisonRow({ comparison }) {
  const getWinnerText = (winner) => {
    if (winner.result === 'variant_a_wins') return '变体 A';
    if (winner.result === 'variant_b_wins') return '变体 B';
    if (winner.result === 'no_significant_difference') return '无显著差异';
    if (winner.result === 'inconclusive') return '不确定';
    return '平局';
  };

  return (
    <div className="comparison-row">
      <div className="cell">{comparison.variantA}</div>
      <div className="cell">{comparison.variantB}</div>
      <div className="cell">
        {comparison.relativeDifference > 0 ? '+' : ''}{comparison.relativeDifference.toFixed(1)}%
      </div>
      <div className="cell">{comparison.pValue.toFixed(4)}</div>
      <div className="cell">
        <span className={`significance-badge ${comparison.isSignificant ? 'significant' : 'not-significant'}`}>
          {comparison.isSignificant ? '显著' : '不显著'}
        </span>
      </div>
      <div className="cell">{getWinnerText(comparison.winner)}</div>
    </div>
  );
}

// Test Validity Card Component
function TestValidityCard({ validity }) {
  return (
    <div className="validity-card">
      <div className="validity-header">
        <div className="validity-score">
          <span className="score-value">{validity.score}</span>
          <span className="score-label">/ 100</span>
        </div>
        <div className={`validity-status ${validity.isValid ? 'valid' : 'invalid'}`}>
          {validity.isValid ? '有效' : '存在问题'}
        </div>
      </div>
      
      {validity.issues?.length > 0 && (
        <div className="validity-issues">
          <h5 className="issues-title">问题</h5>
          <ul className="issues-list">
            {validity.issues.map((issue, index) => (
              <li key={index} className="issue-item error">{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validity.warnings?.length > 0 && (
        <div className="validity-warnings">
          <h5 className="warnings-title">警告</h5>
          <ul className="warnings-list">
            {validity.warnings.map((warning, index) => (
              <li key={index} className="warning-item">{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Variants Tab Component
function VariantsTab({ testId, testData }) {
  const [selectedVariants, setSelectedVariants] = React.useState([]);
  const variantIds = Object.keys(testData.variants);

  // Select first two variants by default
  React.useEffect(() => {
    if (variantIds.length >= 2 && selectedVariants.length === 0) {
      setSelectedVariants([variantIds[0], variantIds[1]]);
    }
  }, [variantIds]);

  const handleVariantToggle = (variantId) => {
    setSelectedVariants(prev => {
      if (prev.includes(variantId)) {
        return prev.filter(id => id !== variantId);
      } else if (prev.length < 2) {
        return [...prev, variantId];
      } else {
        return [prev[1], variantId]; // Replace first with new selection
      }
    });
  };

  return (
    <div className="variants-tab">
      {/* Variant Selector */}
      <div className="variant-selector">
        <h3 className="section-title">选择要对比的变体 (最多2个)</h3>
        <div className="variant-checkboxes">
          {variantIds.map(variantId => (
            <label key={variantId} className="variant-checkbox">
              <input
                type="checkbox"
                checked={selectedVariants.includes(variantId)}
                onChange={() => handleVariantToggle(variantId)}
                disabled={!selectedVariants.includes(variantId) && selectedVariants.length >= 2}
              />
              <span className="checkbox-label">{variantId}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Variant Comparison */}
      {selectedVariants.length === 2 && (
        <VariantComparison
          variantA={selectedVariants[0]}
          variantB={selectedVariants[1]}
          dataA={testData.variants[selectedVariants[0]]}
          dataB={testData.variants[selectedVariants[1]]}
          comparison={testData.analysis?.comparisons?.find(c => 
            (c.variantA === selectedVariants[0] && c.variantB === selectedVariants[1]) ||
            (c.variantA === selectedVariants[1] && c.variantB === selectedVariants[0])
          )}
        />
      )}

      {/* All Variants Overview */}
      <div className="all-variants-section">
        <h3 className="section-title">所有变体概览</h3>
        <div className="variants-overview-table">
          <div className="table-header">
            <div className="header-cell">变体</div>
            <div className="header-cell">参与者</div>
            <div className="header-cell">转化数</div>
            <div className="header-cell">转化率</div>
            <div className="header-cell">置信区间</div>
            <div className="header-cell">表现</div>
          </div>
          
          {Object.entries(testData.variants).map(([variantId, variantData]) => {
            const analysis = testData.analysis?.variants?.[variantId];
            const conversionRate = variantData.participants > 0 ? 
              (variantData.conversions / variantData.participants) * 100 : 0;
            
            return (
              <div key={variantId} className="table-row">
                <div className="cell variant-name">{variantId}</div>
                <div className="cell">{variantData.participants.toLocaleString()}</div>
                <div className="cell">{variantData.conversions.toLocaleString()}</div>
                <div className="cell">{conversionRate.toFixed(2)}%</div>
                <div className="cell">
                  {analysis?.confidenceInterval ? 
                    `[${(analysis.confidenceInterval.lower * 100).toFixed(1)}%, ${(analysis.confidenceInterval.upper * 100).toFixed(1)}%]` :
                    'N/A'
                  }
                </div>
                <div className="cell">
                  <span className={`performance-indicator ${analysis?.performance?.rating || 'unknown'}`}>
                    {analysis?.performance?.rating || 'unknown'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Variant Comparison Component
function VariantComparison({ variantA, variantB, dataA, dataB, comparison }) {
  const rateA = dataA.participants > 0 ? (dataA.conversions / dataA.participants) * 100 : 0;
  const rateB = dataB.participants > 0 ? (dataB.conversions / dataB.participants) * 100 : 0;

  return (
    <div className="variant-comparison">
      <h3 className="section-title">{variantA} vs {variantB}</h3>
      
      <div className="comparison-grid">
        {/* Variant A */}
        <div className="comparison-card">
          <div className="card-header">
            <h4 className="variant-title">{variantA}</h4>
          </div>
          <div className="variant-stats">
            <div className="stat-item">
              <div className="stat-value">{dataA.participants.toLocaleString()}</div>
              <div className="stat-label">参与者</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{dataA.conversions.toLocaleString()}</div>
              <div className="stat-label">转化数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{rateA.toFixed(2)}%</div>
              <div className="stat-label">转化率</div>
            </div>
          </div>
        </div>

        {/* Comparison Arrow */}
        <div className="comparison-arrow">
          <div className="arrow-content">
            {comparison && (
              <>
                <div className="difference-value">
                  {comparison.relativeDifference > 0 ? '+' : ''}{comparison.relativeDifference.toFixed(1)}%
                </div>
                <div className="significance-status">
                  {comparison.isSignificant ? '显著差异' : '无显著差异'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Variant B */}
        <div className="comparison-card">
          <div className="card-header">
            <h4 className="variant-title">{variantB}</h4>
          </div>
          <div className="variant-stats">
            <div className="stat-item">
              <div className="stat-value">{dataB.participants.toLocaleString()}</div>
              <div className="stat-label">参与者</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{dataB.conversions.toLocaleString()}</div>
              <div className="stat-label">转化数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{rateB.toFixed(2)}%</div>
              <div className="stat-label">转化率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Stats */}
      {comparison && (
        <div className="detailed-comparison">
          <h4 className="comparison-title">详细对比统计</h4>
          <div className="comparison-stats-grid">
            <div className="stat-card">
              <div className="stat-label">P 值</div>
              <div className="stat-value">{comparison.pValue.toFixed(4)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Z 分数</div>
              <div className="stat-value">{comparison.zScore.toFixed(3)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">效应量</div>
              <div className="stat-value">{comparison.effectSize?.value.toFixed(3)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">贝叶斯概率</div>
              <div className="stat-value">{(comparison.bayesianProbability * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Recommendations Tab Component
function RecommendationsTab({ testId, testData }) {
  const analysis = testData.analysis;
  const recommendations = analysis?.recommendations || [];

  return (
    <div className="recommendations-tab">
      <div className="recommendations-header">
        <h3 className="section-title">测试建议</h3>
        <div className="recommendations-summary">
          共 {recommendations.length} 条建议
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <div className="no-recommendations-content">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h4>暂无建议</h4>
            <p>系统将根据测试数据自动生成建议</p>
          </div>
        </div>
      )}

      {/* Action Items */}
      {recommendations.some(r => r.type === 'winner_found') && (
        <div className="action-items-section">
          <h4 className="section-title">下一步行动</h4>
          <div className="action-items">
            <div className="action-item">
              <div className="action-icon">🎯</div>
              <div className="action-content">
                <div className="action-title">实施获胜变体</div>
                <div className="action-description">
                  将表现最佳的变体设为默认版本，预期可提升整体转化率
                </div>
              </div>
            </div>
            <div className="action-item">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <div className="action-title">监控实施效果</div>
                <div className="action-description">
                  持续跟踪实施后的实际业务指标变化，确保预期效果
                </div>
              </div>
            </div>
            <div className="action-item">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <div className="action-title">记录测试学习</div>
                <div className="action-description">
                  文档化测试结果和洞察，为未来的优化提供参考
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({ recommendation, index }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'winner_found': return '🏆';
      case 'insufficient_data': return '📊';
      case 'sample_ratio_mismatch': return '⚠️';
      case 'poor_performance': return '📉';
      case 'test_duration': return '⏱️';
      default: return '💡';
    }
  };

  return (
    <div className="recommendation-card">
      <div className="recommendation-header">
        <div className="recommendation-icon">
          {getTypeIcon(recommendation.type)}
        </div>
        <div className="recommendation-title">
          {recommendation.message}
        </div>
        <div className={`priority-badge ${getPriorityColor(recommendation.priority)}`}>
          {recommendation.priority === 'high' ? '高优先级' :
           recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
        </div>
      </div>
      
      {recommendation.details && (
        <div className="recommendation-details">
          {recommendation.details}
        </div>
      )}
      
      <div className="recommendation-action">
        <strong>建议行动:</strong> {recommendation.action}
      </div>
      
      {recommendation.confidence && (
        <div className="recommendation-confidence">
          <span className="confidence-label">置信度:</span>
          <span className="confidence-value">{recommendation.confidence}%</span>
        </div>
      )}
      
      {recommendation.affectedVariants && (
        <div className="affected-variants">
          <span className="variants-label">影响变体:</span>
          <span className="variants-list">
            {recommendation.affectedVariants.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}

// Export component
window.ABTestDashboard = ABTestDashboard;