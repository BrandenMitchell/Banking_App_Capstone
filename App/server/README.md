# Banking App Backend

This is the backend server for the Banking App, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Password Security**: Bcrypt hashing with salt rounds
- **Account Management**: Automatic creation of checking and savings accounts
- **Data Validation**: Comprehensive input validation and error handling
- **Security Features**: Account lockout after failed login attempts
- **RESTful API**: Clean API endpoints for all operations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/banking_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client Configuration
CLIENT_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change user password

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### User Model
```javascript
{
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  phone: String (required, unique)
  ssn: String (required, unique, encrypted)
  accounts: [{
    type: String (checking/savings/credit)
    accountNumber: String (unique)
    balance: Number (default: 0)
    isActive: Boolean (default: true)
    createdAt: Date
  }]
  isActive: Boolean (default: true)
  lastLogin: Date
  loginAttempts: Number (default: 0)
  lockUntil: Date
}
```

## Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Account Lockout**: 5 failed attempts locks account for 2 hours
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Protection**: Configured for specific client origins
- **Error Handling**: Secure error messages without sensitive data exposure

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/banking_app |
| `JWT_SECRET` | JWT signing secret | your-super-secret-jwt-key-change-this-in-production |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

## Testing the API

You can test the API using tools like Postman or curl:

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "ssn": "123456789"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found
- `500` - Internal Server Error

## Development Notes

- The server automatically creates default checking and savings accounts for new users
- Account numbers are generated as 10-digit random numbers
- SSN and password fields are excluded from JSON responses for security
- All timestamps are in UTC
- The server includes comprehensive logging for debugging
