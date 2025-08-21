const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey'; // Always keep secret in .env

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (err) {
    console.error('Token Verification Failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;
