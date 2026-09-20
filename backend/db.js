// pg লাইব্রেরি থেকে Pool নামের একটা টুল আনছি
// Pool মানে হলো ডাটাবেসের সাথে একাধিক সংযোগ ব্যবস্থাপনা করা, যাতে দ্রুত কাজ হয়
const { Pool } = require('pg');

// .env ফাইলের তথ্য লোড করা হচ্ছে
require('dotenv').config();

// একটা নতুন Pool (সংযোগ) তৈরি করা হচ্ছে .env এর DATABASE_URL ব্যবহার করে
const pool = new Pool({
       connectionString: process.env.DATABASE_URL,
});

// এই ফাইলের কাজ শেষে pool-টাকে অন্য ফাইলে ব্যবহারের জন্য export করা হচ্ছে
module.exports = pool;
