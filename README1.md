# 全端電商系統（Node.js + Express + MySQL + AWS EC2/RDS）

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
│   ├── chang_password.js      # 密碼修改介面
│   └── ...                     # 其他 API 路由（如商品、訂單等）
├── uploads/                    # 商品圖片資源
├── shopping_cart_script1.js    # 前端主 JS（購物車邏輯）
├── Categories_Form.html        # 後台分類管理頁面
├── Products_Form.html          # 後台產品管理頁面
├── admin-categories-login.html # 管理員登入頁面
└── server.js                   # 主程序


