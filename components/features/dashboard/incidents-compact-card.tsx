"use client";

import { useState } from "react";
import { ExternalLink, AlertCircle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Incident } from "@/lib/data/ai-incidents-data";

interface IncidentsCompactCardProps {
  totalIncidents: number;
  lastUpdated: string;
  sourceUrl: string;
  incidents: Incident[];
  defaultExpanded?: boolean;
}

export function IncidentsCompactCard({
  totalIncidents,
  lastUpdated,
  sourceUrl,
  incidents,
  defaultExpanded = false,
}: IncidentsCompactCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% {
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
            border-color: rgba(239, 68, 68, 1);
          }
          50%, 100% {
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.5);
          }
        }

        .incident-blink-compact {
          animation: blink 2s infinite;
        }
      `}</style>

      <div className="w-full max-w-sm space-y-3">
        {/* Main Indicator Card */}
        <Card className="incident-blink-compact border-2 border-red-500 bg-red-950/30 hover:bg-red-950/40 transition-colors cursor-pointer"
          onClick={() => setExpanded(!expanded)}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-red-500">LIVE</span>
                </div>

                <div className="mb-3">
                  <div className="text-3xl font-bold text-red-500">
                    {totalIncidents.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI Incidents
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">
                    Updated: <span className="font-medium">{lastUpdated}</span>
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </div>

            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 font-medium text-xs mt-3"
              onClick={(e) => e.stopPropagation()}
            >
              Database
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        {/* Expanded Incidents List */}
        {expanded && (
          <Card className="border-red-500/30 bg-red-950/10">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-sm mb-3 text-red-500">
                Top Organizations
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-help group"
                    title={`${incident.totalIncidents} incidents involving ${incident.name}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {incident.name}
                      </span>
                      <span className="text-xs font-bold text-red-500 bg-red-500/20 px-2 py-1 rounded">
                        {incident.totalIncidents}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                      <div>🔧 Dev: {incident.incidentsAsDeveloper}</div>
                      <div>⚙️ Deploy: {incident.incidentsAsDeployer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
