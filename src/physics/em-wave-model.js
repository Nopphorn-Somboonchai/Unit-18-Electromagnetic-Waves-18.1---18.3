/**
 * @file em-wave-model.js
 * @description Physics Domain Model for Electromagnetic Waves (Pure JS / No DOM dependency).
 * Represents properties of EM waves including E-field, B-field, speed, frequency, and wavelength.
 */

import { SPEED_OF_LIGHT } from '../shared/constants.js';

/**
 * Creates an EM Wave immutable data model instance.
 * @param {Object} params
 * @param {number} [params.frequency=100e6] - Frequency f in Hz (default 100 MHz)
 * @param {number} [params.wavelength] - Wavelength λ in meters (calculated if omitted)
 * @param {number} [params.amplitude=1.0] - Electric field amplitude E0 (N/C or V/m)
 * @param {number} [params.phase=0] - Initial phase angle in radians
 * @param {number} [params.speed=SPEED_OF_LIGHT] - Wave speed in m/s (c in vacuum)
 * @returns {Readonly<Object>} EM Wave model object
 */
export function createEMWave({
  frequency = 100e6,
  wavelength = null,
  amplitude = 1.0,
  phase = 0,
  speed = SPEED_OF_LIGHT
} = {}) {
  // Validate frequency and speed
  const validFreq = Math.max(1e-3, Number(frequency) || 100e6);
  const validSpeed = Math.max(1, Number(speed) || SPEED_OF_LIGHT);
  
  // Calculate λ = c / f if not provided
  const validWavelength = wavelength ? Math.max(1e-18, Number(wavelength)) : validSpeed / validFreq;
  
  // Calculate Magnetic Field Amplitude B0 = E0 / c
  const bAmplitude = amplitude / validSpeed;
  
  // Angular frequency ω = 2πf, Wave number k = 2π / λ
  const omega = 2 * Math.PI * validFreq;
  const k = (2 * Math.PI) / validWavelength;

  return Object.freeze({
    frequency: validFreq,
    wavelength: validWavelength,
    speed: validSpeed,
    eAmplitude: amplitude,
    bAmplitude: bAmplitude,
    phase: phase,
    omega: omega,
    k: k,
    
    /**
     * Compute instantaneous E-field and B-field at position x and time t.
     * E(x,t) = E0 * sin(kx - ωt + phase)
     * B(x,t) = B0 * sin(kx - ωt + phase) (In phase with E)
     * @param {number} x - Position along propagation axis (m)
     * @param {number} t - Time elapsed (s)
     * @returns {{ E: number, B: number }} Instantaneous E and B field values
     */
    evaluateFields(x = 0, t = 0) {
      const phaseValue = k * x - omega * t + phase;
      const sinVal = Math.sin(phaseValue);
      return {
        E: amplitude * sinVal,
        B: bAmplitude * sinVal
      };
    }
  });
}
