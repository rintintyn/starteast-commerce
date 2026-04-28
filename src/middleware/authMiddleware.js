const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../services/authService');
const userModel = require('../models/userModel');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Authorization header must be in the format: Bearer <token>.',
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = userModel.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = userModel.sanitizeUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
