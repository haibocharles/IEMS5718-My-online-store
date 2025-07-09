const express = require('express');
const app = express();
const mysql= require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');//multer是一個node.js中間件，用於處理multipart/form-data類型的數據，它主要用於上傳文件。
const path = require('path'); //path模塊提供了一些用於處理文件路徑的工具
const fs = require('fs'); //fs模塊提供了一些用於處理文件的API
const cors = require('cors');//CORS是一個跨源資源共享的機制，它使用額外的HTTP標頭來告訴瀏覽器允許在網頁上執行的跨源HTTP請求
const crypto = require('crypto'); //crypto模塊提供了加密功能，這裡用於生成隨機數據
const cookieParser = require('cookie-parser'); //cookie-parser中間件用於解析cookie，將cookie轉換為req.cookies對象



require('dotenv').config();
app.use(cors({
    origin: [
        'https://shoplane2025.click',    // 云端正式域名
        'http://localhost:3000',    // 允许本地前端开发
        'file://',                  // 允许 file 协议（部分浏览器可能不支持，但可尝试）
        'https://shoplane2025.click:3002',
        'https://shoplane2025.click',
        'https://3.140.169.76:3002',
        // 'https://localhost:3002',
        'https://localhost:3000',
        'https://localhost:3302'
    ],
    credentials: true
}));

app.use(cookieParser()); //使用cookie-parser中間件，解析cookie並將其格式化到req.cookies屬性中


app.use(express.urlencoded({ extended: true }));//解析urlencoded請求體，並將解析的數據格式化到req.body屬性中
app.use(express.json());//解析json請求體，並將解析的數據格式化到req.body屬性中





// 引入路由文件
const productRoutes = require('./api/products');
const categoryRoutes = require('./api/categories');
const loginRoutes = require('./api/login'); // 引入登录验证路由
const logoutRouter = require('./api/logout'); // 登出路由
const auth = require('./auth'); // 引入验证中間件
const updatepasswordRouter = require('./api/chang_password'); // 引入修改密码路由
const { query, getProductById } = require('./api/db');
// 掛載路由
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use(loginRoutes); // 掛載登录验证路由
app.use(logoutRouter); // 掛載登出路由
app.use(updatepasswordRouter); // 掛載修改密码路由

// ----------- PayPal REST API 订单创建与捕获路由 -------------
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PORT = 3002
} = process.env;
console.log('PayPal client id:', PAYPAL_CLIENT_ID);
console.log('PayPal client secret:', PAYPAL_CLIENT_SECRET);
// 兼容 CommonJS 引入
let paypalSdk, ApiError, CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController;
try {
  paypalSdk = require("@paypal/paypal-server-sdk");
  ApiError = paypalSdk.ApiError;
  CheckoutPaymentIntent = paypalSdk.CheckoutPaymentIntent;
  Client = paypalSdk.Client;
  Environment = paypalSdk.Environment;
  LogLevel = paypalSdk.LogLevel;
  OrdersController = paypalSdk.OrdersController;
} catch (e) {
  // 如果没有安装 @paypal/paypal-server-sdk，提示用户
  console.error("请先安装 @paypal/paypal-server-sdk 依赖包: npm install @paypal/paypal-server-sdk");
}

if (Client) {
  const client = new Client({
    clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true },
    },
  });
  const ordersController = new OrdersController(client);

  // 创建订单
  app.post("/api/create_order", async (req, res) => {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { cart } = req.body; //[{id, quantity}]
      if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "购物车为空" });
      }

      // 这里应根据 cart 查询数据库，动态计算总价和币种
      let total = 0;
      for (let item of cart) {
        const product = await getProductById(item.id); // 假设返回 {price, name}
        if (product) {
          total += product.price * item.quantity; // 累加总价
        }
      }
      if (total <= 0) {
        return res.status(400).json({ error: "商品不存在或订单总金额必须大于0" });
      }

      const collect = {
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              amount: {
                currencyCode: "HKD", // 假设使用港币
                value: total.toFixed(2), // 保留两位小数
              },
            },
          ],
        },
        prefer: "return=minimal", // 只返回最小响应
      };
      const { body: respBody, ...httpResponse } = await ordersController.createOrder(collect);
      const paypalOrder = JSON.parse(respBody);

      // 插入订单到数据库
      try {
        await query(
          'INSERT INTO orders (orderID, items, total, status, created_at) VALUES (?, ?, ?, ?, NOW())',
          [
            paypalOrder.id,
            JSON.stringify(cart), // 购物车内容
            total,
            'created'
          ]
        );
      } catch (dbErr) {
        console.error('本地订单写入数据库失败:', dbErr);
        // 这里不影响 PayPal 下单流程，继续返回 PayPal 订单信息
      }

      res.status(httpResponse.statusCode).json(paypalOrder);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

  // 捕获订单
  app.post("/api/create_order/:orderID/capture", async (req, res) => {
    try {
      const { orderID } = req.params;
      const collect = {
        id: orderID,
        prefer: "return=minimal",
      };
      const { body: respBody, ...httpResponse } = await ordersController.captureOrder(collect);
      const result = JSON.parse(respBody);

      // 如果支付成功，更新订单状态
      if (result.status === 'COMPLETED') {
        await query('UPDATE orders SET status = ? WHERE orderID = ?', ['paid', orderID]);
      }

      res.status(httpResponse.statusCode).json(result);
    } catch (error) {
      console.error("Failed to capture order:", error);
      res.status(500).json({ error: "Failed to capture order." });
      console.error("failed to capture order:", error && error.message ? error.message : error);
    }
  });

  app.use(express.static(__dirname));
} // 

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



//網頁路由返回主页面
app.get('/main_page', (req, res) => {
    res.sendFile(path.join(__dirname, 'My_shopping_cart.html')); // 返回主页面
});

//商品種類管理頁面
app.get('/categories-panel', auth(true), (req, res) => {
    res.sendFile(path.join(__dirname, 'Categories_Form.html')); // 返回管理分类页面
});
//商品管理頁面
app.get('/products-panel', auth(true),(req, res) => {
    res.sendFile(path.join(__dirname, 'Products_Form.html')); // 假設你的產品管理頁叫這個
});

//管理面板登入頁面
app.get('/admin-panel-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-categories-login.html'));
});




//啓動
app.listen(3002, '0.0.0.0', () => {
    console.log('主页面：      https://shoplane2025.click/main_page');
    console.log('商品管理：    https://shoplane2025.click/products-panel');
    console.log('分类管理：    https://shoplane2025.click/categories-panel');
    console.log('后台登录：    https://shoplane2025.click/admin-panel-login');
});




//  2.CSP 中间件 在所有路由和静态资源之前添加 CSP 中间件。 Content Security Policy (CSP) 是一種安全機制，用於防止跨站腳本攻擊（XSS）和其他代碼注入攻擊。
/*app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",  //setHeader方法設置HTTP響應頭，這裡設置了Content-Security-Policy頭
        "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");//設置CSP策略，default-src表示默認源為當前源（'self'），img-src允許圖片來源於當前源和data URI，script-src允許腳本來源於當前源和內聯腳本，style-src允許樣式來源於當前源和內聯樣式
    next();
});*/


/*//  3. CSRF token 生成
app.use((req, res, next) => {
    // 检查请求的Cookie中是否存在csrf_token
    if (!req.cookies.csrf_token) { 
        // 如果不存在，生成一个32字节的随机十六进制字符串作为令牌
        const token = crypto.randomBytes(32).toString('hex'); 
        
        // 将令牌设置为响应头中的Cookie，发送给客户端
        res.cookie('csrf_token', token, { 
            httpOnly: false,  // 允许客户端JavaScript读取该Cookie（通常不建议，后面解释）
            sameSite: 'Strict' // 限制Cookie仅在同站请求中携带（防御CSRF的关键）
        });
    }
    next(); // 调用next()进入下一个中间件或路由处理函数
});*/

/*
client id :AXAGN_DsPH3bicJW8nmuEx5Fg1lOfrzfTIxiZEL_VUgoJJ9nLMRxzw9PvanXbFDHIAJh4RWN7XUZw89S
secret:EHUgBuqpK6WDIe1SnAlnS3OgcgFVxGhaGdO4BUxv5DzxJo5iilXcW17n12T2BA2Pk2ZApa7Vu70tKfXI

*/
