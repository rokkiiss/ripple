import React, { useState, useEffect } from 'react';
import RippleApp from './ripple';
import PricingPage from './ripple-pricing';

export default function App() {
  const [page, setPage] = useState('app');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/pricing') setPage('pricing');
    else setPage('app');
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.history.pushState({}, '', p === 'pricing' ? '/pricing' : '/');
  };

  if (page === 'pricing') return <PricingPage onBack={() => navigate('app')} />;
  return <RippleApp onGoToPricing={() => navigate('pricing')} />;
}
