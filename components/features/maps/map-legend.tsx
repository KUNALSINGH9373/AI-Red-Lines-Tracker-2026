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
}

export function MapLegend({
  showLabs = true,
  showDataCenters = true,
  showManufacturers = true,
}: MapLegendProps) {
  const labColors = [
    { label: 'OpenAI', color: '#10a37f', description: 'San Francisco' },
    { label: 'Anthropic', color: '#f97316', description: 'San Francisco' },
    { label: 'Google DeepMind', color: '#4285f4', description: 'London' },
    { label: 'xAI', color: '#8B5CF6', description: 'Palo Alto' },
    { label: 'Baidu', color: '#DE3C31', description: 'Beijing' },
    { label: 'Alibaba', color: '#FF6A00', description: 'Hangzhou' },
    { label: 'ByteDance', color: '#000000', description: 'Beijing' },
    { label: 'Tencent', color: '#2B5CE6', description: 'Shenzhen' },
    { label: 'DeepSeek', color: '#5A67D8', description: 'Hangzhou' },
    { label: 'Moonshot AI', color: '#1E3A8A', description: 'Beijing' },
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
    </div>
  );
}
