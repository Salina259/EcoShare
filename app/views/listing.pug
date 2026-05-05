// ==========================================
// IMPORT REQUIRED MODULES
// ==========================================

const express = require("express");     // Import Express framework
const path = require("path");           // Helps manage file paths
const app = express();                  // Create Express app

const db = require("./services/db");    // Import database connection


// ==========================================
// APP CONFIGURATION
// ==========================================

// Set Pug as the view engine (for frontend pages)
app.set("view engine", "pug");

// Tell Express where your Pug files are stored
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, images) from /public folder
app.use(express.static(path.join(__dirname, "public")));

// Allow form data to be read (important for POST requests later)
app.use(express.urlencoded({ extended: true }));

// Allow JSON data
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

// HOME PAGE
// When user goes to http://localhost:3000
app.get("/", (req, res) => {
    res.render("index");   // Load index.pug
});


// ==========================================
// LISTING DETAIL PAGE
// ==========================================

app.get("/listings/:id", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                listings.*,
                categories.name AS category_name,
                users.name AS owner_name
            FROM listings
            JOIN users ON listings.user_id = users.user_id
            JOIN categories ON listings.category_id = categories.category_id
            WHERE listings.listing_id = ?
        `, [req.params.id]);

        if (result.length === 0) {
            return res.send("Item not found");
        }

        res.render("listing", { item: result[0] });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading item");
    }
});

// ==========================================
// LISTINGS PAGE 
// ==========================================
app.get("/listings", async (req, res) => {
  try {
    const items = await db.query(`
      SELECT 
        listings.*,
        categories.name AS category_name,
        users.name AS owner_name
      FROM listings
      JOIN users ON listings.user_id = users.user_id
      JOIN categories ON listings.category_id = categories.category_id
    `);

    res.render("listings", { items });

  } catch (err) {
    console.error(err);
    res.send("Error loading listings");
  }
});

// ==========================================
// USERS PAGE
// ==========================================
app.get("/users", async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users");
    res.render("users", { users });

  } catch (err) {
    console.error(err);
    res.send("Error loading users");
  }
});

// ==========================================
// USER PROFILE PAGE
// ==========================================
app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.params.id]
    );

    const listings = await db.query(
      "SELECT * FROM listings WHERE user_id = ?",
      [req.params.id]
    );

    res.render("user", {
      user: user[0],
      listings
    });

  } catch (err) {
    console.error(err);
    res.send("Error loading user");
  }
});

// ==========================================
// CATEGORIES PAGE
// ==========================================
app.get("/categories", async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM categories");
    res.render("categories", { categories });

  } catch (err) {
    console.error(err);
    res.send("Error loading categories");
  }
});

// ==========================================
// CATEGORY ITEMS PAGE
// ==========================================
app.get("/categories/:id", async (req, res) => {
  try {
    const items = await db.query(`
      SELECT listings.*, users.name AS owner_name
      FROM listings
      JOIN users ON listings.user_id = users.user_id
      WHERE listings.category_id = ?
    `, [req.params.id]);

    const category = await db.query(
      "SELECT name FROM categories WHERE category_id = ?",
      [req.params.id]
    );

    res.render("categories_items", {
      items,
      category_name: category[0].name
    });

  } catch (err) {
    console.error(err);
    res.send("Error loading category items");
  }
});

// ==========================================
// ADD ITEM PAGE
// ==========================================
app.get("/add-item", async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM categories");
    res.render("add_item", { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading add item page");
  }
});

app.post("/add-item", async (req, res) => {
  try {
    const { title, description, category_id, availability } = req.body;

    await db.query(`
      INSERT INTO listings (user_id, category_id, title, description, availability)
      VALUES (1, ?, ?, ?, ?)
    `, [category_id, title, description, availability]);

    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

// ==========================================
// LOGIN PAGE
// ==========================================
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (user.length > 0) {
      res.redirect("/listings");
    } else {
      res.send("Invalid login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during login");
  }
});

// ==========================================
// SIGNUP PAGE
// ==========================================
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// ==========================================
// MESSAGES PAGE
// ==========================================
app.get("/messages", async (req, res) => {
  try {
    const messages = await db.query(`
      SELECT m.*, u1.name AS sender, u2.name AS receiver
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.user_id
      JOIN users u2 ON m.receiver_id = u2.user_id
    `);

    res.render("messages", { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading messages");
  }
});


// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
