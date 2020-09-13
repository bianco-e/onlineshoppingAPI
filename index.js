const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/onlineshopping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

app.listen(5000, () => console.log("On port 5000"));
