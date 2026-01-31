import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              Tracking AI model capabilities against critical risk thresholds
              using official system cards and preparedness frameworks.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://openai.com/preparedness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  OpenAI Preparedness Framework
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://openai.com/safety/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  OpenAI Safety Hub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Data Sources</h3>
            <p className="text-sm text-muted-foreground">
              All data sourced from official OpenAI system cards and
              documentation. Last updated: January 2026.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built for transparency and informed discussion about AI safety
            thresholds.
          </p>
        </div>
      </div>
    </footer>
  );
}
