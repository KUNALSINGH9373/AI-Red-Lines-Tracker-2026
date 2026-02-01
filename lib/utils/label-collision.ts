/**
 * Label collision detection and dynamic ray length adjustment
 * Recursively adjusts distances until stable (no collisions, within bounds)
 */

export interface LabelConfig {
  id: string;
  angle: number;
  baseDistance: number;
  width: number;
  height: number;
}

const MAP_WIDTH = 960;
const MIN_DISTANCE = 35;
const MAX_DISTANCE = 180;
const BOUNDARY_MARGIN = 8;
const MAX_ITERATIONS = 20;
const ADJUSTMENT_STEP = 15; // How much to increase/decrease per conflict

/**
 * Calculate label position from distance and angle
 */
function calculatePosition(distance: number, angle: number): { x: number; y: number } {
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

/**
 * Check if two label boxes overlap (touching or intersecting)
 */
function doLabelsCollide(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number,
  minGap: number = 8
): boolean {
  const left1 = x1 - w1 / 2;
  const right1 = x1 + w1 / 2;
  const top1 = y1 - h1 / 2;
  const bottom1 = y1 + h1 / 2;

  const left2 = x2 - w2 / 2;
  const right2 = x2 + w2 / 2;
  const top2 = y2 - h2 / 2;
  const bottom2 = y2 + h2 / 2;

  // Check with minimum gap to prevent touching
  return !(right1 + minGap < left2 || right2 + minGap < left1 ||
           bottom1 + minGap < top2 || bottom2 + minGap < top1);
}

/**
 * Check if label is completely within map boundaries
 */
function isWithinBounds(
  x: number, y: number, width: number, height: number,
  mapHeight: number
): boolean {
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;

  return (
    left >= BOUNDARY_MARGIN &&
    right <= MAP_WIDTH - BOUNDARY_MARGIN &&
    top >= BOUNDARY_MARGIN &&
    bottom <= mapHeight - BOUNDARY_MARGIN
  );
}

/**
 * Recursively adjust label distances until stable
 * Returns map of label id -> final distance
 */
export function calculateAdjustedLabels(
  labels: LabelConfig[],
  mapHeight: number
): Map<string, number> {
  const distances = new Map<string, number>();
  labels.forEach(label => {
    distances.set(label.id, label.baseDistance);
  });

  let iteration = 0;
  let hasConflicts = true;

  while (hasConflicts && iteration < MAX_ITERATIONS) {
    iteration++;
    hasConflicts = false;

    // Calculate current positions
    const positions = new Map<string, { x: number; y: number; box: { x: number; y: number; w: number; h: number } }>();
    labels.forEach(label => {
      const distance = distances.get(label.id)!;
      const pos = calculatePosition(distance, label.angle);
      positions.set(label.id, {
        x: pos.x,
        y: pos.y,
        box: { x: pos.x, y: pos.y, w: label.width, h: label.height },
      });
    });

    // Check for collisions between labels
    const collisions = new Set<string>();
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const label1 = labels[i];
        const label2 = labels[j];
        const pos1 = positions.get(label1.id)!;
        const pos2 = positions.get(label2.id)!;

        if (doLabelsCollide(
          pos1.x, pos1.y, label1.width, label1.height,
          pos2.x, pos2.y, label2.width, label2.height
        )) {
          hasConflicts = true;
          collisions.add(label1.id);
          collisions.add(label2.id);

          // Increase distance for colliding labels
          const dist1 = distances.get(label1.id)!;
          const dist2 = distances.get(label2.id)!;

          const newDist1 = Math.min(dist1 + ADJUSTMENT_STEP, MAX_DISTANCE);
          const newDist2 = Math.min(dist2 + ADJUSTMENT_STEP, MAX_DISTANCE);

          distances.set(label1.id, newDist1);
          distances.set(label2.id, newDist2);
        }
      }
    }

    // Check for boundary violations
    labels.forEach(label => {
      const distance = distances.get(label.id)!;
      const pos = calculatePosition(distance, label.angle);

      if (!isWithinBounds(pos.x, pos.y, label.width, label.height, mapHeight)) {
        // If at min distance and still out of bounds, it's constrained by bounds
        if (distance > MIN_DISTANCE) {
          hasConflicts = true;
          // Decrease distance to move toward center
          const newDist = Math.max(distance - ADJUSTMENT_STEP, MIN_DISTANCE);
          distances.set(label.id, newDist);
        }
      }
    });
  }

  return distances;
}
