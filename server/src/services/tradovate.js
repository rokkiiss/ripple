const axios = require('axios');

const BASE = {
  demo: 'https://demo.tradovateapi.com/v1',
  live: 'https://live.tradovateapi.com/v1',
};
const WS_BASE = {
  demo: 'wss://demo.tradovateapi.com/v1/websocket',
  live: 'wss://live.tradovateapi.com/v1/websocket',
};

function baseUrl(env = 'demo') { return BASE[env] || BASE.demo; }
function wsUrl(env = 'demo') { return WS_BASE[env] || WS_BASE.demo; }

// Exchange OAuth authorization code for tokens
async function exchangeCode(code, env = 'demo') {
  const res = await axios.post(`${baseUrl(env)}/auth/oauthtoken`, {
    grant_type: 'authorization_code',
    client_id: process.env.TRADOVATE_CLIENT_ID,
    client_secret: process.env.TRADOVATE_CLIENT_SECRET,
    redirect_uri: process.env.TRADOVATE_REDIRECT_URI,
    code,
  });
  return res.data;
}

// Refresh an expired access token
async function refreshToken(refreshTok, env = 'demo') {
  const res = await axios.post(`${baseUrl(env)}/auth/oauthtoken`, {
    grant_type: 'refresh_token',
    client_id: process.env.TRADOVATE_CLIENT_ID,
    client_secret: process.env.TRADOVATE_CLIENT_SECRET,
    refresh_token: refreshTok,
  });
  return res.data;
}

// Place an order on a follower account
async function placeOrder(accessToken, env, { accountId, contractId, action, orderQty, orderType = 'Market' }) {
  const res = await axios.post(
    `${baseUrl(env)}/order/placeorder`,
    { accountId, contractId, action, orderQty, orderType, isAutomated: true },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data;
}

// Get open positions for an account
async function getPositions(accessToken, env, accountId) {
  const res = await axios.get(
    `${baseUrl(env)}/position/list?accountId=${accountId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data;
}

module.exports = { baseUrl, wsUrl, exchangeCode, refreshToken, placeOrder, getPositions };
