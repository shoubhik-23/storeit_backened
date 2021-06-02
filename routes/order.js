const express = require("express");
const routes = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../middleware/isAuth");
routes.post("/", isAuth, orderController.postOrder);
routes.get("/", isAuth, orderController.getOrder);
routes.get("/invoice", isAuth, orderController.getInvoice);

module.exports = routes;
