const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Wait until the database is ready (important for Docker)
async function waitForDB(retries = 5) {
  while (retries) {
    try {
      await db.query('SELECT 1');
      return;
    } catch (err) {
      console.log('Waiting for DB...');
      await new Promise(res => setTimeout(res, 2000));
      retries--;
    }
  }
  throw new Error('Database not ready');
}

// GET /users
router.get('/', async (req, res) => {
  try {
    await waitForDB();

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
router.get('/:id', async (req, res) => {
  try {
    await waitForDB();

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