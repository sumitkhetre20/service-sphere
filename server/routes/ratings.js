const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Service = require('../models/Service');

// Create or update rating for a service
router.post('/', protect, [
  body('service')
    .notEmpty()
    .withMessage('Service ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { service: serviceId, rating, review } = req.body;

    // For development: Allow users to rate services without completed bookings
    // TODO: Re-enable this check in production
    /*
    // Check if user has booked this service
    const Booking = require('../models/Booking');
    const booking = await Booking.findOne({
      service: serviceId,
      customer: req.user._id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only rate services you have completed'
      });
    }
    */

    // Check if user has already rated this service
    const existingRating = await Rating.findOne({
      service: serviceId,
      customer: req.user._id
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      // Create new rating
      // Get service to find provider
      const service = await Service.findById(serviceId);
      const newRating = new Rating({
        service: serviceId,
        customer: req.user._id,
        provider: service.provider,
        rating,
        review
      });
      await newRating.save();
    }

    // Update service average rating
    await updateServiceRating(serviceId);

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting rating'
    });
  }
});

// Get ratings for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const ratings = await Rating.find({ service: req.params.serviceId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ratings
    });

  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ratings'
    });
  }
});

// Helper function to update service rating
async function updateServiceRating(serviceId) {
  const Rating = require('../models/Rating');
  
  const ratings = await Rating.find({ service: serviceId });
  
  if (ratings.length > 0) {
    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
    
    await Service.findByIdAndUpdate(serviceId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: ratings.length
    });
  }
}

module.exports = router;
