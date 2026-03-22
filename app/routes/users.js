// routes/users.js

const express = require('express');
const router = express.Router();

// Temporary mock data for Sprint 3.
// Later, you can replace this with MySQL queries.
const users = [
  {
    id: 1,
    first_name: 'Salina',
    last_name: 'Gurung',
    email: 'salina@example.com',
    mobile: '07111111111',
    location: 'Greenford',
    bio: 'Interested in sharing household items and books.'
  },
  {
    id: 2,
    first_name: 'Nirjala',
    last_name: 'Rai',
    email: 'nirjala@example.com',
    mobile: '07222222222',
    location: 'Greenford',
    bio: 'Enjoys borrowing study materials and small appliances.'
  },
  {
    id: 3,
    first_name: 'Hira',
    last_name: 'Magar',
    email: 'hira@example.com',
    mobile: '07333333333',
    location: 'Southall',
    bio: 'Interested in electronics, tools, and community sharing.'
  },
  {
    id: 4,
    first_name: 'Aayush',
    last_name: 'Shrestha',
    email: 'aayush@example.com',
    mobile: '07444444444',
    location: 'Ealing',
    bio: 'Likes sharing sports equipment and useful everyday items.'
  }
];

// GET /users
// Show all users in a list page
router.get('/', (req, res) => {
  res.render('users', {
    title: 'Users List',
    users: users
  });
});

// GET /users/:id
// Show a single user's profile page
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Find one user by id
  const user = users.find(u => u.id === userId);

  // If user does not exist, return 404
  if (!user) {
    return res.status(404).send('User not found');
  }

  res.render('user-page', {
    title: 'User Profile',
    user: user
  });
});

module.exports = router;