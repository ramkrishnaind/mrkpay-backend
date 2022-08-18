const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const cors = require("cors");
const postsRouter = require("./routers/postsRouter");
const foreversPostsRouter = require("./routers/foreversPostsRouter");
const mutagesRouter = require("./routers/mutagesRouter");
const usersRouter = require("./routers/usersRouter");
const adminRouter = require("./routers/adminRouter");
const uploadRouter = require("./routers/uploadRouter");
const withdrawRouter = require("./routers/withdrawRouter");
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.route("/").get((req, res) => {
  res.send("Hello world");
});
app.use("/posts", postsRouter);
app.use("/foreversPosts", foreversPostsRouter);
app.use("/mutages", mutagesRouter);
app.use("/users", usersRouter);
app.use("/xadmin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/withdraw", withdrawRouter);

module.exports = app;
