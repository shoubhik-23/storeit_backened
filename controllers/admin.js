const Product = require("../model/products");
const socket = require("../socket");

exports.postAddProducts = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    image: req.file.path,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  });
  product
    .save()
    .then((item) => {
      socket.getIo().emit("products", { action: "create product", data: item });
      res.status(300).redirect("/admin");
    })
    .catch((err) => console.log(err));
};
