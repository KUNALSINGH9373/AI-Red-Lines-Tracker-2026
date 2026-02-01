/**
 * Map collision detection and offset utilities
 * Prevents overlapping markers on the map by applying radial offsets
 */

export interface MarkerPosition {
  id: string;
  lat: number;
  lng: number;
  displayLat?: number;
  displayLng?: number;
  [key: string]: any;
}

/**
 * Detects markers that are within the same geographic area
 * Groups markers within 0.5° threshold (approximately 55km)
 */
export function detectCollisions(markers: MarkerPosition[]): Map<string, MarkerPosition[]> {
  const threshold = 0.5; // degrees
  const clusters = new Map<string, MarkerPosition[]>();

  markers.forEach((marker) => {
    // Create a cluster key based on rounded coordinates
    const latKey = Math.round(marker.lat / threshold);
    const lngKey = Math.round(marker.lng / threshold);
    const key = `${latKey}_${lngKey}`;

    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key)!.push(marker);
  });

  return clusters;
}

/**
 * Applies radial offsets to clustered markers
 * Supports up to 6 markers per cluster using 120° increments
 * Offset distance: 0.03° (~3.3km), preserves geographic accuracy
 */
export function applyOffsets(
  clusters: Map<string, MarkerPosition[]>
): MarkerPosition[] {
  const result: MarkerPosition[] = [];
  const offsetDist = 0.03; // degrees
  const angles = [0, 120, 240, 60, 180, 300]; // 6 positions around a circle

  clusters.forEach((cluster) => {
    if (cluster.length === 1) {
      // No collision, use original coordinates
      result.push({
        ...cluster[0],
        displayLat: cluster[0].lat,
        displayLng: cluster[0].lng,
      });
    } else {
      // Apply radial offset to each marker in the cluster
      cluster.forEach((marker, index) => {
        const angle = angles[index % angles.length];
        const radians = (angle * Math.PI) / 180;

        result.push({
          ...marker,
          displayLat: marker.lat + offsetDist * Math.sin(radians),
          displayLng: marker.lng + offsetDist * Math.cos(radians),
        });
      });
    }
  });

  return result;
}

/**
 * Main function: detects collisions and applies offsets in one pass
 */
export function offsetCollisionMarkers(markers: MarkerPosition[]): MarkerPosition[] {
  if (markers.length <= 1) {
    return markers.map((m) => ({
      ...m,
      displayLat: m.lat,
      displayLng: m.lng,
    }));
  }

  const clusters = detectCollisions(markers);
  return applyOffsets(clusters);
}
