-- =========================================
-- EcoShare Database Setup
-- =========================================

CREATE DATABASE IF NOT EXISTS EcoShare;
USE EcoShare;

-- =========================================
-- DROP TABLES
-- =========================================

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CATEGORIES TABLE
-- =========================================

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);

-- =========================================
-- LISTINGS TABLE
-- =========================================

CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    title VARCHAR(255),
    description TEXT,
    availability VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- =========================================
-- REQUESTS TABLE
-- =========================================

CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT,
    requester_id INT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (listing_id) REFERENCES listings(listing_id),
    FOREIGN KEY (requester_id) REFERENCES users(user_id)
);

-- =========================================
-- MESSAGES TABLE
-- =========================================

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- =========================================
-- REPORTS TABLE
-- =========================================

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',

    FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);

-- =========================================
-- USERS DATA
-- =========================================

INSERT INTO users (name, email, password, role) VALUES
('Aakriti Gurung', 'aakriti.gurung@gmail.com', 'aaki567', 'admin'),
('Hira Magar', 'hira.magar@gmail.com', 'hira926', 'user'),
('Nirjala Rai', 'nirjala.rai@gmail.com', 'nir39740', 'user'),
('Aayush Shrestha', 'aayush.shrestha@gmail.com', 'aayush123', 'user'),
('Roshni Magar', 'roshni.magar@gmail.com', 'ros123', 'user'),
('Gaurav Dhakal', 'gaurav.dhakal@gmail.com', 'gau123', 'user');

-- =========================================
-- CATEGORIES DATA
-- =========================================

INSERT INTO categories (name) VALUES
('Books'),
('Clothing'),
('Electronics'),
('Household');

-- =========================================
-- LISTINGS DATA
-- =========================================

INSERT INTO listings (user_id, category_id, title, description, availability) VALUES
(1, 1, 'Software Engineering Book', 'Useful for students', '2 March - 25 April'),
(2, 2, 'Winter Coat', 'Warm and comfortable', '25 Feb - 3 March'),
(3, 3, 'Iron', 'Working perfectly', '24 Feb - 5 March'),
(4, 4, 'Cooking Pot', 'Good condition for daily use', 'March');

-- =========================================
-- REQUESTS DATA
-- =========================================

INSERT INTO requests (listing_id, requester_id) VALUES
(1, 2),
(2, 3);

-- =========================================
-- MESSAGES DATA
-- =========================================

INSERT INTO messages (sender_id, receiver_id, message) VALUES
(2, 1, 'Can I request this book?'),
(1, 2, 'Yes, sure!'),
(3, 2, 'Is the coat still available?'),
(2, 3, 'Yes, you can collect it tomorrow');

-- =========================================
-- REPORTS DATA
-- =========================================

INSERT INTO reports (reporter_id, reason) VALUES
(1, 'Item description is incorrect'),
(2, 'User did not respond to messages');