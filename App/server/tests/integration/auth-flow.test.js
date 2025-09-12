const request = require('supertest');
const app = require('../test-app');
const User = require('../../models/User');

describe('Authentication Flow Integration Tests', () => {
  describe('Complete User Registration and Login Flow', () => {
    it('should complete full registration and login flow', async () => {
      const userData = {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@example.com',
        password: 'password123',
        phone: '1111111111',
        ssn: '111111111'
      };

      // Step 1: Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.message).toBe('User registered successfully');
      expect(registerResponse.body.token).toBeDefined();
      expect(registerResponse.body.user.email).toBe(userData.email);
      expect(registerResponse.body.user.accounts).toHaveLength(2);

      const token = registerResponse.body.token;

      // Step 2: Get user profile with token
      const profileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.user.email).toBe(userData.email);
      expect(profileResponse.body.user.firstName).toBe(userData.firstName);
      expect(profileResponse.body.user.lastName).toBe(userData.lastName);

      // Step 3: Update profile
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const updateResponse = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.user.firstName).toBe('Updated');
      expect(updateResponse.body.user.lastName).toBe('Name');

      // Step 4: Change password
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      };

      const passwordResponse = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData)
        .expect(200);

      expect(passwordResponse.body.message).toBe('Password changed successfully');

      // Step 5: Login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'newpassword123'
        })
        .expect(200);

      expect(loginResponse.body.message).toBe('Login successful');
      expect(loginResponse.body.token).toBeDefined();
    });

    it('should handle account lockout after failed attempts', async () => {
      const userData = {
        firstName: 'Lockout',
        lastName: 'Test',
        email: 'lockout@example.com',
        password: 'password123',
        phone: '2222222222',
        ssn: '222222222'
      };

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Attempt 5 failed logins
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: 'wrongpassword'
          })
          .expect(401);
      }

      // Account should now be locked
      const lockoutResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'password123'
        })
        .expect(401);

      expect(lockoutResponse.body.message).toBe('Account is temporarily locked due to too many failed login attempts');
    });

    it('should handle duplicate registration attempts', async () => {
      const userData = {
        firstName: 'Duplicate',
        lastName: 'Test',
        email: 'duplicate@example.com',
        password: 'password123',
        phone: '3333333333',
        ssn: '333333333'
      };

      // First registration should succeed
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email should fail
      const duplicateResponse = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          phone: '4444444444',
          ssn: '444444444'
        })
        .expect(400);

      expect(duplicateResponse.body.message).toContain('User already exists');

      // Second registration with same phone should fail
      const duplicatePhoneResponse = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          email: 'different@example.com',
          ssn: '555555555'
        })
        .expect(400);

      expect(duplicatePhoneResponse.body.message).toContain('User already exists');
    });
  });

  describe('Database Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const userData = {
        firstName: 'Consistency',
        lastName: 'Test',
        email: 'consistency@example.com',
        password: 'password123',
        phone: '5555555555',
        ssn: '555555555'
      };

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const userId = registerResponse.body.user.id;
      const token = registerResponse.body.token;

      // Verify user exists in database
      const dbUser = await User.findById(userId);
      expect(dbUser).toBeDefined();
      expect(dbUser.email).toBe(userData.email);
      expect(dbUser.accounts).toHaveLength(2);

      // Update profile and verify database update
      await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated' })
        .expect(200);

      const updatedDbUser = await User.findById(userId);
      expect(updatedDbUser.firstName).toBe('Updated');

      // Change password and verify it works
      await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        })
        .expect(200);

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'newpassword123'
        })
        .expect(200);

      expect(loginResponse.body.message).toBe('Login successful');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      // Test with missing required fields
      await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      // Test with invalid JSON - this will return 500 due to body-parser error
      await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(500);

      // Test with invalid token
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle concurrent requests', async () => {
      const userData = {
        firstName: 'Concurrent',
        lastName: 'Test',
        email: 'concurrent@example.com',
        password: 'password123',
        phone: '6666666666',
        ssn: '666666666'
      };

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const token = registerResponse.body.token;

      // Make multiple concurrent requests
      const promises = [
        request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`),
        request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`),
        request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
      ];

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe(userData.email);
      });
    });
  });
});
