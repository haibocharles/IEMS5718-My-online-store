// Description: 資料庫連接模組 就不需要每次都重複寫連接資料庫的程式碼
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Aa0925129251',
    database: 'shopping_cart',
    port: 3306 // 你的 RDS port
});
db.connect(err => {
  if (err) console.error("錯誤：", err.message);
  else console.log("成功連線 RDS！");
});
module.exports = db

/*

本地
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa0925129251',
    database: 'shopping_cart'
});
db.connect(err => {
    if (err) throw err;
    console.log('資料庫連接成功...');
});
module.exports = db;


雲端
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com', // RDS endpoint
    user: 'admin',           // 你的 RDS master username
    password: 'Aa0925129251',     // 你的 RDS 密碼
    database: 'shopping_cart',
    port: 3302               // 你的 RDS port
});
db.connect(err => {
    if (err) throw err;
    console.log('資料庫連接成功...');
});
module.exports = db;

1. 註冊 AWS 帳號
訪問 AWS 官網 註冊

完成信用卡驗證（注意：免費方案有使用限制）

登入 AWS Management Console

2. 建立 EC2 實例 (Ubuntu 22.04)
步驟：

進入 EC2 控制台 > Launch Instance

設定：

Name: Nodejs-Server

AMI: Ubuntu Server 22.04 LTS

Instance Type: t2.micro (免費方案)

Key Pair: 新建金鑰對（下載 .pem 文件）

Network Settings:

點擊 "Edit"

新增安全組規則：

SSH (22) - 限制為您的 IP

HTTP (80)

HTTPS (443)

Custom TCP: 3002 (Node.js 端口)

plaintext
Type    | Protocol | Port | Source
--------|----------|------|-----------
SSH     | TCP      | 22   | My IP
HTTP    | TCP      | 80   | 0.0.0.0/0
HTTPS   | TCP      | 443  | 0.0.0.0/0
Custom  | TCP      | 3002 | 0.0.0.0/0
Configure Storage: 保留默認 8GB (gp2)

點擊 Launch Instance

3. 連線到 EC2
bash
# 本地終端機執行 (替換 your-key.pem 和 public-ip)
chmod 400 your-key.pem  # 金鑰權限設定
ssh -i "your-key.pem" ubuntu@<EC2-Public-IP>
4. 安裝必要軟件
bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx
驗證安裝:

bash
node -v  # v18.x+
npm -v   # 9.x+
nginx -v
5. MySQL 數據庫部署（推薦 RDS）
選項 A: 本地安裝（僅測試用）
bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
sql
# 登入 MySQL
sudo mysql
> CREATE DATABASE mydb;
> CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY 'strong-password';
> GRANT ALL PRIVILEGES ON mydb.* TO 'nodeuser'@'localhost';
> FLUSH PRIVILEGES;
選項 B: AWS RDS（生產環境推薦）
進入 RDS 控制台 > Create Database

選擇 MySQL

設定：

Template: Free tier

DB instance identifier: nodejs-db

Master username: admin

Master password: 強密碼（12+字符）

Connectivity:

選擇與 EC2 相同的 VPC

新建安全組 rds-security-group

添加規則：允許 EC2 安全組訪問 3306 端口

點擊 Create Database

記下 Endpoint (例: nodejs-db.xxx.us-east-1.rds.amazonaws.com)

6. 上傳 Node.js 專案
方法 1: Git 克隆
bash
cd ~
git clone https://github.com/yourusername/your-project.git
cd your-project
npm install
方法 2: SFTP 上傳 (使用 FileZilla)
Host: EC2 公有 IP

Username: ubuntu

Private Key: 載入 .pem 文件

上傳專案到 /home/ubuntu

7. 設定環境變數
bash
nano .env
env
DB_HOST=your-rds-endpoint   # 或 localhost
DB_USER=nodeuser
DB_PASSWORD=your-db-password
DB_NAME=mydb
PORT=3002
NODE_ENV=production
8. 啟動 Node.js 服務 (使用 PM2)
bash
sudo npm install pm2 -g
pm2 start app.js --name "node-app"
pm2 save
pm2 startup  # 跟隨提示執行命令
9. Nginx 反向代理設定
bash
sudo nano /etc/nginx/sites-available/default
替換為以下配置:

nginx
server {
    listen 80;
    server_name your-domain.com; # 或 EC2 IP

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 管理後台路由範例
    location /admin {
        proxy_pass http://localhost:3002/admin;
        # 可添加額外安全設定
    }
}
重啟 Nginx:

bash
sudo systemctl restart nginx
10. SSL 憑證 (HTTPS)
bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
自動更新憑證測試：

bash
sudo certbot renew --dry-run
11. 安全強化措施
EC2 安全組:

移除 3002 端口公開訪問

SSH (22) 限制為管理員 IP

RDS 安全組:

只允許 EC2 安全組訪問 3306

防火牆 (UFW):

bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
定期備份:

EC2: 建立 AMI 映像

RDS: 啟用自動備份 (控制台設定)

12. 測試與驗證
訪問網站：

前台：https://your-domain.com

後台：https://your-domain.com/admin

檢查日誌：

bash
pm2 logs node-app
tail -f /var/log/nginx/error.log
疑難排解
連接數據庫失敗:

檢查 RDS 安全組是否允許 EC2

驗證 DB_HOST 是否為 RDS endpoint

Nginx 502 Bad Gateway:

確認 Node.js 正在運行：pm2 list

檢查端口是否一致：netstat -tuln | grep 3002

HTTPS 重定向循環:

在 Nginx 設定中添加：

nginx
proxy_set_header X-Forwarded-Proto $scheme;
最佳實踐
使用 IAM 角色：避免在 EC2 上儲存 AWS 憑證

環境分離：分開建立開發/生產環境

監控：啟用 CloudWatch 日誌

自動化部署：後續可改用：

AWS CodeDeploy

GitHub Actions

CDN 加速：整合 CloudFront

完整官方文件：

EC2 官方教學

RDS 設定指南

Nginx + Node.js 部署
ssh -i "d:\ISTM\TERM2\Web Programming and Internet Security\shopping_cart\haipo-online-shopping-cart.pem" ec2-user@3.140.169.76

//上傳到 EC2
scp -i "D:\ISTM\TERM2\Web Programming and Internet Security\shopping_cart\haipo-online-shopping-cart.pem" -r "D:\ISTM\TERM2\Web Programming and Internet Security\shopping_cart\phase3" ec2-user@3.140.169.76:~/
-i 後面是你的 .pem 金鑰路徑
-r 代表遞迴整個資料夾
ec2-user@3.140.169.76 是 EC2 帳號和彈性 IP
:~/ 代表上傳到 EC2 家目錄

//連線到 EC2
ssh -i "D:\ISTM\TERM2\Web Programming and Internet Security\shopping_cart\haipo-online-shopping-cart.pem" ec2-user@3.140.169.76

//進入專案目錄
cd ~/phase3
//運行nodemon.server.js 啓動網頁


//连线到rds
mysql -h nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com -P 3306 -u admin -p

//选择数据库
USE shopping_cart;

//查看表单
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;


//ec2 连到 mysql
mysql -h <nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com> -P 3306 -u admin -p

sudo yum update -y
sudo yum install -y mysql
mysql -h nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com -P 3302 -u admin -p
mysql -h nodejs-db.c5icuyuiesco.us-east-2.rds.amazonaws.com -P 3306 -u admin -p
*/
