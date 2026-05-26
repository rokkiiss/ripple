require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const accountRoutes = require('./routes/accounts');
const tradeRoutes = require('./routes/trades');
const { initDb } = require('./db');
const copyEngine = require('./services/copyEngine');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await initDb();
  app.listen(PORT, () => console.log(`Ripple server running on :${PORT}`));
  copyEngine.start();
}

start().catch(err => { console.error('Failed to start:', err); process.exit(1); });
