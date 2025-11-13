import { SearchBar } from "./SearchBar";

interface LandingSearchProps {
  onSearch: (address: string, chain: "solana" | "base" | "bsc") => void;
}

export const LandingSearch = ({ onSearch }: LandingSearchProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-light tracking-tight text-primary">
            Sents
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Token sentiment analysis powered by AI
          </p>
        </div>
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};
