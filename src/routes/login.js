const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");

const adminRegister = () => {
  router.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return console.log(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return console.log(err);
        const newAdmin = new Admin({ username, password: hash });
        newAdmin.save((err, addedAdmin) => {
          if (err) return console.log(err);
          res.status(200).send("Added" + addedAdmin);
          res.end();
        });
      });
    });
  });
};

const adminLogin = () => {
  router.get("/login/:name/:password", (req, res) => {
    const { name, password } = req.params;
    Admin.findOne({ username: name }, (err, doc) => {
      if (err) return console.log(err);
      if (doc)
        bcrypt.compare(password, doc.password).then((resp) => res.send(resp));
      else res.send(false);
    });
  });
};

adminLogin();
adminRegister();

module.exports = router;
