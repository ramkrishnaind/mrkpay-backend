const express = require("express");
const postsRouter = express.Router();
const {
  getAllPosts,
  addPost,
  deletePost,
  getAllCategories,
  getCategoryPosts,
} = require("../controllers/PostController");
postsRouter.route("/categories").get(getAllCategories);
postsRouter.route("/categoryPosts").get(getCategoryPosts);

postsRouter.route("/").get(getAllPosts).post(addPost).delete(deletePost);

module.exports = postsRouter;
