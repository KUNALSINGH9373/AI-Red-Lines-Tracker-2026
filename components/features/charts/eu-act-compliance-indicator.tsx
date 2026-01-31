"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EUActComplianceIndicatorProps {
  compliant: number;
  nonCompliant: number;
}

export function EUActComplianceIndicator({
  compliant,
  nonCompliant,
}: EUActComplianceIndicatorProps) {
  const total = compliant + nonCompliant;
  const complianceData = [
    {
      name: "Compliant (< 10^25 FLOP)",
      value: compliant,
      percentage: ((compliant / total) * 100).toFixed(1),
    },
    {
      name: "Non-Compliant (≥ 10^25 FLOP)",
      value: nonCompliant,
      percentage: ((nonCompliant / total) * 100).toFixed(1),
    },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={complianceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {COLORS.map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="text-sm font-semibold mb-2">{data.name}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Count:</span>
                      <span className="font-medium">{data.value}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Percentage:</span>
                      <span className="font-medium">{data.percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-muted/50">
          <div className="text-sm text-muted-foreground mb-1">
            Total Models Tracked
          </div>
          <div className="text-3xl font-bold">{total}</div>
        </div>

        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
          <div className="text-sm text-green-900 dark:text-green-100 mb-1">
            EU Act Compliant
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {compliant}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
            {((compliant / total) * 100).toFixed(0)}% of models
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
          <div className="text-sm text-red-900 dark:text-red-100 mb-1">
            Non-Compliant
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {nonCompliant}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300 mt-1">
            {((nonCompliant / total) * 100).toFixed(0)}% of models
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
          About EU AI Act Threshold
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          The EU AI Act high-capability system provisions became effective August 2, 2025.
          Models requiring 10^25 FLOPs or more to train are subject to mandatory conformity assessments,
          risk management, and transparency requirements. This threshold represents a significant regulatory
          milestone for frontier AI development.
        </p>
      </div>
    </div>
  );
}
