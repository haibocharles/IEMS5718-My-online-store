const express = require('express');
const app = express();
const mysql= require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');//multer是一個node.js中間件，用於處理multipart/form-data類型的數據，它主要用於上傳文件。
const path = require('path'); //path模塊提供了一些用於處理文件路徑的工具
const fs = require('fs'); //fs模塊提供了一些用於處理文件的API
const cors = require('cors');//CORS是一個跨源資源共享的機制，它使用額外的HTTP標頭來告訴瀏覽器允許在網頁上執行的跨源HTTP請求




app.use(express.urlencoded({ extended: true }));//解析urlencoded請求體，並將解析的數據格式化到req.body屬性中
app.use(express.json());//解析json請求體，並將解析的數據格式化到req.body屬性中
app.use(cors());//使用cors中間件，解決跨域問題
// 引入路由文件
const productRoutes = require('./api/products');
const categoryRoutes = require('./api/categories');

// 掛載路由
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


// Multer setup for file uploads
const storage= multer.diskStorage({
    destination: (req, file, cb) => {//上傳的文件保存的資料夾
        cb(null, './uploads');//cb是回調函數，第一個參數是錯誤對象，第二個參數是文件保存的資料夾
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
//上傳文件的配置
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|gif|png/;//定義文件類型
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());//檢查文件的擴展名
        const mimetype = filetypes.test(file.mimetype);//檢查文件的mimetype
        if (extname && mimetype) return cb(null, true);
        cb('Error: Only jpg, gif, and png files are allowed!');
    }
});

// 處理圖片上傳並生成縮略圖



app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const originalPath = req.file.path; // 原始圖片路徑
        const thumbnailPath = `uploads/thumbnails/${req.file.filename}`; // 縮略圖路徑

        // 使用 sharp 生成縮略圖
        await sharp(originalPath)
            .resize(150, 150) // 固定縮略圖大小
            .toFile(thumbnailPath);

        res.json({
            message: 'Image uploaded successfully',
            image: `/${originalPath}`, // 原始圖片路徑
            thumbnail: `/${thumbnailPath}` // 縮略圖路徑
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});


// 靜態資源路徑
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));

//mysql connection 連接數據庫
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa0925129251',
    database: 'shopping_cart'
});

db.connect((err) => {
    if(err) 
        throw err;
    console.log('數據庫連接成功...');
});


//啓動
app.listen('3002', () => {
    console.log('http://localhost:3002');
});