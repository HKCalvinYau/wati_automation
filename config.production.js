/**
 * 生產環境配置
 */
const config = {
  // API配置
  api: {
    baseUrl: "/api",
    timeout: 30000,
  },

  // 快取配置
  cache: {
    // 模板快取時間（毫秒）
    templateTTL: 3600000,
    // 靜態資源快取時間（毫秒）
    staticTTL: 86400000,
  },

  // 性能配置
  performance: {
    // 是否啟用延遲加載
    enableLazyLoad: true,
    // 是否啟用資源壓縮
    enableCompression: true,
    // 是否啟用快取
    enableCache: true,
  },

  // 安全配置
  security: {
    // 是否啟用 CSP
    enableCSP: true,
    // CSP 配置
    csp: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
      "font-src": ["'self'", "https://cdnjs.cloudflare.com"],
      "connect-src": ["'self'"],
    },
    // 是否啟用 XSS 防護
    enableXSSProtection: true,
    // 是否啟用 CSRF 防護
    enableCSRF: true,
  },

  // 監控配置
  monitoring: {
    // 是否啟用錯誤追蹤
    enableErrorTracking: true,
    // 是否啟用性能監控
    enablePerformanceMonitoring: true,
    // 是否啟用用戶行為追蹤
    enableUserTracking: true,
  },
};

export default config;
