import { FrontierLab, FrontierLabsData } from "@/lib/types/risk-data";

export function getFrontierLabsData(): FrontierLabsData {
  const data = require("@/data/cross-lab/frontier-labs.json");
  return data as FrontierLabsData;
}

export function getFrontierLabs(): FrontierLab[] {
  const data = getFrontierLabsData();
  return data.labs;
}

export function getFrontierLabById(labId: string): FrontierLab | null {
  const labs = getFrontierLabs();
  return labs.find((lab) => lab.id === labId) || null;
}

export function getFrontierLabByName(labName: string): FrontierLab | null {
  const labs = getFrontierLabs();
  return labs.find((lab) => lab.name.toLowerCase() === labName.toLowerCase()) || null;
}

export function getLabCoordinates(labId: string): { lat: number; lng: number } | null {
  const lab = getFrontierLabById(labId);
  return lab ? lab.coordinates : null;
}

export function getLabsByCountry(country: string): FrontierLab[] {
  const labs = getFrontierLabs();
  return labs.filter((lab) => lab.country.toLowerCase() === country.toLowerCase());
}

export function getLabsWithHighestModelCount(): FrontierLab {
  const labs = getFrontierLabs();
  return labs.reduce((max, lab) => (lab.modelCount > max.modelCount ? lab : max));
}

export function getLabsWithMostDataCenters(): FrontierLab {
  const labs = getFrontierLabs();
  return labs.reduce((max, lab) => (lab.dataCenterCount > max.dataCenterCount ? lab : max));
}

export function getLabFrameworkVersion(labId: string): string | null {
  const lab = getFrontierLabById(labId);
  return lab ? lab.framework : null;
}

export function getTotalModelCount(): number {
  const labs = getFrontierLabs();
  return labs.reduce((total, lab) => total + lab.modelCount, 0);
}

export function getTotalDataCenterCount(): number {
  const labs = getFrontierLabs();
  return labs.reduce((total, lab) => total + lab.dataCenterCount, 0);
}
