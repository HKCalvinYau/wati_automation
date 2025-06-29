<?php
/**
 * 簡化模板保存 API - 用於 Cloudways 測試
 */

// 設置響應頭
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 只允許 POST 請求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '只允許 POST 請求'
    ]);
    exit();
}

// 獲取 POST 資料
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// 記錄請求資料
error_log("收到保存請求: " . $input);

// 驗證資料
if (!$data) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的 JSON 資料'
    ]);
    exit();
}

// 驗證必要欄位（簡化版本）
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少必要欄位: id'
    ]);
    exit();
}

// 檢查是否有要更新的內容
if (!isset($data['content']) && !isset($data['variables']) && !isset($data['title'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少更新內容: 需要提供 content、variables 或 title'
    ]);
    exit();
}

try {
    // 讀取現有資料
    $templateFile = '../data/templates/template-data.json';
    
    // 讀取現有模板資料
    $existingData = [];
    if (file_exists($templateFile)) {
        $existingContent = file_get_contents($templateFile);
        $existingData = json_decode($existingContent, true);
        if (!$existingData) {
            // 如果解析失敗，創建新的結構
            $existingData = [
                'metadata' => [
                    'totalTemplates' => 0,
                    'lastUpdated' => date('c'),
                    'version' => '2.0.0'
                ],
                'templates' => []
            ];
        }
    } else {
        // 如果檔案不存在，創建基本結構
        $existingData = [
            'metadata' => [
                'totalTemplates' => 0,
                'lastUpdated' => date('c'),
                'version' => '2.0.0'
            ],
            'templates' => []
        ];
    }
    
    // 檢查是否為更新或新增
    $templateIndex = -1;
    foreach ($existingData['templates'] as $index => $template) {
        if ($template['id'] === $data['id']) {
            $templateIndex = $index;
            break;
        }
    }
    
    if ($templateIndex === -1) {
        // 新增模板
        $templateData = [
            'id' => $data['id'],
            'code' => $data['code'] ?? $data['id'],
            'category' => $data['category'] ?? '未分類',
            'title' => $data['title'],
            'description' => $data['description'] ?? $data['title'],
            'content' => $data['content'] ?? $data['title'],
            'status' => $data['status'] ?? 'active',
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        // 添加變數（如果提供）
        if (isset($data['variables'])) {
            $templateData['variables'] = $data['variables'];
        }
        
        $existingData['templates'][] = $templateData;
    } else {
        // 更新現有模板
        $existingTemplate = $existingData['templates'][$templateIndex];
        
        // 更新內容（如果提供）
        if (isset($data['content'])) {
            $existingTemplate['content'] = $data['content'];
        }
        
        // 更新變數（如果提供）
        if (isset($data['variables'])) {
            $existingTemplate['variables'] = $data['variables'];
        }
        
        // 更新其他欄位（如果提供）
        if (isset($data['title'])) {
            $existingTemplate['title'] = $data['title'];
        }
        if (isset($data['description'])) {
            $existingTemplate['description'] = $data['description'];
        }
        if (isset($data['category'])) {
            $existingTemplate['category'] = $data['category'];
        }
        if (isset($data['status'])) {
            $existingTemplate['status'] = $data['status'];
        }
        
        $existingTemplate['updatedAt'] = date('c');
        $existingData['templates'][$templateIndex] = $existingTemplate;
    }
    
    // 更新元資料
    $existingData['metadata']['totalTemplates'] = count($existingData['templates']);
    $existingData['metadata']['lastUpdated'] = date('c');
    
    // 確保目錄存在
    $dir = dirname($templateFile);
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0755, true)) {
            throw new Exception('無法創建目錄: ' . $dir);
        }
    }
    
    // 保存到檔案
    $jsonContent = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($jsonContent === false) {
        throw new Exception('JSON 編碼失敗');
    }
    
    // 寫入檔案
    if (file_put_contents($templateFile, $jsonContent) === false) {
        throw new Exception('無法寫入模板檔案');
    }
    
    // 記錄成功
    error_log("模板保存成功: " . $data['id']);
    
    // 返回成功響應
    echo json_encode([
        'success' => true,
        'message' => ($templateIndex === -1 ? '模板新增成功' : '模板更新成功'),
        'data' => [
            'templateId' => $data['id'],
            'totalTemplates' => $existingData['metadata']['totalTemplates'],
            'lastUpdated' => $existingData['metadata']['lastUpdated']
        ]
    ]);
    
} catch (Exception $e) {
    // 記錄錯誤
    error_log("模板保存錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '保存失敗: ' . $e->getMessage()
    ]);
}
?> 