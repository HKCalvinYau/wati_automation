# WhatsApp 訊息模板管理系統

專業的寵物善終服務 WhatsApp 訊息模板管理系統，提供雙語支援和響應式設計。

## 專案特色

- 🚀 **雙語支援**: 繁體中文和英文雙語顯示
- 🔍 **智能搜索**: 快速搜索和過濾模板
- 📱 **響應式設計**: 支援各種設備和螢幕尺寸
- 🎨 **現代化 UI**: 美觀且易用的使用者介面
- 📊 **數據管理**: 完整的模板管理和匯出功能
- 🔧 **模組化架構**: 易於維護和擴展的程式碼結構

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
├── css/                    # 樣式檔案
│   └── main.css           # 主要樣式檔案
├── js/                    # JavaScript 檔案
│   ├── components/        # 元件模組
│   ├── core/             # 核心功能
│   ├── data/             # 數據處理
│   └── utils/            # 工具函數
├── data/                  # 數據檔案
│   └── templates/        # 模板數據
├── docs/                  # 文檔
├── wp-admin/             # WordPress 管理後台
├── wp-content/           # WordPress 內容目錄
├── wp-includes/          # WordPress 核心檔案
├── index.html            # 自定義首頁
├── index.php             # WordPress 入口檔案
├── wp-config.php         # WordPress 配置檔案
└── .htaccess             # Apache 重寫規則
```

## 功能模組

### 1. 模板管理 (TemplateManager)
- 模板列表顯示
- 模板搜索和過濾
- 模板新增和編輯
- 模板匯出功能

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
   npm run dev
   ```

### 生產環境部署
1. 推送到 GitHub：
   ```bash
   git add .
   git commit -m "更新描述"
   git push origin main
   ```

2. Cloudways 自動部署：
   - 專案已配置 Git 部署
   - 推送後自動更新生產環境

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

## 更新日誌

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

**注意**: 本系統專為寵物善終服務設計，包含專業的客戶服務模板和雙語支援功能。
