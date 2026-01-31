'use client';

interface LegendItem {
  label: string;
  color: string;
  description?: string;
}

interface MapLegendProps {
  showLabs?: boolean;
  showDataCenters?: boolean;
  showManufacturers?: boolean;
  showShipmentRegions?: boolean;
}

export function MapLegend({
  showLabs = true,
  showDataCenters = true,
  showManufacturers = true,
  showShipmentRegions = true,
}: MapLegendProps) {
  const labColors = [
    { label: 'OpenAI', color: '#10a37f', description: 'San Francisco' },
    { label: 'Anthropic', color: '#f97316', description: 'San Francisco' },
    { label: 'Google DeepMind', color: '#4285f4', description: 'London' },
    { label: 'xAI', color: '#8B5CF6', description: 'Palo Alto' },
  ];

  const dataCenterStatuses = [
    { label: 'Announced', color: '#f59e0b', description: 'Planned' },
    { label: 'In Progress', color: '#3b82f6', description: 'Under development' },
    { label: 'Operational', color: '#10b981', description: 'Active' },
  ];

  const manufacturerColors = [
    { label: 'NVIDIA', color: '#76B900', description: 'Santa Clara' },
    { label: 'AMD', color: '#ED1C24', description: 'Santa Clara' },
    { label: 'Intel', color: '#0071C5', description: 'Santa Clara' },
  ];

  const shipmentRegions = [
    { label: 'USA', color: 'rgba(59, 130, 246, 0.2)', description: '~85% of shipments' },
    { label: 'China', color: 'rgba(239, 68, 68, 0.2)', description: '~0.2% of shipments' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {showLabs && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Frontier AI Labs</h4>
          <div className="space-y-2">
            {labColors.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDataCenters && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold mb-2">Data Center Status</h4>
          <div className="space-y-2">
            {dataCenterStatuses.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showManufacturers && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold mb-2">Chip Manufacturers</h4>
          <div className="space-y-2">
            {manufacturerColors.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showShipmentRegions && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold mb-2">Chip Shipment Zones</h4>
          <div className="space-y-2">
            {shipmentRegions.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 flex-shrink-0"
                  style={{ backgroundColor: item.color, border: '1px solid #666' }}
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
