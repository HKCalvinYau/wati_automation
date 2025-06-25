# 寵物善終服務 - WhatsApp 訊息模板管理系統

## 專案概述

這是一個專業的寵物善終服務 WhatsApp 訊息模板管理系統，提供完整的客戶服務解決方案。系統支援雙語顯示（繁體中文/英文）、智能搜索、分類管理和響應式設計。

## 功能特色

### 🎯 核心功能
- **模板管理**: 完整的 CRUD 操作（新增、讀取、更新、刪除）
- **分類系統**: 8 大服務分類（初步諮詢、安排服務、後續服務等）
- **雙語支援**: 繁體中文和英文內容管理
- **智能搜索**: 關鍵字搜索和分類過濾
- **響應式設計**: 支援桌面、平板和手機設備

### 🛠️ 技術特色
- **模組化架構**: 清晰的代碼結構，易於維護和擴展
- **RESTful API**: 標準化的 API 設計
- **數據持久化**: 可靠的數據存儲和管理
- **錯誤處理**: 完善的錯誤處理和用戶反饋機制
- **日誌記錄**: 詳細的操作日誌和調試信息

## 快速開始

### 1. 純 PHP 環境（推薦）

這是最簡單的部署方式，適合大多數使用場景：

```bash
# 啟動純 PHP 環境
./docker/scripts/start.sh php

# 或手動啟動
docker-compose -f docker-compose.php.yml up -d
```

**訪問地址：**
- 主應用：http://localhost:8082
- phpMyAdmin：http://localhost:8083
- MySQL：localhost:3307
- Redis：localhost:6380

### 2. 開發環境

```bash
# 啟動開發環境
./docker/scripts/start.sh dev

# 或手動啟動
docker-compose -f docker-compose.dev.yml up -d
```

**訪問地址：**
- 主應用：http://localhost:8080
- phpMyAdmin：http://localhost:8081
- Node.js 開發服務器：http://localhost:3000

### 3. 生產環境

```bash
# 啟動生產環境
./docker/scripts/start.sh prod

# 或手動啟動
docker-compose -f docker-compose.prod.yml up -d
```

**訪問地址：**
- 主應用：https://localhost
- 健康檢查：https://localhost/health

## 系統架構

### 前端架構
```
js/
├── components/          # 組件模組
│   ├── TemplateManager.js    # 模板管理
│   ├── SearchManager.js      # 搜索管理
│   ├── TemplateDetail.js     # 模板詳情
│   ├── ApprovalManager.js    # 審核管理
│   ├── UsageManager.js       # 使用統計
│   └── VersionManager.js     # 版本管理
├── utils/              # 工具模組
│   ├── notification-manager.js  # 通知管理
│   ├── modal-manager.js         # 模態框管理
│   ├── storage-manager.js       # 存儲管理
│   ├── category-manager.js      # 分類管理
│   └── language-manager.js      # 語言管理
├── core/               # 核心模組
│   └── app.js          # 應用核心
└── main.js             # 主入口文件
```

### 後端架構
```
api/
├── get-templates.php       # 獲取模板列表
├── save-template.php       # 保存模板
└── save-template-simple.php # 簡化保存接口

data/
├── templates/              # 模板數據
│   ├── template-data.json  # 模板數據
│   ├── approval-data.json  # 審核數據
│   ├── usage-data.json     # 使用統計
│   └── version-data.json   # 版本數據
└── logs/                   # 日誌文件
```

## 數據結構

### 模板數據結構
```json
{
  "id": "IC_001",
  "category": "ic",
  "categoryName": "初步諮詢",
  "title": "歡迎諮詢",
  "content": {
    "zh": "您好，歡迎諮詢寵物善終服務...",
    "en": "Hello, welcome to pet memorial service..."
  },
  "status": "active",
  "usageCount": 0,
  "lastUsed": null,
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T10:00:00Z"
}
```

### 分類系統
- **IC**: 初步諮詢 (Initial Consultation)
- **AC**: 安排服務 (Arrange Service)
- **PS**: 後續服務 (Post Service)
- **PP**: 產品推廣 (Product Promotion)
- **PI**: 付款相關 (Payment Information)
- **CI**: 公司介紹 (Company Introduction)
- **LI**: 物流追蹤 (Logistics Information)
- **OI**: 其他資訊 (Other Information)

## 管理命令

### Docker 管理
```bash
# 查看幫助
./docker/scripts/start.sh help

# 啟動純 PHP 環境
./docker/scripts/start.sh php

# 停止所有容器
./docker/scripts/start.sh stop

# 重啟容器
./docker/scripts/start.sh restart

# 查看日誌
./docker/scripts/start.sh logs web

# 進入容器
./docker/scripts/start.sh exec web

# 備份數據
./docker/scripts/start.sh backup

# 恢復數據
./docker/scripts/start.sh restore backups/20250101_120000

# 清理資源
./docker/scripts/start.sh cleanup

# 檢查端口衝突
./docker/scripts/start.sh check-ports
```

### Docker Compose 命令
```bash
# 啟動服務
docker-compose -f docker-compose.php.yml up -d

# 查看狀態
docker-compose -f docker-compose.php.yml ps

# 查看日誌
docker-compose -f docker-compose.php.yml logs -f

# 停止服務
docker-compose -f docker-compose.php.yml down

# 重建服務
docker-compose -f docker-compose.php.yml up -d --build

# 進入容器
docker-compose -f docker-compose.php.yml exec web bash
docker-compose -f docker-compose.php.yml exec mysql bash
```

## 環境配置

### 端口配置
為了避免與現有容器衝突，我們使用了以下端口配置：

| 服務 | 純 PHP 環境 | 開發環境 | 生產環境 |
|------|-------------|----------|----------|
| Web 服務 | 8082 | 8080 | 80/443 |
| MySQL | 3307 | 3306 | 3306 |
| phpMyAdmin | 8083 | 8081 | 8081 |
| Redis | 6380 | 6379 | 6379 |

### 環境變數
創建 `.env` 文件（基於 `env.example`）：

```bash
# 複製環境變數模板
cp env.example .env

# 編輯環境變數
nano .env
```

主要環境變數：
```env
# 資料庫配置
DB_HOST=mysql
DB_PORT=3306
DB_NAME=wati_automation
DB_USER=wati_user
DB_PASSWORD=wati_password

# Redis 配置
REDIS_HOST=redis
REDIS_PORT=6379

# 應用配置
APP_ENV=production
APP_DEBUG=false
APP_URL=https://localhost
```

## 數據持久化

### 數據目錄
- `data/templates/` - 模板數據
- `data/logs/` - 應用日誌
- `mysql_data` - MySQL 數據卷
- `redis_data` - Redis 數據卷

### 備份和恢復
```bash
# 創建備份
./docker/scripts/start.sh backup

# 恢復備份
./docker/scripts/start.sh restore backups/20250101_120000
```

## 故障排除

### 常見問題

1. **端口衝突**
   ```bash
   # 檢查端口使用情況
   ./docker/scripts/start.sh check-ports
   
   # 或手動檢查
   lsof -i :8082
   ```

2. **容器無法啟動**
   ```bash
   # 查看詳細日誌
   docker-compose -f docker-compose.php.yml logs web
   
   # 檢查容器狀態
   docker-compose -f docker-compose.php.yml ps
   ```

3. **數據庫連接問題**
   ```bash
   # 檢查 MySQL 容器
   docker-compose -f docker-compose.php.yml exec mysql mysql -u root -p
   
   # 檢查網絡連接
   docker network ls
   docker network inspect wati_automation_wati_network
   ```

4. **權限問題**
   ```bash
   # 修復文件權限
   sudo chown -R $USER:$USER data/
   sudo chmod -R 755 data/
   ```

### 日誌位置
- 應用日誌：`data/logs/`
- Docker 日誌：`docker-compose -f docker-compose.php.yml logs`
- Apache 日誌：容器內 `/var/log/apache2/`
- MySQL 日誌：容器內 `/var/log/mysql/`

## 性能優化

### 1. 調整 PHP 配置
```bash
# 編輯 php.ini
docker-compose -f docker-compose.php.yml exec web nano /usr/local/etc/php/php.ini
```

### 2. 調整 MySQL 配置
```bash
# 編輯 MySQL 配置
docker-compose -f docker-compose.php.yml exec mysql nano /etc/mysql/my.cnf
```

### 3. 啟用 Redis 快取
```php
// 在 PHP 代碼中使用 Redis
$redis = new Redis();
$redis->connect('redis', 6379);
```

## 安全建議

1. **更改預設密碼**
   - MySQL root 密碼
   - 應用數據庫用戶密碼

2. **啟用 HTTPS**
   - 生產環境自動啟用
   - 開發環境可選

3. **限制訪問**
   - 配置防火牆規則
   - 使用環境變數管理敏感信息

4. **定期更新**
   ```bash
   # 更新映像
   docker-compose -f docker-compose.php.yml pull
   docker-compose -f docker-compose.php.yml up -d
   ```

## 監控和維護

### 健康檢查
```bash
# 檢查服務狀態
curl http://localhost:8082/health

# 檢查數據庫連接
docker-compose -f docker-compose.php.yml exec web php -r "
\$pdo = new PDO('mysql:host=mysql;dbname=wati_automation', 'wati_user', 'wati_password');
echo 'Database connection OK';
"
```

### 定期維護
```bash
# 清理未使用的資源
./docker/scripts/start.sh cleanup

# 更新系統
docker system prune -f

# 檢查磁盤使用
docker system df
```

## 開發指南

### 添加新功能
1. 在 `js/components/` 中創建新的組件
2. 在 `api/` 中創建對應的 PHP 接口
3. 在 `data/templates/` 中更新數據結構
4. 更新文檔和測試

### 代碼規範
- 使用 ES5 JavaScript 語法（避免 ES6 模組）
- 遵循 PHP PSR 標準
- 添加適當的註釋和文檔
- 進行充分的錯誤處理

## 文檔

- [使用指南](USAGE.md) - 詳細的使用說明
- [故障排除](TROUBLESHOOTING.md) - 常見問題解決方案
- [Docker 部署](DOCKER_DEPLOYMENT.md) - Docker 部署詳細指南
- [問題修復記錄](fixbug.md) - 開發過程中的問題和解決方案

## 支援

如遇到問題，請：

1. 查看本文檔的故障排除部分
2. 檢查 `TROUBLESHOOTING.md`
3. 查看 `fixbug.md` 中的已知問題
4. 提交 Issue 並附上詳細的錯誤信息

## 授權

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 文件。

---

**注意**: 本系統專為寵物善終服務設計，請根據實際需求調整配置和功能。
