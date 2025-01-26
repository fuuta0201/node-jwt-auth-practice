const JWT = require("jsonwebtoken");

// ミドルウェアの処理
module.exports = async (req, res, next) => {
  // JWTを持っているか確認->リクエストヘッダ内のx-auth-tokenを確認
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json([
      {
        message: "閲覧権限がありません．",
      },
    ]);
  } else {
    try {
      let user = await JWT.verify(token, "SECRET_KEY");
      console.log(user);
      req.user = user.email;
      next();
    } catch {
      return res.status(400).json([
        {
          message: "トークンが一致しません",
        },
      ]);
    }
  }
};
