// Enhanced Assessment Calculator with Dimensional Analysis
const AssessmentCalculator = {
  // Dimension weights for more accurate scoring
  dimensionWeights: {
    'tech_awareness': 1.2,      // 技术与工具 - 高权重
    'data_management': 1.1,     // 数据与资产 - 较高权重
    'workflow_integration': 1.3, // 流程与工作 - 最高权重
    'team_capability': 1.0,     // 人才与组织 - 标准权重
    'strategy_value': 1.1,      // 战略与价值 - 较高权重
    'content_production': 1.0,  // 内容生产 - 标准权重
    'audience_engagement': 0.9, // 用户互动 - 较低权重
    'decision_making': 1.0,     // 决策支持 - 标准权重
    'resource_investment': 0.8, // 资源投入 - 较低权重
    'future_planning': 0.9      // 未来规划 - 较低权重
  },

  // Level definitions with enhanced criteria
  levelDefinitions: {
    'L1': {
      name: '观察与感知阶段',
      range: [1.0, 1.5],
      color: '#FF6B6B',
      description: '您的机构目前处于AI认知的初期阶段，对AI有一定了解但尚未开始实质性应用。这是一个很好的起点，关键是要建立正确的认知并消除对AI的恐惧。',
      characteristics: [
        'AI认知处于概念阶段',
        '缺乏系统性的AI应用',
        '主要关注新闻和趋势',
        '组织内部缺乏AI共识'
      ],
      recommendations: [
        '组织AI认知培训，建立全员基础认知',
        '关注行业AI应用案例，学习最佳实践',
        '制定AI转型的初步规划和预算',
        '选择1-2个低风险场景进行试点'
      ],
      nextSteps: [
        '建立AI学习小组',
        '参加行业AI会议和培训',
        '制定AI转型路线图',
        '寻找合适的AI工具试点'
      ]
    },
    'L2': {
      name: '工具化应用阶段',
      range: [1.5, 2.5],
      color: '#FFB800',
      description: '您的机构已经开始零散地使用AI工具，员工有了初步的实践经验。现在需要将这些分散的应用整合起来，形成更系统的能力。',
      characteristics: [
        '员工开始自发使用AI工具',
        '应用场景相对分散',
        '缺乏统一的管理和标准',
        '效果评估不够系统'
      ],
      recommendations: [
        '统一AI工具的选型和采购，避免重复投资',
        '开展全员AI工具使用培训',
        '建立AI应用的最佳实践分享机制',
        '选择核心业务流程进行AI改造试点'
      ],
      nextSteps: [
        '制定AI工具使用规范',
        '建立内部AI应用案例库',
        '设立AI应用效果评估机制',
        '推进跨部门AI协作'
      ]
    },
    'L3': {
      name: '流程化融合阶段',
      range: [2.5, 3.5],
      color: '#17A2B8',
      description: '恭喜！您的机构已经将AI有机融入到具体业务流程中，形成了标准化的人机协作模式。这是一个重要的里程碑，接下来要考虑更大范围的系统性应用。',
      characteristics: [
        'AI已融入标准业务流程',
        '形成了人机协作模式',
        '有明确的应用标准和规范',
        '开始产生可量化的效益'
      ],
      recommendations: [
        '扩大AI应用的业务范围，实现跨部门协同',
        '建设统一的AI能力平台或中台',
        '建立AI应用效果的量化评估体系',
        '培养专业的AI应用和管理人才'
      ],
      nextSteps: [
        '构建AI能力中台',
        '建立AI效果评估体系',
        '培养AI专业人才',
        '探索AI驱动的业务创新'
      ]
    },
    'L4': {
      name: '平台化驱动阶段',
      range: [3.5, 4.5],
      color: '#28A745',
      description: '优秀！您的机构已经建立了系统性的AI能力，实现了组织级的效率变革。现在可以考虑如何利用AI开创新的业务模式和价值创造方式。',
      characteristics: [
        '建立了统一的AI平台',
        '实现了组织级的效率提升',
        'AI成为核心竞争优势',
        '开始探索新的商业模式'
      ],
      recommendations: [
        '探索AI驱动的新业务模式和营收渠道',
        '建设面向外部的AI服务能力',
        '成为行业AI转型的标杆和引领者',
        '建立AI创新的持续迭代机制'
      ],
      nextSteps: [
        '开发AI驱动的新产品',
        '建立AI生态合作伙伴关系',
        '输出AI转型经验和方法论',
        '持续投入AI前沿技术研发'
      ]
    },
    'L5': {
      name: '生态化创新阶段',
      range: [4.5, 5.0],
      color: '#6F42C1',
      description: '卓越！您的机构已经达到了AI应用的最高水平，AI成为了驱动业务创新和生态构建的核心引擎。您已经是行业的领跑者！',
      characteristics: [
        'AI成为核心业务引擎',
        '构建了完整的AI生态',
        '引领行业AI发展方向',
        '实现了AI的商业化变现'
      ],
      recommendations: [
        '持续引领行业AI应用的创新方向',
        '建设开放的AI生态和合作伙伴网络',
        '输出AI转型的方法论和最佳实践',
        '探索AI在媒体行业的前沿应用场景'
      ],
      nextSteps: [
        '引领行业AI标准制定',
        '建设AI开放平台',
        '培养行业AI人才',
        '探索AGI在媒体的应用'
      ]
    }
  },

  // Calculate weighted score
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

  // Calculate dimensional scores
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
  },

  // Get level from score
  getScoreLevel: function(score) {
    for (const [level, definition] of Object.entries(this.levelDefinitions)) {
      if (score >= definition.range[0] && score <= definition.range[1]) {
        return level;
      }
    }
    return 'L1'; // Default fallback
  },

  // Get level definition
  getLevelDefinition: function(level) {
    return this.levelDefinitions[level] || this.levelDefinitions['L1'];
  },

  // Calculate comprehensive result
  calculateResult: function(answers, questions, sessionData = {}) {
    const weightedScore = this.calculateWeightedScore(answers);
    const level = this.getScoreLevel(weightedScore);
    const levelDef = this.getLevelDefinition(level);
    const dimensionalScores = this.calculateDimensionalScores(answers, questions);

    // Calculate completion metrics
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;

    // Analyze strengths and weaknesses
    const analysis = this.analyzeStrengthsWeaknesses(dimensionalScores);

    // Generate personalized recommendations
    const personalizedRecommendations = this.generatePersonalizedRecommendations(
      level, 
      dimensionalScores, 
      analysis
    );

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(answers, dimensionalScores);

    return {
      // Basic result info
      level: level,
      levelName: levelDef.name,
      score: weightedScore.toFixed(1),
      rawScore: weightedScore,
      description: levelDef.description,
      color: levelDef.color,

      // Enhanced analysis
      dimensionalScores: dimensionalScores,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      opportunities: analysis.opportunities,

      // Recommendations
      recommendations: personalizedRecommendations,
      nextSteps: levelDef.nextSteps,
      characteristics: levelDef.characteristics,

      // Metrics
      completionRate: completionRate,
      confidenceScore: confidenceScore,
      answeredQuestions: answeredQuestions,
      totalQuestions: totalQuestions,

      // Session data
      answers: answers,
      completedAt: new Date().toISOString(),
      sessionId: sessionData.sessionId,
      timeSpent: sessionData.timeSpent || 0,

      // Comparison data
      industryBenchmark: this.getIndustryBenchmark(level),
      improvementPotential: this.calculateImprovementPotential(dimensionalScores)
    };
  },

  // Analyze strengths and weaknesses
  analyzeStrengthsWeaknesses: function(dimensionalScores) {
    const scores = Object.entries(dimensionalScores).map(([dimension, data]) => ({
      dimension,
      score: data.score,
      weightedScore: data.score * data.weight
    }));

    // Sort by weighted score
    scores.sort((a, b) => b.weightedScore - a.weightedScore);

    const strengths = scores.slice(0, 3).filter(s => s.score >= 3);
    const weaknesses = scores.slice(-3).filter(s => s.score <= 2);
    
    // Identify opportunities (areas with high potential impact)
    const opportunities = scores.filter(s => 
      s.score >= 2 && s.score <= 3 && 
      this.dimensionWeights[Object.keys(dimensionalScores).find(k => 
        dimensionalScores[k].score === s.score
      )] >= 1.1
    );

    return {
      strengths: strengths.map(s => s.dimension),
      weaknesses: weaknesses.map(s => s.dimension),
      opportunities: opportunities.map(s => s.dimension)
    };
  },

  // Generate personalized recommendations
  generatePersonalizedRecommendations: function(level, dimensionalScores, analysis) {
    const baseLevelRecommendations = this.levelDefinitions[level].recommendations;
    const personalizedRecommendations = [...baseLevelRecommendations];

    // Add weakness-specific recommendations
    analysis.weaknesses.forEach(weakness => {
      const weaknessRecommendations = this.getWeaknessRecommendations(weakness);
      personalizedRecommendations.push(...weaknessRecommendations);
    });

    // Add opportunity-specific recommendations
    analysis.opportunities.forEach(opportunity => {
      const opportunityRecommendations = this.getOpportunityRecommendations(opportunity);
      personalizedRecommendations.push(...opportunityRecommendations);
    });

    // Remove duplicates and limit to top recommendations
    return [...new Set(personalizedRecommendations)].slice(0, 6);
  },

  // Get weakness-specific recommendations
  getWeaknessRecommendations: function(dimension) {
    const recommendations = {
      '技术与工具': ['加强AI技术培训和工具选型', '建立技术评估和试点机制'],
      '数据与资产': ['完善数据治理体系', '建设数据资产管理平台'],
      '流程与工作': ['梳理核心业务流程', '设计AI融入的标准化流程'],
      '人才与组织': ['制定AI人才培养计划', '建立AI学习和分享文化'],
      '战略与价值': ['明确AI转型战略目标', '建立AI价值评估体系'],
      '内容生产': ['引入AI内容生产工具', '建立AI辅助的内容工作流'],
      '用户互动': ['部署智能客服系统', '建设用户画像和推荐系统'],
      '决策支持': ['建设数据分析平台', '培养数据驱动决策文化'],
      '资源投入': ['制定AI投资规划', '建立AI项目ROI评估机制'],
      '未来规划': ['制定中长期AI发展规划', '建立AI创新实验机制']
    };

    return recommendations[dimension] || [];
  },

  // Get opportunity-specific recommendations
  getOpportunityRecommendations: function(dimension) {
    const recommendations = {
      '技术与工具': ['探索前沿AI技术应用', '建设AI技术中台'],
      '数据与资产': ['开发数据产品和服务', '建设智能数据分析平台'],
      '流程与工作': ['推进流程智能化改造', '建立AI驱动的自动化流程'],
      '人才与组织': ['建立AI专业团队', '推进组织数字化转型'],
      '战略与价值': ['探索AI商业模式创新', '建立AI价值创造体系'],
      '内容生产': ['建设智能内容生产平台', '探索AI原创内容'],
      '用户互动': ['建设智能化用户服务体系', '开发个性化内容推荐'],
      '决策支持': ['建设智能决策支持系统', '开发预测分析能力'],
      '资源投入': ['加大AI核心技术投入', '建立AI投资基金'],
      '未来规划': ['制定AI生态发展战略', '建立AI创新孵化平台']
    };

    return recommendations[dimension] || [];
  },

  // Calculate confidence score
  calculateConfidenceScore: function(answers, dimensionalScores) {
    const totalQuestions = Object.keys(this.dimensionWeights).length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = answeredQuestions / totalQuestions;

    // Calculate score variance
    const scores = Object.values(dimensionalScores).map(d => d.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    const consistency = Math.max(0, 1 - variance / 4); // Normalize variance

    // Combine completion rate and consistency
    const confidenceScore = (completionRate * 0.7 + consistency * 0.3) * 100;
    
    return Math.round(confidenceScore);
  },

  // Get industry benchmark
  getIndustryBenchmark: function(level) {
    const benchmarks = {
      'L1': { percentile: 20, description: '处于行业起步阶段' },
      'L2': { percentile: 40, description: '达到行业平均水平' },
      'L3': { percentile: 65, description: '超过行业平均水平' },
      'L4': { percentile: 85, description: '处于行业领先地位' },
      'L5': { percentile: 95, description: '行业顶尖水平' }
    };

    return benchmarks[level] || benchmarks['L1'];
  },

  // Calculate improvement potential
  calculateImprovementPotential: function(dimensionalScores) {
    const improvements = {};
    
    Object.entries(dimensionalScores).forEach(([dimension, data]) => {
      const currentScore = data.score;
      const maxScore = 5;
      const weight = data.weight;
      
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
  },

  // Generate comparison with previous results
  compareWithPrevious: function(currentResult, previousResult) {
    if (!previousResult) return null;

    const scoreDiff = currentResult.rawScore - previousResult.rawScore;
    const levelChanged = currentResult.level !== previousResult.level;
    
    const dimensionalChanges = {};
    Object.keys(currentResult.dimensionalScores).forEach(dimension => {
      const current = currentResult.dimensionalScores[dimension];
      const previous = previousResult.dimensionalScores?.[dimension];
      
      if (previous) {
        dimensionalChanges[dimension] = {
          change: current.score - previous.score,
          improved: current.score > previous.score,
          declined: current.score < previous.score
        };
      }
    });

    return {
      scoreDifference: scoreDiff.toFixed(1),
      improved: scoreDiff > 0,
      levelChanged: levelChanged,
      levelUpgraded: levelChanged && currentResult.level > previousResult.level,
      dimensionalChanges: dimensionalChanges,
      timeSpan: new Date(currentResult.completedAt) - new Date(previousResult.completedAt)
    };
  }
};

// Export for global use
window.AssessmentCalculator = AssessmentCalculator;