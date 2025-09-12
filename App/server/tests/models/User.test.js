const User = require('../../models/User');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.phone).toBe(userData.phone);
      expect(user.ssn).toBe(userData.ssn);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.accounts).toHaveLength(2); // Should have checking and savings
      expect(user.isActive).toBe(true);
    });

    it('should hash password before saving', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '0987654321',
        ssn: '987654321'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(50); // Bcrypt hash length
    });

    it('should create default accounts for new users', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1111111111',
        ssn: '111111111'
      };

      const user = new User(userData);
      user.createDefaultAccounts();
      await user.save();

      expect(user.accounts).toHaveLength(2);
      expect(user.accounts[0].type).toBe('checking');
      expect(user.accounts[1].type).toBe('savings');
      expect(user.accounts[0].balance).toBe(0);
      expect(user.accounts[1].balance).toBe(0);
      expect(user.accounts[0].accountNumber).toMatch(/^\d{10}$/);
      expect(user.accounts[1].accountNumber).toMatch(/^\d{10}$/);
    });
  });

  describe('Validation', () => {
    it('should require all mandatory fields', async () => {
      const user = new User({});
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.firstName).toBeDefined();
      expect(error.errors.lastName).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
      expect(error.errors.phone).toBeDefined();
      expect(error.errors.ssn).toBeDefined();
    });

    it('should validate email format', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should validate phone number format', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123', // Invalid phone
        ssn: '123456789'
      };

      const user = new User(userData);
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.phone).toBeDefined();
    });

    it('should validate SSN format', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123' // Invalid SSN
      };

      const user = new User(userData);
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.ssn).toBeDefined();
    });

    it('should enforce unique email', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User({
        ...userData,
        phone: '0987654321',
        ssn: '987654321'
      });

      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });
  });

  describe('Password Methods', () => {
    it('should compare password correctly', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Static Methods', () => {
    it('should find user by credentials', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      user.createDefaultAccounts();
      await user.save();

      const foundUser = await User.findByCredentials('test@example.com', 'password123');
      expect(foundUser._id.toString()).toBe(user._id.toString());
      expect(foundUser.email).toBe(userData.email);
    });

    it('should throw error for invalid credentials', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      await user.save();

      await expect(User.findByCredentials('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid email or password');

      await expect(User.findByCredentials('wrong@example.com', 'password123'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('Account Lockout', () => {
    it('should lock account after 5 failed attempts', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      await user.save();

      // Simulate 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        try {
          await User.findByCredentials('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected to fail
        }
      }

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isLocked).toBe(true);
      expect(updatedUser.lockUntil).toBeDefined();
    });
  });

  describe('JSON Output', () => {
    it('should exclude sensitive data from JSON output', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const user = new User(userData);
      await user.save();

      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.ssn).toBeUndefined();
      expect(userJSON.loginAttempts).toBeUndefined();
      expect(userJSON.lockUntil).toBeUndefined();
    });
  });
});
