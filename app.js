require("dotenv").config();
const express = require("express");
const compression = require("compression");
const nodemailer = require("nodemailer");
const sendrid = require("nodemailer-sendgrid-transport");
const fs = require("fs");
const ejs = require("ejs");
const transport = nodemailer.createTransport(
  sendrid({
    auth: {
      api_key: process.env.MAIL_API,
    },
  })
);

const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("images"));
  },
  filename: (req, file, cb) => {
    cb(null, Math.random().toString() + file.originalname);
  },
});

const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
app.use(compression());
app.set("view engine", "ejs");
app.set("views", "views");
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use((req, res, next) => {
  const file = fs.readFileSync(
    path.join(__dirname, "images", "email.ejs"),
    "utf-8"
  );
  var template = ejs.compile(file);
  var replacements = {
    url: process.env.API_POINT,
  };
  var htmlToSend = template(replacements);

  transport
    .sendMail({
      from: "ratedshoubhik96@gmail.com",
      to: "shoubhik22@gmail.com",
      subject: "Testing",
      html: htmlToSend,
    })
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
  res.send(htmlToSend);
});

app.use(multer({ storage: fileStorage }).single("image"));
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use(homeRoutes);
app.use((err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;
  return res.status(status).json({ message: message });
});

mongoose
  .connect(`${process.env.DB_STRING}`)
  .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./socket").init(server);
  })
  .catch((err) => console.log(err));
