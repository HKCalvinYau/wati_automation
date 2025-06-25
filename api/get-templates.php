<?php
/**
 * 模板獲取 API
 * 處理模板資料的讀取和查詢
 */

// 設置響應頭
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma, Expires');

// 防止快取
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// 處理 OPTIONS 請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 只允許 GET 請求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '只允許 GET 請求'
    ]);
    exit();
}

try {
    // 模板資料檔案路徑
    $templateFile = '../data/templates/template-data.json';
    
    // 檢查檔案是否存在
    if (!file_exists($templateFile)) {
        // 如果檔案不存在，返回空資料結構
        $data = [
            'metadata' => [
                'totalTemplates' => 0,
                'categories' => [],
                'lastUpdated' => date('c'),
                'version' => '2.0.0'
            ],
            'templates' => []
        ];
    } else {
        // 讀取檔案內容
        $content = file_get_contents($templateFile);
        if ($content === false) {
            throw new Exception('無法讀取模板資料檔案');
        }
        
        // 解析 JSON
        $data = json_decode($content, true);
        if ($data === null) {
            throw new Exception('模板資料檔案格式錯誤');
        }
    }
    
    // 處理查詢參數
    $category = $_GET['category'] ?? null;
    $status = $_GET['status'] ?? null;
    $search = $_GET['search'] ?? null;
    $limit = intval($_GET['limit'] ?? 0);
    $offset = intval($_GET['offset'] ?? 0);
    
    // 過濾模板
    $filteredTemplates = $data['templates'];
    
    // 按分類過濾
    if ($category && $category !== 'all') {
        $filteredTemplates = array_filter($filteredTemplates, function($template) use ($category) {
            return $template['category'] === $category;
        });
    }
    
    // 按狀態過濾
    if ($status) {
        $filteredTemplates = array_filter($filteredTemplates, function($template) use ($status) {
            return $template['status'] === $status;
        });
    }
    
    // 搜索過濾
    if ($search) {
        $searchLower = strtolower($search);
        $filteredTemplates = array_filter($filteredTemplates, function($template) use ($searchLower) {
            $title = strtolower($template['title']['zh'] ?? '') . ' ' . strtolower($template['title']['en'] ?? '');
            $description = strtolower($template['description']['zh'] ?? '') . ' ' . strtolower($template['description']['en'] ?? '');
            $content = strtolower($template['content']['zh'] ?? '') . ' ' . strtolower($template['content']['en'] ?? '');
            $code = strtolower($template['code'] ?? '');
            
            return strpos($title, $searchLower) !== false ||
                   strpos($description, $searchLower) !== false ||
                   strpos($content, $searchLower) !== false ||
                   strpos($code, $searchLower) !== false;
        });
    }
    
    // 重新索引陣列
    $filteredTemplates = array_values($filteredTemplates);
    
    // 分頁處理
    $totalCount = count($filteredTemplates);
    if ($limit > 0) {
        $filteredTemplates = array_slice($filteredTemplates, $offset, $limit);
    }
    
    // 更新元資料
    $data['metadata']['totalTemplates'] = $totalCount;
    $data['metadata']['filteredCount'] = count($filteredTemplates);
    $data['metadata']['limit'] = $limit;
    $data['metadata']['offset'] = $offset;
    
    // 重新計算分類統計
    $categoryCounts = [];
    foreach ($data['templates'] as $template) {
        $cat = $template['category'];
        $categoryCounts[$cat] = ($categoryCounts[$cat] ?? 0) + 1;
    }
    $data['metadata']['categories'] = $categoryCounts;
    
    // 返回資料
    echo json_encode([
        'success' => true,
        'data' => [
            'metadata' => $data['metadata'],
            'templates' => $filteredTemplates
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    // 記錄錯誤
    error_log("模板獲取錯誤: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '獲取資料失敗: ' . $e->getMessage()
    ]);
}
?> 