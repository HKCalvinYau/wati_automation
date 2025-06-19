/**
 * 模板管理器組件
 * 負責加載、過濾、顯示和管理所有模板
 */
class TemplateManager {
  constructor() {
    this.templates = [];
    this.filteredTemplates = [];
    this.currentCategory = "all";
    this.currentLanguage = "zh";
    this.searchQuery = "";
    this.init();
  }

  /**
   * 初始化模板管理器
   */
  async init() {
    try {
      await this.loadTemplates();
      this.setupEventListeners();
      this.renderTemplates();
      console.log("✅ 模板管理器初始化完成");
    } catch (error) {
      console.error("❌ 模板管理器初始化失敗:", error);
      this.showError("模板加載失敗，請檢查數據文件");
    }
  }

  /**
   * 加載模板數據
   */
  async loadTemplates() {
    try {
      const response = await fetch("../data/templates/template-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.templates = data.templates || [];
      this.filteredTemplates = [...this.templates];
      console.log(`📚 成功加載 ${this.templates.length} 個模板`);
    } catch (error) {
      console.error("❌ 加載模板數據失敗:", error);
      throw error;
    }
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners() {
    // 分類過濾
    const categoryButtons = document.querySelectorAll("[data-category]");
    categoryButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        this.filterByCategory(category);
      });
    });

    // 語言切換
    const languageButtons = document.querySelectorAll("[data-language]");
    languageButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const language = e.target.dataset.language;
        this.switchLanguage(language);
      });
    });

    // 搜索功能
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchTemplates(e.target.value);
      });
    }

    // 模板點擊事件 - 改為點擊卡片本身
    document.addEventListener("click", (e) => {
      const templateCard = e.target.closest(".template-card");
      if (templateCard && !e.target.closest(".template-actions")) {
        const templateId = templateCard.dataset.templateId;
        this.showTemplateDetail(templateId);
      }
    });
  }

  /**
   * 按分類過濾模板
   */
  filterByCategory(category) {
    this.currentCategory = category;
    this.applyFilters();

    // 更新UI狀態
    document.querySelectorAll("[data-category]").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-category="${category}"]`)
      ?.classList.add("active");
  }

  /**
   * 切換語言
   */
  switchLanguage(language) {
    this.currentLanguage = language;
    this.renderTemplates();

    // 更新UI狀態
    document.querySelectorAll("[data-language]").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-language="${language}"]`)
      ?.classList.add("active");
  }

  /**
   * 搜索模板
   */
  searchTemplates(query) {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  /**
   * 應用所有過濾器
   */
  applyFilters() {
    this.filteredTemplates = this.templates.filter((template) => {
      // 分類過濾
      if (
        this.currentCategory !== "all" &&
        template.category !== this.currentCategory
      ) {
        return false;
      }

      // 搜索過濾
      if (this.searchQuery) {
        const title = template.title[this.currentLanguage] || "";
        const description = template.description[this.currentLanguage] || "";
        const content = template.content[this.currentLanguage] || "";
        const code = template.code || "";

        const searchText =
          `${title} ${description} ${content} ${code}`.toLowerCase();
        if (!searchText.includes(this.searchQuery)) {
          return false;
        }
      }

      return true;
    });

    this.renderTemplates();
  }

  /**
   * 渲染模板列表
   */
  renderTemplates() {
    const container = document.getElementById("templates-container");
    if (!container) return;

    if (this.filteredTemplates.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <i class="icon-search"></i>
                    <h3>沒有找到相關模板</h3>
                    <p>請嘗試調整搜索條件或選擇其他分類</p>
                </div>
            `;
      return;
    }

    const templatesHTML = this.filteredTemplates
      .map((template) => this.renderTemplateCard(template))
      .join("");

    container.innerHTML = templatesHTML;
  }

  /**
   * 渲染單個模板卡片
   */
  renderTemplateCard(template) {
    const title =
      template.title[this.currentLanguage] || template.title.zh || "";
    const description =
      template.description[this.currentLanguage] ||
      template.description.zh ||
      "";

    return `
            <div class="template-card" data-template-id="${template.id}">
                <div class="template-header">
                    <h3 class="template-title">${title}</h3>
                    <span class="template-code">${template.code}</span>
                </div>
                <p class="template-description">${description}</p>
                <div class="template-meta">
                    <span class="template-category">${this.getCategoryName(
                      template.category
                    )}</span>
                    <span class="template-status ${
                      template.status
                    }">${this.getStatusText(template.status)}</span>
                </div>
                <div class="template-actions">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); templateManager.previewTemplate('${
                      template.id
                    }')">
                        <i class="fas fa-eye"></i> 預覽
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); templateManager.copyTemplate('${
                      template.id
                    }')">
                        <i class="fas fa-copy"></i> 複製
                    </button>
                    <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); templateManager.editTemplate('${
                      template.id
                    }')">
                        <i class="fas fa-edit"></i> 編輯
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * 獲取分類名稱
   */
  getCategoryName(category) {
    const categoryNames = {
      ic: "初步諮詢",
      ac: "安排服務",
      ps: "後續服務",
      pp: "產品推廣",
      pi: "付款相關",
      ci: "公司介紹",
      li: "物流追蹤",
      oi: "其他資訊",
    };
    return categoryNames[category] || category;
  }

  /**
   * 獲取狀態文字
   */
  getStatusText(status) {
    const statusTexts = {
      active: "啟用",
      inactive: "停用",
      draft: "草稿",
    };
    return statusTexts[status] || status;
  }

  /**
   * 預覽模板
   */
  previewTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return;

    const content =
      template.content[this.currentLanguage] || template.content.zh || "";
    const title =
      template.title[this.currentLanguage] || template.title.zh || "";

    // 創建預覽模態框
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="template-preview">
                        <pre class="template-content">${this.escapeHtml(
                          content
                        )}</pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="templateManager.copyTemplate('${templateId}')">
                        <i class="fas fa-copy"></i> 複製內容
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        關閉
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  /**
   * 複製模板內容
   */
  async copyTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return;

    const content =
      template.content[this.currentLanguage] || template.content.zh || "";

    try {
      await navigator.clipboard.writeText(content);
      this.showSuccess("模板內容已複製到剪貼板");
    } catch (error) {
      console.error("複製失敗:", error);
      this.showError("複製失敗，請手動複製");
    }
  }

  /**
   * 編輯模板
   */
  editTemplate(templateId) {
    // 導航到詳情頁面進行編輯
    window.location.href = `detail.html?id=${templateId}`;
  }

  /**
   * 顯示模板詳情
   */
  showTemplateDetail(templateId) {
    // 導航到詳情頁面
    window.location.href = `detail.html?id=${templateId}`;
  }

  /**
   * 轉義HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 顯示成功訊息
   */
  showSuccess(message) {
    this.showNotification(message, "success");
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    this.showNotification(message, "error");
  }

  /**
   * 顯示通知
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

    document.body.appendChild(notification);

    // 自動移除
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  /**
   * 顯示模板創建器
   */
  showTemplateCreator() {
    // 創建模板創建模態框
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> 新增模板</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="template-form" class="template-form">
                        <div class="form-group">
                            <label for="template-code">模板代碼 *</label>
                            <input type="text" id="template-code" name="code" required placeholder="例如: IC_WELCOME">
                        </div>
                        
                        <div class="form-group">
                            <label for="template-category">分類 *</label>
                            <select id="template-category" name="category" required>
                                <option value="">請選擇分類</option>
                                <option value="ic">初步諮詢</option>
                                <option value="ac">安排服務</option>
                                <option value="ps">後續服務</option>
                                <option value="pp">產品推廣</option>
                                <option value="pi">付款相關</option>
                                <option value="ci">公司介紹</option>
                                <option value="li">物流追蹤</option>
                                <option value="oi">其他資訊</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="template-title-zh">標題 (繁體中文) *</label>
                            <input type="text" id="template-title-zh" name="title_zh" required placeholder="輸入繁體中文標題">
                        </div>

                        <div class="form-group">
                            <label for="template-title-en">標題 (English)</label>
                            <input type="text" id="template-title-en" name="title_en" placeholder="Enter English title">
                        </div>

                        <div class="form-group">
                            <label for="template-description-zh">描述 (繁體中文)</label>
                            <textarea id="template-description-zh" name="description_zh" rows="3" placeholder="輸入繁體中文描述"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="template-description-en">描述 (English)</label>
                            <textarea id="template-description-en" name="description_en" rows="3" placeholder="Enter English description"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="template-content-zh">內容 (繁體中文) *</label>
                            <textarea id="template-content-zh" name="content_zh" rows="6" required placeholder="輸入繁體中文內容"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="template-content-en">內容 (English)</label>
                            <textarea id="template-content-en" name="content_en" rows="6" placeholder="Enter English content"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="template-status">狀態</label>
                            <select id="template-status" name="status">
                                <option value="active">啟用</option>
                                <option value="draft">草稿</option>
                                <option value="inactive">停用</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        取消
                    </button>
                    <button class="btn btn-primary" onclick="templateManager.createTemplate()">
                        <i class="fas fa-save"></i> 儲存模板
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  /**
   * 創建新模板
   */
  async createTemplate() {
    const form = document.getElementById("template-form");
    if (!form) return;

    const formData = new FormData(form);
    const templateData = {
      code: formData.get("code"),
      category: formData.get("category"),
      title: {
        zh: formData.get("title_zh"),
        en: formData.get("title_en") || formData.get("title_zh"),
      },
      description: {
        zh: formData.get("description_zh") || "",
        en: formData.get("description_en") || "",
      },
      content: {
        zh: formData.get("content_zh"),
        en: formData.get("content_en") || formData.get("content_zh"),
      },
      status: formData.get("status") || "active",
    };

    // 驗證必填欄位
    if (
      !templateData.code ||
      !templateData.category ||
      !templateData.title.zh ||
      !templateData.content.zh
    ) {
      this.showError("請填寫所有必填欄位");
      return;
    }

    try {
      // 顯示載入狀態
      const saveButton = document.querySelector('.modal-footer .btn-primary');
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
      saveButton.disabled = true;

      // 發送 API 請求
      const response = await fetch('api/save-template.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '保存失敗');
      }

      if (result.success) {
        // 重新載入模板數據
        await this.loadTemplates();
        this.applyFilters();

        // 關閉模態框
        document.querySelector(".modal-overlay")?.remove();

        this.showSuccess("模板創建成功！");
      } else {
        throw new Error(result.message || '保存失敗');
      }

    } catch (error) {
      console.error('保存模板失敗:', error);
      this.showError(error.message || '保存失敗，請重試');
    } finally {
      // 恢復按鈕狀態
      const saveButton = document.querySelector('.modal-footer .btn-primary');
      if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-save"></i> 儲存模板';
        saveButton.disabled = false;
      }
    }
  }

  /**
   * 匯出模板數據
   */
  exportTemplates() {
    try {
      const exportData = {
        templates: this.templates,
        export_date: new Date().toISOString(),
        total_count: this.templates.length,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `templates_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      this.showSuccess("模板數據匯出成功！");
    } catch (error) {
      console.error("匯出失敗:", error);
      this.showError("匯出失敗，請重試");
    }
  }
}

// 全局實例
window.templateManager = new TemplateManager();
