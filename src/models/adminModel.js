const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { collection: "admins", versionKey: false }
);

adminSchema.methods.hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

adminSchema.methods.validatePassword = (password, storedPassword) =>
  bcrypt.compareSync(password, storedPassword);

module.exports = mongoose.model("Admin", adminSchema);
