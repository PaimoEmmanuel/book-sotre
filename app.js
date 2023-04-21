const express = require("express");
require('dotenv').config()
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const username = process.env.USERNAME
const password = process.env.PASSWORD
const cluser = process.env.CLUSTER
const dbName = process.env.DBNAME
const adminRoutes = require("./routes/admin-routes");
const authRoutes = require("./routes/auth-routes");
const shopRoutes = require("./routes/shop-routes");
const app = express();
const port = 3000;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluser}.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
