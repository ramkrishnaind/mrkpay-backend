const express = require("express");
const postsRouter = express.Router();
const {
  getAllPosts,
  addPost,
  deletePost,
} = require("../controllers/PostController");
postsRouter.route("/").get(getAllPosts).post(addPost).delete(deletePost);

module.exports = postsRouter;
