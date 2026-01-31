"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { transformToTimeSeriesData } from "@/lib/data/chart-transformers";
import { CHART_COLORS, RISK_THRESHOLDS } from "@/lib/constants/thresholds";
import type { RiskAssessment } from "@/lib/types/risk-data";
import { format } from "date-fns";

interface RiskProgressionChartProps {
  assessments: RiskAssessment[];
  categoryId?: string;
  onDataPointClick?: (data: any) => void;
  getModelColor?: (modelId: string) => string;
}

export function RiskProgressionChart({
  assessments,
  categoryId,
  onDataPointClick,
  getModelColor = (modelId) => {
    return CHART_COLORS[modelId as keyof typeof CHART_COLORS] || "#6b7280";
  },
}: RiskProgressionChartProps) {
  const data = transformToTimeSeriesData(assessments, categoryId);

  const models = Array.from(
    new Set(assessments.map((a) => a.modelId))
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        onClick={onDataPointClick}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
          className="text-xs"
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          className="text-xs"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="text-sm font-medium mb-2">
                  {format(new Date(payload[0].payload.date), "MMMM d, yyyy")}
                </p>
                {payload.map((entry: any) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.name}:</span>
                    <span className="font-medium">
                      {(entry.value * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend />
        <ReferenceLine
          y={RISK_THRESHOLDS.LOW_TO_MEDIUM}
          stroke="#f59e0b"
          strokeDasharray="3 3"
          label={{ value: "Medium", position: "right", fill: "#f59e0b" }}
        />
        <ReferenceLine
          y={RISK_THRESHOLDS.MEDIUM_TO_HIGH}
          stroke="#ef4444"
          strokeDasharray="3 3"
          label={{ value: "High", position: "right", fill: "#ef4444" }}
        />
        <ReferenceLine
          y={RISK_THRESHOLDS.HIGH_TO_CRITICAL}
          stroke="#991b1b"
          strokeDasharray="3 3"
          label={{ value: "Critical", position: "right", fill: "#991b1b" }}
        />
        {models.map((modelId) => (
          <Line
            key={modelId}
            type="monotone"
            dataKey={modelId}
            stroke={getModelColor(modelId)}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, cursor: "pointer" }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
