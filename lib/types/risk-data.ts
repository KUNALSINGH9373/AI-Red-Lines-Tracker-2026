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

export interface BenchmarkResult {
  modelId: string;
  lab: "openai" | "anthropic" | "google-deepmind";
  timeToComplete: string;
  successRate: number;
  notes?: string;
}

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  publishDate: string;
  sourceUrl: string;
  results: BenchmarkResult[];
}

export interface RedLineDefinition {
  id: string;
  lab: "openai" | "anthropic" | "google-deepmind";
  categoryId: string;
  definition: string;
  frameworkVersion: string;
  sourceSection: string;
  quantitative: boolean;
}

export interface ConvergenceDivergence {
  convergence: string[];
  divergence: string[];
}

export interface AiRndBenchmarksData {
  benchmarks: Benchmark[];
  redLineDefinitions: RedLineDefinition[];
  convergenceDivergence: ConvergenceDivergence;
}

export interface TrainingComputeData {
  modelId: string;
  modelName: string;
  organization: string;
  releaseDate: string;
  trainingCompute: number; // in FLOP
  euActCompliant: boolean;
  source: string;
  sourceUrl?: string;
}

export interface DataCenterExpansion {
  id: string;
  projectName: string;
  company: string;
  location: {
    city: string;
    state?: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  capacity: string; // e.g., "902 MW" or "10 GW"
  announcementDate: string;
  status: "announced" | "in-progress" | "operational";
  source: string;
  sourceUrl?: string;
}

export interface ComputeConcentration {
  entity: string;
  capex2024: number; // in billions USD
  capex2025_2026: number; // in billions USD
  marketShare: string; // e.g., "15-20%"
  source: string;
  sourceUrl?: string;
}

export interface ChipShipment {
  id: string;
  year: number;
  chipModel: string;
  shipmentsToUS: number; // millions of units
  shipmentsToChina: number; // millions of units
  totalGlobal: number; // millions of units
  source: string;
  sourceUrl?: string;
}

export interface ComputeInfrastructureData {
  trainingCompute: TrainingComputeData[];
  dataCenterExpansions: DataCenterExpansion[];
  computeConcentration: ComputeConcentration[];
  chipShipments: ChipShipment[];
  sources: Source[];
  lastUpdated: string;
}
