/**
 * 模板管理器組件 - 簡化版本
 * 不使用 ES6 模組語法，可直接在瀏覽器中運行
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
      // 嘗試從 API 載入資料
      const response = await fetch("api/get-templates.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.success) {
        this.templates = result.data.templates || [];
        this.filteredTemplates = [...this.templates];
        console.log(`📚 成功從 API 載入 ${this.templates.length} 個模板`);
      } else {
        throw new Error(result.message || 'API 返回錯誤');
      }
    } catch (error) {
      console.warn("⚠️ API 載入失敗，嘗試從靜態檔案載入:", error);
      
      // 備用方案：從靜態檔案載入
      try {
        const response = await fetch("data/templates/template-data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.templates = data.templates || [];
        this.filteredTemplates = [...this.templates];
        console.log(`📚 成功從靜態檔案載入 ${this.templates.length} 個模板`);
      } catch (fallbackError) {
        console.error("❌ 所有載入方式都失敗:", fallbackError);
        this.templates = [];
        this.filteredTemplates = [];
        throw new Error("無法載入模板資料，請檢查網路連接或聯繫管理員");
      }
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
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>沒有找到符合條件的模板</p>
        </div>
      `;
      return;
    }

    const templatesHTML = this.filteredTemplates
      .map((template) => this.renderTemplateCard(template))
      .join("");

    container.innerHTML = templatesHTML;

    // 更新統計
    this.updateStats();
  }

  /**
   * 渲染模板卡片
   */
  renderTemplateCard(template) {
    const title = template.title[this.currentLanguage] || template.title.zh || "";
    const description = template.description[this.currentLanguage] || template.description.zh || "";
    const categoryName = this.getCategoryName(template.category);
    const statusText = this.getStatusText(template.status);

    return `
      <div class="template-card" data-template-id="${template.id}">
        <div class="template-header">
          <h3 class="template-title">${this.escapeHtml(title)}</h3>
          <div class="template-meta">
            <span class="template-category">${categoryName}</span>
            <span class="template-status status-${template.status}">${statusText}</span>
          </div>
        </div>
        <div class="template-content">
          <p class="template-description">${this.escapeHtml(description)}</p>
          <div class="template-code">
            <code>${this.escapeHtml(template.code)}</code>
          </div>
        </div>
        <div class="template-actions">
          <button class="btn btn-sm btn-primary" onclick="templateManager.previewTemplate('${template.id}')">
            <i class="fas fa-eye"></i> 預覽
          </button>
          <button class="btn btn-sm btn-secondary" onclick="templateManager.copyTemplate('${template.id}')">
            <i class="fas fa-copy"></i> 複製
          </button>
          <button class="btn btn-sm btn-outline" onclick="templateManager.editTemplate('${template.id}')">
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
      oi: "其他資訊"
    };
    return categoryNames[category] || category;
  }

  /**
   * 獲取狀態文本
   */
  getStatusText(status) {
    const statusTexts = {
      active: "啟用",
      draft: "草稿",
      inactive: "停用"
    };
    return statusTexts[status] || status;
  }

  /**
   * 預覽模板
   */
  previewTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    const content = template.content[this.currentLanguage] || template.content.zh || "";
    alert(`模板預覽：\n\n${content}`);
  }

  /**
   * 複製模板
   */
  async copyTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    try {
      const content = template.content[this.currentLanguage] || template.content.zh || "";
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
    // 跳轉到編輯頁面
    window.location.href = `detail.html?id=${templateId}`;
  }

  /**
   * 更新統計
   */
  updateStats() {
    const totalCount = document.getElementById("total-count");
    if (totalCount) {
      totalCount.textContent = this.filteredTemplates.length;
    }
  }

  /**
   * 重新載入模板
   */
  async reloadTemplates() {
    try {
      await this.loadTemplates();
      this.applyFilters();
      this.showSuccess("模板資料已重新載入");
    } catch (error) {
      console.error("❌ 重新載入失敗:", error);
      this.showError("重新載入失敗: " + error.message);
    }
  }

  /**
   * 導出模板數據
   */
  exportTemplates() {
    try {
      const data = {
        templates: this.templates,
        metadata: {
          totalTemplates: this.templates.length,
          exportDate: new Date().toISOString(),
          version: "2.0.0"
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showSuccess("模板數據已導出");
    } catch (error) {
      console.error("❌ 導出失敗:", error);
      this.showError("導出失敗: " + error.message);
    }
  }

  /**
   * HTML 轉義
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 顯示成功訊息
   */
  showSuccess(message) {
    console.log("✅ " + message);
    // 可以添加更好的通知系統
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    console.error("❌ " + message);
    // 可以添加更好的通知系統
  }
}

// 創建全域實例
window.templateManager = new TemplateManager(); 