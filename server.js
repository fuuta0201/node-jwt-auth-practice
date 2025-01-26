const express = require("express");
const app = express();
const PORT = 3000;
const auth = require("./routes/auth");
const post = require("./routes/post");

app.use(express.json());
app.use("/auth", auth);
app.use("/post", post);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(PORT, () => {
  console.log("starting server ...");
});
