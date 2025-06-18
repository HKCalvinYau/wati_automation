# 數據遷移指南

## 遷移概述

本指南說明如何將現有的靜態 HTML 模板系統遷移到新的模組化架構，保持數據完整性和功能一致性。

## 遷移策略

### 1. 漸進式遷移

- 保持現有系統運行
- 逐步遷移模板數據
- 驗證功能完整性
- 確保向下兼容

### 2. 數據備份

- 備份所有現有模板檔案
- 備份 CSS 和 JavaScript 檔案
- 備份用戶設置和偏好
- 創建遷移日誌

## 遷移流程

### 階段一：準備工作

#### 1. 環境準備

```bash
# 創建新目錄
mkdir wait_auto_2025
cd wait_auto_2025

# 複製現有檔案
cp -r ../wati_automation/* .

# 創建備份
mkdir backup
cp -r * backup/
```

#### 2. 分析現有結構

```bash
# 統計模板數量
find templates/detail -name "*.html" | wc -l

# 檢查類別分布
ls templates/detail/ | wc -l

# 驗證檔案完整性
find . -name "*.html" -exec grep -l "DOCTYPE" {} \;
```

### 階段二：數據提取

#### 1. 提取模板數據

```javascript
// migration/extract-templates.js
const fs = require("fs");
const path = require("path");

function extractTemplateData(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // 提取模板代碼
  const codeMatch = content.match(/<span>([A-Z_]+)<\/span>/);
  const code = codeMatch ? codeMatch[1] : "";

  // 提取標題
  const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : "";

  // 提取內容
  const contentMatch = content.match(
    /<div class="content-preview">([\s\S]*?)<\/div>/
  );
  const templateContent = contentMatch ? contentMatch[1].trim() : "";

  // 提取變數
  const variables = [];
  const variableMatches = content.matchAll(
    /<code>\{\{(\d+)\}\}<\/code>\s*<span>([^<]+)<\/span>/g
  );
  for (const match of variableMatches) {
    variables.push({
      code: `{{${match[1]}}}`,
      description: match[2],
    });
  }

  // 提取按鈕
  const buttons = [];
  const buttonMatches = content.matchAll(
    /<span class="button-type">([^<]+)<\/span>\s*<span class="button-text">([^<]+)<\/span>/g
  );
  for (const match of buttonMatches) {
    buttons.push({
      type: match[1],
      text: match[2],
    });
  }

  return {
    code,
    title: { zh: title, en: title },
    content: {
      zh: {
        fullContent: templateContent,
        variables,
        buttons,
      },
      en: {
        fullContent: templateContent,
        variables,
        buttons,
      },
    },
    status: "ACTIVE",
    lastUpdated: new Date().toISOString().split("T")[0],
  };
}

// 批量提取所有模板
function extractAllTemplates() {
  const templates = {};
  const detailPath = "templates/detail";

  const categories = fs.readdirSync(detailPath);

  categories.forEach((category) => {
    const categoryPath = path.join(detailPath, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".html"));

    templates[category] = files.map((file) => {
      const filePath = path.join(categoryPath, file);
      return extractTemplateData(filePath);
    });
  });

  return templates;
}

// 執行提取
const allTemplates = extractAllTemplates();
fs.writeFileSync(
  "migration/extracted-templates.json",
  JSON.stringify(allTemplates, null, 2)
);
```

#### 2. 提取類別數據

```javascript
// migration/extract-categories.js
function extractCategoryData() {
  const categories = [
    {
      code: "IC",
      name: { zh: "初始聯繫", en: "Initial Contact" },
      description: {
        zh: "這個類別包含與新客戶初次接觸時使用的訊息模板，包括回應查詢、介紹服務等。",
        en: "This category contains message templates used for initial contact with new clients, including responding to inquiries and introducing services.",
      },
      icon: "fas fa-handshake",
      color: "#4a90e2",
      templateCount: 21,
    },
    {
      code: "AC",
      name: { zh: "預約確認", en: "Appointment Confirmation" },
      description: {
        zh: "包含預約相關的訊息模板，如時間確認、地點確認、取消預約等。",
        en: "Contains appointment-related message templates, such as time confirmation, location confirmation, appointment cancellation, etc.",
      },
      icon: "fas fa-calendar-check",
      color: "#10b981",
      templateCount: 18,
    },
    // ... 其他類別
  ];

  return categories;
}
```

### 階段三：數據轉換

#### 1. 轉換為新格式

```javascript
// migration/transform-data.js
function transformTemplateData(oldData) {
  return {
    // 基本信息
    code: oldData.code,
    title: oldData.title,
    description: {
      zh: `模板描述：${oldData.title.zh}`,
      en: `Template description: ${oldData.title.en}`,
    },

    // 狀態信息
    status: oldData.status || "ACTIVE",
    lastUpdated: oldData.lastUpdated,

    // 內容信息
    content: {
      zh: {
        preview: oldData.content.zh.fullContent.substring(0, 200) + "...",
        variables: oldData.content.zh.variables,
        buttons: oldData.content.zh.buttons,
      },
      en: {
        preview: oldData.content.en.fullContent.substring(0, 200) + "...",
        variables: oldData.content.en.variables,
        buttons: oldData.content.en.buttons,
      },
    },

    // 分類信息
    category: oldData.code.split("_")[0],
    categoryName: getCategoryName(oldData.code.split("_")[0]),

    // 元數據
    metadata: {
      createdAt: oldData.lastUpdated,
      createdBy: "migration",
      version: "1.0.0",
      tags: [oldData.code.split("_")[0].toLowerCase()],
    },
  };
}

function getCategoryName(categoryCode) {
  const categoryMap = {
    IC: { zh: "初始聯繫", en: "Initial Contact" },
    AC: { zh: "預約確認", en: "Appointment Confirmation" },
    PS: { zh: "服務後跟進", en: "Post Service" },
    PP: { zh: "產品及服務推廣", en: "Product Promotion" },
    PI: { zh: "付款信息", en: "Payment Information" },
    CI: { zh: "公司資料", en: "Company Information" },
    LI: { zh: "物流信息", en: "Logistics Information" },
    OI: { zh: "其他信息", en: "Other Information" },
  };

  return (
    categoryMap[categoryCode] || { zh: "未知類別", en: "Unknown Category" }
  );
}
```

#### 2. 生成新的 HTML 結構

```javascript
// migration/generate-html.js
function generateCategoryPage(categoryCode, templates) {
  const categoryData = getCategoryData(categoryCode);

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${categoryData.name.zh} - 寵物善終 WhatsApp 訊息目錄</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../js/main.js" defer></script>
</head>
<body>
    <header>
        <nav>
            <a href="../index.html" class="back-link">
                <i class="fas fa-arrow-left"></i> 
                <span class="action-text-zh">返回首頁</span>
                <span class="action-text-en" style="display: none;">Back to Home</span>
            </a>
            <h1>
                <span class="title-zh">${categoryData.name.zh}</span>
                <span class="title-en" style="display: none;">${
                  categoryData.name.en
                }</span>
            </h1>
        </nav>
    </header>

    <main>
        <section class="category-info">
            <h2>
                <span class="title-zh">${categoryData.name.zh}類別</span>
                <span class="title-en" style="display: none;">${
                  categoryData.name.en
                } Category</span>
            </h2>
            <div class="description-zh">
                <p>${categoryData.description.zh}</p>
            </div>
            <div class="description-en" style="display: none;">
                <p>${categoryData.description.en}</p>
            </div>
        </section>

        <section class="category-actions">
            <button class="add-template-button" onclick="showAddTemplate()">
                <i class="fas fa-plus"></i> 
                <span class="action-text-zh">新增模板</span>
                <span class="action-text-en" style="display: none;">Add Template</span>
            </button>
        </section>

        <section class="template-list">
            <div class="template-grid">
                ${templates
                  .map((template) => generateTemplateCard(template))
                  .join("\n")}
            </div>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 寵物善終服務. 版權所有.</p>
    </footer>
</body>
</html>`;
}

function generateTemplateCard(template) {
  return `<article class="template-card" data-template="${
    template.code
  }" data-lang="zh">
    <div class="template-header">
        <div class="template-title-section">
            <h3 class="template-title-zh">${template.title.zh}</h3>
            <h3 class="template-title-en" style="display: none;">${
              template.title.en
            }</h3>
        </div>
        <span class="template-number">${template.code}</span>
        <div class="template-status ${template.status.toLowerCase()}">
            <i class="fas fa-flag"></i>
            <span>${template.status}</span>
        </div>
        <div class="language-switcher">
            <button class="lang-btn active" data-lang="zh" onclick="switchLanguage('${
              template.code
            }', 'zh')">
                <i class="fas fa-language"></i> 中文
            </button>
            <button class="lang-btn" data-lang="en" onclick="switchLanguage('${
              template.code
            }', 'en')">
                <i class="fas fa-language"></i> English
            </button>
        </div>
    </div>
    <div class="template-description">
        <div class="description-zh">${template.description.zh}</div>
        <div class="description-en" style="display: none;">${
          template.description.en
        }</div>
    </div>
    <div class="template-example">
        <div class="example-zh">
            <p>${template.content.zh.preview}</p>
        </div>
        <div class="example-en" style="display: none;">
            <p>${template.content.en.preview}</p>
        </div>
    </div>
    <div class="template-actions">
        <a href="detail/${template.category.toLowerCase()}/${
    template.code
  }.html" class="view-details-button">
            <i class="fas fa-eye"></i> 
            <span class="action-text-zh">查看詳情</span>
            <span class="action-text-en" style="display: none;">View Details</span>
        </a>
        <button class="copy-button" onclick="copyTemplate('${template.code}')">
            <i class="fas fa-copy"></i> 
            <span class="action-text-zh">複製模板</span>
            <span class="action-text-en" style="display: none;">Copy Template</span>
        </button>
        <button class="download-button" onclick="downloadTemplate('${
          template.code
        }')">
            <i class="fas fa-file-export"></i> 
            <span class="action-text-zh">下載 JSON</span>
            <span class="action-text-en" style="display: none;">Download JSON</span>
        </button>
    </div>
</article>`;
}
```

### 階段四：驗證和測試

#### 1. 數據完整性檢查

```javascript
// migration/validate-data.js
function validateMigration(templates) {
  const errors = [];
  const warnings = [];

  Object.entries(templates).forEach(([category, categoryTemplates]) => {
    categoryTemplates.forEach((template) => {
      // 檢查必要欄位
      if (!template.code) {
        errors.push(`Template missing code in category ${category}`);
      }

      if (!template.title?.zh || !template.title?.en) {
        errors.push(`Template ${template.code} missing title`);
      }

      if (!template.content?.zh?.fullContent) {
        errors.push(`Template ${template.code} missing content`);
      }

      // 檢查變數格式
      template.content.zh.variables?.forEach((variable) => {
        if (!variable.code.match(/^\{\{\d+\}\}$/)) {
          warnings.push(
            `Template ${template.code} has invalid variable format: ${variable.code}`
          );
        }
      });

      // 檢查按鈕配置
      if (template.content.zh.buttons?.length > 3) {
        warnings.push(`Template ${template.code} has more than 3 buttons`);
      }
    });
  });

  return { errors, warnings };
}
```

#### 2. 功能測試

```javascript
// migration/test-functions.js
function testMigrationFunctions() {
  const tests = [
    {
      name: "複製功能測試",
      test: () => {
        // 模擬複製功能
        const mockContent = "測試內容";
        return mockContent.length > 0;
      },
    },
    {
      name: "下載功能測試",
      test: () => {
        // 模擬下載功能
        const mockData = { name: "test", content: "test" };
        return JSON.stringify(mockData).length > 0;
      },
    },
    {
      name: "語言切換測試",
      test: () => {
        // 模擬語言切換
        const mockElement = { style: { display: "" } };
        mockElement.style.display = "none";
        return mockElement.style.display === "none";
      },
    },
  ];

  const results = tests.map((test) => ({
    name: test.name,
    passed: test.test(),
    timestamp: new Date().toISOString(),
  }));

  return results;
}
```

## 遷移腳本

### 完整遷移腳本

```bash
#!/bin/bash
# migration/migrate.sh

echo "開始數據遷移..."

# 1. 創建備份
echo "創建備份..."
mkdir -p backup/$(date +%Y%m%d_%H%M%S)
cp -r * backup/$(date +%Y%m%d_%H%M%S)/

# 2. 提取數據
echo "提取模板數據..."
node migration/extract-templates.js

# 3. 轉換數據
echo "轉換數據格式..."
node migration/transform-data.js

# 4. 生成新檔案
echo "生成新檔案..."
node migration/generate-html.js

# 5. 驗證數據
echo "驗證數據完整性..."
node migration/validate-data.js

# 6. 測試功能
echo "測試功能..."
node migration/test-functions.js

echo "遷移完成！"
```

### 回滾腳本

```bash
#!/bin/bash
# migration/rollback.sh

echo "開始回滾..."

# 檢查備份
if [ ! -d "backup" ]; then
    echo "錯誤：找不到備份目錄"
    exit 1
fi

# 選擇最新的備份
LATEST_BACKUP=$(ls -t backup/ | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "錯誤：找不到備份檔案"
    exit 1
fi

echo "回滾到備份：$LATEST_BACKUP"

# 恢復檔案
cp -r backup/$LATEST_BACKUP/* .

echo "回滾完成！"
```

## 遷移檢查清單

### 遷移前檢查

- [ ] 備份所有現有檔案
- [ ] 檢查磁碟空間
- [ ] 驗證檔案權限
- [ ] 確認網路連接

### 遷移中檢查

- [ ] 監控遷移進度
- [ ] 檢查錯誤日誌
- [ ] 驗證數據完整性
- [ ] 測試關鍵功能

### 遷移後檢查

- [ ] 驗證所有頁面載入
- [ ] 測試雙語切換
- [ ] 檢查複製功能
- [ ] 驗證下載功能
- [ ] 測試響應式設計

## 常見問題

### Q: 遷移過程中出現錯誤怎麼辦？

A:

1. 檢查錯誤日誌
2. 使用回滾腳本恢復
3. 修復問題後重新遷移
4. 聯繫技術支援

### Q: 如何驗證遷移是否成功？

A:

1. 檢查所有頁面是否正常載入
2. 測試所有功能是否正常
3. 驗證數據完整性
4. 進行用戶驗收測試

### Q: 遷移後發現數據缺失怎麼辦？

A:

1. 檢查備份檔案
2. 重新執行遷移腳本
3. 手動補充缺失數據
4. 更新遷移日誌

## 性能優化

### 遷移優化

- 使用批量處理減少 I/O 操作
- 並行處理多個類別
- 使用記憶體快取減少重複讀取
- 優化檔案寫入順序

### 運行時優化

- 啟用瀏覽器快取
- 壓縮靜態資源
- 使用 CDN 加速
- 優化圖片載入

## 監控和維護

### 遷移監控

```javascript
// migration/monitor.js
class MigrationMonitor {
  constructor() {
    this.startTime = Date.now();
    this.stats = {
      totalTemplates: 0,
      processedTemplates: 0,
      errors: [],
      warnings: [],
    };
  }

  updateProgress(processed, total) {
    this.stats.processedTemplates = processed;
    this.stats.totalTemplates = total;

    const progress = ((processed / total) * 100).toFixed(2);
    console.log(`遷移進度: ${progress}% (${processed}/${total})`);
  }

  addError(error) {
    this.stats.errors.push({
      message: error,
      timestamp: new Date().toISOString(),
    });
  }

  addWarning(warning) {
    this.stats.warnings.push({
      message: warning,
      timestamp: new Date().toISOString(),
    });
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    return {
      duration: `${(duration / 1000).toFixed(2)}s`,
      stats: this.stats,
      success: this.stats.errors.length === 0,
    };
  }
}
```

### 維護建議

1. 定期備份數據
2. 監控系統性能
3. 更新遷移腳本
4. 記錄變更日誌
