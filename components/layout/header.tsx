import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6" />
            <span>AI Red Lines Tracker</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/openai"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              OpenAI
            </Link>
            <Link
              href="/anthropic"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Anthropic
            </Link>
            <Link
              href="/google-deepmind"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Google DeepMind
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
