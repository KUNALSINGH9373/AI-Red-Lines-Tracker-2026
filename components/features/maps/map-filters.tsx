'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Building2, Cpu, Info } from 'lucide-react';

interface MapFiltersProps {
  onFiltersChange: (filters: {
    showLabs: boolean;
    showDataCenters: boolean;
    showManufacturers: boolean;
  }) => void;
}

export function MapFilters({ onFiltersChange }: MapFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<'labs' | 'data-centers' | 'manufacturers' | null>(null);

  const handleSelectFilter = (filter: 'labs' | 'data-centers' | 'manufacturers') => {
    const newActive = activeFilter === filter ? null : filter;
    setActiveFilter(newActive);
    onFiltersChange({
      showLabs: newActive === 'labs',
      showDataCenters: newActive === 'data-centers',
      showManufacturers: newActive === 'manufacturers',
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="text-sm font-semibold text-muted-foreground">Show:</div>

      <button
        onClick={() => handleSelectFilter('labs')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          activeFilter === 'labs'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Frontier Labs</span>
        <Badge
          variant={activeFilter === 'labs' ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          10
        </Badge>
      </button>

      <button
        onClick={() => handleSelectFilter('data-centers')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          activeFilter === 'data-centers'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">Data Centers</span>
        <Badge
          variant={activeFilter === 'data-centers' ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          18
        </Badge>
      </button>

      <button
        onClick={() => handleSelectFilter('manufacturers')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          activeFilter === 'manufacturers'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Cpu className="h-4 w-4" />
        <span className="text-sm font-medium">Chip Manufacturers</span>
        <Badge
          variant={activeFilter === 'manufacturers' ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          3
        </Badge>
      </button>

      <div className="flex items-center gap-1.5 ml-auto text-xs text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Hover on each facility for more details</span>
      </div>
    </div>
  );
}
