#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const url = require('url');
const mime = require('mime-types');

const BUILD_DIR = path.join(__dirname, '../dist');
const DEFAULT_PORT = 8080;

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

// 获取MIME类型
function getMimeType(filePath) {
  return mime.lookup(filePath) || 'application/octet-stream';
}

// 设置安全头
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}

// 设置缓存头
function setCacheHeaders(res, filePath) {
  const ext = path.extname(filePath);
  
  switch (ext) {
    case '.html':
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1小时
      break;
    case '.css':
    case '.js':
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24小时
      break;
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天
      break;
    default:
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1小时
  }
}

// 处理文件请求
async function handleFileRequest(req, res, filePath) {
  try {
    const stats = await fs.stat(filePath);
    const mimeType = getMimeType(filePath);
    
    // 设置响应头
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
    
    setSecurityHeaders(res);
    setCacheHeaders(res, filePath);
    
    // 检查If-Modified-Since头
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
      res.statusCode = 304;
      res.end();
      return;
    }
    
    // 支持Range请求（用于大文件）
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunksize);
      
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.statusCode = 200;
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
    
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
    log(`文件读取错误: ${error.message}`, 'error');
  }
}

// 处理404错误
function handle404(res, requestPath) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  
  const html404 = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面未找到 - AI成熟度自测</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        h1 { color: #1e40af; margin-bottom: 1rem; }
        p { color: #6b7280; margin-bottom: 2rem; }
        a {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 0.75rem 2rem;
            text-decoration: none;
            border-radius: 0.5rem;
            transition: background 0.3s;
        }
        a:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面 <code>${requestPath}</code> 不存在。</p>
        <a href="/">返回首页</a>
    </div>
</body>
</html>`;
  
  res.end(html404);
}

// 创建HTTP服务器
function createServer(port) {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // 记录请求
    log(`${req.method} ${pathname}`, 'info');
    
    // 处理根路径
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // 移除查询参数和锚点
    pathname = pathname.split('?')[0].split('#')[0];
    
    // 安全检查：防止路径遍历攻击
    if (pathname.includes('..') || pathname.includes('~')) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Forbidden');
      log(`拒绝访问: ${pathname}`, 'warning');
      return;
    }
    
    // 构建文件路径
    let filePath = path.join(BUILD_DIR, pathname);
    
    try {
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        // 如果是目录，尝试查找index.html
        const indexPath = path.join(filePath, 'index.html');
        if (await fs.pathExists(indexPath)) {
          filePath = indexPath;
        } else {
          handle404(res, pathname);
          return;
        }
      }
      
      await handleFileRequest(req, res, filePath);
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，尝试添加.html扩展名
        const htmlPath = filePath + '.html';
        if (await fs.pathExists(htmlPath)) {
          await handleFileRequest(req, res, htmlPath);
        } else {
          handle404(res, pathname);
        }
      } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        log(`服务器错误: ${error.message}`, 'error');
      }
    }
  });
  
  return server;
}

// 启动服务器
async function serve() {
  const args = process.argv.slice(2);
  let port = DEFAULT_PORT;
  
  // 解析命令行参数
  for (const arg of args) {
    if (arg.startsWith('--port=')) {
      port = parseInt(arg.split('=')[1]) || DEFAULT_PORT;
    } else if (!isNaN(parseInt(arg))) {
      port = parseInt(arg);
    }
  }
  
  try {
    // 检查构建目录
    if (!await fs.pathExists(BUILD_DIR)) {
      log('构建目录不存在，请先运行 npm run build', 'error');
      process.exit(1);
    }
    
    // 创建并启动服务器
    const server = createServer(port);
    
    server.listen(port, () => {
      log(`服务器已启动`, 'success');
      log(`本地访问地址: http://localhost:${port}`, 'info');
      log(`网络访问地址: http://0.0.0.0:${port}`, 'info');
      log(`构建目录: ${BUILD_DIR}`, 'info');
      log('按 Ctrl+C 停止服务器', 'info');
    });
    
    // 优雅关闭
    process.on('SIGINT', () => {
      log('正在关闭服务器...', 'warning');
      server.close(() => {
        log('服务器已关闭', 'success');
        process.exit(0);
      });
    });
    
    // 错误处理
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        log(`端口 ${port} 已被占用，请尝试其他端口`, 'error');
      } else {
        log(`服务器错误: ${error.message}`, 'error');
      }
      process.exit(1);
    });
    
  } catch (error) {
    log(`启动失败: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
AI成熟度自测工具 - 本地服务器

用法:
  node serve.js [port]

参数:
  port: 端口号 (默认: 8080)

示例:
  node serve.js        # 使用默认端口8080
  node serve.js 3000   # 使用端口3000

功能:
  - 静态文件服务
  - 自动添加.html扩展名
  - 安全头设置
  - 缓存控制
  - Range请求支持
  - 404错误页面
`);
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    serve();
  }
}

module.exports = { serve };