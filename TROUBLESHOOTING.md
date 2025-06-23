# 🔧 故障排除指南

## 🚨 常見問題解決方案

### 1. 保存功能無法正常工作

#### 症狀
- 編輯模板後點擊保存，沒有反應
- 重新整理頁面後修改內容消失
- 瀏覽器控制台顯示錯誤訊息

#### 解決方案

**步驟 1: 檢查 API 端點**
```bash
# 測試 API 端點是否可訪問
curl http://your-domain.com/api/get-templates.php
curl -X POST http://your-domain.com/api/save-template.php -H "Content-Type: application/json" -d '{"test": true}'
```

**步驟 2: 檢查檔案權限**
```bash
# 確保以下目錄有寫入權限
chmod 755 data/templates/
chmod 755 data/logs/
chmod 644 data/templates/template-data.json
```

**步驟 3: 使用診斷工具**
1. 訪問 `https://your-domain.com/cloudways-debug.html`
2. 點擊「執行完整診斷」
3. 查看診斷結果

**步驟 4: 檢查瀏覽器控制台**
1. 按 F12 打開開發者工具
2. 查看 Console 標籤頁的錯誤訊息
3. 查看 Network 標籤頁的 API 請求狀態

### 2. PHP 版本問題

#### 症狀
- API 返回 500 錯誤
- 功能無法正常使用
- 伺服器錯誤日誌顯示 PHP 相關錯誤

#### 解決方案

**檢查 PHP 版本**
```bash
# 創建 PHP 版本檢查檔案
echo "<?php phpinfo(); ?>" > phpinfo.php
# 訪問 phpinfo.php 查看版本
```

**升級 PHP 版本（Cloudways）**
1. 登入 Cloudways 控制台
2. 進入應用程式設定
3. 選擇 PHP 版本（建議 8.1 或 8.2）
4. 重新啟動應用程式

### 3. 檔案權限問題

#### 症狀
- 無法保存模板
- 日誌檔案無法創建
- 備份檔案無法生成

#### 解決方案

**設置正確權限**
```bash
# 設置目錄權限
find data/ -type d -exec chmod 755 {} \;

# 設置檔案權限
find data/ -type f -exec chmod 644 {} \;

# 設置日誌目錄權限
chmod 777 data/logs/
```

### 4. 本地開發環境問題

#### 症狀
- `npm start` 無法啟動
- 本地伺服器無法訪問
- 診斷工具無法使用

#### 解決方案

**檢查 Node.js 版本**
```bash
node --version  # 需要 >= 14.0.0
npm --version   # 需要 >= 6.0.0
```

**重新安裝依賴**
```bash
npm run clean
npm install
```

**啟動開發伺服器**
```bash
npm start
# 或
node local-test-server.js
```

### 5. Git 部署問題

#### 症狀
- Git 推送到 Cloudways 失敗
- SSH 連接超時
- 部署後檔案未更新

#### 解決方案

**檢查 Git 配置**
```bash
# 檢查遠端倉庫
git remote -v

# 測試 SSH 連接
ssh -T git@git.cloudways.com
```

**手動部署**
1. 使用 Cloudways File Manager
2. 或使用 SFTP 工具
3. 上傳更新後的檔案

### 6. 瀏覽器相容性問題

#### 症狀
- 某些功能在特定瀏覽器無法使用
- JavaScript 錯誤
- 樣式顯示異常

#### 解決方案

**檢查瀏覽器支援**
- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

**清除瀏覽器快取**
1. 按 Ctrl+Shift+Delete
2. 清除快取和 Cookie
3. 重新載入頁面

## 🔧 診斷工具使用

### 本地診斷工具
訪問 `http://localhost:3000/debug-save-issue.html`

### Cloudways 診斷工具
訪問 `https://your-domain.com/cloudways-debug.html`

### PHP 環境檢查
訪問 `https://your-domain.com/php-version-check.php`

## 📋 檢查清單

### 部署前檢查
- [ ] 所有檔案已上傳
- [ ] 檔案權限正確設置
- [ ] PHP 版本符合要求
- [ ] API 端點可訪問

### 功能測試檢查
- [ ] 模板列表正常顯示
- [ ] 搜索功能正常
- [ ] 編輯功能正常
- [ ] 保存功能正常
- [ ] 匯出功能正常

### 錯誤檢查
- [ ] 瀏覽器控制台無錯誤
- [ ] 伺服器錯誤日誌正常
- [ ] API 響應正常
- [ ] 檔案寫入正常

## 📞 聯繫支援

如果以上解決方案都無法解決問題，請：

1. **收集錯誤資訊**
   - 截圖錯誤訊息
   - 複製瀏覽器控制台錯誤
   - 記錄操作步驟

2. **提供環境資訊**
   - 伺服器環境（Cloudways/其他）
   - PHP 版本
   - 瀏覽器版本
   - 操作系統

3. **聯繫方式**
   - 創建 GitHub Issue
   - 或聯繫技術支援團隊

## 📚 相關文檔

- [README.md](./README.md) - 專案說明
- [fixbug.md](./fixbug.md) - 修復記錄
- [docs/](./docs/) - 技術文檔

## 其他常見問題

### 問題：favicon.ico 404 錯誤
**解決方案**：這已經在之前的修復中解決，如果仍有問題，請檢查：
- `.htaccess` 檔案是否存在
- `favicon.ico` 檔案是否存在
- 瀏覽器快取是否已清除

### 問題：頁面載入緩慢
**解決方案**：
- 檢查網路連接
- 清除瀏覽器快取
- 檢查是否有大量模板資料

### 問題：搜尋功能不工作
**解決方案**：
- 確認 JavaScript 已正確載入
- 檢查瀏覽器控制台是否有錯誤
- 確認模板資料格式正確

## 預防措施

1. **定期備份**
   - 定期備份 `data/templates/template-data.json`
   - 使用版本控制系統

2. **測試環境**
   - 在修改前先在測試環境中測試
   - 使用診斷工具定期檢查

3. **監控**
   - 定期檢查系統日誌
   - 監控 API 回應時間

## 技術支援

如果您需要進一步的技術支援，請提供：

1. **系統資訊**
   - 作業系統版本
   - 瀏覽器版本
   - Node.js 版本（如果使用）

2. **錯誤詳情**
   - 完整的錯誤訊息
   - 錯誤發生的時間和步驟
   - 相關的日誌檔案

3. **環境資訊**
   - 是否使用本地伺服器
   - 網路環境
   - 防火牆設定

---

**最後更新**：2025-06-23  
**版本**：1.0.0 