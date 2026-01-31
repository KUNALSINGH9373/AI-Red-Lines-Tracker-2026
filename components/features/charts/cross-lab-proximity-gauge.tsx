"use client";

import { ThresholdGauge } from "./threshold-gauge";
import type { BenchmarkResult } from "@/lib/types/risk-data";

interface CrossLabProximityGaugeProps {
  benchmarkResults: BenchmarkResult[];
}

const LAB_PROXIMITY: Record<string, { proximity: number; label: string }> = {
  openai: { proximity: 0.5, label: "GPT-5" },
  anthropic: { proximity: 0.77, label: "Claude Opus 4.5" },
  "google-deepmind": { proximity: 0.4, label: "Gemini 3 Pro" },
};

export function CrossLabProximityGauge({
  benchmarkResults,
}: CrossLabProximityGaugeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(LAB_PROXIMITY).map(([lab, data]) => {
        const labLabel =
          lab === "google-deepmind"
            ? "Google DeepMind"
            : lab.charAt(0).toUpperCase() + lab.slice(1);

        return (
          <div key={lab} className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">{labLabel}</h3>
            <div className="w-full">
              <ThresholdGauge thresholdProximity={data.proximity} title={data.label} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
