const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../store');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'panthora_secret');

    if (mongoose.connection.readyState !== 1) {
      const user = store.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized — user not found' });
      }
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      const fallback = store.findUserById(decoded.id);
      if (fallback) {
        req.user = fallback;
        return next();
      }
      return res.status(401).json({ success: false, message: 'Not authorized — user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'panthora_secret');
        const user = store.findUserById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
      }
    } catch (e) {}
    return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied — admin only' });
};

module.exports = { protect, adminOnly };
