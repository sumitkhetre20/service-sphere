const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Protect Route
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided.'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('AUTH ERROR:', error.message);

    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Role Authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.'
      });
    }

    next();
  };
};

// Optional Auth (for public routes)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Optional Auth Error:', error);
    req.user = null;
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth
};
