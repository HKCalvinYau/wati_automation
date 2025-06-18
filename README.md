# 寵物善終服務 - WhatsApp 訊息模板管理系統

## 🎯 專案概述

這是一個專業的寵物善終服務 WhatsApp 訊息模板管理系統，提供完整的模板創建、編輯、複製和管理功能。系統採用模組化架構，支援雙語顯示和響應式設計。

## ✨ 主要功能

### 🔍 智能搜索與過濾

- **即時搜索**: 支援關鍵字搜索，涵蓋標題、描述、內容和代碼
- **分類過濾**: 8 個服務分類，快速定位所需模板
- **語言切換**: 支援繁體中文和英文雙語顯示
- **狀態管理**: 顯示模板啟用狀態

### 📱 響應式設計

- **多設備支援**: 完美適配桌面、平板和手機
- **現代 UI**: 採用 Material Design 風格
- **流暢動畫**: 豐富的交互動畫效果
- **無障礙設計**: 支援鍵盤導航和螢幕閱讀器

### 🛠 模組化架構

- **組件化設計**: 可重用的 UI 組件
- **工具函數庫**: 豐富的輔助功能
- **錯誤處理**: 完善的錯誤監控和處理
- **性能優化**: 代碼分割和懶加載

## 🚀 快速開始

### 環境要求

- Node.js 16.0 或更高版本
- 現代瀏覽器 (Chrome 80+, Firefox 75+, Safari 13+)

### 安裝步驟

1. **克隆專案**

```bash
git clone <repository-url>
cd wati_automation
```

2. **安裝依賴**

```bash
npm install
```

3. **啟動開發服務器**

```bash
cd wait_auto_2025
python3 -m http.server 8080
# 或使用 Node.js
npx serve .
```

4. **訪問系統**
   打開瀏覽器訪問 `http://localhost:8080`

## 📁 專案結構

```
wait_auto_2025/
├── css/                    # 樣式文件
│   └── main.css           # 主要樣式文件
├── js/                    # JavaScript 文件
│   ├── components/        # 組件
│   │   └── TemplateManager.js
│   └── utils/             # 工具函數
│       └── helpers.js
├── data/                  # 數據文件
│   └── templates/
│       └── template-data.json
├── docs/                  # 文檔
│   ├── development.md
│   ├── migration.md
│   └── template-creation.md
└── index.html            # 主頁面
```

## 🎨 設計系統

### 顏色方案

- **主色調**: `#2563eb` (藍色)
- **成功色**: `#10b981` (綠色)
- **警告色**: `#f59e0b` (橙色)
- **錯誤色**: `#ef4444` (紅色)

### 字體系統

- **主字體**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **代碼字體**: 'Courier New', monospace

### 間距系統

- **基礎單位**: 0.25rem (4px)
- **標準間距**: 1rem (16px)
- **大間距**: 2rem (32px)

## 🔧 核心組件

### TemplateManager

主要的模板管理組件，負責：

- 加載和解析模板數據
- 實現搜索和過濾功能
- 處理模板預覽和複製
- 管理用戶交互

```javascript
// 使用示例
const templateManager = new TemplateManager();
templateManager.init();
```

### 工具函數庫

提供豐富的輔助功能：

```javascript
// 日期格式化
utils.formatDate(new Date(), "YYYY-MM-DD");

// 本地存儲
utils.storage.set("key", value);
utils.storage.get("key");

// 防抖函數
const debouncedSearch = utils.debounce(searchFunction, 300);

// 文件下載
utils.fileUtils.download(content, "filename.txt");
```

## 📊 數據結構

### 模板數據格式

```json
{
  "metadata": {
    "totalTemplates": 98,
    "categories": {
      "ic": 20,
      "ac": 20,
      "ps": 20,
      "pp": 4,
      "pi": 10,
      "ci": 5,
      "li": 9,
      "oi": 10
    },
    "lastUpdated": "2025-06-18T03:21:21.253Z",
    "version": "2.0.0"
  },
  "templates": [
    {
      "id": "IC_RESP",
      "code": "IC_RESP",
      "category": "ic",
      "title": {
        "zh": "回應初步查詢",
        "en": "Response to Initial Inquiry"
      },
      "description": {
        "zh": "回應客戶通過電話、電郵或WhatsApp發送的初步查詢",
        "en": "Respond to initial inquiries from customers"
      },
      "content": {
        "zh": "您好{{1}}，感謝您的查詢...",
        "en": "Hello {{1}}, thank you for your inquiry..."
      },
      "status": "active",
      "createdAt": "2025-06-18T03:21:21.267Z",
      "updatedAt": "2025-06-18T03:21:21.267Z"
    }
  ]
}
```

## 🎯 使用指南

### 搜索模板

1. 在搜索框中輸入關鍵字
2. 系統會即時顯示匹配結果
3. 支援標題、描述、內容和代碼搜索

### 過濾模板

1. 點擊分類按鈕進行過濾
2. 選擇語言切換顯示語言
3. 組合使用多個過濾條件

### 預覽模板

1. 點擊模板卡片的「預覽」按鈕
2. 在模態框中查看完整內容
3. 支援複製模板內容

### 複製模板

1. 點擊「複製」按鈕
2. 模板內容自動複製到剪貼板
3. 系統顯示成功通知

## 🔄 遷移指南

### 從舊系統遷移

1. **數據提取**: 使用遷移工具提取現有模板
2. **格式轉換**: 自動轉換為新系統格式
3. **驗證檢查**: 確保數據完整性
4. **功能測試**: 驗證所有功能正常

詳細遷移步驟請參考 [遷移指南](docs/migration.md)

## 🛠 開發指南

### 添加新模板

1. 編輯 `data/templates/template-data.json`
2. 按照數據格式添加新模板
3. 重新加載頁面查看效果

### 自定義樣式

1. 修改 `css/main.css` 中的 CSS 變量
2. 添加新的樣式類
3. 保持響應式設計原則

### 擴展功能

1. 在 `js/components/` 中添加新組件
2. 在 `js/utils/` 中添加工具函數
3. 更新主頁面引用新功能

詳細開發文檔請參考 [開發指南](docs/development.md)

## 🧪 測試

### 功能測試

- 搜索和過濾功能
- 模板預覽和複製
- 響應式設計
- 錯誤處理

### 性能測試

- 頁面加載速度
- 搜索響應時間
- 記憶體使用情況

### 兼容性測試

- 不同瀏覽器支援
- 移動設備適配
- 無障礙功能

## 📈 性能優化

### 已實現的優化

- **代碼分割**: 按需加載組件
- **圖片優化**: 使用 WebP 格式
- **緩存策略**: 本地存儲常用數據
- **防抖搜索**: 減少不必要的請求

### 建議的優化

- **CDN 加速**: 使用 CDN 分發靜態資源
- **Gzip 壓縮**: 啟用服務器端壓縮
- **Service Worker**: 實現離線功能
- **圖片懶加載**: 優化圖片加載

## 🐛 故障排除

### 常見問題

**Q: 模板無法加載**
A: 檢查 `data/templates/template-data.json` 文件是否存在且格式正確

**Q: 搜索功能不工作**
A: 確保 JavaScript 文件正確加載，檢查瀏覽器控制台錯誤

**Q: 樣式顯示異常**
A: 清除瀏覽器緩存，檢查 CSS 文件路徑

**Q: 複製功能失敗**
A: 確保使用 HTTPS 或 localhost，檢查瀏覽器權限

### 錯誤報告

如遇到問題，請：

1. 檢查瀏覽器控制台錯誤信息
2. 記錄操作步驟和錯誤現象
3. 提供瀏覽器版本和操作系統信息

## 📄 授權協議

本專案採用 MIT 授權協議，詳見 [LICENSE](LICENSE) 文件。

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 貢獻流程

1. Fork 本專案
2. 創建功能分支
3. 提交變更
4. 發起 Pull Request

### 代碼規範

- 使用 ESLint 進行代碼檢查
- 遵循 Prettier 格式化規則
- 添加適當的註釋和文檔
- 確保測試覆蓋率

## 📞 聯絡資訊

- **專案維護者**: 寵物善終服務團隊
- **電子郵件**: support@petmemorial.hk
- **專案地址**: [GitHub Repository]

---

**版本**: 2.0.0  
**最後更新**: 2025-06-18  
**狀態**: 生產就緒 ✅
