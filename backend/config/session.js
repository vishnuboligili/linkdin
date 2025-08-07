const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const sessionConfig = session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // Change to true if using HTTPS
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15 // 15 minutes
  }
});

module.exports = sessionConfig;
