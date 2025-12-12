const request = require('supertest');
const { createTestApp } = require('./testApp');
const {
  connectTestDb,
  disconnectTestDb,
  clearCollections,
} = require('./testDb');

// Mock Plaid SDK used in plaidController
jest.mock('plaid', () => {
  const mockAccounts = [
    {
      account_id: 'acc-1',
      subtype: 'checking',
      balances: { current: 1000, available: 900 },
      mask: '1234',
      official_name: 'Checking Account',
      name: 'Checking',
    },
  ];

  const mockPlaidApi = {
    linkTokenCreate: jest.fn().mockResolvedValue({
      data: { link_token: 'mock-link-token' },
    }),
    itemPublicTokenExchange: jest.fn().mockResolvedValue({
      data: { access_token: 'mock-access-token', item_id: 'mock-item-id' },
    }),
    accountsGet: jest.fn().mockResolvedValue({
      data: { accounts: mockAccounts },
    }),
    transactionsGet: jest.fn(),
    itemRemove: jest.fn(),
  };

  return {
    CountryCode: { Us: 'US' },
    Products: { Auth: 'auth', Transactions: 'transactions' },
    PlaidEnvironments: { sandbox: 'sandbox' },
    Configuration: jest.fn().mockImplementation(() => ({})),
    PlaidApi: jest.fn().mockImplementation(() => mockPlaidApi),
  };
});

let app;

beforeAll(async () => {
  await connectTestDb();
  app = createTestApp();
});

afterAll(async () => {
  await disconnectTestDb();
});

afterEach(async () => {
  await clearCollections();
});

async function getAuthToken(appInstance) {
  const userPayload = {
    fullName: 'Plaid User',
    username: 'plaiduser',
    email: 'plaid@example.com',
    password: 'Password123!',
    phoneNumber: '+15555550000',
    street: '10 Bank St',
    city: 'Finance City',
    state: 'IL',
    zip: '60601',
  };

  await request(appInstance)
    .post('/api/auth/register')
    .send(userPayload)
    .expect(201);

  const loginRes = await request(appInstance)
    .post('/api/auth/login')
    .send({ identifier: userPayload.email, password: userPayload.password })
    .expect(200);

  return loginRes.body.accessToken;
}

describe('Plaid – import user data', () => {
  test('creates a link token for authenticated user', async () => {
    const token = await getAuthToken(app);

    const res = await request(app)
      .post('/api/plaid/create_link_token')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(200);

    expect(res.body).toHaveProperty('link_token', 'mock-link-token');
  });

  test('exchanges public token and stores accounts', async () => {
    const token = await getAuthToken(app);

    const body = {
      public_token: 'public-sandbox-token',
      metadata: {
        institution: {
          name: 'Mock Bank',
          institution_id: 'ins_123',
        },
      },
    };

    const res = await request(app)
      .post('/api/plaid/exchange_public_token')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.accounts)).toBe(true);
    expect(res.body.accounts.length).toBeGreaterThan(0);
  });
});


