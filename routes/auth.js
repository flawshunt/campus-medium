const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.redirect('/login');
  } catch (err) {
    res.status(400).send('Registration Failed');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  console.log("✅ Password Match:", isMatch);

  if (!isMatch) {
    return res.status(401).send('Invalid credentials');
  }

  req.session.user = {
    _id: user._id,
    username: user.username,
    email: user.email
  };

  res.redirect('/home');
});



// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
