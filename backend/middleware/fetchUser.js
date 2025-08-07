const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token)
    return res.status(401).json({ success: false, error: "Please authenticate with a valid token" });

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = fetchUser;
