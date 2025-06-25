#!/bin/bash

# WATI Automation 部署腳本
# 支援多種部署方式

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
    
    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js 未安裝，跳過前端構建"
        NODE_AVAILABLE=false
    else
        NODE_AVAILABLE=true
    fi
    
    # 檢查 Docker
    if ! command -v docker &> /dev/null; then
        log_warning "Docker 未安裝，跳過容器部署"
        DOCKER_AVAILABLE=false
    else
        DOCKER_AVAILABLE=true
    fi
    
    log_success "依賴檢查完成"
}

# 測試
run_tests() {
    log_info "運行測試..."
    
    # PHP 語法檢查
    if [ -d "api" ]; then
        log_info "檢查 PHP 語法..."
        find api/ -name "*.php" -exec php -l {} \;
        log_success "PHP 語法檢查通過"
    fi
    
    # HTML 驗證
    log_info "驗證 HTML 文件..."
    if [ -f "index.html" ] && [ -f "detail.html" ]; then
        if grep -q "<!DOCTYPE html>" index.html && grep -q "<!DOCTYPE html>" detail.html; then
            log_success "HTML 驗證通過"
        else
            log_error "HTML 驗證失敗"
            exit 1
        fi
    fi
    
    # 文件結構檢查
    log_info "檢查文件結構..."
    required_files=("index.html" "detail.html" "css/main.css" "js/main.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "缺少必需文件: $file"
            exit 1
        fi
    done
    log_success "文件結構檢查通過"
}

# 構建項目
build_project() {
    if [ "$NODE_AVAILABLE" = true ]; then
        log_info "構建項目..."
        
        # 安裝依賴
        if [ -f "package.json" ]; then
            log_info "安裝 Node.js 依賴..."
            npm ci
        fi
        
        # 運行構建
        if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
            log_info "運行構建命令..."
            npm run build
        fi
        
        log_success "項目構建完成"
    else
        log_warning "跳過項目構建（Node.js 不可用）"
    fi
}

# 部署到 GitHub Pages
deploy_github_pages() {
    log_info "部署到 GitHub Pages..."
    
    # 檢查是否在 Git 倉庫中
    if [ ! -d ".git" ]; then
        log_error "不在 Git 倉庫中"
        return 1
    fi
    
    # 檢查是否有遠端倉庫
    if ! git remote get-url origin &> /dev/null; then
        log_error "未配置遠端倉庫"
        return 1
    fi
    
    # 提交更改
    log_info "提交更改..."
    git add .
    git commit -m "🚀 Auto deploy: $(date)" || log_warning "沒有更改需要提交"
    
    # 推送到主分支
    log_info "推送到主分支..."
    git push origin main
    
    log_success "GitHub Pages 部署觸發成功"
    log_info "請在 GitHub Actions 頁面查看部署狀態"
}

# 部署到 Netlify
deploy_netlify() {
    log_info "部署到 Netlify..."
    
    if [ ! -f "netlify.toml" ]; then
        log_error "缺少 netlify.toml 配置文件"
        return 1
    fi
    
    # 檢查 Netlify CLI
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI 未安裝，請手動部署"
        log_info "或運行: npm install -g netlify-cli"
        return 1
    fi
    
    # 部署
    netlify deploy --prod
    
    log_success "Netlify 部署完成"
}

# 部署到 Vercel
deploy_vercel() {
    log_info "部署到 Vercel..."
    
    if [ ! -f "vercel.json" ]; then
        log_error "缺少 vercel.json 配置文件"
        return 1
    fi
    
    # 檢查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI 未安裝，請手動部署"
        log_info "或運行: npm install -g vercel"
        return 1
    fi
    
    # 部署
    vercel --prod
    
    log_success "Vercel 部署完成"
}

# Docker 部署
deploy_docker() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        log_warning "Docker 不可用，跳過容器部署"
        return 1
    fi
    
    log_info "Docker 部署..."
    
    # 構建映像
    log_info "構建 Docker 映像..."
    docker build -t wati-automation .
    
    # 運行容器
    log_info "啟動容器..."
    docker-compose -f docker-compose.prod.yml up -d
    
    log_success "Docker 部署完成"
}

# 顯示幫助
show_help() {
    echo "WATI Automation 部署腳本"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  -h, --help              顯示此幫助信息"
    echo "  -t, --test              運行測試"
    echo "  -b, --build             構建項目"
    echo "  -g, --github-pages      部署到 GitHub Pages"
    echo "  -n, --netlify           部署到 Netlify"
    echo "  -v, --vercel            部署到 Vercel"
    echo "  -d, --docker            部署到 Docker"
    echo "  -a, --all               執行所有步驟"
    echo ""
    echo "示例:"
    echo "  $0 --test               只運行測試"
    echo "  $0 --github-pages       部署到 GitHub Pages"
    echo "  $0 --all                執行完整部署流程"
}

# 主函數
main() {
    log_info "🚀 WATI Automation 部署腳本啟動"
    
    # 解析參數
    TEST_ONLY=false
    BUILD_ONLY=false
    GITHUB_PAGES=false
    NETLIFY=false
    VERCEL=false
    DOCKER=false
    ALL=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -t|--test)
                TEST_ONLY=true
                shift
                ;;
            -b|--build)
                BUILD_ONLY=true
                shift
                ;;
            -g|--github-pages)
                GITHUB_PAGES=true
                shift
                ;;
            -n|--netlify)
                NETLIFY=true
                shift
                ;;
            -v|--vercel)
                VERCEL=true
                shift
                ;;
            -d|--docker)
                DOCKER=true
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
    if [ "$TEST_ONLY" = false ] && [ "$BUILD_ONLY" = false ] && [ "$GITHUB_PAGES" = false ] && [ "$NETLIFY" = false ] && [ "$VERCEL" = false ] && [ "$DOCKER" = false ] && [ "$ALL" = false ]; then
        show_help
        exit 0
    fi
    
    # 檢查依賴
    check_dependencies
    
    # 執行測試
    if [ "$TEST_ONLY" = true ] || [ "$ALL" = true ]; then
        run_tests
        if [ "$TEST_ONLY" = true ]; then
            exit 0
        fi
    fi
    
    # 構建項目
    if [ "$BUILD_ONLY" = true ] || [ "$ALL" = true ]; then
        build_project
        if [ "$BUILD_ONLY" = true ]; then
            exit 0
        fi
    fi
    
    # 部署
    if [ "$GITHUB_PAGES" = true ] || [ "$ALL" = true ]; then
        deploy_github_pages
    fi
    
    if [ "$NETLIFY" = true ] || [ "$ALL" = true ]; then
        deploy_netlify
    fi
    
    if [ "$VERCEL" = true ] || [ "$ALL" = true ]; then
        deploy_vercel
    fi
    
    if [ "$DOCKER" = true ] || [ "$ALL" = true ]; then
        deploy_docker
    fi
    
    log_success "🎉 部署流程完成！"
}

# 執行主函數
main "$@" 