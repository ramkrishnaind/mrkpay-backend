const express = require("express");
const postsRouter = express.Router();
const {
  getAllPostCategories,
  addPostCategory,
  deletePostCatgory,
} = require("../controllers/foreversPostCategoriesController");
postsRouter
  .route("/")
  .get(getAllPostCategories)
  .post(addPostCategory)
  .delete(deletePostCatgory);

module.exports = postsRouter;
