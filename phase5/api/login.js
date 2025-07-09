const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('./db');// 假設 db.js 中已經設置了 MySQL 連接


router.post('/api/login', async (req, res) => {
  const { email, password, isAdmin, panelType } = req.body;
  try {
    // 1. 查找用戶
    const results = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }
    const user = results[0];

    // 2. 驗證密碼
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    // 3. 驗證是否是管理員
    if (typeof isAdmin !== 'undefined' && String(isAdmin) !== String(user.admin)) {
      return res.status(403).json({ error: 'Admin flag mismatch' });
    }

    // 4. 驗證是否有選擇面板
    if (typeof panelType === 'undefined' || (panelType !== 'category' && panelType !== 'product')) {
      return res.status(400).json({ error: 'Panel type is required' });
    }

    // 5. 生成JWT令牌 (有效3天)
    const token = jwt.sign(
      { userid: user.userid, email: user.email, admin: user.admin },
      process.env.JWT_SECRET || 'charles_0918',
      { expiresIn: '3d' }
    );

    // 6. 設置HTTP-only Cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // 生產環境建議設置為 true
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3天
      sameSite: 'Strict'
    });

    // 7. 根據 panelType 回傳不同跳轉頁面
    let redirect = '/categories-panel';
    if (panelType === 'product') {
      redirect = '/products-panel';
    }

    res.json({
      message: '登錄成功',
      user: { email: user.email, admin: user.admin },
      redirect
    });
  } catch (err) {
    console.error('登錄錯誤:', err);
    return res.status(500).json({ error: 'Server error, please try again!' });
  }
});

module.exports = router;