/**
 * 主入口文件
 * 初始化應用程序
 */

// 當 DOM 載入完成後初始化應用程序
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🔍 檢查模組載入狀態...');
    console.log('window.App:', typeof App);
    console.log('window.app:', typeof window.app);
    
    // 檢查必要的模組是否已載入
    if (typeof App === 'undefined') {
      console.error('❌ App 類別未定義');
      console.log('已載入的腳本:', document.scripts);
      throw new Error('App 模組未載入');
    }
    
    // 檢查是否已經初始化過
    if (window.app && window.app.state) {
      console.log('✅ 應用程序已經初始化過，跳過重複初始化');
      return;
    }
    
    // 初始化應用程序
    const app = new App();
    
    console.log('🚀 應用程序啟動成功');
  } catch (error) {
    console.error('❌ 應用程序啟動失敗:', error);
    
    // 顯示錯誤訊息給用戶
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f8d7da;
      color: #721c24;
      padding: 20px;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
      z-index: 9999;
      max-width: 400px;
      text-align: center;
    `;
    errorDiv.innerHTML = `
      <h3>應用程序載入失敗</h3>
      <p>錯誤: ${error.message}</p>
      <p>請重新整理頁面或聯繫管理員</p>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 15px;">重新整理</button>
    `;
    document.body.appendChild(errorDiv);
  }
}); 