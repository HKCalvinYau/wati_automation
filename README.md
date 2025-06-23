# WhatsApp 訊息模板管理系統

專業的寵物善終服務 WhatsApp 訊息模板管理系統，提供雙語支援和響應式設計。

## 專案特色

- 🚀 **雙語支援**: 繁體中文和英文雙語顯示
- 🔍 **智能搜索**: 快速搜索和過濾模板
- 📱 **響應式設計**: 支援各種設備和螢幕尺寸
- 🎨 **現代化 UI**: 美觀且易用的使用者介面
- 📊 **數據管理**: 完整的模板管理和匯出功能
- 🔧 **模組化架構**: 易於維護和擴展的程式碼結構
- 💾 **持久化保存**: 真正的資料持久化，支援編輯後保存

## 技術架構

### 前端技術
- **HTML5**: 語義化標記
- **CSS3**: 現代化樣式和動畫
- **JavaScript (ES6+)**: 模組化程式設計
- **Font Awesome**: 圖標字體

### 後端技術
- **PHP**: 伺服器端程式語言
- **WordPress**: 內容管理系統核心
- **MySQL**: 資料庫管理系統

### 部署環境
- **Cloudways**: 雲端託管平台
- **GitHub**: 版本控制和協作
- **Git**: 分散式版本控制

## 專案結構

```
wati_automation/
├── api/                     # PHP API 端點
│   ├── save-template.php    # 模板保存 API
│   ├── get-templates.php    # 模板獲取 API
│   └── php-version-check.php # PHP 環境檢查
├── js/                     # JavaScript 模組
│   ├── components/         # 前端組件
│   │   ├── TemplateManager.js    # 模板管理
│   │   ├── TemplateDetail.js     # 模板詳情
│   │   ├── SearchManager.js      # 搜索功能
│   │   └── ApprovalManager.js    # 審核管理
│   ├── core/              # 核心功能
│   ├── utils/             # 工具函數
│   └── data/              # 數據處理
├── data/                  # 數據檔案
│   ├── templates/         # 模板數據
│   └── logs/              # 操作日誌
├── css/                   # 樣式檔案
├── docs/                  # 文檔
├── local-test-server.js   # 本地開發伺服器
├── cloudways-debug.html   # Cloudways 診斷工具
├── debug-save-issue.html  # 本地診斷工具
└── package.json           # 專案配置
```

## 功能模組

### 1. 模板管理 (TemplateManager)
- 模板列表顯示
- 模板搜索和過濾
- 模板新增和編輯
- 模板匯出功能
- **持久化保存**: 編輯後資料真正保存到伺服器

### 2. 搜索管理 (SearchManager)
- 即時搜索
- 分類過濾
- 語言切換

### 3. 使用統計 (UsageManager)
- 使用頻率統計
- 熱門模板排行
- 使用趨勢分析

### 4. 版本管理 (VersionManager)
- 模板版本控制
- 版本比較功能
- 版本回滾

### 5. 審核管理 (ApprovalManager)
- 模板審核流程
- 審核狀態追蹤
- 審核歷史記錄

## API 文檔

### 保存模板 API
**端點**: `POST /api/save-template.php`

**功能**: 保存或更新模板資料

**請求格式**:
```json
{
  "id": "模板ID",
  "code": "模板代碼",
  "category": "分類",
  "title": {
    "zh": "繁體中文標題",
    "en": "English Title"
  },
  "description": {
    "zh": "繁體中文描述",
    "en": "English Description"
  },
  "content": {
    "zh": "繁體中文內容",
    "en": "English Content"
  },
  "status": "active|draft|inactive"
}
```

**響應格式**:
```json
{
  "success": true,
  "message": "模板保存成功",
  "data": {
    "templateId": "模板ID",
    "totalTemplates": 98,
    "lastUpdated": "2025-01-27T10:30:00Z"
  }
}
```

### 獲取模板 API
**端點**: `GET /api/get-templates.php`

**功能**: 獲取模板列表，支援過濾和搜索

**查詢參數**:
- `category`: 分類過濾
- `status`: 狀態過濾
- `search`: 搜索關鍵字
- `limit`: 分頁限制
- `offset`: 分頁偏移

**響應格式**:
```json
{
  "success": true,
  "data": {
    "metadata": {
      "totalTemplates": 98,
      "categories": {
        "ic": 20,
        "ac": 20
      },
      "lastUpdated": "2025-01-27T10:30:00Z"
    },
    "templates": [...]
  }
}
```

## 資料保存機制

### 問題解決
- **問題**: 編輯模板後重新整理頁面，更新會消失
- **原因**: 原系統只使用 localStorage，沒有同步到伺服器
- **解決方案**: 實現真正的持久化保存

### 新的保存流程
1. **編輯模板** → 前端驗證
2. **發送 API 請求** → 後端處理
3. **保存到檔案** → 持久化存儲
4. **創建備份** → 資料安全
5. **記錄日誌** → 操作追蹤
6. **更新前端** → 即時反饋

### 備用機制
- API 失敗時自動回退到靜態檔案載入
- 本地 localStorage 作為臨時緩存
- 完整的錯誤處理和用戶提示

## 部署說明

### 本地開發環境
1. 克隆專案：
   ```bash
   git clone https://github.com/HKCalvinYau/wati_automation.git
   cd wati_automation
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動開發伺服器：
   ```bash
   npm start
   # 或
   npm run dev
   ```

4. 訪問應用程式：
   - 主頁面: http://localhost:3000
   - 診斷工具: http://localhost:3000/debug-save-issue.html
   - Cloudways 診斷: http://localhost:3000/cloudways-debug.html

### 生產環境部署 (Cloudways)

#### 方法一：Git 部署（推薦）
```bash
# 添加 Cloudways 遠端倉庫
git remote add cloudways git@git.cloudways.com:ywmzzfkesa.git

# 推送代碼
git push cloudways main
```

#### 方法二：手動部署
1. 使用 Cloudways File Manager 上傳檔案
2. 或使用 SFTP 工具連接伺服器
3. 確保檔案權限正確設置

#### 部署後檢查
1. 訪問 `https://your-domain.com/cloudways-debug.html`
2. 執行完整診斷測試
3. 檢查 API 端點是否正常工作
4. 測試模板保存功能

### 開發工具

#### 診斷工具
- **本地診斷**: `debug-save-issue.html` - 測試本地開發環境
- **Cloudways 診斷**: `cloudways-debug.html` - 測試生產環境
- **PHP 版本檢查**: `php-version-check.php` - 檢查 PHP 環境

#### 測試腳本
```bash
# 測試 API 端點
npm run test:api

# 驗證模板資料
npm run validate

# 格式化代碼
npm run format

# 檢查代碼品質
npm run lint
```

### 故障排除

#### 常見問題
1. **保存功能無法工作**
   - 檢查 API 端點是否可訪問
   - 確認檔案權限設置
   - 查看瀏覽器控制台錯誤

2. **PHP 版本問題**
   - 建議使用 PHP 8.1 或 8.2
   - 最低要求 PHP 7.4

3. **檔案權限問題**
   - `data/templates/` 目錄需要寫入權限
   - `data/logs/` 目錄需要寫入權限

#### 日誌檔案
- 模板操作日誌: `data/logs/template-updates.log`
- PHP 錯誤日誌: 檢查伺服器錯誤日誌
- 瀏覽器控制台: 查看 JavaScript 錯誤

### 環境要求

#### 本地開發
- Node.js >= 14.0.0
- npm >= 6.0.0

#### 生產環境
- PHP >= 7.4 (推薦 8.1+)
- Apache/Nginx
- 支援 JSON 和檔案寫入權限

### 專案結構說明

```
wati_automation/
├── api/                     # PHP API 端點
│   ├── save-template.php    # 模板保存 API
│   ├── get-templates.php    # 模板獲取 API
│   └── php-version-check.php # PHP 環境檢查
├── js/                     # JavaScript 模組
│   ├── components/         # 前端組件
│   │   ├── TemplateManager.js    # 模板管理
│   │   ├── TemplateDetail.js     # 模板詳情
│   │   ├── SearchManager.js      # 搜索功能
│   │   └── ApprovalManager.js    # 審核管理
│   ├── core/              # 核心功能
│   ├── utils/             # 工具函數
│   └── data/              # 數據處理
├── data/                  # 數據檔案
│   ├── templates/         # 模板數據
│   └── logs/              # 操作日誌
├── css/                   # 樣式檔案
├── docs/                  # 文檔
├── local-test-server.js   # 本地開發伺服器
├── cloudways-debug.html   # Cloudways 診斷工具
├── debug-save-issue.html  # 本地診斷工具
└── package.json           # 專案配置
```

## 配置說明

### WordPress 配置
- **資料庫**: MySQL 8.0
- **PHP 版本**: 8.1+
- **快取**: Redis Object Cache
- **SSL**: 強制 HTTPS

### 自定義首頁配置
- 優先顯示自定義 `index.html`
- WordPress 作為後端 API
- 靜態檔案快取優化

### API 配置
- **檔案權限**: 確保 `data/templates/` 目錄可寫
- **日誌目錄**: 自動創建 `data/logs/` 目錄
- **備份機制**: 自動備份到 `.backup.json` 檔案

## 更新日誌

### v2.1.0 (2025-01-27)
- ✅ **重大修復**: 實現真正的資料持久化保存
- ✅ 創建 PHP API 端點處理資料保存
- ✅ 更新前端保存邏輯使用 API
- ✅ 添加資料備份和日誌記錄
- ✅ 實現錯誤處理和用戶回饋
- ✅ 添加重新載入功能
- ✅ 更新文檔和 API 說明

### v2.0.0 (2024-06-19)
- ✅ 整合 WordPress 核心檔案
- ✅ 配置自定義首頁優先顯示
- ✅ 優化 .htaccess 重寫規則
- ✅ 更新 .gitignore 配置
- ✅ 完善專案文檔

### v1.0.0 (2024-06-18)
- ✅ 初始專案建立
- ✅ 基本功能實現
- ✅ GitHub 倉庫設置
- ✅ Cloudways 部署配置

## 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 聯絡資訊

- **開發者**: Calvin Yau
- **Email**: [聯絡郵箱]
- **專案連結**: https://github.com/HKCalvinYau/wati_automation

---

**注意**: 本系統專為寵物善終服務設計，包含專業的客戶服務模板和雙語支援功能。現在支援真正的資料持久化保存，編輯後不會再丟失資料。
