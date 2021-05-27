const express = require("express");
const routes = express.Router();

const homeController = require("../controllers/home");
const adminController = require("../controllers/admin");
routes.get("/", homeController.getIndex);
routes.get("/product/:productId", homeController.getProduct);

module.exports = routes;
