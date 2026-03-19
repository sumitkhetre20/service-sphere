const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

// Get provider's own services
router.get('/my-services', protect, authorize('provider'), async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Create new service
router.post('/', protect, authorize('provider'), async (req, res) => {
  try {
    console.log('=== SERVICE CREATION START ===');
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    
    // Transform category names to match model enum
    const categoryMap = {
      'Home Cleaning': 'home-cleaning',
      'Plumbing': 'plumbing',
      'Electrical': 'electrical',
      'Carpentry': 'carpentry',
      'Painting': 'painting',
      'Beauty & Wellness': 'beauty',
      'Fitness': 'fitness',
      'Tutoring': 'tutoring',
      'Photography': 'photography',
      'Event Planning': 'event-planning',
      'Other': 'other'
    };

    const serviceData = {
      ...req.body,
      category: categoryMap[req.body.category] || 'other',
      provider: req.user.id,
      isActive: true
    };

    console.log('Transformed service data:', serviceData);

    // Validate required fields
    if (!serviceData.name || !serviceData.description || !serviceData.category || !serviceData.price?.basePrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, category, or price'
      });
    }

    const service = await Service.create(serviceData);
    console.log('Service created successfully:', service);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('=== SERVICE CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create service',
      error: error.message
    });
  }
});

// Update service
router.put('/:id', protect, authorize('provider'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Toggle service active status
router.put('/:id/toggle-active', protect, authorize('provider'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      { isActive: req.body.isActive },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service status updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status'
    });
  }
});

// Delete service
router.delete('/:id', protect, authorize('provider'), async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      provider: req.user.id
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

module.exports = router;
