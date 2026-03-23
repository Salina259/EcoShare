SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS listings (
  listing_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  availability VARCHAR(100),
  status VARCHAR(50) DEFAULT 'available',
  category_id INT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS listing_tags (
  listing_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (listing_id, tag_id),
  FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_table (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(512) NOT NULL
);

INSERT INTO users (name, email, role) VALUES
('John', 'john@email.com', 'member'),
('Alice', 'alice@email.com', 'member')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO categories (name) VALUES
('Books'),
('Clothing'),
('Electronics'),
('Household')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO listings (title, description, availability, status, category_id, user_id) VALUES
('Bike', 'Good condition bike', 'Weekends', 'available', 4, 1),
('Laptop', 'Used laptop', 'Anytime', 'available', 3, 2);

INSERT IGNORE INTO tags (name) VALUES
('transport'),
('eco'),
('electronics');

INSERT IGNORE INTO listing_tags (listing_id, tag_id)
SELECT l.listing_id, t.id
FROM listings l
JOIN tags t ON t.name = 'transport'
WHERE l.title = 'Bike';

INSERT IGNORE INTO listing_tags (listing_id, tag_id)
SELECT l.listing_id, t.id
FROM listings l
JOIN tags t ON t.name = 'electronics'
WHERE l.title = 'Laptop';

INSERT INTO test_table (id, name) VALUES
(1, 'Lisa'),
(2, 'Kimia')
ON DUPLICATE KEY UPDATE name = VALUES(name);

COMMIT;
