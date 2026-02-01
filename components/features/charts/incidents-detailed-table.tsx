"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@/lib/data/ai-incidents-data";

interface IncidentsDetailedTableProps {
  incidents: Incident[];
}

export function IncidentsDetailedTable({ incidents }: IncidentsDetailedTableProps) {
  const sortedIncidents = [...incidents].sort(
    (a, b) => b.totalIncidents - a.totalIncidents
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Breakdown by Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-3 font-medium">Organization</th>
                <th className="text-right py-3 px-3 font-medium">Total</th>
                <th className="text-right py-3 px-3 font-medium">Deployer</th>
                <th className="text-right py-3 px-3 font-medium">Developer</th>
                <th className="text-right py-3 px-3 font-medium">Harmed By</th>
                <th className="text-right py-3 px-3 font-medium">Systems</th>
                <th className="text-right py-3 px-3 font-medium">Entities</th>
                <th className="text-right py-3 px-3 font-medium">Responses</th>
              </tr>
            </thead>
            <tbody>
              {sortedIncidents.map((incident, index) => (
                <tr
                  key={incident.id}
                  className="border-b hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{incident.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-3">
                    <Badge variant="default" className="bg-red-500">
                      {incident.totalIncidents}
                    </Badge>
                  </td>
                  <td className="text-right py-3 px-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {incident.incidentsAsDeployer}
                    </span>
                  </td>
                  <td className="text-right py-3 px-3">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {incident.incidentsAsDeveloper}
                    </span>
                  </td>
                  <td className="text-right py-3 px-3">
                    <Badge variant="outline">{incident.harmedBy}</Badge>
                  </td>
                  <td className="text-right py-3 px-3">
                    <span className="text-muted-foreground">{incident.implicatedSystem}</span>
                  </td>
                  <td className="text-right py-3 px-3">
                    <Badge variant="secondary">{incident.relatedEntities}</Badge>
                  </td>
                  <td className="text-right py-3 px-3">
                    <span className="text-muted-foreground">{incident.incidentResponses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Total:</strong> Cumulative incidents recorded for this organization
          </p>
          <p>
            <strong>Deployer:</strong> Incidents where organization deployed the AI system
          </p>
          <p>
            <strong>Developer:</strong> Incidents where organization developed the AI system
          </p>
          <p>
            <strong>Harmed By:</strong> Number of parties harmed by incidents
          </p>
          <p>
            <strong>Entities:</strong> Related organizations or systems implicated
          </p>
          <p>
            Data source:{" "}
            <a
              href="https://incidentdatabase.ai/entities/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              AI Incident Database
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
