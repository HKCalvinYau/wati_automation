# 自動化部署指南

## 概述

本專案已配置完整的自動化部署流程，支援多種部署平台和方式。通過 GitHub Actions 實現 CI/CD，確保代碼質量和部署效率。

## 🚀 快速開始

### 1. 自動部署（推薦）

最簡單的部署方式，只需推送代碼到 GitHub：

```bash
# 推送代碼到主分支
git push origin main
```

系統會自動：
- ✅ 運行測試和驗證
- ✅ 部署到 GitHub Pages
- ✅ 發送部署通知

### 2. 本地部署

使用本地部署腳本：

```bash
# 運行測試
./scripts/deploy.sh --test

# 部署到 GitHub Pages
./scripts/deploy.sh --github-pages

# 執行完整部署流程
./scripts/deploy.sh --all
```

## 📋 部署平台

### GitHub Pages（免費）

**特點：**
- 完全免費
- 自動 HTTPS
- 全球 CDN
- 無需配置

**訪問地址：**
```
https://your-username.github.io/wati_automation
```

**配置：**
- 無需額外配置
- 自動從 `main` 分支部署

### Netlify（免費）

**特點：**
- 免費計劃
- 自動 HTTPS
- 全球 CDN
- 自定義域名支援

**配置：**
1. 在 GitHub 設置中添加 Secrets：
   ```
   NETLIFY_AUTH_TOKEN=your-netlify-token
   NETLIFY_SITE_ID=your-netlify-site-id
   ```

2. 設置環境變數：
   ```
   NETLIFY_ENABLED=true
   ```

### Vercel（免費）

**特點：**
- 免費計劃
- 自動 HTTPS
- 全球 CDN
- 服務器端渲染支援

**配置：**
1. 在 GitHub 設置中添加 Secrets：
   ```
   VERCEL_TOKEN=your-vercel-token
   ORG_ID=your-vercel-org-id
   PROJECT_ID=your-vercel-project-id
   ```

### Docker Hub

**特點：**
- 容器化部署
- 版本管理
- 跨平台支援

**配置：**
1. 在 GitHub 設置中添加 Secrets：
   ```
   DOCKER_USERNAME=your-dockerhub-username
   DOCKER_PASSWORD=your-dockerhub-password
   ```

## 🔧 工作流程配置

### 簡化部署流程

文件：`.github/workflows/simple-deploy.yml`

**觸發條件：**
- 推送到 `main` 分支
- 創建 Pull Request

**執行步驟：**
1. **測試驗證**
   - PHP 語法檢查
   - HTML 文件驗證
   - 文件結構檢查

2. **部署到 GitHub Pages**
   - 上傳靜態文件
   - 自動部署

3. **可選部署**
   - Netlify（如果啟用）
   - Vercel（如果配置）

### 完整部署流程

文件：`.github/workflows/deploy.yml`

**觸發條件：**
- 推送到 `main` 或 `develop` 分支
- 創建標籤（`v*`）

**執行步驟：**
1. **測試和構建**
   - 安裝依賴
   - 運行測試
   - 構建項目

2. **Docker 部署**
   - 構建 Docker 映像
   - 推送到 Docker Hub
   - 部署到雲端平台

3. **多平台部署**
   - GitHub Pages
   - Netlify
   - Vercel

4. **通知**
   - 部署狀態通知
   - 錯誤報告

### Docker 部署流程

文件：`.github/workflows/docker-deploy.yml`

**觸發條件：**
- 推送到 `main` 分支
- 創建標籤（`v*`）

**執行步驟：**
1. **構建和測試**
   - 構建 Docker 映像
   - 運行容器測試

2. **推送到 Hub**
   - 登錄 Docker Hub
   - 推送映像

3. **雲端部署**
   - DigitalOcean App Platform
   - Google Cloud Run

## 🛠️ 本地部署腳本

### 腳本功能

文件：`scripts/deploy.sh`

**支援功能：**
- 依賴檢查
- 測試驗證
- 項目構建
- 多平台部署

**使用方法：**
```bash
# 顯示幫助
./scripts/deploy.sh --help

# 運行測試
./scripts/deploy.sh --test

# 構建項目
./scripts/deploy.sh --build

# 部署到 GitHub Pages
./scripts/deploy.sh --github-pages

# 部署到 Netlify
./scripts/deploy.sh --netlify

# 部署到 Vercel
./scripts/deploy.sh --vercel

# 部署到 Docker
./scripts/deploy.sh --docker

# 執行完整流程
./scripts/deploy.sh --all
```

### 依賴檢查

腳本會自動檢查：
- Git（必需）
- Node.js（可選）
- Docker（可選）
- PHP（可選）

### 測試驗證

自動執行：
- PHP 語法檢查
- HTML 文件驗證
- 文件結構檢查
- 必需文件檢查

## 🔐 環境變數配置

### GitHub Secrets 設置

在 GitHub 倉庫設置 → Secrets and variables → Actions 中添加：

#### 必需變數
```bash
# GitHub Pages（自動設置）
GITHUB_TOKEN
```

#### 可選變數
```bash
# Docker Hub
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password

# Netlify
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-netlify-site-id

# Vercel
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id

# 雲端平台
DIGITALOCEAN_ACCESS_TOKEN=your-digitalocean-token
```

### 環境變數設置

在 GitHub 倉庫設置 → Secrets and variables → Actions → Variables 中添加：

```bash
# 啟用 Netlify 部署
NETLIFY_ENABLED=true

# 部署配置
DEPLOY_ENVIRONMENT=production
```

## 📊 監控和維護

### 部署狀態檢查

1. **GitHub Actions**
   - 訪問：`https://github.com/your-username/wati_automation/actions`
   - 查看工作流程狀態
   - 檢查部署日誌

2. **各平台控制台**
   - GitHub Pages：倉庫設置 → Pages
   - Netlify：Netlify 控制台
   - Vercel：Vercel 控制台

3. **健康檢查**
   - 訪問部署的網站
   - 檢查 API 端點
   - 驗證功能正常

### 回滾機制

#### 代碼回滾
```bash
# 回滾到指定版本
git checkout v1.0.0
git push origin main --force
```

#### Docker 回滾
```bash
# 拉取指定版本
docker pull your-username/wati-automation:v1.0.0

# 重新部署
docker-compose -f docker-compose.prod.yml up -d
```

### 性能監控

**監控指標：**
- 部署時間
- 服務響應時間
- 錯誤率
- 資源使用情況

**監控工具：**
- GitHub Actions 日誌
- 平台內建監控
- 第三方監控服務

## 🚨 故障排除

### 常見問題

#### 1. 部署失敗

**可能原因：**
- 代碼錯誤
- 依賴問題
- 配置錯誤

**解決方法：**
1. 檢查 GitHub Actions 日誌
2. 修復代碼錯誤
3. 更新依賴版本
4. 檢查環境變數

#### 2. 環境變數錯誤

**可能原因：**
- Secrets 未設置
- 變數名稱錯誤
- 權限問題

**解決方法：**
1. 檢查 GitHub Secrets 設置
2. 驗證變數名稱
3. 檢查倉庫權限

#### 3. Docker 構建失敗

**可能原因：**
- Dockerfile 錯誤
- 依賴問題
- 網絡問題

**解決方法：**
1. 檢查 Dockerfile 語法
2. 更新基礎映像
3. 檢查網絡連接

### 調試技巧

#### 1. 本地測試
```bash
# 運行測試
./scripts/deploy.sh --test

# 構建測試
./scripts/deploy.sh --build
```

#### 2. 檢查日誌
```bash
# GitHub Actions 日誌
# 在 Actions 頁面查看詳細日誌

# 本地 Docker 日誌
docker-compose logs -f
```

#### 3. 手動部署
```bash
# 手動推送到 GitHub
git push origin main

# 手動部署到平台
./scripts/deploy.sh --github-pages
```

## 📚 參考資源

### 官方文檔
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://docs.netlify.com/)
- [Vercel](https://vercel.com/docs)
- [Docker](https://docs.docker.com/)

### 最佳實踐
- 使用語義化版本標籤
- 定期更新依賴
- 監控部署狀態
- 設置回滾機制
- 配置通知

### 安全建議
- 使用環境變數存儲敏感信息
- 定期更新 Secrets
- 限制部署權限
- 監控異常活動
- 備份重要數據

## 🎯 下一步

1. **設置通知**
   - 配置 Slack/Discord 通知
   - 設置郵件通知
   - 配置手機推送

2. **性能優化**
   - 啟用緩存
   - 優化構建時間
   - 配置 CDN

3. **監控增強**
   - 設置 Uptime 監控
   - 配置錯誤追蹤
   - 添加性能監控

4. **安全加固**
   - 設置安全掃描
   - 配置依賴檢查
   - 啟用漏洞掃描 