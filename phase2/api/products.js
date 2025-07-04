// 使用參數化查詢來防止SQL注入攻擊
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');


// 資料庫連接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa0925129251',
    database: 'shopping_cart'
});

connection.connect(err => {
    if (err) {
        console.error('資料庫連接失敗:', err);
        process.exit(1);
    }
    console.log('成功連接到資料庫');
});

// Multer 配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|gif|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb('Error: Only jpg, gif, and png files are allowed!');
    }
});









// 新增產品

router.post('/add', upload.single('image'), (req, res) => {
    const { catid, name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // 檢查必填字段
    if (!catid || !name || !price || !description || !image) {
        return res.status(400).send('All fields are required');
    }

    // 插入數據到數據庫
    const query = 'INSERT INTO products (catid, name, price, description, image) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [catid, name, price, description, image], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        console.log('Product added:', { catid, name, price, description, image });
        res.status(201).send('Product added successfully');
    });
});





//尋找產品
router.get('/search', (req, res) => {
    const { name } = req.query; // 從查詢參數中獲取名稱
    if (!name) {
        return res.status(400).send('Product name is required');
    }
    console.log('Search name:', name); // 調試輸出
    const sql = 'SELECT * FROM products WHERE name LIKE ?';
    connection.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (results.length > 0) {
            res.json(results); // 返回查詢到的產品
        } else {
            res.status(404).send('Product not found');
        }
    });
});










    

//更新產品
router.post('/update', upload.single('image'), (req, res) => {
    const { pid,catid, name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // 檢查必填字段
    if(!pid || !catid || !name || !price || !description) {
        return res.status(400).send('All fields are required');
    }
    // 檢查產品是否存在
    const checkSql = 'SELECT * FROM products WHERE pid=?';
    connection.query(checkSql, [pid], (err, results) => {
        if (err) 
            return res.status(500).send('Database error');
        if (results.length === 0) 
            return res.status(404).send('Product not found');
    });

    //構建更新的SQL語句
    let sql = 'UPDATE products SET catid = ?, name = ?, price = ?, description = ?';
    const params = [catid, name, price, description];

    //如果有上傳的圖片，則更新圖片
    if(image) 
        {
        sql += ', image = ?';//, image = ? 表示更新圖片
        params.push(image);//將圖片路徑添加到參數中
    }
    sql += ' WHERE pid = ?';
    params.push(pid);

    //執行更新操作
    connection.query(sql, params, (err) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.send('Product updated successfully');
    }
    );
});






//刪除產品
router.post('/delete', (req, res) => {
    const {pid,catid} = req.body;
    // 檢查是否提供完全
    if(!pid || !catid) {
        return res.status(400).send('Product ID and Category ID are required');
    }

    // 檢查產品是否存在
    const checksql= 'select * from products where pid=? and catid=?;'
    connection.query(checksql,[pid,catid],(err,results)=>{
        if(err){
            console.error('Database error:', err);
            return res.status(500).send('Database error');  
        }
        if(results.length === 0) {
            return res.status(404).send('Product not found');
        }

    });
    // 刪除產品
    const deletesql= 'DELETE FROM products WHERE pid=? and catid=?';
    connection.query(deletesql,[pid,catid],(err)=>{
        if(err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.send('Product deleted successfully');
    });
});


//動態加載產品資料,根據點擊的分類ID來獲取產品資料
router.get('/:catid', (req,res) =>
    {
   const { catid } = req.params;//req.params用途：提取路由中的動態參數。來源：從路由的 URL 路徑中獲取動態參數。場景：當路由中包含動態參數時，例如 /products/:pid，這個 pid 就是從 URL 中提取的產品ID。
      const query= 'SELECT * FROM products where catid=?';//查詢語句, 
      connection.query(query,[catid],(err,results)=>{//查詢數據庫
       if(err) 
           {
           console.error('Database error:', err);//錯誤處理
           return res.status(500).send('Database error');//返回錯誤信息
       }
       if(results.length === 0) 
           {
           return res.status(404).send('product not found')
           }
       res.json(results);//返回所有符合產品
       });

});



module.exports = router;
