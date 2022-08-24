const express = require("express");
const foreversPostsRouter = express.Router();
const {
  getAllPosts,
  addPost,
  deletePost,
  getAllCategories,
  getCategoryPosts,
} = require("../controllers/foreversPostsController");
foreversPostsRouter
  .route("/")
  .get(getAllPosts)
  .post(addPost)
  .delete(deletePost);
foreversPostsRouter.route("/categories").get(getAllCategories);
foreversPostsRouter.route("/categoryPosts").get(getCategoryPosts);
module.exports = foreversPostsRouter;
