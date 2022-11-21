const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const cors = require("cors");
const postsRouter = require("./routers/postsRouter");
const foreversPostsRouter = require("./routers/foreversPostsRouter");
const foreverPostCategoryRouter = require("./routers/foreverPostCategoryRouter");
const mrkPayPostCategoryRouter = require("./routers/mrkPayPostCategoryRouter");
const mutagesRouter = require("./routers/mutagesRouter");
const usersRouter = require("./routers/usersRouter");
const adminRouter = require("./routers/adminRouter");
const uploadRouter = require("./routers/uploadRouter");
const withdrawRouter = require("./routers/withdrawRouter");
// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(helmet());
app.use(compression());
app.route("/").get((req, res) => {
  res.send("Hello world!!!");
});

require("dotenv").config();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
app.use("/posts", postsRouter);
app.use("/foreversPosts", foreversPostsRouter);
app.use("/foreverPostCategories", foreverPostCategoryRouter);
app.use("/mrkPayPostCategories", mrkPayPostCategoryRouter);
app.use("/mutages", mutagesRouter);
app.use("/users", usersRouter);
app.use("/xadmin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/withdraw", withdrawRouter);

module.exports = app;
