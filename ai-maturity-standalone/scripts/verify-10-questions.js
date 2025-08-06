#!/usr/bin/env node

/**
 * 验证10题版本部署的脚本
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 验证AI成熟度评估10题版本部署...\n');

// 验证文件存在
const filesToCheck = [
    'index.html',
    'test-10-questions.html',
    'UPGRADE_TO_10_QUESTIONS.md'
];

console.log('📁 检查文件存在性:');
filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - 文件不存在`);
    }
});

// 验证主页面内容
console.log('\n📝 检查主页面内容:');
try {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 检查题目数量
    const questionMatches = indexContent.match(/id:\s*'[^']+'/g);
    if (questionMatches && questionMatches.length >= 10) {
        console.log(`  ✅ 题目数量: ${questionMatches.length} (≥10)`);
    } else {
        console.log(`  ❌ 题目数量: ${questionMatches ? questionMatches.length : 0} (<10)`);
    }
    
    // 检查标题更新
    if (indexContent.includes('完整评估') && indexContent.includes('10题')) {
        console.log('  ✅ 页面标题已更新为10题版本');
    } else {
        console.log('  ❌ 页面标题未更新');
    }
    
    // 检查导航按钮
    if (indexContent.includes('返回智媒变革中心')) {
        console.log('  ✅ 返回主站导航已添加');
    } else {
        console.log('  ❌ 返回主站导航未添加');
    }
    
    // 检查导流链接
    if (indexContent.includes('handleExploreServices')) {
        console.log('  ✅ 探索服务导流链接已添加');
    } else {
        console.log('  ❌ 探索服务导流链接未添加');
    }
    
} catch (error) {
    console.log('  ❌ 无法读取主页面文件:', error.message);
}

// 验证主项目页面链接
console.log('\n🔗 检查主项目页面链接:');
try {
    const frameworkPath = path.join(__dirname, '..', '..', 'components', 'FrameworkSection.js');
    if (fs.existsSync(frameworkPath)) {
        const frameworkContent = fs.readFileSync(frameworkPath, 'utf8');
        
        if (frameworkContent.includes('ai-maturity-standalone')) {
            console.log('  ✅ 主项目页面已链接到独立页面');
        } else {
            console.log('  ❌ 主项目页面未链接到独立页面');
        }
        
        if (frameworkContent.includes('window.open')) {
            console.log('  ✅ 使用新标签页打开');
        } else {
            console.log('  ❌ 未使用新标签页打开');
        }
    } else {
        console.log('  ❌ FrameworkSection.js 文件不存在');
    }
} catch (error) {
    console.log('  ❌ 无法读取FrameworkSection.js:', error.message);
}

console.log('\n📊 部署验证完成!');
console.log('\n🚀 下一步:');
console.log('  1. 在浏览器中测试独立页面功能');
console.log('  2. 验证主项目页面的链接跳转');
console.log('  3. 测试所有导流链接是否正常工作');
console.log('  4. 检查移动端响应式效果');
console.log('\n📖 详细信息请查看: UPGRADE_TO_10_QUESTIONS.md');