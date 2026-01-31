import computeData from "@/data/cross-lab/compute-infrastructure.json";
import type {
  TrainingComputeData,
  DataCenterExpansion,
  ComputeConcentration,
  ChipShipment,
  ComputeInfrastructureData,
  Source,
} from "@/lib/types/risk-data";

export function getTrainingComputeData(): TrainingComputeData[] {
  return (computeData as ComputeInfrastructureData).trainingCompute;
}

export function getTrainingComputeByModel(
  modelId: string
): TrainingComputeData | undefined {
  return getTrainingComputeData().find((d) => d.modelId === modelId);
}

export function getEUActCompliance(): {
  compliant: number;
  nonCompliant: number;
} {
  const data = getTrainingComputeData();
  return {
    compliant: data.filter((d) => d.euActCompliant).length,
    nonCompliant: data.filter((d) => !d.euActCompliant).length,
  };
}

export function getDataCenterExpansions(): DataCenterExpansion[] {
  return (computeData as ComputeInfrastructureData).dataCenterExpansions;
}

export function getDataCentersByCountry(country: string): DataCenterExpansion[] {
  return getDataCenterExpansions().filter(
    (d) => d.location.country === country
  );
}

export function getDataCentersByStatus(
  status: "announced" | "in-progress" | "operational"
): DataCenterExpansion[] {
  return getDataCenterExpansions().filter((d) => d.status === status);
}

export function getComputeConcentration(): ComputeConcentration[] {
  return (computeData as ComputeInfrastructureData).computeConcentration;
}

export function getChipShipments(): ChipShipment[] {
  return (computeData as ComputeInfrastructureData).chipShipments;
}

export function getChipShipmentsByYear(year: number): ChipShipment[] {
  return getChipShipments().filter((c) => c.year === year);
}

export function getChipShipmentsByModel(chipModel: string): ChipShipment[] {
  return getChipShipments().filter((c) => c.chipModel === chipModel);
}

export function getSources(): Source[] {
  return (computeData as ComputeInfrastructureData).sources;
}

export function getLastUpdated(): string {
  return (computeData as ComputeInfrastructureData).lastUpdated;
}

export function getSourceById(sourceId: string): Source | undefined {
  return getSources().find((s) => s.id === sourceId);
}

export function calculateTotalTrainingCompute(): number {
  return getTrainingComputeData().reduce(
    (sum, d) => sum + d.trainingCompute,
    0
  );
}

export function calculateTotalDataCenterCapacity(): number {
  const data = getDataCenterExpansions();
  let totalGW = 0;

  data.forEach((dc) => {
    const capacityStr = dc.capacity;
    const match = capacityStr.match(/(\d+(?:\.\d+)?)\s*(GW|MW|KW)/i);

    if (match) {
      let value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();

      if (unit === "MW") {
        value = value / 1000;
      } else if (unit === "KW") {
        value = value / 1000000;
      }

      totalGW += value;
    }
  });

  return totalGW;
}

export function calculateTotalCapex(): number {
  return getComputeConcentration().reduce(
    (sum, c) => sum + c.capex2024 + c.capex2025_2026,
    0
  );
}

export function getTotalChipShipments(year?: number): number {
  const shipments = year ? getChipShipmentsByYear(year) : getChipShipments();
  return shipments.reduce((sum, s) => sum + s.totalGlobal, 0);
}

export function getShipmentsToUS(year?: number): number {
  const shipments = year ? getChipShipmentsByYear(year) : getChipShipments();
  return shipments.reduce((sum, s) => sum + s.shipmentsToUS, 0);
}

export function getShipmentsToChina(year?: number): number {
  const shipments = year ? getChipShipmentsByYear(year) : getChipShipments();
  return shipments.reduce((sum, s) => sum + s.shipmentsToChina, 0);
}
