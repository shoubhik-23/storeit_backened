const express = require("express");
const { check } = require("express-validator");
const routes = express.Router();
const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

routes.post(
  "/signup",
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  check("confirm").custom((value, { req }) => {
    if (value !== req.body.confirm) {
      throw new Error("password dont match");
    }
    return true;
  }),
  authController.postSignUp
);
routes.post("/login", authController.postLogin);
routes.post("/password-reset", authController.postReset);
routes.get("/password-reset/:token", authController.getReset);

module.exports = routes;
