/**
 * 模板詳情組件
 * 負責顯示單個模板的詳細信息
 */
class TemplateDetail {
  constructor(templateId) {
    this.templateId = templateId;
    this.template = null;
    this.currentLanguage = 'zh';
    this.editMode = false;
    this.variablesEditMode = false;
    this.variables = [];
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
      const response = await fetch(`data/templates/template-data.json`);
      const data = await response.json();
      const templates = data.templates;
      this.template = templates.find(t => t.id === this.templateId);
      
      if (!this.template) {
        throw new Error('模板不存在');
      }

      // 初始化變數
      this.initVariables();
      
      this.renderTemplateDetail();
    } catch (error) {
      console.error('載入模板失敗:', error);
      this.showError('載入模板失敗');
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
                                <label>使用次數</label>
                                <span class="template-usage">
                                    <i class="fas fa-chart-line"></i>
                                    ${this.template.usageCount || 0} 次
                                </span>
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
                            ${this.template.lastUsed ? `
                            <div class="info-item">
                                <label>最後使用</label>
                                <span>${this.formatDate(
                                  this.template.lastUsed
                                )}</span>
                            </div>
                            ` : ''}
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
                        <div class="content-actions">
                            <button class="btn btn-sm btn-secondary" onclick="templateDetail.toggleEditMode()">
                                <i class="fas fa-edit"></i>
                                ${this.editMode ? '取消編輯' : '編輯內容'}
                            </button>
                            ${this.editMode ? `
                                <button class="btn btn-sm btn-primary" onclick="templateDetail.saveContent()">
                                    <i class="fas fa-save"></i>
                                    保存
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="content-editor">
                            <textarea 
                                id="content-editor" 
                                class="content-textarea" 
                                ${this.editMode ? '' : 'readonly'}
                                placeholder="輸入模板內容..."
                            >${this.template.content[this.currentLanguage] || ''}</textarea>
                        </div>
                    </div>
                </div>

                <!-- 變數說明 -->
                <div class="template-variables-card card">
                    <div class="card-header">
                        <h2>變數說明</h2>
                        <div class="variables-actions">
                            <button class="btn btn-sm btn-secondary" onclick="templateDetail.toggleVariablesEditMode()">
                                <i class="fas fa-edit"></i>
                                ${this.variablesEditMode ? '取消編輯' : '編輯變數'}
                            </button>
                            ${this.variablesEditMode ? `
                                <button class="btn btn-sm btn-primary" onclick="templateDetail.saveVariables()">
                                    <i class="fas fa-save"></i>
                                    保存
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="variables-editor">
                            <div class="variables-list" id="variables-list">
                                ${this.renderVariables()}
                            </div>
                            ${this.variablesEditMode ? `
                                <div class="add-variable-section">
                                    <button class="btn btn-sm btn-outline" onclick="templateDetail.addVariable()">
                                        <i class="fas fa-plus"></i>
                                        添加變數
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- 相關圖片 -->
                <div class="template-images-card card">
                    <div class="card-header">
                        <h2>相關圖片</h2>
                        <button class="btn btn-sm btn-primary" onclick="templateDetail.addImage()">
                            <i class="fas fa-plus"></i>
                            添加圖片
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="images-container">
                            ${this.renderImages()}
                        </div>
                    </div>
                </div>

                <!-- JSON檔 -->
                <div class="template-json-card card">
                    <div class="card-header">
                        <h2>JSON檔</h2>
                        <div class="json-actions">
                            <button class="btn btn-sm btn-secondary" onclick="templateDetail.copyJSON()">
                                <i class="fas fa-copy"></i>
                                複製JSON
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="templateDetail.downloadJSON()">
                                <i class="fas fa-download"></i>
                                下載JSON
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="json-container">
                            <pre class="json-content" id="template-json">${this.generateJSON()}</pre>
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
    try {
      const content = this.template.content[this.currentLanguage] || this.template.content.zh || "";
      
      // 複製到剪貼板
      await navigator.clipboard.writeText(content);
      
      // 統計使用次數
      await this.incrementUsage();
      
      this.showSuccess("模板內容已複製到剪貼板");
    } catch (error) {
      console.error("複製模板失敗:", error);
      this.showError("複製失敗，請手動複製");
    }
  }

  /**
   * 增加使用次數
   */
  async incrementUsage() {
    try {
      const response = await fetch('api/increment-usage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: this.templateId
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 更新本地數據
          this.template.usageCount = result.data.usageCount;
          this.template.lastUsed = result.data.lastUsed;
          // 重新渲染以顯示更新後的使用次數
          this.renderTemplateDetail();
        }
      }
    } catch (error) {
      console.error('統計使用次數失敗:', error);
      // 不顯示錯誤，因為這不影響主要功能
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
      return '<p class="no-variables">此模板沒有使用變數</p>';
    }

    return uniqueVariables
      .map((variable) => {
        const number = variable.match(/\d+/)[0];
        return `
          <div class="variable-item">
            <span class="variable-code">${variable}</span>
            <span class="variable-description">變數 ${number}</span>
          </div>
        `;
      })
      .join("");
  }

  /**
   * 渲染圖片列表
   */
  renderImages() {
    const images = this.template.images || [];
    
    if (images.length === 0) {
      return `
        <div class="no-images">
          <i class="fas fa-image"></i>
          <p>暫無相關圖片</p>
          <button class="btn btn-outline" onclick="templateDetail.addImage()">
            <i class="fas fa-plus"></i>
            添加第一張圖片
          </button>
        </div>
      `;
    }

    return `
      <div class="images-grid">
        ${images.map((image, index) => `
          <div class="image-item" data-index="${index}">
            <div class="image-preview">
              <img src="${image.url}" alt="${image.title || '相關圖片'}" 
                   onclick="templateDetail.previewImage('${image.url}', '${image.title || ''}')">
              <div class="image-overlay">
                <button class="btn btn-sm btn-light" onclick="templateDetail.editImage(${index})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="templateDetail.deleteImage(${index})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="image-info">
              <h4>${image.title || '未命名圖片'}</h4>
              <p>${image.description || ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * 添加圖片
   */
  addImage() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加相關圖片</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <form id="image-form" class="image-form">
            <div class="form-group">
              <label>圖片標題</label>
              <input type="text" id="image-title" class="form-input" placeholder="輸入圖片標題">
            </div>
            <div class="form-group">
              <label>圖片描述</label>
              <textarea id="image-description" class="form-input" rows="3" placeholder="輸入圖片描述"></textarea>
            </div>
            <div class="form-group">
              <label>圖片URL</label>
              <input type="url" id="image-url" class="form-input" placeholder="https://example.com/image.jpg" required>
              <small>請輸入圖片的完整URL地址</small>
            </div>
            <div class="form-group">
              <label>或上傳圖片</label>
              <input type="file" id="image-file" class="form-input" accept="image/*">
              <small>支援 JPG, PNG, GIF 格式，最大 5MB</small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            取消
          </button>
          <button class="btn btn-primary" onclick="templateDetail.saveImage()">
            <i class="fas fa-save"></i>
            保存圖片
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * 保存圖片
   */
  async saveImage() {
    const title = document.getElementById("image-title").value.trim();
    const description = document.getElementById("image-description").value.trim();
    const url = document.getElementById("image-url").value.trim();
    const file = document.getElementById("image-file").files[0];

    if (!url && !file) {
      this.showError("請輸入圖片URL或選擇圖片檔案");
      return;
    }

    try {
      let imageUrl = url;
      
      // 如果有上傳檔案，先處理檔案
      if (file) {
        imageUrl = await this.uploadImage(file);
      }

      const imageData = {
        title: title || '未命名圖片',
        description: description,
        url: imageUrl,
        addedAt: new Date().toISOString()
      };

      // 添加到模板的圖片列表
      if (!this.template.images) {
        this.template.images = [];
      }
      this.template.images.push(imageData);

      // 保存到後端
      await this.saveTemplateImages();

      // 關閉模態框並重新渲染
      document.querySelector(".modal-overlay").remove();
      this.renderTemplateDetail();
      this.showSuccess("圖片添加成功");
    } catch (error) {
      console.error("保存圖片失敗:", error);
      this.showError("保存圖片失敗: " + error.message);
    }
  }

  /**
   * 上傳圖片
   */
  async uploadImage(file) {
    // 這裡可以實現圖片上傳到伺服器的邏輯
    // 目前先返回一個預設的URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result); // 返回 base64 格式
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 預覽圖片
   */
  previewImage(url, title) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>${title || '圖片預覽'}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img src="${url}" alt="${title || '圖片預覽'}" style="max-width: 100%; height: auto;">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * 編輯圖片
   */
  editImage(index) {
    const image = this.template.images[index];
    if (!image) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>編輯圖片</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <form id="edit-image-form" class="image-form">
            <div class="form-group">
              <label>圖片標題</label>
              <input type="text" id="edit-image-title" class="form-input" value="${image.title || ''}" placeholder="輸入圖片標題">
            </div>
            <div class="form-group">
              <label>圖片描述</label>
              <textarea id="edit-image-description" class="form-input" rows="3" placeholder="輸入圖片描述">${image.description || ''}</textarea>
            </div>
            <div class="form-group">
              <label>圖片URL</label>
              <input type="url" id="edit-image-url" class="form-input" value="${image.url}" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            取消
          </button>
          <button class="btn btn-primary" onclick="templateDetail.updateImage(${index})">
            <i class="fas fa-save"></i>
            更新圖片
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * 更新圖片
   */
  async updateImage(index) {
    const title = document.getElementById("edit-image-title").value.trim();
    const description = document.getElementById("edit-image-description").value.trim();
    const url = document.getElementById("edit-image-url").value.trim();

    if (!url) {
      this.showError("請輸入圖片URL");
      return;
    }

    try {
      this.template.images[index] = {
        ...this.template.images[index],
        title: title || '未命名圖片',
        description: description,
        url: url,
        updatedAt: new Date().toISOString()
      };

      // 保存到後端
      await this.saveTemplateImages();

      // 關閉模態框並重新渲染
      document.querySelector(".modal-overlay").remove();
      this.renderTemplateDetail();
      this.showSuccess("圖片更新成功");
    } catch (error) {
      console.error("更新圖片失敗:", error);
      this.showError("更新圖片失敗: " + error.message);
    }
  }

  /**
   * 刪除圖片
   */
  async deleteImage(index) {
    const image = this.template.images[index];
    if (!image) return;

    if (!confirm(`確定要刪除圖片「${image.title}」嗎？`)) {
      return;
    }

    try {
      this.template.images.splice(index, 1);
      
      // 保存到後端
      await this.saveTemplateImages();

      // 重新渲染
      this.renderTemplateDetail();
      this.showSuccess("圖片刪除成功");
    } catch (error) {
      console.error("刪除圖片失敗:", error);
      this.showError("刪除圖片失敗: " + error.message);
    }
  }

  /**
   * 保存模板圖片到後端
   */
  async saveTemplateImages() {
    try {
      const response = await fetch('api/save-template-images.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: this.templateId,
          images: this.template.images || []
        })
      });

      if (!response.ok) {
        throw new Error('保存失敗');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '保存失敗');
      }
    } catch (error) {
      console.warn("保存圖片到後端失敗，使用本地存儲:", error);
      // 備用方案：保存到本地存儲
      localStorage.setItem(`template_images_${this.templateId}`, JSON.stringify(this.template.images || []));
    }
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
   * 生成JSON
   */
  generateJSON() {
    return JSON.stringify(this.template, null, 2);
  }

  /**
   * 複製JSON
   */
  async copyJSON() {
    const json = this.generateJSON();
    try {
      await navigator.clipboard.writeText(json);
      this.showSuccess("JSON已複製到剪貼板");
    } catch (error) {
      console.error("複製JSON失敗:", error);
      this.showError("複製JSON失敗，請手動複製");
    }
  }

  /**
   * 下載JSON
   */
  downloadJSON() {
    const json = this.generateJSON();
    const filename = `${this.template.code}_${this.currentLanguage}_template.json`;

    if (window.utils && window.utils.fileUtils) {
      window.utils.fileUtils.download(json, filename);
      this.showSuccess("JSON已下載");
    } else {
      // 備用下載方法
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showSuccess("JSON已下載");
    }
  }

  /**
   * 切換編輯模式
   */
  toggleEditMode() {
    this.editMode = !this.editMode;
    this.renderTemplateDetail();
  }

  /**
   * 保存內容
   */
  async saveContent() {
    const content = document.getElementById('content-editor').value;
    
    try {
      const response = await fetch('api/save-template.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.templateId,
          content: {
            ...this.template.content,
            [this.currentLanguage]: content
          }
        })
      });

      if (response.ok) {
        this.template.content[this.currentLanguage] = content;
        this.editMode = false;
        this.showSuccess('內容保存成功');
        this.renderTemplateDetail();
      } else {
        throw new Error('保存失敗');
      }
    } catch (error) {
      console.error('保存內容失敗:', error);
      this.showError('保存內容失敗');
    }
  }

  /**
   * 切換變數編輯模式
   */
  toggleVariablesEditMode() {
    this.variablesEditMode = !this.variablesEditMode;
    this.renderTemplateDetail();
  }

  /**
   * 渲染變數列表
   */
  renderVariables() {
    if (this.variablesEditMode) {
      return this.variables.map((variable, index) => `
        <div class="variable-item editable" data-index="${index}">
          <div class="variable-inputs">
            <input type="text" class="variable-name" value="${variable.name}" placeholder="變數名稱" onchange="templateDetail.updateVariable(${index}, 'name', this.value)">
            <input type="text" class="variable-description" value="${variable.description}" placeholder="變數說明" onchange="templateDetail.updateVariable(${index}, 'description', this.value)">
            <button class="btn btn-sm btn-danger" onclick="templateDetail.removeVariable(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    } else {
      return this.variables.map(variable => `
        <div class="variable-item">
          <div class="variable-name">${variable.name}</div>
          <div class="variable-description">${variable.description}</div>
        </div>
      `).join('');
    }
  }

  /**
   * 添加變數
   */
  addVariable() {
    this.variables.push({
      name: '',
      description: ''
    });
    this.renderTemplateDetail();
  }

  /**
   * 更新變數
   */
  updateVariable(index, field, value) {
    this.variables[index][field] = value;
  }

  /**
   * 移除變數
   */
  removeVariable(index) {
    this.variables.splice(index, 1);
    this.renderTemplateDetail();
  }

  /**
   * 保存變數
   */
  async saveVariables() {
    try {
      const response = await fetch('api/save-template.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.templateId,
          variables: this.variables
        })
      });

      if (response.ok) {
        this.template.variables = this.variables;
        this.variablesEditMode = false;
        this.showSuccess('變數說明保存成功');
        this.renderTemplateDetail();
      } else {
        throw new Error('保存失敗');
      }
    } catch (error) {
      console.error('保存變數失敗:', error);
      this.showError('保存變數失敗');
    }
  }

  /**
   * 初始化變數
   */
  initVariables() {
    if (this.template.variables && Array.isArray(this.template.variables)) {
      this.variables = [...this.template.variables];
    } else {
      // 從內容中自動提取變數
      this.variables = this.extractVariablesFromContent();
    }
  }

  /**
   * 從內容中提取變數
   */
  extractVariablesFromContent() {
    const content = this.template.content[this.currentLanguage] || '';
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables = new Set();
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      variables.add(match[1].trim());
    }

    return Array.from(variables).map(name => ({
      name: name,
      description: ''
    }));
  }
}

// 全局實例
window.templateDetail = null;
