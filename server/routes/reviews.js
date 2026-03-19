const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getServiceReviews,
  getProviderReviews,
  updateReview,
  deleteReview,
  respondToReview,
  markHelpful
} = require('../controllers/reviewController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const createReviewValidation = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
];

const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
];

const respondToReviewValidation = [
  body('response')
    .trim()
    .notEmpty()
    .withMessage('Response is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Response must be between 5 and 500 characters')
];

router.post('/', protect, authorize('customer'), createReviewValidation, createReview);
router.get('/service/:serviceId', optionalAuth, getServiceReviews);
router.get('/provider/:providerId', optionalAuth, getProviderReviews);
router.put('/:id', protect, updateReviewValidation, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, authorize('provider', 'admin'), respondToReviewValidation, respondToReview);
router.put('/:id/helpful', optionalAuth, markHelpful);

module.exports = router;
