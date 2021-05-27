const Product = require("../model/products");
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((prods) => {
      if (!prods > 0) {
        return res
          .status(204)
          .json({ message: "no product found", data: prods });
      }
      res.status(200).json({ message: "found", data: prods });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  let product;
  Product.findOne({ _id: productId })
    .then((prod) => {
      if (!prod) {
        const error = new Error("product not found");
        error.statusCode = 401;
        throw error;
      }
      product = { ...prod.toObject() };
      return res.status(200).json({ message: "found", data: product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};
