const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Create link token for Plaid Link
router.post('/create_link_token', plaidController.createLinkToken);

// Exchange public token for access token
router.post('/exchange_public_token', plaidController.exchangePublicToken);

// Get all accounts for user
router.get('/accounts', plaidController.getAccounts);

// Sync account balances
router.post('/sync_accounts', plaidController.syncAccounts);

// Get transactions for a specific account
router.get('/transactions/:accountId', plaidController.getTransactions);

// Remove a linked account
router.delete('/accounts/:accountId', plaidController.removeAccount);

module.exports = router;

