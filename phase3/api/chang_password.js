const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db'); // 假設 db.js 中已經設置了 MySQL 連接
const auth = require('../auth'); //..表示上一層目錄，auth.js 是驗證中間件
// 建議用 JWT 驗證，從 req.user 取得 email
router.post('/api/change-password', auth(true), async (req, res) => {
    // 假設你有 JWT 驗證中間件，req.user.email 就是目前登入者
    const email = req.user?.email; //req.user.email 是後端根據登入狀態自動取得的，不需要用戶在表單再輸入一次 email。
    const { currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: '請提供所有必要的欄位' });
    }

    try {
        // 1. 查找用戶
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('查詢用戶出錯', err);
                return res.status(500).json({ error: 'Server error, please try again!' });
            }
            if (!results || results.length === 0) {
                return res.status(404).json({ error: '用戶不存在' });
            }

            const user = results[0];

            // 2. 驗證當前密碼
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: '當前密碼不正確' });
            }

            // 3. 哈希新密碼
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // 4. 更新密碼
            db.query('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email], (err2) => {
                if (err2) {
                    console.error('更新密碼時出錯', err2);
                    return res.status(500).json({ error: 'Server error, please try again!' });
                }

                // 5. 清除登入 cookie，強制重新登入
                res.clearCookie('authToken', {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: process.env.NODE_ENV === 'production'
                });

                return res.json({ message: '密碼已成功更改，請重新登入' });
            });
        });
    } catch (error) {
        console.error('處理更改密碼時出錯', error);
        res.status(500).json({ error: 'Server error, please try again!' });
    }
});

module.exports = router;