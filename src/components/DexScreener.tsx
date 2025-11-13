import { useEffect, useState } from "react";

interface DexScreenerProps {
  contractAddress: string;
}

export const DexScreener = ({ contractAddress }: DexScreenerProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-border/50 shadow-lg">
      <style>{`
        #dexscreener-embed { position: relative; width: 100%; padding-bottom: 125%; }
        @media(min-width:1400px) { #dexscreener-embed { padding-bottom: 65%; } }
        #dexscreener-embed iframe { position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: 0; }
      `}</style>
      <div id="dexscreener-embed">
        <iframe
          src={`https://dexscreener.com/solana/${contractAddress}?embed=1&loadChartSettings=0&trades=0&chartLeftToolbar=0&chartTheme=${theme}&theme=${theme}&chartStyle=1&chartType=marketCap&interval=5`}
          title="DexScreener Chart"
        />
      </div>
    </div>
  );
};
