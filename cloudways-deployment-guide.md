# Cloudways Git 部署指南

## 概述

本指南將教你如何使用 Cloudways 的 Git 部署功能，實現自動化部署你的 WATI Automation 系統。

## 🚀 快速開始

### 1. Cloudways 控制台設置

#### 登入 Cloudways 控制台
1. 訪問 [Cloudways 控制台](https://platform.cloudways.com/)
2. 登入你的帳戶

#### 選擇或創建應用
1. 點擊「Add Server」或選擇現有服務器
2. 選擇應用類型：
   - **PHP 8.1** (推薦)
   - 或 **PHP 8.0**
3. 選擇服務器位置和大小

### 2. 設置 Git 部署

#### 在應用設置中配置 Git
1. 進入你的應用
2. 點擊「Application Settings」
3. 找到「Git Version Control」部分
4. 點擊「Deploy via Git」

#### 配置 Git 倉庫
1. **Repository URL**: `https://github.com/HKCalvinYau/wati_automation.git`
2. **Branch**: `main`
3. **Deploy Path**: `/public_html` (或留空使用根目錄)

#### 設置部署選項
- ✅ **Auto Deploy**: 啟用自動部署
- ✅ **Deploy on Push**: 推送到 main 分支時自動部署
- ✅ **Clear Cache**: 部署後清除緩存

### 3. 部署配置

#### 文件結構調整
Cloudways 需要特定的文件結構：

```
public_html/          # 網站根目錄
├── index.html
├── detail.html
├── css/
├── js/
├── api/
├── data/
└── docs/
```

#### 創建 .cloudwaysignore 文件
```
# 忽略不需要部署的文件
.git/
.github/
node_modules/
*.log
.env
.DS_Store
```

### 4. 部署流程

#### 手動部署
1. 在 Cloudways 控制台點擊「Deploy」
2. 等待部署完成
3. 檢查部署狀態

#### 自動部署
1. 推送代碼到 GitHub main 分支
2. Cloudways 自動檢測並部署
3. 查看部署日誌

## 🔧 詳細配置

### 環境變數設置

在 Cloudways 控制台設置環境變數：

```bash
# 應用環境變數
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# 數據庫配置（如果需要）
DB_HOST=localhost
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
```

### 文件權限設置

確保以下目錄有寫入權限：
```bash
data/
data/templates/
data/logs/
```

### 域名設置

1. 在 Cloudways 控制台添加域名
2. 設置 SSL 證書
3. 配置 DNS 記錄

## 📋 部署檢查清單

### 部署前檢查
- [ ] 代碼已推送到 GitHub main 分支
- [ ] 所有文件權限正確
- [ ] 環境變數已設置
- [ ] 域名已配置

### 部署後檢查
- [ ] 網站可以正常訪問
- [ ] API 端點正常工作
- [ ] 數據庫連接正常
- [ ] SSL 證書有效
- [ ] 性能正常

## 🚨 故障排除

### 常見問題

#### 1. 部署失敗
**可能原因：**
- Git 倉庫 URL 錯誤
- 分支名稱錯誤
- 文件權限問題

**解決方法：**
1. 檢查 Git 倉庫設置
2. 確認分支名稱
3. 檢查文件權限

#### 2. 網站無法訪問
**可能原因：**
- 域名未正確配置
- SSL 證書問題
- 文件路徑錯誤

**解決方法：**
1. 檢查域名設置
2. 重新生成 SSL 證書
3. 檢查文件結構

#### 3. API 無法工作
**可能原因：**
- PHP 版本不兼容
- 環境變數未設置
- 文件權限問題

**解決方法：**
1. 檢查 PHP 版本
2. 設置環境變數
3. 檢查文件權限

### 調試技巧

#### 查看部署日誌
1. 在 Cloudways 控制台查看部署日誌
2. 檢查錯誤信息
3. 根據錯誤信息修復問題

#### 測試本地部署
```bash
# 本地測試
./scripts/deploy.sh --test

# 檢查文件結構
ls -la
```

## 🔄 持續部署

### 自動化流程
1. **開發** → 本地修改代碼
2. **測試** → 本地測試
3. **提交** → 推送到 GitHub
4. **部署** → Cloudways 自動部署
5. **驗證** → 檢查部署結果

### 版本管理
```bash
# 創建版本標籤
git tag v1.0.0
git push origin v1.0.0

# 回滾到指定版本
git checkout v1.0.0
git push origin main --force
```

## 📊 監控和維護

### 性能監控
- 使用 Cloudways 內建監控
- 設置告警通知
- 定期檢查性能指標

### 備份策略
- 定期備份數據庫
- 備份代碼倉庫
- 設置自動備份

### 安全維護
- 定期更新依賴
- 監控安全漏洞
- 更新 SSL 證書

## 🎯 最佳實踐

### 開發流程
1. 使用功能分支開發
2. 代碼審查後合併
3. 自動化測試
4. 自動化部署

### 部署策略
1. 藍綠部署
2. 滾動更新
3. 回滾機制
4. 健康檢查

### 監控策略
1. 實時監控
2. 日誌分析
3. 性能優化
4. 安全掃描

## 📚 參考資源

### Cloudways 文檔
- [Cloudways Git 部署](https://support.cloudways.com/en/articles/5125173-how-to-deploy-application-via-git)
- [Cloudways 控制台指南](https://support.cloudways.com/en/articles/5125173-how-to-deploy-application-via-git)

### 相關工具
- [Git 基礎命令](https://git-scm.com/doc)
- [PHP 部署最佳實踐](https://www.php.net/manual/en/install.php)

## 🎉 完成設置

設置完成後，你將擁有：
- ✅ 自動化 Git 部署
- ✅ 生產環境託管
- ✅ SSL 證書
- ✅ 性能監控
- ✅ 自動備份
- ✅ 24/7 支援

現在你可以專注於開發，部署交給 Cloudways 自動處理！ 