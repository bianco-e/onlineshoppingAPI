const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: String,
    colors: Array,
    description: String,
    imgs: Array,
    name: String,
    payment: Object,
    price: Number,
    prom: Boolean,
    stock: Array,
  },
  { collection: "products", versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
