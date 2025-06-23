# Cloudways 快速部署指南

## 🚀 立即部署步驟

### 步驟 1：登入 Cloudways 控制台
1. 訪問 https://platform.cloudways.com/
2. 登入您的帳戶
3. 選擇您的應用程式

### 步驟 2：使用 File Manager
1. 點擊「File Manager」
2. 導航到應用程式根目錄
3. 刪除現有檔案（如果需要）

### 步驟 3：上傳核心檔案

#### 第一批：主要 HTML 檔案
```
index.html
detail.html
debug-save-issue.html
```

#### 第二批：CSS 和樣式
```
css/main.css
favicon.ico
.htaccess
```

#### 第三批：JavaScript 檔案
```
js/core/app.js
js/components/TemplateManager.js
js/components/SearchManager.js
js/components/TemplateDetail.js
js/components/ApprovalManager.js
js/utils/helpers.js
js/utils/favicon-handler.js
```

#### 第四批：API 檔案
```
api/get-templates.php
api/save-template.php
```

#### 第五批：數據檔案
```
data/templates/template-data.json
data/templates/approval-data.json
data/templates/usage-data.json
```

### 步驟 4：設置檔案權限
在 File Manager 中：
1. 選擇所有檔案
2. 右鍵點擊 → 權限
3. 設置為 644
4. 選擇所有目錄
5. 設置為 755

### 步驟 5：清除快取
1. 回到 Cloudways 控制台
2. 點擊「Application Settings」
3. 點擊「Clear Cache」
4. 選擇「Varnish Cache」
5. 點擊「Clear」

### 步驟 6：重啟應用程式
1. 點擊「Application Settings」
2. 點擊「Restart Application」
3. 等待重啟完成

## 🧪 測試部署結果

### 測試 1：基本功能
1. 訪問您的網站
2. 檢查主頁面是否正常載入
3. 檢查是否有 JavaScript 錯誤

### 測試 2：API 功能
```bash
# 測試獲取模板
curl https://your-domain.com/api/get-templates.php

# 測試保存模板
curl -X POST https://your-domain.com/api/save-template.php \
  -H "Content-Type: application/json" \
  -d '{"id":"TEST_001","title":"測試模板","content":"測試內容"}'
```

### 測試 3：保存功能
1. 編輯一個模板
2. 點擊保存
3. 重新整理頁面
4. 檢查修改是否保持

## 🚨 常見問題解決

### 問題 1：檔案上傳失敗
**解決方案**：
- 檢查檔案大小限制
- 分批上傳檔案
- 使用壓縮檔案上傳

### 問題 2：權限錯誤
**解決方案**：
```bash
# 在 File Manager 中設置權限
chmod 644 *.html *.css *.js *.json *.php
chmod 755 css/ js/ api/ data/
```

### 問題 3：API 無法訪問
**解決方案**：
- 檢查 .htaccess 檔案是否正確上傳
- 確保 mod_rewrite 已啟用
- 檢查 PHP 版本兼容性

### 問題 4：保存功能不工作
**解決方案**：
- 檢查 data/templates/ 目錄權限
- 確保 JSON 檔案可寫
- 檢查 PHP 錯誤日誌

## 📋 部署檢查清單

- [ ] 所有 HTML 檔案已上傳
- [ ] CSS 檔案已上傳
- [ ] JavaScript 檔案已上傳
- [ ] API 檔案已上傳
- [ ] 數據檔案已上傳
- [ ] 配置檔案已上傳
- [ ] 檔案權限已設置
- [ ] 快取已清除
- [ ] 應用程式已重啟
- [ ] 基本功能測試通過
- [ ] API 功能測試通過
- [ ] 保存功能測試通過

## 🎉 成功指標

部署成功後，您應該能夠：
1. ✅ 正常訪問網站
2. ✅ 查看模板列表
3. ✅ 編輯模板內容
4. ✅ 保存模板修改
5. ✅ 重新整理後數據保持
6. ✅ 無瀏覽器控制台錯誤

## 📞 需要協助？

如果遇到問題：
1. 檢查 Cloudways 錯誤日誌
2. 聯繫 Cloudways 支援
3. 參考 `TROUBLESHOOTING.md` 檔案
4. 使用 `debug-save-issue.html` 進行診斷 