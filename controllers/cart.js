const mongoose = require("mongoose");
const Products = require("../model/products");
const User = require("../model/user");
exports.getCart = (req, res, next) => {
  const userId = req.userId;
  let loginUser;
  User.findById(userId)
    .populate("cart.items.product")
    .exec()
    .then((user) => {
      if (!user) {
        const error = new Error("user don't exists");
        error.statusCode = 400;
        throw error;
      }
      loginUser = { ...user.toObject() };
      return res.status(200).json({
        message: "success",
        data: loginUser.cart.items.map((el) => {
          return { product: el.product, quantity: el.quantity };
        }),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode == 500;
      }
      return next(err);
    });
};
exports.addToCart = (req, res, next) => {
  const productId = req.params.productId;
  const userId = req.userId;
  let logginUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user dont exists");
        error.statusCode = 401;
        throw error;
      }
      logginUser = user;
      return Products.findById(productId);
    })
    .then((prod) => {
      if (!prod) {
        const error = new Error("product not found");
        error.statusCode = 400;
        throw error;
      }
      logginUser.addToCart(prod);
    })
    .then((user) => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode == 500;
      }
      return next(err);
    });
};
exports.addLocalToCart = (req, res, next) => {
  const localCartArray = JSON.parse(req.body.localCartArray);
  const userId = req.userId;
  let loginUser;
  User.findById(userId)
    .then((user) => {
      loginUser = user;
      return Products.find({
        _id: {
          $in: localCartArray.map((el) =>
            mongoose.Types.ObjectId(el.product._id)
          ),
        },
      });
    })
    .then((result) => {
      console.log(11, result);
      return loginUser.addLocalToCart(result);
    })
    .then(() => res.status(200).json({ message: "success" }))
    .catch((err) => {
      return next(err);
    });
};
exports.deleteFromCart = (req, res, next) => {
  const all = JSON.parse(req.query.all);
  const userId = req.userId;
  const productId = req.body.productId;
  let loginUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user dont exists");
        error.statusCode = 401;
        throw error;
      }
      loginUser = user;
      return Products.findById(productId);
    })
    .then((prod) => {
      if (!prod) {
        const error = new Error("product not found");
        error.statusCode = 400;
        throw error;
      }

      return loginUser.deleteFromCart(prod, all);
    })
    .then((result) => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode == 500;
      }
      return next(err);
    });
};
exports.deleteFullCart = (req, res, next) => {
  const userId = req.userId;
  let loginUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user dont exists");
        error.statusCode = 401;
        throw error;
      }
      loginUser = { ...user.toObject() };
      user.cart.items = [];
      return user.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode == 500;
        return next(err);
      }
    });
};
