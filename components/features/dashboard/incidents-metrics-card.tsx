"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Shield, Zap } from "lucide-react";
import type { Incident } from "@/lib/data/ai-incidents-data";

interface IncidentsMetricsCardProps {
  incidents: Incident[];
  totalDeployer: number;
  totalDeveloper: number;
  totalHarmed: number;
  totalResponses: number;
}

export function IncidentsMetricsCard({
  incidents,
  totalDeployer,
  totalDeveloper,
  totalHarmed,
  totalResponses,
}: IncidentsMetricsCardProps) {
  const totalIncidents = incidents.reduce((sum, i) => sum + i.totalIncidents, 0);
  const topOrganization = incidents[0];

  const metrics = [
    {
      label: "Total Incidents Tracked",
      value: totalIncidents,
      icon: AlertTriangle,
      color: "#ef4444",
    },
    {
      label: "As Deployer",
      value: totalDeployer,
      icon: Shield,
      color: "#3b82f6",
    },
    {
      label: "As Developer",
      value: totalDeveloper,
      icon: Zap,
      color: "#8b5cf6",
    },
    {
      label: "Harmed Parties",
      value: totalHarmed,
      icon: Users,
      color: "#f97316",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="flex flex-col items-center p-4 rounded-lg border"
              >
                <Icon className="h-6 w-6 mb-2" style={{ color: metric.color }} />
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        {topOrganization && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Most Incidents:</span>
              <Badge variant="default">{topOrganization.name}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Incident Responses:</span>
              <Badge variant="secondary">{totalResponses}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Data from <a href="https://incidentdatabase.ai/entities/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">AI Incident Database</a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
