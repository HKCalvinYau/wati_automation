#!/bin/bash

echo "🚀 開始部署到 Cloudways 伺服器..."

# 檢查 Git 狀態
echo "📋 檢查 Git 狀態..."
git status

# 確保所有變更已提交
echo "💾 提交所有變更..."
git add .
git commit -m "自動部署更新 - $(date)"

# 推送到 Cloudways
echo "📤 推送到 Cloudways 伺服器..."
git push cloudways main

# 檢查推送結果
if [ $? -eq 0 ]; then
    echo "✅ 成功推送到 Cloudways"
else
    echo "❌ 推送到 Cloudways 失敗"
    exit 1
fi

# 檢查關鍵檔案是否存在
echo "🔍 檢查關鍵檔案..."
echo "1. 檢查 API 檔案..."
ls -la api/save-template.php
ls -la api/get-templates.php

echo "2. 檢查資料檔案..."
ls -la data/templates/template-data.json

echo "3. 檢查主頁面..."
ls -la index.html

echo "4. 檢查伺服器配置..."
ls -la .htaccess

echo "✅ 部署完成！"
echo ""
echo "📝 下一步："
echo "1. 在 Cloudways 控制台清除快取"
echo "2. 重新啟動應用程式"
echo "3. 訪問您的網站測試功能"
echo ""
echo "🌐 網站地址：您的 Cloudways 域名"
echo "🔧 如果仍有問題，請檢查 Cloudways 錯誤日誌" 