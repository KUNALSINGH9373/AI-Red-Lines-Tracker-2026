"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import {
  getIncidents,
  getIncidentsSource,
  getTotalDeployerIncidents,
  getTotalDeveloperIncidents,
  getHarmedByTotal,
  getIncidentResponsesTotal,
} from "@/lib/data/ai-incidents-data";
import { IncidentsMetricsCard } from "@/components/features/dashboard/incidents-metrics-card";
import { IncidentsBarChart } from "@/components/features/charts/incidents-bar-chart";

export default function AIIncidentsDashboard() {
  const incidents = getIncidents();
  const source = getIncidentsSource();
  const totalDeployer = getTotalDeployerIncidents();
  const totalDeveloper = getTotalDeveloperIncidents();
  const totalHarmed = getHarmedByTotal();
  const totalResponses = getIncidentResponsesTotal();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Incidents Dashboard</h1>
            <p className="text-muted-foreground">
              Tracking reported AI incidents and harmful outcomes from deployed systems
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {source.lastUpdated}
            </Badge>
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View Full Database
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <IncidentsMetricsCard
            incidents={incidents}
            totalDeployer={totalDeployer}
            totalDeveloper={totalDeveloper}
            totalHarmed={totalHarmed}
            totalResponses={totalResponses}
          />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About This Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Data Source</p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {source.title}
                </a>
              </div>
              <div className="pt-3 border-t">
                <p className="font-medium mb-2">Description</p>
                <p className="text-muted-foreground">{source.description}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-medium mb-2">Note</p>
                <p className="text-muted-foreground text-xs">
                  These incidents represent documented cases from the AI Incident Database. They reflect both direct harm from AI systems and incidents where AI systems were implicated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Organization</CardTitle>
            <CardDescription>
              Total incidents, breakdown by role (Deployer vs Developer)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentsBarChart incidents={incidents} />
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Most Incidents (Total)</p>
              <p className="text-muted-foreground">
                OpenAI leads with {incidents[0]?.totalIncidents} documented incidents, followed by Google with {incidents[1]?.totalIncidents}.
              </p>
            </div>
            <div className="pt-3 border-t">
              <p className="font-medium mb-1">Developer vs Deployer</p>
              <p className="text-muted-foreground">
                Incidents where organizations acted as developers ({totalDeveloper} total) significantly outnumber those where they deployed systems ({totalDeployer} total).
              </p>
            </div>
            <div className="pt-3 border-t">
              <p className="font-medium mb-1">Scope of Impact</p>
              <p className="text-muted-foreground">
                Across all tracked organizations, {totalHarmed} parties were directly harmed, with {totalResponses} documented incident responses.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Understanding the Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Deployer vs Developer</p>
              <p className="text-muted-foreground">
                <strong>Deployer:</strong> Organization deployed an AI system in production.
                <br />
                <strong>Developer:</strong> Organization developed the AI model/system.
              </p>
            </div>
            <div className="pt-3 border-t">
              <p className="font-medium mb-1">Harmed By</p>
              <p className="text-muted-foreground">
                Number of distinct entities that were harmed by incidents involving this organization's AI systems.
              </p>
            </div>
            <div className="pt-3 border-t">
              <p className="font-medium mb-1">Related Entities</p>
              <p className="text-muted-foreground">
                Other organizations, platforms, or systems that were mentioned or implicated in incidents.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
