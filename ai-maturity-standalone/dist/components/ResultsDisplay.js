// Enhanced Results Display Component with Visualizations
function ResultsDisplay({ result, onRestart, onShare, onConsult, onLearnMore, isMobile = false }) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [animationPhase, setAnimationPhase] = React.useState(0);
  const [showDetails, setShowDetails] = React.useState(false);
  const [displayVariant, setDisplayVariant] = React.useState('standard');

  // Initialize A/B testing and animation sequence
  React.useEffect(() => {
    // Get A/B test variant for results display
    if (window.ABTesting && window.ABTesting.state.initialized) {
      const assignedVariant = window.ABTesting.getVariant('results_display');
      const variantConfig = window.ABTesting.getVariantConfig('results_display', assignedVariant);
      
      if (assignedVariant && variantConfig) {
        setDisplayVariant(variantConfig.layout || 'standard');
        
        // Track A/B test participation
        window.ABTesting.trackInteraction('results_display', 'results_displayed', {
          result_level: result.level,
          result_score: result.score,
          variant_config: variantConfig
        });
      }
    }

    // Animation sequence for result reveal
    const phases = [
      () => setAnimationPhase(1), // Show level badge
      () => setAnimationPhase(2), // Show score
      () => setAnimationPhase(3), // Show description
      () => setAnimationPhase(4), // Show dimensional scores
      () => setAnimationPhase(5)  // Show recommendations
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, (index + 1) * 500);
    });
  }, [result.level]);

  // Generate chart data for dimensional scores
  const chartData = React.useMemo(() => {
    return Object.entries(result.dimensionalScores).map(([dimension, data]) => ({
      dimension: dimension,
      score: data.score,
      level: data.level,
      color: AssessmentCalculator.getLevelDefinition(data.level).color
    }));
  }, [result.dimensionalScores]);

  // Mobile optimized render
  if (isMobile) {
    return (
      <div className="mobile-result-container">
        <MobileResultHeader result={result} animationPhase={animationPhase} />
        <MobileResultTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          result={result}
        />
        <MobileResultContent 
          activeTab={activeTab}
          result={result}
          chartData={chartData}
          onRestart={onRestart}
          onShare={onShare}
          onConsult={onConsult}
          onLearnMore={onLearnMore}
        />
        
        {/* Conversion CTA Section */}
        {window.ConversionCTA && (
          <div className="mobile-conversion-section">
            <ConversionCTA
              result={result}
              variant="primary"
              onConsult={onConsult}
              onLearnMore={onLearnMore}
              onRestart={onRestart}
              isMobile={true}
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop render
  return (
    <div className="results-display-container">
      <DesktopResultHeader result={result} animationPhase={animationPhase} />
      <DesktopResultContent 
        result={result}
        chartData={chartData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRestart={onRestart}
        onShare={onShare}
        onConsult={onConsult}
        onLearnMore={onLearnMore}
      />
      
      {/* Conversion CTA Section */}
      {window.ConversionCTA && (
        <div className="desktop-conversion-section">
          <ConversionCTA
            result={result}
            variant="primary"
            onConsult={onConsult}
            onLearnMore={onLearnMore}
            onRestart={onRestart}
            isMobile={false}
          />
        </div>
      )}
    </div>
  );
}

// Mobile Result Header Component
function MobileResultHeader({ result, animationPhase }) {
  return (
    <div className="mobile-result-header">
      {/* Animated Level Badge */}
      <div className={`mobile-result-badge ${animationPhase >= 1 ? 'animate-scale-in' : 'opacity-0'}`}>
        <div className="level-badge-inner" style={{ backgroundColor: result.color }}>
          {result.level}
        </div>
        <div className="level-ring" style={{ borderColor: result.color }}></div>
      </div>

      {/* Score Animation */}
      <div className={`mobile-result-score ${animationPhase >= 2 ? 'animate-fade-in' : 'opacity-0'}`}>
        <AnimatedScore targetScore={parseFloat(result.score)} />
        <span className="score-label">/ 5.0</span>
      </div>

      {/* Level Name */}
      <h1 className={`mobile-result-title ${animationPhase >= 1 ? 'animate-slide-up' : 'opacity-0'}`}>
        {result.levelName}
      </h1>

      {/* Confidence and Benchmark */}
      <div className={`mobile-result-meta ${animationPhase >= 3 ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="confidence-indicator">
          <span className="confidence-label">可信度</span>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ width: `${result.confidenceScore}%` }}
            ></div>
          </div>
          <span className="confidence-value">{result.confidenceScore}%</span>
        </div>
        
        <div className="benchmark-indicator">
          <span className="benchmark-text">
            {result.industryBenchmark.description} (前{result.industryBenchmark.percentile}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// Mobile Result Tabs Component
function MobileResultTabs({ activeTab, setActiveTab, result }) {
  const tabs = [
    { id: 'overview', label: '总览', icon: '📊' },
    { id: 'dimensions', label: '维度分析', icon: '📈' },
    { id: 'recommendations', label: '建议', icon: '💡' },
    { id: 'comparison', label: '对比', icon: '⚖️' }
  ];

  return (
    <div className="mobile-result-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Mobile Result Content Component
function MobileResultContent({ activeTab, result, chartData, onRestart, onShare, onConsult, onLearnMore }) {
  switch (activeTab) {
    case 'overview':
      return <MobileOverviewTab result={result} />;
    case 'dimensions':
      return <MobileDimensionsTab result={result} chartData={chartData} />;
    case 'recommendations':
      return <MobileRecommendationsTab result={result} />;
    case 'comparison':
      return <MobileComparisonTab result={result} />;
    default:
      return <MobileOverviewTab result={result} />;
  }
}

// Mobile Overview Tab
function MobileOverviewTab({ result }) {
  return (
    <div className="mobile-tab-content">
      <div className="mobile-section">
        <h3 className="mobile-section-title">现状分析</h3>
        <p className="analysis-text">{result.description}</p>
        
        <div className="characteristics-grid">
          {result.characteristics.map((char, index) => (
            <div key={index} className="characteristic-item">
              <div className="characteristic-icon">✓</div>
              <span className="characteristic-text">{char}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-section">
        <h3 className="mobile-section-title">关键指标</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value">{result.score}</div>
            <div className="metric-label">综合得分</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{result.confidenceScore}%</div>
            <div className="metric-label">结果可信度</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{result.industryBenchmark.percentile}%</div>
            <div className="metric-label">行业排名</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{result.completionRate.toFixed(0)}%</div>
            <div className="metric-label">完成度</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Dimensions Tab
function MobileDimensionsTab({ result, chartData }) {
  return (
    <div className="mobile-tab-content">
      <div className="mobile-section">
        <h3 className="mobile-section-title">维度得分分析</h3>
        <div className="dimensions-chart">
          <RadarChart data={chartData} size={280} />
        </div>
      </div>

      <div className="mobile-section">
        <h3 className="mobile-section-title">详细评分</h3>
        <div className="dimensions-list">
          {chartData.map((item, index) => (
            <div key={index} className="dimension-item">
              <div className="dimension-header">
                <span className="dimension-name">{item.dimension}</span>
                <span className="dimension-level" style={{ color: item.color }}>
                  {item.level}
                </span>
              </div>
              <div className="dimension-score-bar">
                <div 
                  className="dimension-score-fill"
                  style={{ 
                    width: `${(item.score / 5) * 100}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
              <div className="dimension-score-text">
                {item.score.toFixed(1)} / 5.0
              </div>
            </div>
          ))}
        </div>
      </div>

      <StrengthsWeaknessesAnalysis result={result} />
    </div>
  );
}

// Mobile Recommendations Tab
function MobileRecommendationsTab({ result }) {
  return (
    <div className="mobile-tab-content">
      <div className="mobile-section">
        <h3 className="mobile-section-title">个性化建议</h3>
        <div className="recommendations-list">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-number">
                {index + 1}
              </div>
              <div className="recommendation-content">
                <span className="recommendation-text">{rec}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-section">
        <h3 className="mobile-section-title">下一步行动</h3>
        <div className="next-steps-list">
          {result.nextSteps.map((step, index) => (
            <div key={index} className="next-step-item">
              <div className="step-icon">→</div>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <ImprovementPotentialAnalysis result={result} />
    </div>
  );
}

// Mobile Comparison Tab
function MobileComparisonTab({ result }) {
  return (
    <div className="mobile-tab-content">
      <div className="mobile-section">
        <h3 className="mobile-section-title">行业对比</h3>
        <IndustryComparison result={result} />
      </div>

      <div className="mobile-section">
        <h3 className="mobile-section-title">改进潜力</h3>
        <ImprovementMatrix result={result} />
      </div>
    </div>
  );
}

// Animated Score Component
function AnimatedScore({ targetScore, duration = 2000 }) {
  const [currentScore, setCurrentScore] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const startScore = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const score = startScore + (targetScore - startScore) * easeOutQuart;
      
      setCurrentScore(score);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetScore, duration]);

  return (
    <span className="animated-score">
      {currentScore.toFixed(1)}
    </span>
  );
}

// Radar Chart Component
function RadarChart({ data, size = 300 }) {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;

  // Generate polygon points for data
  const dataPoints = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const value = (item.score / 5) * radius;
    const x = center + Math.cos(angle) * value;
    const y = center + Math.sin(angle) * value;
    return `${x},${y}`;
  }).join(' ');

  // Generate grid lines
  const gridLines = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (level / levels) * radius;
    const points = data.map((_, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const x = center + Math.cos(angle) * levelRadius;
      const y = center + Math.sin(angle) * levelRadius;
      return `${x},${y}`;
    }).join(' ');
    
    gridLines.push(
      <polygon
        key={level}
        points={points}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
    );
  }

  return (
    <div className="radar-chart-container">
      <svg width={size} height={size} className="radar-chart">
        {/* Grid */}
        {gridLines}
        
        {/* Axis lines */}
        {data.map((_, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <polygon
          points={dataPoints}
          fill="rgba(0, 51, 102, 0.2)"
          stroke="var(--primary-color)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const value = (item.score / 5) * radius;
          const x = center + Math.cos(angle) * value;
          const y = center + Math.sin(angle) * value;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const labelRadius = radius + 20;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="chart-label"
              fontSize="12"
              fill="#666"
            >
              {item.dimension}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Strengths and Weaknesses Analysis
function StrengthsWeaknessesAnalysis({ result }) {
  return (
    <div className="mobile-section">
      <h3 className="mobile-section-title">优势与不足分析</h3>
      
      {result.strengths.length > 0 && (
        <div className="analysis-group">
          <h4 className="analysis-subtitle">🎯 优势领域</h4>
          <div className="analysis-items">
            {result.strengths.map((strength, index) => (
              <div key={index} className="analysis-item strength">
                {strength}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {result.weaknesses.length > 0 && (
        <div className="analysis-group">
          <h4 className="analysis-subtitle">⚠️ 待改进领域</h4>
          <div className="analysis-items">
            {result.weaknesses.map((weakness, index) => (
              <div key={index} className="analysis-item weakness">
                {weakness}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {result.opportunities.length > 0 && (
        <div className="analysis-group">
          <h4 className="analysis-subtitle">🚀 机会领域</h4>
          <div className="analysis-items">
            {result.opportunities.map((opportunity, index) => (
              <div key={index} className="analysis-item opportunity">
                {opportunity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Improvement Potential Analysis
function ImprovementPotentialAnalysis({ result }) {
  const improvements = Object.entries(result.improvementPotential)
    .sort((a, b) => parseFloat(b[1].potential) - parseFloat(a[1].potential))
    .slice(0, 5);

  return (
    <div className="mobile-section">
      <h3 className="mobile-section-title">改进潜力分析</h3>
      <div className="improvement-list">
        {improvements.map(([dimension, data], index) => (
          <div key={index} className="improvement-item">
            <div className="improvement-header">
              <span className="improvement-dimension">{dimension}</span>
              <span className={`improvement-priority ${data.priority}`}>
                {data.priority === 'high' ? '高优先级' : 
                 data.priority === 'medium' ? '中优先级' : '低优先级'}
              </span>
            </div>
            <div className="improvement-details">
              <div className="improvement-current">
                当前: {data.currentScore.toFixed(1)}
              </div>
              <div className="improvement-potential">
                提升空间: {data.potential}
              </div>
              <div className={`improvement-impact ${data.impact}`}>
                影响: {data.impact === 'high' ? '高' : 
                      data.impact === 'medium' ? '中' : '低'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Industry Comparison Component
function IndustryComparison({ result }) {
  return (
    <div className="industry-comparison">
      <div className="comparison-chart">
        <div className="comparison-bar">
          <div className="comparison-segments">
            <div className="segment low" style={{ width: '20%' }}>L1</div>
            <div className="segment medium-low" style={{ width: '20%' }}>L2</div>
            <div className="segment medium" style={{ width: '25%' }}>L3</div>
            <div className="segment medium-high" style={{ width: '20%' }}>L4</div>
            <div className="segment high" style={{ width: '15%' }}>L5</div>
          </div>
          <div 
            className="your-position"
            style={{ left: `${result.industryBenchmark.percentile}%` }}
          >
            <div className="position-marker">您的位置</div>
            <div className="position-arrow">▼</div>
          </div>
        </div>
      </div>
      <div className="comparison-text">
        您的AI成熟度超过了行业内{result.industryBenchmark.percentile}%的机构
      </div>
    </div>
  );
}

// Improvement Matrix Component
function ImprovementMatrix({ result }) {
  const matrix = Object.entries(result.improvementPotential).map(([dimension, data]) => ({
    dimension,
    impact: data.impact,
    priority: data.priority,
    potential: parseFloat(data.potential)
  }));

  return (
    <div className="improvement-matrix">
      <div className="matrix-grid">
        {matrix.map((item, index) => (
          <div 
            key={index}
            className={`matrix-item ${item.impact} ${item.priority}`}
            style={{
              opacity: 0.7 + (item.potential / 5) * 0.3
            }}
          >
            <div className="matrix-dimension">{item.dimension}</div>
            <div className="matrix-potential">{item.potential}</div>
          </div>
        ))}
      </div>
      <div className="matrix-legend">
        <div className="legend-item">
          <div className="legend-color high"></div>
          <span>高影响高优先级</span>
        </div>
        <div className="legend-item">
          <div className="legend-color medium"></div>
          <span>中等影响优先级</span>
        </div>
        <div className="legend-item">
          <div className="legend-color low"></div>
          <span>低影响优先级</span>
        </div>
      </div>
    </div>
  );
}

// Export component
window.ResultsDisplay = ResultsDisplay;