var express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const Categories = require("./models/categoriesModel");
const Message = require("./models/messageModel");
const Config = require("./models/configModel");
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

const models = {
  categories: Categories,
  config: Config,
  messages: Message,
  products: Product,
};

const getDocsFromCollection = (collection) => {
  return app.get(`/${collection}`, function (req, res) {
    models[collection].find({}, function (err, docs) {
      res.send(docs);
    });
  });
};

app.get("/", function (req, res) {
  res.send("Hi!");
});

// Products ----

getDocsFromCollection("products");

app.get("/products/:id", function (req, res) {
  Product.findById(req.params.id, (err, doc) => {
    res.send(doc);
  });
});

app.get("/promProducts", function (req, res) {
  Product.find({ prom: true }, function (err, docs) {
    console.log("Error: ", err);
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

// Categories ----

app.get("/categories", function (req, res) {
  Categories.find({}, function (err, docs) {
    res.send(docs[0].categories);
  });
});

app.get("/categories/names", function (req, res) {
  Categories.find({}, function (err, docs) {
    res.send(docs[0].categories.map((doc) => doc.name));
  });
});

// Messages ----

getDocsFromCollection("messages");

// Config ----

app.get("/config", function (req, res) {
  Config.find({}, function (err, docs) {
    res.send(docs[0]);
  });
});

// -----

app.listen(5000, () => {
  console.log("On port 5000");
});
