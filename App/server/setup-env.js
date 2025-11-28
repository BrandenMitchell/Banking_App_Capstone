#!/usr/bin/env node
// Script to help set up .env file
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env');

// Generate random secrets
const generateSecret = () => crypto.randomBytes(32).toString('hex');

const envTemplate = `# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/banking_app
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/banking_app
MONGODB_URI=mongodb://localhost:27017/banking_app

# Server Port
PORT=5000

# JWT Secrets (auto-generated)
ACCESS_TOKEN_SECRET=${generateSecret()}
REFRESH_TOKEN_SECRET=${generateSecret()}
JWT_SECRET=${generateSecret()}
`;

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Backing up to .env.backup');
  fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
}

fs.writeFileSync(envPath, envTemplate);
console.log('✅ .env file created successfully!');
console.log('\n📝 Next steps:');
console.log('1. Edit .env and update MONGODB_URI with your MongoDB connection string');
console.log('2. If using local MongoDB, make sure MongoDB is running');
console.log('3. If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string');

