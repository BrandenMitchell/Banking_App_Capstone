// Basic Jest test setup for backend integration tests

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
process.env.PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || 'test-client-id';
process.env.PLAID_SECRET = process.env.PLAID_SECRET || 'test-secret';
process.env.LOCAL_LLM_URL = process.env.LOCAL_LLM_URL || 'http://localhost:11434/api/chat';
process.env.LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL || 'llama3';


