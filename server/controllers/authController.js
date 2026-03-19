const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: user.getPublicProfile()
  });
};

const register = async (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Create user with additional error handling
    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address
    });

    console.log('User created successfully:', user._id);
    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'DUPLICATE_USER'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Mongoose validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Only check approval for non-customer roles
    if (!user.isApproved && user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Account pending approval'
      });
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: user.getPublicProfile()
  });
};

const updateProfile = async (req, res) => {
  try {
    // Validate input
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};
