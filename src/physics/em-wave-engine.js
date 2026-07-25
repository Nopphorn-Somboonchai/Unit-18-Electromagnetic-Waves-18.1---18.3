/**
 * @file em-wave-engine.js
 * @description Pure Physics Engine Solvers for EM Wave Equations: c = fλ, E x B = v, and antenna length.
 * Completely free of DOM/Canvas dependencies.
 */

import { SPEED_OF_LIGHT } from '../shared/constants.js';

/**
 * Calculate wavelength λ = c / f
 * @param {number} frequency - Frequency f in Hz
 * @param {number} [speed=SPEED_OF_LIGHT] - Speed of wave in m/s
 * @returns {number} Wavelength λ in meters
 */
export function calculateWavelength(frequency, speed = SPEED_OF_LIGHT) {
  const f = Number(frequency);
  const v = Number(speed);
  if (isNaN(f) || f <= 0) {
    throw new Error('[EMWaveEngine] Frequency must be a positive number');
  }
  if (isNaN(v) || v <= 0) {
    throw new Error('[EMWaveEngine] Speed must be a positive number');
  }
  return v / f;
}

/**
 * Calculate frequency f = c / λ
 * @param {number} wavelength - Wavelength λ in meters
 * @param {number} [speed=SPEED_OF_LIGHT] - Speed of wave in m/s
 * @returns {number} Frequency f in Hz
 */
export function calculateFrequency(wavelength, speed = SPEED_OF_LIGHT) {
  const lambda = Number(wavelength);
  const v = Number(speed);
  if (isNaN(lambda) || lambda <= 0) {
    throw new Error('[EMWaveEngine] Wavelength must be a positive number');
  }
  if (isNaN(v) || v <= 0) {
    throw new Error('[EMWaveEngine] Speed must be a positive number');
  }
  return v / lambda;
}

/**
 * Calculate wave speed v = f * λ
 * @param {number} frequency - Frequency f in Hz
 * @param {number} wavelength - Wavelength λ in meters
 * @returns {number} Speed v in m/s
 */
export function calculateSpeed(frequency, wavelength) {
  const f = Number(frequency);
  const lambda = Number(wavelength);
  if (isNaN(f) || f <= 0 || isNaN(lambda) || lambda <= 0) {
    throw new Error('[EMWaveEngine] Frequency and wavelength must be positive numbers');
  }
  return f * lambda;
}

/**
 * Vector 3D Cross Product E x B = v
 * Evaluates right-hand rule direction for EM wave propagation vector v.
 * @param {{ x: number, y: number, z: number }} E - Electric field vector E
 * @param {{ x: number, y: number, z: number }} B - Magnetic field vector B
 * @returns {{ x: number, y: number, z: number }} Direction vector v
 */
export function calculateVectorDirection(E, B) {
  if (!E || !B) {
    return { x: 1, y: 0, z: 0 };
  }
  // Cross product E x B = (Ey*Bz - Ez*By, Ez*Bx - Ex*Bz, Ex*By - Ey*Bx)
  const vx = (E.y * B.z) - (E.z * B.y);
  const vy = (E.z * B.x) - (E.x * B.z);
  const vz = (E.x * B.y) - (E.y * B.x);

  // Normalize vector
  const mag = Math.sqrt(vx * vx + vy * vy + vz * vz);
  if (mag === 0) return { x: 1, y: 0, z: 0 };

  return {
    x: vx / mag,
    y: vy / mag,
    z: vz / mag
  };
}

/**
 * Calculate optimal dipole antenna length for radio wave reception.
 * Half-wave dipole: L = λ / 2
 * Quarter-wave monopole: L = λ / 4
 * @param {number} wavelength - Wavelength λ in meters
 * @param {'half-wave' | 'quarter-wave'} [type='half-wave'] - Antenna type
 * @returns {number} Antenna length in meters
 */
export function calculateAntennaLength(wavelength, type = 'half-wave') {
  const lambda = Number(wavelength);
  if (isNaN(lambda) || lambda <= 0) {
    throw new Error('[EMWaveEngine] Wavelength must be a positive number');
  }

  if (type === 'quarter-wave') {
    return lambda / 4;
  }
  return lambda / 2;
}
