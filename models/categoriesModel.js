const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    categories: Array,
  },
  { collection: "categories", versionKey: false }
);

module.exports = mongoose.model("Categories", categoriesSchema);
