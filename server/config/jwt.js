const jwt = require('jsonwebtoken');

// Generate a JWT token for a user
const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

module.exports = generateToken; 