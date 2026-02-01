'use client';

import { FrontierLab, DataCenterExpansion, ChipManufacturer } from '@/lib/types/risk-data';
import { ExternalLink, MapPin, Building2, Cpu, Globe } from 'lucide-react';

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
      className="fixed bg-popover/95 backdrop-blur-sm border-2 border-border rounded-xl shadow-2xl p-4 z-50 pointer-events-auto text-sm max-w-sm"
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
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-base mb-1">{lab.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">{lab.city}</span>
              {lab.state && <span>, {lab.state}</span>}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Globe className="w-3 h-3" />
              <span className="font-medium">{lab.country}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="text-muted-foreground">Models Released</div>
            <div className="font-bold text-base">{lab.modelCount}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Data Centers</div>
            <div className="font-bold text-base">{lab.dataCenterCount}</div>
          </div>
        </div>

        <div className="text-xs pt-2 border-t border-border space-y-1">
          <div className="text-muted-foreground">Latest Model</div>
          <div className="font-semibold">{lab.latestModel}</div>
          <div className="text-muted-foreground">Released: {lab.latestReleaseDate}</div>
        </div>

        <div className="text-xs pt-2 border-t border-border">
          <div className="text-muted-foreground mb-1">Risk Framework</div>
          <div className="font-medium">{lab.framework}</div>
        </div>

        <a
          href={`/${lab.id}`}
          className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 pt-2 border-t border-border transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Lab Dashboard
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  if (type === 'data-center' && 'projectName' in data) {
    const dc = data as DataCenterExpansion;
    const statusColors = {
      announced: 'text-amber-600 bg-amber-600/10',
      'in-progress': 'text-blue-600 bg-blue-600/10',
      operational: 'text-green-600 bg-green-600/10',
    };

    return (
      <div className="space-y-3">
        <div>
          <div className="font-bold text-base mb-1">{dc.projectName}</div>
          <div className="text-xs font-medium text-muted-foreground mb-2">{dc.company}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{dc.location.city}</span>
            {dc.location.state && <span>, {dc.location.state}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Globe className="w-3 h-3" />
            <span className="font-medium">{dc.location.country}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="text-muted-foreground">Capacity</div>
            <div className="font-bold text-sm">{dc.capacity}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Status</div>
            <div className={`inline-flex px-2 py-0.5 rounded font-semibold text-xs capitalize ${statusColors[dc.status]}`}>
              {dc.status.replace('-', ' ')}
            </div>
          </div>
        </div>

        <div className="text-xs pt-2 border-t border-border">
          <div className="text-muted-foreground">Announced</div>
          <div className="font-medium mt-0.5">{dc.announcementDate}</div>
        </div>

        {dc.sourceUrl && (
          <a
            href={dc.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 pt-2 border-t border-border transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Source
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  if (type === 'manufacturer' && 'chipModels' in data) {
    const mfr = data as ChipManufacturer;
    return (
      <div className="space-y-3">
        <div>
          <div className="font-bold text-base mb-2">{mfr.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{mfr.city}</span>
            {mfr.state && <span>, {mfr.state}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Globe className="w-3 h-3" />
            <span className="font-medium">{mfr.country}</span>
          </div>
        </div>

        <div className="text-xs pt-2 border-t border-border space-y-1">
          <div className="text-muted-foreground">Chip Models</div>
          <div className="font-semibold">{mfr.chipModels.join(', ')}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="text-muted-foreground">2025 Shipments</div>
            <div className="font-bold text-base">{mfr.totalShipments2025.toFixed(1)}M units</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Top Region</div>
            <div className="font-semibold text-sm">{mfr.topShipmentRegion}</div>
          </div>
        </div>

        <a
          href="/compute-infrastructure"
          className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 pt-2 border-t border-border transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Infrastructure Dashboard
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return null;
}
