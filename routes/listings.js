const express = require("express");
const router = express.Router();
const db = require("../app/services/db");

router.get("/new", async (req, res) => {
  const categoriesSql = `
    SELECT category_id, name
    FROM categories
    ORDER BY name ASC
  `;

  try {
    const categories = await db.query(categoriesSql);
    res.render("listing-create", { categories });
  } catch (err) {
    console.error("Error loading listing form:", err);
    res.status(500).send("Database error");
  }
});

router.post("/", async (req, res) => {
  const { title, description, availability, status, category_id, user_id, tags } = req.body;

  const parsedTags = (tags || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  // Prevent duplicate tags in the same listing submission.
  const uniqueTags = [...new Set(parsedTags)];

  const insertListingSql = `
    INSERT INTO listings (title, description, availability, status, category_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const listingResult = await db.query(insertListingSql, [
      title,
      description || null,
      availability || null,
      status || "available",
      category_id || null,
      user_id || null,
    ]);

    const listingId = listingResult.insertId;

    for (const tagName of uniqueTags) {
      await db.query("INSERT IGNORE INTO tags (name) VALUES (?)", [tagName]);

      const tagRows = await db.query("SELECT id FROM tags WHERE name = ?", [tagName]);
      if (tagRows.length > 0) {
        await db.query(
          "INSERT IGNORE INTO listing_tags (listing_id, tag_id) VALUES (?, ?)",
          [listingId, tagRows[0].id]
        );
      }
    }

    res.redirect(`/items/${listingId}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).send("Failed to create listing");
  }
});

router.get("/", async (req, res) => {
  const selectedTag = (req.query.tag || "").trim().toLowerCase();

  const sql = `
    SELECT 
      listings.listing_id,
      listings.title,
      listings.description,
      listings.availability,
      listings.status,
      categories.name AS category_name,
      users.name AS owner_name,
      GROUP_CONCAT(DISTINCT tags.name ORDER BY tags.name SEPARATOR ', ') AS tag_names
    FROM listings
    LEFT JOIN categories 
      ON listings.category_id = categories.category_id
    LEFT JOIN users 
      ON listings.user_id = users.user_id
    LEFT JOIN listing_tags
      ON listings.listing_id = listing_tags.listing_id
    LEFT JOIN tags
      ON listing_tags.tag_id = tags.id
    WHERE (? = '' OR tags.name = ?)
    GROUP BY
      listings.listing_id,
      listings.title,
      listings.description,
      listings.availability,
      listings.status,
      categories.name,
      users.name
    ORDER BY listings.listing_id DESC
  `;

  try {
    const results = await db.query(sql, [selectedTag, selectedTag]);
    const tags = await db.query("SELECT name FROM tags ORDER BY name ASC");

    res.render("listings", {
      items: results,
      availableTags: tags,
      selectedTag,
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;