'use client';

interface ShipmentRegion {
  id: string;
  region: string;
  polygon: [number, number][];
  color: string;
}

interface ShipmentRegionOverlayProps {
  regions: ShipmentRegion[];
  projection?: (coords: [number, number]) => [number, number] | null;
}

export function ShipmentRegionOverlay({ regions, projection }: ShipmentRegionOverlayProps) {
  const convertPolygonToPath = (polygon: [number, number][]): string => {
    return polygon
      .map((point, index) => {
        const projected = projection ? projection(point) : point;
        if (!projected) return '';
        return `${index === 0 ? 'M' : 'L'} ${projected[0]} ${projected[1]}`;
      })
      .join(' ');
  };

  return (
    <g className="shipment-regions">
      {regions.map((region) => (
        <path
          key={region.id}
          d={convertPolygonToPath(region.polygon)}
          fill={region.color}
          stroke="none"
          opacity={0.2}
        />
      ))}
    </g>
  );
}
