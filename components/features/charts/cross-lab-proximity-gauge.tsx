"use client";

import Link from "next/link";
import { ThresholdGauge } from "./threshold-gauge";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import type { BenchmarkResult } from "@/lib/types/risk-data";

interface CrossLabProximityGaugeProps {
  benchmarkResults: BenchmarkResult[];
}

const LAB_PROXIMITY: Record<string, { proximity: number | null; label: string; path: string }> = {
  openai: { proximity: 0.5, label: "GPT-5", path: "/openai" },
  anthropic: { proximity: 0.77, label: "Claude Opus 4.5", path: "/anthropic" },
  "google-deepmind": { proximity: 0.4, label: "Gemini 3 Pro", path: "/google-deepmind" },
  xai: { proximity: null, label: "Grok 4.1 Fast", path: "/xai" },
};

export function CrossLabProximityGauge({
  benchmarkResults,
}: CrossLabProximityGaugeProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {Object.entries(LAB_PROXIMITY).map(([lab, data]) => {
        const labLabel =
          lab === "google-deepmind"
            ? "Google DeepMind"
            : lab.charAt(0).toUpperCase() + lab.slice(1);

        return (
          <Link key={lab} href={data.path} className="group">
            <div
              className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 ${
                data.proximity === null
                  ? "bg-gray-50 dark:bg-gray-900/50 border-dashed border-gray-300 dark:border-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-800/50"
                  : "group-hover:bg-accent"
              }`}
            >
            <h3 className="text-lg font-semibold mb-4 text-center">{labLabel}</h3>
            {data.proximity !== null ? (
              <div className="w-full flex justify-center">
                <ThresholdGauge thresholdProximity={data.proximity} title={data.label} />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    {data.label}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart
                      cx="50%"
                      cy="70%"
                      innerRadius="80%"
                      outerRadius="100%"
                      startAngle={180}
                      endAngle={0}
                      data={[{ name: "Empty", value: 0, fill: "#d1d5db" }]}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                        fill="#d1d5db"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold text-muted-foreground">
                      —
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Data not disclosed
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
