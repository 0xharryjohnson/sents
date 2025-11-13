import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());

// Memory Protocol API search function
async function searchTwitter(query: string): Promise<any[]> {
  const MEMORY_PROTOCOL_API_KEY = process.env.MEMORY_PROTOCOL_API_KEY?.trim();

  if (!MEMORY_PROTOCOL_API_KEY) {
    console.error('MEMORY_PROTOCOL_API_KEY not found in environment');
    return [];
  }

  try {
    const url = `https://api.memoryproto.co/twitter/search?query=${encodeURIComponent(query)}`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MEMORY_PROTOCOL_API_KEY}`,
      },
    };

    console.log(`Fetching tweets for query: ${query}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Memory Protocol API error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log(`Received ${data.data?.length || 0} tweets from Memory Protocol`);
    return data.data || [];
  } catch (error) {
    console.error('Error searching Twitter:', error);
    return [];
  }
}

// Analyze sentiment using OpenRouter + DeepSeek
async function analyzeSentiment(tweets: any[], contractAddress: string) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not found in environment');
  }

  const llm = new ChatOpenAI({
    modelName: 'deepseek/deepseek-v3.1-terminus',
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY,
    },
    temperature: 0.7,
  });

  const systemPrompt = `You are a crypto sentiment analyst. Analyze the provided tweets about the token and provide:
1. A sentiment score from 0-10 (0 = extremely bearish, 5 = neutral, 10 = extremely bullish)
2. A concise analysis (2-3 sentences max)
3. The token's narrative/story if you can identify it (e.g., "AI agent", "meme coin", "DeFi protocol", "community takeover", "first of something",etc.)
4. Select 1-2 of the most notable/representative tweets to highlight (return their IDs)

CRITICAL FILTERING RULES - IGNORE these types of tweets for both your analysis and for the highlights:
- Tweets with more than 1 hashtag (spam indicator)
- Engagement bait tweets (e.g., "DM for alpha", "Follow for signals", "Join our group")
- Generic promotional spam with contract addresses
- AI-generated content with no genuine insight
- Tweets that just paste contract addresses without meaningful discussion
- Any tweet asking users to DM, follow, or join for investment advice
- Tweets with obvious pump/dump language without substance

Focus ONLY on genuine sentiment from credible sources with real analysis or community discussion.

For the narrative, look for common themes, use cases, or stories being told about the token. If no clear narrative emerges, return null.

Return your response in this exact JSON format:
{
  "score": <number 0-10>,
  "analysis": "<your analysis>",
  "narrative": "<token narrative or null if unclear>",
  "notableTweetIds": ["<tweet_id_1>", "<tweet_id_2>"]
}`;

  const userPrompt = `Contract Address: ${contractAddress}

Tweets:
${tweets.map((t, i) => `
Tweet ${i + 1} (ID: ${t.id || i}):
Author: ${t.profile?.username || 'Unknown'} (${t.profile?.followersCount || 0} followers)
Content: ${t.text || ''}
`).join('\n---\n')}

Analyze the sentiment and select the most notable tweets.`;

  try {
    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    const content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Get the notable tweets
      const notableTweets = tweets.filter((t, i) => 
        parsed.notableTweetIds?.includes(t.id?.toString() || i.toString())
      ).slice(0, 2);

      return {
        score: parsed.score,
        analysis: parsed.analysis,
        narrative: parsed.narrative || null,
        notableTweets: notableTweets.map(t => ({
          id: t.id,
          author: t.profile?.username || 'Unknown',
          text: t.text || '',
          url: t.url || `https://twitter.com/${t.profile?.username}/status/${t.id}`,
        })),
      };
    }

    // Fallback if JSON parsing fails
    return {
      score: 5,
      analysis: content.substring(0, 200),
      narrative: null,
      notableTweets: [],
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
}

// Main analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { contractAddress } = req.body;

    if (!contractAddress) {
      return res.status(400).json({ error: 'Contract address is required' });
    }

    console.log(`Analyzing sentiment for: ${contractAddress}`);

    // Search Twitter using Memory Protocol
    const tweets = await searchTwitter(contractAddress);

    if (tweets.length === 0) {
      return res.json({
        score: 5,
        analysis: 'No tweets found for this contract address. This could indicate low social media presence.',
        narrative: null,
        notableTweets: [],
      });
    }

    console.log(`Found ${tweets.length} tweets`);

    // Analyze sentiment
    const result = await analyzeSentiment(tweets, contractAddress);

    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ 
      error: 'Failed to analyze sentiment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Memory Protocol API Key: ${process.env.MEMORY_PROTOCOL_API_KEY ? 'Set' : 'Missing'}`);
  console.log(`OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? 'Set' : 'Missing'}`);
});
