"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";
import type { Incident } from "@/lib/data/ai-incidents-data";

interface IncidentsBarChartProps {
  incidents: Incident[];
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

// Custom label component to display values on bars
const renderCustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#ffffff"
      textAnchor="middle"
      fontSize={12}
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

export function IncidentsBarChart({ incidents }: IncidentsBarChartProps) {
  const data = incidents.map((incident, index) => ({
    name: incident.name,
    total: incident.totalIncidents,
    deployer: incident.incidentsAsDeployer,
    developer: incident.incidentsAsDeveloper,
    harmed: incident.harmedBy,
    entities: incident.relatedEntities,
    responses: incident.incidentResponses,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 p-4 rounded-lg border border-white/20 text-sm space-y-1">
          <p className="font-bold text-white">{data.name}</p>
          <p className="text-red-400">Total Incidents: {data.total}</p>
          <p className="text-blue-400">As Deployer: {data.deployer}</p>
          <p className="text-purple-400">As Developer: {data.developer}</p>
          <p className="text-orange-400">Harmed Parties: {data.harmed}</p>
          <p className="text-cyan-400">Related Entities: {data.entities}</p>
          <p className="text-green-400">Responses: {data.responses}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: "Total Incidents", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            name="Total Incidents"
            label={renderCustomLabel}
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Data Summary Table */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Quick Reference</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg border" style={{ borderColor: item.color, borderWidth: '2px' }}>
              <div className="text-sm font-medium mb-2">{item.name}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.total}
                </span>
                <span className="text-xs text-muted-foreground">incidents</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <div>🔧 Dev: {item.developer}</div>
                <div>⚙️ Deploy: {item.deployer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
