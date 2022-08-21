const express = require("express");
const postsRouter = express.Router();
const {
  getAllPostCategories,
  addPostCategory,
  deletePostCatgory,
} = require("../controllers/postCategoriesController");
postsRouter
  .route("/")
  .get(getAllPostCategories)
  .post(addPostCategory)
  .delete(deletePostCatgory);

module.exports = postsRouter;
