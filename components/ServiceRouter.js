function ServiceRouter() {
  const [currentPage, setCurrentPage] = React.useState('main');

  const showWorkshopDetail = () => setCurrentPage('workshop');
  const showProjectDetail = () => setCurrentPage('project');
  const showPartnerDetail = () => setCurrentPage('partner');
  const showStarterPackDetail = () => setCurrentPage('starterpack');
  const showAssessment = () => setCurrentPage('assessment');
  const showMainPage = () => setCurrentPage('main');

  // 根据当前页面状态渲染不同内容
  if (currentPage === 'workshop') {
    return <WorkshopDetailPage onBack={showMainPage} />;
  }
  
  if (currentPage === 'project') {
    return <ProjectDetailPage onBack={showMainPage} />;
  }
  
  if (currentPage === 'partner') {
    return <PartnerDetailPage onBack={showMainPage} />;
  }
  
  if (currentPage === 'starterpack') {
    return <StarterPackDetailPage onBack={showMainPage} />;
  }
  
  if (currentPage === 'assessment') {
    return <AIMaturityAssessment onBack={showMainPage} />;
  }

  // 默认显示主页面
  return (
    <div data-name="service-router" data-file="components/ServiceRouter.js">
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <SectionDivider />
      <FrameworkSection onAssessmentClick={showAssessment} />
      <SectionDivider />
      <ServiceMatrix />
      <SectionDivider />
      <ServiceDetails />
      <SectionDivider />
      {/* 暂时隐藏团队模块 */}
      {/* <TeamSection /> */}
      {/* <SectionDivider /> */}
      <CollaborationSection 
        onWorkshopClick={showWorkshopDetail}
        onProjectClick={showProjectDetail}
        onPartnerClick={showPartnerDetail}
        onStarterPackClick={showStarterPackDetail}
      />
      <SectionDivider />
      {/* 暂时隐藏洞察与观点模块 */}
      {/* <InsightsSection /> */}
      {/* <SectionDivider /> */}
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  );
}