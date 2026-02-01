'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Building2, Cpu } from 'lucide-react';

interface MapFiltersProps {
  onFiltersChange: (filters: {
    showLabs: boolean;
    showDataCenters: boolean;
    showManufacturers: boolean;
  }) => void;
}

export function MapFilters({ onFiltersChange }: MapFiltersProps) {
  const [showLabs, setShowLabs] = useState(true);
  const [showDataCenters, setShowDataCenters] = useState(true);
  const [showManufacturers, setShowManufacturers] = useState(true);

  const handleToggleLabs = () => {
    const newState = !showLabs;
    setShowLabs(newState);
    onFiltersChange({
      showLabs: newState,
      showDataCenters,
      showManufacturers,
    });
  };

  const handleToggleDataCenters = () => {
    const newState = !showDataCenters;
    setShowDataCenters(newState);
    onFiltersChange({
      showLabs,
      showDataCenters: newState,
      showManufacturers,
    });
  };

  const handleToggleManufacturers = () => {
    const newState = !showManufacturers;
    setShowManufacturers(newState);
    onFiltersChange({
      showLabs,
      showDataCenters,
      showManufacturers: newState,
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="text-sm font-semibold text-muted-foreground">Show:</div>

      <button
        onClick={handleToggleLabs}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          showLabs
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Frontier Labs</span>
        <Badge
          variant={showLabs ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          10
        </Badge>
      </button>

      <button
        onClick={handleToggleDataCenters}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          showDataCenters
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">Data Centers</span>
        <Badge
          variant={showDataCenters ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          18
        </Badge>
      </button>

      <button
        onClick={handleToggleManufacturers}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          showManufacturers
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Cpu className="h-4 w-4" />
        <span className="text-sm font-medium">Chip Manufacturers</span>
        <Badge
          variant={showManufacturers ? 'secondary' : 'outline'}
          className="ml-1 text-xs"
        >
          3
        </Badge>
      </button>
    </div>
  );
}
