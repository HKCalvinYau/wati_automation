const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 配置
const PORT = 3000;
const DATA_DIR = './data/templates';
const TEMPLATE_FILE = path.join(DATA_DIR, 'template-data.json');

// 確保數據目錄存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化模板數據文件
if (!fs.existsSync(TEMPLATE_FILE)) {
    const initialData = {
        metadata: {
            totalTemplates: 0,
            categories: {},
            lastUpdated: new Date().toISOString(),
            version: '2.0.0'
        },
        templates: []
    };
    fs.writeFileSync(TEMPLATE_FILE, JSON.stringify(initialData, null, 2));
}

// 讀取模板數據
function readTemplates() {
    try {
        const data = fs.readFileSync(TEMPLATE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('讀取模板數據失敗:', error);
        return {
            metadata: {
                totalTemplates: 0,
                categories: {},
                lastUpdated: new Date().toISOString(),
                version: '2.0.0'
            },
            templates: []
        };
    }
}

// 保存模板數據
function saveTemplates(data) {
    try {
        fs.writeFileSync(TEMPLATE_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('保存模板數據失敗:', error);
        return false;
    }
}

// 設置 CORS 頭
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 處理靜態檔案
function serveStaticFile(pathname, res) {
    // 移除開頭的斜線
    let filePath = pathname.substring(1);
    
    // 如果路徑為空，默認為 index.html
    if (!filePath) {
        filePath = 'index.html';
    }
    
    // 檢查檔案是否存在
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('檔案不存在: ' + filePath);
        return;
    }
    
    // 根據檔案副檔名設置 Content-Type
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[ext] || 'text/plain';
    res.setHeader('Content-Type', contentType);
    
    // 讀取並發送檔案
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200);
        res.end(content);
    } catch (error) {
        console.error('讀取檔案失敗:', error);
        res.writeHead(500);
        res.end('讀取檔案失敗');
    }
}

// 創建伺服器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    // 設置 CORS 頭
    setCorsHeaders(res);
    
    // 處理 OPTIONS 請求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API 路由處理
    if (pathname === '/api/get-templates.php' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        handleGetTemplates(req, res);
    } else if (pathname === '/api/save-template.php' && req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        handleSaveTemplate(req, res);
    } else {
        // 處理靜態檔案
        serveStaticFile(pathname, res);
    }
});

// 處理獲取模板請求
function handleGetTemplates(req, res) {
    try {
        const data = readTemplates();
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: '成功獲取模板數據',
            data: data
        }));
    } catch (error) {
        console.error('獲取模板失敗:', error);
        res.writeHead(500);
        res.end(JSON.stringify({
            success: false,
            message: '獲取模板失敗: ' + error.message
        }));
    }
}

// 處理保存模板請求
function handleSaveTemplate(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const templateData = JSON.parse(body);
            
            // 驗證必要欄位
            const requiredFields = ['id', 'code', 'category', 'title', 'description', 'content', 'status'];
            for (const field of requiredFields) {
                if (!templateData[field]) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: `缺少必要欄位: ${field}`
                    }));
                    return;
                }
            }
            
            // 讀取現有數據
            const existingData = readTemplates();
            
            // 查找現有模板
            let templateIndex = -1;
            for (let i = 0; i < existingData.templates.length; i++) {
                if (existingData.templates[i].id === templateData.id) {
                    templateIndex = i;
                    break;
                }
            }
            
            // 準備新模板數據
            const newTemplate = {
                id: templateData.id,
                code: templateData.code,
                category: templateData.category,
                title: templateData.title,
                description: templateData.description,
                content: templateData.content,
                status: templateData.status,
                updatedAt: new Date().toISOString()
            };
            
            // 如果是新模板，添加創建時間
            if (templateIndex === -1) {
                newTemplate.createdAt = new Date().toISOString();
                existingData.templates.push(newTemplate);
            } else {
                // 保留原始創建時間
                newTemplate.createdAt = existingData.templates[templateIndex].createdAt;
                existingData.templates[templateIndex] = newTemplate;
            }
            
            // 更新元數據
            existingData.metadata.totalTemplates = existingData.templates.length;
            existingData.metadata.lastUpdated = new Date().toISOString();
            
            // 重新計算分類統計
            const categoryCounts = {};
            for (const template of existingData.templates) {
                const category = template.category;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
            existingData.metadata.categories = categoryCounts;
            
            // 保存數據
            if (saveTemplates(existingData)) {
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    message: templateIndex === -1 ? '模板新增成功' : '模板更新成功',
                    data: {
                        templateId: templateData.id,
                        totalTemplates: existingData.metadata.totalTemplates,
                        lastUpdated: existingData.metadata.lastUpdated
                    }
                }));
            } else {
                throw new Error('保存數據失敗');
            }
            
        } catch (error) {
            console.error('保存模板失敗:', error);
            res.writeHead(500);
            res.end(JSON.stringify({
                success: false,
                message: '保存失敗: ' + error.message
            }));
        }
    });
}

// 啟動伺服器
server.listen(PORT, () => {
    console.log(`🚀 本地測試伺服器已啟動`);
    console.log(`📡 伺服器地址: http://localhost:${PORT}`);
    console.log(`📁 數據文件: ${TEMPLATE_FILE}`);
    console.log(`🔧 API 端點:`);
    console.log(`   GET  /api/get-templates.php - 獲取模板`);
    console.log(`   POST /api/save-template.php - 保存模板`);
    console.log(`📄 靜態檔案:`);
    console.log(`   GET  /debug-save-issue.html - 診斷工具`);
    console.log(`   GET  /index.html - 主頁面`);
    console.log(`\n💡 使用說明:`);
    console.log(`1. 在瀏覽器中打開 http://localhost:${PORT}/debug-save-issue.html`);
    console.log(`2. 點擊「執行完整診斷」按鈕`);
    console.log(`3. 查看診斷結果`);
    console.log(`\n按 Ctrl+C 停止伺服器`);
});

// 優雅關閉
process.on('SIGINT', () => {
    console.log('\n🛑 正在關閉伺服器...');
    server.close(() => {
        console.log('✅ 伺服器已關閉');
        process.exit(0);
    });
}); 