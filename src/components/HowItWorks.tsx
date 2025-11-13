import { HelpCircle, X } from "lucide-react";
import { useState } from "react";

export const HowItWorks = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card smooth-transition border border-border/50 hover:border-primary/50 shadow-lg"
        aria-label="How it works"
      >
        <HelpCircle className="w-5 h-5 text-foreground" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full space-y-6 border border-border shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-light text-foreground">How It Works</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-accent smooth-transition"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">Search Contract</p>
                  <p className="text-sm text-muted-foreground">
                    Enter any token contract address (any chain)
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <p className="font-medium text-foreground">AI Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI scans X for sentiment about the token
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <p className="font-medium text-foreground">Get Insights</p>
                  <p className="text-sm text-muted-foreground">
                    View detailed sentiment analysis and charts
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};
