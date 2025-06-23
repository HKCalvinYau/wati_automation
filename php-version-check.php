<?php
/**
 * PHP 版本和環境檢查工具
 */

// 設置響應頭
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 收集系統信息
$systemInfo = [
    'php_version' => PHP_VERSION,
    'php_version_id' => PHP_VERSION_ID,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
    'current_working_directory' => getcwd(),
    'file_permissions' => [],
    'extensions' => [],
    'functions' => []
];

// 檢查檔案權限
$filesToCheck = [
    '../data/templates/template-data.json',
    '../data/templates/',
    '../data/',
    './'
];

foreach ($filesToCheck as $file) {
    if (file_exists($file)) {
        $systemInfo['file_permissions'][$file] = [
            'exists' => true,
            'readable' => is_readable($file),
            'writable' => is_writable($file),
            'permissions' => substr(sprintf('%o', fileperms($file)), -4)
        ];
    } else {
        $systemInfo['file_permissions'][$file] = [
            'exists' => false,
            'readable' => false,
            'writable' => false,
            'permissions' => 'N/A'
        ];
    }
}

// 檢查重要 PHP 擴展
$importantExtensions = [
    'json',
    'fileinfo',
    'mbstring',
    'openssl'
];

foreach ($importantExtensions as $ext) {
    $systemInfo['extensions'][$ext] = extension_loaded($ext);
}

// 檢查重要函數
$importantFunctions = [
    'json_encode',
    'json_decode',
    'file_get_contents',
    'file_put_contents',
    'mkdir',
    'is_dir',
    'is_file'
];

foreach ($importantFunctions as $func) {
    $systemInfo['functions'][$func] = function_exists($func);
}

// 檢查 JSON 功能
$jsonTest = ['test' => 'value'];
$systemInfo['json_test'] = [
    'encode' => json_encode($jsonTest),
    'decode' => json_decode(json_encode($jsonTest), true)
];

// 檢查檔案寫入測試
$testFile = '../data/test-write.txt';
$writeTest = false;
$writeError = '';

try {
    if (file_put_contents($testFile, 'test') !== false) {
        $writeTest = true;
        unlink($testFile); // 清理測試檔案
    }
} catch (Exception $e) {
    $writeError = $e->getMessage();
}

$systemInfo['write_test'] = [
    'success' => $writeTest,
    'error' => $writeError
];

// 檢查錯誤報告設置
$systemInfo['error_reporting'] = [
    'display_errors' => ini_get('display_errors'),
    'log_errors' => ini_get('log_errors'),
    'error_log' => ini_get('error_log'),
    'error_reporting_level' => error_reporting()
];

// 返回結果
echo json_encode($systemInfo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 