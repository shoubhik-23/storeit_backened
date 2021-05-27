const bcrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postSignUp = (req, res, next) => {
  const error = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const confirm = req.body.confirm;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  if (!error.isEmpty()) {
    return res.status(404).json({ message: "failed", error: error.array() });
  }
  if (!email) {
    const error = new Error("invalid email");
    error.statusCode = 400;
    throw error;
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
      }
      return bcrypt.hash(password, 5);
    })
    .then((pass) => {
      const user = new User({
        email: email,
        password: pass,
        cart: { items: [] },
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      });
      return user.save();
    })
    .then((user) => {
      console.log(user);
      return res.status(200).json({
        message: "success",
        data: { userId: user._id, email: user.email },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    const error = new Error("invalid credentials");
    error.statusCode = 400;
    throw error;
  }
  let loginUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("user dont exists");
        error.statusCode = 406;
        throw error;
      }
      loginUser = { ...user.toObject() };
      return bcrypt.compare(password, user.password);
    })
    .then((equality) => {
      if (!equality) {
        const error = new Error("invalid password");
        error.statusCode = 406;
        throw error;
      }
      const token = jwt.sign(
        { userId: loginUser._id, email: loginUser.email },
        "secretkeysecret",
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        message: "success",
        token: token,
        userId: loginUser._id,
        name:loginUser.firstName,
        email: loginUser.email,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    });
};
exports.postLogout = (req, res, next) => {};
