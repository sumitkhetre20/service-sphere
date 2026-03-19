const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getProviderServices,
  getCategories
} = require('../controllers/serviceController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/* ================= CREATE SERVICE VALIDATION ================= */

const createServiceValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('category')
    .isIn([
      'home-cleaning',
      'plumbing',
      'electrical',
      'carpentry',
      'painting',
      'beauty',
      'fitness',
      'tutoring',
      'photography',
      'event-planning',
      'other'
    ])
    .withMessage('Invalid category'),

  body('price.basePrice')
    .isNumeric()
    .withMessage('Base price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Base price must be positive'),

  body('price.unit')
    .optional()
    .isIn(['hour', 'day', 'month', 'year'])
    .withMessage('Invalid price unit'),

  body('duration')
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1'),
];

/* ================= UPDATE SERVICE VALIDATION ================= */

const updateServiceValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('category')
    .optional()
    .isIn([
      'home-cleaning',
      'plumbing',
      'electrical',
      'carpentry',
      'painting',
      'beauty',
      'fitness',
      'tutoring',
      'photography',
      'event-planning',
      'other'
    ])
    .withMessage('Invalid category'),

  body('price.basePrice')
    .optional()
    .isNumeric()
    .withMessage('Base price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Base price must be positive'),

  body('price.unit')
    .optional()
    .isIn(['hour', 'day', 'month', 'year'])
    .withMessage('Invalid price unit'),

  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1'),
];

/* ================= ROUTES ================= */

router.get('/test', (req, res) => {
  console.log('=== SERVICES TEST ENDPOINT CALLED ===');
  console.log('Request received at:', new Date().toISOString());
  console.log('Query params:', req.query);
  res.status(200).json({
    success: true,
    message: 'Services endpoint is working',
    timestamp: new Date().toISOString()
  });
});

router.get('/', optionalAuth, getServices);
router.get('/categories', getCategories);
router.get('/provider', protect, authorize('provider', 'admin'), getProviderServices);
router.get('/:id', optionalAuth, getServiceById);
router.post('/', protect, authorize('provider', 'admin'), createServiceValidation, createService);
router.put('/:id', protect, authorize('provider', 'admin'), updateServiceValidation, updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteService);

module.exports = router;
