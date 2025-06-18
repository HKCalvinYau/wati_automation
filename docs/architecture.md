# 系統架構設計

## 整體架構

### 三層頁面結構

```
index.html (總頁)
├── templates/ic.html (子目錄頁面)
│   └── templates/detail/ic/IC_RESP.html (詳細頁面)
├── templates/ac.html (子目錄頁面)
│   └── templates/detail/ac/AC_PICKUP.html (詳細頁面)
└── ... (其他類別)
```

## 頁面結構規範

### 1. 總頁 (index.html)

**功能**：系統入口，展示所有模板類別
**結構**：

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

### 2. 子目錄頁面 (templates/ic.html)

**功能**：展示特定類別的所有模板
**結構**：

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

### 3. 詳細頁面 (templates/detail/ic/IC_RESP.html)

**功能**：展示單個模板的完整資訊
**結構**：

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

## 功能模組

### 1. 雙語支援

- **語言切換器**：每個頁面都有語言切換按鈕
- **內容結構**：中英文內容並存，通過顯示/隱藏切換
- **CSS 類別**：使用 `-zh` 和 `-en` 後綴區分語言版本

### 2. 模板操作

- **複製功能**：複製模板內容到剪貼簿
- **下載功能**：下載 JSON 格式的模板
- **編輯功能**：編輯模板內容（模態對話框）

### 3. 狀態管理

- **模板狀態**：ACTIVE/INACTIVE 狀態指示
- **語言狀態**：當前顯示的語言版本
- **操作狀態**：按鈕的啟用/禁用狀態

## 技術特點

### 1. 響應式設計

- 使用 CSS Grid 和 Flexbox 佈局
- 支援手機、平板、桌面設備
- 自適應字體大小和間距

### 2. 模組化架構

- 功能模組獨立開發
- 可選載入，不影響現有功能
- 統一的 API 介面

### 3. 性能優化

- 延遲載入非關鍵資源
- 圖片優化和壓縮
- 適當的快取策略

## 檔案組織

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
