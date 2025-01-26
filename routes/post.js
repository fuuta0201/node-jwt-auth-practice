const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db/Post");
const JWT = require("jsonwebtoken"); // JWT発行
const checkJWT = require("../middleware/checkJWT");

// 誰でも見れる記事閲覧用API
router.get("/public", (req, res) => {
  return res.json(publicPosts);
});

// JWT所持者のみ閲覧可能なAPI
router.get("/private", checkJWT, (req, res) => {
  return res.json(privatePosts);
});

module.exports = router;
