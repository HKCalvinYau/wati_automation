/**
 * 應用程序核心模組
 * 負責初始化和管理整個應用程序
 */

class App {
  constructor() {
    this.config = {
      version: "2.0.0",
      name: "Pet Memorial Template System",
      defaultLanguage: "zh",
      supportedLanguages: ["zh", "en"],
      apiEndpoints: {
        templates: "/data/templates/template-data.json",
        categories: "/data/categories.json",
      },
    };

    this.state = {
      currentLanguage: "zh",
      isLoading: false,
      templates: [],
      categories: [],
      recentTemplates: [],
      searchResults: [],
    };

    this.modules = {};
    this.init();
  }

  /**
   * 初始化應用程序
   */
  async init() {
    try {
      this.showLoading();

      // 初始化核心模組
      await this.initializeModules();

      // 載入數據
      await this.loadData();

      // 設置事件監聽器
      this.setupEventListeners();

      // 渲染初始界面
      this.render();

      // 隱藏載入畫面
      this.hideLoading();

      console.log("✅ 應用程序初始化完成");
    } catch (error) {
      console.error("❌ 應用程序初始化失敗:", error);
      this.showError("應用程序初始化失敗，請重新整理頁面");
    }
  }

  /**
   * 初始化核心模組
   */
  async initializeModules() {
    // 語言管理模組
    this.modules.language = new LanguageManager(this);

    // 通知管理模組
    this.modules.notification = new NotificationManager();

    // 模態對話框管理模組
    this.modules.modal = new ModalManager();

    // 模板管理模組
    this.modules.template = new TemplateManager(this);

    // 類別管理模組
    this.modules.category = new CategoryManager(this);

    // 搜索管理模組
    this.modules.search = new SearchManager(this);

    // 儲存管理模組
    this.modules.storage = new StorageManager();

    console.log("✅ 核心模組初始化完成");
  }

  /**
   * 載入應用程序數據
   */
  async loadData() {
    try {
      // 載入模板數據
      const templatesData = await this.loadTemplates();
      this.state.templates = templatesData.templates || [];

      // 載入類別數據
      const categoriesData = await this.loadCategories();
      this.state.categories = categoriesData.categories || [];

      // 載入最近使用的模板
      this.state.recentTemplates = this.modules.storage.getRecentTemplates();

      console.log(
        `✅ 數據載入完成: ${this.state.templates.length} 個模板, ${this.state.categories.length} 個類別`
      );
    } catch (error) {
      console.error("❌ 數據載入失敗:", error);
      throw error;
    }
  }

  /**
   * 載入模板數據
   */
  async loadTemplates() {
    try {
      const response = await fetch(this.config.apiEndpoints.templates);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("⚠️  無法載入模板數據，使用本地數據");
      return this.getDefaultTemplates();
    }
  }

  /**
   * 載入類別數據
   */
  async loadCategories() {
    try {
      const response = await fetch(this.config.apiEndpoints.categories);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("⚠️  無法載入類別數據，使用默認類別");
      return this.getDefaultCategories();
    }
  }

  /**
   * 獲取默認模板數據
   */
  getDefaultTemplates() {
    return {
      templates: [],
      metadata: {
        totalTemplates: 0,
        categories: {},
        lastUpdated: new Date().toISOString(),
        version: this.config.version,
      },
    };
  }

  /**
   * 獲取默認類別數據
   */
  getDefaultCategories() {
    return {
      categories: [
        {
          code: "ic",
          name: { zh: "初始聯繫", en: "Initial Contact" },
          description: {
            zh: "與客戶的初次接觸和諮詢",
            en: "Initial contact and consultation with clients",
          },
          icon: "fas fa-handshake",
          templateCount: 0,
        },
        {
          code: "ac",
          name: { zh: "預約確認", en: "Appointment Confirmation" },
          description: {
            zh: "服務預約的確認和安排",
            en: "Service appointment confirmation and arrangement",
          },
          icon: "fas fa-calendar-check",
          templateCount: 0,
        },
        {
          code: "ps",
          name: { zh: "服務後跟進", en: "Post Service" },
          description: {
            zh: "服務完成後的跟進和關懷",
            en: "Follow-up and care after service completion",
          },
          icon: "fas fa-heart",
          templateCount: 0,
        },
        {
          code: "pp",
          name: { zh: "產品及服務推廣", en: "Product Promotion" },
          description: {
            zh: "產品和服務的推廣信息",
            en: "Product and service promotion information",
          },
          icon: "fas fa-gift",
          templateCount: 0,
        },
        {
          code: "pi",
          name: { zh: "付款信息", en: "Payment Information" },
          description: {
            zh: "付款相關的通知和信息",
            en: "Payment-related notifications and information",
          },
          icon: "fas fa-credit-card",
          templateCount: 0,
        },
        {
          code: "ci",
          name: { zh: "公司資料", en: "Company Information" },
          description: {
            zh: "公司基本資料和介紹",
            en: "Company basic information and introduction",
          },
          icon: "fas fa-building",
          templateCount: 0,
        },
        {
          code: "li",
          name: { zh: "物流信息", en: "Logistics Information" },
          description: {
            zh: "物流和配送相關信息",
            en: "Logistics and delivery related information",
          },
          icon: "fas fa-truck",
          templateCount: 0,
        },
        {
          code: "oi",
          name: { zh: "其他信息", en: "Other Information" },
          description: {
            zh: "其他相關信息和通知",
            en: "Other related information and notifications",
          },
          icon: "fas fa-info-circle",
          templateCount: 0,
        },
      ],
    };
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners() {
    // 搜索輸入事件
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.modules.search.handleSearchInput(e.target.value);
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.modules.search.performSearch();
        }
      });
    }

    // 語言切換事件
    document.addEventListener("click", (e) => {
      if (e.target.closest(".lang-btn")) {
        const lang = e.target.closest(".lang-btn").dataset.lang;
        this.modules.language.switchLanguage(lang);
      }
    });

    // 全局錯誤處理
    window.addEventListener("error", (e) => {
      console.error("全局錯誤:", e.error);
      this.modules.notification.show("發生錯誤，請重新整理頁面", "error");
    });

    // 頁面可見性變化
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.onPageVisible();
      }
    });
  }

  /**
   * 渲染應用程序界面
   */
  render() {
    // 更新統計信息
    this.updateStats();

    // 渲染類別網格
    this.modules.category.renderCategories();

    // 渲染最近使用的模板
    this.renderRecentTemplates();

    // 更新語言顯示
    this.modules.language.updateLanguageDisplay();
  }

  /**
   * 更新統計信息
   */
  updateStats() {
    const totalTemplates = this.state.templates.length;
    const activeTemplates = this.state.templates.filter(
      (t) => t.status === "active"
    ).length;

    const totalElement = document.getElementById("total-templates");
    const activeElement = document.getElementById("active-templates");

    if (totalElement) totalElement.textContent = totalTemplates;
    if (activeElement) activeElement.textContent = activeTemplates;
  }

  /**
   * 渲染最近使用的模板
   */
  renderRecentTemplates() {
    const container = document.getElementById("recent-templates");
    if (!container) return;

    if (this.state.recentTemplates.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p class="empty-text-zh">還沒有最近使用的模板</p>
                    <p class="empty-text-en" style="display: none;">No recently used templates</p>
                </div>
            `;
      return;
    }

    const templatesHTML = this.state.recentTemplates
      .slice(0, 6)
      .map((template) => this.modules.template.renderTemplateCard(template))
      .join("");

    container.innerHTML = templatesHTML;
  }

  /**
   * 顯示載入畫面
   */
  showLoading() {
    this.state.isLoading = true;
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
    }
  }

  /**
   * 隱藏載入畫面
   */
  hideLoading() {
    this.state.isLoading = false;
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }

  /**
   * 顯示錯誤信息
   */
  showError(message) {
    this.modules.notification.show(message, "error");
  }

  /**
   * 頁面變為可見時的處理
   */
  onPageVisible() {
    // 重新載入數據
    this.loadData()
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.warn("數據重新載入失敗:", error);
      });
  }

  /**
   * 獲取應用程序狀態
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 更新應用程序狀態
   */
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * 獲取模組實例
   */
  getModule(name) {
    return this.modules[name];
  }
}

// 全局應用程序實例
let app;

// 頁面載入完成後初始化應用程序
document.addEventListener("DOMContentLoaded", () => {
  app = new App();
});

// 導出應用程序類
window.App = App;
