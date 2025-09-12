const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    unique: true
  },
  ssn: {
    type: String,
    required: [true, 'SSN is required'],
    match: [/^\d{9}$/, 'SSN must be exactly 9 digits'],
    unique: true,
    select: false // Don't include SSN in queries by default for security
  },
  accounts: [{
    type: {
      type: String,
      enum: ['checking', 'savings', 'credit'],
      required: true
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes are automatically created by the unique constraints

// Virtual for account lockout
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create default accounts before saving
userSchema.pre('save', function(next) {
  // Only create accounts for new users
  if (this.isNew && this.accounts.length === 0) {
    this.createDefaultAccounts();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate account number
userSchema.methods.generateAccountNumber = function() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Instance method to create default accounts for new users
userSchema.methods.createDefaultAccounts = function() {
  if (this.accounts.length === 0) {
    this.accounts.push({
      type: 'checking',
      accountNumber: this.generateAccountNumber(),
      balance: 0
    });
    this.accounts.push({
      type: 'savings',
      accountNumber: this.generateAccountNumber(),
      balance: 0
    });
  }
};

// Static method to find user by email (including password for login)
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 2 hours
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    }
    
    await user.save();
    throw new Error('Invalid email or password');
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Remove password and SSN from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.ssn;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
