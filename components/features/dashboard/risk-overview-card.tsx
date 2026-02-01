import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Shield, AlertCircle, AlertOctagon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { RiskAssessment, Model, RiskLevelConfig } from "@/lib/types/risk-data";
import { countByRiskLevel } from "@/lib/data/risk-calculations";
import { SourceBadge } from "@/components/shared/source-badge";

interface RiskOverviewCardProps {
  assessments: RiskAssessment[];
  getModelById: (id: string) => Model | undefined;
  riskLevels?: RiskLevelConfig[];
  labName?: "openai" | "anthropic" | "google-deepmind" | "xai";
  frameworkVersion?: string;
}

// Risk level definitions by framework
const RISK_DEFINITIONS: Record<string, Record<string, string>> = {
  openai: {
    critical: "Extreme capability - Model demonstrates severe capability to enable catastrophic outcomes. Deployment restrictions required.",
    high: "Significant capability - Model shows substantial capability to enable serious harms. Strict access controls needed.",
    medium: "Moderate capability - Model shows meaningful capability but with mitigations. Enhanced monitoring required.",
    low: "Minimal capability - Model shows little to no significant capability. Standard mitigations sufficient.",
  },
  anthropic: {
    "asl-4": "ASL-4 (Extreme) - Capabilities that pose extreme risk and require the most stringent controls",
    "asl-3": "ASL-3 (High) - Significant capabilities requiring strict deployment restrictions and controls",
    "asl-2": "ASL-2 (Moderate) - Moderate capabilities requiring enhanced monitoring and safeguards",
    "asl-1": "ASL-1 (Minimal) - Minimal capabilities manageable with standard safeguards",
  },
  "google-deepmind": {
    "ccl-exceeded": "CCL Exceeded - Model capabilities have exceeded the Capability Confidence Level threshold",
    "ccl-met": "CCL Met - Model has reached the Capability Confidence Level threshold",
    alert: "Alert Threshold Met - Model capabilities have reached alert-level thresholds",
    "below-alert": "Below Alert - Model capabilities are below alert thresholds",
  },
  xai: {
    critical: "Critical Risk - Model demonstrates extreme risk potential across multiple dimensions",
    high: "High Risk - Model shows significant risk potential requiring strict controls",
    moderate: "Moderate Risk - Model shows moderate risk requiring enhanced safeguards",
    low: "Low Risk - Model shows minimal risk with standard mitigations sufficient",
  },
};

function getRiskLevelDescription(
  labName: string | undefined,
  riskLevel: string
): string {
  const labDefinitions =
    RISK_DEFINITIONS[labName || "openai"] || RISK_DEFINITIONS.openai;
  const levelKey = riskLevel.toLowerCase();
  return labDefinitions[levelKey] || "Risk level - Monitor model capabilities";
}

export function RiskOverviewCard({
  assessments,
  getModelById,
  riskLevels,
  labName,
  frameworkVersion,
}: RiskOverviewCardProps) {
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
      level: "critical",
      value: criticalCount,
      icon: AlertCircle,
      color: "#991b1b",
    },
    {
      label: "High Risk",
      level: "high",
      value: highCount,
      icon: AlertTriangle,
      color: "#ef4444",
    },
    {
      label: "Medium Risk",
      level: "medium",
      value: mediumCount,
      icon: TrendingUp,
      color: "#f59e0b",
    },
    {
      label: "Low Risk",
      level: "low",
      value: lowCount,
      icon: Shield,
      color: "#10b981",
    },
  ];

  const labDisplayName =
    labName === "google-deepmind"
      ? "Google DeepMind"
      : labName
        ? labName.charAt(0).toUpperCase() + labName.slice(1)
        : "AI Models";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Overview</CardTitle>
        <CardDescription>
          Number of {labDisplayName} models at each risk level
          {frameworkVersion && ` (${frameworkVersion})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const tooltipContent = getRiskLevelDescription(labName, stat.level);
            return (
              <Tooltip key={stat.label}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center p-4 rounded-lg border cursor-help hover:bg-accent/50 transition-colors">
                    <Icon className="h-8 w-8 mb-2" style={{ color: stat.color }} />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground text-center">
                      {stat.label}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
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

          {/* Near Threshold Section */}
          {assessments.some((a) => {
            const maxProximity = Math.max(...a.categoryRisks.map(r => r.thresholdProximity || 0));
            return maxProximity >= 0.75;
          }) && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-yellow-600 flex items-center gap-1">
                <AlertOctagon className="h-4 w-4" />
                Near Threshold:
              </div>
              <div className="space-y-1">
                {assessments
                  .filter((a) => {
                    const maxProximity = Math.max(...a.categoryRisks.map(r => r.thresholdProximity || 0));
                    return maxProximity >= 0.75;
                  })
                  .map((assessment) => {
                    const model = getModelById(assessment.modelId);
                    const nearCategory = assessment.categoryRisks.find(
                      r => (r.thresholdProximity || 0) >= 0.75
                    );
                    return (
                      <div key={assessment.modelId} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{model?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {nearCategory?.categoryId || "multiple"}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Low Risk Models Section */}
          {assessments.some((a) => {
            const levelValue = a.overallRisk.toLowerCase();
            return levelValue.includes("low") || levelValue.includes("asl-1") || levelValue.includes("below");
          }) && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-600">Low Risk Models:</div>
              <div className="space-y-1">
                {assessments
                  .filter((a) => {
                    const levelValue = a.overallRisk.toLowerCase();
                    return levelValue.includes("low") || levelValue.includes("asl-1") || levelValue.includes("below");
                  })
                  .map((assessment) => {
                    const model = getModelById(assessment.modelId);
                    return (
                      <div key={assessment.modelId} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{model?.name}</span>
                        <Badge variant="outline" className="text-xs bg-green-50">
                          {assessment.overallRisk}
                        </Badge>
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
