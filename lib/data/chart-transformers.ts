import type {
  RiskAssessment,
  Model,
  ChartDataPoint,
  ComparisonData,
  RiskCategory,
} from "@/lib/types/risk-data";
import { getModelById, getRiskCategories } from "./openai-data";

export function transformToTimeSeriesData(
  assessments: RiskAssessment[],
  categoryId?: string
): ChartDataPoint[] {
  const sortedAssessments = [...assessments].sort(
    (a, b) =>
      new Date(a.assessmentDate).getTime() -
      new Date(b.assessmentDate).getTime()
  );

  return sortedAssessments.map((assessment) => {
    const model = getModelById(assessment.modelId);
    const dataPoint: ChartDataPoint = {
      date: assessment.assessmentDate,
    };

    if (categoryId) {
      // Show single category for all models
      const categoryRisk = assessment.categoryRisks.find(
        (cr) => cr.categoryId === categoryId
      );
      if (categoryRisk) {
        dataPoint[model?.name || assessment.modelId] = categoryRisk.score;
      }
    } else {
      // Show average risk across all categories for each model
      const avgScore =
        assessment.categoryRisks.reduce((sum, cr) => sum + cr.score, 0) /
        assessment.categoryRisks.length;
      dataPoint[model?.name || assessment.modelId] = avgScore;
    }

    return dataPoint;
  });
}

export function transformToComparisonData(
  assessments: RiskAssessment[]
): ComparisonData[] {
  const comparisonData: ComparisonData[] = [];

  assessments.forEach((assessment) => {
    const model = getModelById(assessment.modelId);
    assessment.categoryRisks.forEach((cr) => {
      const category = getRiskCategories().find((c) => c.id === cr.categoryId);
      comparisonData.push({
        modelId: assessment.modelId,
        modelName: model?.name || assessment.modelId,
        categoryId: cr.categoryId,
        categoryName: category?.name || cr.categoryId,
        riskLevel: cr.riskLevel,
        score: cr.score,
        thresholdProximity: cr.thresholdProximity,
      });
    });
  });

  return comparisonData;
}

export function transformToRadarData(
  assessment: RiskAssessment
): Array<{ category: string; value: number; fullMark: number }> {
  const categories = getRiskCategories();

  return assessment.categoryRisks.map((cr) => {
    const category = categories.find((c) => c.id === cr.categoryId);
    return {
      category: category?.name || cr.categoryId,
      value: cr.score * 100,
      fullMark: 100,
    };
  });
}

export function transformToHeatmapData(
  assessments: RiskAssessment[],
  models: Model[],
  categories: RiskCategory[]
): Array<{
  modelId: string;
  modelName: string;
  categoryId: string;
  categoryName: string;
  score: number;
  riskLevel: string;
}> {
  const heatmapData: Array<{
    modelId: string;
    modelName: string;
    categoryId: string;
    categoryName: string;
    score: number;
    riskLevel: string;
  }> = [];

  models.forEach((model) => {
    const assessment = assessments.find((a) => a.modelId === model.id);
    categories.forEach((category) => {
      const categoryRisk = assessment?.categoryRisks.find(
        (cr) => cr.categoryId === category.id
      );
      heatmapData.push({
        modelId: model.id,
        modelName: model.name,
        categoryId: category.id,
        categoryName: category.name,
        score: categoryRisk?.score || 0,
        riskLevel: categoryRisk?.riskLevel || "low",
      });
    });
  });

  return heatmapData;
}

export function transformToGaugeData(
  thresholdProximity: number
): {
  value: number;
  maxValue: number;
  zones: Array<{ min: number; max: number; color: string }>;
} {
  return {
    value: thresholdProximity * 100,
    maxValue: 100,
    zones: [
      { min: 0, max: 40, color: "#10b981" },
      { min: 40, max: 70, color: "#f59e0b" },
      { min: 70, max: 90, color: "#ef4444" },
      { min: 90, max: 100, color: "#991b1b" },
    ],
  };
}

export function groupByModel(
  assessments: RiskAssessment[]
): Record<string, RiskAssessment> {
  return assessments.reduce(
    (acc, assessment) => {
      acc[assessment.modelId] = assessment;
      return acc;
    },
    {} as Record<string, RiskAssessment>
  );
}

export function groupByCategory(
  assessments: RiskAssessment[]
): Record<string, Array<{ modelId: string; categoryRisk: any }>> {
  const grouped: Record<string, Array<{ modelId: string; categoryRisk: any }>> =
    {};

  assessments.forEach((assessment) => {
    assessment.categoryRisks.forEach((cr) => {
      if (!grouped[cr.categoryId]) {
        grouped[cr.categoryId] = [];
      }
      grouped[cr.categoryId].push({
        modelId: assessment.modelId,
        categoryRisk: cr,
      });
    });
  });

  return grouped;
}
