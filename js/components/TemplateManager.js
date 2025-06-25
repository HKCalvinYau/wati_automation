/**
 * 模板管理器組件
 * 負責加載、過濾、顯示和管理所有模板
 */
class TemplateManager {
  constructor(app = null, autoInit = true) {
    this.app = app;
    this.templates = [];
    this.filteredTemplates = [];
    this.currentCategory = "all";
    this.currentLanguage = "zh";
    this.searchQuery = "";
    
    // 多選功能相關屬性
    this.isSelectionMode = false;
    this.selectedTemplates = new Set();
    
    if (autoInit) {
      this.init();
    }
  }

  /**
   * 初始化模板管理器
   */
  async init() {
    try {
      console.log("🔄 開始初始化模板管理器...");
      await this.loadTemplates();
      console.log(`📊 載入完成，模板數量: ${this.templates.length}`);
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
   * 重新載入模板數據
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
      // 更新統計
      this.updateStats();
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
   * 渲染單個模板卡片
   */
  renderTemplateCard(template) {
    const title =
      template.title[this.currentLanguage] || template.title.zh || "";
    const description =
      template.description[this.currentLanguage] ||
      template.description.zh ||
      "";
    
    const isSelected = this.selectedTemplates.has(template.id);
    const selectedClass = isSelected ? "selected" : "";
    const checkboxChecked = isSelected ? "checked" : "";

    return `
            <div class="template-card ${selectedClass}" data-template-id="${template.id}">
                ${this.isSelectionMode ? `
                <input type="checkbox" class="template-checkbox" ${checkboxChecked} 
                       onclick="event.stopPropagation(); templateManager.toggleTemplateSelection('${template.id}')">
                ` : ''}
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
                    <span class="template-usage">
                        <i class="fas fa-chart-line"></i>
                        ${template.usageCount || 0} 次
                    </span>
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
      // 複製到剪貼板
      await navigator.clipboard.writeText(content);
      
      // 統計使用次數
      await this.incrementUsage(templateId);
      
      this.showSuccess("模板內容已複製到剪貼板");
    } catch (error) {
      console.error("複製失敗:", error);
      this.showError("複製失敗，請手動複製");
    }
  }

  /**
   * 增加使用次數
   */
  async incrementUsage(templateId) {
    try {
      const response = await fetch('api/increment-usage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: templateId
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 更新本地數據
          const template = this.templates.find(t => t.id === templateId);
          if (template) {
            template.usageCount = result.data.usageCount;
            template.lastUsed = result.data.lastUsed;
            // 重新渲染以顯示更新後的使用次數
            this.renderTemplates();
          }
        }
      }
    } catch (error) {
      console.error('統計使用次數失敗:', error);
      // 不顯示錯誤，因為這不影響主要功能
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
    if (window.notificationManager) {
      window.notificationManager.success(message, 2000);
    } else {
      this.showNotification(message, "success");
    }
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    if (window.notificationManager) {
      window.notificationManager.error(message, 2000);
    } else {
      this.showNotification(message, "error");
    }
  }

  /**
   * 顯示通知
   */
  showNotification(message, type = "info") {
    if (window.notificationManager) {
      window.notificationManager.show(message, type, 2000);
    } else {
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
      }, 2000);
    }
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
      id: formData.get("code"), // 使用代碼作為 ID
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

    // 檢查代碼是否已存在
    const existingTemplate = this.templates.find(t => t.code === templateData.code);
    if (existingTemplate) {
      this.showError("模板代碼已存在，請使用其他代碼");
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
   * 更新統計
   */
  updateStats() {
    const totalCount = document.getElementById("total-count");
    if (totalCount) {
      totalCount.textContent = this.filteredTemplates.length;
    }
  }

  /**
   * 切換多選模式
   */
  toggleSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    this.selectedTemplates.clear();
    
    const selectionBtn = document.getElementById("selection-mode-btn");
    const batchActions = document.getElementById("batch-actions");
    const templatesContainer = document.getElementById("templates-container");
    
    if (this.isSelectionMode) {
      selectionBtn.classList.add("active");
      selectionBtn.innerHTML = '<i class="fas fa-times"></i> 退出多選';
      batchActions.style.display = "flex";
      templatesContainer.classList.add("selection-mode");
    } else {
      selectionBtn.classList.remove("active");
      selectionBtn.innerHTML = '<i class="fas fa-check-square"></i> 多選模式';
      batchActions.style.display = "none";
      templatesContainer.classList.remove("selection-mode");
    }
    
    this.updateSelectedCount();
    this.renderTemplates();
  }

  /**
   * 全選模板
   */
  selectAll() {
    this.selectedTemplates.clear();
    this.filteredTemplates.forEach(template => {
      this.selectedTemplates.add(template.id);
    });
    this.updateSelectedCount();
    this.renderTemplates();
  }

  /**
   * 取消全選
   */
  deselectAll() {
    this.selectedTemplates.clear();
    this.updateSelectedCount();
    this.renderTemplates();
  }

  /**
   * 切換單個模板的選中狀態
   */
  toggleTemplateSelection(templateId) {
    if (this.selectedTemplates.has(templateId)) {
      this.selectedTemplates.delete(templateId);
    } else {
      this.selectedTemplates.add(templateId);
    }
    this.updateSelectedCount();
    this.renderTemplates();
  }

  /**
   * 更新已選擇數量顯示
   */
  updateSelectedCount() {
    const selectedCount = document.getElementById("selected-count");
    if (selectedCount) {
      selectedCount.textContent = this.selectedTemplates.size;
    }
  }

  /**
   * 匯出選中的模板
   */
  exportSelectedTemplates() {
    if (this.selectedTemplates.size === 0) {
      this.showError("請先選擇要匯出的模板");
      return;
    }

    try {
      const selectedTemplatesData = this.templates.filter(template => 
        this.selectedTemplates.has(template.id)
      );

      const data = {
        templates: selectedTemplatesData,
        metadata: {
          totalTemplates: selectedTemplatesData.length,
          exportDate: new Date().toISOString(),
          version: "2.0.0",
          exportType: "selected"
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected-templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showSuccess(`已匯出 ${selectedTemplatesData.length} 個選中的模板`);
    } catch (error) {
      console.error("❌ 匯出選中模板失敗:", error);
      this.showError("匯出失敗: " + error.message);
    }
  }

  /**
   * 刪除選中的模板
   */
  deleteSelectedTemplates() {
    if (this.selectedTemplates.size === 0) {
      this.showError("請先選擇要刪除的模板");
      return;
    }

    const confirmMessage = `確定要刪除選中的 ${this.selectedTemplates.size} 個模板嗎？此操作無法復原。`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      // 從模板列表中移除選中的模板
      this.templates = this.templates.filter(template => 
        !this.selectedTemplates.has(template.id)
      );
      
      // 清空選中狀態
      this.selectedTemplates.clear();
      this.updateSelectedCount();
      
      // 重新應用過濾器
      this.applyFilters();
      
      this.showSuccess(`已刪除 ${this.selectedTemplates.size} 個模板`);
    } catch (error) {
      console.error("❌ 刪除模板失敗:", error);
      this.showError("刪除失敗: " + error.message);
    }
  }
}

// 設為全域變數
window.TemplateManager = TemplateManager;