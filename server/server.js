const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/admin');
const providerServicesRoutes = require('./routes/providerServices');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-sphere', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service Sphere API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to list all routes
app.get('/api/routes', (req, res) => {
  const routes = [
    'GET /api/health',
    'GET /api/routes',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET /api/auth/me',
    'PUT /api/auth/profile',
    'GET /api/services',
    'GET /api/services/categories',
    'GET /api/services/:id',
    'POST /api/provider/services',
    'GET /api/provider/services/my-services',
    'PUT /api/provider/services/:id',
    'DELETE /api/provider/services/:id',
    'PUT /api/provider/services/:id/toggle-active',
    'POST /api/bookings',
    'GET /api/bookings/customer',
    'GET /api/bookings/provider',
    'PUT /api/bookings/:id/status',
    'PUT /api/bookings/:id/cancel',
    'POST /api/ratings',
    'GET /api/ratings/service/:serviceId',
    'GET /api/admin/stats',
    'GET /api/admin/users',
    'GET /api/admin/services',
    'PUT /api/admin/users/:id/approve',
    'PUT /api/admin/services/:id/activate',
    'PUT /api/admin/services/:id/deactivate'
  ];
  
  res.status(200).json({
    success: true,
    routes,
    total: routes.length
  });
});

// API routes
console.log('=== REGISTERING ROUTES ===');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered at /api/auth');

app.use('/api/services', serviceRoutes);
console.log('✓ Services routes registered at /api/services');

app.use('/api/bookings', bookingRoutes);
console.log('✓ Bookings routes registered at /api/bookings');

app.use('/api/reviews', reviewRoutes);
console.log('✓ Reviews routes registered at /api/reviews');

app.use('/api/ratings', ratingRoutes);
console.log('✓ Ratings routes registered at /api/ratings');

app.use('/api/admin', adminRoutes);
console.log('✓ Admin routes registered at /api/admin');

app.use('/api/provider/services', providerServicesRoutes); // Fixed: Match frontend route
console.log('✓ Provider services routes registered at /api/provider/services');

console.log('=== ALL ROUTES REGISTERED ===');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
