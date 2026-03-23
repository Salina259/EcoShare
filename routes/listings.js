const express = require("express");
const router = express.Router();
const db = require("../app/services/db");

router.get("/", async (req, res) => {
  const sql = `
    SELECT 
      listings.listing_id,
      listings.title,
      listings.description,
      listings.availability,
      listings.status,
      categories.name AS category_name,
      users.name AS owner_name
    FROM listings
    LEFT JOIN categories 
      ON listings.category_id = categories.category_id
    LEFT JOIN users 
      ON listings.user_id = users.user_id
    ORDER BY listings.listing_id DESC
  `;

  try {
    const results = await db.query(sql);
    res.render("listings", { items: results });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;