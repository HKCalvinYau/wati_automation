# 使用官方 PHP Apache 映像作為基礎
FROM php:8.2-apache

# 設置工作目錄
WORKDIR /var/www/html

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 啟用 Apache 重寫模組
RUN a2enmod rewrite
RUN a2enmod headers

# 設置 Apache 配置
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/docker-php.conf \
    && a2enconf docker-php

# 複製專案文件
COPY . /var/www/html/

# 設置檔案權限
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/data

# 創建 .htaccess 文件（如果不存在）
RUN if [ ! -f .htaccess ]; then \
    echo 'RewriteEngine On\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ index.html [QSA,L]\n\
\n\
# 設置 CORS 頭\n\
Header always set Access-Control-Allow-Origin "*"\n\
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"\n\
\n\
# 設置快取控制\n\
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">\n\
    Header set Cache-Control "max-age=31536000, public"\n\
</FilesMatch>\n\
\n\
<FilesMatch "\.(html|php)$">\n\
    Header set Cache-Control "no-cache, no-store, must-revalidate"\n\
</FilesMatch>' > .htaccess; \
    fi

# 暴露端口
EXPOSE 80

# 啟動 Apache
CMD ["apache2-foreground"] 