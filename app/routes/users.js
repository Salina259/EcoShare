// app/users.js

const express = require('express');
const router = express.Router();
const db = require('../services/db');
// GET /users
// Fetch all users from MySQL
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT user_id, name, email, role, created_at 
      FROM users
    `;

    const users = await db.query(sql);

    res.render('users', {
      title: 'Users List',
      users: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error loading users');
  }
});


// GET /users/:id
// Fetch single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const sql = `
      SELECT user_id, name, email, role, created_at 
      FROM users 
      WHERE user_id = ?
    `;

    const result = await db.query(sql, [userId]);

    if (result.length === 0) {
      return res.status(404).send('User not found');
    }

    res.render('user-page', {
      title: 'User Profile',
      user: result[0]
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error loading user');
  }
});

module.exports = router;