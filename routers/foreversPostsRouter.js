const express = require("express");
const foreversPostsRouter = express.Router();
const {
  getAllPosts,
  addPost,
  deletePost,
} = require("../controllers/foreversPostsController");
foreversPostsRouter
  .route("/")
  .get(getAllPosts)
  .post(addPost)
  .delete(deletePost);

module.exports = foreversPostsRouter;
