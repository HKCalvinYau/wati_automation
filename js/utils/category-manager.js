/**
 * 類別管理器
 * 負責管理模板分類
 */
class CategoryManager {
  constructor(app) {
    this.app = app;
    this.categories = [];
    this.init();
  }

  init() {
    this.loadCategories();
  }

  /**
   * 載入分類數據
   */
  async loadCategories() {
    try {
      // 嘗試從 API 載入
      const response = await fetch('api/get-templates.php');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.metadata.categories) {
          this.categories = this.formatCategories(data.data.metadata.categories);
        }
      }
    } catch (error) {
      console.warn('無法載入分類數據，使用默認分類');
      this.categories = this.getDefaultCategories();
    }
  }

  /**
   * 格式化分類數據
   */
  formatCategories(categoryCounts) {
    const defaultCategories = this.getDefaultCategories();
    
    return defaultCategories.map(category => ({
      ...category,
      count: categoryCounts[category.code] || 0
    }));
  }

  /**
   * 獲取默認分類
   */
  getDefaultCategories() {
    return [
      {
        code: 'ic',
        name: { zh: '初始聯繫', en: 'Initial Contact' },
        description: { zh: '與客戶的初次接觸和諮詢', en: 'Initial contact and consultation with clients' },
        icon: 'fas fa-handshake',
        count: 0
      },
      {
        code: 'ac',
        name: { zh: '預約確認', en: 'Appointment Confirmation' },
        description: { zh: '服務預約的確認和安排', en: 'Service appointment confirmation and arrangement' },
        icon: 'fas fa-calendar-check',
        count: 0
      },
      {
        code: 'ps',
        name: { zh: '服務後跟進', en: 'Post Service' },
        description: { zh: '服務完成後的跟進和關懷', en: 'Follow-up and care after service completion' },
        icon: 'fas fa-heart',
        count: 0
      },
      {
        code: 'pp',
        name: { zh: '產品及服務推廣', en: 'Product Promotion' },
        description: { zh: '推廣產品和服務', en: 'Promote products and services' },
        icon: 'fas fa-bullhorn',
        count: 0
      },
      {
        code: 'pi',
        name: { zh: '付款相關', en: 'Payment Information' },
        description: { zh: '付款相關的通知和確認', en: 'Payment-related notifications and confirmations' },
        icon: 'fas fa-credit-card',
        count: 0
      },
      {
        code: 'ci',
        name: { zh: '公司資訊', en: 'Company Information' },
        description: { zh: '公司基本資訊和介紹', en: 'Basic company information and introduction' },
        icon: 'fas fa-building',
        count: 0
      },
      {
        code: 'li',
        name: { zh: '物流安排', en: 'Logistics' },
        description: { zh: '物流和配送安排', en: 'Logistics and delivery arrangements' },
        icon: 'fas fa-truck',
        count: 0
      },
      {
        code: 'oi',
        name: { zh: '其他資訊', en: 'Other Information' },
        description: { zh: '其他相關資訊', en: 'Other related information' },
        icon: 'fas fa-info-circle',
        count: 0
      }
    ];
  }

  /**
   * 獲取分類列表
   */
  getCategories() {
    return this.categories;
  }

  /**
   * 根據代碼獲取分類
   */
  getCategoryByCode(code) {
    return this.categories.find(cat => cat.code === code);
  }

  /**
   * 獲取分類名稱
   */
  getCategoryName(code, language = 'zh') {
    const category = this.getCategoryByCode(code);
    return category ? category.name[language] || category.name.zh : code;
  }

  /**
   * 獲取分類描述
   */
  getCategoryDescription(code, language = 'zh') {
    const category = this.getCategoryByCode(code);
    return category ? category.description[language] || category.description.zh : '';
  }

  /**
   * 渲染分類列表
   */
  renderCategories(container, selectedCategory = 'all', onCategorySelect) {
    if (!container) return;

    const categories = this.getCategories();
    
    const html = `
      <div class="category-list">
        <div class="category-item ${selectedCategory === 'all' ? 'active' : ''}" 
             data-category="all" onclick="this.onCategorySelect && this.onCategorySelect('all')">
          <i class="fas fa-th-large"></i>
          <span>全部</span>
          <span class="count">${this.getTotalCount()}</span>
        </div>
        ${categories.map(category => `
          <div class="category-item ${selectedCategory === category.code ? 'active' : ''}" 
               data-category="${category.code}" onclick="this.onCategorySelect && this.onCategorySelect('${category.code}')">
            <i class="${category.icon}"></i>
            <span>${category.name.zh}</span>
            <span class="count">${category.count}</span>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;

    // 綁定事件
    container.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', () => {
        const category = item.dataset.category;
        if (onCategorySelect) {
          onCategorySelect(category);
        }
      });
    });
  }

  /**
   * 獲取總模板數量
   */
  getTotalCount() {
    return this.categories.reduce((total, cat) => total + cat.count, 0);
  }

  /**
   * 更新分類統計
   */
  updateCategoryStats(templates) {
    const counts = {};
    
    templates.forEach(template => {
      const category = template.category;
      counts[category] = (counts[category] || 0) + 1;
    });

    this.categories.forEach(category => {
      category.count = counts[category.code] || 0;
    });
  }
}

// 設為全域變數
window.CategoryManager = CategoryManager; 