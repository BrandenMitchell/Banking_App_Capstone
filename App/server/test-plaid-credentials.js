// Quick script to test your Plaid credentials
require('dotenv').config();

console.log('\n=== Checking Plaid Configuration ===\n');

// Check if environment variables are set
const clientId = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;
const env = process.env.PLAID_ENV;

console.log('PLAID_CLIENT_ID:', clientId ? `✓ Set (${clientId.length} characters)` : '✗ NOT SET');
console.log('PLAID_SECRET:', secret ? `✓ Set (${secret.length} characters)` : '✗ NOT SET');
console.log('PLAID_ENV:', env || '✗ NOT SET');

if (!clientId || !secret) {
  console.log('\n❌ Missing Plaid credentials!');
  console.log('\nPlease add to your .env file:');
  console.log('PLAID_CLIENT_ID=your_client_id');
  console.log('PLAID_SECRET=your_sandbox_secret');
  console.log('PLAID_ENV=sandbox');
  process.exit(1);
}

// Test the credentials
console.log('\n=== Testing Plaid Connection ===\n');

const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[env || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': clientId,
      'PLAID-SECRET': secret,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Try to create a link token
const testConfig = {
  user: {
    client_user_id: 'test-user-123',
  },
  client_name: 'Banking App Test',
  products: [Products.Auth, Products.Transactions],
  country_codes: [CountryCode.Us],
  language: 'en',
};

plaidClient.linkTokenCreate(testConfig)
  .then(response => {
    console.log('✅ SUCCESS! Your Plaid credentials are valid!');
    console.log('✅ Link token created:', response.data.link_token.substring(0, 20) + '...');
    console.log('\n🎉 You can now use the "Link Bank Account" button in your app!\n');
  })
  .catch(error => {
    console.log('❌ ERROR: Invalid credentials or connection issue');
    console.log('\nError details:');
    if (error.response?.data) {
      console.log('  Error code:', error.response.data.error_code);
      console.log('  Error message:', error.response.data.error_message);
      console.log('  Suggested action:', error.response.data.suggested_action || 'Check your credentials');
    } else {
      console.log('  ', error.message);
    }
    console.log('\n📝 To fix:');
    console.log('  1. Go to https://dashboard.plaid.com/team/keys');
    console.log('  2. Copy your SANDBOX credentials (not development or production)');
    console.log('  3. Make sure you copy the COMPLETE client_id and secret');
    console.log('  4. Update your .env file');
    console.log('  5. Restart the server\n');
    process.exit(1);
  });

