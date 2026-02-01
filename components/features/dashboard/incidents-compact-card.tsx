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

      <div className="w-full">
        {/* Two Column Layout - Incidents Count + Organizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Indicator Card */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer lg:col-span-1">
                  <Card className="incident-blink-compact border-2 border-red-500 bg-red-950/30 hover:bg-red-950/40 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        <div>
                          <p className="text-xs font-semibold text-red-500 mb-2">Recent AI Incidents</p>
                          <p className="text-3xl font-bold text-red-500">{totalIncidents.toLocaleString()}</p>
                        </div>
                        <div className="w-full pt-4 border-t border-red-500/20 space-y-2 text-xs text-muted-foreground">
                          <div>{incidents.length} Organizations Tracked</div>
                          <div>Updated: {lastUpdated}</div>
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

          {/* Right Column - Incidents by Organization */}
          <Card className="border-red-500/30 bg-red-950/10 lg:col-span-2">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-red-500 mb-4">Incidents by Organization</h3>
              <TooltipProvider>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {incidents.map((incident) => (
                    <Tooltip key={incident.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2 rounded-lg border-2 border-red-400 dark:border-red-500/60 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-500/10 transition-all cursor-help">
                          <div className="flex flex-col items-center gap-2 text-center">
                            <span className="text-xs font-bold text-red-900 dark:text-foreground leading-tight line-clamp-2">
                              {incident.name}
                            </span>
                            <span className="text-sm font-bold text-white bg-red-500 px-1.5 py-0.5 rounded text-center w-full">
                              {incident.totalIncidents}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="max-w-xs bg-red-900 text-white border-red-700">
                        <p className="text-sm">
                          {incident.totalIncidents} incidents involving {incident.name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
