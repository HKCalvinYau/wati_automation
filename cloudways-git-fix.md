# Cloudways Git 推送問題解決方案

## 🚨 問題描述

Git 推送到 Cloudways 時出現連接超時錯誤：
```
ssh: connect to host git.cloudways.com port 22: Operation timed out
```

## 🔧 解決方案

### 方案 1：檢查網路連接

1. **測試基本連接**：
   ```bash
   ping git.cloudways.com
   ```

2. **檢查防火牆設置**：
   - 確保端口 22 沒有被阻擋
   - 檢查公司/學校網路是否阻擋 SSH

### 方案 2：使用不同的 SSH 端口

1. **創建 SSH 配置**：
   ```bash
   # 編輯 ~/.ssh/config
   Host git.cloudways.com
       HostName git.cloudways.com
       Port 22
       User git
       IdentityFile ~/.ssh/id_rsa
       ServerAliveInterval 60
       ServerAliveCountMax 3
   ```

### 方案 3：使用 Cloudways CLI

1. **安裝 Cloudways CLI**：
   ```bash
   npm install -g cloudways-cli
   ```

2. **登入並部署**：
   ```bash
   cloudways login
   cloudways deploy
   ```

### 方案 4：手動上傳到 Cloudways

如果 Git 推送持續失敗，可以：

1. **在 Cloudways 控制台**：
   - 進入 File Manager
   - 手動上傳檔案
   - 或使用 SFTP 連接

2. **使用 SFTP 工具**：
   - FileZilla
   - Cyberduck
   - WinSCP

### 方案 5：檢查 SSH 金鑰

1. **檢查 SSH 金鑰**：
   ```bash
   ls -la ~/.ssh/
   ```

2. **生成新的 SSH 金鑰**：
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   ```

3. **添加到 Cloudways**：
   - 在 Cloudways 控制台添加公鑰
   - 或聯繫 Cloudways 支援

## 🎯 立即嘗試的步驟

### 步驟 1：重試推送
```bash
git push cloudways main
```

### 步驟 2：如果失敗，嘗試強制推送
```bash
git push cloudways main --force
```

### 步驟 3：檢查 Git 配置
```bash
git config --list | grep remote
```

### 步驟 4：重新設置遠端
```bash
git remote remove cloudways
git remote add cloudways git@git.cloudways.com:ywmzzfkesa.git
```

## 📞 聯繫 Cloudways 支援

如果所有方法都失敗：

1. **提供錯誤信息**：
   - SSH 連接錯誤
   - Git 推送失敗
   - 網路連接問題

2. **請求協助**：
   - 檢查伺服器狀態
   - 驗證 SSH 配置
   - 提供替代部署方法

## 🔄 備用方案

### 使用 GitHub Actions 自動部署

1. **創建 GitHub Actions 工作流程**：
   ```yaml
   name: Deploy to Cloudways
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Cloudways
           run: |
             # 部署腳本
   ```

### 使用 Webhook 觸發部署

1. **在 Cloudways 設置 Webhook**
2. **GitHub 推送時自動觸發部署**

## 📋 檢查清單

- [ ] 網路連接正常
- [ ] SSH 金鑰正確配置
- [ ] Cloudways 伺服器狀態正常
- [ ] Git 遠端配置正確
- [ ] 檔案權限正確
- [ ] 快取已清除
- [ ] 應用程式已重啟

## 🎉 成功指標

推送成功後，您應該看到：
```
To git.cloudways.com:ywmzzfkesa.git
   [hash]..[hash]  main -> main
``` 