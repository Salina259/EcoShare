const express = require("express");
const router = express.Router();
const db = require("../app/services/db");

router.get("/:id", async (req, res) => {
  const itemId = req.params.id;

  const sql = `
    SELECT 
      listings.listing_id,
      listings.title,
      listings.description,
      listings.availability,
      listings.status,
      categories.name AS category_name,
      users.name AS owner_name,
      users.email AS owner_email
    FROM listings
    LEFT JOIN categories 
      ON listings.category_id = categories.category_id
    LEFT JOIN users 
      ON listings.user_id = users.user_id
    WHERE listings.listing_id = ?
  `;

  try {
    const results = await db.query(sql, [itemId]);

    if (results.length === 0) {
      return res.status(404).send("Item not found");
    }

    const tagsSql = `
      SELECT tags.id, tags.name
      FROM listing_tags
      INNER JOIN tags ON listing_tags.tag_id = tags.id
      WHERE listing_tags.listing_id = ?
      ORDER BY tags.name ASC
    `;

    const tags = await db.query(tagsSql, [itemId]);

    res.render("items", { item: results[0], tags });
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;