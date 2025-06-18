# 開發指南

## 開發環境設置

### 必要條件

- Node.js (v14+)
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）
- 代碼編輯器（VS Code 推薦）

### 專案結構

```
wati_automation/
├── index.html                    # 總頁
├── templates/                    # 子目錄頁面
│   ├── ic.html                   # 初始聯繫類別
│   ├── ac.html                   # 預約確認類別
│   └── ...                       # 其他類別
├── templates/detail/             # 詳細頁面
│   ├── ic/                       # IC類別詳情
│   ├── ac/                       # AC類別詳情
│   └── ...                       # 其他類別詳情
├── css/                          # 樣式檔案
│   └── styles.css                # 主要樣式
├── js/                           # JavaScript 檔案
│   ├── main.js                   # 主要功能
│   ├── scripts.js                # 總頁腳本
│   └── modules/                  # 模組化功能
└── csv-manager.html              # CSV 管理工具
```

## 頁面開發規範

### 1. 總頁開發 (index.html)

#### 基本結構

```html
<!DOCTYPE html>
<html lang="zh-HK">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>寵物善終 WhatsApp 訊息目錄</title>
    <link rel="stylesheet" href="css/styles.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    />
  </head>
  <body>
    <header>
      <h1>寵物善終 WhatsApp 訊息目錄</h1>
      <nav>
        <ul>
          <li><a href="#categories">訊息類別</a></li>
          <li><a href="#search">快速搜尋</a></li>
          <li><a href="#tools">工具</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <!-- 搜尋區域 -->
      <section id="search" class="search-section">
        <h2>快速搜尋</h2>
        <form action="search.html" method="GET">
          <input type="text" name="q" placeholder="搜尋訊息模板..." />
          <button type="submit">搜尋</button>
        </form>
      </section>

      <!-- 類別展示區域 -->
      <section id="categories" class="categories-section">
        <h2>訊息類別</h2>
        <div class="template-grid">
          <article
            class="template-card"
            onclick="location.href='templates/ic.html'"
          >
            <h3>初始聯繫</h3>
            <p class="template-preview">
              包含與客戶初次接觸時使用的訊息模板，如基本問候、服務介紹等。
            </p>
          </article>
          <!-- 其他類別卡片 -->
        </div>
      </section>

      <!-- 工具區域 -->
      <section id="tools" class="tools-section">
        <h2>管理工具</h2>
        <div class="template-grid">
          <article
            class="template-card tools-card"
            onclick="location.href='csv-manager.html'"
          >
            <div class="tool-icon">
              <i class="fas fa-file-csv"></i>
            </div>
            <h3>CSV 管理工具</h3>
            <p class="template-preview">
              上載和下載 CSV 格式檔案，支援欄位選擇和模板匯出功能。
            </p>
            <div class="tool-features">
              <span class="feature-tag">檔案上載</span>
              <span class="feature-tag">欄位選擇</span>
              <span class="feature-tag">資料預覽</span>
              <span class="feature-tag">模板匯出</span>
            </div>
          </article>
        </div>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 寵物善終服務. 版權所有.</p>
    </footer>
    <script src="js/scripts.js"></script>
  </body>
</html>
```

#### 開發要點

- 使用語義化 HTML 標籤
- 確保響應式設計
- 添加適當的 ARIA 標籤
- 優化 SEO 結構

### 2. 子目錄頁面開發 (templates/ic.html)

#### 基本結構

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>初始聯繫 - 寵物善終 WhatsApp 訊息目錄</title>
    <link rel="stylesheet" href="../css/styles.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    />
    <script src="../js/main.js" defer></script>
  </head>
  <body>
    <header>
      <nav>
        <a href="../index.html" class="back-link">
          <i class="fas fa-arrow-left"></i>
          <span class="action-text-zh">返回首頁</span>
          <span class="action-text-en" style="display: none;"
            >Back to Home</span
          >
        </a>
        <h1>
          <span class="title-zh">初始聯繫</span>
          <span class="title-en" style="display: none;">Initial Contact</span>
        </h1>
      </nav>
    </header>

    <main>
      <!-- 類別資訊 -->
      <section class="category-info">
        <h2>
          <span class="title-zh">初始聯繫類別</span>
          <span class="title-en" style="display: none;"
            >Initial Contact Category</span
          >
        </h2>
        <div class="description-zh">
          <p>
            這個類別包含與新客戶初次接觸時使用的訊息模板，包括回應查詢、介紹服務等。
          </p>
        </div>
        <div class="description-en" style="display: none;">
          <p>
            This category contains message templates used for initial contact
            with new clients, including responding to inquiries and introducing
            services.
          </p>
        </div>
      </section>

      <!-- 新增模板按鈕 -->
      <section class="category-actions">
        <button class="add-template-button" onclick="showAddTemplate()">
          <i class="fas fa-plus"></i>
          <span class="action-text-zh">新增模板</span>
          <span class="action-text-en" style="display: none;"
            >Add Template</span
          >
        </button>
      </section>

      <!-- 模板列表 -->
      <section class="template-list">
        <div class="template-grid">
          <article class="template-card" data-template="IC_RESP" data-lang="zh">
            <div class="template-header">
              <div class="template-title-section">
                <h3 class="template-title-zh">回應初步查詢</h3>
                <h3 class="template-title-en" style="display: none;">
                  Response to Initial Inquiry
                </h3>
              </div>
              <span class="template-number">IC_RESP</span>
              <div class="template-status active">
                <i class="fas fa-flag"></i>
                <span>ACTIVE</span>
              </div>
              <div class="language-switcher">
                <button
                  class="lang-btn active"
                  data-lang="zh"
                  onclick="switchLanguage('IC_RESP', 'zh')"
                >
                  <i class="fas fa-language"></i> 中文
                </button>
                <button
                  class="lang-btn"
                  data-lang="en"
                  onclick="switchLanguage('IC_RESP', 'en')"
                >
                  <i class="fas fa-language"></i> English
                </button>
              </div>
            </div>
            <div class="template-description">
              <div class="description-zh">
                回應客戶通過電話、電郵或WhatsApp發送的初步查詢，提供服務資訊。
              </div>
              <div class="description-en" style="display: none;">
                Respond to initial inquiries from customers via phone, email, or
                WhatsApp, providing service information.
              </div>
            </div>
            <div class="template-example">
              <div class="example-zh">
                <p>
                  您好{{1}}，感謝您的查詢。我們提供專業的寵物善終服務，包括：
                </p>
                <ul>
                  <li>{{2}}</li>
                  <li>{{3}}</li>
                  <li>{{4}}</li>
                  <li>{{5}}</li>
                </ul>
                <p>請問您需要了解哪方面的服務詳情？</p>
              </div>
              <div class="example-en" style="display: none;">
                <p>
                  Hello {{1}}, thank you for your inquiry. We provide
                  professional pet memorial services, including:
                </p>
                <ul>
                  <li>{{2}}</li>
                  <li>{{3}}</li>
                  <li>{{4}}</li>
                  <li>{{5}}</li>
                </ul>
                <p>Which service details would you like to know more about?</p>
              </div>
            </div>
            <div class="template-actions">
              <a href="detail/ic/IC_RESP.html" class="view-details-button">
                <i class="fas fa-eye"></i>
                <span class="action-text-zh">查看詳情</span>
                <span class="action-text-en" style="display: none;"
                  >View Details</span
                >
              </a>
              <button class="copy-button" onclick="copyTemplate('IC_RESP')">
                <i class="fas fa-copy"></i>
                <span class="action-text-zh">複製模板</span>
                <span class="action-text-en" style="display: none;"
                  >Copy Template</span
                >
              </button>
              <button
                class="download-button"
                onclick="downloadTemplate('IC_RESP')"
              >
                <i class="fas fa-file-export"></i>
                <span class="action-text-zh">下載 JSON</span>
                <span class="action-text-en" style="display: none;"
                  >Download JSON</span
                >
              </button>
            </div>
          </article>
          <!-- 更多模板卡片 -->
        </div>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 寵物善終服務. 版權所有.</p>
    </footer>
  </body>
</html>
```

#### 開發要點

- 實現雙語支援
- 添加語言切換功能
- 確保模板卡片的一致性
- 實現複製和下載功能

### 3. 詳細頁面開發 (templates/detail/ic/IC_RESP.html)

#### 基本結構

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IC_RESP - 資訊諮詢 - 寵物善終 WhatsApp 訊息目錄</title>
    <link rel="stylesheet" href="../../../css/styles.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    />
  </head>
  <body>
    <header>
      <nav>
        <a href="../../../index.html" class="back-link">
          <i class="fas fa-arrow-left"></i> 返回首頁
        </a>
        <h1>IC_RESP - 資訊諮詢</h1>
      </nav>
    </header>

    <main class="template-detail">
      <!-- 範本資訊區塊 -->
      <section class="template-info">
        <h2>範本資訊</h2>
        <div class="info-group">
          <label>範本代碼：</label>
          <span>IC_RESP</span>
        </div>
        <div class="info-group">
          <label>更新時間：</label>
          <span>2024-03-22</span>
        </div>
        <div class="info-group">
          <label>狀態：</label>
          <span
            class="status active"
            onclick="toggleStatus(this)"
            style="cursor: pointer;"
          >
            <i class="fas fa-flag"></i>
            <span class="status-text">ACTIVE</span>
          </span>
        </div>
        <div class="language-switcher">
          <button
            class="lang-btn active"
            data-lang="zh"
            onclick="switchTemplateLanguage('zh')"
          >
            <i class="fas fa-language"></i> 中文版本
          </button>
          <button
            class="lang-btn"
            data-lang="en"
            onclick="switchTemplateLanguage('en')"
          >
            <i class="fas fa-language"></i> English Version
          </button>
        </div>
      </section>

      <!-- 操作按鈕區塊 -->
      <section class="template-actions">
        <button class="edit-button" onclick="editTemplate()">
          <i class="fas fa-edit"></i> 編輯範本
        </button>
        <button class="copy-button" onclick="copyTemplate()">
          <i class="fas fa-copy"></i> 複製模板
        </button>
        <button class="download-button" onclick="downloadTemplate()">
          <i class="fas fa-download"></i> 下載 JSON
        </button>
      </section>

      <!-- 中文版本內容 -->
      <section class="template-content zh-version">
        <h2>中文版本內容</h2>
        <div class="content-preview">
          💬 諮詢服務通知 親愛的{{1}}： 感謝您的諮詢，詳情如下： 📅
          諮詢日期：{{2}} ⏰ 諮詢時間：{{3}} 📍 諮詢地點：{{4}} 💭
          諮詢內容：{{5}} 📞 聯絡方式：{{6}} 📅 預約時間：{{7}} 📝 備註：{{8}}
          我們會盡快為您安排專業諮詢。
        </div>

        <div class="variable-section">
          <h3>變數說明</h3>
          <div class="variable-list">
            <div class="variable-item">
              <code>{{1}}</code>
              <span>客戶稱呼</span>
            </div>
            <!-- 更多變數 -->
          </div>
        </div>

        <div class="button-section">
          <h3>按鈕配置</h3>
          <div class="button-list">
            <div class="button-item">
              <span class="button-type">QUICK_REPLY</span>
              <span class="button-text">了解更多</span>
            </div>
            <!-- 更多按鈕 -->
          </div>
        </div>
      </section>

      <!-- 英文版本內容 -->
      <section class="template-content en-version" style="display: none;">
        <h2>English Version Content</h2>
        <!-- 與中文版本結構相同 -->
      </section>
    </main>
    <footer>
      <p>&copy; 2024 寵物善終服務. 版權所有.</p>
    </footer>
    <script src="../../../js/main.js"></script>
  </body>
</html>
```

#### 開發要點

- 實現完整的雙語切換
- 確保變數和按鈕配置的準確性
- 實現狀態切換功能
- 提供完整的操作功能

## JavaScript 開發規範

### 1. 主要功能模組 (js/main.js)

#### 複製功能

```javascript
function copyTemplate(templateCode) {
  try {
    // 優先複製模板內容
    const contentPreview = document.querySelector(".content-preview");
    if (contentPreview) {
      let content = contentPreview.textContent || contentPreview.innerText;

      // 清理空格
      content = content
        .replace(/^[ \t]+/gm, "") // 移除每行開頭的空格
        .trim(); // 移除開頭和結尾的空格

      navigator.clipboard.writeText(content).then(() => {
        showNotification("模板內容已複製到剪貼簿！", "success");
      });
      return;
    }

    // 備用：複製JSON格式
    const jsonBlock = document.querySelector(".template-json code");
    if (jsonBlock) {
      navigator.clipboard.writeText(jsonBlock.textContent).then(() => {
        showNotification("JSON格式已複製到剪貼簿！", "success");
      });
    }
  } catch (error) {
    console.error("複製失敗:", error);
    showNotification("複製失敗，請手動複製", "error");
  }
}
```

#### 下載功能

```javascript
function downloadTemplate() {
  try {
    const templateCode = document.querySelector(
      ".template-info .info-group span"
    ).textContent;
    const contentPreview = document.querySelector(".content-preview");

    if (contentPreview) {
      const content = contentPreview.textContent || contentPreview.innerText;
      const jsonData = {
        name: templateCode.toLowerCase(),
        language: "zh_HK",
        category: "UTILITY",
        content: content.trim(),
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateCode}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showNotification("JSON檔案已下載！", "success");
    }
  } catch (error) {
    console.error("下載失敗:", error);
    showNotification("下載失敗", "error");
  }
}
```

#### 語言切換功能

```javascript
function switchLanguage(templateCode, lang) {
  const card = document.querySelector(`[data-template="${templateCode}"]`);
  if (!card) return;

  // 更新語言按鈕狀態
  const buttons = card.querySelectorAll(".lang-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // 切換內容顯示
  ["title", "description", "example", "action-text"].forEach((type) => {
    const zhElement = card.querySelector(`.${type}-zh`);
    const enElement = card.querySelector(`.${type}-en`);
    if (zhElement) zhElement.style.display = lang === "zh" ? "" : "none";
    if (enElement) enElement.style.display = lang === "en" ? "" : "none";
  });

  // 更新卡片的語言屬性
  card.dataset.lang = lang;
}
```

### 2. 模組化功能 (js/modules/)

#### 模板管理模組

```javascript
class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.init();
  }

  init() {
    this.loadTemplates();
    this.bindEvents();
  }

  loadTemplates() {
    // 從localStorage載入模板數據
    const category = this.getCurrentCategory();
    const stored = localStorage.getItem(`templates_${category}`);
    if (stored) {
      this.templates = new Map(JSON.parse(stored));
    }
  }

  saveTemplate(templateData) {
    const templateCode = this.generateTemplateCode();
    this.templates.set(templateCode, templateData);
    this.saveToStorage();
    this.addTemplateToUI(templateCode, templateData);
  }

  generateTemplateCode() {
    const category = this.getCurrentCategory();
    const count = this.templates.size + 1;
    return `${category}_NEW_${count}`;
  }
}
```

## CSS 開發規範

### 1. 響應式設計

```css
/* 基礎樣式 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

/* 手機版 */
@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }

  .template-card {
    margin-bottom: 1rem;
  }
}

/* 平板版 */
@media (min-width: 769px) and (max-width: 1024px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* 桌面版 */
@media (min-width: 1025px) {
  .template-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}
```

### 2. 雙語支援樣式

```css
/* 語言切換器 */
.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.lang-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.lang-btn.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.lang-btn:hover {
  background: #f0f0f0;
}

.lang-btn.active:hover {
  background: #357abd;
}

/* 雙語內容 */
.template-title-zh,
.template-title-en,
.description-zh,
.description-en,
.example-zh,
.example-en,
.action-text-zh,
.action-text-en {
  transition: opacity 0.3s ease;
}
```

### 3. 組件樣式

```css
/* 模板卡片 */
.template-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

/* 模板標頭 */
.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.template-title-section h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.template-number {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

/* 狀態指示器 */
.template-status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.template-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid #10b981;
}

.template-status.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}
```

## 測試規範

### 1. 功能測試

- 複製功能測試
- 下載功能測試
- 語言切換測試
- 響應式設計測試

### 2. 兼容性測試

- 瀏覽器兼容性
- 設備兼容性
- 螢幕尺寸兼容性

### 3. 性能測試

- 載入速度測試
- 記憶體使用測試
- 用戶交互響應測試

## 部署規範

### 1. 檔案組織

- 確保所有檔案路徑正確
- 檢查 CSS 和 JS 引用
- 驗證圖片和資源檔案

### 2. 性能優化

- 壓縮 CSS 和 JS 檔案
- 優化圖片大小
- 啟用瀏覽器快取

### 3. SEO 優化

- 添加適當的 meta 標籤
- 確保語義化 HTML 結構
- 優化頁面載入速度
