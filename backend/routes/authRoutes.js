// প্রয়োজনীয় টুলগুলো লোড করা হচ্ছে
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Registration রাস্তা - POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { full_name, username, email, password } = req.body;

    if (!full_name || !username || !email || !password) {
      return res.status(400).json({ message: 'সব তথ্য পূরণ করুন' });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'এই ইমেইল দিয়ে আগে থেকেই একটা একাউন্ট আছে' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (full_name, username, email, password) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, username, email, created_at`,
      [full_name, username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'রেজিস্ট্রেশন সফল হয়েছে!',
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে' });
  }
});

// Login রাস্তা - POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'ইমেইল ও পাসওয়ার্ড দিন' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'ভুল ইমেইল অথবা পাসওয়ার্ড' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'ভুল ইমেইল অথবা পাসওয়ার্ড' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'লগইন সফল হয়েছে!',
      token: token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে' });
  }
});

module.exports = router;
