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
} from "recharts";
import type { ChartDataPoint } from "@/lib/types/risk-data";
import { format } from "date-fns";

interface CrossLabTimelineChartProps {
  data: ChartDataPoint[];
}

const LAB_COLORS: Record<string, string> = {
  OpenAI: "#3b82f6",
  Anthropic: "#f97316",
  "Google DeepMind": "#a855f7",
};

export function CrossLabTimelineChart({ data }: CrossLabTimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.date as string).getTime() -
      new Date(b.date as string).getTime()
  );

  const lineKeys = Object.keys(sortedData[0]).filter((key) => key !== "date");

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={sortedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value as string), "MMM yyyy")}
          className="text-xs"
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(value) => (value * 100).toFixed(0) + "%"}
          className="text-xs"
        />
        <Tooltip
          formatter={(value) => `${((value as number) * 100).toFixed(1)}%`}
          labelFormatter={(label) =>
            format(new Date(label as string), "MMM yyyy")
          }
        />
        <Legend />
        {lineKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={
              LAB_COLORS[key as keyof typeof LAB_COLORS] || "#6b7280"
            }
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
