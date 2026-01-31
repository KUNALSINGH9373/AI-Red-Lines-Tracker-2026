"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { transformToRadarData } from "@/lib/data/chart-transformers";
import { CHART_COLORS } from "@/lib/constants/thresholds";
import type { RiskAssessment, Model } from "@/lib/types/risk-data";

interface RiskCategoryRadarProps {
  assessments: RiskAssessment[];
  getModelColor?: (modelId: string) => string;
  getModelById?: (modelId: string) => Model | undefined;
}

export function RiskCategoryRadar({
  assessments,
  getModelColor = (modelId) => {
    return CHART_COLORS[modelId as keyof typeof CHART_COLORS] || "#6b7280";
  },
  getModelById = (modelId) => undefined,
}: RiskCategoryRadarProps) {
  if (assessments.length === 0) return null;

  const radarData = transformToRadarData(assessments[0]);

  const allModelsData = assessments.reduce((acc, assessment) => {
    const data = transformToRadarData(assessment);
    data.forEach((item, index) => {
      if (!acc[index]) {
        acc[index] = { category: item.category, fullMark: 100 };
      }
      acc[index][assessment.modelId] = item.value;
    });
    return acc;
  }, [] as any[]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={allModelsData}>
        <PolarGrid className="stroke-muted" />
        <PolarAngleAxis dataKey="category" className="text-xs" />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          className="text-xs"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="text-sm font-medium mb-2">
                  {payload[0].payload.category}
                </p>
                {payload.map((entry: any) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.name}:</span>
                    <span className="font-medium">{entry.value.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend />
        {assessments.map((assessment, index) => {
          const model = getModelById(assessment.modelId);
          const modelName = model?.name || assessment.modelId;
          return (
            <Radar
              key={assessment.modelId}
              name={modelName}
              dataKey={assessment.modelId}
              stroke={getModelColor(assessment.modelId)}
              fill={getModelColor(assessment.modelId)}
              fillOpacity={0.2 + index * 0.1}
            />
          );
        })}
      </RadarChart>
    </ResponsiveContainer>
  );
}
