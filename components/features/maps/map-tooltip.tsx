'use client';

import { FrontierLab, DataCenterExpansion, ChipManufacturer } from '@/lib/types/risk-data';

interface MapTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  data: FrontierLab | DataCenterExpansion | ChipManufacturer | null;
  type: 'lab' | 'data-center' | 'manufacturer';
}

export function MapTooltip({ x, y, visible, data, type }: MapTooltipProps) {
  if (!visible || !data) return null;

  const content = getTooltipContent(data, type);

  return (
    <div
      className="fixed bg-popover border border-border rounded-lg shadow-lg p-3 z-50 pointer-events-none text-sm max-w-xs"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      {content}
    </div>
  );
}

function getTooltipContent(
  data: FrontierLab | DataCenterExpansion | ChipManufacturer,
  type: 'lab' | 'data-center' | 'manufacturer'
) {
  if (type === 'lab' && 'framework' in data) {
    const lab = data as FrontierLab;
    return (
      <div className="space-y-2">
        <div className="font-semibold">{lab.name}</div>
        <div className="text-xs text-muted-foreground">
          {lab.city}
          {lab.state ? `, ${lab.state}` : ''}, {lab.country}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border">
          <div>
            <span className="text-muted-foreground">Models:</span> {lab.modelCount}
          </div>
          <div>
            <span className="text-muted-foreground">Data Centers:</span> {lab.dataCenterCount}
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Latest:</span> {lab.latestModel} ({lab.latestReleaseDate})
          </div>
        </div>
        <div className="text-xs text-muted-foreground pt-1 border-t border-border">
          {lab.framework}
        </div>
      </div>
    );
  }

  if (type === 'data-center' && 'projectName' in data) {
    const dc = data as DataCenterExpansion;
    const statusColors = {
      announced: 'text-amber-600',
      'in-progress': 'text-blue-600',
      operational: 'text-green-600',
    };

    return (
      <div className="space-y-2">
        <div className="font-semibold">{dc.projectName}</div>
        <div className="text-xs text-muted-foreground">{dc.company}</div>
        <div className="text-xs text-muted-foreground">
          {dc.location.city}
          {dc.location.state ? `, ${dc.location.state}` : ''}, {dc.location.country}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border">
          <div>
            <span className="text-muted-foreground">Capacity:</span> {dc.capacity}
          </div>
          <div>
            <span className={`font-semibold capitalize ${statusColors[dc.status]}`}>
              {dc.status.replace('-', ' ')}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Announced:</span> {dc.announcementDate}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'manufacturer' && 'chipModels' in data) {
    const mfr = data as ChipManufacturer;
    return (
      <div className="space-y-2">
        <div className="font-semibold">{mfr.name}</div>
        <div className="text-xs text-muted-foreground">
          {mfr.city}
          {mfr.state ? `, ${mfr.state}` : ''}, {mfr.country}
        </div>
        <div className="text-xs text-muted-foreground pt-1 border-t border-border">
          <span className="font-semibold">Chips:</span> {mfr.chipModels.join(', ')}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div>
            <span className="text-muted-foreground">2025 Shipments:</span> {mfr.totalShipments2025.toFixed(1)}M
          </div>
          <div>
            <span className="text-muted-foreground">Top Region:</span> {mfr.topShipmentRegion}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
