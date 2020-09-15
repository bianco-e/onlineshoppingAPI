const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Categories = require("../models/categoriesModel");
const Message = require("../models/messageModel");
const Config = require("../models/configModel");

const collsModels = {
  categories: Categories,
  config: Config,
  messages: Message,
  products: Product,
};

const getDocById = (collection) => {
  router.get(`/${collection}/id/:id`, (req, res) =>
    collsModels[collection].findById(req.params.id, (err, doc) => {
      if (err) return console.log(err);
      res.send(doc);
    })
  );
};

const getDocsFromCollection = (collection) => {
  router.get(`/${collection}`, (req, res) =>
    collsModels[collection].find({}, (err, docs) => {
      if (err) return console.log(err);
      res.send(docs);
    })
  );
};

const addNewDoc = (collection) => {
  const Model = collsModels[collection];
  router.post(`/${collection}/add`, (req, res) => {
    const newDoc = new Model(req.body);
    newDoc.save((err, addedDoc) => {
      if (err) return console.log(err);
      res.status(200).send("Added" + addedDoc);
      res.end();
    });
  });
};

const deleteDoc = (collection) => {
  const Model = collsModels[collection];
  router.delete(`/${collection}/delete`, (req, res) => {
    Model.deleteOne({ _id: req.body.id }, (err) => {
      if (err) return console.log(err);
      res.status(200);
      res.end();
    });
  });
};

const updateDoc = (collection) => {
  const Model = collsModels[collection];
  router.put(`/${collection}/update`, (req, res) => {
    Model.replaceOne({ _id: req.body.id }, req.body.newDoc, {}, (err) => {
      if (err) return console.log(err);
      res.status(200);
      res.end();
    });
  });
};

const getByNameContains = (collection) => {
  const Model = collsModels[collection];
  router.get(`/${collection}/search/:keyword`, (req, res) => {
    Model.find(
      { name: { $regex: req.params.keyword, $options: "i" } },
      (err, docs) => {
        if (err) return console.log(err);
        res.send(docs);
      }
    );
  });
};

const getDocsWhere = (collection) => {
  router.get(`/${collection}/where/:property/:value`, (req, res) =>
    collsModels[collection].find(
      { [req.params.property]: { $eq: req.params.value } },
      (err, docs) => {
        if (err) return console.log(err);
        res.send(docs);
      }
    )
  );
};

const getCategoriesNames = () => {
  router.get(`/categories/names`, (req, res) =>
    Categories.find({}, (err, docs) => {
      if (err) return console.log(err);
      res.status(200).send(docs[0].categories.map((cat) => cat.name));
    })
  );
};

router.get("/", (req, res) => res.render("index.ejs"));
// All collections ----
Object.keys(collsModels).forEach((collection) => {
  getDocsFromCollection(collection);
  updateDoc(collection);
});
// Categories ----
getDocById("categories");
getCategoriesNames();
// Config ----
getDocById("config");
// Messages ----
addNewDoc("messages");
deleteDoc("messages");
// Products ----
getDocById("products");
addNewDoc("products");
deleteDoc("products");
getByNameContains("products");
getDocsWhere("products");

module.exports = router;
