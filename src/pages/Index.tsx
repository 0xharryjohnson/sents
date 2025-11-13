import { useState } from "react";
import { LandingSearch } from "@/components/LandingSearch";
import { ResultsView } from "@/components/ResultsView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HowItWorks } from "@/components/HowItWorks";
import { GitHubLink } from "@/components/GitHubLink";
import { toast } from "@/hooks/use-toast";

type AppState = "landing" | "loading" | "results";

interface NotableTweet {
  id: string;
  author: string;
  text: string;
  url: string;
}

interface SentimentData {
  analysis: string;
  score: number;
  narrative?: string | null;
  notableTweets?: NotableTweet[];
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [contractAddress, setContractAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState<"solana" | "base" | "bsc">("base");
  const [isSearching, setIsSearching] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentData>();
  const [isChartReady, setIsChartReady] = useState(false);

  const fetchSentiment = async (address: string): Promise<SentimentData> => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractAddress: address }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze sentiment');
    }

    return response.json();
  };

  const handleInitialSearch = async (address: string, chain: "solana" | "base" | "bsc") => {
    setContractAddress(address);
    setSelectedChain(chain);
    setAppState("loading");
    setIsChartReady(false);
    
    // Show chart immediately
    setTimeout(() => {
      setIsChartReady(true);
      setAppState("results");
    }, 100);
    
    // Fetch sentiment in background
    try {
      const data = await fetchSentiment(address);
      setSentiment(data);
    } catch (error) {
      console.error('Error fetching sentiment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze sentiment",
        variant: "destructive",
      });
    }
  };

  const handleNewSearch = async (address: string, chain: "solana" | "base" | "bsc") => {
    setIsSearching(true);
    setContractAddress(address);
    setSelectedChain(chain);
    setSentiment(undefined);
    
    try {
      const data = await fetchSentiment(address);
      setSentiment(data);
    } catch (error) {
      console.error('Error fetching sentiment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze sentiment",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background smooth-transition">
      <ThemeToggle />
      <GitHubLink />
      <HowItWorks />
      
      {appState === "landing" && (
        <LandingSearch onSearch={handleInitialSearch} />
      )}

      {(appState === "loading" || appState === "results") && (
        <ResultsView
          contractAddress={contractAddress}
          chain={selectedChain}
          onNewSearch={handleNewSearch}
          isSearching={isSearching}
          isLoading={!sentiment}
          sentiment={sentiment}
        />
      )}
    </div>
  );
};

export default Index;
