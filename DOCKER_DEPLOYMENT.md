# Docker 部署指南

## 概述

本專案提供多種 Docker 部署方式，支援開發、生產和純 PHP 環境。所有配置都經過優化，避免與現有容器（如 pet_charity）的端口衝突。

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

## 管理命令

### 啟動腳本

使用 `./docker/scripts/start.sh` 腳本進行管理：

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

### 性能優化

1. **調整 PHP 配置**
   ```bash
   # 編輯 php.ini
   docker-compose -f docker-compose.php.yml exec web nano /usr/local/etc/php/php.ini
   ```

2. **調整 MySQL 配置**
   ```bash
   # 編輯 MySQL 配置
   docker-compose -f docker-compose.php.yml exec mysql nano /etc/mysql/my.cnf
   ```

3. **啟用 Redis 快取**
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

## 遷移指南

### 從本地環境遷移

1. 導出本地數據
2. 啟動 Docker 環境
3. 導入數據
4. 更新配置

### 從其他 Docker 環境遷移

1. 停止舊環境
2. 備份數據
3. 啟動新環境
4. 恢復數據

## 支援

如遇到問題，請：

1. 查看本文檔的故障排除部分
2. 檢查 `TROUBLESHOOTING.md`
3. 查看 `fixbug.md` 中的已知問題
4. 提交 Issue 並附上詳細的錯誤信息 