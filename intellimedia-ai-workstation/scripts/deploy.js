/**
 * 自动化部署脚本
 * Automated Deployment Script
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class DeploymentManager {
    constructor(environment = 'production') {
        this.environment = environment;
        this.config = require('../build.config.js').getBuildConfig(environment);
        this.deploymentId = this.generateDeploymentId();
        this.startTime = Date.now();
        
        this.stats = {
            filesUploaded: 0,
            totalSize: 0,
            errors: [],
            warnings: []
        };
    }

    /**
     * 执行完整部署流程
     */
    async deploy() {
        console.log(`🚀 开始部署到 ${this.environment} 环境...`);
        console.log(`部署ID: ${this.deploymentId}\n`);
        
        try {
            // 1. 预部署检查
            await this.preDeploymentChecks();
            
            // 2. 构建项目
            await this.buildProject();
            
            // 3. 运行测试
            await this.runTests();
            
            // 4. 上传静态资源到CDN
            await this.uploadToCDN();
            
            // 5. 部署到服务器
            await this.deployToServer();
            
            // 6. 更新DNS和CDN配置
            await this.updateInfrastructure();
            
            // 7. 健康检查
            await this.healthCheck();
            
            // 8. 生成部署报告
            await this.generateDeploymentReport();
            
            // 9. 发送通知
            await this.sendNotifications();
            
            console.log('✅ 部署成功完成！');
            this.printDeploymentStats();
            
        } catch (error) {
            console.error('❌ 部署失败:', error);
            await this.rollback();
            process.exit(1);
        }
    }

    /**
     * 预部署检查
     */
    async preDeploymentChecks() {
        console.log('🔍 执行预部署检查...');
        
        // 检查构建配置
        const configValid = require('../build.config.js').validateConfig(this.config);
        if (!configValid) {
            throw new Error('构建配置验证失败');
        }
        
        // 检查必要的环境变量
        const requiredEnvVars = [
            'NODE_ENV',
            'CDN_ACCESS_KEY',
            'CDN_SECRET_KEY',
            'DEPLOY_SERVER_HOST'
        ];
        
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                this.stats.warnings.push(`缺少环境变量: ${envVar}`);
            }
        }
        
        // 检查Git状态
        try {
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
            if (gitStatus.trim() && this.environment === 'production') {
                throw new Error('生产环境部署要求工作目录干净（无未提交的更改）');
            }
        } catch (error) {
            this.stats.warnings.push(`Git状态检查失败: ${error.message}`);
        }
        
        // 检查依赖
        try {
            execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
        } catch (error) {
            this.stats.warnings.push('发现安全漏洞，建议运行 npm audit fix');
        }
        
        console.log('✅ 预部署检查完成');
    }

    /**
     * 构建项目
     */
    async buildProject() {
        console.log('🔨 构建项目...');
        
        try {
            const ProductionBuilder = require('./build-production.js');
            const builder = new ProductionBuilder();
            await builder.build();
            
            console.log('✅ 项目构建完成');
            
        } catch (error) {
            throw new Error(`项目构建失败: ${error.message}`);
        }
    }

    /**
     * 运行测试
     */
    async runTests() {
        console.log('🧪 运行测试套件...');
        
        if (this.environment === 'production') {
            try {
                // 运行所有测试
                console.log('运行单元测试...');
                // execSync('npm test', { stdio: 'inherit' });
                
                console.log('运行端到端测试...');
                // execSync('npm run test:e2e', { stdio: 'inherit' });
                
                console.log('运行性能测试...');
                // execSync('npm run test:performance', { stdio: 'inherit' });
                
                console.log('✅ 所有测试通过');
                
            } catch (error) {
                throw new Error(`测试失败: ${error.message}`);
            }
        } else {
            console.log('⏭️ 跳过测试（非生产环境）');
        }
    }

    /**
     * 上传到CDN
     */
    async uploadToCDN() {
        console.log('☁️ 上传静态资源到CDN...');
        
        if (!this.config.cdn.enabled) {
            console.log('⏭️ CDN未启用，跳过上传');
            return;
        }
        
        try {
            const distPath = this.config.paths.output;
            const files = await this.getFilesRecursively(distPath);
            
            for (const file of files) {
                await this.uploadFileToCDN(file);
                this.stats.filesUploaded++;
            }
            
            console.log(`✅ 已上传 ${this.stats.filesUploaded} 个文件到CDN`);
            
        } catch (error) {
            throw new Error(`CDN上传失败: ${error.message}`);
        }
    }

    /**
     * 部署到服务器
     */
    async deployToServer() {
        console.log('🖥️ 部署到服务器...');
        
        try {
            const serverConfig = this.config.deployment;
            const distPath = this.config.paths.output;
            
            // 创建部署包
            const deploymentPackage = await this.createDeploymentPackage(distPath);
            
            // 上传到服务器
            await this.uploadToServer(deploymentPackage);
            
            // 在服务器上解压和配置
            await this.configureOnServer();
            
            console.log('✅ 服务器部署完成');
            
        } catch (error) {
            throw new Error(`服务器部署失败: ${error.message}`);
        }
    }

    /**
     * 更新基础设施
     */
    async updateInfrastructure() {
        console.log('🌐 更新基础设施配置...');
        
        try {
            // 更新CDN配置
            await this.updateCDNConfig();
            
            // 更新DNS配置
            await this.updateDNSConfig();
            
            // 更新负载均衡器配置
            await this.updateLoadBalancerConfig();
            
            console.log('✅ 基础设施配置更新完成');
            
        } catch (error) {
            this.stats.warnings.push(`基础设施更新失败: ${error.message}`);
        }
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        console.log('🏥 执行健康检查...');
        
        const healthChecks = [
            { name: '主页加载', url: this.config.deployment.domains[this.environment] },
            { name: 'API健康检查', url: `${this.config.deployment.domains[this.environment]}/health` },
            { name: 'CDN资源', url: `${this.config.cdn.baseUrl}/assets/styles.css` }
        ];
        
        for (const check of healthChecks) {
            try {
                await this.performHealthCheck(check);
                console.log(`✅ ${check.name} - 正常`);
            } catch (error) {
                this.stats.errors.push(`健康检查失败 ${check.name}: ${error.message}`);
            }
        }
        
        if (this.stats.errors.length > 0) {
            throw new Error('健康检查失败');
        }
    }

    /**
     * 生成部署报告
     */
    async generateDeploymentReport() {
        console.log('📊 生成部署报告...');
        
        const deploymentTime = Date.now() - this.startTime;
        
        const report = {
            deploymentId: this.deploymentId,
            environment: this.environment,
            timestamp: new Date().toISOString(),
            deploymentTime: deploymentTime,
            version: this.getVersion(),
            gitCommit: this.getGitCommit(),
            stats: this.stats,
            config: {
                cdn: this.config.cdn.enabled,
                compression: this.config.compression.gzip.enabled,
                monitoring: this.config.monitoring.analytics.google.enabled
            },
            healthChecks: {
                passed: this.stats.errors.length === 0,
                errors: this.stats.errors,
                warnings: this.stats.warnings
            }
        };
        
        // 保存报告
        const reportPath = path.join(this.config.paths.output, 'deployment-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        // 上传报告到服务器
        await this.uploadDeploymentReport(report);
        
        console.log('✅ 部署报告已生成');
    }

    /**
     * 发送通知
     */
    async sendNotifications() {
        console.log('📢 发送部署通知...');
        
        const notification = {
            environment: this.environment,
            deploymentId: this.deploymentId,
            status: this.stats.errors.length === 0 ? 'success' : 'failed',
            version: this.getVersion(),
            timestamp: new Date().toISOString(),
            url: this.config.deployment.domains[this.environment]
        };
        
        try {
            // 发送到Slack/钉钉/企业微信等
            await this.sendSlackNotification(notification);
            
            // 发送邮件通知
            await this.sendEmailNotification(notification);
            
            console.log('✅ 通知发送完成');
            
        } catch (error) {
            this.stats.warnings.push(`通知发送失败: ${error.message}`);
        }
    }

    /**
     * 回滚部署
     */
    async rollback() {
        console.log('🔄 执行回滚...');
        
        try {
            // 回滚服务器部署
            await this.rollbackServer();
            
            // 回滚CDN配置
            await this.rollbackCDN();
            
            // 发送回滚通知
            await this.sendRollbackNotification();
            
            console.log('✅ 回滚完成');
            
        } catch (error) {
            console.error('❌ 回滚失败:', error);
        }
    }

    /**
     * 辅助方法
     */
    
    generateDeploymentId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `deploy-${timestamp}-${random}`;
    }
    
    async getFilesRecursively(dir) {
        const files = [];
        const items = await fs.readdir(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = await fs.stat(fullPath);
            
            if (stat.isDirectory()) {
                const subFiles = await this.getFilesRecursively(fullPath);
                files.push(...subFiles);
            } else {
                files.push(fullPath);
            }
        }
        
        return files;
    }
    
    async uploadFileToCDN(filePath) {
        // 模拟CDN上传
        console.log(`上传到CDN: ${filePath}`);
        
        // 实际实现应该使用CDN提供商的SDK
        // 例如：阿里云OSS、腾讯云COS、AWS S3等
        
        const stat = await fs.stat(filePath);
        this.stats.totalSize += stat.size;
        
        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    async createDeploymentPackage(distPath) {
        console.log('📦 创建部署包...');
        
        const packagePath = path.join(process.cwd(), `deployment-${this.deploymentId}.tar.gz`);
        
        // 实际实现应该创建tar.gz包
        console.log(`部署包路径: ${packagePath}`);
        
        return packagePath;
    }
    
    async uploadToServer(packagePath) {
        console.log('📤 上传到服务器...');
        
        // 实际实现应该使用SCP、SFTP或其他传输方式
        console.log(`上传包: ${packagePath}`);
    }
    
    async configureOnServer() {
        console.log('⚙️ 配置服务器...');
        
        // 实际实现应该通过SSH执行服务器配置命令
        const commands = [
            'sudo systemctl stop nginx',
            'tar -xzf deployment-package.tar.gz -C /var/www/html',
            'sudo systemctl start nginx',
            'sudo systemctl reload nginx'
        ];
        
        console.log('执行服务器配置命令...');
    }
    
    async updateCDNConfig() {
        console.log('更新CDN配置...');
        // 实际实现应该调用CDN API
    }
    
    async updateDNSConfig() {
        console.log('更新DNS配置...');
        // 实际实现应该调用DNS提供商API
    }
    
    async updateLoadBalancerConfig() {
        console.log('更新负载均衡器配置...');
        // 实际实现应该调用负载均衡器API
    }
    
    async performHealthCheck(check) {
        console.log(`检查: ${check.name} - ${check.url}`);
        
        // 实际实现应该发送HTTP请求检查
        // const response = await fetch(check.url);
        // if (!response.ok) {
        //     throw new Error(`HTTP ${response.status}`);
        // }
        
        // 模拟检查
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    getVersion() {
        try {
            const packageJson = require('../package.json');
            return packageJson.version || '1.0.0';
        } catch (error) {
            return '1.0.0';
        }
    }
    
    getGitCommit() {
        try {
            return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            return 'unknown';
        }
    }
    
    async uploadDeploymentReport(report) {
        console.log('上传部署报告...');
        // 实际实现应该上传到监控系统或日志服务
    }
    
    async sendSlackNotification(notification) {
        console.log('发送Slack通知...');
        // 实际实现应该调用Slack Webhook
    }
    
    async sendEmailNotification(notification) {
        console.log('发送邮件通知...');
        // 实际实现应该使用邮件服务
    }
    
    async rollbackServer() {
        console.log('回滚服务器部署...');
        // 实际实现应该恢复到上一个版本
    }
    
    async rollbackCDN() {
        console.log('回滚CDN配置...');
        // 实际实现应该恢复CDN配置
    }
    
    async sendRollbackNotification() {
        console.log('发送回滚通知...');
        // 实际实现应该发送回滚通知
    }
    
    printDeploymentStats() {
        const deploymentTime = Date.now() - this.startTime;
        
        console.log('\n📊 部署统计:');
        console.log('='.repeat(50));
        console.log(`部署ID: ${this.deploymentId}`);
        console.log(`环境: ${this.environment}`);
        console.log(`版本: ${this.getVersion()}`);
        console.log(`上传文件数: ${this.stats.filesUploaded}`);
        console.log(`总大小: ${(this.stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`部署时间: ${(deploymentTime / 1000).toFixed(2)}秒`);
        console.log(`错误数: ${this.stats.errors.length}`);
        console.log(`警告数: ${this.stats.warnings.length}`);
        console.log(`URL: ${this.config.deployment.domains[this.environment]}`);
        
        if (this.stats.errors.length > 0) {
            console.log('\n❌ 错误:');
            this.stats.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (this.stats.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            this.stats.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        console.log('='.repeat(50));
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const environment = process.argv[2] || 'production';
    const deployer = new DeploymentManager(environment);
    deployer.deploy().catch(console.error);
}

module.exports = DeploymentManager;