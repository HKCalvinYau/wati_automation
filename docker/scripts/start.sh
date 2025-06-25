#!/bin/bash

# Docker 啟動腳本
# 用於初始化和管理 Docker 容器

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查 Docker 是否安裝
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安裝，請先安裝 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安裝，請先安裝 Docker Compose"
        exit 1
    fi
    
    log_success "Docker 環境檢查通過"
}

# 創建必要的目錄
create_directories() {
    log_info "創建必要的目錄..."
    
    mkdir -p data/templates
    mkdir -p data/logs
    mkdir -p docker/nginx/ssl
    mkdir -p docker/mysql/init
    
    # 設置權限
    chmod -R 755 data
    chmod -R 755 docker
    
    log_success "目錄創建完成"
}

# 生成 SSL 證書（自簽名）
generate_ssl_cert() {
    if [ ! -f docker/nginx/ssl/cert.pem ]; then
        log_info "生成自簽名 SSL 證書..."
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout docker/nginx/ssl/key.pem \
            -out docker/nginx/ssl/cert.pem \
            -subj "/C=TW/ST=Taiwan/L=Taipei/O=WATI Automation/CN=localhost"
        
        log_success "SSL 證書生成完成"
    else
        log_info "SSL 證書已存在，跳過生成"
    fi
}

# 啟動開發環境
start_dev() {
    log_info "啟動開發環境..."
    
    docker-compose -f docker-compose.dev.yml up -d
    
    log_success "開發環境啟動完成"
    log_info "訪問地址："
    log_info "  - 主應用：http://localhost:8080"
    log_info "  - phpMyAdmin：http://localhost:8081"
    log_info "  - Node.js 開發服務器：http://localhost:3000"
}

# 啟動生產環境
start_prod() {
    log_info "啟動生產環境..."
    
    # 檢查環境變數文件
    if [ ! -f .env ]; then
        log_warning "未找到 .env 文件，請複製 env.example 並設置正確的值"
        cp env.example .env
        log_info "已創建 .env 文件，請編輯後重新運行"
        exit 1
    fi
    
    docker-compose -f docker-compose.prod.yml up -d
    
    log_success "生產環境啟動完成"
    log_info "訪問地址："
    log_info "  - 主應用：https://localhost"
    log_info "  - 健康檢查：https://localhost/health"
}

# 啟動純 PHP 環境
start_php() {
    log_info "啟動純 PHP 環境..."
    
    docker-compose -f docker-compose.php.yml up -d
    
    log_success "純 PHP 環境啟動完成"
    log_info "訪問地址："
    log_info "  - 主應用：http://localhost:8082"
    log_info "  - phpMyAdmin：http://localhost:8083"
    log_info "  - MySQL：localhost:3307"
    log_info "  - Redis：localhost:6380"
    log_info ""
    log_info "注意：端口已調整以避免與 pet_charity 容器衝突"
}

# 停止所有容器
stop_all() {
    log_info "停止所有容器..."
    
    docker-compose -f docker-compose.yml down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    docker-compose -f docker-compose.php.yml down 2>/dev/null || true
    
    log_success "所有容器已停止"
}

# 清理資源
cleanup() {
    log_info "清理 Docker 資源..."
    
    # 停止並移除容器
    stop_all
    
    # 移除未使用的映像
    docker image prune -f
    
    # 移除未使用的卷
    docker volume prune -f
    
    log_success "清理完成"
}

# 查看日誌
logs() {
    local service=${1:-web}
    local compose_file=${2:-docker-compose.php.yml}
    log_info "查看 $service 服務日誌..."
    
    docker-compose -f $compose_file logs -f $service
}

# 進入容器
exec_container() {
    local service=${1:-web}
    local compose_file=${2:-docker-compose.php.yml}
    log_info "進入 $service 容器..."
    
    docker-compose -f $compose_file exec $service bash
}

# 備份數據
backup() {
    log_info "備份數據..."
    
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $backup_dir
    
    # 備份 MySQL 數據
    docker-compose -f docker-compose.php.yml exec mysql mysqldump -u root -proot_password wati_automation > $backup_dir/database.sql
    
    # 備份文件數據
    cp -r data $backup_dir/
    
    log_success "備份完成：$backup_dir"
}

# 恢復數據
restore() {
    local backup_dir=$1
    
    if [ -z "$backup_dir" ]; then
        log_error "請指定備份目錄"
        exit 1
    fi
    
    if [ ! -d "$backup_dir" ]; then
        log_error "備份目錄不存在：$backup_dir"
        exit 1
    fi
    
    log_info "恢復數據從：$backup_dir"
    
    # 恢復 MySQL 數據
    if [ -f "$backup_dir/database.sql" ]; then
        docker-compose -f docker-compose.php.yml exec -T mysql mysql -u root -proot_password wati_automation < $backup_dir/database.sql
    fi
    
    # 恢復文件數據
    if [ -d "$backup_dir/data" ]; then
        cp -r $backup_dir/data/* data/
    fi
    
    log_success "數據恢復完成"
}

# 檢查端口衝突
check_port_conflicts() {
    log_info "檢查端口衝突..."
    
    local ports=("8080" "8081" "3306" "6379" "8082" "8083" "3307" "6380")
    local conflicts=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            conflicts+=("$port")
        fi
    done
    
    if [ ${#conflicts[@]} -gt 0 ]; then
        log_warning "檢測到端口衝突："
        for port in "${conflicts[@]}"; do
            log_warning "  - 端口 $port 已被佔用"
        done
        log_info "建議使用 PHP 模式：./docker/scripts/start.sh php"
    else
        log_success "未檢測到端口衝突"
    fi
}

# 顯示幫助
show_help() {
    echo "Docker 管理腳本"
    echo ""
    echo "用法："
    echo "  $0 [命令]"
    echo ""
    echo "命令："
    echo "  dev         啟動開發環境"
    echo "  prod        啟動生產環境"
    echo "  php         啟動純 PHP 環境（推薦）"
    echo "  stop        停止所有容器"
    echo "  restart     重啟所有容器"
    echo "  logs [服務] [配置文件] 查看日誌"
    echo "  exec [服務] [配置文件] 進入容器"
    echo "  backup      備份數據"
    echo "  restore <目錄> 恢復數據"
    echo "  cleanup     清理 Docker 資源"
    echo "  check-ports 檢查端口衝突"
    echo "  help        顯示此幫助"
    echo ""
    echo "配置文件選項："
    echo "  docker-compose.yml (預設)"
    echo "  docker-compose.dev.yml"
    echo "  docker-compose.prod.yml"
    echo "  docker-compose.php.yml"
    echo ""
    echo "示例："
    echo "  $0 php"
    echo "  $0 logs web docker-compose.php.yml"
    echo "  $0 backup"
    echo ""
    echo "端口配置："
    echo "  純 PHP 環境："
    echo "    - 主應用: http://localhost:8082"
    echo "    - phpMyAdmin: http://localhost:8083"
    echo "    - MySQL: localhost:3307"
    echo "    - Redis: localhost:6380"
}

# 主函數
main() {
    local command=${1:-help}
    
    case $command in
        "dev")
            check_docker
            create_directories
            start_dev
            ;;
        "prod")
            check_docker
            create_directories
            generate_ssl_cert
            start_prod
            ;;
        "php")
            check_docker
            create_directories
            start_php
            ;;
        "stop")
            stop_all
            ;;
        "restart")
            stop_all
            sleep 2
            start_php
            ;;
        "logs")
            logs $2 $3
            ;;
        "exec")
            exec_container $2 $3
            ;;
        "backup")
            backup
            ;;
        "restore")
            restore $2
            ;;
        "cleanup")
            cleanup
            ;;
        "check-ports")
            check_port_conflicts
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 執行主函數
main "$@" 