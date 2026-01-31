"use client";

import { Badge } from "@/components/ui/badge";
import type { BenchmarkResult } from "@/lib/types/risk-data";

interface METRBenchmarkTableProps {
  results: BenchmarkResult[];
}

const MODEL_NAMES: Record<string, string> = {
  "claude-opus-4.5": "Claude Opus 4.5",
  "gpt-5-preview": "GPT-5 (Preview)",
  "gemini-3-pro": "Gemini 3 Pro",
};

const LAB_BADGE_COLORS: Record<string, string> = {
  openai: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  anthropic: "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
  "google-deepmind":
    "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
};

export function METRBenchmarkTable({ results }: METRBenchmarkTableProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={`${result.lab}-${result.modelId}`}
          className="p-4 rounded-lg border"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Model
              </h4>
              <p className="font-semibold">
                {MODEL_NAMES[result.modelId as keyof typeof MODEL_NAMES] ||
                  result.modelId}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Lab
              </h4>
              <Badge
                variant="outline"
                className={
                  LAB_BADGE_COLORS[result.lab as keyof typeof LAB_BADGE_COLORS]
                }
              >
                {result.lab === "google-deepmind"
                  ? "Google DeepMind"
                  : result.lab.charAt(0).toUpperCase() + result.lab.slice(1)}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Time to Complete
              </h4>
              <p className="font-mono text-sm">{result.timeToComplete}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Success Rate
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-green-500 dark:bg-green-600"
                    style={{ width: `${result.successRate * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {(result.successRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Notes
              </h4>
              <p className="text-sm text-muted-foreground">
                {result.notes || "—"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
