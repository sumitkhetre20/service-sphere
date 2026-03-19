const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Approve provider
router.put('/users/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve user'
    });
  }
});

// Get all services
router.get('/services', protect, authorize('admin'), async (req, res) => {
  try {
    const services = await Service.find({})
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Deactivate service
router.put('/services/:id/deactivate', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).populate('provider', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deactivated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate service'
    });
  }
});

// Activate service
router.put('/services/:id/activate', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).populate('provider', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service activated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to activate service'
    });
  }
});

// Get all bookings
router.get('/bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('service', 'name')
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get admin statistics
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      totalServices,
      completedBookings
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'provider' }),
      Booking.countDocuments({}),
      Service.countDocuments({}),
      Booking.countDocuments({ status: 'completed' })
    ]);

    // Calculate total revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalBookings,
        totalServices,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Update admin profile
router.put('/profile', protect, authorize('admin'), async (req, res) => {
  try {
    const admin = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      user: admin.getPublicProfile()
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin profile'
    });
  }
});

module.exports = router;
