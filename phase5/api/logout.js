const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('./db');// 假設 db.js 中已經設置了 MySQL 連接

router.post('/api/logout', (req, res) =>{
    //1. 清除 Cookie
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false, // 在開發環境中可以設置為 false
        sameSite: 'Strict'
    }); //clearCookie 方法用於清除指定的 Cookie

    //2. 回傳成功訊息
    res.json({ message: '登出成功' });
})

module.exports = router;//輸出路由