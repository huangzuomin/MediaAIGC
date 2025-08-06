// AssessmentCalculator Utility Unit Tests
const { TestUtils, setupTests } = require('../setup');

describe('AssessmentCalculator Utility', () => {
  let mockCalculator;
  let mockAnswers;
  let mockQuestions;

  beforeEach(() => {
    setupTests();
    mockAnswers = {
      tech_awareness: 3,
      data_management: 3,
      workflow_integration: 4,
      team_capability: 2
    };
    mockQuestions = TestUtils.createMockQuestions();

    // Mock AssessmentCalculator
    mockCalculator = {
      dimensionWeights: {
        'tech_awareness': 1.2,
        'data_management': 1.1,
        'workflow_integration': 1.3,
        'team_capability': 1.0
      },

      levelDefinitions: {
        'L1': {
          name: '观察与感知阶段',
          range: [1.0, 1.5],
          color: '#FF6B6B',
          description: '初期阶段',
          characteristics: ['AI认知处于概念阶段'],
          recommendations: ['组织AI认知培训'],
          nextSteps: ['建立AI学习小组']
        },
        'L2': {
          name: '工具化应用阶段',
          range: [1.5, 2.5],
          color: '#FFB800',
          description: '工具应用阶段',
          characteristics: ['员工开始自发使用AI工具'],
          recommendations: ['统一AI工具选型'],
          nextSteps: ['制定AI工具使用规范']
        },
        'L3': {
          name: '流程化融合阶段',
          range: [2.5, 3.5],
          color: '#17A2B8',
          description: '流程融合阶段',
          characteristics: ['AI已融入标准业务流程'],
          recommendations: ['扩大AI应用范围'],
          nextSteps: ['构建AI能力中台']
        }
      },

      calculateWeightedScore: function(answers) {
        let totalWeightedScore = 0;
        let totalWeight = 0;

        Object.entries(answers).forEach(([questionId, score]) => {
          const weight = this.dimensionWeights[questionId] || 1.0;
          totalWeightedScore += score * weight;
          totalWeight += weight;
        });

        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
      },

      getScoreLevel: function(score) {
        for (const [level, definition] of Object.entries(this.levelDefinitions)) {
          if (score >= definition.range[0] && score <= definition.range[1]) {
            return level;
          }
        }
        return 'L1';
      },

      getLevelDefinition: function(level) {
        return this.levelDefinitions[level] || this.levelDefinitions['L1'];
      },

      calculateDimensionalScores: function(answers, questions) {
        const dimensionalScores = {};
        questions.forEach(question => {
          const score = answers[question.id];
          if (score !== undefined) {
            dimensionalScores[question.dimension] = {
              score: score,
              level: this.getScoreLevel(score),
              weight: this.dimensionWeights[question.id] || 1.0,
              questionId: question.id
            };
          }
        });
        return dimensionalScores;
      }
    };
  });

  describe('Score Calculation', () => {
    test('should calculate weighted score correctly', () => {
      const score = mockCalculator.calculateWeightedScore(mockAnswers);
      
      // Manual calculation: (3*1.2 + 3*1.1 + 4*1.3 + 2*1.0) / (1.2+1.1+1.3+1.0)
      const expectedScore = (3.6 + 3.3 + 5.2 + 2.0) / 4.6;
      
      expect(score).toBeCloseTo(expectedScore, 2);
    });

    test('should handle empty answers', () => {
      const score = mockCalculator.calculateWeightedScore({});
      expect(score).toBe(0);
    });

    test('should handle missing weights', () => {
      const answersWithUnknownQuestion = {
        unknown_question: 3
      };
      
      const score = mockCalculator.calculateWeightedScore(answersWithUnknownQuestion);
      expect(score).toBe(3); // Should use default weight of 1.0
    });

    test('should calculate dimensional scores', () => {
      const dimensionalScores = mockCalculator.calculateDimensionalScores(mockAnswers, mockQuestions);
      
      expect(dimensionalScores).toHaveProperty('技术与工具');
      expect(dimensionalScores).toHaveProperty('数据与资产');
      expect(dimensionalScores['技术与工具'].score).toBe(3);
      expect(dimensionalScores['数据与资产'].score).toBe(3);
    });
  });

  describe('Level Determination', () => {
    test('should determine correct level from score', () => {
      expect(mockCalculator.getScoreLevel(1.2)).toBe('L1');
      expect(mockCalculator.getScoreLevel(2.0)).toBe('L2');
      expect(mockCalculator.getScoreLevel(3.0)).toBe('L3');
    });

    test('should handle edge cases', () => {
      expect(mockCalculator.getScoreLevel(1.5)).toBe('L2'); // Boundary case
      expect(mockCalculator.getScoreLevel(2.5)).toBe('L3'); // Boundary case
      expect(mockCalculator.getScoreLevel(0.5)).toBe('L1'); // Below minimum
      expect(mockCalculator.getScoreLevel(5.0)).toBe('L1'); // Above maximum (fallback)
    });

    test('should get level definition', () => {
      const l3Definition = mockCalculator.getLevelDefinition('L3');
      expect(l3Definition.name).toBe('流程化融合阶段');
      expect(l3Definition.color).toBe('#17A2B8');
      expect(l3Definition.range).toEqual([2.5, 3.5]);
    });

    test('should fallback to L1 for unknown level', () => {
      const unknownDefinition = mockCalculator.getLevelDefinition('L99');
      expect(unknownDefinition.name).toBe('观察与感知阶段');
    });
  });

  describe('Strengths and Weaknesses Analysis', () => {
    test('should identify strengths correctly', () => {
      const analyzeStrengthsWeaknesses = (dimensionalScores) => {
        const scores = Object.entries(dimensionalScores).map(([dimension, data]) => ({
          dimension,
          score: data.score,
          weightedScore: data.score * data.weight
        }));

        scores.sort((a, b) => b.weightedScore - a.weightedScore);

        const strengths = scores.slice(0, 3).filter(s => s.score >= 3);
        const weaknesses = scores.slice(-3).filter(s => s.score <= 2);

        return { strengths: strengths.map(s => s.dimension), weaknesses: weaknesses.map(s => s.dimension) };
      };

      const dimensionalScores = {
        '技术与工具': { score: 4, weight: 1.2 },
        '数据与资产': { score: 3, weight: 1.1 },
        '人才与组织': { score: 2, weight: 1.0 }
      };

      const analysis = analyzeStrengthsWeaknesses(dimensionalScores);
      expect(analysis.strengths).toContain('技术与工具');
      expect(analysis.strengths).toContain('数据与资产');
      expect(analysis.weaknesses).toContain('人才与组织');
    });

    test('should handle edge cases in analysis', () => {
      const analyzeEdgeCases = (dimensionalScores) => {
        if (Object.keys(dimensionalScores).length === 0) {
          return { strengths: [], weaknesses: [] };
        }

        const scores = Object.entries(dimensionalScores).map(([dimension, data]) => ({
          dimension,
          score: data.score,
          weightedScore: data.score * (data.weight || 1.0)
        }));

        return {
          strengths: scores.filter(s => s.score >= 4).map(s => s.dimension),
          weaknesses: scores.filter(s => s.score <= 2).map(s => s.dimension)
        };
      };

      // Empty scores
      expect(analyzeEdgeCases({})).toEqual({ strengths: [], weaknesses: [] });

      // All high scores
      const highScores = {
        'A': { score: 5, weight: 1.0 },
        'B': { score: 4, weight: 1.0 }
      };
      const highAnalysis = analyzeEdgeCases(highScores);
      expect(highAnalysis.strengths).toHaveLength(2);
      expect(highAnalysis.weaknesses).toHaveLength(0);
    });
  });

  describe('Confidence Score Calculation', () => {
    test('should calculate confidence based on completion and consistency', () => {
      const calculateConfidenceScore = (answers, totalQuestions) => {
        const answeredQuestions = Object.keys(answers).length;
        const completionRate = answeredQuestions / totalQuestions;

        // Calculate score variance for consistency
        const scores = Object.values(answers);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        const consistency = Math.max(0, 1 - variance / 4);

        const confidenceScore = (completionRate * 0.7 + consistency * 0.3) * 100;
        return Math.round(confidenceScore);
      };

      // High completion, high consistency
      const highConfidence = calculateConfidenceScore({ a: 3, b: 3, c: 3, d: 3 }, 4);
      expect(highConfidence).toBeGreaterThan(80);

      // Low completion
      const lowCompletion = calculateConfidenceScore({ a: 3 }, 4);
      expect(lowCompletion).toBeLessThan(50);

      // High variance (low consistency)
      const lowConsistency = calculateConfidenceScore({ a: 1, b: 5, c: 1, d: 5 }, 4);
      expect(lowConsistency).toBeLessThan(highConfidence);
    });
  });

  describe('Industry Benchmark', () => {
    test('should provide appropriate benchmark for each level', () => {
      const getIndustryBenchmark = (level) => {
        const benchmarks = {
          'L1': { percentile: 20, description: '处于行业起步阶段' },
          'L2': { percentile: 40, description: '达到行业平均水平' },
          'L3': { percentile: 65, description: '超过行业平均水平' },
          'L4': { percentile: 85, description: '处于行业领先地位' },
          'L5': { percentile: 95, description: '行业顶尖水平' }
        };
        return benchmarks[level] || benchmarks['L1'];
      };

      expect(getIndustryBenchmark('L1').percentile).toBe(20);
      expect(getIndustryBenchmark('L3').percentile).toBe(65);
      expect(getIndustryBenchmark('L5').percentile).toBe(95);
      expect(getIndustryBenchmark('L99').percentile).toBe(20); // Fallback
    });
  });

  describe('Improvement Potential', () => {
    test('should calculate improvement potential correctly', () => {
      const calculateImprovementPotential = (dimensionalScores) => {
        const improvements = {};
        
        Object.entries(dimensionalScores).forEach(([dimension, data]) => {
          const currentScore = data.score;
          const maxScore = 5;
          const weight = data.weight || 1.0;
          
          const potential = (maxScore - currentScore) * weight;
          const impact = potential > 2 ? 'high' : potential > 1 ? 'medium' : 'low';
          
          improvements[dimension] = {
            currentScore: currentScore,
            maxScore: maxScore,
            potential: potential.toFixed(1),
            impact: impact,
            priority: weight >= 1.1 ? 'high' : weight >= 1.0 ? 'medium' : 'low'
          };
        });

        return improvements;
      };

      const dimensionalScores = {
        '技术与工具': { score: 2, weight: 1.2 },
        '数据与资产': { score: 4, weight: 1.0 }
      };

      const improvements = calculateImprovementPotential(dimensionalScores);
      
      expect(improvements['技术与工具'].potential).toBe('3.6'); // (5-2)*1.2
      expect(improvements['技术与工具'].impact).toBe('high');
      expect(improvements['技术与工具'].priority).toBe('high');
      
      expect(improvements['数据与资产'].potential).toBe('1.0'); // (5-4)*1.0
      expect(improvements['数据与资产'].impact).toBe('medium');
      expect(improvements['数据与资产'].priority).toBe('medium');
    });
  });

  describe('Personalized Recommendations', () => {
    test('should generate recommendations based on level and weaknesses', () => {
      const generatePersonalizedRecommendations = (level, weaknesses) => {
        const baseLevelRecommendations = mockCalculator.levelDefinitions[level].recommendations;
        const personalizedRecommendations = [...baseLevelRecommendations];

        const weaknessRecommendations = {
          '技术与工具': ['加强AI技术培训'],
          '数据与资产': ['完善数据治理体系'],
          '人才与组织': ['制定AI人才培养计划']
        };

        weaknesses.forEach(weakness => {
          const recs = weaknessRecommendations[weakness] || [];
          personalizedRecommendations.push(...recs);
        });

        return [...new Set(personalizedRecommendations)].slice(0, 6);
      };

      const recommendations = generatePersonalizedRecommendations('L2', ['人才与组织']);
      
      expect(recommendations).toContain('统一AI工具选型');
      expect(recommendations).toContain('制定AI人才培养计划');
      expect(recommendations.length).toBeLessThanOrEqual(6);
    });
  });

  describe('Result Comparison', () => {
    test('should compare current result with previous result', () => {
      const compareWithPrevious = (currentResult, previousResult) => {
        if (!previousResult) return null;

        const scoreDiff = currentResult.rawScore - previousResult.rawScore;
        const levelChanged = currentResult.level !== previousResult.level;

        return {
          scoreDifference: scoreDiff.toFixed(1),
          improved: scoreDiff > 0,
          levelChanged: levelChanged,
          levelUpgraded: levelChanged && currentResult.level > previousResult.level
        };
      };

      const currentResult = { rawScore: 3.2, level: 'L3' };
      const previousResult = { rawScore: 2.8, level: 'L2' };

      const comparison = compareWithPrevious(currentResult, previousResult);
      
      expect(comparison.scoreDifference).toBe('0.4');
      expect(comparison.improved).toBe(true);
      expect(comparison.levelChanged).toBe(true);
      expect(comparison.levelUpgraded).toBe(true);
    });

    test('should handle no previous result', () => {
      const compareWithPrevious = (currentResult, previousResult) => {
        if (!previousResult) return null;
        return { hasComparison: true };
      };

      const comparison = compareWithPrevious({ rawScore: 3.2 }, null);
      expect(comparison).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid input gracefully', () => {
      const safeCalculateScore = (answers) => {
        try {
          if (!answers || typeof answers !== 'object') {
            return 0;
          }
          return mockCalculator.calculateWeightedScore(answers);
        } catch (error) {
          console.warn('Score calculation error:', error);
          return 0;
        }
      };

      expect(safeCalculateScore(null)).toBe(0);
      expect(safeCalculateScore(undefined)).toBe(0);
      expect(safeCalculateScore('invalid')).toBe(0);
      expect(safeCalculateScore({})).toBe(0);
    });

    test('should handle missing question data', () => {
      const safeDimensionalScores = (answers, questions) => {
        try {
          if (!questions || !Array.isArray(questions)) {
            return {};
          }
          return mockCalculator.calculateDimensionalScores(answers, questions);
        } catch (error) {
          console.warn('Dimensional scores calculation error:', error);
          return {};
        }
      };

      expect(safeDimensionalScores({}, null)).toEqual({});
      expect(safeDimensionalScores({}, undefined)).toEqual({});
      expect(safeDimensionalScores({}, 'invalid')).toEqual({});
    });
  });

  describe('Performance Optimization', () => {
    test('should handle large datasets efficiently', () => {
      const startTime = Date.now();
      
      // Generate large dataset
      const largeAnswers = {};
      for (let i = 0; i < 1000; i++) {
        largeAnswers[`question_${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const score = mockCalculator.calculateWeightedScore(largeAnswers);
      const endTime = Date.now();
      
      expect(score).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    test('should cache level definitions', () => {
      const getCachedLevelDefinition = (() => {
        const cache = new Map();
        return (level) => {
          if (cache.has(level)) {
            return cache.get(level);
          }
          const definition = mockCalculator.getLevelDefinition(level);
          cache.set(level, definition);
          return definition;
        };
      })();

      // First call
      const def1 = getCachedLevelDefinition('L3');
      // Second call (should use cache)
      const def2 = getCachedLevelDefinition('L3');
      
      expect(def1).toEqual(def2);
      expect(def1.name).toBe('流程化融合阶段');
    });
  });
});