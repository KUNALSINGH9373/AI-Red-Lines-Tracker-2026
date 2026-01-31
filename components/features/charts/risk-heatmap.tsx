"use client";

import { Fragment } from "react";
import type { Model, RiskCategory, RiskAssessment } from "@/lib/types/risk-data";
import { transformToHeatmapData } from "@/lib/data/chart-transformers";

interface RiskHeatmapProps {
  assessments: RiskAssessment[];
  models: Model[];
  categories: RiskCategory[];
  onCellClick?: (modelId: string, categoryId: string) => void;
  getRiskLevelColor?: (level: string) => string;
}

export function RiskHeatmap({
  assessments,
  models,
  categories,
  onCellClick,
  getRiskLevelColor = (level) => {
    const colors: Record<string, string> = {
      "low": "#10b981",
      "medium": "#f59e0b",
      "high": "#ef4444",
      "critical": "#991b1b",
      "asl-1": "#10b981",
      "asl-2": "#f59e0b",
      "asl-3": "#ef4444",
      "asl-4": "#991b1b",
      "below-alert": "#10b981",
      "alert": "#f59e0b",
      "ccl-met": "#ef4444",
      "ccl-exceeded": "#991b1b",
    };
    return colors[level] || "#6b7280";
  },
}: RiskHeatmapProps) {
  const heatmapData = transformToHeatmapData(assessments, models, categories);

  const getCellOpacity = (score: number): number => {
    return 0.3 + score * 0.7;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="grid gap-2" style={{ gridTemplateColumns: `150px repeat(${categories.length}, minmax(120px, 1fr))` }}>
          <div className="font-medium text-sm"></div>
          {categories.map((category) => (
            <div
              key={category.id}
              className="font-medium text-sm text-center p-2"
            >
              {category.name}
            </div>
          ))}

          {models.map((model) => (
            <Fragment key={model.id}>
              <div
                className="font-medium text-sm p-2 flex items-center"
              >
                {model.name}
              </div>
              {categories.map((category) => {
                const cell = heatmapData.find(
                  (d) => d.modelId === model.id && d.categoryId === category.id
                );
                return (
                  <div
                    key={`${model.id}-${category.id}`}
                    className="relative rounded-lg border p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: getRiskLevelColor(cell?.riskLevel || "low"),
                      opacity: getCellOpacity(cell?.score || 0),
                    }}
                    onClick={() => onCellClick?.(model.id, category.id)}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-white capitalize">
                        {cell?.riskLevel || "low"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
