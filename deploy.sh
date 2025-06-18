#!/bin/bash

# 顯示部署開始
echo "🚀 開始部署WhatsApp訊息模板管理系統..."

# 設置變數
DEPLOY_PATH="/home/master/applications/ywmzzfkesa/public_html"
BACKUP_PATH="/home/master/applications/ywmzzfkesa/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 資料庫配置
DB_NAME="ywmzzfkesa"
DB_USER="ywmzzfkesa"
DB_PASS="g5FFbP82Jm"
DB_HOST="localhost"

# 創建備份
echo "📦 創建當前版本備份..."
mkdir -p "$BACKUP_PATH"
if [ -d "$DEPLOY_PATH" ]; then
    tar -czf "$BACKUP_PATH/backup_$TIMESTAMP.tar.gz" -C "$DEPLOY_PATH" .
    
    # 備份資料庫
    echo "💾 備份資料庫..."
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_PATH/db_backup_$TIMESTAMP.sql"
fi

# 構建專案
echo "🔨 構建專案..."
npm run build:prod

# 部署文件
echo "📋 部署文件..."
# 清空目標目錄（保留 WordPress 核心文件）
find "$DEPLOY_PATH" -maxdepth 1 ! -name 'wp-*' ! -name '.' ! -name '..' -exec rm -rf {} \;

# 複製新文件
cp -r dist/* "$DEPLOY_PATH/"
cp .htaccess "$DEPLOY_PATH/"
cp php.ini "$DEPLOY_PATH/"

# 設置權限
echo "🔒 設置文件權限..."
find "$DEPLOY_PATH" -type f -exec chmod 644 {} \;
find "$DEPLOY_PATH" -type d -exec chmod 755 {} \;
chmod 755 "$DEPLOY_PATH/wp-content"
chmod 755 "$DEPLOY_PATH/wp-content/uploads"

# 更新資料庫配置
echo "🔄 更新資料庫配置..."
wp config set DB_NAME "$DB_NAME" --path="$DEPLOY_PATH"
wp config set DB_USER "$DB_USER" --path="$DEPLOY_PATH"
wp config set DB_PASSWORD "$DB_PASS" --path="$DEPLOY_PATH"
wp config set DB_HOST "$DB_HOST" --path="$DEPLOY_PATH"

# 清理快取
echo "🧹 清理快取..."
if [ -f "$DEPLOY_PATH/php.ini" ]; then
    php -r 'if(function_exists("opcache_reset")) opcache_reset();'
fi

# 清理部署文件
rm -f "$DEPLOY_PATH/deploy.tar.gz"

# 顯示完成信息
echo "✅ 部署完成！"
echo "🌐 請訪問 https://wordpressmu-1220981-5617519.cloudwaysapps.com 檢查是否正常運行"
echo "📝 如有問題，請查看錯誤日誌：$DEPLOY_PATH/error.log" 