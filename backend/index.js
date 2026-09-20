// এই লাইনটা express লাইব্রেরিটা লোড করছে
const express = require('express');

// এই লাইনটা cors লোড করছে (frontend থেকে request নেওয়ার অনুমতি দেয়)
const cors = require('cors');

// dotenv লোড করা হচ্ছে, যাতে .env ফাইলের গোপন তথ্য ব্যবহার করা যায়
require('dotenv').config();

// db.js থেকে আমাদের ডাটাবেস সংযোগ (pool) আনছি
const pool = require('./db');

// app হলো আমাদের সার্ভার
const app = express();

// cors ব্যবহার করার অনুমতি দিচ্ছি
app.use(cors());

// এটা সার্ভারকে JSON ডেটা বুঝতে সাহায্য করে
app.use(express.json());

// সার্ভার কোন পোর্টে (দরজা নম্বর) চলবে তা ঠিক করা হচ্ছে
const PORT = process.env.PORT || 5000;

// একটা টেস্ট রুট (route) - browser-এ গিয়ে দেখলে এই বার্তা দেখাবে
app.get('/', (req, res) => {
       res.send('BookLoop backend is running!');
});

// একটা টেস্ট রুট - ডাটাবেস ঠিকমতো সংযুক্ত কিনা যাচাই করার জন্য
app.get('/test-db', async (req, res) => {
       try {
              const result = await pool.query('SELECT NOW()');
              res.send(`Database connected! Current time: ${result.rows[0].now}`);
       } catch (err) {
              res.status(500).send('Database connection failed: ' + err.message);
       }
});

// সার্ভার চালু করা হচ্ছে
app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
});