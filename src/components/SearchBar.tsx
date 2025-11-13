import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Chain = "solana" | "base" | "bsc";

interface ChainOption {
  id: Chain;
  name: string;
  logo: string;
}

const CHAINS: ChainOption[] = [
  { id: "base", name: "Base", logo: "https://avatars.githubusercontent.com/u/108554348?s=280&v=4" },
  { id: "solana", name: "Solana", logo: "https://logo.svgcdn.com/token-branded/solana.png" },
  { id: "bsc", name: "BNB Chain", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" },
];

interface SearchBarProps {
  onSearch: (address: string, chain: Chain) => void;
  isExpanded?: boolean;
  className?: string;
}

export const SearchBar = ({ onSearch, isExpanded = true, className = "" }: SearchBarProps) => {
  const [address, setAddress] = useState("");
  // Persist selected chain in localStorage
  const [selectedChain, setSelectedChain] = useState<Chain>(() => {
    const saved = localStorage.getItem('selectedChain');
    return (saved as Chain) || "base";
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Save chain selection to localStorage
  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain);
    localStorage.setItem('selectedChain', chain);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim(), selectedChain);
    }
  };

  const selectedChainData = CHAINS.find(c => c.id === selectedChain) || CHAINS[0];

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative group">
        {/* Chain Selector Dropdown */}
        <div ref={dropdownRef} className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-card hover:bg-accent smooth-transition border border-border/50"
          >
            <img src={selectedChainData.logo} alt={selectedChainData.name} className="w-6 h-6 rounded-full" />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => handleChainSelect(chain.id)}
                  className={`w-full flex items-center justify-center p-3 hover:bg-accent smooth-transition ${
                    selectedChain === chain.id ? "bg-accent" : ""
                  }`}
                >
                  <img src={chain.logo} alt={chain.name} className="w-6 h-6 rounded-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter contract address..."
          className={`w-full pl-24 pr-16 py-4 ${
            isExpanded ? "text-lg" : "text-base"
          } bg-card/50 backdrop-blur-xl border border-border/50 rounded-full 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          placeholder:text-muted-foreground smooth-transition
          hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full 
          bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition
          hover:shadow-lg hover:shadow-primary/30"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
