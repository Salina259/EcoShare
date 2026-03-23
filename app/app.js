const express = require("express");
const path = require("path");
const app = express();

const itemsRoutes = require("../routes/items");
const listingsRouter = require("../routes/listings");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));

app.use("/items", itemsRoutes);
app.use("/listings", listingsRouter);
//  (imports your users routes)
const usersRoutes = require('./routes/users');

//  (connect /users route)
app.use('/users', usersRoutes);


// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/categories", (req, res) => {
  res.render("categories");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
// Dynamic route
app.get("/hello/:name", function(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});