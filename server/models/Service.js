const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  price: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      enum: ['hour', 'day', 'month', 'quarter', 'year'],
      default: 'hour'
    }
  },
  duration: {
    type: Number,
    required: false,
    min: [1, 'Duration must be at least 1']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v) || /^https?:\/\/picsum\.photos\/.+/i.test(v);
      },
      message: 'Please provide valid image URLs'
    }
  }],
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  availability: {
    monday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    tuesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    wednesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    thursday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    friday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    saturday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    sunday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
