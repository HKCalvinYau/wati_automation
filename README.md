# WhatsApp 訊息模板管理系統

這是一個用於管理 WhatsApp 業務訊息模板的系統。

## 功能特點

- 模板管理：創建、編輯、刪除訊息模板
- 版本控制：追蹤模板變更歷史
- 審批流程：模板審批工作流程
- 使用統計：查看模板使用情況
- 搜索功能：快速查找模板

## 技術架構

- 前端：HTML, CSS, JavaScript
- 後端：PHP, WordPress
- 資料庫：MySQL
- 部署：Cloudways

## 安裝說明

1. 克隆倉庫：
```bash
git clone [repository-url]
```

2. 安裝依賴：
```bash
npm install
```

3. 配置環境：
- 複製 `.env.example` 到 `.env`
- 更新資料庫配置
- 設置 WhatsApp API 憑證

4. 運行開發服務器：
```bash
npm start
```

## 目錄結構

```
wati_automation/
├── css/              # 樣式文件
├── js/               # JavaScript 文件
│   ├── components/   # 組件
│   ├── core/        # 核心功能
│   └── utils/       # 工具函數
├── data/            # 數據文件
└── docs/            # 文檔
```

## 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 授權

MIT License
