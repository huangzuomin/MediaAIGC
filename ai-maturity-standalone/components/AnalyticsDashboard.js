// Analytics Dashboard Component for monitoring and analysis
const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [refreshInterval, setRefreshInterval] = React.useState(null);

  // Load analytics data
  const loadAnalyticsData = React.useCallback(() => {
    try {
      const insights = Storage.getAnalyticsInsights();
      const report = Analytics.getAnalyticsReport();
      
      setAnalyticsData({
        insights,
        report,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }, []);

  // Initialize dashboard
  React.useEffect(() => {
    // Check if dashboard should be visible (admin mode)
    const urlParams = new URLSearchParams(window.location.search);
    const showDashboard = urlParams.get('analytics') === 'true' || 
                         localStorage.getItem('show_analytics_dashboard') === 'true';
    
    setIsVisible(showDashboard);
    
    if (showDashboard) {
      loadAnalyticsData();
      
      // Set up auto-refresh
      const interval = setInterval(loadAnalyticsData, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [loadAnalyticsData]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Export analytics data
  const handleExportData = () => {
    try {
      const exportData = Analytics.exportAnalyticsData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
    }
  };

  // Clear analytics data
  const handleClearData = () => {
    if (confirm('确定要清除所有分析数据吗？此操作不可撤销。')) {
      Analytics.clearAnalyticsData();
      Storage.clearAnalyticsData();
      loadAnalyticsData();
    }
  };

  // Sync offline events
  const handleSyncOffline = () => {
    Analytics.syncOfflineEvents();
    setTimeout(loadAnalyticsData, 1000); // Refresh after sync
  };

  if (!isVisible || !analyticsData) {
    return null;
  }

  const { insights, report } = analyticsData;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Dashboard Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors mb-2"
        title="Analytics Dashboard"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Dashboard Panel */}
      <div className="bg-white rounded-lg shadow-2xl w-96 max-h-96 overflow-hidden border">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Analytics Dashboard</h3>
          <div className="flex space-x-2">
            <button
              onClick={loadAnalyticsData}
              className="text-gray-500 hover:text-gray-700"
              title="Refresh"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['overview', 'funnel', 'conversions', 'storage'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 px-3 py-2 text-sm font-medium capitalize ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 max-h-64 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {insights.overview.totalEvents}
                  </div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {insights.overview.totalConversions}
                  </div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-lg font-semibold text-yellow-600">
                  {insights.overview.syncRate}%
                </div>
                <div className="text-sm text-gray-600">
                  Sync Rate ({insights.overview.unsyncedEvents} pending)
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Session: {report.session.sessionId?.slice(-8)}
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div className="space-y-2">
              {Object.entries(insights.funnel).map(([step, data]) => (
                <div key={step} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600 capitalize">
                    {step.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{data.count}</div>
                    <div className="text-xs text-gray-500">{data.conversionRate}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'conversions' && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">By Action</div>
              {Object.entries(insights.conversions.byAction || {}).map(([action, count]) => (
                <div key={action} className="flex justify-between">
                  <span className="text-sm text-gray-600">{action}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
              
              <div className="text-sm font-semibold mt-3">Peak Hours</div>
              {Object.entries(insights.conversions.byHour || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([hour, count]) => (
                <div key={hour} className="flex justify-between">
                  <span className="text-sm text-gray-600">{hour}:00</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-semibold mb-2">Storage Usage</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(insights.storage.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {insights.storage.usedFormatted} / {insights.storage.totalFormatted}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Events: {insights.timing.total}</div>
                <div>Last Hour: {insights.timing.lastHour}</div>
                <div>Last Day: {insights.timing.lastDay}</div>
                <div>Last Week: {insights.timing.lastWeek}</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t px-4 py-3 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleSyncOffline}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              title="Sync offline events"
            >
              Sync
            </button>
            <button
              onClick={handleExportData}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              title="Export data"
            >
              Export
            </button>
          </div>
          <button
            onClick={handleClearData}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
            title="Clear all data"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

// Export component
window.AnalyticsDashboard = AnalyticsDashboard;