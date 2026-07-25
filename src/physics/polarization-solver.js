/**
 * @file polarization-solver.js
 * @description Pure Physics Solvers for Light Polarization and Malus's Law: I = I0 * cos²θ.
 */

/**
 * Calculate light intensity after passing through a polarizing filter using Malus's Law.
 * I = I0 * cos²(θ)
 * @param {number} I0 - Initial polarized light intensity (e.g. 100% or W/m²)
 * @param {number} thetaDegrees - Angle θ between light polarization vector and filter axis (in degrees)
 * @returns {number} Transmitted intensity I
 */
export function calculateMalusIntensity(I0, thetaDegrees) {
  const initialIntensity = Number(I0);
  const angleDeg = Number(thetaDegrees);

  if (isNaN(initialIntensity) || initialIntensity < 0) {
    throw new Error('[PolarizationSolver] Initial intensity I0 must be non-negative');
  }

  const thetaRad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(thetaRad);
  
  // I = I0 * cos²(θ)
  const transmittedIntensity = initialIntensity * (cosVal * cosVal);
  
  // Clean floating point errors near 0 (e.g. cos²(90°) = 3.7e-33 -> 0)
  return transmittedIntensity < 1e-12 ? 0 : transmittedIntensity;
}

/**
 * Calculate intensity of unpolarized light after passing through the first Polarizer sheet (P1).
 * Unpolarized light loses 50% of its intensity on average:
 * I1 = I_unpolarized / 2
 * @param {number} I_unpolarized - Initial unpolarized light intensity I0
 * @returns {number} Intensity after P1 (I1 = I0 / 2)
 */
export function calculateIntensityAfterPolarizer(I_unpolarized) {
  const i0 = Number(I_unpolarized);
  if (isNaN(i0) || i0 < 0) {
    throw new Error('[PolarizationSolver] Initial unpolarized intensity must be non-negative');
  }
  return i0 / 2;
}

/**
 * Calculate transmitted intensity through two consecutive Polaroid sheets (P1 Polarizer + P2 Analyzer).
 * Step 1: Unpolarized light I0 -> P1 -> I1 = I0 / 2
 * Step 2: Polarized light I1 -> P2 -> I2 = I1 * cos²(θ2 - θ1)
 * @param {number} I0 - Initial unpolarized light intensity
 * @param {number} theta1Degrees - Polarizer P1 transmission axis angle (deg)
 * @param {number} theta2Degrees - Analyzer P2 transmission axis angle (deg)
 * @returns {{ I1: number, I2: number, relativePercentage: number, isCrossed: boolean }} Intensity breakdown
 */
export function calculateIntensityThroughTwoPolaroids(I0, theta1Degrees, theta2Degrees) {
  const i1 = calculateIntensityAfterPolarizer(I0);
  const deltaTheta = Math.abs(theta2Degrees - theta1Degrees);
  const i2 = calculateMalusIntensity(i1, deltaTheta);

  const relativePct = (i2 / Math.max(1e-9, Number(I0))) * 100;
  const isCrossed = Math.abs((deltaTheta % 180) - 90) < 1e-3;

  return {
    I1: i1,
    I2: i2,
    relativePercentage: relativePct,
    isCrossed: isCrossed
  };
}

/**
 * Find angles (in degrees) that produce zero transmitted intensity (Crossed Polaroids: cos²θ = 0).
 * @returns {number[]} Angles where I = 0 (90°, 270°)
 */
export function findAngleForZeroIntensity() {
  return [90, 270];
}

/**
 * Find angles (in degrees) that produce maximum transmitted intensity (Parallel Polaroids: cos²θ = 1).
 * @returns {number[]} Angles where I = I_max (0°, 180°, 360°)
 */
export function findAngleForMaxIntensity() {
  return [0, 180, 360];
}
