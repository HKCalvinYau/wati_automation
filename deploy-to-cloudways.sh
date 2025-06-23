#!/bin/bash

# Cloudways 自動部署腳本
# 用於簡化部署過程

set -e

echo "🚀 開始 Cloudways 部署..."

# 配置
CLOUDWAYS_APP_NAME="your-app-name"
CLOUDWAYS_SERVER_IP="your-server-ip"
CLOUDWAYS_USERNAME="your-username"
CLOUDWAYS_PASSWORD="your-password"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函數：顯示訊息
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查必要工具
check_requirements() {
    log_info "檢查部署要求..."
    
    if ! command -v curl &> /dev/null; then
        log_error "curl 未安裝"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git 未安裝"
        exit 1
    fi
    
    log_info "所有要求已滿足"
}

# 備份當前版本
backup_current() {
    log_info "創建備份..."
    
    BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # 備份重要檔案
    if [ -f "data/templates/template-data.json" ]; then
        cp "data/templates/template-data.json" "$BACKUP_DIR/"
        log_info "模板資料已備份到 $BACKUP_DIR/"
    fi
    
    if [ -d "data/logs" ]; then
        cp -r "data/logs" "$BACKUP_DIR/"
        log_info "日誌檔案已備份到 $BACKUP_DIR/"
    fi
}

# 準備部署檔案
prepare_deployment() {
    log_info "準備部署檔案..."
    
    DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$DEPLOY_DIR"
    
    # 複製必要檔案
    cp -r api/ "$DEPLOY_DIR/"
    cp -r js/ "$DEPLOY_DIR/"
    cp -r css/ "$DEPLOY_DIR/"
    cp -r data/ "$DEPLOY_DIR/"
    cp index.html "$DEPLOY_DIR/"
    cp detail.html "$DEPLOY_DIR/"
    cp cloudways-debug.html "$DEPLOY_DIR/"
    cp debug-save-issue.html "$DEPLOY_DIR/"
    cp php-version-check.php "$DEPLOY_DIR/"
    cp .htaccess "$DEPLOY_DIR/"
    cp README.md "$DEPLOY_DIR/"
    cp TROUBLESHOOTING.md "$DEPLOY_DIR/"
    cp fixbug.md "$DEPLOY_DIR/"
    
    log_info "部署檔案已準備在 $DEPLOY_DIR/"
}

# 設置檔案權限
set_permissions() {
    log_info "設置檔案權限..."
    
    find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
    find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
    chmod 755 "$DEPLOY_DIR/data/templates/"
    chmod 755 "$DEPLOY_DIR/data/logs/"
    chmod 755 "$DEPLOY_DIR/api/"
    
    log_info "檔案權限已設置"
}

# 創建部署包
create_deployment_package() {
    log_info "創建部署包..."
    
    PACKAGE_NAME="wati-automation-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "$PACKAGE_NAME" -C "$DEPLOY_DIR" .
    
    log_info "部署包已創建: $PACKAGE_NAME"
    echo "$PACKAGE_NAME"
}

# 顯示部署說明
show_deployment_instructions() {
    local package_name="$1"
    
    echo ""
    echo "📦 部署包已準備完成: $package_name"
    echo ""
    echo "📋 部署步驟:"
    echo "1. 登入 Cloudways 控制台"
    echo "2. 進入您的應用程式"
    echo "3. 點擊 'File Manager'"
    echo "4. 上傳 $package_name 檔案"
    echo "5. 解壓縮到 public_html/ 目錄"
    echo "6. 設置檔案權限"
    echo "7. 重新啟動應用程式"
    echo ""
    echo "🔧 驗證部署:"
    echo "- 訪問: https://your-domain.com"
    echo "- 診斷工具: https://your-domain.com/cloudways-debug.html"
    echo ""
    echo "📚 詳細說明請參考: cloudways-deployment-guide.md"
}

# 清理臨時檔案
cleanup() {
    log_info "清理臨時檔案..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        rm -rf "$DEPLOY_DIR"
    fi
    
    log_info "清理完成"
}

# 主函數
main() {
    log_info "開始 Cloudways 部署流程..."
    
    check_requirements
    backup_current
    prepare_deployment
    set_permissions
    local package_name=$(create_deployment_package)
    show_deployment_instructions "$package_name"
    cleanup
    
    log_info "部署準備完成！"
}

# 執行主函數
main "$@" 