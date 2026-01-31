"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { parseCapacityToGW } from "@/lib/data/compute-infrastructure-transformers";
import type { DataCenterExpansion } from "@/lib/types/risk-data";
import { Badge } from "@/components/ui/badge";

interface DataCenterExpansionChartProps {
  data: DataCenterExpansion[];
}

const STATUS_COLORS: Record<string, string> = {
  announced: "#f59e0b",
  "in-progress": "#3b82f6",
  operational: "#10b981",
};

const getCompanyColor = (company: string): string => {
  const colors: Record<string, string> = {
    "OpenAI/SoftBank/NVIDIA": "#10a37f",
    "Google/Microsoft": "#4285f4",
    "Amazon/AWS": "#ff9900",
    Meta: "#0668e1",
    Anthropic: "#f97316",
    "Lambda Labs": "#8b5cf6",
    "EU Commission / Private Partners": "#059669",
    Tencent: "#ef5350",
  };

  for (const [key, color] of Object.entries(colors)) {
    if (company.includes(key.split("/")[0])) {
      return color;
    }
  }

  return "#6b7280";
};

export function DataCenterExpansionChart({
  data,
}: DataCenterExpansionChartProps) {
  const [sortBy, setSortBy] = useState<"capacity" | "date">("capacity");

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "capacity") {
      return parseCapacityToGW(b.capacity) - parseCapacityToGW(a.capacity);
    } else {
      return (
        new Date(a.announcementDate).getTime() -
        new Date(b.announcementDate).getTime()
      );
    }
  });

  const chartData = sortedData.map((dc) => ({
    name: dc.projectName,
    capacity: parseCapacityToGW(dc.capacity),
    capacityStr: dc.capacity,
    company: dc.company,
    location: `${dc.location.city}, ${dc.location.country}`,
    status: dc.status,
    date: dc.announcementDate,
    source: dc.source,
  }));

  const totalCapacity = chartData.reduce((sum, d) => sum + d.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy("capacity")}
          className={`px-3 py-1 rounded text-sm ${
            sortBy === "capacity"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sort by Capacity
        </button>
        <button
          onClick={() => setSortBy("date")}
          className={`px-3 py-1 rounded text-sm ${
            sortBy === "date"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sort by Date
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" className="text-xs" />
          <YAxis dataKey="name" type="category" width={240} className="text-xs" />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-4 shadow-lg max-w-xs">
                  <p className="text-sm font-semibold mb-3">{item.name}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium text-right">{item.company}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-right">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{item.capacityStr}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Announced:</span>
                      <span className="font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        style={{
                          backgroundColor: STATUS_COLORS[item.status],
                        }}
                        className="capitalize text-white"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs mt-2 pt-2 border-t text-muted-foreground">
                      {item.source}
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="capacity" radius={[0, 8, 8, 0]} cursor="pointer">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getCompanyColor(entry.company)}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="p-4 rounded-lg bg-muted/50 border">
        <h4 className="font-semibold text-sm mb-3">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Total Announced Capacity
            </div>
            <div className="text-2xl font-bold">{totalCapacity.toFixed(0)} GW</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Projects Tracked
            </div>
            <div className="text-2xl font-bold">{data.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Status Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: STATUS_COLORS.announced }}
            />
            <span className="text-sm">Announced</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: STATUS_COLORS["in-progress"] }}
            />
            <span className="text-sm">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: STATUS_COLORS.operational }}
            />
            <span className="text-sm">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
