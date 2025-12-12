const request = require('supertest');
const fetch = require('node-fetch');
const { createTestApp } = require('./testApp');
const {
  connectTestDb,
  disconnectTestDb,
  clearCollections,
} = require('./testDb');

jest.mock('node-fetch', () =>
  jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      message: { content: 'Hello from mocked LLM' },
    }),
    text: async () => 'OK',
  })
);

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
  jest.clearAllMocks();
});

describe('Chat – connect to local LLM via Ollama endpoint', () => {
  test('returns a reply from the mocked LLM service', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [
          {
            role: 'user',
            content: 'Hello, model!',
          },
        ],
      })
      .expect(200);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res.body).toHaveProperty('reply', 'Hello from mocked LLM');
  });

  test('validates that messages array is required', async () => {
    const res = await request(app).post('/api/chat').send({}).expect(400);

    expect(res.body).toHaveProperty(
      'message',
      'messages[] with role/content is required'
    );
  });
});


