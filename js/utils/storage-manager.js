/**
 * 儲存管理器
 * 負責本地儲存和讀取數據
 */
class StorageManager {
  constructor() {
    this.prefix = 'wati_automation_';
  }

  /**
   * 設置項目
   */
  set(key, value) {
    try {
      const fullKey = this.prefix + key;
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(fullKey, serializedValue);
      return true;
    } catch (error) {
      console.error('存儲設置失敗:', error);
      return false;
    }
  }

  /**
   * 獲取項目
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('存儲獲取失敗:', error);
      return defaultValue;
    }
  }

  /**
   * 移除項目
   */
  remove(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('存儲移除失敗:', error);
      return false;
    }
  }

  /**
   * 清空所有項目
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('存儲清空失敗:', error);
      return false;
    }
  }

  /**
   * 獲取最近使用的模板
   */
  getRecentTemplates(limit = 10) {
    return this.get('recent_templates', []).slice(0, limit);
  }

  /**
   * 添加最近使用的模板
   */
  addRecentTemplate(template) {
    try {
      const recent = this.getRecentTemplates();
      const templateId = template.id || template.templateId;
      
      // 移除重複項
      const filtered = recent.filter(item => item.id !== templateId);
      
      // 添加到開頭
      filtered.unshift({
        id: templateId,
        title: template.title,
        category: template.category,
        timestamp: new Date().toISOString()
      });
      
      // 限制數量
      if (filtered.length > 20) {
        filtered.splice(20);
      }
      
      this.set('recent_templates', filtered);
      return true;
    } catch (error) {
      console.error('添加最近模板失敗:', error);
      return false;
    }
  }

  /**
   * 獲取搜索歷史
   */
  getSearchHistory(limit = 10) {
    return this.get('search_history', []).slice(0, limit);
  }

  /**
   * 添加搜索歷史
   */
  addSearchHistory(query) {
    try {
      const history = this.getSearchHistory();
      
      // 移除重複項
      const filtered = history.filter(item => item !== query);
      
      // 添加到開頭
      filtered.unshift(query);
      
      // 限制數量
      if (filtered.length > 20) {
        filtered.splice(20);
      }
      
      this.set('search_history', filtered);
      return true;
    } catch (error) {
      console.error('添加搜索歷史失敗:', error);
      return false;
    }
  }

  /**
   * 獲取用戶偏好設置
   */
  getPreferences() {
    return this.get('preferences', {
      language: 'zh',
      theme: 'light',
      autoSave: true,
      notifications: true
    });
  }

  /**
   * 設置用戶偏好
   */
  setPreferences(preferences) {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    return this.set('preferences', updated);
  }

  /**
   * 檢查存儲是否可用
   */
  isAvailable() {
    try {
      const testKey = this.prefix + 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 設為全域變數
window.StorageManager = StorageManager; 