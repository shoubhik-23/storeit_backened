const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      region: {
        type: String,
      },
      pin: { type: Number },
      detail: {
        type: String,
      },
    },
    cart: {
      items: [
        {
          product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Products",
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);
userSchema.methods.addToCart = function (product) {
  let quantity;
  let updatedCartItems = [...this.cart.items];
  const findProductId = updatedCartItems.findIndex(
    (el) => el.product.toString() === product._id.toString()
  );
  if (findProductId == -1) {
    updatedCartItems.push({
      product: product._id,
      quantity: 1,
    });
  } else {
    const findProduct = updatedCartItems[findProductId];
    updatedCartItems[findProductId].quantity = findProduct.quantity + 1;
  }
  this.cart.items = updatedCartItems;
  return this.save();
};
userSchema.methods.addLocalToCart = function (productArray) {
  let updatedCartItems = [...this.cart.items];
  for (let i of productArray) {
    const findProductId = updatedCartItems.findIndex(
      (el) => el.product.toString() === i._id.toString()
    );
    if (findProductId == -1) {
      updatedCartItems.push({
        product: i._id,
        quantity: 1,
      });
    } else {
      const findProduct = updatedCartItems[findProductId];
      updatedCartItems[findProductId].quantity = findProduct.quantity + 1;
    }
  }
  this.cart.items = updatedCartItems;
  return this.save();
};
userSchema.methods.deleteFromCart = function (prod, all) {
  const updatedCartItems = [...this.cart.items];
  const findProductId = updatedCartItems.findIndex((el) => {
    return el.product.toString() === prod._id.toString();
  });
  if (all) {
    updatedCartItems.splice(findProductId, 1);
    this.cart.items = updatedCartItems;
  } else {
    const findProduct = updatedCartItems[findProductId];
    let quantity = findProduct.quantity;
    if (quantity > 1) {
      updatedCartItems[findProductId].quantity = findProduct.quantity - 1;
      this.cart.items = updatedCartItems;
    }
  }
  return this.save();
};
module.exports = mongoose.model("Users", userSchema);
