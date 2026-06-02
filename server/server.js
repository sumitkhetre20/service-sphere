const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const config = require('./config/config');

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
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // prevent local dev from being throttled too aggressively
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// ========================================
// CORS CONFIGURATION (FIRST)
// ========================================

const allowedOrigins = [
  'http://localhost:3000',
  'https://service-sphere-ochre.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {

    // Allow Postman and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept'
  ]
}));

app.options('*', cors());

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.mongodbUri)
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

// ========================================
// SECURITY MIDDLEWARE
// ========================================

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ========================================
// RATE LIMITING
// ========================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false
});

// Apply limiter only to API routes
app.use('/api', limiter);

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
