const express = require("express");
const routes = express.Router();
const adminController = require("../controllers/admin");
routes.get("/", (req, res, next) => {
  res.render("admin", { title: "Admin Pannel" });
});
routes.post("/", adminController.postAddProducts);
module.exports = routes;
