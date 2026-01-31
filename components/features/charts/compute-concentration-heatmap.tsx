"use client";

import { Fragment, useMemo } from "react";
import type { ComputeConcentration } from "@/lib/types/risk-data";
import {
  getEntityColor,
  transformToConcentrationHeatmapData,
} from "@/lib/data/compute-infrastructure-transformers";

interface ComputeConcentrationHeatmapProps {
  data: ComputeConcentration[];
}

export function ComputeConcentrationHeatmap({
  data,
}: ComputeConcentrationHeatmapProps) {
  const heatmapData = transformToConcentrationHeatmapData(data);

  const maxCapex2024 = useMemo(
    () => Math.max(...heatmapData.map((d) => d.capex2024)),
    [heatmapData]
  );
  const maxCapex2025 = useMemo(
    () => Math.max(...heatmapData.map((d) => d.capex2025_2026)),
    [heatmapData]
  );
  const maxMarketShare = useMemo(
    () => Math.max(...heatmapData.map((d) => d.marketShare)),
    [heatmapData]
  );

  const getOpacity = (value: number, max: number): number => {
    return 0.3 + (value / max) * 0.7;
  };

  const getHeatColor = (value: number, max: number, metric: string): string => {
    const intensity = value / max;

    if (metric === "marketShare") {
      if (intensity > 0.66) return "#ef4444";
      if (intensity > 0.33) return "#f59e0b";
      return "#10b981";
    }

    if (intensity > 0.66) return "#8b5cf6";
    if (intensity > 0.33) return "#3b82f6";
    return "#06b6d4";
  };

  const totalCapex = data.reduce(
    (sum, d) => sum + d.capex2024 + d.capex2025_2026,
    0
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `200px repeat(3, minmax(140px, 1fr))`,
            }}
          >
            {/* Headers */}
            <div className="font-semibold text-sm p-3 bg-muted/50 rounded-lg">
              Entity
            </div>
            <div className="font-semibold text-sm p-3 bg-muted/50 rounded-lg text-center">
              2024 CapEx ($B)
            </div>
            <div className="font-semibold text-sm p-3 bg-muted/50 rounded-lg text-center">
              2025-2026 CapEx ($B)
            </div>
            <div className="font-semibold text-sm p-3 bg-muted/50 rounded-lg text-center">
              Market Share
            </div>

            {/* Data rows */}
            {heatmapData.map((item, index) => (
              <Fragment key={index}>
                {/* Entity name */}
                <div className="p-3 flex items-center font-medium text-sm bg-muted/30 rounded-lg">
                  {item.entity}
                </div>

                {/* 2024 CapEx cell */}
                <div
                  className="p-3 rounded-lg text-center font-semibold text-sm text-white cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: getHeatColor(
                      item.capex2024,
                      maxCapex2024,
                      "capex"
                    ),
                    opacity: getOpacity(item.capex2024, maxCapex2024),
                  }}
                  title={`$${item.capex2024}B`}
                >
                  ${item.capex2024}B
                </div>

                {/* 2025-2026 CapEx cell */}
                <div
                  className="p-3 rounded-lg text-center font-semibold text-sm text-white cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: getHeatColor(
                      item.capex2025_2026,
                      maxCapex2025,
                      "capex"
                    ),
                    opacity: getOpacity(item.capex2025_2026, maxCapex2025),
                  }}
                  title={`$${item.capex2025_2026}B`}
                >
                  ${item.capex2025_2026}B
                </div>

                {/* Market Share cell */}
                <div
                  className="p-3 rounded-lg text-center font-semibold text-sm text-white cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: getHeatColor(
                      item.marketShare,
                      maxMarketShare,
                      "marketShare"
                    ),
                    opacity: getOpacity(item.marketShare, maxMarketShare),
                  }}
                  title={`${item.marketShare}%`}
                >
                  {item.marketShare}%
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border bg-muted/50">
          <h4 className="font-semibold text-sm mb-3">Total Infrastructure Investment</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">2024 Total:</span>
              <span className="font-semibold">
                ${data.reduce((sum, d) => sum + d.capex2024, 0).toFixed(0)}B
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">2025-2026 Total:</span>
              <span className="font-semibold">
                ${data.reduce((sum, d) => sum + d.capex2025_2026, 0).toFixed(0)}B
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Grand Total:</span>
              <span className="font-bold text-lg">
                ${totalCapex.toFixed(0)}B
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-muted/50">
          <h4 className="font-semibold text-sm mb-3">Market Concentration</h4>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              The data shows increasing concentration of compute resources among
              hyperscalers (Google, Microsoft, Amazon) and AI-native companies
              (OpenAI consortium) in 2025-2026, with CapEx expected to double or
              triple from 2024 levels.
            </p>
            <p className="text-muted-foreground mt-3">
              Regional variations in data center expansion reflect different
              regulatory environments and energy infrastructure availability.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Color Scale Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">CapEx Intensity</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#06b6d4" }} />
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#3b82f6" }} />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#8b5cf6" }} />
              <span className="text-xs">High</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Market Share</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#10b981" }} />
              <span className="text-xs">Low (&lt;15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#f59e0b" }} />
              <span className="text-xs">Medium (15-25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#ef4444" }} />
              <span className="text-xs">High (&gt;25%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
