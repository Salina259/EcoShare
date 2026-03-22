// Import express.js
const express = require("express");

const path = require("path");

// Create express app
var app = express();

// creates (view engine for PUG)
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

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

app.get("/hira", function(req, res) {
    res.send("Hi, this is hira");
});

// Dynamic route
app.get("/hello/:name", function(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});