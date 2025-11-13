import { useState } from "react";
import { DexScreener } from "./DexScreener";
import { SentimentPanel } from "./SentimentPanel";
import { SearchBar } from "./SearchBar";

interface NotableTweet {
  id: string;
  author: string;
  text: string;
  url: string;
}

interface ResultsViewProps {
  contractAddress: string;
  chain: "solana" | "base" | "bsc";
  onNewSearch: (address: string, chain: "solana" | "base" | "bsc") => void;
  isSearching: boolean;
  isLoading: boolean;
  sentiment?: {
    analysis: string;
    score: number;
    narrative?: string | null;
    notableTweets?: NotableTweet[];
  };
}

export const ResultsView = ({
  contractAddress,
  chain,
  onNewSearch,
  isSearching,
  isLoading,
  sentiment,
}: ResultsViewProps) => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <div className="min-h-screen p-6 space-y-6 animate-in fade-in duration-500">
      {/* Blur overlay and search modal */}
      {showSearchModal && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 animate-in fade-in duration-300" 
            onClick={() => setShowSearchModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl">
              <SearchBar 
                onSearch={(address, chain) => {
                  onNewSearch(address, chain);
                  setShowSearchModal(false);
                }} 
                isExpanded={true}
              />
            </div>
          </div>
        </>
      )}

      {/* Search Bar - click to expand */}
      <div 
        className="max-w-lg mx-auto cursor-pointer"
        onClick={() => setShowSearchModal(true)}
      >
        <SearchBar 
          onSearch={onNewSearch} 
          isExpanded={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DexScreener - 2/3 width */}
        <div className="lg:col-span-2">
          <DexScreener contractAddress={contractAddress} chain={chain} />
        </div>

        {/* Sentiment Panel - 1/3 width */}
        <div className="lg:col-span-1">
          <SentimentPanel isLoading={isLoading} sentiment={sentiment} />
        </div>
      </div>
    </div>
  );
};
