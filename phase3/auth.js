const jwt = require('jsonwebtoken');

function authenticateUser(adminRequired = false) {
  return (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: '未授權，請先登錄' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'charles_0918');;
      if (adminRequired && !decoded.admin) {
        return res.status(403).json({ message: '權限不足' });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: '無效的 token' });
    }
  };
}

module.exports = authenticateUser;

/*
1. JWT Token 是什麼？
JWT（JSON Web Token）是一種加密的字串，裡面包含用戶資訊（如 id、email、admin 權限）。
只有後端能產生和驗證這個 token。
你可以把它想像成一張「身份證」。

2. Cookie 是什麼？
Cookie 是瀏覽器用來「記住」你身份的小資料。
當你登入後，後端會把 JWT token 放進 Cookie 裡（例如 authToken）。
以後你每次訪問網站，瀏覽器都會自動帶上這個 Cookie。

3. authToken 和 token 差別？
authToken 是你自己設定的 Cookie 名稱（你可以叫它 token、jwt、mycookie 都可以）。
只要前後端一致就好。
你設置時叫 authToken，那驗證時也要用 req.cookies.authToken。

4. 流程簡圖
用戶登入 → 後端產生 JWT → 放進 Cookie（如 authToken）
用戶下次訪問 → 瀏覽器自動帶上 Cookie（authToken）
後端驗證 Cookie 裡的 JWT → 確認用戶身份
總結：

JWT 是「身份證」內容
Cookie 是「裝身份證的小袋子」
authToken 是這個小袋子的名字



*/ 