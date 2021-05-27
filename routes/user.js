const express = require("express");
const isAuth = require("../middleware/isAuth");
const userController = require("../controllers/user");
const routes = express.Router();
routes.get("/", isAuth, userController.getUser);
routes.post("/add-address", isAuth, userController.addAddress);
module.exports = routes;
