-- EcoShare / SD2 database schema
-- Used by Docker MySQL init (docker-entrypoint-initdb.d).
-- Tables are created in the database set by MYSQL_DATABASE.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Core tables (used by listings and users routes)
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listings (
  listing_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  availability VARCHAR(100) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'available',
  category_id INT DEFAULT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (listing_id),
  KEY idx_listings_category (category_id),
  KEY idx_listings_user (user_id),
  CONSTRAINT fk_listings_category
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Tags (global) and listing ↔ tag association
-- ---------------------------------------------------------------------------

CREATE TABLE tags (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listing_tags (
  listing_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (listing_id, tag_id),
  CONSTRAINT fk_listing_tags_listing
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_listing_tags_tag
    FOREIGN KEY (tag_id) REFERENCES tags (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Legacy test table (used by /db_test route)
-- ---------------------------------------------------------------------------

CREATE TABLE test_table (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(512) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------

INSERT INTO users (name, email, role) VALUES
  ('John', 'john@email.com', 'member'),
  ('Alice', 'alice@email.com', 'member');

INSERT INTO categories (name) VALUES
  ('Transport'),
  ('Electronics'),
  ('Furniture');

INSERT INTO listings (title, description, availability, status, category_id, user_id) VALUES
  ('City Bike', 'Good condition commuter bike', 'Weekends', 'available', 1, 1),
  ('Used Laptop', 'Used laptop, battery OK', 'Evenings', 'available', 2, 2);

INSERT INTO tags (name) VALUES
  ('bicycle'),
  ('outdoors'),
  ('computer');

INSERT INTO listing_tags (listing_id, tag_id) VALUES
  (1, 1),
  (1, 2),
  (2, 3);

INSERT INTO test_table (name) VALUES ('Lisa'), ('Kimia');
