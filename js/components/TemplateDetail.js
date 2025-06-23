/**
 * 模板詳情組件
 * 負責顯示單個模板的詳細信息
 */
class TemplateDetail {
  constructor(templateId) {
    this.templateId = templateId;
    this.template = null;
    this.currentLanguage = this.getStoredLanguage();
    this.init();
  }

  /**
   * 獲取存儲的語言設置
   */
  getStoredLanguage() {
    return localStorage.getItem("preferredLanguage") || "zh";
  }

  /**
   * 保存語言設置
   */
  setStoredLanguage(language) {
    localStorage.setItem("preferredLanguage", language);
  }

  /**
   * 初始化模板詳情
   */
  async init() {
    try {
      await this.loadTemplate();
      this.renderTemplateDetail();
      this.setupEventListeners();
      this.setupKeyboardShortcuts();
      console.log("✅ 模板詳情初始化完成");
    } catch (error) {
      console.error("❌ 模板詳情初始化失敗:", error);
      this.showError("模板加載失敗，請檢查模板ID");
    }
  }

  /**
   * 加載模板數據
   */
  async loadTemplate() {
    try {
      const response = await fetch("/data/templates/template-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.template = data.templates.find((t) => t.id === this.templateId);

      if (!this.template) {
        throw new Error(`模板 ${this.templateId} 不存在`);
      }

      console.log(`📚 成功加載模板: ${this.templateId}`);
    } catch (error) {
      console.error("❌ 加載模板數據失敗:", error);
      throw error;
    }
  }

  /**
   * 渲染模板詳情
   */
  renderTemplateDetail() {
    const container = document.getElementById("template-detail");
    if (!container) return;

    const title =
      this.template.title[this.currentLanguage] || this.template.title.zh || "";
    const description =
      this.template.description[this.currentLanguage] ||
      this.template.description.zh ||
      "";
    const content =
      this.template.content[this.currentLanguage] ||
      this.template.content.zh ||
      "";

    container.innerHTML = `
            <div class="template-detail-container">
                <!-- 頁面標題 -->
                <div class="page-header">
                    <div class="breadcrumb">
                        <a href="index.html">首頁</a>
                        <i class="fas fa-chevron-right"></i>
                        <span>模板詳情</span>
                    </div>
                    <h1 class="page-title">${title}</h1>
                </div>

                <!-- 模板信息卡片 -->
                <div class="template-info-card card">
                    <div class="card-header">
                        <h2>模板信息</h2>
                        <div class="language-switcher">
                            <button class="btn btn-sm ${
                              this.currentLanguage === "zh"
                                ? "btn-primary"
                                : "btn-secondary"
                            }" 
                                    data-language="zh" onclick="templateDetail.switchLanguage('zh')">
                                <i class="fas fa-flag"></i> 繁體中文
                            </button>
                            <button class="btn btn-sm ${
                              this.currentLanguage === "en"
                                ? "btn-primary"
                                : "btn-secondary"
                            }" 
                                    data-language="en" onclick="templateDetail.switchLanguage('en')">
                                <i class="fas fa-flag"></i> English
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <label>模板代碼</label>
                                <span class="template-code">${
                                  this.template.code
                                }</span>
                            </div>
                            <div class="info-item">
                                <label>分類</label>
                                <span class="template-category">${this.getCategoryName(
                                  this.template.category
                                )}</span>
                            </div>
                            <div class="info-item">
                                <label>狀態</label>
                                <span class="template-status ${
                                  this.template.status
                                }">${this.getStatusText(
      this.template.status
    )}</span>
                            </div>
                            <div class="info-item">
                                <label>創建時間</label>
                                <span>${this.formatDate(
                                  this.template.createdAt
                                )}</span>
                            </div>
                            <div class="info-item">
                                <label>更新時間</label>
                                <span>${this.formatDate(
                                  this.template.updatedAt
                                )}</span>
                            </div>
                        </div>
                        <div class="template-description">
                            <label>描述</label>
                            <p>${description}</p>
                        </div>
                    </div>
                </div>

                <!-- 操作按鈕 -->
                <div class="template-actions-card card">
                    <div class="card-header">
                        <h2>操作</h2>
                    </div>
                    <div class="card-body">
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="templateDetail.copyTemplate()">
                                <i class="fas fa-copy"></i>
                                複製模板內容
                            </button>
                            <button class="btn btn-secondary" onclick="templateDetail.downloadTemplate()">
                                <i class="fas fa-download"></i>
                                下載模板
                            </button>
                            <button class="btn btn-success" onclick="templateDetail.editTemplate()">
                                <i class="fas fa-edit"></i>
                                編輯模板
                            </button>
                            <button class="btn btn-warning" onclick="templateDetail.previewTemplate()">
                                <i class="fas fa-eye"></i>
                                預覽模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 模板內容 -->
                <div class="template-content-card card">
                    <div class="card-header">
                        <h2>模板內容</h2>
                    </div>
                    <div class="card-body">
                        <div class="content-preview">
                            <pre class="template-content">${this.escapeHtml(
                              content
                            )}</pre>
                        </div>
                    </div>
                </div>

                <!-- 變數說明 -->
                <div class="template-variables-card card">
                    <div class="card-header">
                        <h2>變數說明</h2>
                    </div>
                    <div class="card-body">
                        <div class="variables-list">
                            ${this.generateVariablesList(content)}
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners() {
    // 語言切換
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const language = e.target.closest("[data-language]").dataset.language;
        this.switchLanguage(language);
      });
    });
  }

  /**
   * 設置鍵盤快捷鍵
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Alt + Z 切換到中文
      if (e.altKey && e.key === "z") {
        this.switchLanguage("zh");
      }
      // Alt + E 切換到英文
      if (e.altKey && e.key === "e") {
        this.switchLanguage("en");
      }
    });
  }

  /**
   * 切換語言
   */
  switchLanguage(language) {
    if (this.currentLanguage === language) return;

    // 添加過渡動畫類
    const container = document.querySelector(".template-detail-container");
    container.classList.add("language-transition");

    // 更新語言
    this.currentLanguage = language;
    this.setStoredLanguage(language);

    // 更新UI
    this.renderTemplateDetail();
    this.setupEventListeners();

    // 更新語言切換按鈕狀態
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.classList.toggle(
        "btn-primary",
        button.dataset.language === language
      );
      button.classList.toggle(
        "btn-secondary",
        button.dataset.language !== language
      );
    });

    // 顯示通知
    this.showNotification(
      `已切換到${language === "zh" ? "中文" : "英文"}`,
      "success"
    );

    // 移除過渡動畫類
    setTimeout(() => {
      container.classList.remove("language-transition");
    }, 300);
  }

  /**
   * 複製模板內容
   */
  async copyTemplate() {
    const content =
      this.template.content[this.currentLanguage] ||
      this.template.content.zh ||
      "";

    try {
      await navigator.clipboard.writeText(content);
      this.showSuccess("模板內容已複製到剪貼板");
    } catch (error) {
      console.error("複製失敗:", error);
      this.showError("複製失敗，請手動複製");
    }
  }

  /**
   * 下載模板
   */
  downloadTemplate() {
    const content =
      this.template.content[this.currentLanguage] ||
      this.template.content.zh ||
      "";
    const filename = `${this.template.code}_${this.currentLanguage}.txt`;

    if (window.utils && window.utils.fileUtils) {
      window.utils.fileUtils.download(content, filename);
      this.showSuccess("模板已下載");
    } else {
      // 備用下載方法
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showSuccess("模板已下載");
    }
  }

  /**
   * 編輯模板
   */
  editTemplate() {
    const title =
      this.template.title[this.currentLanguage] || this.template.title.zh || "";
    const content =
      this.template.content[this.currentLanguage] ||
      this.template.content.zh ||
      "";
    // 新增：取得所有模板代碼（用於驗證）
    let allTemplates = [];
    if (window.utils && window.utils.storage) {
      allTemplates = window.utils.storage.get("templates", []);
    }
    // 創建編輯模態框
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h3>編輯模板 - ${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="edit-form">
                        <div class="form-group">
                            <label>模板代碼 <span style='color:#ef4444'>*</span></label>
                            <input type="text" id="edit-code" value="${
                              this.template.code
                            }" class="form-input" maxlength="50" autocomplete="off" required>
                            <small class="code-hint">代碼需唯一，例：IC_WELCOME</small>
                        </div>
                        <div class="form-group">
                            <label>狀態</label>
                            <select id="edit-status" class="form-input">
                                <option value="active" ${
                                  this.template.status === "active"
                                    ? "selected"
                                    : ""
                                }>啟用</option>
                                <option value="draft" ${
                                  this.template.status === "draft"
                                    ? "selected"
                                    : ""
                                }>草稿</option>
                                <option value="inactive" ${
                                  this.template.status === "inactive"
                                    ? "selected"
                                    : ""
                                }>停用</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>模板標題 (繁體中文)</label>
                            <input type="text" id="edit-title-zh" value="${
                              this.template.title.zh || ""
                            }" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>模板標題 (English)</label>
                            <input type="text" id="edit-title-en" value="${
                              this.template.title.en || ""
                            }" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>模板描述 (繁體中文)</label>
                            <textarea id="edit-description-zh" class="form-textarea">${
                              this.template.description.zh || ""
                            }</textarea>
                        </div>
                        <div class="form-group">
                            <label>模板描述 (English)</label>
                            <textarea id="edit-description-en" class="form-textarea">${
                              this.template.description.en || ""
                            }</textarea>
                        </div>
                        <div class="form-group">
                            <label>模板內容 (繁體中文)</label>
                            <textarea id="edit-content-zh" class="form-textarea" rows="10">${
                              this.template.content.zh || ""
                            }</textarea>
                        </div>
                        <div class="form-group">
                            <label>模板內容 (English)</label>
                            <textarea id="edit-content-en" class="form-textarea" rows="10">${
                              this.template.content.en || ""
                            }</textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        取消
                    </button>
                    <button class="btn btn-primary" onclick="templateDetail.saveTemplate()">
                        <i class="fas fa-save"></i>
                        保存
                    </button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  /**
   * 保存模板
   */
  async saveTemplate() {
    // 獲取編輯的值
    const newCode = document.getElementById("edit-code").value.trim();
    const newStatus = document.getElementById("edit-status").value;
    const validStatus = ["active", "draft", "inactive"];
    
    // 驗證：代碼不可為空
    if (!newCode) {
      this.showError("模板代碼不可為空");
      return;
    }
    
    // 驗證：狀態合法
    if (!validStatus.includes(newStatus)) {
      this.showError("狀態不正確");
      return;
    }
    
    // 檢查代碼唯一性（允許本身）
    if (window.templateManager && window.templateManager.templates) {
      const existingTemplate = window.templateManager.templates.find(
        (t) => t.id !== this.templateId && t.code === newCode
      );
      if (existingTemplate) {
        this.showError("模板代碼已存在，請使用其他代碼");
        return;
      }
    }
    
    // 準備更新的模板資料
    const updatedTemplate = {
      id: newCode,
      code: newCode,
      category: this.template.category,
      status: newStatus,
      title: {
        zh: document.getElementById("edit-title-zh").value,
        en: document.getElementById("edit-title-en").value,
      },
      description: {
        zh: document.getElementById("edit-description-zh").value,
        en: document.getElementById("edit-description-en").value,
      },
      content: {
        zh: document.getElementById("edit-content-zh").value,
        en: document.getElementById("edit-content-en").value,
      },
    };
    
    try {
      // 顯示載入狀態
      const saveButton = document.querySelector('.modal-footer .btn-primary');
      if (saveButton) {
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
        saveButton.disabled = true;
      }
      
      // 發送 API 請求
      const response = await fetch('api/save-template.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTemplate)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '保存失敗');
      }
      
      if (result.success) {
        // 更新本地資料
        this.template = {
          ...this.template,
          ...updatedTemplate,
          updatedAt: new Date().toISOString(),
        };
        this.templateId = newCode; // 若代碼有變更，更新當前ID
        
        // 重新載入模板管理器的資料
        if (window.templateManager) {
          await window.templateManager.reloadTemplates();
        }
        
        // 重新渲染詳情頁面
        this.renderTemplateDetail();
        this.setupEventListeners();
        
        // 關閉編輯模態框
        const editModal = document.querySelector(".modal-overlay");
        if (editModal) {
          editModal.remove();
        }
        
        this.showSuccess("模板已成功保存");
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
        saveButton.innerHTML = '<i class="fas fa-save"></i> 保存模板';
        saveButton.disabled = false;
      }
    }
  }

  /**
   * 預覽模板
   */
  previewTemplate() {
    const content =
      this.template.content[this.currentLanguage] ||
      this.template.content.zh ||
      "";
    const title =
      this.template.title[this.currentLanguage] || this.template.title.zh || "";

    // 創建預覽模態框
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>預覽模板 - ${title}</h3>
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
                    <button class="btn btn-primary" onclick="templateDetail.copyTemplate()">
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
   * 生成變數列表
   */
  generateVariablesList(content) {
    const variables = content.match(/\{\{(\d+)\}\}/g) || [];
    const uniqueVariables = [...new Set(variables)].sort();

    if (uniqueVariables.length === 0) {
      return "<p>此模板沒有使用變數。</p>";
    }

    return `
            <div class="variables-grid">
                ${uniqueVariables
                  .map(
                    (variable) => `
                    <div class="variable-item">
                        <span class="variable-code">${variable}</span>
                        <span class="variable-desc">請根據實際情況替換此變數</span>
                    </div>
                `
                  )
                  .join("")}
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
   * 格式化日期
   */
  formatDate(dateString) {
    if (window.utils && window.utils.formatDate) {
      return window.utils.formatDate(new Date(dateString), "YYYY-MM-DD HH:mm");
    }
    return new Date(dateString).toLocaleString("zh-TW");
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
}

// 全局實例
window.templateDetail = null;
