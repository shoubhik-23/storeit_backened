const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    const error = new Error("token not found");
    error.statusCode = 400;
    throw error;
  }
  const token = req.get("Authorization");
  let decode;
  try {
    decode = jwt.verify(token, "secretkeysecret");
  } catch (err) {
    console.log(err);
    err.statusCode = 500;
    throw err;
  }
  if (!decode) {
    const error = new Error("not authenticated");
    err.statusCode = 400;
    throw error;
  }
  req.userId = decode.userId;

  next();
};
