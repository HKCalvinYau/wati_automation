/**
 * 構建配置
 */
module.exports = {
  // 入口文件
  entry: {
    main: "./js/core/app.js",
    template: "./js/components/TemplateDetail.js",
    search: "./js/components/SearchManager.js",
  },

  // 輸出配置
  output: {
    path: "./dist",
    filename: "[name].[contenthash].js",
    clean: true,
  },

  // 資源優化
  optimization: {
    // 代碼分割
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    // 最小化
    minimize: true,
    // 模塊連接
    concatenateModules: true,
  },

  // 資源處理
  assets: {
    // 圖片優化
    images: {
      compress: true,
      quality: 85,
      maxSize: 250000,
    },
    // CSS 優化
    styles: {
      minify: true,
      autoprefixer: true,
    },
    // JavaScript 優化
    scripts: {
      minify: true,
      mangle: true,
    },
  },

  // 部署配置
  deploy: {
    // 靜態資源 CDN 配置
    cdn: {
      enable: true,
      domain: "https://cdn.example.com",
      paths: {
        images: "/images",
        styles: "/css",
        scripts: "/js",
      },
    },
  },
};
