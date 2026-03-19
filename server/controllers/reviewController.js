const Review = require('../models/Review');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can create reviews'
      });
    }

    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('service')
      .populate('provider');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings'
      });
    }

    const existingReview = await Review.findOne({
      customer: req.user._id,
      service: booking.service._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this service'
      });
    }

    const review = await Review.create({
      customer: req.user._id,
      provider: booking.provider._id,
      service: booking.service._id,
      booking: bookingId,
      rating,
      comment,
      isVerified: true
    });

    await review.populate([
      { path: 'customer', select: 'name' },
      { path: 'provider', select: 'name' },
      { path: 'service', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rating = req.query.rating;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const query = { service: req.params.serviceId };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('customer', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    const averageRating = await Review.aggregate([
      { $match: { service: mongoose.Types.ObjectId(req.params.serviceId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rating = req.query.rating;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const query = { provider: req.params.providerId };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('customer', 'name')
      .populate('service', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    const ratingDistribution = await Review.aggregate([
      { $match: { provider: mongoose.Types.ObjectId(req.params.providerId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      ratingDistribution,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get provider reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    const { rating, comment } = req.body;

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    await review.populate([
      { path: 'customer', select: 'name' },
      { path: 'provider', select: 'name' },
      { path: 'service', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

const respondToReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the service provider can respond to reviews'
      });
    }

    const { response } = req.body;

    review.response = {
      text: response,
      date: new Date()
    };

    await review.save();

    await review.populate([
      { path: 'customer', select: 'name' },
      { path: 'provider', select: 'name' },
      { path: 'service', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      data: review,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding response'
    });
  }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.helpful += 1;
    await review.save();

    res.status(200).json({
      success: true,
      data: { helpful: review.helpful },
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking review as helpful'
    });
  }
};

module.exports = {
  createReview,
  getServiceReviews,
  getProviderReviews,
  updateReview,
  deleteReview,
  respondToReview,
  markHelpful
};
