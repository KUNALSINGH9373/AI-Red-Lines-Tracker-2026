import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6" />
            <span>AI Red Lines Tracker</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/ai-red-line-analysis"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              RED30 Model Risk Analysis
            </Link>
            <span className="text-foreground/30">•</span>
            <Link
              href="/frontier-labs"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              Frontier Labs Risk Analysis
            </Link>
            <span className="text-foreground/30">•</span>
            <Link
              href="/ai-rnd"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              AI R&D Tracker
            </Link>
            <Link
              href="/compute-infrastructure"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              Global Compute Infrastructure
            </Link>
            <span className="text-foreground/30">•</span>
            <Link
              href="/ai-incidents"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              AI Incidents
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
