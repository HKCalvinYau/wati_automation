#!/bin/bash

# Cloudways 部署腳本
# 使用方法: ./deploy-cloudways.sh

echo "🚀 Cloudways 部署腳本"
echo "========================"

# 檢查必要檔案
echo "📋 檢查必要檔案..."
required_files=(
    "index.html"
    "detail.html"
    "css/main.css"
    "js/core/app.js"
    "api/get-templates.php"
    "api/save-template.php"
    "data/templates/template-data.json"
    ".htaccess"
    "favicon.ico"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ 缺少以下檔案："
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ 所有必要檔案都存在"

# 創建部署包
echo "📦 創建部署包..."
if [ -f "cloudways-deploy.tar.gz" ]; then
    rm cloudways-deploy.tar.gz
fi

tar -czf cloudways-deploy.tar.gz \
    index.html \
    detail.html \
    debug-save-issue.html \
    css/ \
    js/ \
    api/ \
    data/ \
    .htaccess \
    favicon.ico

echo "✅ 部署包已創建: cloudways-deploy.tar.gz"

# 顯示檔案大小
size=$(du -h cloudways-deploy.tar.gz | cut -f1)
echo "📊 部署包大小: $size"

# 顯示部署說明
echo ""
echo "📋 部署說明"
echo "============"
echo "1. 登入 Cloudways 控制台"
echo "2. 進入 File Manager"
echo "3. 上傳 cloudways-deploy.tar.gz"
echo "4. 解壓縮檔案"
echo "5. 設置檔案權限"
echo "6. 清除快取"
echo "7. 重啟應用程式"
echo ""
echo "📖 詳細說明請參考: cloudways-quick-deploy.md"
echo "🔧 故障排除請參考: TROUBLESHOOTING.md"

# 檢查檔案權限
echo ""
echo "🔐 檢查檔案權限..."
find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" -o -name "*.php" | head -5 | while read file; do
    perm=$(stat -f "%Sp" "$file" | cut -c2-)
    echo "   $file: $perm"
done

echo ""
echo "🎉 部署準備完成！"
echo "請按照上述步驟在 Cloudways 控制台進行部署。" 