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

    const item = results[0];

    const tagSql = `
      SELECT tags.name
      FROM tags
      INNER JOIN listing_tags ON tags.id = listing_tags.tag_id
      WHERE listing_tags.listing_id = ?
      ORDER BY tags.name
    `;
    const tagRows = await db.query(tagSql, [itemId]);
    const tags = tagRows.map((r) => r.name);

    res.render("items", { item, tags });
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;