import React, { useState } from 'react';
import { T } from './tokens';

const Btn = ({ children, variant = 'primary', onClick, style, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const sizes = { sm: '8px 16px', md: '12px 24px', lg: '16px 36px' };
  const base = {
    padding: sizes[size], borderRadius: T.radiusSm, border: 'none',
    cursor: 'pointer', fontFamily: T.fontBody, fontWeight: 600,
    fontSize: size === 'lg' ? '16px' : '14px', transition: 'all 0.15s',
    display: 'inline-flex', alignItems: 'center', gap: '8px',
  };
  const variants = {
    primary: { background: hover ? '#5affed' : T.accent, color: '#000' },
    secondary: { background: hover ? T.accentDim : 'transparent', color: T.accent, border: `1px solid ${T.accent}` },
    ghost: { background: hover ? T.surfaceHover : 'transparent', color: T.textSecondary, border: `1px solid ${T.border}` },
    blue: { background: hover ? '#6aaeff' : T.blue, color: '#000' },
    gold: { background: hover ? '#ffd27a' : T.gold, color: '#000' },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Check = ({ color = T.accent }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={color + '22'} />
    <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const X = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={T.border} />
    <path d="M6 6l4 4M10 6l-4 4" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const plans = [
  {
    name: 'Starter',
    monthly: 45,
    annual: 41,
    annualTotal: 486,
    color: T.accent,
    variant: 'secondary',
    connections: 2,
    followersPerConn: 10,
    totalFollowers: 20,
    features: ['2 master connections', '10 followers per connection', 'Real-time copy engine', 'Per-follower scaling', 'Dashboard + trade history', 'Email support'],
  },
  {
    name: 'Pro',
    monthly: 89,
    annual: 80,
    annualTotal: 961,
    color: T.blue,
    variant: 'blue',
    connections: 4,
    followersPerConn: 20,
    totalFollowers: 80,
    popular: true,
    features: ['4 master connections', '20 followers per connection', 'Real-time copy engine', 'Per-follower scaling', 'Dashboard + trade history', 'Risk controls + alerts', 'Priority support', 'Telegram notifications'],
  },
  {
    name: 'Flex',
    monthly: 129,
    annual: 116,
    annualTotal: 1393,
    color: T.gold,
    variant: 'gold',
    connections: '∞',
    followersPerConn: '∞',
    totalFollowers: 120,
    features: ['Unlimited master connections', '120 followers total', 'Real-time copy engine', 'Per-follower scaling', 'Dashboard + trade history', 'Risk controls + alerts', 'Dedicated support', 'Telegram + email notifications', 'API access (coming soon)'],
  },
];

const comparisonRows = [
  { label: 'Master connections', starter: '2', pro: '4', flex: 'Unlimited' },
  { label: 'Followers per connection', starter: '10', pro: '20', flex: 'Unlimited' },
  { label: 'Total follower accounts', starter: '20', pro: '80', flex: '120' },
  { label: 'Copy latency', starter: '< 50ms', pro: '< 50ms', flex: '< 50ms' },
  { label: 'Per-follower scale factor', starter: true, pro: true, flex: true },
  { label: 'Live dashboard', starter: true, pro: true, flex: true },
  { label: 'Trade history', starter: true, pro: true, flex: true },
  { label: 'Risk controls', starter: false, pro: true, flex: true },
  { label: 'Email alerts', starter: true, pro: true, flex: true },
  { label: 'Telegram alerts', starter: false, pro: true, flex: true },
  { label: 'Desktop app (Electron)', starter: true, pro: true, flex: true },
  { label: 'Priority support', starter: false, pro: true, flex: true },
  { label: 'API access', starter: false, pro: false, flex: '(coming soon)' },
];

const faqs = [
  {
    q: 'How does Ripple connect to my Tradovate account?',
    a: 'Via Tradovate\'s official OAuth flow. You click "Connect", authorize Ripple on Tradovate\'s own website, and we receive an encrypted access token. Your password never touches our servers.',
  },
  {
    q: 'What does "per-follower scale factor" mean?',
    a: 'Each follower account can have its own multiplier. A scale of 1.0× mirrors the master exactly. 0.5× trades half the size, 2.0× doubles it. This lets followers manage their own risk exposure.',
  },
  {
    q: 'How fast are trades copied?',
    a: 'We listen to your master account via a persistent WebSocket connection. When a fill is detected, follower orders fire within ~50ms. Network latency to Tradovate\'s servers is the main variable.',
  },
  {
    q: 'Can I pause copying without disconnecting?',
    a: 'Yes. You can pause and resume copying per follower account at any time from the dashboard. You can also set a daily max loss limit that auto-pauses a follower when breached.',
  },
  {
    q: 'What happens if I cancel my subscription?',
    a: 'Your account and all connected accounts remain accessible until the end of the billing period. After that, copying stops and your encrypted tokens are deleted.',
  },
  {
    q: 'Is there a free trial?',
    a: '7 days, no credit card required. You get full access to all Starter plan features during the trial.',
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        textAlign: 'left', gap: '16px',
      }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: T.textPrimary, fontFamily: T.fontBody }}>{q}</span>
        <span style={{ color: T.accent, fontSize: '20px', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7, paddingBottom: '20px', paddingRight: '24px' }}>{a}</p>
      )}
    </div>
  );
};

export default function PricingPage({ onBack }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.textPrimary, fontFamily: T.fontBody }}>
      {/* Nav */}
      <nav style={{
        height: '64px', borderBottom: `1px solid ${T.border}`, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
        background: T.surface,
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: '10px', background: 'none',
          border: 'none', cursor: 'pointer', color: T.textPrimary,
        }}>
          <span style={{ fontSize: '24px', color: T.accent }}>≋</span>
          <span style={{ fontFamily: T.fontHeading, fontWeight: 800, fontSize: '20px' }}>Ripple</span>
        </button>
        <button onClick={onBack} style={{
          background: 'none', border: `1px solid ${T.border}`, color: T.textSecondary,
          padding: '8px 16px', borderRadius: T.radiusSm, cursor: 'pointer', fontSize: '13px', fontFamily: T.fontBody,
        }}>← Back</button>
      </nav>

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{
          display: 'inline-flex', background: T.accentDim, color: T.accent,
          border: `1px solid ${T.accent}44`, borderRadius: '99px', padding: '4px 14px',
          fontSize: '12px', fontFamily: T.fontMono, fontWeight: 600, letterSpacing: '0.06em',
          marginBottom: '24px',
        }}>10% cheaper than TradeSyncer</div>
        <h1 style={{
          fontFamily: T.fontHeading, fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px',
        }}>Simple, transparent pricing</h1>
        <p style={{ color: T.textSecondary, fontSize: '18px', marginBottom: '40px' }}>
          Start free. No credit card. Cancel any time.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '99px', padding: '6px 6px 6px 16px' }}>
          <span style={{ fontSize: '14px', color: annual ? T.textSecondary : T.textPrimary, fontWeight: annual ? 400 : 600 }}>Monthly</span>
          <div onClick={() => setAnnual(!annual)} style={{
            width: '48px', height: '28px', borderRadius: '99px', background: annual ? T.accent : T.border,
            position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: '4px', left: annual ? '24px' : '4px',
              width: '20px', height: '20px', borderRadius: '50%',
              background: annual ? '#000' : T.textSecondary, transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: '14px', color: annual ? T.textPrimary : T.textSecondary, fontWeight: annual ? 600 : 400 }}>Annual</span>
          <div style={{ background: T.gold + '22', color: T.gold, border: `1px solid ${T.gold}44`, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontFamily: T.fontMono, fontWeight: 700 }}>Save 10%</div>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: T.surface, border: `2px solid ${plan.popular ? plan.color : T.border}`,
              borderRadius: T.radiusLg, padding: '32px',
              boxShadow: plan.popular ? `0 0 48px ${plan.color}22` : 'none',
              position: 'relative',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: '#000', borderRadius: '99px',
                  padding: '4px 14px', fontSize: '11px', fontFamily: T.fontMono, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>Most popular</div>
              )}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: T.fontHeading, fontSize: '22px', fontWeight: 800, marginBottom: '4px', color: plan.color }}>{plan.name}</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '12px' }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: '48px', fontWeight: 700, color: T.textPrimary, lineHeight: 1 }}>
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span style={{ color: T.textSecondary, fontSize: '16px' }}>/mo</span>
                </div>
                {annual && (
                  <p style={{ fontSize: '13px', color: T.textMuted, marginTop: '4px', fontFamily: T.fontMono }}>
                    ${plan.annualTotal}/year · billed annually
                  </p>
                )}
                <p style={{ fontSize: '13px', color: T.textSecondary, marginTop: '12px' }}>
                  {typeof plan.connections === 'number' ? plan.connections : plan.connections} connections · {plan.totalFollowers} followers total
                </p>
              </div>

              <Btn variant={plan.variant} onClick={() => {}} style={{ width: '100%', justifyContent: 'center', marginBottom: '28px' }}>
                Start free trial
              </Btn>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check color={plan.color} />
                    <span style={{ fontSize: '14px', color: T.textSecondary }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ padding: '0 24px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.02em' }}>
          Full comparison
        </h2>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', color: T.textMuted, fontWeight: 500 }}>Feature</th>
                {['Starter', 'Pro', 'Flex'].map((name, i) => (
                  <th key={name} style={{ padding: '16px 20px', textAlign: 'center', fontFamily: T.fontHeading, fontSize: '15px', fontWeight: 700, color: [T.accent, T.blue, T.gold][i] }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? 'transparent' : T.bg + '88' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: T.textSecondary }}>{row.label}</td>
                  {['starter', 'pro', 'flex'].map((plan, pi) => {
                    const val = row[plan];
                    const colors = [T.accent, T.blue, T.gold];
                    return (
                      <td key={plan} style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {val === true ? <div style={{ display: 'flex', justifyContent: 'center' }}><Check color={colors[pi]} /></div>
                          : val === false ? <div style={{ display: 'flex', justifyContent: 'center' }}><X /></div>
                            : <span style={{ fontSize: '13px', fontFamily: T.fontMono, color: colors[pi], fontWeight: 600 }}>{val}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 80px', maxWidth: '720px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          FAQ
        </h2>
        {faqs.map(f => <FaqItem key={f.q} {...f} />)}
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${T.accentDim} 0%, transparent 70%)`,
      }}>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Ready to start copying?
        </h2>
        <p style={{ color: T.textSecondary, fontSize: '16px', marginBottom: '36px' }}>
          7-day free trial. No credit card. Cancel any time.
        </p>
        <Btn variant="primary" size="lg" onClick={onBack} style={{ fontSize: '16px' }}>
          Get started free →
        </Btn>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.border}`, padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', color: T.accent }}>≋</span>
          <span style={{ fontFamily: T.fontHeading, fontWeight: 700 }}>Ripple</span>
        </div>
        <p style={{ fontSize: '12px', color: T.textMuted, textAlign: 'center' }}>
          Not affiliated with Tradovate or Ripple Labs · ripple.trade
        </p>
        <p style={{ fontSize: '12px', color: T.textMuted }}>© 2025 Ripple. All rights reserved.</p>
      </footer>
    </div>
  );
}
