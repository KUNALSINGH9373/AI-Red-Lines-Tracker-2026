'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { FrontierLab, DataCenterExpansion, ChipManufacturer } from '@/lib/types/risk-data';
import { MapMarker } from './map-marker';
import { MapTooltip } from './map-tooltip';
import { MapLegend } from './map-legend';
import { getFrontierLabs } from '@/lib/data/frontier-labs-data';
import { getChipManufacturers, getShipmentZones } from '@/lib/data/chip-manufacturers-data';
import { getDataCenterExpansions } from '@/lib/data/compute-infrastructure-data';

const geoUrl = '/maps/world-110m.json';

interface WorldMapProps {
  showLabs?: boolean;
  showDataCenters?: boolean;
  showManufacturers?: boolean;
  showShipmentRegions?: boolean;
  height?: number;
}

export function WorldMap({
  showLabs = true,
  showDataCenters = true,
  showManufacturers = true,
  showShipmentRegions = true,
  height = 600,
}: WorldMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<{
    type: 'lab' | 'data-center' | 'manufacturer';
    data: FrontierLab | DataCenterExpansion | ChipManufacturer;
    x: number;
    y: number;
  } | null>(null);

  // Load data
  const labs = useMemo(() => (showLabs ? getFrontierLabs() : []), [showLabs]);
  const dataCenters = useMemo(
    () => (showDataCenters ? getDataCenterExpansions() : []),
    [showDataCenters]
  );
  const manufacturers = useMemo(
    () => (showManufacturers ? getChipManufacturers() : []),
    [showManufacturers]
  );
  const shipmentZones = useMemo(
    () => (showShipmentRegions ? getShipmentZones() : []),
    [showShipmentRegions]
  );

  const getDataCenterColor = (status: string) => {
    switch (status) {
      case 'announced':
        return '#f59e0b';
      case 'in-progress':
        return '#3b82f6';
      case 'operational':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const handleMarkerHover = (
    event: any,
    type: 'lab' | 'data-center' | 'manufacturer',
    data: FrontierLab | DataCenterExpansion | ChipManufacturer
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredMarker({
      type,
      data,
      x: event.clientX,
      y: event.clientY - 10,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <ComposableMap projection="geoEqualEarth">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: 'var(--color-muted-foreground)',
                      fillOpacity: 0.08,
                      stroke: 'var(--color-border)',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    hover: {
                      fill: 'var(--color-muted-foreground)',
                      fillOpacity: 0.12,
                      stroke: 'var(--color-border)',
                      strokeWidth: 0.75,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: 'var(--color-muted-foreground)',
                      fillOpacity: 0.15,
                      stroke: 'var(--color-border)',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Shipment region overlays */}
          {showShipmentRegions && shipmentZones.map((zone) => (
            <g key={zone.id} className="shipment-region" opacity={0.15}>
              <text
                x={zone.id === 'us-zone' ? -100 : 100}
                y={zone.id === 'us-zone' ? 35 : 35}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill="currentColor"
                opacity={0.5}
              >
                {zone.region}
              </text>
            </g>
          ))}

          {/* Lab HQs */}
          {showLabs &&
            labs.map((lab) => (
              <Marker
                key={lab.id}
                coordinates={[lab.coordinates.lng, lab.coordinates.lat]}
              >
                <g
                  onMouseMove={(e) => handleMarkerHover(e, 'lab', lab)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={8}
                    fill={lab.primaryColor}
                    opacity={0.8}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={11}
                    fill={lab.primaryColor}
                    opacity={0.2}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                </g>
              </Marker>
            ))}

          {/* Data Centers */}
          {showDataCenters &&
            dataCenters.map((dc) => {
              const hasCoords = dc.location.coordinates;
              if (!hasCoords) return null;

              return (
                <Marker
                  key={dc.id}
                  coordinates={[
                    hasCoords.lng,
                    hasCoords.lat,
                  ]}
                >
                  <g
                    onMouseMove={(e) => handleMarkerHover(e, 'data-center', dc)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={5}
                      fill={getDataCenterColor(dc.status)}
                      opacity={0.7}
                      style={{ transition: 'opacity 0.2s' }}
                    />
                    <circle
                      cx={0}
                      cy={0}
                      r={8}
                      fill={getDataCenterColor(dc.status)}
                      opacity={0.15}
                      style={{ transition: 'opacity 0.2s' }}
                    />
                  </g>
                </Marker>
              );
            })}

          {/* Chip Manufacturers */}
          {showManufacturers &&
            manufacturers.map((mfr) => (
              <Marker
                key={mfr.id}
                coordinates={[mfr.coordinates.lng, mfr.coordinates.lat]}
              >
                <g
                  onMouseMove={(e) => handleMarkerHover(e, 'manufacturer', mfr)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Square marker for manufacturers */}
                  <rect
                    x={-5}
                    y={-5}
                    width={10}
                    height={10}
                    fill={mfr.primaryColor}
                    opacity={0.8}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                  <rect
                    x={-8}
                    y={-8}
                    width={16}
                    height={16}
                    fill={mfr.primaryColor}
                    opacity={0.15}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                </g>
              </Marker>
            ))}
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {hoveredMarker && (
        <MapTooltip
          x={hoveredMarker.x}
          y={hoveredMarker.y}
          visible={true}
          data={hoveredMarker.data}
          type={hoveredMarker.type}
        />
      )}

      {/* Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3" />
        <MapLegend
          showLabs={showLabs}
          showDataCenters={showDataCenters}
          showManufacturers={showManufacturers}
          showShipmentRegions={showShipmentRegions}
        />
      </div>
    </div>
  );
}
