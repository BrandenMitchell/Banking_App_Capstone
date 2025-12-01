# Plaid API Integration Setup Guide

This guide explains how to set up and use the Plaid API integration in your banking application.

## Prerequisites

- Node.js and npm installed
- MongoDB database
- Plaid account (sign up at [https://plaid.com](https://plaid.com))

## Step 1: Get Plaid API Credentials

1. Sign up for a free Plaid account at [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Once logged in, go to the Dashboard
3. Navigate to **Team Settings** > **Keys**
4. Copy your:
   - `client_id`
   - `secret` (for sandbox environment)

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file in the `App/server` directory:

```env
# Plaid Configuration
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_ENV=sandbox

# Existing variables
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Environment Options

- **PLAID_ENV**: Choose from `sandbox`, `development`, or `production`
  - `sandbox`: For testing with fake credentials
  - `development`: For testing with real credentials (limited transactions)
  - `production`: For live environment

### Sandbox Test Credentials

When using Plaid Link in sandbox mode, you can use these test credentials:

- **Username**: `user_good`
- **Password**: `pass_good`
- **Institution**: Search for "First Platypus Bank" or any other test institution

## Step 3: Update Your .env File Example

Create a `.env.example` file for reference:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/banking_app

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Plaid API Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_sandbox_secret
PLAID_ENV=sandbox
```

## Step 4: Start the Application

1. **Start the backend server**:
   ```bash
   cd App/server
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd App/client
   npm start
   ```

## Using the Plaid Integration

### 1. Link a Bank Account

1. Navigate to the Accounts page in your application
2. Click the **"Link Bank Account"** button
3. A Plaid Link modal will open
4. Select an institution (use test institutions in sandbox mode)
5. Enter credentials:
   - For sandbox: `user_good` / `pass_good`
   - For development/production: your real bank credentials
6. Select the accounts you want to link
7. Click Continue

### 2. View Linked Accounts

- After successfully linking, your accounts will appear on the Accounts page
- Each account shows:
  - Institution name
  - Account name/type
  - Current balance
  - Last 4 digits of account number

### 3. Sync Account Balances

- Click the **"Sync Accounts"** button to refresh balances
- This fetches the latest data from Plaid

### 4. View Transactions

- Click on any account card to select it
- Transactions from the last 30 days will display below
- Transactions show:
  - Date
  - Merchant/description
  - Category
  - Amount
  - Pending status

## API Endpoints

The following endpoints are available:

### POST `/api/plaid/create_link_token`
Creates a link token for initializing Plaid Link
- **Authentication**: Required
- **Returns**: Link token for frontend

### POST `/api/plaid/exchange_public_token`
Exchanges public token for access token and saves account data
- **Authentication**: Required
- **Body**: `{ public_token, metadata }`
- **Returns**: Array of linked accounts

### GET `/api/plaid/accounts`
Gets all linked accounts for the authenticated user
- **Authentication**: Required
- **Returns**: Array of accounts

### POST `/api/plaid/sync_accounts`
Syncs account balances with Plaid
- **Authentication**: Required
- **Returns**: Updated accounts with current balances

### GET `/api/plaid/transactions/:accountId`
Fetches transactions for a specific account (last 30 days)
- **Authentication**: Required
- **Returns**: Array of transactions

### DELETE `/api/plaid/accounts/:accountId`
Removes a linked account
- **Authentication**: Required
- **Returns**: Success message

## Database Schema Changes

The integration adds the following fields to your models:

### Account Model
```javascript
{
  // Existing fields...
  plaidAccessToken: String,
  plaidItemId: String,
  plaidAccountId: String,
  institutionName: String,
  institutionId: String,
  mask: String,
  officialName: String,
  subtype: String,
  availableBalance: Number,
  currentBalance: Number,
  lastSynced: Date
}
```

### Transaction Model
```javascript
{
  // Existing fields...
  transactionId: String,
  date: Date,
  name: String,
  merchantName: String,
  category: String,
  pending: Boolean
}
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific secrets** for development and production
3. **Store access tokens securely** - they are encrypted in the database
4. **Rotate secrets regularly** in production
5. **Use HTTPS** in production to protect sensitive data
6. **Implement rate limiting** on API endpoints
7. **Validate and sanitize** all user inputs

## Troubleshooting

### "Failed to create link token"
- Check that your `PLAID_CLIENT_ID` and `PLAID_SECRET` are correct
- Verify your Plaid account is active
- Check server logs for detailed error messages

### "No accounts appearing after linking"
- Check MongoDB connection
- Verify the exchange token endpoint is working
- Check browser console for errors

### "Transactions not loading"
- Ensure account has a valid `plaidAccessToken`
- Check that you're in the correct Plaid environment
- Sandbox accounts may have limited transaction history

### Authentication Errors
- Verify your JWT token is being sent in request headers
- Check that the auth middleware is properly configured

## Going to Production

Before going to production:

1. **Apply for production access** with Plaid
2. **Update environment** to `production`
3. **Use production secrets** from Plaid dashboard
4. **Implement webhook handlers** for real-time updates
5. **Add error monitoring** and logging
6. **Set up regular data syncing** (recommended: daily)
7. **Review Plaid's production checklist**

## Additional Resources

- [Plaid Documentation](https://plaid.com/docs/)
- [Plaid API Reference](https://plaid.com/docs/api/)
- [React Plaid Link](https://github.com/plaid/react-plaid-link)
- [Plaid Node SDK](https://github.com/plaid/plaid-node)

## Support

If you encounter issues:
- Check the [Plaid Support](https://support.plaid.com/)
- Review server logs
- Check browser console for errors
- Verify all environment variables are set correctly

