/*const express = require('express');
const router = express.Router();
const db = require('./db'); // 假設 db.js 中已經設置了 MySQL 連接
const auth = require('../auth'); // 引入驗證中間件

// 創建訂單
router.post('/create_order', auth(true), async (req, res) => {
    const cartItems = req.body.cart; // [{ pid, quantity }]
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: '購物車是空的' });
    }

    let total = 0, items = [];
    for (let item of cartItems) {
        const product = await db.getProductById(item.pid); // 假設返回 {price, name}
        if (product) {
            const quantity = item.quantity;
            total += product.price * quantity;
            items.push(`${item.pid}:${quantity}`);
        }
    }

    // 生成 digest
    const salt = crypto.randomBytes(8).toString('hex');
    const merchant = 'sb-wwyf4344501755@business.example.com';
    const currency = 'HKD';
    const digestStr = [currency, merchant, salt, ...items, total].join('|');
    const digest = crypto.createHash('sha256').update(digestStr).digest('hex');
    // 寫入 orders 表
    const orderID = 'ORDER' + Date.now();
    const username = req.user ? req.user.username : 'guest'; // 如果有登录用户
    const orderItems =[];
    for (let item of cartItems) {
        const product = await db.getProductById(item.pid); // 假設返回 {price, name}
        if (product){
            orderItems.push([orderID, product.pid, product.name, item.quantity, product.price]);
        }
    }

    // 插入訂單到 orders 表
    await db.query(
        'INSERT INTO orders (orderID, username, items, total, currency, merchant_email, salt, digest, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [orderID, username, JSON.stringify(orderItems), total, currency, merchant, salt, digest, 'pending']
    );
    res.json({orderID, digest});
});
module.exports = router;
//sand box PayPal 商家帳號
//sb-l80ea44321694@business.example.com
//cMP<4?Ri
*/
