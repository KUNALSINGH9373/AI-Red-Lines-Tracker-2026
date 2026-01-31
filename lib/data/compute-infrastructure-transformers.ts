import type {
  TrainingComputeData,
  DataCenterExpansion,
  ComputeConcentration,
  ChipShipment,
} from "@/lib/types/risk-data";

export function transformToComputeBarChartData(
  data: TrainingComputeData[]
): Array<{
  name: string;
  modelId: string;
  flops: number;
  logFlops: number;
  organization: string;
  compliant: boolean;
  displayFlops: string;
  source: string;
}> {
  return data
    .sort((a, b) => b.trainingCompute - a.trainingCompute)
    .map((item) => ({
      name: item.modelName,
      modelId: item.modelId,
      flops: item.trainingCompute,
      logFlops: Math.log10(item.trainingCompute),
      organization: item.organization,
      compliant: item.euActCompliant,
      displayFlops: formatScientificNotation(item.trainingCompute),
      source: item.source,
    }));
}

export function transformToDataCenterTimelineData(
  expansions: DataCenterExpansion[]
): Array<{
  date: string;
  dateObj: Date;
  projectName: string;
  company: string;
  location: string;
  capacity: string;
  status: string;
  source: string;
}> {
  return expansions
    .map((dc) => ({
      date: dc.announcementDate,
      dateObj: new Date(dc.announcementDate),
      projectName: dc.projectName,
      company: dc.company,
      location: `${dc.location.city}, ${dc.location.country}`,
      capacity: dc.capacity,
      status: dc.status,
      source: dc.source,
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}

export function transformToConcentrationBarData(
  concentration: ComputeConcentration[]
): Array<{
  entity: string;
  "2024": number;
  "2025-2026": number;
  total: number;
  marketShare: string;
  source: string;
}> {
  return concentration.map((c) => ({
    entity: c.entity,
    "2024": c.capex2024,
    "2025-2026": c.capex2025_2026,
    total: c.capex2024 + c.capex2025_2026,
    marketShare: c.marketShare,
    source: c.source,
  }));
}

export function transformToConcentrationHeatmapData(
  concentration: ComputeConcentration[]
): Array<{
  entity: string;
  capex2024: number;
  capex2025_2026: number;
  marketShare: number;
}> {
  return concentration.map((c) => ({
    entity: c.entity,
    capex2024: c.capex2024,
    capex2025_2026: c.capex2025_2026,
    marketShare: parseFloat(c.marketShare.split("-")[0]) || 0,
  }));
}

export function transformToChipFlowData(
  shipments: ChipShipment[]
): Array<{
  year: number;
  chipModel: string;
  us: number;
  china: number;
  other: number;
  total: number;
  source: string;
}> {
  return shipments.map((s) => ({
    year: s.year,
    chipModel: s.chipModel,
    us: s.shipmentsToUS,
    china: s.shipmentsToChina,
    other: s.totalGlobal - s.shipmentsToUS - s.shipmentsToChina,
    total: s.totalGlobal,
    source: s.source,
  }));
}

export function formatScientificNotation(value: number): string {
  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / Math.pow(10, exponent);

  if (exponent >= 24) {
    return `${mantissa.toFixed(1)} × 10^${exponent}`;
  } else if (exponent >= 12) {
    const trillion = value / 1e12;
    return `${trillion.toFixed(1)}T`;
  } else if (exponent >= 9) {
    const billion = value / 1e9;
    return `${billion.toFixed(1)}B`;
  }

  return value.toFixed(0);
}

export function parseCapacityToGW(capacityStr: string): number {
  const match = capacityStr.match(/(\d+(?:\.\d+)?)\s*(GW|MW|KW)/i);

  if (!match) {
    return 0;
  }

  let value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  if (unit === "MW") {
    value = value / 1000;
  } else if (unit === "KW") {
    value = value / 1000000;
  }

  return value;
}

export function getOrganizationColor(organization: string): string {
  const colors: Record<string, string> = {
    "OpenAI": "#10a37f",
    "Anthropic": "#f97316",
    "Google DeepMind": "#a855f7",
    "xAI": "#22c55e",
    "Meta": "#06b6d4",
    "DeepSeek": "#ef4444",
    "Alibaba": "#ff9900",
    "NVIDIA": "#76b900",
    "Mistral": "#0ea5e9",
  };

  return colors[organization] || "#6b7280";
}

export function getEntityColor(entity: string): string {
  const colors: Record<string, string> = {
    "Alphabet (Google)": "#4285f4",
    "Microsoft": "#00a4ef",
    "Amazon (AWS)": "#ff9900",
    "Meta": "#0668e1",
    "OpenAI Consortium": "#10a37f",
    "Others (Anthropic, xAI, DeepSeek, etc.)": "#8b5cf6",
  };

  return colors[entity] || "#6b7280";
}
