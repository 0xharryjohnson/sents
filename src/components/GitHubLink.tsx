import { Github } from "lucide-react";

export const GitHubLink = () => {
  return (
    <a
      href="https://github.com/yourusername/sents"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full glass hover:glass-light smooth-transition border border-border/50 hover:border-primary/50 group"
      aria-label="View on GitHub"
    >
      <Github className="w-5 h-5 text-foreground group-hover:text-primary smooth-transition" />
    </a>
  );
};
