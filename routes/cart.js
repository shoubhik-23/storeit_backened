const express = require("express");
const cartController = require("../controllers/cart");
const routes = express.Router();
const isAuth = require("../middleware/isAuth");
routes.get("/", isAuth, cartController.getCart);
routes.post("/add/:productId", isAuth, cartController.addToCart);
routes.post("/delete", isAuth, cartController.deleteFromCart);
routes.post("/deleteCart", isAuth, cartController.deleteFullCart);

routes.post("/localAdd", isAuth, cartController.addLocalToCart);

module.exports = routes;
