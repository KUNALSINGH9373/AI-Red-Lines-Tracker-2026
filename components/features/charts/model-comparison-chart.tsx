"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { transformToComparisonData } from "@/lib/data/chart-transformers";
import type { RiskAssessment } from "@/lib/types/risk-data";

interface ModelComparisonChartProps {
  assessments: RiskAssessment[];
  categoryId?: string;
  onBarClick?: (data: any) => void;
  getRiskLevelColor?: (level: string) => string;
}

export function ModelComparisonChart({
  assessments,
  categoryId,
  onBarClick,
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
}: ModelComparisonChartProps) {
  const comparisonData = transformToComparisonData(assessments);

  const filteredData = categoryId
    ? comparisonData.filter((d) => d.categoryId === categoryId)
    : comparisonData;

  const groupedData = filteredData.reduce((acc, item) => {
    const key = categoryId ? item.modelName : `${item.modelName} - ${item.categoryName}`;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        displayName: categoryId ? item.modelName : `${item.modelName}\n${item.categoryName}`,
        score: item.score,
        riskLevel: item.riskLevel,
        modelId: item.modelId,
        categoryId: item.categoryId,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(groupedData);

  return (
    <ResponsiveContainer width="100%" height={categoryId ? 400 : 600}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: categoryId ? 60 : 120 }}
        onClick={onBarClick}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="displayName"
          angle={categoryId ? -45 : -90}
          textAnchor={categoryId ? "end" : "end"}
          height={categoryId ? 80 : 120}
          className="text-xs"
          tick={{ fontSize: categoryId ? 12 : 10 }}
          interval={0}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          className="text-xs"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload;
            return (
              <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="text-sm font-medium mb-2">{data.name}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Risk Score:</span>
                    <span className="font-medium">
                      {(data.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span
                      className="font-medium capitalize"
                      style={{ color: getRiskLevelColor(data.riskLevel) }}
                    >
                      {data.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Legend />
        <Bar dataKey="score" radius={[8, 8, 0, 0]} cursor="pointer">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getRiskLevelColor(entry.riskLevel)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
