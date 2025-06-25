/**
 * 語言管理器
 * 負責處理多語言切換和翻譯
 */
class LanguageManager {
  constructor(app) {
    this.app = app;
    this.currentLanguage = 'zh';
    this.supportedLanguages = ['zh', 'en'];
  }

  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem('preferredLanguage', lang);
      this.updateUI();
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  updateUI() {
    // 更新所有語言相關的 UI 元素
    document.querySelectorAll('[data-lang]').forEach(element => {
      const key = element.dataset.lang;
      const text = this.getText(key);
      if (text) {
        element.textContent = text;
      }
    });
  }

  /**
   * 更新語言顯示
   */
  updateLanguageDisplay() {
    // 更新語言切換按鈕的狀態
    document.querySelectorAll('[data-language]').forEach(button => {
      const lang = button.dataset.language;
      if (lang === this.currentLanguage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    // 更新頁面標題和描述
    this.updatePageContent();
    
    console.log(`✅ 語言顯示已更新為: ${this.currentLanguage}`);
  }

  /**
   * 更新頁面內容
   */
  updatePageContent() {
    // 更新頁面標題
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      const titles = {
        zh: 'WhatsApp 訊息模板管理系統',
        en: 'WhatsApp Message Template Management System'
      };
      pageTitle.textContent = titles[this.currentLanguage] || titles.zh;
    }

    // 更新頁面描述
    const pageDescription = document.querySelector('.page-description');
    if (pageDescription) {
      const descriptions = {
        zh: '專業的寵物善終服務訊息模板，支援雙語顯示和智能搜索功能',
        en: 'Professional pet memorial service message templates with bilingual support and intelligent search'
      };
      pageDescription.textContent = descriptions[this.currentLanguage] || descriptions.zh;
    }
  }

  getText(key) {
    // 簡化的文本獲取邏輯
    const texts = {
      'loading': { zh: '正在載入...', en: 'Loading...' },
      'error': { zh: '錯誤', en: 'Error' },
      'success': { zh: '成功', en: 'Success' }
    };
    return texts[key]?.[this.currentLanguage] || key;
  }
}

// 設為全域變數
window.LanguageManager = LanguageManager; 