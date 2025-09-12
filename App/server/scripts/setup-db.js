const mongoose = require('mongoose');
const User = require('../models/User');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking_app');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Create sample users for testing
const createSampleUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('📊 Database already contains users. Skipping sample data creation.');
      return;
    }

    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '0987654321',
        ssn: '987654321'
      }
    ];

    for (const userData of sampleUsers) {
      const user = new User(userData);
      user.createDefaultAccounts();
      await user.save();
      console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
    }

    console.log('🎉 Sample users created successfully!');
  } catch (error) {
    console.error('❌ Error creating sample users:', error);
  }
};

// Main setup function
const setupDatabase = async () => {
  console.log('🚀 Setting up Banking App Database...\n');
  
  await connectDB();
  await createSampleUsers();
  
  console.log('\n✨ Database setup complete!');
  console.log('\n📝 Sample login credentials:');
  console.log('   Email: john.doe@example.com');
  console.log('   Password: password123');
  console.log('\n   Email: jane.smith@example.com');
  console.log('   Password: password123');
  
  process.exit(0);
};

// Run setup
setupDatabase();
