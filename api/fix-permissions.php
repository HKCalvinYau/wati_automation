<?php
/**
 * 權限修復腳本
 * 用於修復生產環境的文件權限問題
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

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'operations' => [],
    'errors' => [],
    'success' => true
];

try {
    // 1. 創建必要的目錄
    $directories = [
        '../data',
        '../data/templates',
        '../data/logs'
    ];
    
    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            $mkdirResult = mkdir($dir, 0755, true);
            $results['operations'][] = [
                'action' => 'create_directory',
                'path' => $dir,
                'success' => $mkdirResult,
                'error' => $mkdirResult ? null : error_get_last()
            ];
            
            if (!$mkdirResult) {
                $results['success'] = false;
                $results['errors'][] = "無法創建目錄: $dir";
            }
        }
    }
    
    // 2. 設置目錄權限
    foreach ($directories as $dir) {
        if (is_dir($dir)) {
            $chmodResult = chmod($dir, 0755);
            $results['operations'][] = [
                'action' => 'set_directory_permissions',
                'path' => $dir,
                'permissions' => '0755',
                'success' => $chmodResult,
                'error' => $chmodResult ? null : error_get_last()
            ];
            
            if (!$chmodResult) {
                $results['errors'][] = "無法設置目錄權限: $dir";
            }
        }
    }
    
    // 3. 創建必要的文件
    $files = [
        '../data/templates/template-data.json',
        '../data/logs/template-updates.log'
    ];
    
    foreach ($files as $file) {
        if (!file_exists($file)) {
            $dir = dirname($file);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            
            // 創建初始文件內容
            $initialContent = '';
            if (strpos($file, 'template-data.json') !== false) {
                $initialContent = json_encode([
                    'metadata' => [
                        'totalTemplates' => 0,
                        'lastUpdated' => date('c'),
                        'version' => '2.0.0'
                    ],
                    'templates' => []
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            
            $writeResult = file_put_contents($file, $initialContent);
            $results['operations'][] = [
                'action' => 'create_file',
                'path' => $file,
                'success' => $writeResult !== false,
                'error' => $writeResult === false ? error_get_last() : null
            ];
            
            if ($writeResult === false) {
                $results['success'] = false;
                $results['errors'][] = "無法創建文件: $file";
            }
        }
    }
    
    // 4. 設置文件權限
    foreach ($files as $file) {
        if (file_exists($file)) {
            $chmodResult = chmod($file, 0644);
            $results['operations'][] = [
                'action' => 'set_file_permissions',
                'path' => $file,
                'permissions' => '0644',
                'success' => $chmodResult,
                'error' => $chmodResult ? null : error_get_last()
            ];
            
            if (!$chmodResult) {
                $results['errors'][] = "無法設置文件權限: $file";
            }
        }
    }
    
    // 5. 測試寫入功能
    $testFile = '../data/templates/test-permissions-' . time() . '.json';
    $testContent = json_encode(['test' => 'permissions', 'timestamp' => time()]);
    $writeTest = file_put_contents($testFile, $testContent);
    
    $results['operations'][] = [
        'action' => 'test_write',
        'path' => $testFile,
        'success' => $writeTest !== false,
        'error' => $writeTest === false ? error_get_last() : null
    ];
    
    if ($writeTest === false) {
        $results['success'] = false;
        $results['errors'][] = "寫入測試失敗";
    } else {
        // 清理測試文件
        unlink($testFile);
    }
    
    // 6. 檢查最終狀態
    $finalStatus = [];
    foreach ($directories as $dir) {
        $finalStatus[$dir] = [
            'exists' => is_dir($dir),
            'readable' => is_readable($dir),
            'writable' => is_writable($dir),
            'permissions' => is_dir($dir) ? substr(sprintf('%o', fileperms($dir)), -4) : 'N/A'
        ];
    }
    
    foreach ($files as $file) {
        $finalStatus[$file] = [
            'exists' => file_exists($file),
            'readable' => is_readable($file),
            'writable' => is_writable($file),
            'permissions' => file_exists($file) ? substr(sprintf('%o', fileperms($file)), -4) : 'N/A'
        ];
    }
    
    $results['final_status'] = $finalStatus;
    
    // 7. 生成建議
    $suggestions = [];
    
    if ($results['success']) {
        $suggestions[] = '權限修復完成，現在可以正常保存模板';
        $suggestions[] = '建議定期檢查文件權限';
    } else {
        $suggestions[] = '部分權限修復失敗，請手動檢查';
        $suggestions[] = '可能需要聯繫主機提供商設置權限';
    }
    
    $results['suggestions'] = $suggestions;
    
    // 返回結果
    if ($results['success']) {
        echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    $results['success'] = false;
    $results['errors'][] = $e->getMessage();
    
    http_response_code(500);
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?> 