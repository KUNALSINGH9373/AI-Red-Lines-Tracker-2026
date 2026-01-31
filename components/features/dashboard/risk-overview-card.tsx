import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Shield, AlertCircle } from "lucide-react";
import type { RiskAssessment, Model, RiskLevelConfig } from "@/lib/types/risk-data";
import { countByRiskLevel } from "@/lib/data/risk-calculations";
import { SourceBadge } from "@/components/shared/source-badge";

interface RiskOverviewCardProps {
  assessments: RiskAssessment[];
  getModelById: (id: string) => Model | undefined;
  riskLevels?: RiskLevelConfig[];
}

export function RiskOverviewCard({ assessments, getModelById, riskLevels }: RiskOverviewCardProps) {
  const riskCounts = countByRiskLevel(assessments);

  // Determine which risk levels are "high risk" and "medium risk" based on framework
  const highRiskLevels = riskLevels
    ? riskLevels.filter(level => {
        const levelValue = level.level.toLowerCase();
        return levelValue.includes("high") || levelValue.includes("critical") ||
               levelValue.includes("asl-3") || levelValue.includes("asl-4") ||
               levelValue.includes("ccl");
      }).map(l => l.level)
    : ["high", "critical", "asl-3", "asl-4", "ccl-met", "ccl-exceeded"];

  const mediumRiskLevels = riskLevels
    ? riskLevels.filter(level => {
        const levelValue = level.level.toLowerCase();
        return levelValue.includes("medium") ||
               levelValue.includes("asl-2") ||
               levelValue.includes("alert");
      }).map(l => l.level)
    : ["medium", "asl-2", "alert"];

  // Count models in each risk category
  const criticalCount = Object.entries(riskCounts)
    .filter(([level]) => level.includes("critical") || level.includes("asl-4") || level.includes("ccl-exceeded"))
    .reduce((sum, [, count]) => sum + count, 0);

  const highCount = Object.entries(riskCounts)
    .filter(([level]) => highRiskLevels.includes(level) && !level.includes("critical") && !level.includes("asl-4") && !level.includes("ccl-exceeded"))
    .reduce((sum, [, count]) => sum + count, 0);

  const mediumCount = Object.entries(riskCounts)
    .filter(([level]) => mediumRiskLevels.includes(level))
    .reduce((sum, [, count]) => sum + count, 0);

  const lowCount = Object.entries(riskCounts)
    .filter(([level]) => {
      const levelValue = level.toLowerCase();
      return levelValue.includes("low") || levelValue.includes("asl-1") || levelValue.includes("below");
    })
    .reduce((sum, [, count]) => sum + count, 0);

  const stats = [
    {
      label: "Critical Risk",
      value: criticalCount,
      icon: AlertCircle,
      color: "#991b1b",
    },
    {
      label: "High Risk",
      value: highCount,
      icon: AlertTriangle,
      color: "#ef4444",
    },
    {
      label: "Medium Risk",
      value: mediumCount,
      icon: TrendingUp,
      color: "#f59e0b",
    },
    {
      label: "Low Risk",
      value: lowCount,
      icon: Shield,
      color: "#10b981",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center p-4 rounded-lg border"
              >
                <Icon className="h-8 w-8 mb-2" style={{ color: stat.color }} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-6 border-t space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Models Assessed:</span>
            <Badge variant="secondary">{assessments.length}</Badge>
          </div>

          {assessments.some((a) => highRiskLevels.includes(a.overallRisk)) && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-500">High Risk Models:</div>
              <div className="space-y-1">
                {assessments
                  .filter((a) => highRiskLevels.includes(a.overallRisk))
                  .map((assessment) => {
                    const model = getModelById(assessment.modelId);
                    return (
                      <div key={assessment.modelId} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{model?.name}</span>
                        <SourceBadge
                          sourceId={model?.systemCardUrl?.includes("o3-system-card") ? "src-004" : "src-001"}
                          section="Overall Risk"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {assessments.some((a) => mediumRiskLevels.includes(a.overallRisk)) && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-orange-500">Medium Risk Models:</div>
              <div className="space-y-1">
                {assessments
                  .filter((a) => mediumRiskLevels.includes(a.overallRisk))
                  .map((assessment) => {
                    const model = getModelById(assessment.modelId);
                    const sourceId =
                      model?.id === "gpt-4o" ? "src-001" :
                      model?.id === "o3-mini" ? "src-005" :
                      model?.id === "o1-pro" ? "src-003" : "src-002";
                    return (
                      <div key={assessment.modelId} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{model?.name}</span>
                        <SourceBadge sourceId={sourceId} section="Risk Assessment" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
