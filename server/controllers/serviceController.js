const Service = require('../models/Service');
const { validationResult } = require('express-validator');

const getServices = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Build query object
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query['price.basePrice'] = {};
      if (minPrice) query['price.basePrice'].$gte = Number.parseFloat(minPrice);
      if (maxPrice) query['price.basePrice'].$lte = Number.parseFloat(maxPrice);
    }

    // Use lean() for better performance and to avoid populate issues
    const services = await Service.find(query)
      .populate({
        path: 'provider',
        select: 'name profile.rating profile.totalReviews isApproved',
        match: { isApproved: true }
      })
      .lean()
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Filter services to only show those from approved providers
    const approvedServices = services.filter(service => 
      service.provider && service.provider.isApproved === true
    );

    console.log('Services found:', services.length);
    console.log('Approved services:', approvedServices.length);
    console.log('Sample approved service:', JSON.stringify(approvedServices[0], null, 2));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      data: approvedServices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name profile.bio profile.experience profile.rating profile.totalReviews phone');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.isActive && req.user?._id?.toString() !== service.provider?._id?.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Service not available'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service'
    });
  }
};

const createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!['provider', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only providers and admins can create services'
      });
    }

    const service = await Service.create({
      ...req.body,
      provider: req.user._id
    });

    await service.populate('provider', 'name profile.rating');

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating service'
    });
  }
};

const updateService = async (req, res) => {
  try {
    console.log('=== UPDATE SERVICE START ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    console.log('Looking for service with ID:', req.params.id);
    const service = await Service.findById(req.params.id);
    console.log('Found service:', service);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    console.log('Updating service...');
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('provider', 'name profile.rating');
    
    console.log('Service updated successfully:', updatedService);

    res.status(200).json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service'
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service'
    });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || 'active';

    const query = { provider: req.user._id };

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get provider services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching provider services'
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'home-cleaning', label: 'Home Cleaning' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'carpentry', label: 'Carpentry' },
      { value: 'painting', label: 'Painting' },
      { value: 'beauty', label: 'Beauty & Wellness' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'photography', label: 'Photography' },
      { value: 'event-planning', label: 'Event Planning' },
      { value: 'other', label: 'Other' }
    ];

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getProviderServices,
  getCategories
};
