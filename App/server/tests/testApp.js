const express = require('express');
const cors = require('cors');

const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const plaidRoutes = require('../routes/plaidRoutes');
const chatRoutes = require('../routes/chatRoutes');

// Factory to create an Express app wired with the same routes as production,
// but without starting an HTTP listener. Used for integration tests.
function createTestApp() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/plaid', plaidRoutes);
  app.use('/api/chat', chatRoutes);

  // basic health route for sanity checks in tests
  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  return app;
}

module.exports = { createTestApp };


