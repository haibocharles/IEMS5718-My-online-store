 全端電商系統（Node.js + Express + MySQL + AWS EC2/RDS）

## 專案簡介

本專案為一個全端電子商務網站，後端採用 Node.js + Express 架構，資料庫使用 MySQL（託管於 AWS RDS），前端使用原生 HTML/CSS/JavaScript 開發。系統支援商品瀏覽、購物車、訂單管理、PayPal 支付、後台管理、用戶認證等功能，已部署於 AWS EC2 並通過 Nginx 反向代理，資料庫託管於 AWS RDS。

## 主要功能

- 商品分類與產品動態管理（RESTful API）
- 前台商品瀏覽、購物車（本地持久化儲存）、下單、PayPal 沙盒支付
- 訂單自動同步資料庫，確保資料一致性
- 管理員後台（分類/產品管理、登入、密碼修改）
- 安全認證機制（JWT + HTTPOnly Cookie）、密碼加密儲存
- 網頁安全防護（防範 XSS、SQL 注入攻擊）
- 雲端部署（EC2 + RDS + Nginx）

## 技術架構

- **後端**：Node.js + Express
- **資料庫**：MySQL (AWS RDS)
- **前端**：原生 HTML/CSS/JavaScript
- **支付整合**：PayPal JS SDK
- **部署環境**：AWS EC2、RDS、Nginx

## 目錄結構

```bash
phase5/
├── api/                        # 後端介面（Node.js/Express 路由）
│   ├── db.js                   # 資料庫連接與封裝
│   ├── login.js                # 登入驗證
│   ├── change_password.js      # 密碼修改介面
│   └── ...                     # 其他 API 路由（如商品、訂單等）
├── uploads/                    # 商品圖片資源
├── shopping_cart_script1.js    # 前端主 JS（購物車邏輯）
├── Categories_Form.html        # 後台分類管理頁面
├── Products_Form.html          # 後台產品管理頁面
├── admin-categories-login.html # 管理員登入頁面
└── server.js                   # 主程序
```

## 快速開始

### 1. 克隆專案

```bash
git clone https://github.com/haibocharles/IEMS5718-My-online-store.git
cd IEMS5718-My-online-store/phase5
```

### 2. 安裝依賴套件

進入主目錄安裝 Node.js 套件：

```bash
npm install
```

### 3. 設定資料庫

修改 `api/db.js`，填入您的 AWS RDS/MySQL 連接資訊（主機、埠號、使用者、密碼、資料庫名稱）。

**注意**：需確保 AWS RDS 已創建資料庫，並建立以下必要資料表：`users`、`products`、`categories`、`orders`（可參考專案註解或部署腳本）。

### 4. 啟動後端服務

在 `phase5` 目錄下執行：

```bash
node server.js
```

### 5. 啟動前端

直接以瀏覽器開啟 `phase5` 目錄下的 HTML 檔案，或將整個 `phase5` 目錄部署至 Nginx/Apache 靜態伺服器。

### 6. 雲端部署

推薦使用 AWS EC2 + RDS 整合部署：
- EC2 作為應用伺服器（運行 Node.js 後端 + Nginx 反向代理）
- RDS 作為資料庫（MySQL）
- 詳細設定參考專案註解與部署腳本。

## 管理員後台

### 訪問路徑
/admin-categories-login.html

### 支援功能
- 分類管理（新增、編輯、刪除分類）
- 產品管理（上架、編輯、刪除商品）
- 密碼修改（管理員帳戶密碼更新）

## 安全說明

- **認證機制**：所有敏感操作（如後台管理、支付）需 JWT 驗證，權杖儲存於 HTTPOnly Cookie，防範 XSS 攻擊。
- **密碼安全**：使用者密碼透過 bcrypt 加密儲存（鹽值哈希），避免明文洩漏。
- **防護措施**：
  - **SQL 注入**：使用參數化查詢（Prepared Statements），禁止直接拼接 SQL 字串。
  - **XSS 攻擊**：前端輸入內容輸出時轉義，後端過濾危險字元。
- **生產環境建議**：啟用 HTTPS（透過 Nginx 配置 SSL 憑證）。

## 主要依賴套件

| 套件名稱       | 用途                          |
|----------------|-------------------------------|
| express        | 後端 Web 應用框架             |
| mysql          | MySQL 資料庫驅動              |
| bcrypt         | 密碼加密哈希                  |
| jsonwebtoken   | JWT 權杖生成與驗證            |
| cookie-parser  | 解析 HTTPOnly Cookie          |

## 貢獻與授權

- 歡迎 Fork 專案並提交 Pull Request（PR）！
- 若有問題或建議，歡迎透過 GitHub Issue 或聯絡作者。
- 本專案為 IEMS5718 課程專題作業，僅供學術演示用途，請勿直接將敏感資訊（如資料庫密碼）用於生產環境。

