import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { RiskAssessment } from "@/lib/types/risk-data";
import { getCategoriesAboveThreshold } from "@/lib/data/risk-calculations";
import { getRiskCategories, getModelById } from "@/lib/data/openai-data";
import { SourceBadge } from "@/components/shared/source-badge";

interface ThresholdProximityIndicatorProps {
  assessments: RiskAssessment[];
  threshold?: number;
}

export function ThresholdProximityIndicator({
  assessments,
  threshold = 0.85,
}: ThresholdProximityIndicatorProps) {
  const categories = getRiskCategories();

  const nearThresholdItems = assessments.flatMap((assessment) => {
    const nearThreshold = getCategoriesAboveThreshold(assessment, threshold);
    const model = getModelById(assessment.modelId);
    return nearThreshold.map((cr) => ({
      modelId: assessment.modelId,
      modelName: model?.name || assessment.modelId,
      categoryId: cr.categoryId,
      categoryName:
        categories.find((c) => c.id === cr.categoryId)?.name || cr.categoryId,
      thresholdProximity: cr.thresholdProximity,
      riskLevel: cr.riskLevel,
      sourceSection: cr.sourceSection,
      sourceId:
        model?.id === "gpt-4o" ? "src-001" :
        model?.id === "o3" ? "src-004" :
        model?.id === "o3-mini" ? "src-005" :
        model?.id === "o1-pro" ? "src-003" : "src-002",
    }));
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Near Threshold
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nearThresholdItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No models are currently near threshold limits.
          </p>
        ) : (
          <div className="space-y-3">
            {nearThresholdItems.map((item, index) => (
              <div
                key={`${item.modelId}-${item.categoryId}-${index}`}
                className="p-3 rounded-lg border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.modelName}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.categoryName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.thresholdProximity >= 0.95
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {(item.thresholdProximity * 100).toFixed(0)}%
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {item.riskLevel}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SourceBadge
                    sourceId={item.sourceId}
                    section={item.sourceSection}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
