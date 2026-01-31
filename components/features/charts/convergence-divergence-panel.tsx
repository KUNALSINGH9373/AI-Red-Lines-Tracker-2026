"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import type { ConvergenceDivergence } from "@/lib/types/risk-data";

interface ConvergenceDivergencePanelProps {
  data: ConvergenceDivergence;
}

export function ConvergenceDivergencePanel({
  data,
}: ConvergenceDivergencePanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold">Areas of Convergence</h3>
        </div>
        <div className="space-y-3">
          {data.convergence.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20"
            >
              <p className="text-sm text-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Areas of Divergence</h3>
        </div>
        <div className="space-y-3">
          {data.divergence.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
            >
              <p className="text-sm text-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
