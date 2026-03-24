const express = require("express");
const path = require("path");
const app = express();

const itemsRoutes = require("../routes/items");
const listingsRouter = require("../routes/listings");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/items", itemsRoutes);
app.use("/listings", listingsRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/categories", (req, res) => {
  res.render("categories");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});