# 手動部署指南

## 🚨 當前狀況

Git 推送到 Cloudways 持續失敗，可能是網路或伺服器問題。以下是手動部署的解決方案。

## 📁 需要部署的檔案清單

### 核心檔案
- `index.html` - 主頁面
- `detail.html` - 模板詳情頁面
- `css/main.css` - 樣式檔案
- `js/core/app.js` - 主應用程式
- `js/components/` - 所有組件檔案
- `js/utils/` - 工具檔案

### API 檔案
- `api/get-templates.php` - 獲取模板 API
- `api/save-template.php` - 保存模板 API

### 數據檔案
- `data/templates/template-data.json` - 模板數據
- `data/templates/approval-data.json` - 審批數據
- `data/templates/usage-data.json` - 使用數據

### 配置檔案
- `.htaccess` - Apache 配置
- `favicon.ico` - 網站圖標

## 🔧 手動部署步驟

### 方法 1：使用 Cloudways File Manager

1. **登入 Cloudways 控制台**
2. **進入 File Manager**
3. **導航到應用程式根目錄**
4. **上傳以下檔案**：

#### 步驟 1：上傳核心檔案
```
index.html
detail.html
css/main.css
js/core/app.js
js/components/TemplateManager.js
js/components/SearchManager.js
js/components/TemplateDetail.js
js/components/ApprovalManager.js
js/utils/helpers.js
js/utils/favicon-handler.js
```

#### 步驟 2：上傳 API 檔案
```
api/get-templates.php
api/save-template.php
```

#### 步驟 3：上傳數據檔案
```
data/templates/template-data.json
data/templates/approval-data.json
data/templates/usage-data.json
```

#### 步驟 4：上傳配置檔案
```
.htaccess
favicon.ico
```

### 方法 2：使用 SFTP 工具

#### 推薦工具
- **FileZilla** (免費)
- **Cyberduck** (免費)
- **WinSCP** (Windows)

#### SFTP 連接信息
- **主機**：您的 Cloudways 伺服器 IP
- **端口**：22
- **用戶名**：cloudways
- **密碼**：從 Cloudways 控制台獲取

#### 上傳步驟
1. 連接到伺服器
2. 導航到應用程式目錄
3. 上傳所有檔案
4. 確保檔案權限正確

### 方法 3：使用 Cloudways CLI

```bash
# 安裝 Cloudways CLI
npm install -g cloudways-cli

# 登入
cloudways login

# 部署應用程式
cloudways deploy
```

## 🔍 部署後檢查

### 1. 檢查檔案權限
```bash
# 目錄權限
chmod 755 /path/to/your/app

# 檔案權限
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
chmod 644 *.json

# PHP 檔案權限
chmod 644 *.php
```

### 2. 測試 API 端點
```bash
# 測試獲取模板
curl https://your-domain.com/api/get-templates.php

# 測試保存模板
curl -X POST https://your-domain.com/api/save-template.php \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 3. 檢查錯誤日誌
- 在 Cloudways 控制台查看錯誤日誌
- 檢查 PHP 錯誤日誌
- 檢查 Apache 錯誤日誌

## 🎯 快速部署腳本

創建一個部署腳本來自動化過程：

```bash
#!/bin/bash
# deploy-to-cloudways.sh

echo "🚀 開始部署到 Cloudways..."

# 設置變數
REMOTE_HOST="your-server-ip"
REMOTE_USER="cloudways"
REMOTE_PATH="/path/to/your/app"

# 上傳檔案
echo "📤 上傳檔案..."
scp -r index.html detail.html css/ js/ api/ data/ .htaccess favicon.ico \
    $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

# 設置權限
echo "🔐 設置檔案權限..."
ssh $REMOTE_USER@$REMOTE_HOST "chmod -R 755 $REMOTE_PATH"

echo "✅ 部署完成！"
```

## 🚨 故障排除

### 常見問題

1. **檔案權限錯誤**
   ```bash
   chmod 755 /path/to/directory
   chmod 644 /path/to/file
   ```

2. **PHP 錯誤**
   - 檢查 PHP 版本兼容性
   - 確保 PHP 擴展已啟用

3. **API 無法訪問**
   - 檢查 .htaccess 配置
   - 確保 mod_rewrite 已啟用

4. **數據無法保存**
   - 檢查檔案寫入權限
   - 確保 JSON 檔案可寫

### 聯繫支援

如果問題持續：
1. 檢查 Cloudways 狀態頁面
2. 聯繫 Cloudways 支援
3. 提供錯誤日誌和詳細信息

## 📋 部署檢查清單

- [ ] 所有核心檔案已上傳
- [ ] API 檔案已上傳
- [ ] 數據檔案已上傳
- [ ] 配置檔案已上傳
- [ ] 檔案權限正確
- [ ] API 端點可訪問
- [ ] 保存功能正常
- [ ] 錯誤日誌無異常
- [ ] 網站正常運行

## 🎉 成功指標

部署成功後，您應該能夠：
1. 訪問主頁面
2. 查看模板列表
3. 編輯模板
4. 保存模板
5. 重新載入頁面後數據保持 