const Order = require("../model/orders");
const User = require("../model/user");
exports.postOrder = (req, res, next) => {
  const userId = req.userId;
  let loginUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user dont exists");
        error.statusCode = 400;
        throw new error();
      }
      loginUser = { ...user.toObject() };
      const products = loginUser.cart.items.map((el) => {
        return {
          product: el.product,
          quantity: el.quantity,
        };
      });
      const order = new Order({
        products: products,
        user: {
          email: loginUser.email,
          userId: loginUser._id,
        },
      });
      return order.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        return next(err);
      }
    });
};

exports.getOrder = (req, res, next) => {
  const userId = req.userId;
  let orderDetail;
  Order.find({ "user.userId": userId })
    .populate("products.product").populate("user.userId").exec()
    .then((order) => {
      if (!order.length > 0) {
        const error = new Error("order not found");
        error.statusCode = 400;
        return res.status(200).json({message:"no order"})
      }
      orderDetail = [...order];
      return res.status(200).json({ message: "success", data: orderDetail });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        return next(err);
      }
    });
};
