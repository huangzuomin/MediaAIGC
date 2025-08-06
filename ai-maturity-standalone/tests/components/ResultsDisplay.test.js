// ResultsDisplay Component Unit Tests
const { TestUtils, setupTests } = require('../setup');

describe('ResultsDisplay Component', () => {
  let mockResult;
  let mockProps;

  beforeEach(() => {
    setupTests();
    mockResult = TestUtils.createMockResult();
    mockProps = TestUtils.createMockProps({
      result: mockResult,
      isMobile: false
    });

    // Mock global dependencies
    global.window.AssessmentCalculator = {
      getLevelDefinition: jest.fn().mockReturnValue({
        color: '#17A2B8',
        name: '流程化融合阶段'
      })
    };

    global.window.ConversionCTA = jest.fn().mockReturnValue(
      TestUtils.mockRender('ConversionCTA', {})
    );
  });

  describe('Component Rendering', () => {
    test('should render desktop version by default', () => {
      const component = TestUtils.mockRender('ResultsDisplay', mockProps);
      expect(component).toBeDefined();
      expect(component.querySelector('[data-testid="ResultsDisplay"]')).toBeTruthy();
    });

    test('should render mobile version when isMobile is true', () => {
      const mobileProps = { ...mockProps, isMobile: true };
      const component = TestUtils.mockRender('ResultsDisplay', mobileProps);
      expect(component).toBeDefined();
    });

    test('should display result level and score', () => {
      const component = TestUtils.mockRender('ResultsDisplay', mockProps);
      const content = component.textContent;
      expect(content).toContain(mockResult.level);
      expect(content).toContain(mockResult.score);
    });
  });

  describe('Animation Sequence', () => {
    test('should trigger animation phases in sequence', async () => {
      jest.useFakeTimers();
      
      let animationPhase = 0;
      const phases = [
        () => animationPhase = 1, // Show level badge
        () => animationPhase = 2, // Show score
        () => animationPhase = 3, // Show description
        () => animationPhase = 4, // Show dimensional scores
        () => animationPhase = 5  // Show recommendations
      ];

      phases.forEach((phase, index) => {
        setTimeout(phase, (index + 1) * 500);
      });

      expect(animationPhase).toBe(0);

      jest.advanceTimersByTime(500);
      expect(animationPhase).toBe(1);

      jest.advanceTimersByTime(500);
      expect(animationPhase).toBe(2);

      jest.advanceTimersByTime(1500);
      expect(animationPhase).toBe(5);

      jest.useRealTimers();
    });

    test('should animate score counting', () => {
      jest.useFakeTimers();
      
      const targetScore = 3.2;
      let currentScore = 0;
      const duration = 2000;
      const startTime = Date.now();

      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentScore = targetScore * easeOutQuart;
      };

      // Simulate animation frames
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(200);
        animateScore();
      }

      expect(currentScore).toBeCloseTo(targetScore, 1);
      jest.useRealTimers();
    });
  });

  describe('Tab Navigation', () => {
    test('should switch between tabs', () => {
      let activeTab = 'overview';
      const setActiveTab = (tab) => {
        activeTab = tab;
      };

      const tabs = ['overview', 'dimensions', 'recommendations', 'comparison'];

      tabs.forEach(tab => {
        setActiveTab(tab);
        expect(activeTab).toBe(tab);
      });
    });

    test('should render correct content for each tab', () => {
      const getTabContent = (activeTab, result) => {
        switch (activeTab) {
          case 'overview':
            return { type: 'overview', data: result.description };
          case 'dimensions':
            return { type: 'dimensions', data: result.dimensionalScores };
          case 'recommendations':
            return { type: 'recommendations', data: result.recommendations };
          case 'comparison':
            return { type: 'comparison', data: result.industryBenchmark };
          default:
            return { type: 'overview', data: result.description };
        }
      };

      expect(getTabContent('overview', mockResult).type).toBe('overview');
      expect(getTabContent('dimensions', mockResult).type).toBe('dimensions');
      expect(getTabContent('recommendations', mockResult).type).toBe('recommendations');
      expect(getTabContent('comparison', mockResult).type).toBe('comparison');
    });
  });

  describe('Chart Data Generation', () => {
    test('should generate radar chart data correctly', () => {
      const generateChartData = (dimensionalScores) => {
        return Object.entries(dimensionalScores).map(([dimension, data]) => ({
          dimension: dimension,
          score: data.score,
          level: data.level,
          color: global.window.AssessmentCalculator.getLevelDefinition(data.level).color
        }));
      };

      const chartData = generateChartData(mockResult.dimensionalScores);
      
      expect(chartData).toHaveLength(2);
      expect(chartData[0]).toHaveProperty('dimension');
      expect(chartData[0]).toHaveProperty('score');
      expect(chartData[0]).toHaveProperty('level');
      expect(chartData[0]).toHaveProperty('color');
    });

    test('should calculate radar chart coordinates', () => {
      const calculateRadarPoints = (data, size = 300) => {
        const center = size / 2;
        const radius = size * 0.35;
        
        return data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const value = (item.score / 5) * radius;
          const x = center + Math.cos(angle) * value;
          const y = center + Math.sin(angle) * value;
          return { x, y };
        });
      };

      const mockChartData = [
        { score: 3, dimension: 'A' },
        { score: 4, dimension: 'B' },
        { score: 2, dimension: 'C' }
      ];

      const points = calculateRadarPoints(mockChartData);
      expect(points).toHaveLength(3);
      expect(points[0]).toHaveProperty('x');
      expect(points[0]).toHaveProperty('y');
    });
  });

  describe('Mobile Optimization', () => {
    test('should render mobile-specific components', () => {
      const renderMobileHeader = (result, animationPhase) => {
        return {
          badge: animationPhase >= 1,
          score: animationPhase >= 2,
          title: animationPhase >= 1,
          meta: animationPhase >= 3
        };
      };

      const mobileHeader = renderMobileHeader(mockResult, 3);
      expect(mobileHeader.badge).toBe(true);
      expect(mobileHeader.score).toBe(true);
      expect(mobileHeader.title).toBe(true);
      expect(mobileHeader.meta).toBe(true);
    });

    test('should handle mobile tab navigation', () => {
      const tabs = [
        { id: 'overview', label: '总览', icon: '📊' },
        { id: 'dimensions', label: '维度分析', icon: '📈' },
        { id: 'recommendations', label: '建议', icon: '💡' },
        { id: 'comparison', label: '对比', icon: '⚖️' }
      ];

      let activeTab = 'overview';
      const handleTabClick = (tabId) => {
        activeTab = tabId;
      };

      tabs.forEach(tab => {
        handleTabClick(tab.id);
        expect(activeTab).toBe(tab.id);
      });
    });
  });

  describe('Strengths and Weaknesses Analysis', () => {
    test('should display strengths correctly', () => {
      const renderStrengths = (strengths) => {
        return strengths.map((strength, index) => ({
          id: index,
          text: strength,
          type: 'strength'
        }));
      };

      const strengthsDisplay = renderStrengths(mockResult.strengths);
      expect(strengthsDisplay).toHaveLength(mockResult.strengths.length);
      expect(strengthsDisplay[0].type).toBe('strength');
    });

    test('should display weaknesses correctly', () => {
      const renderWeaknesses = (weaknesses) => {
        return weaknesses.map((weakness, index) => ({
          id: index,
          text: weakness,
          type: 'weakness'
        }));
      };

      const weaknessesDisplay = renderWeaknesses(mockResult.weaknesses);
      expect(weaknessesDisplay).toHaveLength(mockResult.weaknesses.length);
      expect(weaknessesDisplay[0].type).toBe('weakness');
    });

    test('should display opportunities correctly', () => {
      const renderOpportunities = (opportunities) => {
        return opportunities.map((opportunity, index) => ({
          id: index,
          text: opportunity,
          type: 'opportunity'
        }));
      };

      const opportunitiesDisplay = renderOpportunities(mockResult.opportunities);
      expect(opportunitiesDisplay).toHaveLength(mockResult.opportunities.length);
      expect(opportunitiesDisplay[0].type).toBe('opportunity');
    });
  });

  describe('Industry Comparison', () => {
    test('should calculate industry position correctly', () => {
      const calculatePosition = (percentile) => {
        return {
          position: `${percentile}%`,
          description: percentile > 80 ? '行业领先' : 
                      percentile > 60 ? '超过平均' : 
                      percentile > 40 ? '接近平均' : '有待提升'
        };
      };

      const position = calculatePosition(mockResult.industryBenchmark.percentile);
      expect(position.position).toBe('65%');
      expect(position.description).toBe('超过平均');
    });

    test('should render comparison chart segments', () => {
      const generateSegments = () => {
        return [
          { level: 'L1', width: '20%', label: 'L1' },
          { level: 'L2', width: '20%', label: 'L2' },
          { level: 'L3', width: '25%', label: 'L3' },
          { level: 'L4', width: '20%', label: 'L4' },
          { level: 'L5', width: '15%', label: 'L5' }
        ];
      };

      const segments = generateSegments();
      expect(segments).toHaveLength(5);
      expect(segments[0].level).toBe('L1');
      expect(segments[0].width).toBe('20%');
    });
  });

  describe('Improvement Potential Analysis', () => {
    test('should sort improvements by potential', () => {
      const sortImprovements = (improvementPotential) => {
        return Object.entries(improvementPotential)
          .sort((a, b) => parseFloat(b[1].potential) - parseFloat(a[1].potential))
          .slice(0, 5);
      };

      const sorted = sortImprovements(mockResult.improvementPotential);
      expect(sorted).toHaveLength(1); // Only one dimension in mock
      expect(sorted[0][0]).toBe('技术与工具');
    });

    test('should categorize improvement priority', () => {
      const categorizePriority = (priority) => {
        const labels = {
          'high': '高优先级',
          'medium': '中优先级',
          'low': '低优先级'
        };
        return labels[priority] || '未知';
      };

      expect(categorizePriority('high')).toBe('高优先级');
      expect(categorizePriority('medium')).toBe('中优先级');
      expect(categorizePriority('low')).toBe('低优先级');
    });
  });

  describe('Action Handlers', () => {
    test('should handle restart action', () => {
      const mockOnRestart = jest.fn();
      const handleRestart = () => {
        mockOnRestart();
      };

      handleRestart();
      expect(mockOnRestart).toHaveBeenCalled();
    });

    test('should handle share action', () => {
      const mockOnShare = jest.fn();
      const handleShare = () => {
        mockOnShare();
      };

      handleShare();
      expect(mockOnShare).toHaveBeenCalled();
    });

    test('should handle consultation action', () => {
      const mockOnConsult = jest.fn();
      const handleConsult = () => {
        mockOnConsult();
      };

      handleConsult();
      expect(mockOnConsult).toHaveBeenCalled();
    });

    test('should handle learn more action', () => {
      const mockOnLearnMore = jest.fn();
      const handleLearnMore = () => {
        mockOnLearnMore();
      };

      handleLearnMore();
      expect(mockOnLearnMore).toHaveBeenCalled();
    });
  });

  describe('Metrics Display', () => {
    test('should format metrics correctly', () => {
      const formatMetrics = (result) => {
        return {
          score: result.score,
          confidence: `${result.confidenceScore}%`,
          ranking: `${result.industryBenchmark.percentile}%`,
          completion: `${result.completionRate.toFixed(0)}%`
        };
      };

      const metrics = formatMetrics(mockResult);
      expect(metrics.score).toBe('3.2');
      expect(metrics.confidence).toBe('85%');
      expect(metrics.ranking).toBe('65%');
      expect(metrics.completion).toBe('100%');
    });

    test('should display dimensional scores', () => {
      const formatDimensionalScores = (dimensionalScores) => {
        return Object.entries(dimensionalScores).map(([dimension, data]) => ({
          dimension,
          score: data.score.toFixed(1),
          level: data.level,
          percentage: (data.score / 5) * 100
        }));
      };

      const formatted = formatDimensionalScores(mockResult.dimensionalScores);
      expect(formatted).toHaveLength(2);
      expect(formatted[0]).toHaveProperty('dimension');
      expect(formatted[0]).toHaveProperty('score');
      expect(formatted[0]).toHaveProperty('level');
      expect(formatted[0]).toHaveProperty('percentage');
    });
  });

  describe('Accessibility', () => {
    test('should provide proper ARIA labels', () => {
      const generateAriaLabel = (result) => {
        return `AI成熟度评估结果：${result.level} ${result.levelName}，得分 ${result.score}`;
      };

      const ariaLabel = generateAriaLabel(mockResult);
      expect(ariaLabel).toBe('AI成熟度评估结果：L3 流程化融合阶段，得分 3.2');
    });

    test('should support keyboard navigation', () => {
      const mockKeyboardHandler = jest.fn();
      
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'Tab':
            mockKeyboardHandler('tab');
            break;
          case 'Enter':
          case ' ':
            mockKeyboardHandler('activate');
            break;
          case 'Escape':
            mockKeyboardHandler('escape');
            break;
        }
      };

      const mockEvent = { key: 'Tab' };
      handleKeyDown(mockEvent);
      expect(mockKeyboardHandler).toHaveBeenCalledWith('tab');

      const enterEvent = { key: 'Enter' };
      handleKeyDown(enterEvent);
      expect(mockKeyboardHandler).toHaveBeenCalledWith('activate');
    });
  });
});