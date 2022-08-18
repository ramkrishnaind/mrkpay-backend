const express = require("express");
const userRouter = express.Router();

const {
  addUser,
  getUserById,
  getAllUsers,
  addGeneratedCoin,
} = require(`${__dirname}/../controllers/usersController.js`);

userRouter.route("/").post(addUser).get(getAllUsers);
userRouter.route("/get-user").post(getUserById);
userRouter.route("/ic").post(addGeneratedCoin);

module.exports = userRouter;

// User Data:

// User name, email, password(if user sign up with email and password)
// coin generated, coin redeeem
// user can redeem coin, user can generate coin
// user can get coin history
