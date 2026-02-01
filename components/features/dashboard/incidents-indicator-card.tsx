"use client";

import { ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface IncidentsIndicatorCardProps {
  totalIncidents: number;
  lastUpdated: string;
  sourceUrl: string;
}

export function IncidentsIndicatorCard({
  totalIncidents,
  lastUpdated,
  sourceUrl,
}: IncidentsIndicatorCardProps) {
  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 20px rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 1);
          }
          50%, 100% {
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3), inset 0 0 5px rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.5);
          }
        }

        .incident-blink {
          animation: blink 2s infinite;
        }
      `}</style>

      <Card className="incident-blink border-2 border-red-500 bg-red-950/20 hover:bg-red-950/30 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
                <span className="text-sm font-semibold text-red-500">LIVE TRACKER</span>
              </div>

              <div className="mb-4">
                <div className="text-5xl font-bold text-red-500 mb-1">
                  {totalIncidents.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  AI Incidents Documented Globally
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  Last Updated: <span className="font-medium text-foreground">{lastUpdated}</span>
                </p>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 font-medium"
                >
                  View Full Database
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="hidden sm:flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-red-500/10 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                <div className="absolute inset-1 border-2 border-red-500/50 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
