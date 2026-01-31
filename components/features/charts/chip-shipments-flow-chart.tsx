"use client";

import { useState } from "react";
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
import { transformToChipFlowData } from "@/lib/data/compute-infrastructure-transformers";
import type { ChipShipment } from "@/lib/types/risk-data";

interface ChipShipmentsFlowChartProps {
  data: ChipShipment[];
}

const REGION_COLORS = {
  us: "#3b82f6",
  china: "#ef4444",
  other: "#6b7280",
};

export function ChipShipmentsFlowChart({
  data,
}: ChipShipmentsFlowChartProps) {
  const flowData = transformToChipFlowData(data);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const uniqueYears = [...new Set(flowData.map((d) => d.year))].sort();
  const chartData = flowData.map((item) => ({
    year: item.year.toString(),
    "US Labs": item.us,
    "China": item.china,
    "Other": item.other,
    total: item.total,
    chipModel: item.chipModel,
    source: item.source,
  }));

  const totalUS = flowData.reduce((sum, d) => sum + d.us, 0);
  const totalChina = flowData.reduce((sum, d) => sum + d.china, 0);
  const totalOther = flowData.reduce((sum, d) => sum + d.other, 0);

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            className="text-xs"
            label={{ value: "Year", position: "insideBottomRight", offset: -10 }}
          />
          <YAxis
            className="text-xs"
            label={{
              value: "GPU Shipments (Millions of Units)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-4 shadow-lg">
                  <p className="text-sm font-semibold mb-3">{data.year}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: REGION_COLORS.us }}
                      />
                      <span className="text-muted-foreground">US Labs:</span>
                      <span className="font-medium">{data["US Labs"]}M units</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: REGION_COLORS.china }}
                      />
                      <span className="text-muted-foreground">China:</span>
                      <span className="font-medium">{data["China"]}M units</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: REGION_COLORS.other }}
                      />
                      <span className="text-muted-foreground">Other:</span>
                      <span className="font-medium">{data["Other"]}M units</span>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between gap-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold">{data.total}M units</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Legend />
          <Bar dataKey="US Labs" stackId="a" fill={REGION_COLORS.us} />
          <Bar dataKey="China" stackId="a" fill={REGION_COLORS.china} />
          <Bar dataKey="Other" stackId="a" fill={REGION_COLORS.other} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
          <div className="text-sm text-blue-900 dark:text-blue-100 mb-1">
            US Labs (Total)
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalUS.toFixed(1)}M
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {((totalUS / (totalUS + totalChina + totalOther)) * 100).toFixed(0)}% of global
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
          <div className="text-sm text-red-900 dark:text-red-100 mb-1">
            China (Total)
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {totalChina.toFixed(2)}M
          </div>
          <div className="text-xs text-red-700 dark:text-red-300 mt-1">
            {((totalChina / (totalUS + totalChina + totalOther)) * 100).toFixed(1)}% of global
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-950/20">
          <div className="text-sm text-gray-900 dark:text-gray-100 mb-1">
            Other (Total)
          </div>
          <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            {totalOther.toFixed(1)}M
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
            {((totalOther / (totalUS + totalChina + totalOther)) * 100).toFixed(0)}% of global
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-2">
          About Chip Shipments
        </h4>
        <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
          This chart tracks shipments of NVIDIA H100, H200, and Blackwell GPUs to major AI labs
          and data centers. Data represents advanced AI compute chips essential for training frontier models.
        </p>
        <p className="text-sm text-orange-800 dark:text-orange-200">
          <strong>US Export Controls:</strong> Shipments to China are restricted under US Commerce Department
          export controls established in 2022-2023. Approved shipments to US-based labs significantly
          exceed China allocations, reflecting geopolitical and regulatory constraints.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Data by Year and Model</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Year</th>
                <th className="text-left p-2 font-semibold">Chip Model</th>
                <th className="text-right p-2 font-semibold">US (M)</th>
                <th className="text-right p-2 font-semibold">China (M)</th>
                <th className="text-right p-2 font-semibold">Total (M)</th>
              </tr>
            </thead>
            <tbody>
              {flowData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2">{item.year}</td>
                  <td className="p-2">{item.chipModel}</td>
                  <td className="text-right p-2 font-medium">{item.us}</td>
                  <td className="text-right p-2 font-medium">{item.china}</td>
                  <td className="text-right p-2 font-semibold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
