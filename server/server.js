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

// ========================================
// SECURITY MIDDLEWARE
// ========================================

app.use(
helmet({
crossOriginResourcePolicy: false
})
);

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: (origin, callback) => {

    // Allow Postman and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost
    if (origin === 'http://localhost:3000') {
      return callback(null, true);
    }

    // Allow all Vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow configured frontend URL
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
}));
// ========================================
// DATABASE CONNECTION
// ========================================

mongoose
.connect(config.mongodbUri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
res.status(200).json({
status: 'OK',
message: 'Service Sphere API is running',
timestamp: new Date().toISOString()
});
});

// ========================================
// ROUTES DEBUG
// ========================================

app.get('/api/routes', (req, res) => {
res.status(200).json({
success: true,
message: 'Routes loaded successfully'
});
});

// ========================================
// API ROUTES
// ========================================

console.log('=== REGISTERING ROUTES ===');

app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');

app.use('/api/services', serviceRoutes);
console.log('✓ Services routes registered');

app.use('/api/bookings', bookingRoutes);
console.log('✓ Bookings routes registered');

app.use('/api/reviews', reviewRoutes);
console.log('✓ Reviews routes registered');

app.use('/api/ratings', ratingRoutes);
console.log('✓ Ratings routes registered');

app.use('/api/admin', adminRoutes);
console.log('✓ Admin routes registered');

app.use('/api/provider/services', providerServicesRoutes);
console.log('✓ Provider Services routes registered');

console.log('=== ALL ROUTES REGISTERED ===');

// ========================================
// RATE LIMITER
// ========================================

const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: process.env.NODE_ENV === 'development' ? 1000 : 100,
standardHeaders: true,
legacyHeaders: false
});

app.use('/api', limiter);

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
console.error(err.stack);

res.status(500).json({
success: false,
message: err.message || 'Internal Server Error'
});
});

// ========================================
// 404 HANDLER
// ========================================

app.use('*', (req, res) => {
res.status(404).json({
success: false,
message: 'Route not found'
});
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

process.on('SIGTERM', () => {
console.log('SIGTERM received');

server.close(() => {
mongoose.connection.close(false, () => {
console.log('MongoDB connection closed');
process.exit(0);
});
});
});

module.exports = app;
