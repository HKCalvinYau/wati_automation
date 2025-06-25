# 問題修復記錄

## 概述

本文檔記錄了專案開發過程中遇到的問題、嘗試的解決方案和最終的修復結果。

## 修復記錄

### 2025-01-27

#### 問題 1: Docker 端口衝突
- **問題描述**: 與現有的 pet_charity 容器端口衝突
- **嘗試方法**:
  - 修改 docker-compose.yml 端口映射 ❌
  - 創建新的 docker-compose.php.yml 配置文件 ✅
- **解決方案**: 創建純 PHP 環境配置，使用不同端口避免衝突
- **狀態**: ✅ 已修復

#### 問題 2: WordPress 環境複雜性
- **問題描述**: 用戶不需要 WordPress 環境，只需要純 PHP
- **嘗試方法**:
  - 保留 WordPress 配置 ❌
  - 移除 WordPress 相關配置，專注於純 PHP ✅
- **解決方案**: 創建 docker-compose.php.yml，移除 WordPress 相關服務
- **狀態**: ✅ 已修復

#### 問題 3: 啟動腳本複雜性
- **問題描述**: 啟動腳本包含太多 WordPress 相關選項
- **嘗試方法**:
  - 保留所有選項 ❌
  - 簡化腳本，專注於 PHP 環境 ✅
- **解決方案**: 更新 start.sh，移除 WordPress 相關命令，優化 PHP 環境管理
- **狀態**: ✅ 已修復

### 2025-01-26

#### 問題 4: 多容器環境管理
- **問題描述**: 多個 Docker 容器同時運行時的端口管理
- **嘗試方法**:
  - 使用相同端口 ❌
  - 為每個專案分配不同端口範圍 ✅
- **解決方案**: 建立端口分配策略，避免衝突
- **狀態**: ✅ 已修復

#### 問題 5: 數據持久化問題
- **問題描述**: 容器重啟後數據丟失
- **嘗試方法**:
  - 使用容器內存存儲 ❌
  - 使用 Docker 卷和目錄掛載 ✅
- **解決方案**: 配置數據卷和目錄掛載，確保數據持久化
- **狀態**: ✅ 已修復

### 2025-01-25

#### 問題 6: PHP 模組缺失
- **問題描述**: PHP 缺少必要的擴展模組
- **嘗試方法**:
  - 使用基礎 PHP 映像 ❌
  - 安裝必要的 PHP 擴展 ✅
- **解決方案**: 在 Dockerfile 中安裝 MySQL、Redis 等擴展
- **狀態**: ✅ 已修復

#### 問題 7: Apache 配置問題
- **問題描述**: Apache 無法正確處理 PHP 文件
- **嘗試方法**:
  - 使用預設配置 ❌
  - 自定義 Apache 配置 ✅
- **解決方案**: 配置 Apache 虛擬主機和 PHP 處理
- **狀態**: ✅ 已修復

### 2025-01-24

#### 問題 8: JavaScript ES6 模組語法錯誤
- **問題描述**: 瀏覽器不支援 ES6 import/export 語法
- **嘗試方法**:
  - 使用 Webpack 建構 ❌ (需要 Node.js)
  - 改用傳統 script 標籤 ✅
- **解決方案**: 移除 ES6 模組語法，使用傳統 JavaScript 載入方式
- **狀態**: ✅ 已修復

#### 問題 9: API 路徑 404 錯誤
- **問題描述**: 內頁 API 請求返回 404
- **嘗試方法**:
  - 使用絕對路徑 ❌
  - 改用相對路徑 ✅
- **解決方案**: 修改 JavaScript 中的 API 路徑為相對路徑
- **狀態**: ✅ 已修復

### 2025-01-23

#### 問題 10: PHP 環境缺失
- **問題描述**: 系統缺少 PHP 環境
- **嘗試方法**:
  - 手動安裝 PHP ❌
  - 使用 XAMPP ✅
- **解決方案**: 安裝 XAMPP 提供本地 PHP 環境
- **狀態**: ✅ 已修復

#### 問題 11: 檔案權限問題
- **問題描述**: PHP 無法寫入檔案
- **嘗試方法**:
  - 使用預設權限 ❌
  - 調整檔案權限 ✅
- **解決方案**: 設置適當的檔案和目錄權限
- **狀態**: ✅ 已修復

## 當前環境配置

### 純 PHP 環境 (推薦)
- **配置文件**: `docker-compose.php.yml`
- **端口配置**:
  - Web 服務: 8082
  - MySQL: 3307
  - phpMyAdmin: 8083
  - Redis: 6380
- **啟動命令**: `./docker/scripts/start.sh php`

### 開發環境
- **配置文件**: `docker-compose.dev.yml`
- **端口配置**:
  - Web 服務: 8080
  - MySQL: 3306
  - phpMyAdmin: 8081
  - Redis: 6379
- **啟動命令**: `./docker/scripts/start.sh dev`

### 生產環境
- **配置文件**: `docker-compose.prod.yml`
- **端口配置**:
  - Web 服務: 80/443
  - MySQL: 3306
  - Redis: 6379
- **啟動命令**: `./docker/scripts/start.sh prod`

## 已知問題

### 1. 端口衝突檢測
- **狀態**: 監控中
- **描述**: 需要定期檢查端口使用情況
- **解決方案**: 使用 `./docker/scripts/start.sh check-ports` 檢查

### 2. 數據備份
- **狀態**: 已實現
- **描述**: 定期備份數據避免丟失
- **解決方案**: 使用 `./docker/scripts/start.sh backup` 備份

## 最佳實踐

### 1. 環境選擇
- **開發階段**: 使用純 PHP 環境 (`docker-compose.php.yml`)
- **測試階段**: 使用開發環境 (`docker-compose.dev.yml`)
- **生產部署**: 使用生產環境 (`docker-compose.prod.yml`)

### 2. 端口管理
- 每個專案使用不同的端口範圍
- 定期檢查端口衝突
- 使用環境變數管理端口配置

### 3. 數據管理
- 定期備份重要數據
- 使用 Docker 卷確保數據持久化
- 監控磁盤使用情況

### 4. 安全措施
- 更改預設密碼
- 使用環境變數管理敏感信息
- 定期更新 Docker 映像

## 故障排除指南

### 常見問題解決

1. **容器無法啟動**
   ```bash
   # 查看日誌
   docker-compose -f docker-compose.php.yml logs web
   
   # 檢查端口衝突
   ./docker/scripts/start.sh check-ports
   ```

2. **數據庫連接失敗**
   ```bash
   # 檢查 MySQL 容器
   docker-compose -f docker-compose.php.yml exec mysql mysql -u root -p
   
   # 檢查網絡
   docker network ls
   ```

3. **權限問題**
   ```bash
   # 修復權限
   sudo chown -R $USER:$USER data/
   sudo chmod -R 755 data/
   ```

4. **性能問題**
   ```bash
   # 檢查資源使用
   docker stats
   
   # 清理資源
   ./docker/scripts/start.sh cleanup
   ```

## 更新記錄

- **2025-01-27**: 移除 WordPress 配置，專注於純 PHP 環境
- **2025-01-26**: 解決多容器端口衝突問題
- **2025-01-25**: 完善 Docker 配置和數據持久化
- **2025-01-24**: 修復 JavaScript 模組和 API 路徑問題
- **2025-01-23**: 解決 PHP 環境和權限問題
