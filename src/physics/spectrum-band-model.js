/**
 * @file spectrum-band-model.js
 * @description Physics Domain Model for Electromagnetic Spectrum Bands.
 * Provides lookup functions to classify EM waves by frequency or wavelength.
 */

import { SPECTRUM_BANDS } from '../shared/constants.js';

/**
 * Find the spectrum band corresponding to a given frequency in Hz.
 * @param {number} frequency - Frequency in Hz
 * @returns {Object} Spectrum band metadata object
 */
export function findBandByFrequency(frequency) {
  const f = Number(frequency);
  if (isNaN(f) || f <= 0) {
    return SPECTRUM_BANDS[0]; // Default to radio if invalid
  }

  // Find matching band where frequencyMin <= f <= frequencyMax
  for (const band of SPECTRUM_BANDS) {
    if (f >= band.frequencyMin && f <= band.frequencyMax) {
      return band;
    }
  }

  // Edge cases: Frequency below radio range (< 3 kHz)
  if (f < SPECTRUM_BANDS[0].frequencyMin) {
    return SPECTRUM_BANDS[0];
  }

  // Frequency above gamma range (> 1e22 Hz)
  return SPECTRUM_BANDS[SPECTRUM_BANDS.length - 1];
}

/**
 * Find the spectrum band corresponding to a given wavelength in meters.
 * @param {number} wavelength - Wavelength in meters
 * @returns {Object} Spectrum band metadata object
 */
export function findBandByWavelength(wavelength) {
  const lambda = Number(wavelength);
  if (isNaN(lambda) || lambda <= 0) {
    return SPECTRUM_BANDS[0];
  }

  for (const band of SPECTRUM_BANDS) {
    if (lambda >= band.wavelengthMin && lambda <= band.wavelengthMax) {
      return band;
    }
  }

  if (lambda > SPECTRUM_BANDS[0].wavelengthMax) {
    return SPECTRUM_BANDS[0];
  }

  return SPECTRUM_BANDS[SPECTRUM_BANDS.length - 1];
}

/**
 * Get all 7 EM Spectrum Bands in order (Radio → Gamma).
 * @returns {readonly Object[]} List of spectrum band objects
 */
export function getAllSpectrumBands() {
  return SPECTRUM_BANDS;
}

/**
 * Get band index (0 to 6) for a given band ID.
 * @param {string} bandId - Spectrum band ID (e.g. 'radio', 'visible', 'xray')
 * @returns {number} Index from 0 to 6 (-1 if not found)
 */
export function getBandIndex(bandId) {
  return SPECTRUM_BANDS.findIndex((b) => b.id === bandId);
}
