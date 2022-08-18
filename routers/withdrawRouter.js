const express = require("express");
const withdrawRouter = express.Router();
const { withdraw } = require("../controllers/withdrawController");

withdrawRouter.post("/", withdraw);

module.exports = withdrawRouter;
