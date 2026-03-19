const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  completionDate: {
    type: Date
  },
  cancellationReason: {
    type: String,
    maxlength: [300, 'Cancellation reason cannot exceed 300 characters']
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ scheduledDate: 1, status: 1 });

bookingSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completionDate) {
    this.completionDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
