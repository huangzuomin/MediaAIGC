// Privacy Compliance Verification Script
const PrivacyVerification = {
  // Run all privacy compliance tests
  runAllTests: function() {
    console.log('🔒 开始隐私合规验证...\n');
    
    const results = {
      encryption: this.testEncryption(),
      storage: this.testStorageCompliance(),
      consent: this.testConsentManagement(),
      userRights: this.testUserRights(),
      dataRetention: this.testDataRetention(),
      transparency: this.testTransparency()
    };
    
    this.generateReport(results);
    return results;
  },

  // Test data encryption functionality
  testEncryption: function() {
    console.log('📊 测试数据加密...');
    
    try {
      if (!window.Storage) {
        return { passed: false, error: 'Storage system not available' };
      }

      const testData = {
        sessionId: 'test-session-' + Date.now(),
        answers: { q1: 3, q2: 4, q3: 2 },
        timestamp: Date.now()
      };

      // Test encryption/decryption
      const encrypted = window.Storage.encrypt(testData);
      const decrypted = window.Storage.decrypt(encrypted);

      const encryptionWorks = JSON.stringify(testData) === JSON.stringify(decrypted);
      
      // Test key generation
      const key1 = window.Storage.getEncryptionKey();
      const key2 = window.Storage.getEncryptionKey();
      const keyConsistent = key1 === key2;

      const passed = encryptionWorks && keyConsistent;
      
      console.log(`   ✅ 加密/解密: ${encryptionWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 密钥一致性: ${keyConsistent ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          encryptionWorks,
          keyConsistent,
          encryptedLength: encrypted.length,
          keyLength: key1.length
        }
      };
    } catch (e) {
      console.log(`   ❌ 加密测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Test storage compliance
  testStorageCompliance: function() {
    console.log('💾 测试存储合规性...');
    
    try {
      if (!window.Storage) {
        return { passed: false, error: 'Storage system not available' };
      }

      // Test encrypted storage
      const testSession = {
        sessionId: 'compliance-test-' + Date.now(),
        startTime: new Date().toISOString(),
        currentQuestion: 1,
        answers: { q1: 3 }
      };

      const saved = window.Storage.saveSession(testSession);
      const retrieved = window.Storage.getSession();
      
      const storageWorks = saved && retrieved && retrieved.sessionId === testSession.sessionId;
      
      // Test storage info
      const storageInfo = window.Storage.getStorageInfo();
      const hasStorageInfo = storageInfo && typeof storageInfo.used === 'number';
      
      // Test data summary
      const dataSummary = window.Storage.getDataSummary();
      const hasSummary = dataSummary && dataSummary.dataTypes;

      const passed = storageWorks && hasStorageInfo && hasSummary;
      
      console.log(`   ✅ 加密存储: ${storageWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 存储信息: ${hasStorageInfo ? '通过' : '失败'}`);
      console.log(`   ✅ 数据概览: ${hasSummary ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          storageWorks,
          hasStorageInfo,
          hasSummary,
          storageUsed: storageInfo?.usedFormatted || 'unknown'
        }
      };
    } catch (e) {
      console.log(`   ❌ 存储测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Test consent management
  testConsentManagement: function() {
    console.log('✋ 测试同意管理...');
    
    try {
      if (!window.Privacy || !window.Storage) {
        return { passed: false, error: 'Privacy or Storage system not available' };
      }

      // Test consent validation
      const storageConsent = window.Privacy.validateConsent('storage');
      const analyticsConsent = window.Privacy.validateConsent('analytics');
      const sharingConsent = window.Privacy.validateConsent('sharing');
      
      // Test consent status
      const consentStatus = window.Storage.getConsentStatus();
      const hasConsentStatus = consentStatus && typeof consentStatus.storage === 'boolean';
      
      // Test consent update
      const testConsent = {
        storage: true,
        analytics: false,
        sharing: false
      };
      
      const consentUpdated = window.Storage.updateConsent(testConsent);
      
      // Test consent validity check
      const consentValid = window.Privacy.isConsentValid();

      const passed = hasConsentStatus && consentUpdated && typeof consentValid === 'boolean';
      
      console.log(`   ✅ 同意验证: ${typeof storageConsent === 'boolean' ? '通过' : '失败'}`);
      console.log(`   ✅ 同意状态: ${hasConsentStatus ? '通过' : '失败'}`);
      console.log(`   ✅ 同意更新: ${consentUpdated ? '通过' : '失败'}`);
      console.log(`   ✅ 同意有效性: ${typeof consentValid === 'boolean' ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          storageConsent,
          analyticsConsent,
          sharingConsent,
          hasConsentStatus,
          consentUpdated,
          consentValid
        }
      };
    } catch (e) {
      console.log(`   ❌ 同意管理测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Test user rights implementation
  testUserRights: function() {
    console.log('👤 测试用户权利...');
    
    try {
      if (!window.Privacy) {
        return { passed: false, error: 'Privacy system not available' };
      }

      // Test access request
      const accessData = window.Privacy.handleAccessRequest();
      const accessWorks = accessData && (accessData.success || accessData.error);
      
      // Test portability request
      const portableData = window.Privacy.handlePortabilityRequest();
      const portabilityWorks = typeof portableData === 'string' || portableData === null;
      
      // Test rectification
      const rectificationWorks = window.Privacy.handleRectificationRequest('preferences', { test: true });
      
      // Test user rights info
      const userRights = window.Privacy.getUserRights();
      const hasUserRights = userRights && userRights.access && userRights.erasure;

      const passed = accessWorks && portabilityWorks && hasUserRights;
      
      console.log(`   ✅ 数据访问: ${accessWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 数据可携带性: ${portabilityWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 数据更正: ${rectificationWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 用户权利信息: ${hasUserRights ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          accessWorks,
          portabilityWorks,
          rectificationWorks,
          hasUserRights,
          rightsCount: Object.keys(userRights || {}).length
        }
      };
    } catch (e) {
      console.log(`   ❌ 用户权利测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Test data retention compliance
  testDataRetention: function() {
    console.log('🗓️ 测试数据保留...');
    
    try {
      if (!window.Privacy || !window.Storage) {
        return { passed: false, error: 'Privacy or Storage system not available' };
      }

      // Test retention check
      const retentionCompliant = window.Privacy.checkDataRetention();
      
      // Test cleanup function
      const cleanupWorks = typeof window.Storage.cleanupExpiredData === 'function';
      
      // Test data summary includes retention info
      const dataSummary = window.Storage.getDataSummary();
      const hasRetentionInfo = dataSummary && dataSummary.retention;

      const passed = retentionCompliant && cleanupWorks && hasRetentionInfo;
      
      console.log(`   ✅ 保留合规性: ${retentionCompliant ? '通过' : '失败'}`);
      console.log(`   ✅ 清理功能: ${cleanupWorks ? '通过' : '失败'}`);
      console.log(`   ✅ 保留信息: ${hasRetentionInfo ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          retentionCompliant,
          cleanupWorks,
          hasRetentionInfo,
          retentionPolicies: dataSummary?.retention || {}
        }
      };
    } catch (e) {
      console.log(`   ❌ 数据保留测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Test transparency and disclosure
  testTransparency: function() {
    console.log('🔍 测试透明度...');
    
    try {
      if (!window.Privacy) {
        return { passed: false, error: 'Privacy system not available' };
      }

      // Test compliance report
      const complianceReport = window.Privacy.getComplianceReport();
      const hasReport = complianceReport && complianceReport.compliance;
      
      // Test privacy notice component
      const hasPrivacyNotice = window.PrivacyNotice && typeof window.PrivacyNotice.show === 'function';
      
      // Test data anonymization
      const testData = { sessionId: 'test-123', userAgent: 'test-agent', timestamp: Date.now() };
      const anonymized = window.Privacy.anonymizeData(testData);
      const anonymizationWorks = anonymized && anonymized.sessionId !== testData.sessionId;

      const passed = hasReport && hasPrivacyNotice && anonymizationWorks;
      
      console.log(`   ✅ 合规报告: ${hasReport ? '通过' : '失败'}`);
      console.log(`   ✅ 隐私通知: ${hasPrivacyNotice ? '通过' : '失败'}`);
      console.log(`   ✅ 数据匿名化: ${anonymizationWorks ? '通过' : '失败'}`);
      
      return {
        passed,
        details: {
          hasReport,
          hasPrivacyNotice,
          anonymizationWorks,
          reportKeys: Object.keys(complianceReport || {})
        }
      };
    } catch (e) {
      console.log(`   ❌ 透明度测试失败: ${e.message}`);
      return { passed: false, error: e.message };
    }
  },

  // Generate comprehensive report
  generateReport: function(results) {
    console.log('\n📋 隐私合规验证报告');
    console.log('=' .repeat(50));
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`总测试数: ${totalTests}`);
    console.log(`通过测试: ${passedTests}`);
    console.log(`失败测试: ${failedTests}`);
    console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    Object.entries(results).forEach(([testName, result]) => {
      const status = result.passed ? '✅ 通过' : '❌ 失败';
      console.log(`  ${testName}: ${status}`);
      if (!result.passed && result.error) {
        console.log(`    错误: ${result.error}`);
      }
    });
    
    // Compliance assessment
    console.log('\n🏆 合规性评估:');
    if (passedTests === totalTests) {
      console.log('🟢 完全合规 - 所有隐私保护功能正常工作');
    } else if (passedTests >= totalTests * 0.8) {
      console.log('🟡 基本合规 - 大部分功能正常，需要修复少数问题');
    } else if (passedTests >= totalTests * 0.6) {
      console.log('🟠 部分合规 - 存在重要问题，需要立即修复');
    } else {
      console.log('🔴 不合规 - 存在严重隐私保护问题，不建议上线');
    }
    
    // Recommendations
    console.log('\n💡 建议:');
    if (!results.encryption.passed) {
      console.log('  - 修复数据加密功能');
    }
    if (!results.storage.passed) {
      console.log('  - 修复存储合规性问题');
    }
    if (!results.consent.passed) {
      console.log('  - 完善同意管理机制');
    }
    if (!results.userRights.passed) {
      console.log('  - 实现完整的用户权利支持');
    }
    if (!results.dataRetention.passed) {
      console.log('  - 建立数据保留和清理机制');
    }
    if (!results.transparency.passed) {
      console.log('  - 提高数据处理透明度');
    }
    
    console.log('\n验证完成! 🎉');
    
    return {
      totalTests,
      passedTests,
      failedTests,
      passRate: (passedTests / totalTests) * 100,
      compliant: passedTests === totalTests,
      results
    };
  }
};

// Auto-run verification when page loads (for testing)
if (typeof window !== 'undefined') {
  window.PrivacyVerification = PrivacyVerification;
  
  // Run verification after a short delay to ensure all components are loaded
  setTimeout(() => {
    if (window.location.search.includes('verify-privacy')) {
      PrivacyVerification.runAllTests();
    }
  }, 2000);
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrivacyVerification;
}