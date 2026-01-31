import modelsData from "@/data/xai/models.json";
import riskAssessmentsData from "@/data/xai/risk-assessments.json";
import eventsData from "@/data/xai/events.json";
import sourcesData from "@/data/xai/sources.json";
import type {
  ModelsData,
  RiskAssessmentsData,
  EventsData,
  SourcesData,
  Model,
  RiskAssessment,
  TimelineEvent,
  Source,
  RiskCategory,
  RiskLevelConfig,
  CategoryRisk,
} from "@/lib/types/risk-data";

// Model accessors
export function getModels(): Model[] {
  return (modelsData as ModelsData).models;
}

export function getModelById(id: string): Model | undefined {
  return getModels().find((model) => model.id === id);
}

// Risk category and level accessors
export function getRiskCategories(): RiskCategory[] {
  return (riskAssessmentsData as RiskAssessmentsData).riskCategories;
}

export function getRiskLevels(): RiskLevelConfig[] {
  return (riskAssessmentsData as RiskAssessmentsData).riskLevels;
}

// Risk assessment accessors
export function getRiskAssessments(): RiskAssessment[] {
  return (riskAssessmentsData as RiskAssessmentsData).assessments;
}

export function getRiskAssessmentByModelId(
  modelId: string
): RiskAssessment | undefined {
  return getRiskAssessments().find(
    (assessment) => assessment.modelId === modelId
  );
}

export function getLatestAssessmentDate(): string {
  const assessments = getRiskAssessments();
  const dates = assessments.map((a) => new Date(a.assessmentDate));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  return latest.toISOString().split("T")[0];
}

export function getCategoryRiskForModel(
  modelId: string,
  categoryId: string
): CategoryRisk | undefined {
  const assessment = getRiskAssessmentByModelId(modelId);
  return assessment?.categoryRisks.find((cr) => cr.categoryId === categoryId);
}

// Event accessors
export function getEvents(): TimelineEvent[] {
  return (eventsData as EventsData).events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEventById(id: string): TimelineEvent | undefined {
  return getEvents().find((event) => event.id === id);
}

export function getEventsByModelId(modelId: string): TimelineEvent[] {
  return getEvents().filter((event) =>
    event.modelIds?.includes(modelId)
  );
}

export function getEventsByCategoryId(categoryId: string): TimelineEvent[] {
  return getEvents().filter((event) =>
    event.categoryIds?.includes(categoryId)
  );
}

// Source accessors
export function getSources(): Source[] {
  return (sourcesData as SourcesData).sources;
}

export function getSourceById(id: string): Source | undefined {
  return getSources().find((source) => source.id === id);
}

// Framework metadata accessors
export function getFrameworkVersion(): string {
  return (riskAssessmentsData as RiskAssessmentsData).frameworkVersion;
}

export function getLastUpdated(): string {
  return (
    (riskAssessmentsData as RiskAssessmentsData).lastUpdated ||
    getLatestAssessmentDate()
  );
}

// Utility accessors
export function getRiskLevelColor(level: string): string {
  const riskLevel = getRiskLevels().find((rl) => rl.level === level);
  return riskLevel?.color || "#6b7280";
}

export function getRiskLevelLabel(level: string): string {
  const riskLevel = getRiskLevels().find((rl) => rl.level === level);
  return riskLevel?.label || level;
}
