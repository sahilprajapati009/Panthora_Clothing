const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');
const store = require('../store');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'panthora_secret', { expiresIn: '7d' });
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { name, email, password, phone } = req.body;

    if (!isMongoConnected()) {
      if (store.findUserByEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
      const user = store.createUser({ name, email, password, phone });
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error) {
    const { name, email, password, phone } = req.body;
    const user = store.createUser({ name, email, password, phone });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { email, password } = req.body;

    if (!isMongoConnected()) {
      const user = store.findUserByEmail(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const fallback = store.findUserByEmail(email);
      if (fallback && bcrypt.compareSync(password, fallback.password)) {
        const token = generateToken(fallback._id);
        return res.json({
          success: true,
          token,
          user: { _id: fallback._id, name: fallback.name, email: fallback.email, role: fallback.role, phone: fallback.phone, address: fallback.address },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
    });
  } catch (error) {
    const { email, password } = req.body;
    const user = store.findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
      });
    }
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const user = store.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({
        success: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address, createdAt: user.createdAt },
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      const fallback = store.findUserById(req.user._id);
      if (fallback) return res.json({ success: true, user: fallback });
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address, createdAt: user.createdAt },
    });
  } catch (error) {
    const user = store.findUserById(req.user?._id);
    if (user) return res.json({ success: true, user });
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
};
