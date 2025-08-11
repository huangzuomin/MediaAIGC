// A/B Test Analytics and Statistical Analysis Tools
const ABTestAnalytics = {
  // Configuration
  config: {
    confidenceLevel: 0.95,
    minimumSampleSize: 30,
    minimumTestDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
    significanceThreshold: 0.05,
    powerThreshold: 0.8
  },

  // Statistical functions
  statistics: {
    // Calculate z-score for two proportions
    calculateZScore: function(p1, n1, p2, n2) {
      const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
      const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
      
      if (se === 0) return 0;
      return (p1 - p2) / se;
    },

    // Calculate p-value from z-score
    calculatePValue: function(zScore) {
      // Simplified p-value calculation using normal distribution approximation
      const absZ = Math.abs(zScore);
      
      // Using approximation for standard normal distribution
      if (absZ > 6) return 0;
      if (absZ < 0.5) return 1 - 0.3829 * absZ;
      
      const t = 1 / (1 + 0.2316419 * absZ);
      const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
      const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      
      return 2 * p; // Two-tailed test
    },

    // Calculate confidence interval for proportion
    calculateConfidenceInterval: function(p, n, confidence = 0.95) {
      const z = confidence === 0.95 ? 1.96 : confidence === 0.90 ? 1.645 : 1.28;
      const se = Math.sqrt(p * (1 - p) / n);
      
      return {
        lower: Math.max(0, p - z * se),
        upper: Math.min(1, p + z * se),
        margin: z * se
      };
    },

    // Calculate effect size (Cohen's h for proportions)
    calculateEffectSize: function(p1, p2) {
      const h = 2 * (Math.asin(Math.sqrt(p1)) - Math.asin(Math.sqrt(p2)));
      
      let magnitude = 'negligible';
      if (Math.abs(h) >= 0.8) magnitude = 'large';
      else if (Math.abs(h) >= 0.5) magnitude = 'medium';
      else if (Math.abs(h) >= 0.2) magnitude = 'small';
      
      return { value: h, magnitude: magnitude };
    },

    // Calculate required sample size for desired power
    calculateSampleSize: function(p1, p2, alpha = 0.05, power = 0.8) {
      const z_alpha = alpha === 0.05 ? 1.96 : 1.645;
      const z_beta = power === 0.8 ? 0.84 : power === 0.9 ? 1.28 : 0.67;
      
      const pooledP = (p1 + p2) / 2;
      const delta = Math.abs(p1 - p2);
      
      if (delta === 0) return Infinity;
      
      const n = Math.pow(z_alpha * Math.sqrt(2 * pooledP * (1 - pooledP)) + 
                        z_beta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2) / 
                Math.pow(delta, 2);
      
      return Math.ceil(n);
    },

    // Bayesian probability that variant B is better than A
    calculateBayesianProbability: function(conversionsA, visitorsA, conversionsB, visitorsB) {
      // Using Beta-Binomial conjugate prior (simplified)
      const alpha_A = conversionsA + 1;
      const beta_A = visitorsA - conversionsA + 1;
      const alpha_B = conversionsB + 1;
      const beta_B = visitorsB - conversionsB + 1;
      
      // Monte Carlo simulation for Bayesian probability
      const simulations = 10000;
      let bWins = 0;
      
      for (let i = 0; i < simulations; i++) {
        const sampleA = this.betaRandom(alpha_A, beta_A);
        const sampleB = this.betaRandom(alpha_B, beta_B);
        if (sampleB > sampleA) bWins++;
      }
      
      return bWins / simulations;
    },

    // Generate random sample from Beta distribution
    betaRandom: function(alpha, beta) {
      const gamma1 = this.gammaRandom(alpha);
      const gamma2 = this.gammaRandom(beta);
      return gamma1 / (gamma1 + gamma2);
    },

    // Generate random sample from Gamma distribution (simplified)
    gammaRandom: function(shape) {
      // Simplified gamma random generator
      if (shape < 1) {
        return this.gammaRandom(shape + 1) * Math.pow(Math.random(), 1/shape);
      }
      
      const d = shape - 1/3;
      const c = 1 / Math.sqrt(9 * d);
      
      while (true) {
        let x, v;
        do {
          x = this.normalRandom();
          v = 1 + c * x;
        } while (v <= 0);
        
        v = v * v * v;
        const u = Math.random();
        
        if (u < 1 - 0.0331 * x * x * x * x) {
          return d * v;
        }
        
        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
          return d * v;
        }
      }
    },

    // Generate random sample from normal distribution
    normalRandom: function() {
      // Box-Muller transformation
      if (this.hasSpare) {
        this.hasSpare = false;
        return this.spare;
      }
      
      this.hasSpare = true;
      const u = Math.random();
      const v = Math.random();
      const mag = Math.sqrt(-2 * Math.log(u));
      this.spare = mag * Math.cos(2 * Math.PI * v);
      return mag * Math.sin(2 * Math.PI * v);
    }
  },

  // Comprehensive test analysis
  analyzeTest: function(testId) {
    const testResults = window.ABTesting.getTestResults(testId);
    if (!testResults) {
      return { error: 'Test not found or no data available' };
    }

    const analysis = {
      testId: testId,
      testName: testResults.testName,
      summary: testResults.summary,
      variants: {},
      comparisons: [],
      recommendations: [],
      validity: this.assessTestValidity(testResults),
      timestamp: new Date().toISOString()
    };

    // Analyze each variant
    Object.entries(testResults.variants).forEach(([variantId, variantData]) => {
      analysis.variants[variantId] = this.analyzeVariant(variantId, variantData);
    });

    // Perform pairwise comparisons
    const variantIds = Object.keys(testResults.variants);
    for (let i = 0; i < variantIds.length; i++) {
      for (let j = i + 1; j < variantIds.length; j++) {
        const comparison = this.compareVariants(
          variantIds[i], testResults.variants[variantIds[i]],
          variantIds[j], testResults.variants[variantIds[j]]
        );
        analysis.comparisons.push(comparison);
      }
    }

    // Generate recommendations
    analysis.recommendations = this.generateAnalysisRecommendations(analysis);

    return analysis;
  },

  // Analyze individual variant
  analyzeVariant: function(variantId, variantData) {
    const conversionRate = variantData.participants > 0 ? 
      variantData.conversions / variantData.participants : 0;
    
    const confidenceInterval = this.statistics.calculateConfidenceInterval(
      conversionRate, variantData.participants
    );

    return {
      variantId: variantId,
      participants: variantData.participants,
      conversions: variantData.conversions,
      conversionRate: conversionRate,
      confidenceInterval: confidenceInterval,
      interactions: variantData.interactions,
      avgTimeInTest: variantData.avgTimeInTest,
      conversionsByType: variantData.conversionsByType,
      performance: this.assessVariantPerformance(variantData)
    };
  },

  // Compare two variants
  compareVariants: function(variantA_id, variantA, variantB_id, variantB) {
    const rateA = variantA.participants > 0 ? variantA.conversions / variantA.participants : 0;
    const rateB = variantB.participants > 0 ? variantB.conversions / variantB.participants : 0;

    const zScore = this.statistics.calculateZScore(
      rateA, variantA.participants,
      rateB, variantB.participants
    );

    const pValue = this.statistics.calculatePValue(zScore);
    const effectSize = this.statistics.calculateEffectSize(rateA, rateB);
    
    const bayesianProb = this.statistics.calculateBayesianProbability(
      variantA.conversions, variantA.participants,
      variantB.conversions, variantB.participants
    );

    const isSignificant = pValue < this.config.significanceThreshold;
    const hasMinimumSample = variantA.participants >= this.config.minimumSampleSize && 
                            variantB.participants >= this.config.minimumSampleSize;

    return {
      variantA: variantA_id,
      variantB: variantB_id,
      conversionRateA: rateA,
      conversionRateB: rateB,
      relativeDifference: rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0,
      absoluteDifference: rateB - rateA,
      zScore: zScore,
      pValue: pValue,
      isSignificant: isSignificant,
      effectSize: effectSize,
      bayesianProbability: bayesianProb,
      confidence: hasMinimumSample ? (1 - pValue) * 100 : 0,
      winner: this.determineWinner(rateA, rateB, isSignificant, hasMinimumSample),
      sampleSizeAdequate: hasMinimumSample
    };
  },

  // Determine winner between variants
  determineWinner: function(rateA, rateB, isSignificant, hasMinimumSample) {
    if (!hasMinimumSample) {
      return { result: 'inconclusive', reason: 'insufficient_sample_size' };
    }

    if (!isSignificant) {
      return { result: 'no_significant_difference', reason: 'not_statistically_significant' };
    }

    if (rateB > rateA) {
      return { result: 'variant_b_wins', confidence: 'high' };
    } else if (rateA > rateB) {
      return { result: 'variant_a_wins', confidence: 'high' };
    } else {
      return { result: 'tie', reason: 'equal_performance' };
    }
  },

  // Assess test validity
  assessTestValidity: function(testResults) {
    const issues = [];
    const warnings = [];

    // Check sample sizes
    Object.entries(testResults.variants).forEach(([variantId, data]) => {
      if (data.participants < this.config.minimumSampleSize) {
        issues.push(`Variant ${variantId} has insufficient sample size (${data.participants} < ${this.config.minimumSampleSize})`);
      }
    });

    // Check for sample ratio mismatch (SRM)
    const expectedRatio = 1 / Object.keys(testResults.variants).length;
    const totalParticipants = testResults.summary.totalParticipants;
    
    Object.entries(testResults.variants).forEach(([variantId, data]) => {
      const actualRatio = data.participants / totalParticipants;
      const deviation = Math.abs(actualRatio - expectedRatio) / expectedRatio;
      
      if (deviation > 0.1) { // 10% deviation threshold
        warnings.push(`Variant ${variantId} has sample ratio mismatch: expected ${(expectedRatio * 100).toFixed(1)}%, got ${(actualRatio * 100).toFixed(1)}%`);
      }
    });

    // Check conversion rates for outliers
    const conversionRates = Object.values(testResults.variants).map(v => 
      v.participants > 0 ? v.conversions / v.participants : 0
    );
    const avgRate = conversionRates.reduce((a, b) => a + b, 0) / conversionRates.length;
    
    conversionRates.forEach((rate, index) => {
      const variantId = Object.keys(testResults.variants)[index];
      if (Math.abs(rate - avgRate) > avgRate * 2) { // More than 200% deviation
        warnings.push(`Variant ${variantId} has unusual conversion rate: ${(rate * 100).toFixed(2)}% vs average ${(avgRate * 100).toFixed(2)}%`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues: issues,
      warnings: warnings,
      score: Math.max(0, 100 - issues.length * 30 - warnings.length * 10)
    };
  },

  // Assess variant performance
  assessVariantPerformance: function(variantData) {
    const conversionRate = variantData.participants > 0 ? 
      variantData.conversions / variantData.participants : 0;
    
    let performance = 'poor';
    if (conversionRate > 0.1) performance = 'excellent';
    else if (conversionRate > 0.05) performance = 'good';
    else if (conversionRate > 0.02) performance = 'average';
    else if (conversionRate > 0.01) performance = 'below_average';

    return {
      rating: performance,
      conversionRate: conversionRate,
      engagementScore: this.calculateEngagementScore(variantData),
      qualityScore: this.calculateQualityScore(variantData)
    };
  },

  // Calculate engagement score
  calculateEngagementScore: function(variantData) {
    // Simplified engagement calculation
    const interactionRate = variantData.participants > 0 ? 
      variantData.interactions / variantData.participants : 0;
    const avgTime = variantData.avgTimeInTest || 0;
    
    // Normalize scores (0-100)
    const interactionScore = Math.min(100, interactionRate * 50);
    const timeScore = Math.min(100, avgTime / 60000 * 10); // Convert ms to minutes, scale
    
    return Math.round((interactionScore + timeScore) / 2);
  },

  // Calculate quality score
  calculateQualityScore: function(variantData) {
    // Quality based on conversion types and consistency
    const conversionTypes = Object.keys(variantData.conversionsByType || {});
    const typeScore = Math.min(100, conversionTypes.length * 25);
    
    // Consistency score (lower variance in conversion timing is better)
    const consistencyScore = 75; // Simplified - would need timing data
    
    return Math.round((typeScore + consistencyScore) / 2);
  },

  // Generate analysis recommendations
  generateAnalysisRecommendations: function(analysis) {
    const recommendations = [];

    // Find best performing variant
    let bestVariant = null;
    let bestRate = 0;
    
    Object.entries(analysis.variants).forEach(([variantId, data]) => {
      if (data.conversionRate > bestRate) {
        bestRate = data.conversionRate;
        bestVariant = variantId;
      }
    });

    // Check for clear winner
    const significantComparisons = analysis.comparisons.filter(c => c.isSignificant);
    if (significantComparisons.length > 0 && bestVariant) {
      const bestComparison = significantComparisons.find(c => 
        c.winner.result.includes(bestVariant) || 
        (c.winner.result === 'variant_b_wins' && c.variantB === bestVariant) ||
        (c.winner.result === 'variant_a_wins' && c.variantA === bestVariant)
      );

      if (bestComparison) {
        recommendations.push({
          type: 'winner_found',
          priority: 'high',
          message: `变体 "${bestVariant}" 是明确的获胜者`,
          details: `转化率: ${(bestRate * 100).toFixed(2)}%, 相对提升: ${bestComparison.relativeDifference.toFixed(1)}%`,
          action: `建议实施变体 "${bestVariant}" 作为默认版本`,
          confidence: bestComparison.confidence
        });
      }
    }

    // Check for insufficient data
    const insufficientVariants = Object.entries(analysis.variants).filter(([_, data]) => 
      data.participants < this.config.minimumSampleSize
    );

    if (insufficientVariants.length > 0) {
      recommendations.push({
        type: 'insufficient_data',
        priority: 'medium',
        message: '部分变体样本量不足',
        details: `${insufficientVariants.length} 个变体需要更多数据`,
        action: '继续测试或增加流量分配',
        affectedVariants: insufficientVariants.map(([id]) => id)
      });
    }

    // Check for sample ratio mismatch
    if (analysis.validity.warnings.some(w => w.includes('sample ratio mismatch'))) {
      recommendations.push({
        type: 'sample_ratio_mismatch',
        priority: 'high',
        message: '检测到样本比例不匹配',
        details: '可能存在技术问题影响流量分配',
        action: '检查实验配置和流量分配逻辑'
      });
    }

    // Performance recommendations
    const poorPerformers = Object.entries(analysis.variants).filter(([_, data]) => 
      data.performance.rating === 'poor'
    );

    if (poorPerformers.length > 0) {
      recommendations.push({
        type: 'poor_performance',
        priority: 'medium',
        message: '部分变体表现不佳',
        details: `${poorPerformers.length} 个变体转化率过低`,
        action: '考虑停止表现不佳的变体或重新设计',
        affectedVariants: poorPerformers.map(([id]) => id)
      });
    }

    // Duration recommendations
    const testDuration = this.getTestDuration(analysis.testId);
    if (testDuration < this.config.minimumTestDuration) {
      recommendations.push({
        type: 'test_duration',
        priority: 'low',
        message: '测试时间可能不足',
        details: `当前测试时长: ${Math.round(testDuration / (24 * 60 * 60 * 1000))} 天`,
        action: `建议至少运行 ${Math.round(this.config.minimumTestDuration / (24 * 60 * 60 * 1000))} 天`
      });
    }

    return recommendations;
  },

  // Get test duration
  getTestDuration: function(testId) {
    if (window.ABTesting) {
      return window.ABTesting.getTestDuration(testId);
    }
    return 0;
  },

  // Generate comprehensive report
  generateComprehensiveReport: function(testId) {
    const analysis = this.analyzeTest(testId);
    const testConfig = window.ABTesting.tests[testId];
    
    const report = {
      executiveSummary: this.generateExecutiveSummary(analysis),
      testOverview: {
        testId: testId,
        testName: analysis.testName,
        objective: testConfig?.description,
        duration: this.getTestDuration(testId),
        totalParticipants: analysis.summary.totalParticipants,
        totalConversions: analysis.summary.totalConversions,
        overallConversionRate: analysis.summary.overallConversionRate
      },
      detailedAnalysis: analysis,
      statisticalSummary: this.generateStatisticalSummary(analysis),
      businessImpact: this.calculateBusinessImpact(analysis),
      nextSteps: this.generateNextSteps(analysis),
      appendix: {
        methodology: this.getMethodologyNotes(),
        limitations: this.getTestLimitations(analysis),
        rawData: this.getRawDataSummary(testId)
      },
      generatedAt: new Date().toISOString()
    };

    return report;
  },

  // Generate executive summary
  generateExecutiveSummary: function(analysis) {
    const winnerRecommendation = analysis.recommendations.find(r => r.type === 'winner_found');
    const significantResults = analysis.comparisons.filter(c => c.isSignificant);
    
    let summary = `测试 "${analysis.testName}" 包含 ${Object.keys(analysis.variants).length} 个变体，`;
    summary += `总计 ${analysis.summary.totalParticipants} 名参与者。`;
    
    if (winnerRecommendation) {
      summary += ` ${winnerRecommendation.message}，${winnerRecommendation.details}。`;
      summary += ` 建议采用获胜变体以提升业务指标。`;
    } else if (significantResults.length === 0) {
      summary += ` 未发现统计显著的差异，建议继续测试或重新评估测试设计。`;
    } else {
      summary += ` 发现 ${significantResults.length} 个统计显著的对比结果，需要进一步分析。`;
    }

    return {
      text: summary,
      keyFindings: this.extractKeyFindings(analysis),
      recommendation: winnerRecommendation?.action || '继续收集数据',
      confidence: winnerRecommendation?.confidence || 'low'
    };
  },

  // Extract key findings
  extractKeyFindings: function(analysis) {
    const findings = [];
    
    // Best performing variant
    let bestVariant = null;
    let bestRate = 0;
    Object.entries(analysis.variants).forEach(([variantId, data]) => {
      if (data.conversionRate > bestRate) {
        bestRate = data.conversionRate;
        bestVariant = variantId;
      }
    });
    
    if (bestVariant) {
      findings.push(`变体 "${bestVariant}" 表现最佳，转化率为 ${(bestRate * 100).toFixed(2)}%`);
    }

    // Significant differences
    const significantComparisons = analysis.comparisons.filter(c => c.isSignificant);
    if (significantComparisons.length > 0) {
      findings.push(`发现 ${significantComparisons.length} 个统计显著的变体对比`);
    }

    // Sample size issues
    const insufficientSamples = Object.entries(analysis.variants).filter(([_, data]) => 
      data.participants < this.config.minimumSampleSize
    );
    if (insufficientSamples.length > 0) {
      findings.push(`${insufficientSamples.length} 个变体样本量不足，需要更多数据`);
    }

    return findings;
  },

  // Generate statistical summary
  generateStatisticalSummary: function(analysis) {
    const summary = {
      overallSignificance: analysis.comparisons.some(c => c.isSignificant),
      significantComparisons: analysis.comparisons.filter(c => c.isSignificant).length,
      totalComparisons: analysis.comparisons.length,
      averageEffectSize: this.calculateAverageEffectSize(analysis.comparisons),
      powerAnalysis: this.performPowerAnalysis(analysis),
      multipleTestingCorrection: this.applyMultipleTestingCorrection(analysis.comparisons)
    };

    return summary;
  },

  // Calculate average effect size
  calculateAverageEffectSize: function(comparisons) {
    if (comparisons.length === 0) return 0;
    
    const totalEffect = comparisons.reduce((sum, comp) => 
      sum + Math.abs(comp.effectSize.value), 0
    );
    
    return totalEffect / comparisons.length;
  },

  // Perform power analysis
  performPowerAnalysis: function(analysis) {
    // Simplified power analysis
    const adequateSamples = Object.values(analysis.variants).filter(v => 
      v.participants >= this.config.minimumSampleSize
    ).length;
    
    const totalVariants = Object.keys(analysis.variants).length;
    const powerScore = (adequateSamples / totalVariants) * 100;
    
    return {
      score: powerScore,
      adequateVariants: adequateSamples,
      totalVariants: totalVariants,
      recommendation: powerScore < 80 ? 'increase_sample_size' : 'sufficient_power'
    };
  },

  // Apply multiple testing correction (Bonferroni)
  applyMultipleTestingCorrection: function(comparisons) {
    const correctedAlpha = this.config.significanceThreshold / comparisons.length;
    
    const correctedResults = comparisons.map(comp => ({
      ...comp,
      correctedPValue: comp.pValue,
      correctedSignificant: comp.pValue < correctedAlpha,
      correctedAlpha: correctedAlpha
    }));

    return {
      originalSignificant: comparisons.filter(c => c.isSignificant).length,
      correctedSignificant: correctedResults.filter(c => c.correctedSignificant).length,
      correctedAlpha: correctedAlpha,
      results: correctedResults
    };
  },

  // Calculate business impact
  calculateBusinessImpact: function(analysis) {
    // This would be customized based on business metrics
    const bestVariant = this.findBestVariant(analysis);
    if (!bestVariant) {
      return { impact: 'none', details: '无明确获胜变体' };
    }

    const improvement = this.calculateImprovement(analysis, bestVariant.id);
    
    return {
      winningVariant: bestVariant.id,
      conversionImprovement: improvement.relative,
      absoluteImprovement: improvement.absolute,
      projectedImpact: this.projectBusinessImpact(improvement),
      confidence: bestVariant.confidence
    };
  },

  // Find best performing variant
  findBestVariant: function(analysis) {
    let bestVariant = null;
    let bestRate = 0;
    
    Object.entries(analysis.variants).forEach(([variantId, data]) => {
      if (data.conversionRate > bestRate && data.participants >= this.config.minimumSampleSize) {
        bestRate = data.conversionRate;
        bestVariant = { id: variantId, rate: bestRate, confidence: 'medium' };
      }
    });

    // Check if this variant has significant wins
    const significantWins = analysis.comparisons.filter(c => 
      c.isSignificant && (
        (c.winner.result === 'variant_a_wins' && c.variantA === bestVariant?.id) ||
        (c.winner.result === 'variant_b_wins' && c.variantB === bestVariant?.id)
      )
    );

    if (bestVariant && significantWins.length > 0) {
      bestVariant.confidence = 'high';
    }

    return bestVariant;
  },

  // Calculate improvement metrics
  calculateImprovement: function(analysis, winningVariantId) {
    const winningVariant = analysis.variants[winningVariantId];
    
    // Compare against control (first variant) or average
    const controlVariant = Object.values(analysis.variants)[0];
    const baselineRate = controlVariant.conversionRate;
    
    const absoluteImprovement = winningVariant.conversionRate - baselineRate;
    const relativeImprovement = baselineRate > 0 ? 
      (absoluteImprovement / baselineRate) * 100 : 0;

    return {
      absolute: absoluteImprovement,
      relative: relativeImprovement,
      baseline: baselineRate,
      winning: winningVariant.conversionRate
    };
  },

  // Project business impact
  projectBusinessImpact: function(improvement) {
    // This would be customized based on business model
    const monthlyVisitors = 10000; // Example assumption
    const additionalConversions = monthlyVisitors * improvement.absolute;
    
    return {
      additionalConversionsPerMonth: Math.round(additionalConversions),
      relativeImprovement: `${improvement.relative.toFixed(1)}%`,
      description: `预计每月增加 ${Math.round(additionalConversions)} 个转化`
    };
  },

  // Generate next steps
  generateNextSteps: function(analysis) {
    const steps = [];
    
    const winnerRecommendation = analysis.recommendations.find(r => r.type === 'winner_found');
    if (winnerRecommendation) {
      steps.push({
        priority: 1,
        action: '实施获胜变体',
        description: winnerRecommendation.action,
        timeline: '立即执行'
      });
    } else {
      steps.push({
        priority: 1,
        action: '继续测试',
        description: '收集更多数据以达到统计显著性',
        timeline: '继续 1-2 周'
      });
    }

    // Add monitoring step
    steps.push({
      priority: 2,
      action: '监控实施效果',
      description: '跟踪实施后的实际业务指标变化',
      timeline: '实施后 2-4 周'
    });

    // Add learning documentation
    steps.push({
      priority: 3,
      action: '记录学习成果',
      description: '文档化测试结果和洞察，为未来测试提供参考',
      timeline: '测试结束后 1 周内'
    });

    return steps;
  },

  // Get methodology notes
  getMethodologyNotes: function() {
    return {
      statisticalMethod: '双样本比例 Z 检验',
      confidenceLevel: `${this.config.confidenceLevel * 100}%`,
      significanceThreshold: this.config.significanceThreshold,
      minimumSampleSize: this.config.minimumSampleSize,
      multipleTestingCorrection: 'Bonferroni 校正',
      bayesianAnalysis: '包含贝叶斯概率分析'
    };
  },

  // Get test limitations
  getTestLimitations: function(analysis) {
    const limitations = [];
    
    if (analysis.validity.issues.length > 0) {
      limitations.push('测试有效性问题: ' + analysis.validity.issues.join(', '));
    }
    
    if (analysis.validity.warnings.length > 0) {
      limitations.push('测试警告: ' + analysis.validity.warnings.join(', '));
    }
    
    const testDuration = this.getTestDuration(analysis.testId);
    if (testDuration < this.config.minimumTestDuration) {
      limitations.push('测试持续时间可能不足以捕获所有变化');
    }
    
    limitations.push('结果基于当前用户群体，可能不适用于所有用户段');
    limitations.push('外部因素（季节性、营销活动等）可能影响结果');
    
    return limitations;
  },

  // Get raw data summary
  getRawDataSummary: function(testId) {
    const rawData = window.ABTesting.getStoredTestData(testId);
    if (!rawData) return null;
    
    const summary = {
      totalEvents: 0,
      eventsByType: {},
      dataQuality: 'good'
    };
    
    Object.values(rawData.variants || {}).forEach(variant => {
      summary.totalEvents += variant.participants.length + 
                             variant.conversions.length + 
                             variant.interactions.length;
      
      // Count event types
      variant.conversions.forEach(conv => {
        const type = conv.conversion_type;
        summary.eventsByType[type] = (summary.eventsByType[type] || 0) + 1;
      });
    });
    
    return summary;
  },

  // Export analysis results
  exportAnalysis: function(testId, format = 'json') {
    const analysis = this.analyzeTest(testId);
    const report = this.generateComprehensiveReport(testId);
    
    const exportData = {
      analysis: analysis,
      report: report,
      exportedAt: new Date().toISOString(),
      format: format
    };
    
    if (format === 'csv') {
      return this.convertAnalysisToCSV(exportData);
    }
    
    return JSON.stringify(exportData, null, 2);
  },

  // Convert analysis to CSV
  convertAnalysisToCSV: function(data) {
    const headers = [
      'variant_id', 'participants', 'conversions', 'conversion_rate',
      'confidence_lower', 'confidence_upper', 'performance_rating'
    ];
    
    let csv = headers.join(',') + '\n';
    
    Object.entries(data.analysis.variants).forEach(([variantId, variantData]) => {
      csv += [
        variantId,
        variantData.participants,
        variantData.conversions,
        variantData.conversionRate.toFixed(4),
        variantData.confidenceInterval.lower.toFixed(4),
        variantData.confidenceInterval.upper.toFixed(4),
        variantData.performance.rating
      ].join(',') + '\n';
    });
    
    return csv;
  }
};

// Export for global use
window.ABTestAnalytics = ABTestAnalytics;