const User = require("../model/user");
exports.getUser = (req, res, next) => {
  const userId = req.userId;
  let loginUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("no user exists");
        error.statusCode = 400;
        throw error;
      }
      loginUser = { ...user.toObject() };
      return res.status(200).json({
        message: "success",
        data: {
          firstName: loginUser.firstName,
          lastName: loginUser.lastName,
          email: loginUser.email,
          createdAt: loginUser.createdAt,

          phone: loginUser.phone,
          ...loginUser.address,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 400;
      }
      return next(err);
    });
};
exports.addAddress = (req, res, next) => {
  const userId = req.userId;
  const region = req.body.region;
  const state = req.body.state;
  const pin = req.body.pin;
  const detail = req.body.detail;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 400;
        throw error;
      }
      user.address.region = region;
      user.address.pin = pin;
      user.address.state = state;
      user.address.detail = detail;
      return user.save();
    })
    .then((user) => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        return next(err);
      }
    });
};
