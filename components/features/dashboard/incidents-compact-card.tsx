"use client";

import { useState } from "react";
import { ExternalLink, AlertCircle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

      <div className="w-full space-y-4">
        {/* Main Indicator Card - Compact */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <Card className="incident-blink-compact border-2 border-red-500 bg-red-950/30 hover:bg-red-950/40 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-red-500 mb-1">Recent AI Incidents</p>
                              <p className="text-2xl font-bold text-red-500">{totalIncidents.toLocaleString()}</p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-red-500/20 text-xs text-muted-foreground">
                          <span>Updated: {lastUpdated}</span>
                          <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Database
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs bg-red-900 text-white border-red-700">
                  <p className="text-sm">
                    Malaysian Teenager Allegedly Arrested for Creating and Selling AI-Generated Deepfake Images of Schoolmates and Alumni in Johor
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Expanded Incidents List - Grid Layout */}
        {expanded && (
          <Card className="border-red-500/30 bg-red-950/10">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-red-500 mb-4">Incidents by Organization</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-2 rounded-lg border border-red-500/30 bg-red-950/40 hover:bg-red-500/10 transition-all cursor-help hover:border-red-500/60"
                    title={`${incident.totalIncidents} incidents involving ${incident.name}`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span className="text-xs font-medium text-foreground leading-tight line-clamp-2">
                        {incident.name}
                      </span>
                      <span className="text-sm font-bold text-red-500 bg-red-500/30 px-1.5 py-0.5 rounded text-center w-full">
                        {incident.totalIncidents}
                      </span>
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
