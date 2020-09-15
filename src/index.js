const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const { loginRouter, checkAuth } = require("./routes/login");
const { dbUrl } = require("./config/database");
const session = require("express-session");

const app = express();
app.set("port", 5000);
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(checkAuth);
app.use(loginRouter);
app.use(routes);

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to '${db.name}' db`);
});

app.listen(app.get("port"), () => console.log(`On port ${app.get("port")}`));
