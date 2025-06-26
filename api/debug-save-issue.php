<?php
/**
 * 保存問題診斷腳本
 * 用於檢查生產環境的保存問題
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

// 診斷結果
$diagnosis = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'script_filename' => __FILE__,
        'current_dir' => getcwd(),
    ],
    'file_permissions' => [],
    'php_settings' => [],
    'directory_tests' => [],
    'write_tests' => [],
    'errors' => []
];

// 1. 檢查 PHP 設置
$diagnosis['php_settings'] = [
    'file_uploads' => ini_get('file_uploads'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
    'display_errors' => ini_get('display_errors'),
    'log_errors' => ini_get('log_errors'),
    'error_log' => ini_get('error_log')
];

// 2. 檢查目錄結構和權限
$directories = [
    '../data',
    '../data/templates',
    '../data/logs',
    '../api'
];

foreach ($directories as $dir) {
    $fullPath = realpath($dir);
    $diagnosis['directory_tests'][$dir] = [
        'exists' => file_exists($dir),
        'is_dir' => is_dir($dir),
        'readable' => is_readable($dir),
        'writable' => is_writable($dir),
        'permissions' => file_exists($dir) ? substr(sprintf('%o', fileperms($dir)), -4) : 'N/A',
        'full_path' => $fullPath ?: 'Not found'
    ];
}

// 3. 檢查文件權限
$files = [
    '../data/templates/template-data.json',
    '../data/logs/template-updates.log'
];

foreach ($files as $file) {
    $diagnosis['file_permissions'][$file] = [
        'exists' => file_exists($file),
        'readable' => is_readable($file),
        'writable' => is_writable($file),
        'permissions' => file_exists($file) ? substr(sprintf('%o', fileperms($file)), -4) : 'N/A',
        'size' => file_exists($file) ? filesize($file) : 'N/A'
    ];
}

// 4. 測試寫入功能
$testDir = '../data/templates';
$testFile = $testDir . '/test-write-' . time() . '.json';

// 測試目錄創建
if (!is_dir($testDir)) {
    $mkdirResult = mkdir($testDir, 0755, true);
    $diagnosis['write_tests']['mkdir'] = [
        'tested' => true,
        'success' => $mkdirResult,
        'error' => $mkdirResult ? null : error_get_last()
    ];
}

// 測試文件寫入
$testContent = json_encode(['test' => 'data', 'timestamp' => time()]);
$writeResult = file_put_contents($testFile, $testContent);

$diagnosis['write_tests']['file_write'] = [
    'tested' => true,
    'success' => $writeResult !== false,
    'bytes_written' => $writeResult,
    'error' => $writeResult === false ? error_get_last() : null
];

// 清理測試文件
if (file_exists($testFile)) {
    unlink($testFile);
}

// 5. 檢查錯誤日誌
$errorLog = ini_get('error_log');
if ($errorLog && file_exists($errorLog)) {
    $diagnosis['error_log'] = [
        'path' => $errorLog,
        'readable' => is_readable($errorLog),
        'size' => filesize($errorLog),
        'last_modified' => date('Y-m-d H:i:s', filemtime($errorLog))
    ];
}

// 6. 測試 JSON 編碼/解碼
$testData = ['test' => '中文測試', 'number' => 123];
$jsonEncodeTest = json_encode($testData, JSON_UNESCAPED_UNICODE);
$jsonDecodeTest = json_decode($jsonEncodeTest, true);

$diagnosis['json_tests'] = [
    'encode_success' => $jsonEncodeTest !== false,
    'decode_success' => $jsonDecodeTest !== null,
    'unicode_support' => strpos($jsonEncodeTest, '中文') !== false
];

// 7. 檢查當前請求信息
$diagnosis['request_info'] = [
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Unknown',
    'content_length' => $_SERVER['CONTENT_LENGTH'] ?? 'Unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
];

// 8. 測試 POST 數據讀取
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $diagnosis['post_data_test'] = [
        'input_received' => !empty($input),
        'input_length' => strlen($input),
        'json_decode_success' => json_decode($input) !== null
    ];
}

// 9. 檢查環境變數
$diagnosis['environment'] = [
    'APP_ENV' => $_ENV['APP_ENV'] ?? 'Not set',
    'APP_DEBUG' => $_ENV['APP_DEBUG'] ?? 'Not set',
    'APP_URL' => $_ENV['APP_URL'] ?? 'Not set'
];

// 10. 生成建議
$suggestions = [];

if (!$diagnosis['directory_tests']['../data']['writable']) {
    $suggestions[] = 'data 目錄沒有寫入權限，請設置為 755 或 777';
}

if (!$diagnosis['directory_tests']['../data/templates']['writable']) {
    $suggestions[] = 'data/templates 目錄沒有寫入權限，請設置為 755 或 777';
}

if ($diagnosis['php_settings']['display_errors'] === '0') {
    $suggestions[] = '建議在開發環境啟用 display_errors 以便調試';
}

if (empty($diagnosis['error_log']['path'])) {
    $suggestions[] = '未設置錯誤日誌路徑，建議配置 error_log';
}

$diagnosis['suggestions'] = $suggestions;

// 返回診斷結果
echo json_encode($diagnosis, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 