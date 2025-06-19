<?php
/**
 * 模板保存 API
 * 處理模板的保存、更新和刪除操作
 */

// 設定 CORS 標頭
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 設定錯誤報告
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 設定時區
date_default_timezone_set('Asia/Hong_Kong');

/**
 * 獲取模板數據檔案路徑
 */
function getTemplateDataPath() {
    return __DIR__ . '/../data/templates/template-data.json';
}

/**
 * 讀取模板數據
 */
function readTemplateData() {
    $filePath = getTemplateDataPath();
    
    if (!file_exists($filePath)) {
        return ['templates' => []];
    }
    
    $content = file_get_contents($filePath);
    if ($content === false) {
        throw new Exception('無法讀取模板數據檔案');
    }
    
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('模板數據檔案格式錯誤');
    }
    
    return $data;
}

/**
 * 保存模板數據
 */
function saveTemplateData($data) {
    $filePath = getTemplateDataPath();
    $dir = dirname($filePath);
    
    // 確保目錄存在
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0755, true)) {
            throw new Exception('無法創建目錄');
        }
    }
    
    // 格式化 JSON
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 編碼錯誤');
    }
    
    // 寫入檔案
    if (file_put_contents($filePath, $jsonContent) === false) {
        throw new Exception('無法寫入模板數據檔案');
    }
    
    return true;
}

/**
 * 驗證模板數據
 */
function validateTemplate($template) {
    $required = ['id', 'code', 'category', 'title', 'content'];
    
    foreach ($required as $field) {
        if (!isset($template[$field]) || empty($template[$field])) {
            throw new Exception("缺少必填欄位: {$field}");
        }
    }
    
    // 驗證標題和內容結構
    if (!isset($template['title']['zh']) || empty($template['title']['zh'])) {
        throw new Exception('缺少繁體中文標題');
    }
    
    if (!isset($template['content']['zh']) || empty($template['content']['zh'])) {
        throw new Exception('缺少繁體中文內容');
    }
    
    return true;
}

/**
 * 生成唯一 ID
 */
function generateUniqueId($code, $existingTemplates) {
    $baseId = $code;
    $id = $baseId;
    $counter = 1;
    
    while (array_filter($existingTemplates, function($t) use ($id) { return $t['id'] === $id; })) {
        $id = $baseId . '_' . $counter;
        $counter++;
    }
    
    return $id;
}

// 處理請求
try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'POST':
            // 創建新模板
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('無效的請求數據');
            }
            
            // 讀取現有數據
            $data = readTemplateData();
            
            // 驗證模板數據
            validateTemplate($input);
            
            // 生成唯一 ID
            $input['id'] = generateUniqueId($input['code'], $data['templates']);
            
            // 添加時間戳
            $input['created_at'] = date('c');
            $input['updated_at'] = date('c');
            
            // 添加到模板列表
            $data['templates'][] = $input;
            
            // 保存數據
            saveTemplateData($data);
            
            echo json_encode([
                'success' => true,
                'message' => '模板保存成功',
                'template' => $input
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        case 'PUT':
            // 更新模板
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id'])) {
                throw new Exception('缺少模板 ID');
            }
            
            // 讀取現有數據
            $data = readTemplateData();
            
            // 查找並更新模板
            $found = false;
            foreach ($data['templates'] as &$template) {
                if ($template['id'] === $input['id']) {
                    $input['updated_at'] = date('c');
                    $template = array_merge($template, $input);
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                throw new Exception('模板不存在');
            }
            
            // 保存數據
            saveTemplateData($data);
            
            echo json_encode([
                'success' => true,
                'message' => '模板更新成功',
                'template' => $input
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        case 'DELETE':
            // 刪除模板
            $templateId = $_GET['id'] ?? null;
            
            if (!$templateId) {
                throw new Exception('缺少模板 ID');
            }
            
            // 讀取現有數據
            $data = readTemplateData();
            
            // 查找並刪除模板
            $found = false;
            $data['templates'] = array_filter($data['templates'], function($template) use ($templateId, &$found) {
                if ($template['id'] === $templateId) {
                    $found = true;
                    return false;
                }
                return true;
            });
            
            if (!$found) {
                throw new Exception('模板不存在');
            }
            
            // 重新索引陣列
            $data['templates'] = array_values($data['templates']);
            
            // 保存數據
            saveTemplateData($data);
            
            echo json_encode([
                'success' => true,
                'message' => '模板刪除成功'
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        default:
            throw new Exception('不支援的請求方法');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?> 