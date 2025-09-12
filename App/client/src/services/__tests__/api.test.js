import api from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('Token Management', () => {
    it('should set and get token', () => {
      const token = 'test-token';
      api.setToken(token);
      expect(api.getToken()).toBe(token);
    });

    it('should remove token', () => {
      api.setToken('test-token');
      api.removeToken();
      expect(api.getToken()).toBeNull();
    });
  });

  describe('Request Method', () => {
    it('should make successful request', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.request('/test');
      expect(result).toEqual({ message: 'Success' });
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should include auth token in headers when available', async () => {
      const token = 'test-token';
      api.setToken(token);
      
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Success' })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await api.request('/test');
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );
    });

    it('should throw error for failed request', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Error' })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(api.request('/test')).rejects.toThrow('Error');
    });
  });

  describe('Auth Methods', () => {
    it('should register user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        ssn: '123456789'
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'User registered successfully',
          token: 'test-token',
          user: { id: '1', ...userData }
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.register(userData);
      
      expect(result.message).toBe('User registered successfully');
      expect(api.getToken()).toBe('test-token');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData)
        })
      );
    });

    it('should login user', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Login successful',
          token: 'test-token',
          user: { id: '1', email: 'john@example.com' }
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.login(credentials.email, credentials.password);
      
      expect(result.message).toBe('Login successful');
      expect(api.getToken()).toBe('test-token');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(credentials)
        })
      );
    });

    it('should get current user', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          user: { id: '1', email: 'john@example.com' }
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.getCurrentUser();
      
      expect(result.user.email).toBe('john@example.com');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/me',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should update profile', async () => {
      const profileData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Profile updated successfully',
          user: { id: '1', ...profileData }
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.updateProfile(profileData);
      
      expect(result.message).toBe('Profile updated successfully');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/profile',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(profileData)
        })
      );
    });

    it('should change password', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Password changed successfully'
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.changePassword('oldpassword', 'newpassword');
      
      expect(result.message).toBe('Password changed successfully');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/change-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(passwordData)
        })
      );
    });

    it('should logout user', () => {
      api.setToken('test-token');
      api.logout();
      expect(api.getToken()).toBeNull();
    });
  });

  describe('Health Check', () => {
    it('should check health status', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Banking App API is running',
          timestamp: '2024-01-01T00:00:00.000Z'
        })
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await api.healthCheck();
      
      expect(result.message).toBe('Banking App API is running');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });
});
