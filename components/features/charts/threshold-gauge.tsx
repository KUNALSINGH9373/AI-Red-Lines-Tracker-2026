"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { transformToGaugeData } from "@/lib/data/chart-transformers";

interface ThresholdGaugeProps {
  thresholdProximity: number;
  title?: string;
}

export function ThresholdGauge({ thresholdProximity, title }: ThresholdGaugeProps) {
  const gaugeData = transformToGaugeData(thresholdProximity);

  const getColor = () => {
    if (thresholdProximity >= 0.9) return "#991b1b";
    if (thresholdProximity >= 0.7) return "#ef4444";
    if (thresholdProximity >= 0.4) return "#f59e0b";
    return "#10b981";
  };

  const getCategory = () => {
    if (thresholdProximity >= 0.7) return "High";
    if (thresholdProximity >= 0.4) return "Medium";
    return "Low";
  };

  const data = [
    {
      name: "Proximity",
      value: gaugeData.value,
      fill: getColor(),
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {title && (
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
          {title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="70%"
          innerRadius="80%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={data}
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
            fill={getColor()}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <div className="text-3xl font-bold" style={{ color: getColor() }}>
          {getCategory()}
        </div>
      </div>
    </div>
  );
}
