const express = require("express");
const mutagesRouter = express.Router();
const {
  getLinkDetails,
  generateLink,
  incrementViews,
} = require("../controllers/mutagesController");
mutagesRouter.route("/").post(generateLink);
mutagesRouter.route("/increment-views").post(incrementViews);
mutagesRouter.route("/").get(getLinkDetails);

module.exports = mutagesRouter;

//#endregion
//#region
// Language: javascript
// Path: routers\postsRouter.js
// Compare this snippet from controllers\PostController.js:
