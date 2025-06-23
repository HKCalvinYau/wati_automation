/**
 * Favicon 處理器
 * 解決瀏覽器 favicon.ico 404 錯誤
 */

class FaviconHandler {
  constructor() {
    this.init();
  }

  /**
   * 初始化 favicon 處理
   */
  init() {
    // 檢查是否已經有 favicon
    if (!this.hasFavicon()) {
      this.createFavicon();
    }
    
    // 監聽 favicon 請求錯誤
    this.handleFaviconErrors();
  }

  /**
   * 檢查是否已經有 favicon
   */
  hasFavicon() {
    const links = document.querySelectorAll('link[rel*="icon"]');
    return links.length > 0;
  }

  /**
   * 創建 favicon
   */
  createFavicon() {
    // 創建一個簡單的 SVG favicon
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
        <rect width="16" height="16" fill="#ffffff"/>
        <path d="M8 2C6.5 2 5 3.5 5 5.5C5 7.5 6.5 9 8 9C9.5 9 11 7.5 11 5.5C11 3.5 9.5 2 8 2ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z" fill="#dc3545"/>
        <path d="M8 10C6.5 10 5 11.5 5 13.5C5 14.5 6.5 15 8 15C9.5 15 11 14.5 11 13.5C11 11.5 9.5 10 8 10Z" fill="#dc3545"/>
      </svg>
    `;

    // 轉換為 data URL
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(svg);

    // 添加 favicon 連結
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = dataUrl;
    document.head.appendChild(link);

    // 添加備用 favicon
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'shortcut icon';
    fallbackLink.type = 'image/x-icon';
    fallbackLink.href = dataUrl;
    document.head.appendChild(fallbackLink);
  }

  /**
   * 處理 favicon 錯誤
   */
  handleFaviconErrors() {
    // 監聽圖片載入錯誤
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'LINK' && e.target.rel.includes('icon')) {
        console.warn('Favicon 載入失敗，使用內嵌 favicon');
        this.createFavicon();
      }
    }, true);
  }

  /**
   * 動態更新 favicon
   */
  updateFavicon(emoji = '❤️') {
    // 創建 canvas 來生成 favicon
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    // 設置背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 16, 16);

    // 繪製 emoji
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 8, 8);

    // 轉換為 data URL
    const dataUrl = canvas.toDataURL();

    // 更新 favicon
    const links = document.querySelectorAll('link[rel*="icon"]');
    links.forEach(link => {
      link.href = dataUrl;
    });
  }
}

// 自動初始化
if (typeof window !== 'undefined') {
  window.faviconHandler = new FaviconHandler();
}

// 導出給模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FaviconHandler;
} 