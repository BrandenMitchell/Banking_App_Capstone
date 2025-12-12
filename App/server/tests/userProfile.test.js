const request = require('supertest');
const { createTestApp } = require('./testApp');
const {
  connectTestDb,
  disconnectTestDb,
  clearCollections,
} = require('./testDb');

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

async function registerAndLogin(appInstance) {
  const userPayload = {
    fullName: 'Profile User',
    username: 'profileuser',
    email: 'profile@example.com',
    password: 'Password123!',
    phoneNumber: '+15555550123',
    street: '1 Profile Way',
    city: 'Metropolis',
    state: 'NY',
    zip: '10001',
  };

  await request(appInstance)
    .post('/api/auth/register')
    .send(userPayload)
    .expect(201);

  const loginRes = await request(appInstance)
    .post('/api/auth/login')
    .send({ identifier: userPayload.email, password: userPayload.password })
    .expect(200);

  return {
    token: loginRes.body.accessToken,
    user: loginRes.body,
  };
}

describe('User profile – view and update', () => {
  test('fetches profile for an authenticated user', async () => {
    const { token } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('email', 'profile@example.com');
    expect(res.body).toHaveProperty('username', 'profileuser');
  });

  test('updates user information from profile page', async () => {
    const { token } = await registerAndLogin(app);

    const updatePayload = {
      fullName: 'Updated Name',
      phoneNumber: '+15555559999',
      address: {
        street: '999 New St',
        city: 'Gotham',
        state: 'NJ',
        zip: '07030',
      },
    };

    const res = await request(app)
      .put('/api/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updatePayload)
      .expect(200);

    expect(res.body).toHaveProperty('message', 'User updated');
    expect(res.body.user).toHaveProperty('fullName', updatePayload.fullName);
    expect(res.body.user).toHaveProperty('phoneNumber', updatePayload.phoneNumber);
    expect(res.body.user.address).toMatchObject(updatePayload.address);
  });
});


