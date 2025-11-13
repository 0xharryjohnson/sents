import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface NotableTweet {
  id: string;
  author: string;
  text: string;
  url: string;
}

interface SentimentPanelProps {
  isLoading: boolean;
  sentiment?: {
    analysis: string;
    score: number;
    narrative?: string | null;
    notableTweets?: NotableTweet[];
  };
}

export const SentimentPanel = ({ isLoading, sentiment }: SentimentPanelProps) => {
  useEffect(() => {
    // Load Twitter widget script only once
    if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }

    // Reload widgets when sentiment changes
    if (sentiment?.notableTweets && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [sentiment]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center glass rounded-2xl border border-border/50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Analyzing sentiment...</p>
        </div>
      </div>
    );
  }

  if (!sentiment) {
    return (
      <div className="h-full flex items-center justify-center glass rounded-2xl border border-border/50">
        <p className="text-muted-foreground">No sentiment data available</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-500";
    if (score >= 4) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return "🚀";
    if (score >= 6) return "😊";
    if (score >= 4) return "😐";
    if (score >= 2) return "😔";
    return "💀";
  };

  return (
    <div className="h-full glass rounded-2xl border border-border/50 p-6 space-y-6 overflow-auto">
      <div className="space-y-2">
        <h3 className="text-2xl font-light">Sentiment Analysis</h3>
        <div className="flex items-center gap-3">
          <div className="text-4xl font-light">
            {getScoreEmoji(sentiment.score)}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className={`text-3xl font-semibold ${getScoreColor(sentiment.score)}`}>
              {sentiment.score.toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Analysis</h4>
        <p className="text-foreground leading-relaxed">{sentiment.analysis}</p>
      </div>

      {sentiment.narrative && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Narrative</h4>
          <p className="text-foreground leading-relaxed">{sentiment.narrative}</p>
        </div>
      )}

      {sentiment.notableTweets && sentiment.notableTweets.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Notable Tweets</h4>
          {sentiment.notableTweets.map((tweet) => {
            const username = tweet.author.replace('@', '');
            const truncatedText = tweet.text.length > 140
              ? tweet.text.substring(0, 140) + '...'
              : tweet.text;

            return (
              <a
                key={tweet.id}
                href={tweet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 smooth-transition hover:shadow-lg hover:shadow-primary/20 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm font-medium text-primary">@{username}</p>
                  </div>
                  <p className="text-foreground leading-relaxed group-hover:text-foreground/90">
                    {truncatedText}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <span>View on</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
