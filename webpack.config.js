const path = require('path');

module.exports = {
  mode: 'development', // 開發模式，生產環境可改為 'production'
  entry: './js/main.js', // 主入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
    clean: true // 每次構建前清理 dist 目錄
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'js'),
      '@components': path.resolve(__dirname, 'js/components'),
      '@utils': path.resolve(__dirname, 'js/utils'),
      '@core': path.resolve(__dirname, 'js/core')
    }
  },
  devtool: 'source-map', // 開發時生成 source map
  optimization: {
    minimize: false // 開發時不壓縮，方便調試
  }
}; 