const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const { execSync } = require('child_process');

// 配置
const config = {
    srcDir: './',
    distDir: './dist',
    js: {
        input: [
            'js/components/*.js',
            'js/utils/*.js',
            'js/core/*.js'
        ],
        output: 'js/bundle.min.js'
    },
    css: {
        input: ['css/main.css'],
        output: 'css/style.min.css'
    },
    html: ['index.html', 'detail.html'],
    static: ['data/**/*'],
    exclude: ['node_modules', 'dist', '.git']
};

// 創建dist目錄
console.log('📁 創建dist目錄...');
if (!fs.existsSync(config.distDir)) {
    fs.mkdirSync(config.distDir);
}

// 複製靜態文件
console.log('📋 複製靜態文件...');
config.static.forEach(pattern => {
    const files = execSync(`find ${config.srcDir} -path "${pattern}" -type f`).toString().split('\n').filter(Boolean);
    files.forEach(file => {
        const relativePath = path.relative(config.srcDir, file);
        const targetPath = path.join(config.distDir, relativePath);
        const targetDir = path.dirname(targetPath);
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.copyFileSync(file, targetPath);
        console.log(`✓ 複製: ${relativePath}`);
    });
});

// 壓縮JS
console.log('🔧 壓縮JavaScript...');
const jsFiles = config.js.input.map(pattern => 
    execSync(`find ${config.srcDir} -path "${pattern}"`).toString().split('\n').filter(Boolean)
).flat();

const jsContent = jsFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
const minifiedJS = uglifyJS.minify(jsContent, {
    compress: true,
    mangle: true
});

if (minifiedJS.error) {
    console.error('❌ JS壓縮失敗:', minifiedJS.error);
    process.exit(1);
}

const jsOutputPath = path.join(config.distDir, config.js.output);
fs.mkdirSync(path.dirname(jsOutputPath), { recursive: true });
fs.writeFileSync(jsOutputPath, minifiedJS.code);
console.log(`✓ JS已壓縮: ${config.js.output}`);

// 壓縮CSS
console.log('🎨 壓縮CSS...');
const cssFiles = config.css.input.map(file => fs.readFileSync(file, 'utf8')).join('\n');
const minifiedCSS = new CleanCSS({ level: 2 }).minify(cssFiles);

const cssOutputPath = path.join(config.distDir, config.css.output);
fs.mkdirSync(path.dirname(cssOutputPath), { recursive: true });
fs.writeFileSync(cssOutputPath, minifiedCSS.styles);
console.log(`✓ CSS已壓縮: ${config.css.output}`);

// 處理HTML文件
console.log('🌐 處理HTML文件...');
config.html.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 更新資源路徑
    content = content.replace(/href="\/css\/main.css"/g, `href="/css/style.min.css"`);
    content = content.replace(/<script src="\/js\/.*?\.js"><\/script>/g, `<script src="/js/bundle.min.js"></script>`);
    
    const outputPath = path.join(config.distDir, file);
    fs.writeFileSync(outputPath, content);
    console.log(`✓ HTML已處理: ${file}`);
});

// 複製配置文件
console.log('⚙️ 複製配置文件...');
['.htaccess', 'php.ini'].forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(config.distDir, file));
        console.log(`✓ 複製配置: ${file}`);
    }
});

console.log('✅ 構建完成！'); 