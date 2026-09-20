-- users টেবিল: প্রতিটা ইউজারের মূল তথ্য রাখে
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    bio TEXT,
    profile_picture VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- books টেবিল: বিক্রি/exchange/rent/donate করা বইয়ের তথ্য রাখে
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150),
    isbn VARCHAR(30),
    publisher VARCHAR(150),
    edition VARCHAR(50),
    language VARCHAR(50),
    genre VARCHAR(100),
    description TEXT,
    condition VARCHAR(20),
    listing_type VARCHAR(20) NOT NULL,
    price NUMERIC(10,2),
    rental_price NUMERIC(10,2),
    security_deposit NUMERIC(10,2),
    location VARCHAR(150),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
