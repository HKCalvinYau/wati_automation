<?php
/**
 * WATI Automation WordPress 主題功能文件
 * 
 * @package WATI_Automation
 * @version 2.0.0
 */

// 防止直接訪問
if (!defined('ABSPATH')) {
    exit;
}

/**
 * 主題設置
 */
function wati_automation_setup() {
    // 添加主題支援
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-logo');
    add_theme_support('customize-selective-refresh-widgets');
    
    // 註冊導航菜單
    register_nav_menus(array(
        'primary' => __('主要導航', 'wati-automation'),
        'footer' => __('頁腳導航', 'wati-automation'),
    ));
}
add_action('after_setup_theme', 'wati_automation_setup');

/**
 * 註冊小工具區域
 */
function wati_automation_widgets_init() {
    register_sidebar(array(
        'name'          => __('側邊欄', 'wati-automation'),
        'id'            => 'sidebar-1',
        'description'   => __('添加小工具到此區域', 'wati-automation'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => __('頁腳小工具區域', 'wati-automation'),
        'id'            => 'footer-1',
        'description'   => __('添加小工具到頁腳', 'wati-automation'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'wati_automation_widgets_init');

/**
 * 註冊樣式和腳本
 */
function wati_automation_scripts() {
    // 註冊主題樣式
    wp_enqueue_style('wati-automation-style', get_stylesheet_uri(), array(), '2.0.0');
    
    // 註冊主要樣式文件
    wp_enqueue_style('wati-automation-main', get_template_directory_uri() . '/../../../css/main.css', array(), '2.0.0');
    
    // 註冊 Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
    
    // 註冊 JavaScript 文件
    wp_enqueue_script('wati-automation-main', get_template_directory_uri() . '/../../../js/main.js', array('jquery'), '2.0.0', true);
    
    // 註冊組件腳本
    wp_enqueue_script('wati-automation-components', get_template_directory_uri() . '/../../../js/components/TemplateManager.js', array('jquery'), '2.0.0', true);
    
    // 本地化腳本
    wp_localize_script('wati-automation-main', 'wati_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('wati_nonce'),
        'rest_url' => rest_url(),
        'rest_nonce' => wp_create_nonce('wp_rest'),
    ));
}
add_action('wp_enqueue_scripts', 'wati_automation_scripts');

/**
 * 註冊自定義文章類型
 */
function wati_automation_post_types() {
    // 註冊模板文章類型
    register_post_type('wati_template', array(
        'labels' => array(
            'name' => __('WhatsApp 模板', 'wati-automation'),
            'singular_name' => __('模板', 'wati-automation'),
            'add_new' => __('新增模板', 'wati-automation'),
            'add_new_item' => __('新增模板', 'wati-automation'),
            'edit_item' => __('編輯模板', 'wati-automation'),
            'new_item' => __('新模板', 'wati-automation'),
            'view_item' => __('查看模板', 'wati-automation'),
            'search_items' => __('搜索模板', 'wati-automation'),
            'not_found' => __('未找到模板', 'wati-automation'),
            'not_found_in_trash' => __('回收站中未找到模板', 'wati-automation'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-format-chat',
        'rewrite' => array('slug' => 'templates'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'wati_automation_post_types');

/**
 * 註冊自定義分類法
 */
function wati_automation_taxonomies() {
    // 註冊模板分類
    register_taxonomy('wati_category', 'wati_template', array(
        'labels' => array(
            'name' => __('模板分類', 'wati-automation'),
            'singular_name' => __('分類', 'wati-automation'),
            'search_items' => __('搜索分類', 'wati-automation'),
            'all_items' => __('所有分類', 'wati-automation'),
            'parent_item' => __('父分類', 'wati-automation'),
            'parent_item_colon' => __('父分類:', 'wati-automation'),
            'edit_item' => __('編輯分類', 'wati-automation'),
            'update_item' => __('更新分類', 'wati-automation'),
            'add_new_item' => __('新增分類', 'wati-automation'),
            'new_item_name' => __('新分類名稱', 'wati-automation'),
            'menu_name' => __('分類', 'wati-automation'),
        ),
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'template-category'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'wati_automation_taxonomies');

/**
 * 添加自定義元框
 */
function wati_automation_meta_boxes() {
    add_meta_box(
        'wati_template_meta',
        __('模板詳細信息', 'wati-automation'),
        'wati_automation_meta_box_callback',
        'wati_template',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'wati_automation_meta_boxes');

/**
 * 元框回調函數
 */
function wati_automation_meta_box_callback($post) {
    wp_nonce_field('wati_template_meta_box', 'wati_template_meta_box_nonce');
    
    $template_code = get_post_meta($post->ID, '_template_code', true);
    $template_category = get_post_meta($post->ID, '_template_category', true);
    $template_status = get_post_meta($post->ID, '_template_status', true);
    $template_content_en = get_post_meta($post->ID, '_template_content_en', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th scope="row">
                <label for="template_code"><?php _e('模板代碼', 'wati-automation'); ?></label>
            </th>
            <td>
                <input type="text" id="template_code" name="template_code" value="<?php echo esc_attr($template_code); ?>" class="regular-text" />
            </td>
        </tr>
        <tr>
            <th scope="row">
                <label for="template_category"><?php _e('模板分類', 'wati-automation'); ?></label>
            </th>
            <td>
                <select id="template_category" name="template_category">
                    <option value=""><?php _e('選擇分類', 'wati-automation'); ?></option>
                    <option value="ic" <?php selected($template_category, 'ic'); ?>><?php _e('初步諮詢', 'wati-automation'); ?></option>
                    <option value="ac" <?php selected($template_category, 'ac'); ?>><?php _e('安排服務', 'wati-automation'); ?></option>
                    <option value="ps" <?php selected($template_category, 'ps'); ?>><?php _e('後續服務', 'wati-automation'); ?></option>
                    <option value="pp" <?php selected($template_category, 'pp'); ?>><?php _e('產品推廣', 'wati-automation'); ?></option>
                    <option value="pi" <?php selected($template_category, 'pi'); ?>><?php _e('付款相關', 'wati-automation'); ?></option>
                    <option value="ci" <?php selected($template_category, 'ci'); ?>><?php _e('公司介紹', 'wati-automation'); ?></option>
                    <option value="li" <?php selected($template_category, 'li'); ?>><?php _e('物流追蹤', 'wati-automation'); ?></option>
                    <option value="oi" <?php selected($template_category, 'oi'); ?>><?php _e('其他資訊', 'wati-automation'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row">
                <label for="template_status"><?php _e('模板狀態', 'wati-automation'); ?></label>
            </th>
            <td>
                <select id="template_status" name="template_status">
                    <option value="active" <?php selected($template_status, 'active'); ?>><?php _e('啟用', 'wati-automation'); ?></option>
                    <option value="draft" <?php selected($template_status, 'draft'); ?>><?php _e('草稿', 'wati-automation'); ?></option>
                    <option value="inactive" <?php selected($template_status, 'inactive'); ?>><?php _e('停用', 'wati-automation'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row">
                <label for="template_content_en"><?php _e('英文內容', 'wati-automation'); ?></label>
            </th>
            <td>
                <textarea id="template_content_en" name="template_content_en" rows="5" cols="50"><?php echo esc_textarea($template_content_en); ?></textarea>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * 保存元框數據
 */
function wati_automation_save_meta_box_data($post_id) {
    if (!isset($_POST['wati_template_meta_box_nonce'])) {
        return;
    }
    
    if (!wp_verify_nonce($_POST['wati_template_meta_box_nonce'], 'wati_template_meta_box')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['template_code'])) {
        update_post_meta($post_id, '_template_code', sanitize_text_field($_POST['template_code']));
    }
    
    if (isset($_POST['template_category'])) {
        update_post_meta($post_id, '_template_category', sanitize_text_field($_POST['template_category']));
    }
    
    if (isset($_POST['template_status'])) {
        update_post_meta($post_id, '_template_status', sanitize_text_field($_POST['template_status']));
    }
    
    if (isset($_POST['template_content_en'])) {
        update_post_meta($post_id, '_template_content_en', sanitize_textarea_field($_POST['template_content_en']));
    }
}
add_action('save_post', 'wati_automation_save_meta_box_data');

/**
 * 添加管理菜單
 */
function wati_automation_admin_menu() {
    add_menu_page(
        __('WATI 管理', 'wati-automation'),
        __('WATI 管理', 'wati-automation'),
        'manage_options',
        'wati-automation',
        'wati_automation_admin_page',
        'dashicons-format-chat',
        30
    );
    
    add_submenu_page(
        'wati-automation',
        __('模板管理', 'wati-automation'),
        __('模板管理', 'wati-automation'),
        'manage_options',
        'wati-templates',
        'wati_templates_admin_page'
    );
    
    add_submenu_page(
        'wati-automation',
        __('統計報告', 'wati-automation'),
        __('統計報告', 'wati-automation'),
        'manage_options',
        'wati-reports',
        'wati_reports_admin_page'
    );
}
add_action('admin_menu', 'wati_automation_admin_menu');

/**
 * 主管理頁面
 */
function wati_automation_admin_page() {
    ?>
    <div class="wrap wati-automation-admin">
        <h1><?php _e('WATI 自動化管理系統', 'wati-automation'); ?></h1>
        <div class="wati-admin-dashboard">
            <div class="wati-stats-grid">
                <div class="wati-stat-card">
                    <h3><?php _e('總模板數', 'wati-automation'); ?></h3>
                    <p class="wati-stat-number"><?php echo wp_count_posts('wati_template')->publish; ?></p>
                </div>
                <div class="wati-stat-card">
                    <h3><?php _e('活躍模板', 'wati-automation'); ?></h3>
                    <p class="wati-stat-number"><?php echo wati_count_active_templates(); ?></p>
                </div>
                <div class="wati-stat-card">
                    <h3><?php _e('今日使用', 'wati-automation'); ?></h3>
                    <p class="wati-stat-number"><?php echo wati_get_today_usage(); ?></p>
                </div>
            </div>
        </div>
    </div>
    <?php
}

/**
 * 模板管理頁面
 */
function wati_templates_admin_page() {
    ?>
    <div class="wrap wati-automation-admin">
        <h1><?php _e('模板管理', 'wati-automation'); ?></h1>
        <div class="wati-templates-admin">
            <p><?php _e('在這裡管理您的 WhatsApp 訊息模板。', 'wati-automation'); ?></p>
            <a href="<?php echo admin_url('post-new.php?post_type=wati_template'); ?>" class="button button-primary">
                <?php _e('新增模板', 'wati-automation'); ?>
            </a>
        </div>
    </div>
    <?php
}

/**
 * 統計報告頁面
 */
function wati_reports_admin_page() {
    ?>
    <div class="wrap wati-automation-admin">
        <h1><?php _e('統計報告', 'wati-automation'); ?></h1>
        <div class="wati-reports-admin">
            <p><?php _e('查看模板使用統計和報告。', 'wati-automation'); ?></p>
        </div>
    </div>
    <?php
}

/**
 * 輔助函數
 */
function wati_count_active_templates() {
    $args = array(
        'post_type' => 'wati_template',
        'meta_query' => array(
            array(
                'key' => '_template_status',
                'value' => 'active',
                'compare' => '='
            )
        ),
        'posts_per_page' => -1
    );
    
    $query = new WP_Query($args);
    return $query->found_posts;
}

function wati_get_today_usage() {
    // 這裡可以實現今日使用統計
    return 0;
}

/**
 * 自定義 REST API 端點
 */
function wati_register_rest_routes() {
    register_rest_route('wati/v1', '/templates', array(
        'methods' => 'GET',
        'callback' => 'wati_get_templates_api',
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('wati/v1', '/templates', array(
        'methods' => 'POST',
        'callback' => 'wati_create_template_api',
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        },
    ));
}
add_action('rest_api_init', 'wati_register_rest_routes');

/**
 * 獲取模板 API
 */
function wati_get_templates_api($request) {
    $args = array(
        'post_type' => 'wati_template',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    );
    
    $query = new WP_Query($args);
    $templates = array();
    
    foreach ($query->posts as $post) {
        $templates[] = array(
            'id' => $post->ID,
            'code' => get_post_meta($post->ID, '_template_code', true),
            'category' => get_post_meta($post->ID, '_template_category', true),
            'title' => array(
                'zh' => $post->post_title,
                'en' => $post->post_title
            ),
            'description' => array(
                'zh' => $post->post_excerpt,
                'en' => $post->post_excerpt
            ),
            'content' => array(
                'zh' => $post->post_content,
                'en' => get_post_meta($post->ID, '_template_content_en', true)
            ),
            'status' => get_post_meta($post->ID, '_template_status', true),
            'created_at' => $post->post_date,
            'updated_at' => $post->post_modified,
        );
    }
    
    return array(
        'success' => true,
        'data' => array(
            'templates' => $templates,
            'total' => count($templates)
        )
    );
}

/**
 * 創建模板 API
 */
function wati_create_template_api($request) {
    $params = $request->get_params();
    
    $post_data = array(
        'post_title' => $params['title']['zh'] ?? '',
        'post_content' => $params['content']['zh'] ?? '',
        'post_excerpt' => $params['description']['zh'] ?? '',
        'post_type' => 'wati_template',
        'post_status' => 'publish',
    );
    
    $post_id = wp_insert_post($post_data);
    
    if (is_wp_error($post_id)) {
        return new WP_Error('create_failed', '創建模板失敗', array('status' => 500));
    }
    
    // 保存元數據
    update_post_meta($post_id, '_template_code', $params['code'] ?? '');
    update_post_meta($post_id, '_template_category', $params['category'] ?? '');
    update_post_meta($post_id, '_template_status', $params['status'] ?? 'active');
    update_post_meta($post_id, '_template_content_en', $params['content']['en'] ?? '');
    
    return array(
        'success' => true,
        'message' => '模板創建成功',
        'data' => array(
            'template_id' => $post_id
        )
    );
} 