var express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
var app = express();

mongoose.connect("mongodb://localhost:27017/onlineshopping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

app.get("/", function (req, res) {
  res.send("Hi!");
});

app.get("/allProducts", function (req, res) {
  Product.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.post("/addProduct", function (req, res) {
  const newProduct = new Product(req.body);
  newProduct.save((err, addedProduct) => {
    if (err) return console.log(err);
    console.log("Added", addedProduct);
    res.statusCode = 200;
    res.end();
  });
});

app.listen(5000, () => {
  console.log("On port 5000");
});
