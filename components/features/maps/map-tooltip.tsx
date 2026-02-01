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

function getLabExternalLinks(labId: string): { label: string; url: string }[] {
  const links: { [key: string]: { label: string; url: string }[] } = {
    openai: [
      { label: 'OpenAI Home', url: 'https://openai.com' },
      { label: 'Safety & Policy', url: 'https://openai.com/safety' },
      { label: 'Research', url: 'https://openai.com/research' },
    ],
    anthropic: [
      { label: 'Anthropic Home', url: 'https://www.anthropic.com' },
      { label: 'Safety & Policy', url: 'https://www.anthropic.com/research' },
      { label: 'Claude API Docs', url: 'https://docs.anthropic.com' },
    ],
    'google-deepmind': [
      { label: 'Google DeepMind', url: 'https://deepmind.google' },
      { label: 'Research', url: 'https://deepmind.google/research' },
      { label: 'Safety & Alignment', url: 'https://deepmind.google/research/safety-alignment' },
    ],
    xai: [
      { label: 'xAI Home', url: 'https://x.ai' },
      { label: 'Grok Models', url: 'https://x.ai' },
      { label: 'Research', url: 'https://x.ai/research' },
    ],
  };
  return links[labId] || [];
}

function getTooltipContent(
  data: FrontierLab | DataCenterExpansion | ChipManufacturer,
  type: 'lab' | 'data-center' | 'manufacturer'
) {
  if (type === 'lab' && 'framework' in data) {
    const lab = data as FrontierLab;
    const externalLinks = getLabExternalLinks(lab.id);

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

        <div className="text-xs pt-2 border-t border-border space-y-2">
          <div className="text-muted-foreground font-medium mb-1">Learn More</div>
          <div className="flex flex-wrap gap-2">
            {externalLinks.map((link, idx) => (
              <a
                key={`lab-link-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {link.label}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
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

    const statusDescriptions = {
      announced: 'Announced but not yet constructed',
      'in-progress': 'Currently under construction',
      operational: 'Fully operational and in use',
    };

    // Build company info links
    const companyLinks: { [key: string]: string } = {
      'OpenAI': 'https://openai.com',
      'Google': 'https://google.com',
      'Microsoft': 'https://microsoft.com',
      'Meta': 'https://meta.com',
      'Amazon': 'https://aws.amazon.com',
      'Anthropic': 'https://anthropic.com',
      'xAI': 'https://x.ai',
      'Tencent': 'https://tencent.com',
      'Alibaba': 'https://alibaba.com',
      'ByteDance': 'https://bytedance.com',
      'NVIDIA': 'https://nvidia.com',
      'SoftBank': 'https://softbank.jp',
    };

    const getCompanyUrl = (company: string): string | null => {
      for (const [name, url] of Object.entries(companyLinks)) {
        if (company.includes(name)) return url;
      }
      return null;
    };

    const companyUrl = getCompanyUrl(dc.company);

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
          <div className="text-muted-foreground">Status Details</div>
          <div className="font-medium mt-0.5">{statusDescriptions[dc.status]}</div>
        </div>

        <div className="text-xs pt-2 border-t border-border">
          <div className="text-muted-foreground">Announced Date</div>
          <div className="font-medium mt-0.5">{dc.announcementDate}</div>
        </div>

        <div className="text-xs pt-2 border-t border-border space-y-2">
          <div className="text-muted-foreground font-medium mb-1">Resources</div>
          <div className="flex flex-wrap gap-2">
            {companyUrl && (
              <a
                key="dc-company"
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Company Info
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {dc.sourceUrl && (
              <a
                key="dc-source"
                href={dc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Official Source
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
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

  if (type === 'manufacturer' && 'chipModels' in data) {
    const mfr = data as ChipManufacturer;

    const manufacturerLinks: { [key: string]: { home: string; products: string } } = {
      'NVIDIA': {
        home: 'https://nvidia.com',
        products: 'https://nvidia.com/en-us/data-center/h100',
      },
      'AMD': {
        home: 'https://amd.com',
        products: 'https://amd.com/en/products/specifications/processors.html',
      },
      'Intel': {
        home: 'https://intel.com',
        products: 'https://intel.com/content/www/us/en/products/details/processors/data-center.html',
      },
    };

    const getLinks = (name: string) => {
      for (const [mfrName, links] of Object.entries(manufacturerLinks)) {
        if (name.includes(mfrName)) return links;
      }
      return null;
    };

    const links = getLinks(mfr.name);

    return (
      <div className="space-y-3">
        <div>
          <div className="font-bold text-base mb-2">{mfr.name}</div>
          <div className="text-xs text-muted-foreground mb-2">
            Leading semiconductor manufacturer for AI infrastructure
          </div>
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

        <div className="text-xs pt-2 border-t border-border space-y-2">
          <div className="text-muted-foreground font-medium">Flagship AI Chips</div>
          <div className="flex flex-wrap gap-1.5">
            {mfr.chipModels.slice(0, 3).map((chip) => (
              <span
                key={chip}
                className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent font-semibold text-xs"
              >
                {chip}
              </span>
            ))}
            {mfr.chipModels.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-muted-foreground text-xs">
                +{mfr.chipModels.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="text-muted-foreground">2025 Shipments</div>
            <div className="font-bold text-base">{mfr.totalShipments2025.toFixed(1)}M</div>
            <div className="text-muted-foreground text-xs">units globally</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Top Export Region</div>
            <div className="font-semibold text-sm">{mfr.topShipmentRegion}</div>
          </div>
        </div>

        <div className="text-xs pt-2 border-t border-border space-y-2">
          <div className="text-muted-foreground font-medium mb-1">Learn More</div>
          <div className="flex flex-wrap gap-2">
            {links && (
              <>
                <a
                  key="mfr-home"
                  href={links.home}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Official Site
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  key="mfr-products"
                  href={links.products}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  AI Products
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </>
            )}
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
