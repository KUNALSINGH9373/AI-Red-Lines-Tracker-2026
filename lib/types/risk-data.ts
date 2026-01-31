export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Model {
  id: string;
  name: string;
  family: string;
  releaseDate: string;
  systemCardUrl?: string;
}

export interface ModelsData {
  lab: string;
  models: Model[];
}

export interface RiskCategory {
  id: string;
  name: string;
  description?: string;
}

export interface RiskLevelConfig {
  level: RiskLevel;
  color: string;
  label?: string;
}

export interface CategoryRisk {
  categoryId: string;
  riskLevel: RiskLevel;
  score: number;
  thresholdProximity: number;
  notes?: string;
  mitigations?: string[];
  sourceSection?: string;
}

export interface RiskAssessment {
  modelId: string;
  assessmentDate: string;
  overallRisk: RiskLevel;
  categoryRisks: CategoryRisk[];
}

export interface RiskAssessmentsData {
  lab: string;
  frameworkVersion: string;
  riskCategories: RiskCategory[];
  riskLevels: RiskLevelConfig[];
  assessments: RiskAssessment[];
  lastUpdated?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "model-release" | "framework-update" | "threshold-crossing" | "policy-change";
  title: string;
  description: string;
  modelIds?: string[];
  categoryIds?: string[];
  sourceId?: string;
}

export interface EventsData {
  lab: string;
  events: TimelineEvent[];
}

export interface Source {
  id: string;
  title: string;
  url: string;
  type: "system-card" | "framework" | "policy" | "research";
  publishDate: string;
  pdfPath?: string;
}

export interface SourcesData {
  lab: string;
  sources: Source[];
}

export interface FilterState {
  models: string[];
  categories: string[];
  riskLevels: RiskLevel[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface ComparisonData {
  modelId: string;
  modelName: string;
  categoryId: string;
  categoryName: string;
  riskLevel: RiskLevel;
  score: number;
  thresholdProximity: number;
}
