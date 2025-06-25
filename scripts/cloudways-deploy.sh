#!/bin/bash

# Cloudways 部署腳本
# 用於準備和部署到 Cloudways

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

# 檢查依賴
check_dependencies() {
    log_info "檢查依賴..."
    
    # 檢查 Git
    if ! command -v git &> /dev/null; then
        log_error "Git 未安裝"
        exit 1
    fi
    
    # 檢查是否在 Git 倉庫中
    if [ ! -d ".git" ]; then
        log_error "不在 Git 倉庫中"
        exit 1
    fi
    
    log_success "依賴檢查完成"
}

# 檢查 Git 狀態
check_git_status() {
    log_info "檢查 Git 狀態..."
    
    # 檢查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "發現未提交的更改"
        git status --short
        read -p "是否要提交這些更改？(y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "🚀 Cloudways deployment preparation"
        else
            log_error "請先提交或暫存更改"
            exit 1
        fi
    fi
    
    # 檢查是否與遠端同步
    git fetch
    if [ "$(git rev-list HEAD...origin/main --count)" != "0" ]; then
        log_warning "本地與遠端不同步"
        git status
        read -p "是否要推送更改？(y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin main
        else
            log_error "請先同步遠端倉庫"
            exit 1
        fi
    fi
    
    log_success "Git 狀態檢查完成"
}

# 準備部署文件
prepare_deployment() {
    log_info "準備部署文件..."
    
    # 創建臨時部署目錄
    DEPLOY_DIR="cloudways-deploy"
    rm -rf "$DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
    
    # 複製必要文件
    log_info "複製文件到部署目錄..."
    
    # 複製主要文件
    cp -r index.html detail.html "$DEPLOY_DIR/"
    cp -r css js api data docs "$DEPLOY_DIR/"
    
    # 複製配置文件
    cp favicon.ico "$DEPLOY_DIR/" 2>/dev/null || true
    cp php.ini "$DEPLOY_DIR/" 2>/dev/null || true
    
    # 設置文件權限
    log_info "設置文件權限..."
    find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
    find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
    
    # 設置可寫目錄
    chmod 777 "$DEPLOY_DIR/data" 2>/dev/null || true
    chmod 777 "$DEPLOY_DIR/data/templates" 2>/dev/null || true
    chmod 777 "$DEPLOY_DIR/data/logs" 2>/dev/null || true
    
    log_success "部署文件準備完成"
}

# 驗證部署文件
validate_deployment() {
    log_info "驗證部署文件..."
    
    DEPLOY_DIR="cloudways-deploy"
    
    # 檢查必需文件
    required_files=("index.html" "detail.html" "css/main.css" "js/main.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$DEPLOY_DIR/$file" ]; then
            log_error "缺少必需文件: $file"
            exit 1
        fi
    done
    
    # 檢查目錄結構
    required_dirs=("css" "js" "api" "data" "docs")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$DEPLOY_DIR/$dir" ]; then
            log_error "缺少必需目錄: $dir"
            exit 1
        fi
    done
    
    # 檢查 PHP 文件語法
    if command -v php &> /dev/null; then
        log_info "檢查 PHP 語法..."
        find "$DEPLOY_DIR/api" -name "*.php" -exec php -l {} \;
    fi
    
    log_success "部署文件驗證完成"
}

# 顯示部署信息
show_deployment_info() {
    log_info "部署信息："
    echo "📁 部署目錄: cloudways-deploy/"
    echo "📊 文件統計:"
    find cloudways-deploy -type f | wc -l | xargs echo "   總文件數:"
    du -sh cloudways-deploy | xargs echo "   總大小:"
    echo ""
    echo "📋 下一步操作："
    echo "1. 登入 Cloudways 控制台"
    echo "2. 進入應用設置"
    echo "3. 配置 Git 部署"
    echo "4. 設置倉庫 URL: https://github.com/HKCalvinYau/wati_automation.git"
    echo "5. 設置分支: main"
    echo "6. 點擊部署"
    echo ""
    echo "🔗 相關文檔: cloudways-deployment-guide.md"
}

# 清理部署文件
cleanup() {
    log_info "清理臨時文件..."
    rm -rf cloudways-deploy
    log_success "清理完成"
}

# 顯示幫助
show_help() {
    echo "Cloudways 部署腳本"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  -h, --help              顯示此幫助信息"
    echo "  -p, --prepare           準備部署文件"
    echo "  -v, --validate          驗證部署文件"
    echo "  -c, --cleanup           清理部署文件"
    echo "  -a, --all               執行完整流程"
    echo ""
    echo "示例:"
    echo "  $0 --prepare            準備部署文件"
    echo "  $0 --validate           驗證部署文件"
    echo "  $0 --all                執行完整流程"
}

# 主函數
main() {
    log_info "🚀 Cloudways 部署腳本啟動"
    
    # 解析參數
    PREPARE=false
    VALIDATE=false
    CLEANUP=false
    ALL=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -p|--prepare)
                PREPARE=true
                shift
                ;;
            -v|--validate)
                VALIDATE=true
                shift
                ;;
            -c|--cleanup)
                CLEANUP=true
                shift
                ;;
            -a|--all)
                ALL=true
                shift
                ;;
            *)
                log_error "未知選項: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 如果沒有指定選項，顯示幫助
    if [ "$PREPARE" = false ] && [ "$VALIDATE" = false ] && [ "$CLEANUP" = false ] && [ "$ALL" = false ]; then
        show_help
        exit 0
    fi
    
    # 檢查依賴
    check_dependencies
    
    # 執行操作
    if [ "$CLEANUP" = true ]; then
        cleanup
    fi
    
    if [ "$PREPARE" = true ] || [ "$ALL" = true ]; then
        check_git_status
        prepare_deployment
    fi
    
    if [ "$VALIDATE" = true ] || [ "$ALL" = true ]; then
        validate_deployment
    fi
    
    if [ "$ALL" = true ]; then
        show_deployment_info
    fi
    
    log_success "🎉 Cloudways 部署準備完成！"
}

# 執行主函數
main "$@" 