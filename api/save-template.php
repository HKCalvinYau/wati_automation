<?php
/**
 * 模板保存 API
 * 處理模板資料的保存和更新
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

// 驗證資料
if (!$data) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '無效的 JSON 資料'
    ]);
    exit();
}

// 驗證必要欄位
$requiredFields = ['id', 'code', 'category', 'title', 'description', 'content', 'status'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "缺少必要欄位: {$field}"
        ]);
        exit();
    }
}

try {
    // 讀取現有資料
    $templateFile = '../data/templates/template-data.json';
    $backupFile = '../data/templates/template-data.backup.json';
    
    // 創建備份
    if (file_exists($templateFile)) {
        copy($templateFile, $backupFile);
    }
    
    // 讀取現有模板資料
    $existingData = [];
    if (file_exists($templateFile)) {
        $existingContent = file_get_contents($templateFile);
        $existingData = json_decode($existingContent, true);
        if (!$existingData) {
            throw new Exception('無法解析現有模板資料');
        }
    } else {
        // 如果檔案不存在，創建基本結構
        $existingData = [
            'metadata' => [
                'totalTemplates' => 0,
                'categories' => [],
                'lastUpdated' => date('c'),
                'version' => '2.0.0'
            ],
            'templates' => []
        ];
    }
    
    // 更新或新增模板
    $templateIndex = -1;
    foreach ($existingData['templates'] as $index => $template) {
        if ($template['id'] === $data['id']) {
            $templateIndex = $index;
            break;
        }
    }
    
    // 準備模板資料
    $templateData = [
        'id' => $data['id'],
        'code' => $data['code'],
        'category' => $data['category'],
        'title' => $data['title'],
        'description' => $data['description'],
        'content' => $data['content'],
        'status' => $data['status'],
        'updatedAt' => date('c')
    ];
    
    // 如果是新模板，添加創建時間
    if ($templateIndex === -1) {
        $templateData['createdAt'] = date('c');
        $existingData['templates'][] = $templateData;
    } else {
        // 保留原始創建時間
        $templateData['createdAt'] = $existingData['templates'][$templateIndex]['createdAt'];
        $existingData['templates'][$templateIndex] = $templateData;
    }
    
    // 更新元資料
    $existingData['metadata']['totalTemplates'] = count($existingData['templates']);
    $existingData['metadata']['lastUpdated'] = date('c');
    
    // 重新計算分類統計
    $categoryCounts = [];
    foreach ($existingData['templates'] as $template) {
        $category = $template['category'];
        $categoryCounts[$category] = ($categoryCounts[$category] ?? 0) + 1;
    }
    $existingData['metadata']['categories'] = $categoryCounts;
    
    // 保存到檔案
    $jsonContent = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($jsonContent === false) {
        throw new Exception('JSON 編碼失敗');
    }
    
    // 確保目錄存在
    $dir = dirname($templateFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // 寫入檔案
    if (file_put_contents($templateFile, $jsonContent) === false) {
        throw new Exception('無法寫入模板檔案');
    }
    
    // 記錄操作日誌
    $logFile = '../data/logs/template-updates.log';
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = date('Y-m-d H:i:s') . " - " . 
                ($templateIndex === -1 ? '新增' : '更新') . " 模板: " . 
                $data['id'] . " (" . $data['code'] . ")\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    
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