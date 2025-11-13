# Sents Backend

TypeScript backend for token sentiment analysis using AI.

## How It Works

1. **Memory Protocol API** searches X (Twitter) for mentions of the token
2. **LangChain** orchestrates the agent workflow
3. **OpenRouter + DeepSeek v3.1** analyzes sentiment and selects notable tweets
4. Returns sentiment score (0-10) and analysis

## Setup

The backend is already integrated with the frontend. Just:

1. Copy `.env.local` and add your API keys:
   - `MEMORY_PROTOCOL_API_KEY` - Get from https://memoryproto.co
   - `OPENROUTER_API_KEY` - Get from https://openrouter.ai

2. Run the project:
```bash
npm install
npm run dev
```

This will start both the frontend (port 8080) and backend (port 3001) simultaneously.

## API Endpoints

- `POST /api/analyze` - Analyze sentiment for a contract address
  - Body: `{ "contractAddress": "your_contract_address" }`
  - Returns: `{ "score": 7.5, "analysis": "...", "notableTweets": [...] }`

- `GET /api/health` - Health check
