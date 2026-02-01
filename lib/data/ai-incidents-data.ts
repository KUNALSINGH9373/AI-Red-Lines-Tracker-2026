import incidentsData from "@/data/cross-lab/ai-incidents.json";

export interface Incident {
  id: string;
  name: string;
  type: string;
  totalIncidents: number;
  incidentsAsDeployer: number;
  incidentsAsDeveloper: number;
  harmedBy: number;
  implicatedSystem: number;
  relatedEntities: number;
  incidentResponses: number;
}

export interface IncidentsData {
  source: {
    title: string;
    url: string;
    description: string;
    lastUpdated: string;
    summariesUrl: string;
    totalIncidents: number;
  };
  incidents: Incident[];
}

export function getIncidents(): Incident[] {
  return (incidentsData as IncidentsData).incidents;
}

export function getIncidentById(id: string): Incident | undefined {
  return getIncidents().find((incident) => incident.id === id);
}

export function getIncidentByName(name: string): Incident | undefined {
  return getIncidents().find((incident) => incident.name === name);
}

export function getIncidentsSource() {
  return (incidentsData as IncidentsData).source;
}

export function getIncidentsSortedByTotal(): Incident[] {
  return [...getIncidents()].sort(
    (a, b) => b.totalIncidents - a.totalIncidents
  );
}

export function getIncidentsSortedByDeployer(): Incident[] {
  return [...getIncidents()].sort(
    (a, b) => b.incidentsAsDeployer - a.incidentsAsDeployer
  );
}

export function getIncidentsSortedByDeveloper(): Incident[] {
  return [...getIncidents()].sort(
    (a, b) => b.incidentsAsDeveloper - a.incidentsAsDeveloper
  );
}

export function getTotalIncidentsAcrossOrgs(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.totalIncidents, 0);
}

export function getTotalDeployerIncidents(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.incidentsAsDeployer, 0);
}

export function getTotalDeveloperIncidents(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.incidentsAsDeveloper, 0);
}

export function getHarmedByTotal(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.harmedBy, 0);
}

export function getImplicatedSystemsTotal(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.implicatedSystem, 0);
}

export function getRelatedEntitiesTotal(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.relatedEntities, 0);
}

export function getIncidentResponsesTotal(): number {
  return getIncidents().reduce((sum, incident) => sum + incident.incidentResponses, 0);
}

export function getGlobalIncidentTotal(): number {
  return (incidentsData as IncidentsData).source.totalIncidents;
}

export function getIncidentsSourceUrl(): string {
  return (incidentsData as IncidentsData).source.summariesUrl;
}
