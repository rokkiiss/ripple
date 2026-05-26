-- Users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT,
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tradovate accounts (master or follower)
CREATE TABLE IF NOT EXISTS tradovate_accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('master', 'follower')),
  account_id  TEXT NOT NULL,
  account_name TEXT,
  env         TEXT NOT NULL DEFAULT 'demo' CHECK (env IN ('demo', 'live')),
  access_token_enc  TEXT NOT NULL,
  refresh_token_enc TEXT,
  token_expires_at  TIMESTAMPTZ,
  scale_factor NUMERIC NOT NULL DEFAULT 1.0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);

-- Copy rules (per user, per master account)
CREATE TABLE IF NOT EXISTS copy_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  master_account_id UUID NOT NULL REFERENCES tradovate_accounts(id) ON DELETE CASCADE,
  copy_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  max_daily_loss  NUMERIC,
  pause_on_max_loss BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trade copies log
CREATE TABLE IF NOT EXISTS trade_copies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  master_account_id UUID NOT NULL REFERENCES tradovate_accounts(id),
  follower_account_id UUID NOT NULL REFERENCES tradovate_accounts(id),
  master_order_id TEXT,
  follower_order_id TEXT,
  symbol          TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('Buy', 'Sell')),
  qty             INTEGER NOT NULL,
  price           NUMERIC,
  status          TEXT NOT NULL DEFAULT 'pending',
  error_msg       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Daily P&L tracking (for max loss checks)
CREATE TABLE IF NOT EXISTS daily_pnl (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES tradovate_accounts(id) ON DELETE CASCADE,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  realized_pnl    NUMERIC NOT NULL DEFAULT 0,
  UNIQUE(account_id, date)
);

CREATE INDEX IF NOT EXISTS idx_trade_copies_user_id ON trade_copies(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_copies_created_at ON trade_copies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tradovate_accounts_user_id ON tradovate_accounts(user_id);
