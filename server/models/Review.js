const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  response: {
    text: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    date: {
      type: Date
    }
  }
}, {
  timestamps: true
});

reviewSchema.index({ customer: 1, service: 1 }, { unique: true });
reviewSchema.index({ provider: 1, rating: -1 });
reviewSchema.index({ service: 1, rating: -1 });
reviewSchema.index({ isVerified: 1 });

reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Booking = mongoose.model('Booking');
      const booking = await Booking.findById(this.booking);
      
      if (!booking || booking.status !== 'completed') {
        return next(new Error('Review can only be added for completed bookings'));
      }
      
      if (booking.customer.toString() !== this.customer.toString()) {
        return next(new Error('Only the customer who booked the service can review'));
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

reviewSchema.post('save', async function() {
  try {
    const User = mongoose.model('User');
    const Service = mongoose.model('Service');
    
    await User.findByIdAndUpdate(this.provider, {
      $inc: { 'profile.totalReviews': 1 }
    });
    
    await Service.findByIdAndUpdate(this.service, {
      $inc: { 'totalReviews': 1 }
    });
    
    await updateRatings(this.provider, this.service);
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

async function updateRatings(providerId, serviceId) {
  try {
    const Review = mongoose.model('Review');
    const User = mongoose.model('User');
    const Service = mongoose.model('Service');
    
    const providerReviews = await Review.find({ provider: providerId });
    const serviceReviews = await Review.find({ service: serviceId });
    
    const providerAvgRating = providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerReviews.length;
    const serviceAvgRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceReviews.length;
    
    await User.findByIdAndUpdate(providerId, {
      'profile.rating': providerAvgRating
    });
    
    await Service.findByIdAndUpdate(serviceId, {
      rating: serviceAvgRating
    });
  } catch (error) {
    console.error('Error calculating ratings:', error);
  }
}

module.exports = mongoose.model('Review', reviewSchema);
