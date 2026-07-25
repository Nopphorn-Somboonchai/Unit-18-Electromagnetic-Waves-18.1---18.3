/**
 * @file spectrum-solver.js
 * @description Physics Solver for Electromagnetic Spectrum & Photon Energy E = hf.
 */

import { PLANCK_CONSTANT, SPEED_OF_LIGHT, JOULE_TO_EV } from '../shared/constants.js';
import { findBandByFrequency } from './spectrum-band-model.js';

/**
 * Calculate photon energy E = hf in Joules and electron-Volts (eV).
 * @param {number} frequency - Frequency f in Hz
 * @returns {{ joules: number, electronVolts: number }} Energy object
 */
export function calculatePhotonEnergy(frequency) {
  const f = Number(frequency);
  if (isNaN(f) || f <= 0) {
    throw new Error('[SpectrumSolver] Frequency must be a positive number');
  }

  const joules = PLANCK_CONSTANT * f;
  const electronVolts = joules * JOULE_TO_EV;

  return {
    joules,
    electronVolts
  };
}

/**
 * Calculate photon energy E = hc / λ from wavelength.
 * @param {number} wavelength - Wavelength λ in meters
 * @returns {{ joules: number, electronVolts: number }} Energy object
 */
export function calculateEnergyFromWavelength(wavelength) {
  const lambda = Number(wavelength);
  if (isNaN(lambda) || lambda <= 0) {
    throw new Error('[SpectrumSolver] Wavelength must be a positive number');
  }

  const frequency = SPEED_OF_LIGHT / lambda;
  return calculatePhotonEnergy(frequency);
}

/**
 * Compare two spectrum bands by frequency and energy.
 * @param {Object} band1 - Spectrum band 1
 * @param {Object} band2 - Spectrum band 2
 * @returns {{ higherFrequency: Object, higherEnergy: Object, frequencyRatio: number }} Comparison result
 */
export function compareSpectrumBands(band1, band2) {
  if (!band1 || !band2) {
    throw new Error('[SpectrumSolver] Two valid spectrum bands are required for comparison');
  }

  const f1 = band1.frequencyMin;
  const f2 = band2.frequencyMin;

  const higherFreq = f1 >= f2 ? band1 : band2;
  const ratio = f1 >= f2 ? f1 / Math.max(1, f2) : f2 / Math.max(1, f1);

  return {
    higherFrequency: higherFreq,
    higherEnergy: higherFreq, // Energy E = hf is directly proportional to frequency
    frequencyRatio: ratio
  };
}

/**
 * Get comprehensive spectrum information for a given frequency.
 * @param {number} frequency - Frequency f in Hz
 * @returns {Object} Complete classification, wavelength, energy, and applications
 */
export function getSpectrumInfo(frequency) {
  const f = Number(frequency);
  const band = findBandByFrequency(f);
  const wavelength = SPEED_OF_LIGHT / f;
  const energy = calculatePhotonEnergy(f);

  return {
    frequency: f,
    wavelength: wavelength,
    energyJoules: energy.joules,
    energyEv: energy.electronVolts,
    band: band
  };
}
