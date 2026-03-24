const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "../static")));


const db = require("./services/db");
const usersRoutes = require("./routes/users");

app.use("/users", usersRoutes);

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.get("/db_test", function (req, res) {
  const sql = "select * from test_table";
  db.query(sql)
    .then((results) => {
      console.log(results);
      res.send(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database error");
    });
});

app.get("/goodbye", function (req, res) {
  res.send("Goodbye world!");
});

app.get("/hira", function (req, res) {
  res.send("Hi, this is hira");
});

app.get("/hello/:name", function (req, res) {
  console.log(req.params);
  res.send("Hello " + req.params.name);
});

app.listen(3000, function () {
  console.log("Server running at http://127.0.0.1:3000/");
});

module.exports = app;