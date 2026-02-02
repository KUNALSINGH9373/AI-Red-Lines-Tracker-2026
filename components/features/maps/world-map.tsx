'use client';

import { useState, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { FrontierLab, DataCenterExpansion, ChipManufacturer } from '@/lib/types/risk-data';
import { MapTooltip } from './map-tooltip';
import { getFrontierLabs } from '@/lib/data/frontier-labs-data';
import { getChipManufacturers } from '@/lib/data/chip-manufacturers-data';
import { getDataCenterExpansions } from '@/lib/data/compute-infrastructure-data';
import { calculateAdjustedLabels } from '@/lib/utils/label-collision';

const geoUrl = '/maps/world-110m.json';

interface WorldMapProps {
  showLabs?: boolean;
  showDataCenters?: boolean;
  showManufacturers?: boolean;
  height?: number;
}

export function WorldMap({
  showLabs = true,
  showDataCenters = true,
  showManufacturers = true,
  height = 1100,
}: WorldMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<{
    type: 'lab' | 'data-center' | 'manufacturer';
    data: FrontierLab | DataCenterExpansion | ChipManufacturer;
    x: number;
    y: number;
  } | null>(null);
  const [pinnedMarker, setPinnedMarker] = useState<{
    type: 'lab' | 'data-center' | 'manufacturer';
    data: FrontierLab | DataCenterExpansion | ChipManufacturer;
    x: number;
    y: number;
  } | null>(null);

  // Ensure component only renders on client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside to close pinned tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pinnedMarker) {
        const target = event.target as HTMLElement;
        // Check if click is on the tooltip or map
        const isOnTooltip = target.closest('[class*="max-w-sm"]') !== null;
        const isOnMap = target.closest('svg') !== null;

        // If click is outside both tooltip and map, close the pinned marker
        if (!isOnTooltip && !isOnMap) {
          setPinnedMarker(null);
          setHoveredMarker(null);
        }
      }
    };

    if (isClient) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [pinnedMarker, isClient]);

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

  // Pre-calculate label distances with collision detection (recursive adjustment)
  const labDistances = useMemo(() => {
    const rayLengths = [90, 110, 130, 100, 85, 80, 75, 90, 110, 120, 110];
    const configs = labs.map((lab, index) => {
      // Special handling for China-based labs to push labels downward
      const isChina = lab.country === 'China';
      const angleOffset = isChina ? 180 : 0; // Push China labs downward (opposite direction)

      return {
        id: lab.id,
        angle: (index * (360 / labs.length) + 45 + angleOffset) * Math.PI / 180,
        baseDistance: rayLengths[index % rayLengths.length],
        width: 120,
        height: 24,
      };
    });
    return calculateAdjustedLabels(configs, height);
  }, [labs, height]);

  const dcDistances = useMemo(() => {
    const rayLengths = [75, 95, 115, 85, 105, 125, 80, 100, 120, 90, 110, 130, 88, 108, 98, 118, 93, 113];
    const configs = dataCenters
      .filter(dc => dc.location.coordinates)
      .map((dc, dataIndex) => {
        const dcAtSameLocation = dataCenters.filter(d =>
          d.location.coordinates &&
          d.location.coordinates.lat === dc.location.coordinates!.lat &&
          d.location.coordinates.lng === dc.location.coordinates!.lng
        );
        const indexInGroup = dcAtSameLocation.indexOf(dc);
        const groupSize = dcAtSameLocation.length;
        const angleOffset = (indexInGroup * (360 / Math.max(groupSize, 1))) * Math.PI / 180;
        const baseAngle = (dataIndex * (360 / dataCenters.length) + 15) * Math.PI / 180;
        return {
          id: dc.id,
          angle: baseAngle + angleOffset,
          baseDistance: rayLengths[(dataIndex + indexInGroup) % rayLengths.length],
          width: 150,
          height: 32,
        };
      });
    return calculateAdjustedLabels(configs, height);
  }, [dataCenters, height]);

  const mfrDistances = useMemo(() => {
    const rayLengths = [85, 105, 125];
    const configs = manufacturers.map((mfr, index) => ({
      id: mfr.id,
      angle: (index * (360 / manufacturers.length) + 90) * Math.PI / 180,
      baseDistance: rayLengths[index % rayLengths.length],
      width: 110,
      height: 22,
    }));
    return calculateAdjustedLabels(configs, height);
  }, [manufacturers, height]);

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
    // Don't show hover tooltip if a marker is pinned
    if (pinnedMarker) return;

    setHoveredMarker({
      type,
      data,
      x: event.clientX,
      y: event.clientY - 10,
    });
  };

  const handleMarkerClick = (
    event: any,
    type: 'lab' | 'data-center' | 'manufacturer',
    data: FrontierLab | DataCenterExpansion | ChipManufacturer
  ) => {
    event.stopPropagation();

    // If this marker is already pinned, unpin it
    if (pinnedMarker && pinnedMarker.data === data) {
      setPinnedMarker(null);
      setHoveredMarker(null);
      return;
    }

    // Pin this marker
    setPinnedMarker({
      type,
      data,
      x: event.clientX,
      y: event.clientY - 10,
    });
  };

  if (!isClient) {
    return (
      <div
        className="border border-border rounded-lg overflow-hidden bg-card"
        style={{ height: `${height}px` }}
      >
        <div className="w-full h-full bg-muted/50 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center" style={{ height: `${height}px` }}>
        <ComposableMap projection="geoEqualEarth" width={960} height={height}>
          {/* Ocean areas - decorative background */}
          <defs>
            <radialGradient id="ocean-glow">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isOcean = !geo.properties.name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isOcean ? 'url(#ocean-glow)' : 'var(--color-muted-foreground)',
                        fillOpacity: isOcean ? 0.3 : 0.15,
                        stroke: 'var(--color-border)',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isOcean ? 'url(#ocean-glow)' : 'var(--color-muted-foreground)',
                        fillOpacity: isOcean ? 0.4 : 0.25,
                        stroke: 'var(--color-border)',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: isOcean ? 'url(#ocean-glow)' : 'var(--color-muted-foreground)',
                        fillOpacity: isOcean ? 0.5 : 0.3,
                        stroke: 'var(--color-border)',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Ocean region labels */}
          <Marker coordinates={[-30, 0]}>
            <text
              textAnchor="middle"
              fontSize="14"
              fill="#0ea5e9"
              opacity={0.3}
              fontWeight="600"
              letterSpacing="3"
              pointerEvents="none"
            >
              ATLANTIC
            </text>
          </Marker>
          <Marker coordinates={[100, 0]}>
            <text
              textAnchor="middle"
              fontSize="14"
              fill="#0ea5e9"
              opacity={0.3}
              fontWeight="600"
              letterSpacing="3"
              pointerEvents="none"
            >
              PACIFIC
            </text>
          </Marker>
          <Marker coordinates={[60, -30]}>
            <text
              textAnchor="middle"
              fontSize="14"
              fill="#0ea5e9"
              opacity={0.3}
              fontWeight="600"
              letterSpacing="3"
              pointerEvents="none"
            >
              INDIAN OCEAN
            </text>
          </Marker>


          {/* Lab HQs - Radial sun rays with collision detection */}
          {showLabs &&
            labs.map((lab, index) => {
              // Calculate radial angle for this marker (spread evenly)
              const angle = (index * (360 / labs.length) + 45) * Math.PI / 180;
              // Use adjusted ray length from collision detection
              const rayLength = labDistances.get(lab.id) || 90;
              const labelX = Math.cos(angle) * rayLength;
              const labelY = Math.sin(angle) * rayLength;

              return (
                <Marker key={lab.id} coordinates={[lab.coordinates.lng, lab.coordinates.lat]}>
                  <g>
                    {/* Radial ray line */}
                    <line
                      x1={0}
                      y1={0}
                      x2={labelX}
                      y2={labelY}
                      stroke={lab.primaryColor}
                      strokeWidth={1.5}
                      opacity={0.6}
                      pointerEvents="none"
                    />
                    {/* Arrow end */}
                    <circle
                      cx={labelX}
                      cy={labelY}
                      r={2}
                      fill={lab.primaryColor}
                      opacity={0.8}
                    />

                    {/* Marker at center */}
                    <g pointerEvents="none">
                      <circle
                        cx={0}
                        cy={0}
                        r={7}
                        fill={lab.primaryColor}
                        opacity={0.95}
                        stroke="white"
                        strokeWidth={2}
                      />
                      <circle
                        cx={0}
                        cy={0}
                        r={11}
                        fill={lab.primaryColor}
                        opacity={0.3}
                      />
                    </g>

                    {/* Label at ray end - Interactive */}
                    <g
                      onMouseMove={(e) => handleMarkerHover(e, 'lab', lab)}
                      onMouseLeave={() => !pinnedMarker && setHoveredMarker(null)}
                      onClick={(e) => handleMarkerClick(e, 'lab', lab)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={labelX - 60}
                        y={labelY - 12}
                        width={120}
                        height={24}
                        fill="rgba(0,0,0,0.9)"
                        rx={4}
                        stroke={lab.primaryColor}
                        strokeWidth={1.5}
                      />
                      <text
                        x={labelX}
                        y={labelY + 5}
                        fontSize="11"
                        fontWeight="700"
                        fill={lab.primaryColor}
                        textAnchor="middle"
                      >
                        {lab.name}
                      </text>
                    </g>
                  </g>
                </Marker>
              );
            })}

          {/* Data Centers - Radial sun rays with collision detection */}
          {showDataCenters &&
            dataCenters
              .filter((dc) => dc.location.coordinates)
              .map((dc, dataIndex) => {
                const color = getDataCenterColor(dc.status);

                // Group data centers by location to prevent label overlap
                const dcAtSameLocation = dataCenters.filter((d) =>
                  d.location.coordinates &&
                  d.location.coordinates.lat === dc.location.coordinates!.lat &&
                  d.location.coordinates.lng === dc.location.coordinates!.lng
                );

                const indexInGroup = dcAtSameLocation.indexOf(dc);
                const groupSize = dcAtSameLocation.length;

                // Spread labels around the location center based on group position
                const angleOffset = (indexInGroup * (360 / Math.max(groupSize, 1))) * Math.PI / 180;
                const baseAngle = (dataIndex * (360 / dataCenters.length) + 15) * Math.PI / 180;
                const angle = baseAngle + angleOffset;

                // Use adjusted ray length from collision detection
                const rayLength = dcDistances.get(dc.id) || 75;
                const labelX = Math.cos(angle) * rayLength;
                const labelY = Math.sin(angle) * rayLength;

                return (
                  <Marker
                    key={dc.id}
                    coordinates={[
                      dc.location.coordinates!.lng,
                      dc.location.coordinates!.lat,
                    ]}
                  >
                    <g>
                      {/* Radial ray */}
                      <line
                        x1={0}
                        y1={0}
                        x2={labelX}
                        y2={labelY}
                        stroke={color}
                        strokeWidth={1}
                        opacity={0.5}
                        pointerEvents="none"
                      />
                      <circle
                        cx={labelX}
                        cy={labelY}
                        r={1.5}
                        fill={color}
                        opacity={0.7}
                      />

                      {/* Marker */}
                      <g pointerEvents="none">
                        <circle
                          cx={0}
                          cy={0}
                          r={5}
                          fill={color}
                          opacity={0.95}
                          stroke="white"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={0}
                          cy={0}
                          r={8}
                          fill={color}
                          opacity={0.3}
                        />
                      </g>

                      {/* Label - Interactive */}
                      <g
                        onMouseMove={(e) => handleMarkerHover(e, 'data-center', dc)}
                        onMouseLeave={() => !pinnedMarker && setHoveredMarker(null)}
                        onClick={(e) => handleMarkerClick(e, 'data-center', dc)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={labelX - 75}
                          y={labelY - 16}
                          width={150}
                          height={32}
                          fill="rgba(0,0,0,0.9)"
                          rx={3}
                          stroke={color}
                          strokeWidth={1}
                        />
                        <text
                          x={labelX}
                          y={labelY - 3}
                          fontSize="8"
                          fontWeight="700"
                          fill={color}
                          textAnchor="middle"
                        >
                          {dc.projectName.substring(0, 22)}
                        </text>
                        <text
                          x={labelX}
                          y={labelY + 8}
                          fontSize="7"
                          fontWeight="400"
                          fill={color}
                          opacity={0.8}
                          textAnchor="middle"
                        >
                          {dc.location.state || dc.location.city}
                        </text>
                      </g>
                    </g>
                  </Marker>
                );
              })}

          {/* Chip Manufacturers - Radial sun rays with collision detection */}
          {showManufacturers &&
            manufacturers.map((mfr, index) => {
              // Radial angle
              const angle = (index * (360 / manufacturers.length) + 90) * Math.PI / 180;
              // Use adjusted ray length from collision detection
              const rayLength = mfrDistances.get(mfr.id) || 85;
              const labelX = Math.cos(angle) * rayLength;
              const labelY = Math.sin(angle) * rayLength;

              return (
                <Marker
                  key={mfr.id}
                  coordinates={[mfr.coordinates.lng, mfr.coordinates.lat]}
                >
                  <g>
                    {/* Radial ray */}
                    <line
                      x1={0}
                      y1={0}
                      x2={labelX}
                      y2={labelY}
                      stroke={mfr.primaryColor}
                      strokeWidth={1.2}
                      opacity={0.5}
                      pointerEvents="none"
                    />
                    <circle
                      cx={labelX}
                      cy={labelY}
                      r={1.5}
                      fill={mfr.primaryColor}
                      opacity={0.7}
                    />

                    {/* Marker */}
                    <g pointerEvents="none">
                      <rect
                        x={-5}
                        y={-5}
                        width={10}
                        height={10}
                        fill={mfr.primaryColor}
                        opacity={0.95}
                        stroke="white"
                        strokeWidth={1.5}
                      />
                      <rect
                        x={-8}
                        y={-8}
                        width={16}
                        height={16}
                        fill={mfr.primaryColor}
                        opacity={0.3}
                      />
                    </g>

                    {/* Label - Interactive */}
                    <g
                      onMouseMove={(e) => handleMarkerHover(e, 'manufacturer', mfr)}
                      onMouseLeave={() => !pinnedMarker && setHoveredMarker(null)}
                      onClick={(e) => handleMarkerClick(e, 'manufacturer', mfr)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={labelX - 55}
                        y={labelY - 11}
                        width={110}
                        height={22}
                        fill="rgba(0,0,0,0.9)"
                        rx={3}
                        stroke={mfr.primaryColor}
                        strokeWidth={1.2}
                      />
                      <text
                        x={labelX}
                        y={labelY + 4}
                        fontSize="10"
                        fontWeight="700"
                        fill={mfr.primaryColor}
                        textAnchor="middle"
                      >
                        {mfr.name}
                      </text>
                    </g>
                  </g>
                </Marker>
              );
            })}
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {(pinnedMarker || hoveredMarker) && (
        <MapTooltip
          x={pinnedMarker?.x ?? hoveredMarker?.x ?? 0}
          y={pinnedMarker?.y ?? hoveredMarker?.y ?? 0}
          visible={true}
          data={pinnedMarker?.data ?? hoveredMarker?.data ?? null}
          type={pinnedMarker?.type ?? hoveredMarker?.type ?? 'lab'}
          isPinned={!!pinnedMarker}
          onClose={() => setPinnedMarker(null)}
        />
      )}

    </div>
  );
}
