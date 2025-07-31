function ContactSection() {
  try {
    const [formData, setFormData] = React.useState({
      company: '',
      name: '',
      position: '',
      phone: '',
      email: '',
      interests: [],
      challenges: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const serviceOptions = [
      '战略与诊断咨询',
      '能力建设与人才赋能',
      '流程再造与智能应用',
      '平台构建与数据资产化'
    ];

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // 清除对应字段的错误信息
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const handleCheckboxChange = (service) => {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.includes(service)
          ? prev.interests.filter(item => item !== service)
          : [...prev.interests, service]
      }));
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.company.trim()) {
        newErrors.company = '请输入媒体名称';
      }

      if (!formData.name.trim()) {
        newErrors.name = '请输入您的姓名';
      }

      if (!formData.position.trim()) {
        newErrors.position = '请输入您的职位';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = '请输入联系电话';
      } else {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
          newErrors.phone = '请输入正确的手机号码';
        }
      }

      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = '请输入正确的邮箱地址';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // 准备提交到Formspree的数据
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('company', formData.company);
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('position', formData.position);
        formDataToSubmit.append('phone', formData.phone);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('interests', formData.interests.join(', '));
        formDataToSubmit.append('challenges', formData.challenges);

        // 添加额外的元数据
        formDataToSubmit.append('_subject', `新的咨询需求 - ${formData.company} (${formData.name})`);
        formDataToSubmit.append('_replyto', formData.email);

        // 提交到Formspree
        const response = await fetch('https://formspree.io/f/xeozzpko', {
          method: 'POST',
          body: formDataToSubmit,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // 设置提交成功状态
          setIsSubmitted(true);

          // 重置表单
          setFormData({
            company: '',
            name: '',
            position: '',
            phone: '',
            email: '',
            interests: [],
            challenges: ''
          });

          // 3秒后重置成功状态
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        } else {
          throw new Error('表单提交失败');
        }

      } catch (error) {
        console.error('表单提交错误:', error);
        alert('提交失败，请稍后重试或直接联系我们的客服热线：138-0000-0000');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <section
        id="contact"
        className="py-20 bg-[var(--bg-light)]"
        data-name="contact-section"
        data-file="components/ContactSection.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary-color)] mb-6">
              准备好开启您媒体的AI变革之旅了吗？
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              联系我们的首席AI转型顾问，预约一次一对一的战略对话，共同探讨您的无限可能
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* 联系表单 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[var(--primary-color)] mb-6">
                预约战略对话
              </h3>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">提交成功！</h4>
                  <p className="text-gray-600 mb-4">
                    感谢您的咨询需求！我们的首席顾问将在24小时内与您联系。
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[var(--primary-color)] hover:underline text-sm"
                  >
                    提交新的咨询
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        媒体名称 *
                      </label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${errors.company ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.company && (
                        <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        您的姓名 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      职位 *
                    </label>
                    <input
                      type="text"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${errors.position ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.position && (
                      <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话 *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="请输入11位手机号码"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@company.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      您最感兴趣的服务领域 (可多选)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <label key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(service)}
                            onChange={() => handleCheckboxChange(service)}
                            className="mr-2 text-[var(--primary-color)]"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      您面临的主要挑战 (选填)
                    </label>
                    <textarea
                      name="challenges"
                      rows="4"
                      value={formData.challenges}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      placeholder="请简要描述您在AI转型过程中遇到的困难或期望解决的问题"
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 mb-2 ${isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'btn-primary hover:shadow-lg hover:scale-105'
                        }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          提交中...
                        </span>
                      ) : (
                        '立即预约，获取专属方案'
                      )}
                    </button>
                    <p className="text-xs text-gray-500">我们承诺保护您的全部信息</p>
                  </div>
                </form>
              )}
            </div>

            {/* 直接联系方式 */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-semibold text-[var(--primary-color)] mb-4">
                  直接联系我们
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="icon-phone text-[var(--primary-color)] mr-3"></div>
                    <div>
                      <p className="font-medium">首席顾问专线</p>
                      <p className="text-gray-600">156-5865-8728 (黄先生)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="icon-mail text-[var(--primary-color)] mr-3"></div>
                    <div>
                      <p className="font-medium">联系邮箱</p>
                      <p className="text-gray-600">huangzuomin@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="icon-map-pin text-[var(--primary-color)] mr-3 mt-1"></div>
                    <div>
                      <p className="font-medium">地址</p>
                      <p className="text-gray-600">浙江省温州市鹿城区<br />公园路温州日报大厦 </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-[var(--border-light)] rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-3 text-[var(--primary-color)]">
                  与我们对话，您将获得
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--success-color)] mr-3 mt-0.5"></div>
                    <div>
                      <span className="font-medium text-[var(--primary-color)]">一份为您量身定制的《AI转型初步诊断报告》</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--success-color)] mr-3 mt-0.5"></div>
                    <div>
                      <span className="font-medium text-[var(--primary-color)]">与一线AI转型专家的1小时深度战略沟通</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--success-color)] mr-3 mt-0.5"></div>
                    <div>
                      <span className="font-medium text-[var(--primary-color)]">获取我们最新的《媒体AI转型实践白皮书》</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="icon-check text-[var(--success-color)] mr-3 mt-0.5"></div>
                    <div>
                      <span className="font-medium text-[var(--primary-color)]">对标行业头部案例，明确自身发展路径</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('ContactSection component error:', error);
    return null;
  }
}