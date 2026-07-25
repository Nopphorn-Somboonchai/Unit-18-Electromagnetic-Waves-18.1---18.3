/**
 * @file polaroid-model.js
 * @description Physics Domain Model for Polaroid Sheets & Polarizing Filters.
 */

/**
 * Normalize angle to range [0, 360) degrees.
 * @param {number} angleDegrees - Angle in degrees
 * @returns {number} Angle normalized to [0, 360)
 */
export function normalizeAngleDegrees(angleDegrees) {
  let deg = Number(angleDegrees) % 360;
  if (deg < 0) deg += 360;
  return deg;
}

/**
 * Creates an immutable Polaroid sheet data model.
 * @param {Object} params
 * @param {number} [params.transmissionAxisAngle=0] - Transmission axis angle θ in degrees (0 = vertical)
 * @param {string} [params.id='P1'] - Identifier (e.g. 'P1' for Polarizer, 'P2' for Analyzer)
 * @param {string} [params.label='Polarizer'] - Display label
 * @returns {Readonly<Object>} Polaroid sheet object
 */
export function createPolaroid({
  transmissionAxisAngle = 0,
  id = 'P1',
  label = 'Polarizer'
} = {}) {
  const normalizedDeg = normalizeAngleDegrees(transmissionAxisAngle);
  const radians = (normalizedDeg * Math.PI) / 180;

  // Transmission axis unit vector (ux, uy)
  const axisVector = Object.freeze({
    x: Math.sin(radians), // Horizontal component
    y: Math.cos(radians)  // Vertical component
  });

  return Object.freeze({
    id,
    label,
    angleDegrees: normalizedDeg,
    angleRadians: radians,
    axisVector,

    /**
     * Calculate angle difference between this Polaroid and another Polaroid sheet.
     * @param {Object} anotherPolaroid - Another Polaroid instance
     * @returns {number} Difference angle in degrees (0..360)
     */
    getAngleDifferenceDegrees(anotherPolaroid) {
      if (!anotherPolaroid || typeof anotherPolaroid.angleDegrees !== 'number') {
        return 0;
      }
      return normalizeAngleDegrees(anotherPolaroid.angleDegrees - normalizedDeg);
    }
  });
}
