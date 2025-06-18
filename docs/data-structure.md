# 數據結構說明

## 概述

本系統採用統一的 JSON 數據結構，支援模板管理、分類管理和系統配置。

## 核心數據結構

### 1. 模板數據結構

### 1.1 模板卡片數據 (子目錄頁面)

```javascript
{
    // 基本信息
    code: "IC_RESP",                    // 模板代碼
    title: {
        zh: "回應初步查詢",              // 中文標題
        en: "Response to Initial Inquiry" // 英文標題
    },
    description: {
        zh: "回應客戶通過電話、電郵或WhatsApp發送的初步查詢，提供服務資訊。",
        en: "Respond to initial inquiries from customers via phone, email, or WhatsApp, providing service information."
    },

    // 狀態信息
    status: "ACTIVE",                   // 模板狀態：ACTIVE/INACTIVE
    lastUpdated: "2024-03-22",         // 最後更新時間

    // 內容信息
    content: {
        zh: {
            preview: "您好{{1}}，感謝您的查詢。我們提供專業的寵物善終服務，包括：\n• {{2}}\n• {{3}}\n• {{4}}\n• {{5}}\n\n請問您需要了解哪方面的服務詳情？",
            variables: [
                { code: "{{1}}", description: "客戶稱呼" },
                { code: "{{2}}", description: "服務項目1" },
                { code: "{{3}}", description: "服務項目2" },
                { code: "{{4}}", description: "服務項目3" },
                { code: "{{5}}", description: "服務項目4" }
            ],
            buttons: [
                { type: "QUICK_REPLY", text: "了解更多" },
                { type: "QUICK_REPLY", text: "預約諮詢" },
                { type: "PHONE_NUMBER", text: "立即聯絡" }
            ]
        },
        en: {
            preview: "Hello {{1}}, thank you for your inquiry. We provide professional pet memorial services, including:\n• {{2}}\n• {{3}}\n• {{4}}\n• {{5}}\n\nWhich service details would you like to know more about?",
            variables: [
                { code: "{{1}}", description: "Client Name" },
                { code: "{{2}}", description: "Service Item 1" },
                { code: "{{3}}", description: "Service Item 2" },
                { code: "{{4}}", description: "Service Item 3" },
                { code: "{{5}}", description: "Service Item 4" }
            ],
            buttons: [
                { type: "QUICK_REPLY", text: "Learn More" },
                { type: "QUICK_REPLY", text: "Book Consultation" },
                { type: "PHONE_NUMBER", text: "Contact Now" }
            ]
        }
    },

    // 分類信息
    category: "IC",                     // 類別代碼
    categoryName: {
        zh: "初始聯繫",
        en: "Initial Contact"
    },

    // 元數據
    metadata: {
        createdAt: "2024-03-22T10:00:00Z",
        createdBy: "system",
        version: "1.0.0",
        tags: ["initial", "inquiry", "response"]
    }
}
```

### 1.2 詳細模板數據 (詳細頁面)

```javascript
{
    // 基本信息
    code: "IC_RESP",
    title: {
        zh: "回應初步查詢",
        en: "Response to Initial Inquiry"
    },

    // 詳細信息
    info: {
        code: "IC_RESP",
        lastUpdated: "2024-03-22",
        status: "ACTIVE",
        category: "IC",
        categoryName: {
            zh: "初始聯繫",
            en: "Initial Contact"
        }
    },

    // 完整內容
    content: {
        zh: {
            fullContent: `💬 諮詢服務通知

親愛的{{1}}：

感謝您的諮詢，詳情如下：

📅 諮詢日期：{{2}}
⏰ 諮詢時間：{{3}}
📍 諮詢地點：{{4}}
💭 諮詢內容：{{5}}
📞 聯絡方式：{{6}}
📅 預約時間：{{7}}
📝 備註：{{8}}

我們會盡快為您安排專業諮詢。`,
            variables: [
                { code: "{{1}}", description: "客戶稱呼" },
                { code: "{{2}}", description: "日期" },
                { code: "{{3}}", description: "時間" },
                { code: "{{4}}", description: "地點" },
                { code: "{{5}}", description: "諮詢內容" },
                { code: "{{6}}", description: "聯絡方式" },
                { code: "{{7}}", description: "預約時間" },
                { code: "{{8}}", description: "備註" }
            ],
            buttons: [
                { type: "QUICK_REPLY", text: "了解更多" },
                { type: "QUICK_REPLY", text: "預約諮詢" },
                { type: "PHONE_NUMBER", text: "立即聯絡" }
            ]
        },
        en: {
            fullContent: `💬 Consultation Service Notification

Dear {{1}},

Thank you for your inquiry. Here are the details:

📅 Consultation Date: {{2}}
⏰ Consultation Time: {{3}}
📍 Location: {{4}}
💭 Consultation Topic: {{5}}
📞 Contact Method: {{6}}
📅 Appointment Time: {{7}}
📝 Remarks: {{8}}

We will arrange professional consultation for you shortly.`,
            variables: [
                { code: "{{1}}", description: "Client Name" },
                { code: "{{2}}", description: "Date" },
                { code: "{{3}}", description: "Time" },
                { code: "{{4}}", description: "Location" },
                { code: "{{5}}", description: "Consultation Topic" },
                { code: "{{6}}", description: "Contact Method" },
                { code: "{{7}}", description: "Appointment Time" },
                { code: "{{8}}", description: "Remarks" }
            ],
            buttons: [
                { type: "QUICK_REPLY", text: "Learn More" },
                { type: "QUICK_REPLY", text: "Book Consultation" },
                { type: "PHONE_NUMBER", text: "Contact Now" }
            ]
        }
    },

    // WhatsApp API 格式
    whatsappFormat: {
        name: "ic_resp",
        language: "zh_HK",
        category: "UTILITY",
        components: [
            {
                type: "HEADER",
                format: "TEXT",
                text: "💬 諮詢服務通知"
            },
            {
                type: "BODY",
                text: "親愛的{{1}}：\n\n感謝您的諮詢，詳情如下：\n\n📅 諮詢日期：{{2}}\n⏰ 諮詢時間：{{3}}\n📍 諮詢地點：{{4}}\n💭 諮詢內容：{{5}}\n📞 聯絡方式：{{6}}\n📅 預約時間：{{7}}\n📝 備註：{{8}}\n\n我們會盡快為您安排專業諮詢。"
            },
            {
                type: "BUTTONS",
                buttons: [
                    {
                        type: "QUICK_REPLY",
                        text: "了解更多"
                    },
                    {
                        type: "QUICK_REPLY",
                        text: "預約諮詢"
                    },
                    {
                        type: "PHONE_NUMBER",
                        text: "立即聯絡",
                        phone_number: "+85212345678"
                    }
                ]
            }
        ]
    }
}
```

### 2. 類別數據結構

### 2.1 類別基本信息

```javascript
{
    code: "IC",                         // 類別代碼
    name: {
        zh: "初始聯繫",
        en: "Initial Contact"
    },
    description: {
        zh: "這個類別包含與新客戶初次接觸時使用的訊息模板，包括回應查詢、介紹服務等。",
        en: "This category contains message templates used for initial contact with new clients, including responding to inquiries and introducing services."
    },
    icon: "fas fa-handshake",          // 類別圖標
    color: "#4a90e2",                  // 類別顏色
    templateCount: 21,                 // 模板數量
    status: "ACTIVE"                   // 類別狀態
}
```

### 2.2 類別頁面數據

```javascript
{
    // 類別信息
    category: {
        code: "IC",
        name: {
            zh: "初始聯繫",
            en: "Initial Contact"
        },
        description: {
            zh: "這個類別包含與新客戶初次接觸時使用的訊息模板，包括回應查詢、介紹服務等。",
            en: "This category contains message templates used for initial contact with new clients, including responding to inquiries and introducing services."
        }
    },

    // 模板列表
    templates: [
        // 模板卡片數據...
    ],

    // 統計信息
    stats: {
        total: 21,
        active: 20,
        inactive: 1,
        lastUpdated: "2024-03-22"
    }
}
```

### 3. 系統配置數據結構

```json
{
  "app": {
    "name": "WhatsApp Template Manager 2025",
    "version": "1.0.0",
    "language": "zh",
    "theme": "default",
    "debug": false
  },
  "features": {
    "search": true,
    "filter": true,
    "export": true,
    "import": true,
    "backup": true,
    "sync": false
  },
  "ui": {
    "layout": "grid",
    "items_per_page": 12,
    "show_preview": true,
    "auto_save": true,
    "notifications": true
  },
  "data": {
    "storage": "localStorage",
    "backup_interval": 24,
    "max_backups": 10,
    "compression": true
  }
}
```

## 數據文件組織

### 1. 主要數據文件

```
data/
├── templates.json          # 所有模板數據
├── categories.json         # 類別配置
├── settings.json          # 系統設置
├── translations.json      # 多語言翻譯
└── backups/               # 備份文件
    ├── templates_20241201.json
    └── settings_20241201.json
```

### 2. 模板數據文件結構

```json
{
  "version": "1.0.0",
  "last_updated": "2024-12-01T00:00:00Z",
  "total_templates": 92,
  "categories": {
    "ic": {
      "name": "初始聯繫",
      "templates": {
        "IC_RESP": {
          /* 模板數據 */
        },
        "IC_COND": {
          /* 模板數據 */
        }
      }
    },
    "ac": {
      "name": "預約確認",
      "templates": {
        "AC_PICKUP": {
          /* 模板數據 */
        },
        "AC_CEREMONY": {
          /* 模板數據 */
        }
      }
    }
  }
}
```

## 數據驗證規則

### 1. 模板驗證

```javascript
const templateSchema = {
  required: ["id", "code", "category", "title", "content"],
  properties: {
    id: { type: "string", pattern: "^[A-Z]{2}_[A-Z]+$" },
    code: { type: "string", pattern: "^[A-Z]{2}_[A-Z]+$" },
    category: {
      type: "string",
      enum: ["ic", "ac", "ps", "pp", "pi", "ci", "li", "oi"],
    },
    title: {
      type: "object",
      required: ["zh"],
      properties: {
        zh: { type: "string", maxLength: 100 },
        en: { type: "string", maxLength: 100 },
      },
    },
    content: {
      type: "object",
      required: ["zh"],
      properties: {
        zh: { type: "string", maxLength: 1024 },
        en: { type: "string", maxLength: 1024 },
      },
    },
  },
};
```

### 2. 變數驗證

```javascript
const variableSchema = {
  required: ["code", "name"],
  properties: {
    code: { type: "string", pattern: "^{{[0-9]+}}$" },
    name: {
      type: "object",
      required: ["zh"],
      properties: {
        zh: { type: "string", maxLength: 50 },
        en: { type: "string", maxLength: 50 },
      },
    },
    required: { type: "boolean" },
    type: {
      type: "string",
      enum: ["string", "number", "date", "email", "phone"],
    },
  },
};
```

### 3. 按鈕驗證

```javascript
const BUTTON_RULES = {
  maxButtons: 3, // 最大按鈕數量
  types: ["QUICK_REPLY", "URL", "PHONE_NUMBER"], // 允許的按鈕類型
  maxTextLength: 20, // 按鈕文字最大長度
};
```

## 數據操作 API

### 1. 模板操作

```javascript
class TemplateManager {
  // 獲取模板
  getTemplate(id) {}

  // 創建模板
  createTemplate(templateData) {}

  // 更新模板
  updateTemplate(id, updates) {}

  // 刪除模板
  deleteTemplate(id) {}

  // 搜索模板
  searchTemplates(query) {}

  // 按類別獲取模板
  getTemplatesByCategory(category) {}

  // 導出模板
  exportTemplates(format = "json") {}

  // 導入模板
  importTemplates(data) {}
}
```

### 2. 類別操作

```javascript
class CategoryManager {
  // 獲取所有類別
  getCategories() {}

  // 獲取類別詳情
  getCategory(id) {}

  // 創建類別
  createCategory(categoryData) {}

  // 更新類別
  updateCategory(id, updates) {}

  // 刪除類別
  deleteCategory(id) {}

  // 獲取類別統計
  getCategoryStats(id) {}
}
```

### 3. 數據持久化

```javascript
class DataStorage {
  // 保存數據
  save(key, data) {}

  // 載入數據
  load(key) {}

  // 刪除數據
  delete(key) {}

  // 清空所有數據
  clear() {}

  // 備份數據
  backup() {}

  // 恢復備份
  restore(backupId) {}

  // 獲取存儲統計
  getStats() {}
}
```

## 數據遷移

### 1. 從舊版本遷移

```javascript
class DataMigrator {
  // 檢測舊版本數據
  detectOldData() {}

  // 遷移模板數據
  migrateTemplates(oldData) {}

  // 遷移類別數據
  migrateCategories(oldData) {}

  // 遷移設置數據
  migrateSettings(oldData) {}

  // 驗證遷移結果
  validateMigration(migratedData) {}

  // 回滾遷移
  rollback() {}
}
```

### 2. 數據轉換工具

```javascript
class DataTransformer {
  // 轉換模板格式
  transformTemplate(oldTemplate) {}

  // 轉換類別格式
  transformCategory(oldCategory) {}

  // 生成新ID
  generateNewId(oldId) {}

  // 驗證轉換結果
  validateTransformation(transformedData) {}
}
```

## 性能優化

### 1. 數據索引

```javascript
class DataIndex {
  constructor() {
    this.indexes = new Map();
  }

  // 建立搜索索引
  buildSearchIndex(templates) {}

  // 建立類別索引
  buildCategoryIndex(templates) {}

  // 建立標籤索引
  buildTagIndex(templates) {}

  // 搜索
  search(query) {}

  // 更新索引
  updateIndex(templateId, template) {}
}
```

### 2. 數據快取

```javascript
class DataCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
  }

  // 設置快取
  set(key, value, ttl = 300000) {}

  // 獲取快取
  get(key) {}

  // 刪除快取
  delete(key) {}

  // 清空快取
  clear() {}

  // 獲取快取統計
  getStats() {}
}
```

## 數據安全

### 1. 數據加密

```javascript
class DataEncryption {
  // 加密數據
  encrypt(data, key) {}

  // 解密數據
  decrypt(encryptedData, key) {}

  // 生成密鑰
  generateKey() {}

  // 驗證數據完整性
  verifyIntegrity(data, hash) {}
}
```

### 2. 數據備份

```javascript
class DataBackup {
  // 創建備份
  createBackup() {}

  // 恢復備份
  restoreBackup(backupId) {}

  // 列出備份
  listBackups() {}

  // 刪除備份
  deleteBackup(backupId) {}

  // 自動備份
  autoBackup() {}
}
```

## 雙語支援結構

### 1. 語言切換數據

```javascript
{
    currentLanguage: "zh",             // 當前語言
    availableLanguages: ["zh", "en"],  // 可用語言
    languageNames: {
        zh: "中文",
        en: "English"
    },
    languageIcons: {
        zh: "fas fa-language",
        en: "fas fa-language"
    }
}
```

### 2. 雙語內容結構

```javascript
{
    // 標題
    title: {
        zh: "初始聯繫",
        en: "Initial Contact"
    },

    // 描述
    description: {
        zh: "回應客戶查詢",
        en: "Response to Customer Inquiry"
    },

    // 按鈕文字
    actions: {
        viewDetails: {
            zh: "查看詳情",
            en: "View Details"
        },
        copyTemplate: {
            zh: "複製模板",
            en: "Copy Template"
        },
        downloadJson: {
            zh: "下載 JSON",
            en: "Download JSON"
        },
        editTemplate: {
            zh: "編輯範本",
            en: "Edit Template"
        }
    },

    // 狀態文字
    status: {
        active: {
            zh: "啟用",
            en: "Active"
        },
        inactive: {
            zh: "停用",
            en: "Inactive"
        }
    }
}
```

## 本地存儲結構

### 1. 模板數據存儲

```javascript
// localStorage 鍵名
const STORAGE_KEYS = {
    TEMPLATES: "templates_",           // 模板數據前綴
    CATEGORIES: "categories",          // 類別數據
    SETTINGS: "settings",              // 用戶設置
    LANGUAGE: "language",              // 語言偏好
    RECENT: "recent_templates"         // 最近使用
};

// 模板數據存儲格式
{
    "templates_IC": [
        // 模板卡片數據陣列
    ],
    "templates_AC": [
        // 模板卡片數據陣列
    ],
    // ... 其他類別
}
```

### 2. 用戶設置存儲

```javascript
{
    language: "zh",                    // 默認語言
    theme: "light",                    // 主題設置
    autoSave: true,                    // 自動保存
    notifications: true,               // 通知設置
    lastVisit: "2024-03-22T10:00:00Z" // 最後訪問時間
}
```

## 數據轉換規則

### 1. HTML 到 JSON 轉換

```javascript
function htmlToJson(htmlContent) {
  return {
    // 提取模板內容
    content: extractContent(htmlContent),
    // 提取變數
    variables: extractVariables(htmlContent),
    // 提取按鈕
    buttons: extractButtons(htmlContent),
  };
}
```

### 2. JSON 到 WhatsApp API 格式轉換

```javascript
function jsonToWhatsApp(jsonData) {
  return {
    name: jsonData.code.toLowerCase(),
    language: "zh_HK",
    category: "UTILITY",
    components: [
      {
        type: "BODY",
        text: jsonData.content,
      },
      {
        type: "BUTTONS",
        buttons: jsonData.buttons,
      },
    ],
  };
}
```

## 數據同步策略

### 1. 本地到服務器同步

```javascript
async function syncToServer(localData) {
  try {
    // 驗證數據
    const validatedData = validateData(localData);

    // 上傳到服務器
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    return response.json();
  } catch (error) {
    console.error("同步失敗:", error);
    throw error;
  }
}
```

### 2. 服務器到本地同步

```javascript
async function syncFromServer() {
  try {
    // 從服務器獲取數據
    const response = await fetch("/api/templates");
    const serverData = await response.json();

    // 更新本地存儲
    updateLocalStorage(serverData);

    // 更新UI
    updateUI(serverData);
  } catch (error) {
    console.error("同步失敗:", error);
    // 使用本地數據作為備用
    loadFromLocalStorage();
  }
}
```
