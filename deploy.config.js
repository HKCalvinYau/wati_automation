/**
 * 部署配置
 */
module.exports = {
  // 生產環境配置
  production: {
    // 服務器配置
    server: {
      host: "wordpressmu-1220981-5617519.cloudwaysapps.com",
      protocol: "https",
      port: 443,
    },

    // 資料庫配置
    database: {
      name: "ywmzzfkesa",
      user: "ywmzzfkesa",
      password: "g5FFbP82Jm",
      host: "localhost",
    },

    // 靜態資源配置
    static: {
      // CDN配置
      cdn: {
        enabled: false,
      },
      // 快取配置
      cache: {
        enabled: true,
        maxAge: 2592000, // 30天
      },
    },

    // 安全配置
    security: {
      // SSL配置
      ssl: {
        enabled: true,
      },
      // HTTP安全標頭
      headers: {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "X-XSS-Protection": "1; mode=block",
      },
    },

    // 監控配置
    monitoring: {
      enabled: false
    },

    // 備份配置
    backup: {
      enabled: true,
      schedule: "0 0 * * *", // 每天凌晨執行
      retention: 7, // 保留7天
    },
  },

  // 測試環境配置
  staging: {
    server: {
      host: "staging.your-domain.com",
      protocol: "https",
      port: 443,
    },
    // ... 其他測試環境特定配置
  },
};
