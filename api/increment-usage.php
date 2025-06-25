<?php
/**
 * 模板使用次數統計 API
 * 處理模板使用次數的增加
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
if (!$data || !isset($data['templateId'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少模板ID'
    ]);
    exit();
}

try {
    $templateId = $data['templateId'];
    
    // 讀取模板數據文件
    $templateFile = '../data/templates/template-data.json';
    $usageFile = '../data/templates/usage-data.json';
    
    if (!file_exists($templateFile)) {
        throw new Exception('模板數據文件不存在');
    }
    
    $templateData = json_decode(file_get_contents($templateFile), true);
    if (!$templateData || !isset($templateData['templates'])) {
        throw new Exception('模板數據格式錯誤');
    }
    
    // 查找模板
    $templateIndex = -1;
    foreach ($templateData['templates'] as $index => $template) {
        if ($template['id'] === $templateId) {
            $templateIndex = $index;
            break;
        }
    }
    
    if ($templateIndex === -1) {
        throw new Exception('模板不存在');
    }
    
    // 更新模板使用次數
    if (!isset($templateData['templates'][$templateIndex]['usageCount'])) {
        $templateData['templates'][$templateIndex]['usageCount'] = 0;
    }
    $templateData['templates'][$templateIndex]['usageCount']++;
    $templateData['templates'][$templateIndex]['lastUsed'] = date('c');
    $templateData['templates'][$templateIndex]['updatedAt'] = date('c');
    
    // 保存模板數據
    $jsonContent = json_encode($templateData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($templateFile, $jsonContent) === false) {
        throw new Exception('無法保存模板數據');
    }
    
    // 更新使用統計文件
    $usageData = [];
    if (file_exists($usageFile)) {
        $usageData = json_decode(file_get_contents($usageFile), true) ?: [];
    }
    
    $usageData[$templateId] = [
        'usageCount' => $templateData['templates'][$templateIndex]['usageCount'],
        'lastUsed' => date('c'),
        'updatedAt' => date('c')
    ];
    
    // 確保目錄存在
    $dir = dirname($usageFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // 保存使用統計
    $usageJson = json_encode($usageData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($usageFile, $usageJson) === false) {
        throw new Exception('無法保存使用統計');
    }
    
    // 記錄操作日誌
    $logFile = '../data/logs/usage-updates.log';
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = date('Y-m-d H:i:s') . " - 模板使用: " . $templateId . 
                " (次數: " . $templateData['templates'][$templateIndex]['usageCount'] . ")\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    // 返回成功響應
    echo json_encode([
        'success' => true,
        'message' => '使用次數更新成功',
        'data' => [
            'templateId' => $templateId,
            'usageCount' => $templateData['templates'][$templateIndex]['usageCount'],
            'lastUsed' => $templateData['templates'][$templateIndex]['lastUsed']
        ]
    ]);
    
} catch (Exception $e) {
    // 記錄錯誤
    error_log("使用次數更新錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '更新失敗: ' . $e->getMessage()
    ]);
}
?> 