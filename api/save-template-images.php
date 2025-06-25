<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

try {
    // 獲取 POST 數據
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('無效的 JSON 數據');
    }
    
    $templateId = $data['templateId'] ?? null;
    $images = $data['images'] ?? [];
    
    if (!$templateId) {
        throw new Exception('缺少模板ID');
    }
    
    // 讀取現有的模板數據
    $templateDataFile = '../data/templates/template-data.json';
    if (!file_exists($templateDataFile)) {
        throw new Exception('模板數據文件不存在');
    }
    
    $templateData = json_decode(file_get_contents($templateDataFile), true);
    if (!$templateData || !isset($templateData['templates'])) {
        throw new Exception('模板數據格式錯誤');
    }
    
    // 找到對應的模板並更新圖片
    $templateFound = false;
    foreach ($templateData['templates'] as &$template) {
        if ($template['id'] === $templateId) {
            $template['images'] = $images;
            $template['updatedAt'] = date('c');
            $templateFound = true;
            break;
        }
    }
    
    if (!$templateFound) {
        throw new Exception('模板不存在: ' . $templateId);
    }
    
    // 更新元數據
    $templateData['metadata']['lastUpdated'] = date('c');
    
    // 保存回文件
    $result = file_put_contents($templateDataFile, json_encode($templateData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception('保存文件失敗');
    }
    
    // 返回成功響應
    echo json_encode([
        'success' => true,
        'message' => '圖片保存成功',
        'data' => [
            'templateId' => $templateId,
            'imageCount' => count($images),
            'updatedAt' => date('c')
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 