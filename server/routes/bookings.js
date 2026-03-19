const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const createBookingValidation = [
  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .isMongoId()
    .withMessage('Invalid service ID'),
  
  body('scheduledDate')
    .notEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const scheduledDate = new Date(value);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  
  body('scheduledTime')
    .notEmpty()
    .withMessage('Scheduled time is required')
    .matches(/^([01]?\d|2[0-3]):[0-5]\d$/)
    .withMessage('Time must be in HH:MM format'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  
  body('address.street')
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Please enter a valid 6-digit pincode'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status')
];

const cancelBookingValidation = [
  body('reason')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Cancellation reason cannot exceed 300 characters')
];

router.post('/', protect, authorize('customer'), createBookingValidation, createBooking);
router.get('/customer', protect, authorize('customer'), getCustomerBookings);
router.get('/provider', protect, authorize('provider'), getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, authorize('provider', 'admin'), updateStatusValidation, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBookingValidation, cancelBooking);

module.exports = router;
