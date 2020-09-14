const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    celular: String,
    email: String,
    nombre: String,
    text: String,
  },
  { collection: "messages", versionKey: false }
);

module.exports = mongoose.model("Message", messageSchema);
