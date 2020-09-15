const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const passport = require("passport");
const Admin = require("../models/adminModel");

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser("secret"));

router.use(passport.initialize());
router.use(passport.session());

require("../config/passport")(passport);

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const newAdmin = new Admin({ username });
  newAdmin.password = newAdmin.hashPassword(password);
  newAdmin.save((err, addedAdmin) => {
    if (err) return console.log(err);
    res.status(200).send("Added" + addedAdmin);
    res.end();
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

const checkAuth = (req, res, next) => {
  console.log(req.session.passport);
  if (req.path !== "/login")
    req.session.passport.user ? next() : res.redirect("/login");
  else next();
};

module.exports = { loginRouter: router, checkAuth };
