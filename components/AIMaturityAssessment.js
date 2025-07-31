function AIMaturityAssessment({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(null);

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

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const scores = Object.values(answers);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    let level, levelName, description, recommendations;
    
    if (avgScore <= 1.5) {
      level = 'L1';
      levelName = '观察与感知阶段';
      description = '您的机构目前处于AI认知的初期阶段，对AI有一定了解但尚未开始实质性应用。这是一个很好的起点，关键是要建立正确的认知并消除对AI的恐惧。';
      recommendations = [
        '组织AI认知培训，建立全员基础认知',
        '关注行业AI应用案例，学习最佳实践',
        '制定AI转型的初步规划和预算',
        '选择1-2个低风险场景进行试点'
      ];
    } else if (avgScore <= 2.5) {
      level = 'L2';
      levelName = '工具化应用阶段';
      description = '您的机构已经开始零散地使用AI工具，员工有了初步的实践经验。现在需要将这些分散的应用整合起来，形成更系统的能力。';
      recommendations = [
        '统一AI工具的选型和采购，避免重复投资',
        '开展全员AI工具使用培训',
        '建立AI应用的最佳实践分享机制',
        '选择核心业务流程进行AI改造试点'
      ];
    } else if (avgScore <= 3.5) {
      level = 'L3';
      levelName = '流程化融合阶段';
      description = '恭喜！您的机构已经将AI有机融入到具体业务流程中，形成了标准化的人机协作模式。这是一个重要的里程碑，接下来要考虑更大范围的系统性应用。';
      recommendations = [
        '扩大AI应用的业务范围，实现跨部门协同',
        '建设统一的AI能力平台或中台',
        '建立AI应用效果的量化评估体系',
        '培养专业的AI应用和管理人才'
      ];
    } else if (avgScore <= 4.5) {
      level = 'L4';
      levelName = '平台化驱动阶段';
      description = '优秀！您的机构已经建立了系统性的AI能力，实现了组织级的效率变革。现在可以考虑如何利用AI开创新的业务模式和价值创造方式。';
      recommendations = [
        '探索AI驱动的新业务模式和营收渠道',
        '建设面向外部的AI服务能力',
        '成为行业AI转型的标杆和引领者',
        '建立AI创新的持续迭代机制'
      ];
    } else {
      level = 'L5';
      levelName = '生态化创新阶段';
      description = '卓越！您的机构已经达到了AI应用的最高水平，AI成为了驱动业务创新和生态构建的核心引擎。您已经是行业的领跑者！';
      recommendations = [
        '持续引领行业AI应用的创新方向',
        '建设开放的AI生态和合作伙伴网络',
        '输出AI转型的方法论和最佳实践',
        '探索AI在媒体行业的前沿应用场景'
      ];
    }

    setResult({
      level,
      levelName,
      description,
      recommendations,
      score: avgScore.toFixed(1),
      answers
    });
    setShowResult(true);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-name="ai-maturity-result">
        <div className="fixed top-20 left-8 z-40">
          <button 
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-white shadow-lg rounded-lg text-[var(--primary-color)] hover:bg-gray-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>
        </div>

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{result.level}</span>
                </div>
                <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">测评结果</h1>
                <h2 className="text-xl text-[var(--accent-color)] font-semibold">{result.levelName}</h2>
                <p className="text-gray-600 mt-2">综合得分: {result.score}/5.0</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4">现状分析</h3>
                <p className="text-gray-700 leading-relaxed">{result.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4">建议行动方案</h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-[var(--accent-color)] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-xl p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-2">想要获得专业指导？</h3>
                <p className="mb-4">我们的AI转型专家可以为您提供更详细的诊断和定制化解决方案</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => {
                      onBack();
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="bg-[var(--accent-color)] text-[var(--primary-color)] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
                  >
                    预约专家咨询
                  </button>
                  <button 
                    onClick={restartAssessment}
                    className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[var(--primary-color)] transition-all duration-300"
                  >
                    重新测评
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-name="ai-maturity-assessment">
      <div className="fixed top-20 left-8 z-40">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-white shadow-lg rounded-lg text-[var(--primary-color)] hover:bg-gray-50 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </button>
      </div>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-[var(--primary-color)]">媒体AI成熟度5分钟自测</h1>
                <span className="text-sm text-gray-500">{currentQuestion + 1} / {questions.length}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="mb-2">
                <span className="inline-block bg-[var(--accent-color)] text-[var(--primary-color)] px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {currentQ.dimension}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    answers[currentQ.id] === option.value 
                      ? 'border-[var(--primary-color)] bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={option.value}
                    checked={answers[currentQ.id] === option.value}
                    onChange={() => handleAnswer(currentQ.id, option.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQ.id] === option.value 
                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]' 
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-800">{option.text}</span>
                      <span className="ml-2 text-xs text-[var(--accent-color)] font-medium">({option.level})</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                上一题
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQ.id]}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  !answers[currentQ.id]
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : currentQuestion === questions.length - 1
                    ? 'bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-opacity-90'
                    : 'bg-[var(--primary-color)] text-white hover:bg-opacity-90'
                }`}
              >
                {currentQuestion === questions.length - 1 ? '查看结果' : '下一题'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}