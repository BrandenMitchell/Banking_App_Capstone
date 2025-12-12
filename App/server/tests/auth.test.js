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

describe('Auth – register and login', () => {
  const baseUser = {
    fullName: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    phoneNumber: '+15555555555',
    street: '123 Main St',
    city: 'Springfield',
    state: 'CA',
    zip: '90210',
  };

  test('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(baseUser)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.email).toBe(baseUser.email.toLowerCase());
  });

  test('prevents registering with an existing email', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...baseUser, username: 'testuser2' })
      .expect(409);

    expect(res.body).toHaveProperty('message');
  });

  test('logs in with username + password after registration', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: baseUser.username, password: baseUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.email).toBe(baseUser.email.toLowerCase());
  });

  test('logs in with email + password after registration', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: baseUser.email, password: baseUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.username).toBe(baseUser.username);
  });
});


