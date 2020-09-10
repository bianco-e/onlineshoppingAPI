const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/productModel");
const Categories = require("./models/categoriesModel");
const Message = require("./models/messageModel");
const Config = require("./models/configModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();

app.use(cors());

mongoose.connect("mongodb://localhost:27017/onlineshopping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

const collsData = {
  categories: { model: Categories },
  config: { model: Config },
  messages: { model: Message, addEndpoint: "/addMessage" },
  products: { model: Product, addEndpoint: "/addProduct" },
};

const getDocsFromCollection = (collection, callback) => {
  app.get(`/${collection}`, function (req, res) {
    collsData[collection].model.find({}, function (err, docs) {
      callback ? res.send(callback(docs)) : res.send(docs);
    });
  });
};

const getPromProducts = () => {
  app.get("/promProducts", function (req, res) {
    Product.find({ prom: true }, function (err, docs) {
      res.send(docs);
    });
  });
};

const addNewDoc = (collection) => {
  app.post(collection.addEndpoint, jsonParser, function (req, res) {
    const newDoc = new collection.model(req.body);
    newDoc.save((err, addedDoc) => {
      if (err) return console.log(err);
      console.log("Added", addedDoc);
      res.statusCode = 200;
      res.end();
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

getPromProducts();
addNewDoc(collsData.products);

// Categories ----

getDocsFromCollection("categories", (docs) => docs[0].categories);

app.get("/categories/names", function (req, res) {
  Categories.find({}, function (err, docs) {
    res.send(docs[0].categories.map((doc) => doc.name));
  });
});

// Messages ----

getDocsFromCollection("messages");
addNewDoc(collsData.messages);

// Config ----

getDocsFromCollection("config", (docs) => docs[0]);

// -----

app.listen(5000, () => {
  console.log("On port 5000");
});
