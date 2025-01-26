const router = require("express").Router();
const { body, validationResult } = require("express-validator"); // バリデーション
const { User } = require("../db/User");
const bcrypt = require("bcrypt"); // パスワードのハッシュ化
const JWT = require("jsonwebtoken"); // JWT発行

router.get("/", (req, res) => {
  res.send("Hell Auth.js");
});

// ユーザー新規登録API
router.post(
  "/register",
  body("email").isEmail(), // validation check
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // DBにユーザーが存在しているのか確認
    const user = User.find((user) => user.email === email);
    if (user) {
      return res.status(400).json([
        {
          message: "既にそのユーザーは存在しています",
        },
      ]);
    }

    // パスワードの暗号化
    let hashedPassword = await bcrypt.hash(password, 10);

    // dbへ保存
    User.push({
      email,
      password: hashedPassword,
    });

    // JWTを発行してクライアントへ渡す
    const token = await JWT.sign(
      {
        email,
      },
      "SECRET_KEY", // 復号するための鍵
      {
        expiresIn: "24h",
      }
    );

    return res.json({
      token: token,
    });
  }
);

// ログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json([
      {
        message: "そのユーザーは存在していません",
      },
    ]);
  }

  // パスワードの復号と照合
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json([
      {
        message: "パスワードが異なります",
      },
    ]);
  }

  // JWTを発行してクライアントへ渡す
  const token = await JWT.sign(
    {
      email,
    },
    "SECRET_KEY", // 復号するための鍵
    {
      expiresIn: "24h",
    }
  );

  return res.json({
    token: token,
  });
});

// DBのユーザ確認API
router.get("/allUsers", (req, res) => {
  return res.json(User);
});

module.exports = router;
