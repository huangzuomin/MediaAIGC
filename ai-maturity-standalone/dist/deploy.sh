#!/bin/bash

# AI成熟度自测工具 - 部署脚本

set -e

echo "开始部署 AI成熟度自测工具..."

# 配置变量
REMOTE_HOST="your-server.com"
REMOTE_USER="deploy"
REMOTE_PATH="/var/www/ai-maturity-standalone"
LOCAL_BUILD_PATH="./dist"

# 检查构建目录
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "错误: 构建目录不存在，请先运行 npm run build"
    exit 1
fi

# 创建备份
echo "创建远程备份..."
ssh $REMOTE_USER@$REMOTE_HOST "
    if [ -d $REMOTE_PATH ]; then
        sudo cp -r $REMOTE_PATH $REMOTE_PATH.backup.$(date +%Y%m%d_%H%M%S)
    fi
"

# 上传文件
echo "上传文件到服务器..."
rsync -avz --delete $LOCAL_BUILD_PATH/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# 设置权限
echo "设置文件权限..."
ssh $REMOTE_USER@$REMOTE_HOST "
    sudo chown -R www-data:www-data $REMOTE_PATH
    sudo chmod -R 755 $REMOTE_PATH
"

# 重启服务
echo "重启Web服务..."
ssh $REMOTE_USER@$REMOTE_HOST "
    sudo systemctl reload nginx
"

echo "部署完成！"
echo "访问地址: https://your-domain.com/ai-maturity-standalone/"