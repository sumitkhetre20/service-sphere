const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'provider', 'admin'])
    .withMessage('Role must be customer, provider, or admin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('profile.experience')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Experience cannot exceed 1000 characters')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);

module.exports = router;
