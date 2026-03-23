const express = require("express");
const path = require("path");
const db = require("./services/db");
const app = express();

const itemsRoutes = require("../routes/items");
const listingsRouter = require("../routes/listings");
const usersRoutes = require("./routes/users");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));

app.use("/items", itemsRoutes);
app.use("/listings", listingsRouter);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/db_test", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM test_table");
    res.send(results);
  } catch (err) {
    console.error("db_test error:", err);
    res.status(500).send("Database error");
  }
});

app.get("/goodbye", (req, res) => {
  res.send("Goodbye world!");
});

app.get("/categories", (req, res) => {
  res.render("categories");
});

app.get("/hello/:name", (req, res) => {
  res.send("Hello " + req.params.name);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

module.exports = app;
