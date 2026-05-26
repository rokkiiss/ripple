const WebSocket = require('ws');
const { pool } = require('../db');
const { decrypt, encrypt } = require('./encryption');
const tradovate = require('./tradovate');

// Map of accountId → WebSocket connection
const connections = new Map();

async function start() {
  console.log('[copyEngine] Starting...');
  await connectAllMasters();
  // Reconnect check every 60s
  setInterval(connectAllMasters, 60_000);
}

async function connectAllMasters() {
  const result = await pool.query(
    `SELECT ta.id, ta.account_id, ta.access_token_enc, ta.refresh_token_enc,
            ta.token_expires_at, ta.env, ta.user_id
     FROM tradovate_accounts ta
     JOIN copy_rules cr ON cr.master_account_id = ta.id AND cr.copy_enabled = TRUE
     WHERE ta.role = 'master' AND ta.active = TRUE`
  );

  for (const master of result.rows) {
    if (!connections.has(master.id)) {
      connectMaster(master).catch(err => console.error(`[copyEngine] Failed to connect master ${master.id}:`, err));
    }
  }
}

async function connectMaster(master) {
  let token;
  try {
    token = await getValidToken(master);
  } catch (err) {
    console.error(`[copyEngine] Token error for master ${master.id}:`, err.message);
    return;
  }

  const wsUrl = tradovate.wsUrl(master.env);
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    console.log(`[copyEngine] WS connected for master ${master.account_id}`);
    ws.send(`authorize\n0\n\n${token}`);
    connections.set(master.id, ws);
  });

  ws.on('message', async (raw) => {
    const msg = raw.toString();
    if (msg.startsWith('a[')) {
      try {
        const frames = JSON.parse(msg.slice(1));
        for (const frame of frames) {
          const data = JSON.parse(frame);
          if (data.e === 'order' && data.d?.ordStatus === 'Filled') {
            await onFill(master, data.d);
          }
        }
      } catch {}
    }
  });

  ws.on('close', () => {
    console.log(`[copyEngine] WS closed for master ${master.account_id}`);
    connections.delete(master.id);
  });

  ws.on('error', (err) => {
    console.error(`[copyEngine] WS error for master ${master.account_id}:`, err.message);
    connections.delete(master.id);
  });

  // Heartbeat every 2.5s (Tradovate requires it)
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.send('[]');
    else clearInterval(heartbeat);
  }, 2500);
}

async function onFill(master, order) {
  console.log(`[copyEngine] Fill on master ${master.account_id}: ${order.action} ${order.totalQty} ${order.contractId}`);

  const followers = await pool.query(
    `SELECT ta.id, ta.account_id, ta.access_token_enc, ta.refresh_token_enc,
            ta.token_expires_at, ta.env, ta.scale_factor
     FROM tradovate_accounts ta
     WHERE ta.user_id = $1 AND ta.role = 'follower' AND ta.active = TRUE`,
    [master.user_id]
  );

  await Promise.allSettled(followers.rows.map(f => copyTrade(master, f, order)));
}

async function copyTrade(master, follower, order) {
  const scaledQty = Math.max(1, Math.round(order.totalQty * Number(follower.scale_factor)));
  let status = 'pending';
  let followerOrderId = null;
  let errorMsg = null;

  try {
    const token = await getValidToken(follower);
    const result = await tradovate.placeOrder(token, follower.env, {
      accountId: Number(follower.account_id),
      contractId: order.contractId,
      action: order.action,
      orderQty: scaledQty,
    });
    followerOrderId = String(result.orderId || result.id || '');
    status = 'filled';
  } catch (err) {
    status = 'error';
    errorMsg = err.message;
    console.error(`[copyEngine] Copy error for follower ${follower.account_id}:`, err.message);
  }

  await pool.query(
    `INSERT INTO trade_copies
       (user_id, master_account_id, follower_account_id, master_order_id, follower_order_id, symbol, action, qty, price, status, error_msg)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      master.user_id, master.id, follower.id,
      String(order.orderId || ''), followerOrderId,
      order.contractId, order.action, scaledQty,
      order.avgPx || null, status, errorMsg,
    ]
  );
}

async function getValidToken(account) {
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at) : null;
  const isExpired = !expiresAt || expiresAt < new Date(Date.now() + 60_000);

  if (!isExpired) return decrypt(account.access_token_enc);

  if (!account.refresh_token_enc) throw new Error('Token expired and no refresh token');

  const refreshTok = decrypt(account.refresh_token_enc);
  const data = await tradovate.refreshToken(refreshTok, account.env);

  await pool.query(
    `UPDATE tradovate_accounts SET access_token_enc=$1, token_expires_at=$2 WHERE id=$3`,
    [encrypt(data.accessToken), data.expirationTime ? new Date(data.expirationTime) : null, account.id]
  );

  return data.accessToken;
}

module.exports = { start };
