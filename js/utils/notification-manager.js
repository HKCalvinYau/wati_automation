/**
 * 通知管理器
 * 負責顯示各種通知訊息
 */
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.init();
  }

  init() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info', duration = 2000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: slideIn 0.5s ease;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
      border-left: 4px solid ${this.getBorderColor(type)};
      min-width: 300px;
      max-width: 400px;
      word-wrap: break-word;
    `;
    notification.textContent = message;

    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    // 自動移除
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.5s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }
  }

  getBackgroundColor(type) {
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    return colors[type] || colors.info;
  }

  getBorderColor(type) {
    const colors = {
      success: '#1e7e34',
      error: '#c82333',
      warning: '#e0a800',
      info: '#138496'
    };
    return colors[type] || colors.info;
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// 設為全域變數
window.NotificationManager = NotificationManager; 