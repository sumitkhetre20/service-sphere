const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: false,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one rating per customer per service
ratingSchema.index({ service: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
