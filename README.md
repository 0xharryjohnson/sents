# Sents - Token Sentiment Analysis

- AI-powered X sentiment analysis for tokens across Base, Solana, and BNB.
- Leverages Memory Protocol's API to save ~99.62% on X API costs!

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure API keys:**
   - Edit the `.env.local` file and add your API keys:
     - `MEMORY_PROTOCOL_API_KEY` from [memoryproto.co](https://memoryproto.co)
     - `OPENROUTER_API_KEY` from [openrouter.ai](https://openrouter.ai)

3. **Run the app:**
```bash
npm run dev
```

This will start both the frontend (http://localhost:8080) and backend (http://localhost:3001) automatically.

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Express + TypeScript
- LangChain
- OpenRouter (DeepSeek v3.1 model, feel free to modify)
- Memory Protocol API

## How It Works

1. User enters a token contract address (Base, Solana, BNB)
2. Memory Protocol searches X (Twitter) for token mentions
3. AI agent filters spam/low-quality posts
4. DeepSeek analyzes sentiment and selects notable tweets
5. Returns sentiment score (0-10) and detailed analysis

## Development

- Frontend runs on port 8080
- Backend runs on port 3001
- API requests are proxied from frontend to backend via `/api`

See `backend/README.md` for backend details.

## Environment Variables

Required variables in `.env.local`:
- `MEMORY_PROTOCOL_API_KEY` - Memory Protocol API key
- `OPENROUTER_API_KEY` - OpenRouter API key
- `BACKEND_PORT` - Backend port (optional, defaults to 3001)

## Improvement Possibilities
- Add more chains
- Add more data sources (e.g., Farcaster, Telegram)
- Improve AI filtering and prompting
- Notable accounts/KOLs database for highlights
- Buy/Sell integration
