// Description: 資料庫連接模組 就不需要每次都重複寫連接資料庫的程式碼
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',         // 本地 MySQL
    user: 'root',     // 例如 'root'
    password: 'Aa0925129251',   // 例如 'root' 或你的密碼
    database: 'shopping_cart',
    port: 3306                 // 本地 MySQL 預設 port
});
db.connect(err => {
    if (err) throw err;
    console.log('本地資料庫連接成功...');
});
module.exports = db;



