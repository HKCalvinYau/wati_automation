/**
 * 模態對話框管理器
 * 負責管理各種模態對話框
 */
class ModalManager {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    this.createModalContainer();
    this.setupEventListeners();
  }

  createModalContainer() {
    if (!document.getElementById('modal-container')) {
      const container = document.createElement('div');
      container.id = 'modal-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
        background: rgba(0,0,0,0.5);
      `;
      document.body.appendChild(container);
    }
  }

  setupEventListeners() {
    // 點擊背景關閉模態框
    document.addEventListener('click', (e) => {
      if (e.target.id === 'modal-container') {
        this.close();
      }
    });

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  show(content, options = {}) {
    const container = document.getElementById('modal-container');
    
    // 創建模態框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      animation: modalSlideIn 0.3s ease;
    `;

    // 添加內容
    if (typeof content === 'string') {
      modal.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      modal.appendChild(content);
    }

    // 添加關閉按鈕
    if (options.showClose !== false) {
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      `;
      closeBtn.onclick = () => this.close();
      modal.appendChild(closeBtn);
    }

    // 顯示模態框
    container.innerHTML = '';
    container.appendChild(modal);
    container.style.display = 'block';
    this.activeModal = modal;

    // 調用回調
    if (options.onShow) {
      options.onShow(modal);
    }

    return modal;
  }

  close() {
    const container = document.getElementById('modal-container');
    if (container && this.activeModal) {
      this.activeModal.style.animation = 'modalSlideOut 0.3s ease';
      setTimeout(() => {
        container.style.display = 'none';
        this.activeModal = null;
      }, 300);
    }
  }

  confirm(message, onConfirm, onCancel) {
    const content = `
      <div style="padding: 30px; text-align: center;">
        <h3 style="margin-bottom: 20px;">確認</h3>
        <p style="margin-bottom: 30px;">${message}</p>
        <div style="display: flex; justify-content: center; gap: 15px;">
          <button id="confirm-yes" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">確定</button>
          <button id="confirm-no" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
        </div>
      </div>
    `;

    const modal = this.show(content, { showClose: false });
    
    modal.querySelector('#confirm-yes').onclick = () => {
      this.close();
      if (onConfirm) onConfirm();
    };
    
    modal.querySelector('#confirm-no').onclick = () => {
      this.close();
      if (onCancel) onCancel();
    };
  }

  alert(message, onOk) {
    const content = `
      <div style="padding: 30px; text-align: center;">
        <h3 style="margin-bottom: 20px;">提示</h3>
        <p style="margin-bottom: 30px;">${message}</p>
        <button id="alert-ok" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">確定</button>
      </div>
    `;

    const modal = this.show(content, { showClose: false });
    
    modal.querySelector('#alert-ok').onclick = () => {
      this.close();
      if (onOk) onOk();
    };
  }
}

// 設為全域變數
window.ModalManager = ModalManager; 