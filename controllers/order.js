const PDF = require("pdfkit");
const Order = require("../model/orders");
const User = require("../model/user");
const fs = require("fs");
const path = require("path");
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
    .populate("products.product")
    .populate("user.userId")
    .exec()
    .then((order) => {
      if (!order.length > 0) {
        const error = new Error("order not found");
        error.statusCode = 400;
        return res.status(200).json({ message: "no order" });
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
exports.getInvoice = (req, res, next) => {
  const orderId = req.body.orderId;
  const userId = req.userId;

  const invoicePath = `invoice-${orderId}.pdf`;
  Order.findById(orderId)
    .populate("products.product")
    .exec()
    .then((order) => {
      if (!order) {
        const error = new Error("order not found");
        error.statusCode = 400;
        return next(error);
      }

      const pdfDoc = new PDF();
      pdfDoc.pipe(
        fs.createWriteStream(
          path.join(__dirname, "..", "invoices", invoicePath)
        )
      );
      pdfDoc.pipe(res);
      pdfDoc.image(path.join(__dirname, "..", "images", "logo.png"), 20, 20, {
        height: 40,
        width: 200,
        align: "center",
        valign: "center",
      });

      pdfDoc.fontSize(18).text(`Invoice No: ${orderId}`);
      pdfDoc.text("", 100, 150);
      let total = 0;
      order.products.forEach((el) => {
        pdfDoc
          .fillOpacity(0.7)
          .fontSize(16)
          .text(el.quantity + " x " + el.product.title);
        pdfDoc.moveDown();

        total = parseFloat(el.quantity) * parseFloat(el.product.price);
      });
      pdfDoc.text("----------------------------", { align: "center" });
      pdfDoc.moveDown();
      pdfDoc.fillOpacity(1).text(`Total Price: Rs. ${total}`, {
        align: "center",
      });

      pdfDoc.end();
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return next(err);
    });
};
