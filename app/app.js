const express = require("express");
const path = require("path");
const app = express();
const db = require("./services/db");

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

// Create a route for testing the db
app.get("/db_test", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM test_table");
    res.send(results);
  } catch (err) {
    console.error("DB test route failed:", err);
    res.status(500).send("Database error");
  }
});

// Create a route for /goodbye
app.get("/goodbye", (req, res) => {
  res.send("Goodbye world!");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/categories", (req, res) => {
  res.render("categories");
});

// Dynamic route
app.get("/hello/:name", (req, res) => {
  res.send(`Hello ${req.params.name}`);
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://0.0.0.0:3000");
});