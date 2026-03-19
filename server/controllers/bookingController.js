const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

const createBooking = async (req, res) => {
  try {
    console.log('=== CREATING BOOKING ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?._id);
    console.log('User role:', req.user?.role);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { serviceId, scheduledDate, scheduledTime, duration, address, notes } = req.body;

    console.log('Looking for service with ID:', serviceId);
    const service = await Service.findById(serviceId);
    console.log('Found service:', service ? service.name : 'NOT FOUND');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service is not available'
      });
    }

    console.log('Checking for existing bookings...');
    const existingBooking = await Booking.findOne({
      customer: req.user._id,
      service: serviceId,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    if (existingBooking) {
      console.log('Found existing booking:', existingBooking._id);
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking for this service'
      });
    }

    const totalPrice = service.price.basePrice * duration;
    console.log('Calculated total price:', totalPrice);

    console.log('Creating booking...');
    const booking = await Booking.create({
      customer: req.user._id,
      service: serviceId,
      provider: service.provider,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      address,
      totalPrice,
      notes
    });

    console.log('Booking created with ID:', booking._id);
    console.log('Booking saved to database:', JSON.stringify(booking, null, 2));

    await booking.populate([
      { path: 'service', select: 'name description price images' },
      { path: 'provider', select: 'name phone email' },
      { path: 'customer', select: 'name phone email' }
    ]);

    await Service.findByIdAndUpdate(serviceId, {
      $inc: { totalBookings: 1 }
    });

    console.log('=== BOOKING CREATED SUCCESSFULLY ===');
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('=== CREATE BOOKING ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    console.log('=== GETTING CUSTOMER BOOKINGS ===');
    console.log('User ID:', req.user._id);
    console.log('Query params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { customer: req.user._id };
    console.log('Booking query:', query);
    
    if (status) {
      query.status = status;
    }

    console.log('Fetching bookings from database...');
    const bookings = await Booking.find(query)
      .populate('service', 'name description price images')
      .populate('provider', 'name phone profile.rating profile.totalReviews')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log('Found bookings:', bookings.length);
    console.log('Bookings data:', JSON.stringify(bookings, null, 2));

    const total = await Booking.countDocuments(query);
    console.log('Total bookings count:', total);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { provider: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'name description price images')
      .populate('customer', 'name phone email address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    console.log('=== UPDATE BOOKING STATUS START ===');
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);
    console.log('User:', req.user);
    
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    console.log('Looking for booking with ID:', id);
    const booking = await Booking.findById(id).populate('service');
    console.log('Found booking:', booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Allow admins to update any booking, others need authorization
    if (req.user.role !== 'admin') {
      if (req.user.role === 'provider' && booking.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this booking'
        });
      }

      if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this booking'
        });
      }
    }

    // Status validation logic (only for non-admins)
    if (req.user.role !== 'admin') {
      if (status === 'confirmed' && booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending bookings can be confirmed'
        });
      }

      if (status === 'cancelled' && !['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Only pending or confirmed bookings can be cancelled'
        });
      }

      if (status === 'in-progress' && booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'Only confirmed bookings can be marked as in-progress'
        });
      }

      if (status === 'completed' && booking.status !== 'in-progress') {
        return res.status(400).json({
          success: false,
          message: 'Only in-progress bookings can be completed'
        });
      }
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'service', select: 'name description price images' },
      { path: 'provider', select: 'name phone email' },
      { path: 'customer', select: 'name phone email' }
    ]);

    res.status(200).json({
      success: true,
      data: booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user._id.toString() && 
        booking.provider.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed or already cancelled booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'No reason provided';
    booking.cancelledBy = req.user._id;
    await booking.save();

    await booking.populate([
      { path: 'service', select: 'name description price images' },
      { path: 'provider', select: 'name phone email' },
      { path: 'customer', select: 'name phone email' }
    ]);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name description price images provider')
      .populate('provider', 'name phone email profile.rating profile.totalReviews')
      .populate('customer', 'name phone email address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer._id.toString() !== req.user._id.toString() && 
        booking.provider._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById
};
