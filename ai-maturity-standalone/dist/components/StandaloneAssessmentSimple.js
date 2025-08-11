// Simplified Standalone AI Maturity Assessment Component
function StandaloneAssessment() {
  // Core state management
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId] = React.useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
  
  // Enhanced state for better UX
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [startTime] = React.useState(Date.now());

  // Questions data
  const questions = [
    {
      id: 'tech_awareness',
      dimension: '技术与工具',
      question: '您的机构目前对AI技术的认知和应用情况是？',
      options: [
        { value: 1, text: '仅在讨论概念，关注新闻报道', level: 'L1' },
        { value: 2, text: '员工自发使用ChatGPT等公网工具', level: 'L2' },
        { value: 3, text: '采购了专门的AI工具用于特定业务', level: 'L3' },
        { value: 4, text: '建设了统一的AI中台或平台', level: 'L4' },
        { value: 5, text: 'AI能力可灵活编排并对外提供服务', level: 'L5' }
      ]
    },
    {
      id: 'data_management',
      dimension: '数据与资产',
      question: '您的机构在数据管理和资产化方面的现状是？',
      options: [
        { value: 1, text: '数据孤岛严重，资产未被有效管理', level: 'L1' },
        { value: 2, text: '个人处理少量数据，缺乏统一管理', level: 'L2' },
        { value: 3, text: '特定业务线的数据已打通整合', level: 'L3' },
        { value: 4, text: '构建了私有化"媒体大脑"知识库', level: 'L4' },
        { value: 5, text: '数据已开发为可售卖的产品和洞察报告', level: 'L5' }
      ]
    },
    {
      id: 'workflow_integration',
      dimension: '流程与工作',
      question: 'AI与您机构核心工作流程的融合程度如何？',
      options: [
        { value: 1, text: '现有流程完全没有AI的影响', level: 'L1' },
        { value: 2, text: '仅辅助个人任务（文案、资料搜集等）', level: 'L2' },
        { value: 3, text: '嵌入标准化工作流（AI审校、视频生成等）', level: 'L3' },
        { value: 4, text: 'AI驱动核心流程自动化（选题、分发等）', level: 'L4' },
        { value: 5, text: '孵化全新智能业务（AI交互内容、社群运营）', level: 'L5' }
      ]
    },
    {
      id: 'team_capability',
      dimension: '人才与组织',
      question: '您的团队在AI能力建设方面处于什么阶段？',
      options: [
        { value: 1, text: '仅少数高层或技术人员关注AI', level: 'L1' },
        { value: 2, text: '少数"极客"员工自发探索学习', level: 'L2' },
        { value: 3, text: '开展了部门级专项技能培训', level: 'L3' },
        { value: 4, text: '设立AI专岗，建立体系化培训考核', level: 'L4' },
        { value: 5, text: 'AI驱动创新成为组织文化本能', level: 'L5' }
      ]
    },
    {
      id: 'strategy_value',
      dimension: '战略与价值',
      question: 'AI在您机构的战略定位和价值衡量如何？',
      options: [
        { value: 1, text: '停留在战略口号或规划文本', level: 'L1' },
        { value: 2, text: '无ROI衡量，主要靠个人兴趣驱动', level: 'L2' },
        { value: 3, text: '衡量特定流程的效率提升（时长、成本）', level: 'L3' },
        { value: 4, text: '纳入组织级KPI/OKR，衡量整体效能', level: 'L4' },
        { value: 5, text: '开辟了基于AI的第二、第三营收曲线', level: 'L5' }
      ]
    },
    {
      id: 'content_production',
      dimension: '内容生产',
      question: 'AI在您的内容生产环节发挥什么作用？',
      options: [
        { value: 1, text: '完全没有使用AI辅助内容生产', level: 'L1' },
        { value: 2, text: '偶尔用AI生成文案或图片素材', level: 'L2' },
        { value: 3, text: 'AI已成为日常内容生产的标准工具', level: 'L3' },
        { value: 4, text: 'AI驱动的内容生产流水线已建立', level: 'L4' },
        { value: 5, text: 'AI创造了全新的内容形态和互动方式', level: 'L5' }
      ]
    },
    {
      id: 'audience_engagement',
      dimension: '用户互动',
      question: '在用户互动和服务方面，AI的应用情况如何？',
      options: [
        { value: 1, text: '用户互动完全依靠人工处理', level: 'L1' },
        { value: 2, text: '使用简单的自动回复或客服机器人', level: 'L2' },
        { value: 3, text: 'AI辅助用户画像分析和精准推送', level: 'L3' },
        { value: 4, text: '智能化用户服务和个性化内容推荐', level: 'L4' },
        { value: 5, text: 'AI驱动的社群运营和价值服务生态', level: 'L5' }
      ]
    },
    {
      id: 'decision_making',
      dimension: '决策支持',
      question: 'AI在您的编辑决策和运营决策中起什么作用？',
      options: [
        { value: 1, text: '决策完全基于经验和直觉', level: 'L1' },
        { value: 2, text: '偶尔参考AI提供的数据分析', level: 'L2' },
        { value: 3, text: 'AI数据分析已成为决策的重要依据', level: 'L3' },
        { value: 4, text: 'AI提供实时决策支持和预测分析', level: 'L4' },
        { value: 5, text: 'AI驱动的智能决策系统已全面应用', level: 'L5' }
      ]
    },
    {
      id: 'resource_investment',
      dimension: '资源投入',
      question: '您的机构在AI转型方面的资源投入情况？',
      options: [
        { value: 1, text: '没有专门的AI转型预算', level: 'L1' },
        { value: 2, text: '少量预算用于购买AI工具订阅', level: 'L2' },
        { value: 3, text: '有专项预算用于AI能力建设', level: 'L3' },
        { value: 4, text: 'AI转型是机构重点投资方向', level: 'L4' },
        { value: 5, text: 'AI投入已产生显著的商业回报', level: 'L5' }
      ]
    },
    {
      id: 'future_planning',
      dimension: '未来规划',
      question: '对于AI转型的未来规划，您的机构处于什么状态？',
      options: [
        { value: 1, text: '还在观望，没有明确的转型计划', level: 'L1' },
        { value: 2, text: '有初步想法，但缺乏具体行动方案', level: 'L2' },
        { value: 3, text: '制定了明确的AI转型路线图', level: 'L3' },
        { value: 4, text: '正在系统性推进AI转型战略', level: 'L4' },
        { value: 5, text: '已成为行业AI转型的标杆和引领者', level: 'L5' }
      ]
    }
  ];

  // Initialize session tracking
  React.useEffect(() => {
    console.log('Initializing StandaloneAssessment...');
    
    // Track assessment start
    console.log('Assessment started:', sessionId);
  }, [sessionId]);

  const handleAnswer = (questionId, value) => {
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    
    setAnswers(newAnswers);
    console.log('Answer recorded:', questionId, value);
  };

  const nextQuestion = () => {
    if (isTransitioning) return;
    
    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      const newQuestionIndex = currentQuestion + 1;
      
      setTimeout(() => {
        setCurrentQuestion(newQuestionIndex);
        setIsTransitioning(false);
      }, 150);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (isTransitioning || currentQuestion === 0) return;
    
    setIsTransitioning(true);
    const newQuestionIndex = currentQuestion - 1;
    
    setTimeout(() => {
      setCurrentQuestion(newQuestionIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const calculateResult = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simple calculation
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const averageScore = totalScore / Object.keys(answers).length;
      
      let level, levelName, description;
      
      if (averageScore <= 1.5) {
        level = 'L1';
        levelName = '观察与感知阶段';
        description = '您的机构目前处于AI认知的初期阶段，对AI有一定了解但尚未开始实质性应用。';
      } else if (averageScore <= 2.5) {
        level = 'L2';
        levelName = '工具化应用阶段';
        description = '您的机构已经开始零散地使用AI工具，员工有了初步的实践经验。';
      } else if (averageScore <= 3.5) {
        level = 'L3';
        levelName = '流程化融合阶段';
        description = '恭喜！您的机构已经将AI有机融入到具体业务流程中，形成了标准化的人机协作模式。';
      } else if (averageScore <= 4.5) {
        level = 'L4';
        levelName = '平台化驱动阶段';
        description = '优秀！您的机构已经建立了系统性的AI能力，实现了组织级的效率变革。';
      } else {
        level = 'L5';
        levelName = '生态化创新阶段';
        description = '卓越！您的机构已经达到了AI应用的最高水平，AI成为了驱动业务创新和生态构建的核心引擎。';
      }

      const finalResult = {
        level,
        levelName,
        score: averageScore.toFixed(1),
        description,
        recommendations: [
          '继续加强AI技术学习和应用',
          '建立系统性的AI转型规划',
          '培养专业的AI人才队伍',
          '探索AI在业务中的深度应用'
        ],
        answers,
        completedAt: new Date().toISOString(),
        sessionId
      };

      setResult(finalResult);
      setShowResult(true);
      setIsLoading(false);

      console.log('Assessment completed:', finalResult);
    }, 1500);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setIsLoading(false);
    console.log('Assessment restarted');
  };

  const handleConsultation = () => {
    console.log('Consultation requested');
    const mainSiteUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
      ? '../index.html#contact' 
      : '/#contact';
    window.open(mainSiteUrl, '_blank');
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked');
    const mainSiteUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
      ? '../index.html' 
      : '/';
    window.open(mainSiteUrl, '_blank');
  };

  // Get assessment progress
  const getProgressStats = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    return {
      totalQuestions,
      answeredQuestions,
      currentQuestion: currentQuestion + 1,
      progressPercentage
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
            正在分析您的AI成熟度
          </h2>
          <p className="text-gray-600">
            请稍候，我们正在为您生成个性化的评估报告...
          </p>
        </div>
      </div>
    );
  }

  // Result display
  if (showResult && result) {
    const progressStats = getProgressStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Result Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{result.level}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-4">
                {result.levelName}
              </h1>
              
              <div className="text-6xl font-bold text-[var(--accent-color)] mb-2">
                {result.score}
              </div>
              <div className="text-lg text-gray-600 mb-6">综合评分</div>
              
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {result.description}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-6">
                专业建议
              </h2>
              
              <div className="space-y-4">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[var(--primary-color)]">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-[var(--primary-color)] to-blue-700 rounded-2xl shadow-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">
                获取专业AI转型指导
              </h2>
              <p className="text-lg mb-8 opacity-90">
                基于您的评估结果，我们的专家团队可以为您提供个性化的AI转型方案
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleConsultation}
                  className="bg-[var(--accent-color)] text-[var(--primary-color)] px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-colors"
                >
                  预约专家咨询
                </button>
                
                <button
                  onClick={handleLearnMore}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[var(--primary-color)] transition-colors"
                >
                  了解更多服务
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                <button
                  onClick={restartAssessment}
                  className="text-white hover:text-[var(--accent-color)] transition-colors"
                >
                  重新测评
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question display
  const currentQ = questions[currentQuestion];
  const progressStats = getProgressStats();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                问题 {progressStats.currentQuestion} / {progressStats.totalQuestions}
              </span>
              <span className="text-sm font-medium text-[var(--primary-color)]">
                {progressStats.progressPercentage.toFixed(0)}% 完成
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressStats.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isTransitioning ? 'opacity-70 transform translate-x-2' : ''}`}>
            <div className="mb-6">
              <span className="inline-block bg-[var(--accent-color)] text-[var(--primary-color)] px-3 py-1 rounded-full text-sm font-medium mb-4">
                {currentQ.dimension}
              </span>
              
              <h2 className="text-2xl font-bold text-[var(--primary-color)] leading-tight">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={option.value}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[var(--primary-color)] hover:shadow-md ${
                    answers[currentQ.id] === option.value
                      ? 'border-[var(--primary-color)] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={currentQ.id}
                        value={option.value}
                        checked={answers[currentQ.id] === option.value}
                        onChange={() => handleAnswer(currentQ.id, option.value)}
                        className="w-4 h-4 text-[var(--primary-color)]"
                      />
                      <span className="text-gray-800 leading-relaxed">
                        {option.text}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[var(--accent-color)] bg-yellow-100 px-2 py-1 rounded">
                      {option.level}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-medium hover:bg-[var(--primary-color)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>上一题</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id]}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {currentQuestion === questions.length - 1 ? '查看结果' : '下一题'}
              </span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export for global use
window.StandaloneAssessment = StandaloneAssessment;