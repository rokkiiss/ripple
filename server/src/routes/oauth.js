const router = require('express').Router();
const { pool } = require('../db');
const { encrypt, decrypt } = require('../services/encryption');
const tradovate = require('../services/tradovate');
const requireAuth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Step 1: Start OAuth flow — redirects user to Tradovate's auth page
router.get('/tradovate/start', (req, res) => {
  const { type, token } = req.query;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).send('Invalid session token');
  }

  // Encode state so callback knows who this is for
  const state = Buffer.from(JSON.stringify({ token, type })).toString('base64');
  const params = new URLSearchParams({
    client_id: process.env.TRADOVATE_CLIENT_ID,
    redirect_uri: process.env.TRADOVATE_REDIRECT_URI,
    response_type: 'code',
    state,
  });
  res.redirect(`https://trader.tradovate.com/oauth?${params}`);
});

// Step 2: OAuth callback — exchanges code for tokens, stores encrypted
router.get('/tradovate/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send('Missing code or state');

    const { token, type } = JSON.parse(Buffer.from(state, 'base64').toString());
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const env = process.env.TRADOVATE_ENV || 'demo';

    // Exchange code for Tradovate access token
    const tokenData = await tradovate.exchangeCode(code, env);
    const { accessToken, refreshToken, expirationTime, userId, name } = tokenData;

    await pool.query(
      `INSERT INTO tradovate_accounts
        (user_id, role, account_id, account_name, env, access_token_enc, refresh_token_enc, token_expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id, account_id) DO UPDATE SET
        access_token_enc = EXCLUDED.access_token_enc,
        refresh_token_enc = EXCLUDED.refresh_token_enc,
        token_expires_at = EXCLUDED.token_expires_at`,
      [
        user.id, type, String(userId), name, env,
        encrypt(accessToken),
        refreshToken ? encrypt(refreshToken) : null,
        expirationTime ? new Date(expirationTime) : null,
      ]
    );

    // Close popup and signal success to parent
    res.send('<script>window.close();</script>');
  } catch (err) { next(err); }
});

// Disconnect an account
router.delete('/tradovate/:accountId', requireAuth, async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM tradovate_accounts WHERE id = $1 AND user_id = $2',
      [req.params.accountId, req.user.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
