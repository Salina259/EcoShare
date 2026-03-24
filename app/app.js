/**
 * EcoShare - App.js
 */

const express = require("express");
const path = require("path");
const app = express();

// ENV
require("dotenv").config({ path: path.join(__dirname, '../.env') });

// DATABASE
const db = require("./services/db");

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// VIEW ENGINE
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));


// ======================================
// ROUTES
// ======================================

// HOME
app.get("/", (req, res) => {
    res.render("index");
});


// USERS LIST
app.get("/users", async (req, res) => {
    try {
        const users = await db.query(`
            SELECT user_id, name, email, role 
            FROM users
            ORDER BY name ASC
        `);

        res.render("users", { users });

    } catch (err) {
        console.error("Users error:", err);
        res.send("Error loading users");
    }
});


// USER PROFILE (with their listings)
app.get("/user/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const userResult = await db.query(
            "SELECT * FROM users WHERE user_id = ?", [id]
        );

        if (userResult.length === 0) {
            return res.send("User not found");
        }

        const listings = await db.query(`
            SELECT title, description, availability
            FROM listings
            WHERE user_id = ?
        `, [id]);

        res.render("user", {
            user: userResult[0],
            listings: listings
        });

    } catch (err) {
        console.error("Profile error:", err);
        res.send("Error loading profile");
    }
});


// LISTINGS PAGE (JOIN with users + categories)
app.get("/listings", async (req, res) => {
    try {
        const listings = await db.query(`
            SELECT l.listing_id, l.title, l.description, l.availability,
                   u.name AS owner,
                   c.name AS category
            FROM listings l
            JOIN users u ON l.user_id = u.user_id
            JOIN categories c ON l.category_id = c.category_id
            ORDER BY l.listing_id DESC
        `);

        res.render("listings", { listings });

    } catch (err) {
        console.error("Listings error:", err);
        res.send("Error loading listings");
    }
});


// SINGLE LISTING DETAIL
app.get("/listing/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.query(`
            SELECT l.*, 
                   u.name AS owner,
                   c.name AS category
            FROM listings l
            JOIN users u ON l.user_id = u.user_id
            JOIN categories c ON l.category_id = c.category_id
            WHERE l.listing_id = ?
        `, [id]);

        if (result.length === 0) {
            return res.send("Listing not found");
        }

        res.render("listing-detail", { item: result[0] });

    } catch (err) {
        console.error("Detail error:", err);
        res.send("Error loading listing");
    }
});


// CATEGORIES PAGE (with item count)
app.get("/categories", async (req, res) => {
    try {
        const categories = await db.query(`
            SELECT c.name,
                   COUNT(l.listing_id) AS total_items
            FROM categories c
            LEFT JOIN listings l 
            ON c.category_id = l.category_id
            GROUP BY c.category_id
        `);

        res.render("categories", { categories });

    } catch (err) {
        console.error("Categories error:", err);
        res.send("Error loading categories");
    }
});


// ======================================
// SERVER
// ======================================

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});