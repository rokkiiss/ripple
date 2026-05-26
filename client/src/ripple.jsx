import React, { useState, useEffect, useRef } from 'react';
import { T } from './tokens';

// ─── Shared UI ────────────────────────────────────────────────────────────────

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: T.radius, padding: '24px',
    transition: 'border-color 0.2s',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>{children}</div>
);

const Btn = ({ children, variant = 'primary', onClick, style, disabled, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const sizes = { sm: '8px 14px', md: '11px 22px', lg: '14px 32px' };
  const base = {
    padding: sizes[size], borderRadius: T.radiusSm, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: T.fontBody,
    fontWeight: 600, fontSize: size === 'sm' ? '13px' : '15px',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', display: 'inline-flex',
    alignItems: 'center', gap: '8px',
  };
  const variants = {
    primary: { background: hover ? '#5affed' : T.accent, color: '#000' },
    secondary: { background: hover ? T.accentDim : 'transparent', color: T.accent, border: `1px solid ${T.accent}` },
    ghost: { background: hover ? T.surfaceHover : 'transparent', color: T.textSecondary, border: `1px solid ${T.border}` },
    danger: { background: hover ? '#ff6b85' : T.red, color: '#fff' },
    blue: { background: hover ? '#6aaeff' : T.blue, color: '#000' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = T.accent, style }) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}44`,
    borderRadius: '99px', padding: '2px 10px', fontSize: '11px',
    fontFamily: T.fontMono, fontWeight: 600, letterSpacing: '0.05em', ...style,
  }}>{children}</span>
);

const Input = ({ label, type = 'text', value, onChange, placeholder, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '12px', color: T.textSecondary, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
        padding: '11px 14px', color: T.textPrimary, fontSize: '14px',
        fontFamily: T.fontBody, outline: 'none', transition: 'border-color 0.2s',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = T.accent}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  </div>
);

const Stat = ({ label, value, delta, color = T.accent }) => (
  <Card style={{ padding: '20px' }}>
    <div style={{ fontSize: '12px', color: T.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>{label}</div>
    <div style={{ fontSize: '28px', fontFamily: T.fontMono, fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
    {delta && <div style={{ fontSize: '12px', color: delta.startsWith('+') ? T.accent : T.red, marginTop: '8px', fontFamily: T.fontMono }}>{delta} today</div>}
  </Card>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }} onClick={onClose}>
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
      padding: '32px', width: '100%', maxWidth: '440px', boxShadow: T.shadowLg,
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '20px', color: T.textPrimary }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textSecondary, cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
    <div onClick={() => onChange(!checked)} style={{
      width: '44px', height: '24px', borderRadius: '99px', background: checked ? T.accent : T.border,
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: checked ? '#000' : T.textSecondary,
        transition: 'left 0.2s',
      }} />
    </div>
    {label && <span style={{ fontSize: '14px', color: T.textPrimary }}>{label}</span>}
  </label>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────

const LandingNav = ({ onLogin, onSignup }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(5,8,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${T.border}` : 'none',
      padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px', color: T.accent }}>≋</span>
        <span style={{ fontFamily: T.fontHeading, fontWeight: 800, fontSize: '20px', color: T.textPrimary, letterSpacing: '-0.02em' }}>Ripple</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Btn variant="ghost" onClick={onLogin} size="sm">Log in</Btn>
        <Btn variant="primary" onClick={onSignup} size="sm">Start free trial</Btn>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: T.surface, border: `1px solid ${hover ? T.borderHover : T.border}`,
      borderRadius: T.radius, padding: '28px', transition: 'all 0.2s',
      boxShadow: hover ? T.glowAccent : 'none',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontFamily: T.fontHeading, fontSize: '18px', fontWeight: 700, color: T.textPrimary, marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
};

const Landing = ({ onLogin, onSignup, onGoToPricing }) => (
  <div style={{ minHeight: '100vh', background: T.bg, color: T.textPrimary, fontFamily: T.fontBody }}>
    <LandingNav onLogin={onLogin} onSignup={onSignup} />

    {/* Hero */}
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px',
      background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${T.accentDim} 0%, transparent 60%)`,
    }}>
      <Badge color={T.accent} style={{ marginBottom: '24px' }}>7-day free trial · No credit card</Badge>
      <h1 style={{
        fontFamily: T.fontHeading, fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800,
        lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: '820px', marginBottom: '24px',
      }}>
        One trade.{' '}
        <span style={{ color: T.accent }}>Infinite ripples.</span>
      </h1>
      <p style={{
        fontSize: 'clamp(16px, 2vw, 20px)', color: T.textSecondary, maxWidth: '560px',
        lineHeight: 1.6, marginBottom: '40px',
      }}>
        Mirror your Tradovate master account to unlimited followers in real time.
        OAuth-secured. No passwords stored. 10% cheaper than the competition.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Btn variant="primary" onClick={onSignup} size="lg" style={{ fontSize: '16px', padding: '16px 36px' }}>
          Start free trial
        </Btn>
        <Btn variant="ghost" onClick={onGoToPricing} size="lg" style={{ fontSize: '16px', padding: '16px 36px' }}>
          See pricing
        </Btn>
      </div>
      <p style={{ marginTop: '20px', fontSize: '13px', color: T.textMuted }}>Starting at $45/mo · No credit card required</p>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: '48px', marginTop: '80px', padding: '24px 48px',
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusXl,
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[['< 50ms', 'Copy latency'], ['AES-256', 'Token encryption'], ['∞', 'Follower accounts'], ['99.9%', 'Uptime SLA']].map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: T.fontMono, fontSize: '22px', fontWeight: 700, color: T.accent }}>{val}</div>
            <div style={{ fontSize: '12px', color: T.textSecondary, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</div>
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section style={{ padding: '100px 24px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Badge color={T.blue} style={{ marginBottom: '16px' }}>How it works</Badge>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Set up in minutes
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        {[
          { n: '01', title: 'Connect your master', desc: 'Authorize your Tradovate account via OAuth. We never see your password — only an encrypted access token.' },
          { n: '02', title: 'Add followers', desc: 'Add any number of follower accounts. Set a scale factor per follower (e.g. 0.5× for half size).' },
          { n: '03', title: 'Trades copy automatically', desc: 'Every fill on your master fires within 50ms to all active followers. Monitor everything from the dashboard.' },
        ].map(({ n, title, desc }) => (
          <div key={n} style={{ display: 'flex', gap: '20px' }}>
            <div style={{ fontFamily: T.fontMono, fontSize: '36px', fontWeight: 700, color: T.accentDim, lineHeight: 1, flexShrink: 0 }}>{n}</div>
            <div>
              <h3 style={{ fontFamily: T.fontHeading, fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Badge color={T.gold} style={{ marginBottom: '16px' }}>Features</Badge>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Everything you need. Nothing you don't.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <FeatureCard icon="🔒" title="OAuth-only security" desc="We never store passwords. Tradovate tokens are encrypted with AES-256 before touching the database." />
        <FeatureCard icon="⚡" title="Sub-50ms copy latency" desc="WebSocket-driven copy engine fires follower orders the moment your master fill is detected." />
        <FeatureCard icon="⚖️" title="Per-follower scaling" desc="Set a size multiplier per follower account. 0.5× means half the size. Risk management built in." />
        <FeatureCard icon="📊" title="Live dashboard" desc="Watch open positions, P&L, and copy history across all accounts in real time." />
        <FeatureCard icon="🛡️" title="Risk controls" desc="Set max daily loss limits and pause copying automatically if thresholds are breached." />
        <FeatureCard icon="🖥️" title="Desktop app" desc="Native Windows and macOS app via Electron. Same UI, no browser needed, auto-updates included." />
      </div>
    </section>

    {/* Pricing teaser */}
    <section style={{
      padding: '80px 24px', textAlign: 'center',
      background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${T.blueDim} 0%, transparent 70%)`,
    }}>
      <h2 style={{ fontFamily: T.fontHeading, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
        Simple, transparent pricing
      </h2>
      <p style={{ color: T.textSecondary, fontSize: '16px', marginBottom: '40px' }}>
        10% cheaper than TradeSyncer. Annual plans save another 10%.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {[
          { name: 'Starter', price: '$45', color: T.accent, desc: '2 connections · 10 followers' },
          { name: 'Pro', price: '$89', color: T.blue, desc: '4 connections · 20 followers', popular: true },
          { name: 'Flex', price: '$129', color: T.gold, desc: 'Unlimited connections · 120 followers' },
        ].map(({ name, price, color, desc, popular }) => (
          <div key={name} style={{
            background: T.surface, border: `1px solid ${popular ? color : T.border}`,
            borderRadius: T.radius, padding: '28px 36px', minWidth: '200px',
            boxShadow: popular ? `0 0 32px ${color}22` : 'none', position: 'relative',
          }}>
            {popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}><Badge color={T.blue}>Most popular</Badge></div>}
            <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{name}</div>
            <div style={{ fontFamily: T.fontMono, fontSize: '36px', fontWeight: 700, color, marginBottom: '8px' }}>{price}<span style={{ fontSize: '16px', color: T.textSecondary }}>/mo</span></div>
            <div style={{ fontSize: '13px', color: T.textSecondary }}>{desc}</div>
          </div>
        ))}
      </div>
      <Btn variant="secondary" onClick={onGoToPricing} size="lg">See full pricing & comparison →</Btn>
    </section>

    {/* Footer */}
    <footer style={{
      borderTop: `1px solid ${T.border}`, padding: '40px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px', color: T.accent }}>≋</span>
        <span style={{ fontFamily: T.fontHeading, fontWeight: 700, color: T.textPrimary }}>Ripple</span>
      </div>
      <p style={{ fontSize: '12px', color: T.textMuted, textAlign: 'center' }}>
        Not affiliated with Tradovate or Ripple Labs · ripple.trade
      </p>
      <p style={{ fontSize: '12px', color: T.textMuted }}>© 2025 Ripple. All rights reserved.</p>
    </footer>
  </div>
);

// ─── Auth Modal ───────────────────────────────────────────────────────────────

const AuthModal = ({ mode = 'login', onClose, onSuccess }) => {
  const [view, setView] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true); setError('');
    try {
      const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = view === 'login' ? { email, password } : { email, password, name };
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      localStorage.setItem('ripple_token', data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={view === 'login' ? 'Welcome back' : 'Create your account'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {view === 'signup' && (
          <Input label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
        )}
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        {error && <p style={{ fontSize: '13px', color: T.red, background: T.redDim, padding: '10px 14px', borderRadius: T.radiusSm }}>{error}</p>}
        <Btn variant="primary" onClick={submit} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
          {loading ? 'Loading…' : view === 'login' ? 'Log in' : 'Create account'}
        </Btn>
        <p style={{ textAlign: 'center', fontSize: '13px', color: T.textSecondary }}>
          {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }}
            style={{ color: T.accent, cursor: 'pointer', fontWeight: 600 }}>
            {view === 'login' ? 'Sign up free' : 'Log in'}
          </span>
        </p>
        {view === 'signup' && (
          <p style={{ textAlign: 'center', fontSize: '11px', color: T.textMuted }}>
            7-day free trial. No credit card required.
          </p>
        )}
      </div>
    </Modal>
  );
};

// ─── OAuth Connect Modal ──────────────────────────────────────────────────────

const OAuthModal = ({ onClose, onConnected, type = 'master' }) => {
  const [status, setStatus] = useState('idle');

  const startOAuth = () => {
    setStatus('connecting');
    const token = localStorage.getItem('ripple_token');
    const url = `/api/oauth/tradovate/start?type=${type}&token=${token}`;
    const popup = window.open(url, 'tradovate_oauth', 'width=520,height=680');
    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        setStatus('done');
        onConnected();
      }
    }, 500);
  };

  return (
    <Modal title={`Connect ${type === 'master' ? 'master' : 'follower'} account`} onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔗</div>
        <p style={{ color: T.textSecondary, fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
          You'll be redirected to Tradovate to authorize Ripple. We use OAuth — your password is never shared with us.
        </p>
        {status === 'connecting' && (
          <p style={{ color: T.accent, fontSize: '14px', marginBottom: '16px', fontFamily: T.fontMono }}>
            Waiting for Tradovate authorization…
          </p>
        )}
        {status === 'done' && (
          <p style={{ color: T.accent, fontSize: '14px', marginBottom: '16px' }}>
            Account connected successfully!
          </p>
        )}
        <Btn variant="primary" onClick={startOAuth} disabled={status === 'connecting'} style={{ width: '100%', justifyContent: 'center' }}>
          {status === 'connecting' ? 'Connecting…' : 'Connect via Tradovate'}
        </Btn>
        <p style={{ fontSize: '12px', color: T.textMuted, marginTop: '16px' }}>
          Tokens are encrypted with AES-256 before storage
        </p>
      </div>
    </Modal>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const mockPositions = [
  { symbol: 'ESZ4', side: 'Long', qty: 2, avgPrice: 5892.50, lastPrice: 5898.75, pnl: '+$625.00', pnlRaw: 625 },
  { symbol: 'NQZ4', side: 'Short', qty: 1, avgPrice: 21045.00, lastPrice: 21032.25, pnl: '+$255.00', pnlRaw: 255 },
];
const mockTrades = [
  { id: 1, time: '09:32:14', symbol: 'ESZ4', action: 'Buy', qty: 2, price: 5892.50, status: 'Filled', followers: 8 },
  { id: 2, time: '09:45:02', symbol: 'NQZ4', action: 'Sell', qty: 1, price: 21045.00, status: 'Filled', followers: 8 },
  { id: 3, time: '10:12:33', symbol: 'ESZ4', action: 'Sell', qty: 2, price: 5905.00, status: 'Filled', followers: 8 },
  { id: 4, time: '10:44:19', symbol: 'MNQZ4', action: 'Buy', qty: 5, price: 21001.50, status: 'Filled', followers: 6 },
];
const mockFollowers = [
  { id: 1, name: 'Account #4821', scale: 1.0, active: true, pnl: '+$1,240', trades: 4 },
  { id: 2, name: 'Account #7733', scale: 0.5, active: true, pnl: '+$620', trades: 4 },
  { id: 3, name: 'Account #2291', scale: 2.0, active: false, pnl: '+$0', trades: 0 },
];
const mockActivity = [
  { time: '10:44', msg: 'Order copied to 6 followers · MNQZ4 Buy 5', ok: true },
  { time: '10:12', msg: 'Order copied to 8 followers · ESZ4 Sell 2', ok: true },
  { time: '09:45', msg: 'Order copied to 8 followers · NQZ4 Sell 1', ok: true },
  { time: '09:32', msg: 'Order copied to 8 followers · ESZ4 Buy 2', ok: true },
  { time: '09:28', msg: 'Account #2291 paused — max loss reached', ok: false },
];

const OverviewTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      <Stat label="Active followers" value="8" delta="+2" />
      <Stat label="Today's P&L" value="+$1,840" delta="+$1,840" color={T.accent} />
      <Stat label="Trades copied" value="12" delta="+4" color={T.blue} />
      <Stat label="Win rate" value="83%" color={T.gold} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
      <Card>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '16px' }}>Open positions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ color: T.textSecondary, textAlign: 'left', borderBottom: `1px solid ${T.border}` }}>
              {['Symbol', 'Side', 'Qty', 'Avg Price', 'Last', 'P&L'].map(h => (
                <th key={h} style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockPositions.map(p => (
              <tr key={p.symbol} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '12px', fontFamily: T.fontMono, fontWeight: 600, color: T.textPrimary }}>{p.symbol}</td>
                <td style={{ padding: '12px' }}><Badge color={p.side === 'Long' ? T.accent : T.red}>{p.side}</Badge></td>
                <td style={{ padding: '12px', fontFamily: T.fontMono }}>{p.qty}</td>
                <td style={{ padding: '12px', fontFamily: T.fontMono, color: T.textSecondary }}>{p.avgPrice.toFixed(2)}</td>
                <td style={{ padding: '12px', fontFamily: T.fontMono }}>{p.lastPrice.toFixed(2)}</td>
                <td style={{ padding: '12px', fontFamily: T.fontMono, color: p.pnlRaw >= 0 ? T.accent : T.red, fontWeight: 700 }}>{p.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '16px' }}>Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.ok ? T.accent : T.red, marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', color: T.textPrimary, lineHeight: 1.4 }}>{a.msg}</div>
                <div style={{ fontSize: '11px', color: T.textMuted, fontFamily: T.fontMono, marginTop: '2px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card>
      <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '16px' }}>Follower P&L</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {mockFollowers.map(f => (
          <div key={f.id} style={{
            background: T.bg, border: `1px solid ${f.active ? T.border : T.border}`,
            borderRadius: T.radiusSm, padding: '16px', opacity: f.active ? 1 : 0.5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontFamily: T.fontMono, color: T.textSecondary }}>{f.name}</span>
              <Badge color={f.active ? T.accent : T.textMuted}>{f.active ? 'Active' : 'Paused'}</Badge>
            </div>
            <div style={{ fontFamily: T.fontMono, fontSize: '22px', fontWeight: 700, color: T.accent }}>{f.pnl}</div>
            <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '4px' }}>{f.trades} trades · {f.scale}× scale</div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AccountsTab = ({ onAddAccount }) => {
  const [showOAuth, setShowOAuth] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '4px' }}>Master account</h3>
            <p style={{ fontSize: '13px', color: T.textSecondary }}>Trades from this account are copied to all active followers.</p>
          </div>
          <Btn variant="secondary" onClick={() => setShowOAuth('master')} size="sm">+ Connect master</Btn>
        </div>
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: T.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
            <div>
              <div style={{ fontFamily: T.fontMono, fontSize: '14px', fontWeight: 600 }}>Account #1042</div>
              <div style={{ fontSize: '12px', color: T.textSecondary }}>Connected via OAuth · Tradovate Live</div>
            </div>
          </div>
          <Badge color={T.accent}>Connected</Badge>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '4px' }}>Follower accounts</h3>
            <p style={{ fontSize: '13px', color: T.textSecondary }}>{mockFollowers.length} accounts · Plan allows 10</p>
          </div>
          <Btn variant="primary" onClick={() => setShowOAuth('follower')} size="sm">+ Add follower</Btn>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockFollowers.map(f => (
            <div key={f.id} style={{
              background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
              padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontFamily: T.fontMono, fontSize: '13px' }}>{f.name}</div>
                <Badge color={f.active ? T.accent : T.textMuted}>{f.active ? 'Active' : 'Paused'}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: T.textSecondary }}>Scale factor</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: '14px', fontWeight: 600, color: T.gold }}>{f.scale}×</div>
                </div>
                <Btn variant="ghost" size="sm">Manage</Btn>
                <Btn variant="danger" size="sm">Remove</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {showOAuth && <OAuthModal type={showOAuth} onClose={() => setShowOAuth(null)} onConnected={() => setShowOAuth(null)} />}
    </div>
  );
};

const TradesTab = () => {
  const [filter, setFilter] = useState('all');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['all', 'buy', 'sell'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: '99px', border: `1px solid ${filter === f ? T.accent : T.border}`,
            background: filter === f ? T.accentDim : 'transparent', color: filter === f ? T.accent : T.textSecondary,
            cursor: 'pointer', fontSize: '13px', fontFamily: T.fontBody, textTransform: 'capitalize',
          }}>{f === 'all' ? 'All trades' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {['Time', 'Symbol', 'Action', 'Qty', 'Price', 'Followers', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontWeight: 600, fontSize: '11px', color: T.textSecondary, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTrades.filter(t => filter === 'all' || t.action.toLowerCase() === filter).map(t => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '14px 16px', fontFamily: T.fontMono, fontSize: '13px', color: T.textSecondary }}>{t.time}</td>
                <td style={{ padding: '14px 16px', fontFamily: T.fontMono, fontWeight: 700 }}>{t.symbol}</td>
                <td style={{ padding: '14px 16px' }}><Badge color={t.action === 'Buy' ? T.accent : T.red}>{t.action}</Badge></td>
                <td style={{ padding: '14px 16px', fontFamily: T.fontMono }}>{t.qty}</td>
                <td style={{ padding: '14px 16px', fontFamily: T.fontMono }}>{t.price.toFixed(2)}</td>
                <td style={{ padding: '14px 16px', fontFamily: T.fontMono, color: T.blue }}>{t.followers}</td>
                <td style={{ padding: '14px 16px' }}><Badge color={T.accent}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const SettingsTab = ({ user }) => {
  const [settings, setSettings] = useState({
    copyEnabled: true, maxLoss: true, maxLossAmount: '500',
    emailAlerts: true, telegramAlerts: false, pauseOnLoss: true,
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
      <Card>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '20px' }}>Copy rules</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Toggle checked={settings.copyEnabled} onChange={v => setSettings(s => ({ ...s, copyEnabled: v }))} label="Enable copy trading" />
          <Toggle checked={settings.pauseOnLoss} onChange={v => setSettings(s => ({ ...s, pauseOnLoss: v }))} label="Pause copying when max loss reached" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Toggle checked={settings.maxLoss} onChange={v => setSettings(s => ({ ...s, maxLoss: v }))} label="Daily max loss limit" />
            {settings.maxLoss && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '56px' }}>
                <span style={{ fontSize: '14px', color: T.textSecondary }}>$</span>
                <input
                  value={settings.maxLossAmount}
                  onChange={e => setSettings(s => ({ ...s, maxLossAmount: e.target.value }))}
                  style={{
                    background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                    padding: '8px 12px', color: T.textPrimary, fontSize: '14px', fontFamily: T.fontMono,
                    width: '120px', outline: 'none',
                  }}
                />
                <span style={{ fontSize: '13px', color: T.textSecondary }}>per day</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '20px' }}>Notifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Toggle checked={settings.emailAlerts} onChange={v => setSettings(s => ({ ...s, emailAlerts: v }))} label="Email alerts on copy failure" />
          <Toggle checked={settings.telegramAlerts} onChange={v => setSettings(s => ({ ...s, telegramAlerts: v }))} label="Telegram alerts" />
        </div>
      </Card>

      <Card>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', marginBottom: '4px' }}>Account</h3>
        <p style={{ fontSize: '13px', color: T.textSecondary, marginBottom: '20px' }}>{user?.email}</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Btn variant="secondary" size="sm">Change password</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { localStorage.removeItem('ripple_token'); window.location.reload(); }}>Log out</Btn>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Btn variant="primary" onClick={save}>Save settings</Btn>
        {saved && <span style={{ color: T.accent, fontSize: '14px', fontFamily: T.fontMono }}>✓ Saved</span>}
      </div>

      <Card style={{ borderColor: T.redDim }}>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: '16px', color: T.red, marginBottom: '12px' }}>Danger zone</h3>
        <p style={{ fontSize: '13px', color: T.textSecondary, marginBottom: '16px' }}>Disconnect all accounts and delete your data. This cannot be undone.</p>
        <Btn variant="danger" size="sm">Delete account</Btn>
      </Card>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'accounts', label: 'Accounts', icon: '⊕' },
    { id: 'trades', label: 'Trades', icon: '⇄' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.fontBody }}>
      {/* Top nav */}
      <header style={{
        height: '64px', borderBottom: `1px solid ${T.border}`, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        background: T.surface, position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', color: T.accent }}>≋</span>
          <span style={{ fontFamily: T.fontHeading, fontWeight: 800, fontSize: '18px' }}>Ripple</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', borderRadius: T.radiusSm, border: 'none', cursor: 'pointer',
              background: tab === t.id ? T.accentDim : 'transparent',
              color: tab === t.id ? T.accent : T.textSecondary,
              fontFamily: T.fontBody, fontSize: '14px', fontWeight: tab === t.id ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '16px' }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge color={T.accent}>Starter plan</Badge>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: T.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontSize: '14px', fontWeight: 700, fontFamily: T.fontMono }}>
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: T.fontHeading, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {tabs.find(t => t.id === tab)?.label}
          </h1>
          <p style={{ fontSize: '13px', color: T.textSecondary, marginTop: '4px' }}>
            {tab === 'overview' && 'Real-time snapshot of your copy trading operation.'}
            {tab === 'accounts' && 'Manage your master and follower Tradovate accounts.'}
            {tab === 'trades' && 'Full history of copied trades.'}
            {tab === 'settings' && 'Configure copy rules, alerts, and account preferences.'}
          </p>
        </div>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'accounts' && <AccountsTab />}
        {tab === 'trades' && <TradesTab />}
        {tab === 'settings' && <SettingsTab user={user} />}
      </main>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function RippleApp({ onGoToPricing }) {
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('ripple_token');
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUser(data); })
        .catch(() => {});
    }
  }, []);

  if (user) return <Dashboard user={user} />;

  return (
    <>
      <Landing
        onLogin={() => setAuthModal('login')}
        onSignup={() => setAuthModal('signup')}
        onGoToPricing={onGoToPricing}
      />
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={u => { setUser(u); setAuthModal(null); }}
        />
      )}
    </>
  );
}
