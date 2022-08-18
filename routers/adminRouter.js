const fs = require("fs");
const express = require("express");
const adminRouter = express.Router();

adminRouter.route("/").post(async (req, res) => {
  const { username, password } = req.body;
  fs.readFile(`${__dirname}/../config.json`, "utf-8", (err, data) => {
    const readable = JSON.parse(data);
    if (readable.username === username && readable.password === password) {
      res.json({ status: "success" });
    } else {
      res.json({ status: "error" });
    }
  });
});

adminRouter.route("/").put(async (req, res) => {
  const { username, password, secret } = req.body;
  fs.readFile(`${__dirname}/../config.json`, "utf-8", (err, result) => {
    const data = JSON.parse(result);
    if (data.secret == secret) {
      data.username = username;
      data.password = password;
      fs.writeFile(
        `${__dirname}/../config.json`,
        JSON.stringify(data),
        (err) => {
          if (err) {
            res.json({ status: "error" });
          } else {
            res.json({ status: "success" });
          }
        }
      );
    }
  });
});

module.exports = adminRouter;
