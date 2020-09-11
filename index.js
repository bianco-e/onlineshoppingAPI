const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const Categories = require("./models/categoriesModel");
const Message = require("./models/messageModel");
const Config = require("./models/configModel");

const app = express();

app.use(cors());
app.use(express.json());

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
  categories: { Model: Categories },
  config: { Model: Config },
  messages: { Model: Message },
  products: { Model: Product },
};

const getDocById = (collection) => {
  app.get(`/${collection}/id/:id`, (req, res) =>
    collsData[collection].Model.findById(req.params.id, (err, doc) =>
      res.send(doc)
    )
  );
};

const getDocsFromCollection = (collection) => {
  app.get(`/${collection}`, (req, res) =>
    collsData[collection].Model.find({}, (err, docs) => res.send(docs))
  );
};

const addNewDoc = (collection) => {
  const { Model } = collsData[collection];
  app.post(`/${collection}/add`, (req, res) => {
    const newDoc = new Model(req.body);
    newDoc.save((err, addedDoc) => {
      if (err) return console.log(err);
      res.statusCode = 200;
      res.end();
    });
  });
};

const deleteDoc = (collection) => {
  const { Model } = collsData[collection];
  app.delete(`/${collection}/delete`, (req, res) => {
    Model.deleteOne({ _id: req.body.id }, (err) => {
      if (err) return console.log(err);
      res.statusCode = 200;
      res.end();
    });
  });
};

const editDoc = (collection) => {
  const { Model } = collsData[collection];
  app.put(`/${collection}/edit`, (req, res) => {
    Model.replaceOne({ _id: req.body.id }, req.body.newDoc, {}, (err) => {
      if (err) return console.log(err);
      res.statusCode = 200;
      res.end();
    });
  });
};

const getByNameContains = (collection) => {
  const { Model } = collsData[collection];
  app.get(`/${collection}/search/:keyword`, (req, res) => {
    Model.find(
      { name: { $regex: req.params.keyword, $options: "i" } },
      (err, docs) => {
        if (err) return console.log(err);
        res.send(docs);
      }
    );
  });
};

const getProductsWhere = () => {
  app.get(`/products/where/:property/:value`, (req, res) =>
    Product.find(
      { [req.params.property]: { $eq: req.params.value } },
      (err, docs) => res.send(docs)
    )
  );
};

const getCategoriesNames = () => {
  app.get(`/categories/names`, (req, res) =>
    Categories.find({}, (err, docs) =>
      res.send(docs[0].categories.map((cat) => cat.name))
    )
  );
};

app.get("/", (req, res) => res.send("Hi!"));

// All collections ----
Object.keys(collsData).forEach((collection) => {
  getDocsFromCollection(collection);
  editDoc(collection);
});
// Products ----
getDocById("products");
addNewDoc("products");
deleteDoc("products");
getByNameContains("products");
getProductsWhere();
// Categories ----
getDocById("categories");
getCategoriesNames();
// Messages ----
addNewDoc("messages");
deleteDoc("messages");
// Config ----
getDocById("config");
// -----
app.listen(5000, () => console.log("On port 5000"));
