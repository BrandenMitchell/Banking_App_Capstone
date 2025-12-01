const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require('plaid');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/**
 * Create a link token for Plaid Link initialization
 */
exports.createLinkToken = async (req, res) => {
  try {
    const userId = req.user._id.toString(); // from auth middleware
    
    const configs = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Banking App',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    res.json(createTokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
};

/**
 * Exchange public token for access token and fetch account details
 */
exports.exchangePublicToken = async (req, res) => {
  try {
    const { public_token, metadata } = req.body;
    const userId = req.user._id;

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts = accountsResponse.data.accounts;
    const institution = metadata.institution;

    // Save accounts to database
    const savedAccounts = [];
    for (const account of accounts) {
      const newAccount = new Account({
        userId,
        accountType: account.subtype === 'credit card' ? 'credit' : account.subtype || 'checking',
        balance: account.balances.current || 0,
        accountNumber: account.account_id, // Using Plaid's account_id as unique identifier
        plaidAccessToken: accessToken,
        plaidItemId: itemId,
        plaidAccountId: account.account_id,
        institutionName: institution?.name || 'Unknown',
        institutionId: institution?.institution_id || '',
        mask: account.mask,
        officialName: account.official_name || account.name,
        subtype: account.subtype,
        availableBalance: account.balances.available,
        currentBalance: account.balances.current,
        lastSynced: new Date(),
      });

      const saved = await newAccount.save();
      savedAccounts.push(saved);
    }

    res.json({ 
      success: true, 
      accounts: savedAccounts,
      message: 'Accounts linked successfully'
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Failed to link accounts' });
  }
};

/**
 * Get all accounts for a user
 */
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const accounts = await Account.find({ userId });
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

/**
 * Sync account balances with Plaid
 */
exports.syncAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const accounts = await Account.find({ userId, plaidAccessToken: { $exists: true } });

    const updatedAccounts = [];
    for (const account of accounts) {
      try {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: account.plaidAccessToken,
        });

        const plaidAccount = accountsResponse.data.accounts.find(
          (acc) => acc.account_id === account.plaidAccountId
        );

        if (plaidAccount) {
          account.balance = plaidAccount.balances.current || 0;
          account.availableBalance = plaidAccount.balances.available;
          account.currentBalance = plaidAccount.balances.current;
          account.lastSynced = new Date();
          await account.save();
          updatedAccounts.push(account);
        }
      } catch (error) {
        console.error(`Error syncing account ${account._id}:`, error);
      }
    }

    res.json({ 
      success: true, 
      accounts: updatedAccounts,
      message: 'Accounts synced successfully'
    });
  } catch (error) {
    console.error('Error syncing accounts:', error);
    res.status(500).json({ error: 'Failed to sync accounts' });
  }
};

/**
 * Fetch transactions for an account
 */
exports.getTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user._id;

    const account = await Account.findOne({ _id: accountId, userId });
    if (!account || !account.plaidAccessToken) {
      return res.status(404).json({ error: 'Account not found or not linked to Plaid' });
    }

    // Get transactions from last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const request = {
      access_token: account.plaidAccessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      options: {
        account_ids: [account.plaidAccountId],
        count: 100,
      },
    };

    const transactionsResponse = await plaidClient.transactionsGet(request);
    const transactions = transactionsResponse.data.transactions;

    // Save transactions to database
    const savedTransactions = [];
    for (const txn of transactions) {
      const existingTxn = await Transaction.findOne({ 
        transactionId: txn.transaction_id 
      });

      if (!existingTxn) {
        const newTransaction = new Transaction({
          accountId: account._id,
          userId,
          transactionId: txn.transaction_id,
          amount: txn.amount,
          date: new Date(txn.date),
          name: txn.name,
          merchantName: txn.merchant_name,
          category: txn.category?.[0] || 'Other',
          pending: txn.pending,
        });
        const saved = await newTransaction.save();
        savedTransactions.push(saved);
      } else {
        savedTransactions.push(existingTxn);
      }
    }

    res.json({ 
      transactions: savedTransactions,
      total: savedTransactions.length 
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Remove a linked account
 */
exports.removeAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user._id;

    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Optionally remove item from Plaid
    if (account.plaidAccessToken) {
      try {
        await plaidClient.itemRemove({
          access_token: account.plaidAccessToken,
        });
      } catch (error) {
        console.error('Error removing Plaid item:', error);
      }
    }

    await Account.deleteOne({ _id: accountId });
    await Transaction.deleteMany({ accountId });

    res.json({ 
      success: true, 
      message: 'Account removed successfully' 
    });
  } catch (error) {
    console.error('Error removing account:', error);
    res.status(500).json({ error: 'Failed to remove account' });
  }
};

