-- =========================================
-- EcoShare Database Setup
-- =========================================


-- Select the database to use
USE EcoShare;

-- =========================================
-- DROP TABLES (used to reset database)
-- This removes existing tables to avoid errors
-- =========================================

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS borrow_requests;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- =========================================
-- USERS TABLE
-- Stores all registered users
-- =========================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,   -- unique ID for each user
    name VARCHAR(100),                        -- user's name
    email VARCHAR(100) UNIQUE,                -- unique email
    password VARCHAR(255),                    -- user password
    role VARCHAR(20) DEFAULT 'user',          -- role (user/admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- account creation time
);

-- =========================================
-- CATEGORIES TABLE
-- Used to classify listings (Books, Clothes, etc.)
-- =========================================

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- =========================================
-- LISTINGS TABLE
-- Stores items shared by users
-- =========================================

CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,                              -- owner of item
    category_id INT,                          -- item category
    title VARCHAR(255),                       -- item title
    description TEXT,                         -- item description
    availability VARCHAR(100),                -- available dates
    status VARCHAR(50) DEFAULT 'available',   -- item status

    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- =========================================
-- BORROW REQUESTS TABLE
-- Stores requests to borrow items
-- =========================================

CREATE TABLE borrow_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT,                          -- user requesting item
    listing_id INT,                           -- item requested
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',

    -- Foreign Keys
    FOREIGN KEY (borrower_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
);

-- =========================================
-- MESSAGES TABLE
-- Stores communication between users
-- =========================================

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,                           -- linked request
    sender_id INT,                            -- who sent message
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (request_id) REFERENCES borrow_requests(request_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- =========================================
-- REPORTS TABLE
-- Used for reporting issues or users
-- =========================================

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT,                          -- who reported
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',

    -- Foreign Key
    FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);
-- =========================================
-- USERS DATA
-- =========================================
INSERT INTO users (name, email, password, role) VALUES
('Aakriti Gurung', 'aakriti.gurung@gmail.com', 'aaki567', 'admin'),
('Hira Magar', 'hira.magar@gmail.com', 'hira926', 'user'),
('Nirjala Rai', 'nirjala.rai@gmail.com', 'nir39740', 'user'),
('Aayush Shrestha', 'aayush.shrestha@gmail.com', 'aayush123', 'user');
('Roshni Magar', 'roshni.magar@gmail.com', 'ros123', 'user'),
('Gaurav Dhakal', 'gaurav.dhakal@gmail.com', 'gau123', 'user'),


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
-- Each listing is linked to a user and category
-- =========================================
INSERT INTO listings (user_id, category_id, title, description, availability) VALUES
(1, 1, 'Software Engineering Book', 'Useful for students', '2 March - 25 April'),
(2, 2, 'Winter Coat', 'Warm and comfortable', '25 Feb - 3 March'),
(3, 3, 'Iron', 'Working perfectly', '24 Feb - 5 March'),
(4, 4, 'Cooking Pot', 'Good condition for daily use', 'March');


-- =========================================
-- BORROW REQUESTS
-- A user requests to borrow an item
-- =========================================
INSERT INTO borrow_requests (borrower_id, listing_id, start_date, end_date) VALUES
(2, 1, '2026-03-10', '2026-03-15'),
(3, 2, '2026-03-12', '2026-03-18');


-- =========================================
-- MESSAGES
-- Communication between users about a request
-- =========================================
INSERT INTO messages (request_id, sender_id, content) VALUES
(1, 2, 'Can I borrow this book?'),
(1, 1, 'Yes, sure!'),
(2, 3, 'Is the coat still available?'),
(2, 2, 'Yes, you can collect it tomorrow');


-- =========================================
-- REPORTS
-- Users reporting issues
-- =========================================
INSERT INTO reports (reporter_id, reason) VALUES
(1, 'Item description is incorrect'),
(2, 'User did not respond to messages');