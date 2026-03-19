const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
require('dotenv').config();

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-sphere');
    console.log('Connected to MongoDB');

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@servicesphere.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@servicesphere.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890',
        isApproved: true
      });
      console.log('Admin user created:', adminUser.email);
    }

    // Create provider user if not exists
    let providerUser = await User.findOne({ email: 'provider@servicesphere.com' });
    if (!providerUser) {
      providerUser = await User.create({
        name: 'Service Provider',
        email: 'provider@servicesphere.com',
        password: 'provider123',
        role: 'provider',
        phone: '9876543210',
        isApproved: true,
        profile: {
          bio: 'Professional service provider with 5+ years of experience',
          experience: 'Worked with over 100 satisfied customers'
        }
      });
      console.log('Provider user created:', providerUser.email);
    }

    // Create test service if not exists
    let testService = await Service.findOne({ name: 'Home Cleaning Service' });
    if (!testService) {
      testService = await Service.create({
        name: 'Home Cleaning Service',
        description: 'Professional home cleaning service for all your needs. We provide thorough cleaning of your home including living room, bedrooms, kitchen, and bathrooms.',
        category: 'home-cleaning',
        price: {
          basePrice: 500,
          unit: 'hour'
        },
        duration: 2,
        provider: providerUser._id,
        images: ['https://picsum.photos/seed/cleaning/400/300.jpg'],
        tags: ['cleaning', 'home', 'professional'],
        requirements: ['Access to water', 'Electricity available']
      });
      console.log('Test service created:', testService.name);
    }

    // Create customer user if not exists
    let customerUser = await User.findOne({ email: 'customer@servicesphere.com' });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'Test Customer',
        email: 'customer@servicesphere.com',
        password: 'customer123',
        role: 'customer',
        phone: '5555555555',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        }
      });
      console.log('Customer user created:', customerUser.email);
    }

    console.log('\n=== TEST DATA CREATED SUCCESSFULLY ===');
    console.log('Admin login: admin@servicesphere.com / admin123');
    console.log('Provider login: provider@servicesphere.com / provider123');
    console.log('Customer login: customer@servicesphere.com / customer123');
    console.log('Service ID:', testService._id);

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestData();
