# Cloudways 部署指南

## 🚨 重要提醒

您的系統有兩個不同的運行環境：

1. **本地環境** (`localhost:3000`) - 使用 Node.js 伺服器
2. **Cloudways 環境** - 使用 PHP + WordPress

## 🔧 部署步驟

### 步驟 1：執行部署腳本
```bash
./deploy-to-cloudways.sh
```

### 步驟 2：Cloudways 控制台操作
1. 登入 Cloudways 控制台
2. 選擇您的應用程式
3. 點擊「Application Settings」
4. 清除所有快取：
   - Varnish Cache
   - Redis Cache
   - Memcached Cache
   - Application Cache

### 步驟 3：重新啟動應用程式
1. 在 Cloudways 控制台
2. 點擊「Restart Application」
3. 等待重啟完成

### 步驟 4：檢查檔案
確保以下檔案在 Cloudways 伺服器上存在：
- ✅ `api/save-template.php`
- ✅ `api/get-templates.php`
- ✅ `data/templates/template-data.json`
- ✅ `index.html`
- ✅ `.htaccess`

## 🌐 訪問方式

### 本地測試
```bash
node local-test-server.js
# 訪問：http://localhost:3000
```

### Cloudways 生產環境
```
訪問：您的 Cloudways 域名
例如：https://your-app.cloudwaysapp.com
```

## 🔍 故障排除

### 問題 1：變更沒有生效
**解決方案**：
1. 清除所有快取
2. 重新啟動應用程式
3. 檢查檔案是否正確上傳

### 問題 2：API 無法訪問
**解決方案**：
1. 檢查 `.htaccess` 配置
2. 確認 PHP 檔案權限
3. 查看錯誤日誌

### 問題 3：資料無法保存
**解決方案**：
1. 檢查 `data/templates/` 目錄權限
2. 確認 PHP 有寫入權限
3. 測試 API 端點

## 📞 支援

如果問題持續存在：
1. 檢查 Cloudways 錯誤日誌
2. 聯繫 Cloudways 支援
3. 查看 `fixbug.md` 修復記錄

## 🎯 最佳實踐

1. **開發時**：使用本地環境 (`node local-test-server.js`)
2. **測試時**：使用 Cloudways 環境
3. **部署時**：使用部署腳本確保同步
4. **維護時**：定期清除快取和重啟應用程式 