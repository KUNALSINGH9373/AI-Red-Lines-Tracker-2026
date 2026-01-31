import type {
  RiskLevel,
  RiskAssessment,
  CategoryRisk,
} from "@/lib/types/risk-data";

export function calculateAverageRiskScore(assessment: RiskAssessment): number {
  const scores = assessment.categoryRisks.map((cr) => cr.score);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function calculateAverageThresholdProximity(
  assessment: RiskAssessment
): number {
  const proximities = assessment.categoryRisks.map(
    (cr) => cr.thresholdProximity
  );
  return (
    proximities.reduce((sum, prox) => sum + prox, 0) / proximities.length
  );
}

export function getHighestRiskCategory(
  assessment: RiskAssessment
): CategoryRisk | undefined {
  return assessment.categoryRisks.reduce((highest, current) => {
    const highestScore = getRiskLevelNumeric(highest.riskLevel);
    const currentScore = getRiskLevelNumeric(current.riskLevel);
    return currentScore > highestScore ? current : highest;
  });
}

export function getRiskLevelNumeric(level: RiskLevel): number {
  const levels: Record<RiskLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return levels[level] || 0;
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 0.75) return "high";
  if (score >= 0.5) return "medium";
  if (score >= 0.25) return "low";
  return "low";
}

export function getRiskLevelFromProximity(proximity: number): RiskLevel {
  if (proximity >= 0.9) return "critical";
  if (proximity >= 0.7) return "high";
  if (proximity >= 0.4) return "medium";
  return "low";
}

export function countByRiskLevel(
  assessments: RiskAssessment[]
): Record<string, number> {
  const counts: Record<string, number> = {};

  assessments.forEach((assessment) => {
    const level = assessment.overallRisk;
    counts[level] = (counts[level] || 0) + 1;
  });

  return counts;
}

export function getCategoriesAboveThreshold(
  assessment: RiskAssessment,
  threshold: number
): CategoryRisk[] {
  return assessment.categoryRisks.filter(
    (cr) => cr.thresholdProximity >= threshold
  );
}

export function getTrendingRisk(
  assessments: RiskAssessment[],
  categoryId: string
): "increasing" | "stable" | "decreasing" | "unknown" {
  const relevantAssessments = assessments
    .filter((a) => a.categoryRisks.some((cr) => cr.categoryId === categoryId))
    .sort(
      (a, b) =>
        new Date(a.assessmentDate).getTime() -
        new Date(b.assessmentDate).getTime()
    );

  if (relevantAssessments.length < 2) return "unknown";

  const scores = relevantAssessments.map(
    (a) =>
      a.categoryRisks.find((cr) => cr.categoryId === categoryId)?.score || 0
  );

  const recent = scores.slice(-3);
  const avgRecent = recent.reduce((sum, s) => sum + s, 0) / recent.length;

  const older = scores.slice(0, -3);
  if (older.length === 0) return "unknown";

  const avgOlder = older.reduce((sum, s) => sum + s, 0) / older.length;

  const difference = avgRecent - avgOlder;

  if (Math.abs(difference) < 0.05) return "stable";
  return difference > 0 ? "increasing" : "decreasing";
}

export function formatRiskScore(score: number): string {
  return (score * 100).toFixed(0) + "%";
}

export function formatThresholdProximity(proximity: number): string {
  return (proximity * 100).toFixed(0) + "%";
}
