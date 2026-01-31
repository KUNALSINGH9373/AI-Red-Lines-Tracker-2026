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
  ReferenceLine,
} from "recharts";
import { transformToComputeBarChartData } from "@/lib/data/compute-infrastructure-transformers";
import type { TrainingComputeData } from "@/lib/types/risk-data";

interface TrainingComputeChartProps {
  data: TrainingComputeData[];
  onBarClick?: (modelId: string) => void;
}

export function TrainingComputeChart({
  data,
  onBarClick,
}: TrainingComputeChartProps) {
  const chartData = transformToComputeBarChartData(data);

  const getComplianceColor = (compliant: boolean): string => {
    return compliant ? "#10b981" : "#ef4444";
  };

  return (
    <div className="w-full space-y-4">
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 80, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            className="text-xs"
          />
          <YAxis
            scale="log"
            domain={[1e23, 1e26]}
            tickFormatter={(value) => {
              const exponent = Math.round(Math.log10(value));
              return `10^${exponent}`;
            }}
            className="text-xs"
            label={{ value: "Training Compute (FLOP, log scale)", angle: -90, position: "insideLeft", offset: 10 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-4 shadow-lg">
                  <p className="text-sm font-semibold mb-3">{item.name}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Organization:</span>
                      <span className="font-medium">{item.organization}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Training Compute:</span>
                      <span className="font-medium">{item.displayFlops}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">EU Act:</span>
                      <span
                        className="font-medium"
                        style={{
                          color: getComplianceColor(item.compliant),
                        }}
                      >
                        {item.compliant ? "Compliant" : "Non-compliant"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-xs mt-2 pt-2 border-t">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{item.source}</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <ReferenceLine
            y={1e25}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{
              value: "EU AI Act 10^25 FLOP Threshold",
              position: "right",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="flops"
            radius={[8, 8, 0, 0]}
            cursor="pointer"
            onClick={(data: any) => onBarClick?.(data.payload?.modelId || "")}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getComplianceColor(entry.compliant)}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="text-sm text-green-900 dark:text-green-100">
            <p className="font-semibold">EU Act Compliant</p>
            <p className="text-xs mt-1">Models below 10^25 FLOP threshold</p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="text-sm text-red-900 dark:text-red-100">
            <p className="font-semibold">Non-Compliant</p>
            <p className="text-xs mt-1">Models at or above 10^25 FLOP threshold</p>
          </div>
        </div>
      </div>
    </div>
  );
}
