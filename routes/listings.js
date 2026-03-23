const express = require("express");
const router = express.Router();
const db = require("../app/services/db");

/** Split comma-separated tags, trim, drop empties, de-dupe (case-insensitive). */
function parseTagsInput(raw) {
  if (!raw || typeof raw !== "string") return [];
  const seen = new Set();
  const out = [];
  for (const part of raw.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

/** Ensure tag row exists; returns numeric tag id. Uses connection for transaction safety. */
async function ensureTagId(conn, displayName) {
  const name = displayName.trim();
  await conn.execute("INSERT IGNORE INTO tags (name) VALUES (?)", [name]);
  const [rows] = await conn.execute("SELECT id FROM tags WHERE name = ?", [name]);
  return rows[0].id;
}

router.get("/new", async (req, res) => {
  try {
    const [categories, users] = await Promise.all([
      db.query("SELECT category_id, name FROM categories ORDER BY name"),
      db.query("SELECT user_id, name FROM users ORDER BY name"),
    ]);
    res.render("listing-form", {
      categories,
      users,
      error: null,
      form: {},
    });
  } catch (err) {
    console.error("Error loading listing form:", err);
    res.status(500).send("Database error");
  }
});

router.post("/new", async (req, res) => {
  const {
    title,
    description,
    availability,
    status,
    category_id,
    user_id,
    tags: tagsField,
  } = req.body;

  const form = {
    title: title || "",
    description: description || "",
    availability: availability || "",
    status: status || "",
    category_id: category_id || "",
    user_id: user_id || "",
    tags: tagsField || "",
  };

  const loadForm = async (error, statusCode) => {
    const [categories, users] = await Promise.all([
      db.query("SELECT category_id, name FROM categories ORDER BY name"),
      db.query("SELECT user_id, name FROM users ORDER BY name"),
    ]);
    const code = statusCode ?? (error ? 400 : 200);
    res.status(code).render("listing-form", {
      categories,
      users,
      error,
      form,
    });
  };

  if (!title || !String(title).trim()) {
    try {
      return await loadForm("Title is required.", 400);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Database error");
    }
  }

  const catId =
    category_id === "" || category_id === undefined ? null : Number(category_id);
  const ownerId = Number(user_id);
  if (!Number.isFinite(ownerId)) {
    try {
      return await loadForm("Please select a valid owner.", 400);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Database error");
    }
  }

  const tags = parseTagsInput(tagsField);

  try {
    const listingId = await db.withTransaction(async (conn) => {
      const [result] = await conn.execute(
        `INSERT INTO listings (title, description, availability, status, category_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          title.trim(),
          description ? String(description).trim() : null,
          availability ? String(availability).trim() : null,
          status ? String(status).trim() : "available",
          catId !== null && Number.isFinite(catId) ? catId : null,
          ownerId,
        ]
      );

      const newId = result.insertId;

      for (const tagName of tags) {
        const tagId = await ensureTagId(conn, tagName);
        // Composite PK prevents duplicate (listing_id, tag_id); INSERT IGNORE is a no-op if duplicate.
        await conn.execute(
          "INSERT IGNORE INTO listing_tags (listing_id, tag_id) VALUES (?, ?)",
          [newId, tagId]
        );
      }

      return newId;
    });

    res.redirect(`/items/${listingId}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    try {
      await loadForm(
        "Could not save listing. Check category and owner values.",
        500
      );
    } catch (e) {
      console.error(e);
      res.status(500).send("Database error");
    }
  }
});

router.get("/", async (req, res) => {
  const tagFilter =
    typeof req.query.tag === "string" ? req.query.tag.trim() : "";

  let sql = `
    SELECT 
      listings.listing_id,
      listings.title,
      listings.description,
      listings.availability,
      listings.status,
      categories.name AS category_name,
      users.name AS owner_name,
      GROUP_CONCAT(DISTINCT tags.name ORDER BY tags.name SEPARATOR ',') AS tag_names
    FROM listings
    LEFT JOIN categories 
      ON listings.category_id = categories.category_id
    LEFT JOIN users 
      ON listings.user_id = users.user_id
    LEFT JOIN listing_tags ON listings.listing_id = listing_tags.listing_id
    LEFT JOIN tags ON listing_tags.tag_id = tags.id
  `;

  const params = [];
  if (tagFilter) {
    sql += `
    INNER JOIN listing_tags lt_filter ON listings.listing_id = lt_filter.listing_id
    INNER JOIN tags t_filter ON lt_filter.tag_id = t_filter.id AND t_filter.name = ?
    `;
    params.push(tagFilter);
  }

  sql += `
    GROUP BY listings.listing_id, listings.title, listings.description,
             listings.availability, listings.status, categories.name, users.name
    ORDER BY listings.listing_id DESC
  `;

  try {
    const [items, allTags] = await Promise.all([
      db.query(sql, params),
      db.query("SELECT id, name FROM tags ORDER BY name"),
    ]);

    const itemsWithTags = items.map((row) => ({
      ...row,
      tags:
        row.tag_names && row.tag_names.length
          ? row.tag_names.split(",")
          : [],
    }));

    res.render("listings", {
      items: itemsWithTags,
      allTags,
      activeTag: tagFilter,
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
