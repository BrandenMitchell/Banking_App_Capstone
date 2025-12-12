// Basic Jest test setup for backend integration tests

// Auth / JWT secrets used by tokenService and (optionally) other JWT helpers
process.env.ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'test_access_secret';
process.env.REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'test_refresh_secret';

// Optional legacy JWT secret if some code paths still expect it
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

// Plaid env defaults so the controller can instantiate a client
process.env.PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
process.env.PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || 'test-client-id';
process.env.PLAID_SECRET = process.env.PLAID_SECRET || 'test-secret';

// Local LLM / Ollama defaults
process.env.LOCAL_LLM_URL =
  process.env.LOCAL_LLM_URL || 'http://localhost:11434/api/chat';
process.env.LOCAL_LLM_MODEL =
  process.env.LOCAL_LLM_MODEL || 'llama3';


