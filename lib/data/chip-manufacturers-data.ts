import { ChipManufacturer, ShipmentZone, ChipManufacturersData } from "@/lib/types/risk-data";

export function getChipManufacturersData(): ChipManufacturersData {
  const data = require("@/data/cross-lab/chip-manufacturers.json");
  return data as ChipManufacturersData;
}

export function getChipManufacturers(): ChipManufacturer[] {
  const data = getChipManufacturersData();
  return data.manufacturers;
}

export function getChipManufacturerById(manufacturerId: string): ChipManufacturer | null {
  const manufacturers = getChipManufacturers();
  return manufacturers.find((mfr) => mfr.id === manufacturerId) || null;
}

export function getChipManufacturerByName(manufacturerName: string): ChipManufacturer | null {
  const manufacturers = getChipManufacturers();
  return (
    manufacturers.find((mfr) => mfr.name.toLowerCase() === manufacturerName.toLowerCase()) ||
    null
  );
}

export function getShipmentZones(): ShipmentZone[] {
  const data = getChipManufacturersData();
  return data.shipmentZones;
}

export function getShipmentZoneById(zoneId: string): ShipmentZone | null {
  const zones = getShipmentZones();
  return zones.find((zone) => zone.id === zoneId) || null;
}

export function getShipmentZoneByRegion(region: string): ShipmentZone | null {
  const zones = getShipmentZones();
  return zones.find((zone) => zone.region.toLowerCase() === region.toLowerCase()) || null;
}

export function getManufacturerCoordinates(manufacturerId: string): { lat: number; lng: number } | null {
  const mfr = getChipManufacturerById(manufacturerId);
  return mfr ? mfr.coordinates : null;
}

export function getTotalShipments2025(): number {
  const manufacturers = getChipManufacturers();
  return manufacturers.reduce((total, mfr) => total + mfr.totalShipments2025, 0);
}

export function getChipModels(): string[] {
  const manufacturers = getChipManufacturers();
  const models = new Set<string>();
  manufacturers.forEach((mfr) => {
    mfr.chipModels.forEach((model) => models.add(model));
  });
  return Array.from(models);
}

export function getManufacturersByRegion(region: string): ChipManufacturer[] {
  const manufacturers = getChipManufacturers();
  return manufacturers.filter((mfr) => mfr.topShipmentRegion === region);
}

export function getTopManufacturerByShipments(): ChipManufacturer {
  const manufacturers = getChipManufacturers();
  return manufacturers.reduce((max, mfr) =>
    mfr.totalShipments2025 > max.totalShipments2025 ? mfr : max
  );
}
