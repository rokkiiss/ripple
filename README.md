# Ripple ≋

> One trade. Infinite ripples.

Cloud-based copy trading service for Tradovate. Mirror one master account to unlimited follower accounts in real time.

---

## Project Structure

```
ripple/
├── client/          # React frontend
├── server/          # Node.js + Express backend
└── electron/        # Electron desktop wrapper
```

## Quick Start

### Backend
```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### Desktop App
```bash
cd electron
npm install
npm start
```

## Stack
- **Frontend**: React (JSX), inline styles, design tokens
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JWT (Ripple) + OAuth (Tradovate)
- **Encryption**: AES-256-GCM for stored tokens
- **Desktop**: Electron

## Disclaimer
Not affiliated with Tradovate or Ripple Labs.
