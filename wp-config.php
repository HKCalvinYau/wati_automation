<?php
/**
 * Redis configuration
 */
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);
define('WP_REDIS_TIMEOUT', 1);
define('WP_REDIS_READ_TIMEOUT', 1);
define('WP_REDIS_RETRY_INTERVAL', 100);
define('WP_REDIS_RETRIES', 3);
define('WP_REDIS_PREFIX', 'wati_');
define('WP_REDIS_MAXTTL', 86400);
define('WP_REDIS_SELECTIVE_FLUSH', true);
define('WP_REDIS_CLIENT', 'phpredis');
define('WP_REDIS_DISABLED', false);

/**
 * WordPress 基本設定檔。
 *
 * 本檔案包含以下設定選項： MySQL 設定、資料表前綴、
 * 私密金鑰、WordPress 語言設定以及 ABSPATH。如需更多資訊，請
 * 前往 {@link http://codex.wordpress.org/Editing_wp-config.php 編輯
 * wp-config.php} Codex 頁面。或者向您的空間提供商諮詢關於 MySQL 設定資訊。
 *
 * 這個檔案用於安裝程式自動生成 wp-config.php 設定檔。
 * 您不需要將它用於您的網站，可以手動複製這個檔案，
 * 並重新命名為 "wp-config.php"，然後輸入相關訊息。
 *
 * @package WordPress
 */

/**
 * 資料庫設定 ** //
 */
define('DB_NAME', 'ywmzzfkesa');
define('DB_USER', 'ywmzzfkesa');
define('DB_PASSWORD', 'g5FFbP82Jm');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 */
define('AUTH_KEY',         '[|M,B6-,|`i>U~{l7x)MH:>,FOhv3&9QT]a-H+w ujc]VVW%)Q04c/}2hmB(6m,6');
define('SECURE_AUTH_KEY',  'n>=kUNRE8va:#R~B{JSJy|D|/+,6PF8 7HkMV(`~s>6{u[<PA3q@T>+ poqsf?+?');
define('LOGGED_IN_KEY',    '%$EzCYUM]+J+wNR=ny(>t(bAe%9ksbr-?+j+B#KZM5 ktEfCzU+];OzTnULLK5@}');
define('NONCE_KEY',        'myr o>SCqP ~s&s=wgEg*_(~Dz%*0`X+oi#%bBI3<ZbD[+*Ri5im7}Bh|yK~8I5.');
define('AUTH_SALT',        'Oih4$7Ie2 /_Va82gp^Q@ C 8qm-5oS}f<D*sWd:w*bELM2XostU6t.sMH@~}_+i');
define('SECURE_AUTH_SALT', 'xcHNnXp)Wtqt&i.80Rr&,KE2jZLQK~~pMqUk4pR!Y-,<R<4GZT[dcPQ-p-K)U212');
define('LOGGED_IN_SALT',   ';dX6]@8RWvYpyJ+:6@]i48+%Rr-ou&(}n?F2mUEOEys0T$TY{;vn#.|)%67[D(>+');
define('NONCE_SALT',       'Vz>~ncK`7Jwec7-F+[|res<OT-|E/oC+6YnZ|h7` A+p>O+{CO{*Q@)+A@R``L-B');

/**#@-*/

$table_prefix = 'wp_';

/**
 * 開發人員用： WordPress 偵錯模式。
 */
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// 設定 WordPress 自動更新
define('WP_AUTO_UPDATE_CORE', false);

// 設定 WordPress 記憶體限制
define('WP_MEMORY_LIMIT', '256M');

// 設定 SSL
define('FORCE_SSL_ADMIN', true);

/* 設定 WordPress 變數和包含的檔案。 */
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

define('AUTOMATIC_UPDATER_DISABLED', true);
define('DISALLOW_FILE_EDIT', true);
define('WP_MAX_MEMORY_LIMIT', '512M');

require_once ABSPATH . 'wp-settings.php'; 