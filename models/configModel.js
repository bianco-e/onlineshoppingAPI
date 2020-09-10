const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    email: String,
    facebook: String,
    homeTitle: String,
    instagram: String,
    primaryColor: String,
    promText: String,
    secondaryColor: String,
    storeLogo: String,
    storeName: String,
    whatsapp: String,
  },
  { collection: "config", versionKey: false }
);

module.exports = mongoose.model("Config", configSchema);
