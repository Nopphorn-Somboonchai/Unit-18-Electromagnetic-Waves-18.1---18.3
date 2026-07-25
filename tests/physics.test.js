/**
 * @file physics.test.js
 * @description Automated Unit Verification Script for Phase 2 Physics Engine & Models.
 * Runs in pure Node.js environment without DOM/Canvas dependencies.
 */

import { createEMWave } from '../src/physics/em-wave-model.js';
import { findBandByFrequency, findBandByWavelength, getAllSpectrumBands } from '../src/physics/spectrum-band-model.js';
import { createPolaroid } from '../src/physics/polaroid-model.js';
import { calculateWavelength, calculateFrequency, calculateSpeed, calculateVectorDirection, calculateAntennaLength } from '../src/physics/em-wave-engine.js';
import { calculatePhotonEnergy, calculateEnergyFromWavelength, compareSpectrumBands, getSpectrumInfo } from '../src/physics/spectrum-solver.js';
import { calculateMalusIntensity, calculateIntensityAfterPolarizer, calculateIntensityThroughTwoPolaroids, findAngleForZeroIntensity, findAngleForMaxIntensity } from '../src/physics/polarization-solver.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

function assertCloseTo(actual, expected, precision = 1e-4, message = '') {
  const diff = Math.abs(actual - expected);
  assert(diff <= precision, `${message} (Expected: ~${expected}, Got: ${actual})`);
}

console.log('=============== 🧪 RUNNING PHASE 2 PHYSICS ENGINE TESTS ===============\n');

// --- 1. EM Wave Engine Tests ---
console.log('--- Test Suite 1: EM Wave Engine (c = fλ) ---');
const lambdaFM = calculateWavelength(100e6); // 100 MHz FM radio
assertCloseTo(lambdaFM, 3.0, 1e-4, '100 MHz FM Radio wavelength should be 3.0 m');

const freqMicrowave = calculateFrequency(0.1); // λ = 10 cm
assertCloseTo(freqMicrowave, 3e9, 1e-4, 'λ = 0.1 m frequency should be 3 GHz');

const speedVal = calculateSpeed(2e6, 150);
assertCloseTo(speedVal, 3e8, 1e-4, 'v = f * λ should be 3.00e8 m/s');

// Vector cross product E x B = v
// E in +y (0,1,0), B in +z (0,0,1) -> v in +x (1,0,0)
const dirX = calculateVectorDirection({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 });
assert(dirX.x === 1 && dirX.y === 0 && dirX.z === 0, 'Cross product (0,1,0) x (0,0,1) should equal (1,0,0)');

// Antenna Length
const halfWaveLen = calculateAntennaLength(3.0, 'half-wave');
assertCloseTo(halfWaveLen, 1.5, 1e-4, 'Half-wave dipole for λ=3m should be 1.5m');

// --- 2. EM Wave Model Tests ---
console.log('\n--- Test Suite 2: EM Wave Model ---');
const emWave = createEMWave({ frequency: 100e6 });
assert(emWave.frequency === 100e6, 'EMWave model frequency stored correctly');
assertCloseTo(emWave.wavelength, 3.0, 1e-4, 'EMWave model wavelength calculated correctly');

const fieldsAtOrigin = emWave.evaluateFields(0, 0);
assert(fieldsAtOrigin.E === 0 && fieldsAtOrigin.B === 0, 'Fields at x=0, t=0 with phase 0 should be zero');

// --- 3. Spectrum Solvers & Models ---
console.log('\n--- Test Suite 3: Spectrum Solvers & Models ---');
const radioBand = findBandByFrequency(1e6); // 1 MHz -> Radio
assert(radioBand.id === 'radio', '1 MHz should classify as Radio Waves');

const visibleBand = findBandByFrequency(5e14); // 500 THz -> Visible Light
assert(visibleBand.id === 'visible', '500 THz should classify as Visible Light');

const gammaBand = findBandByWavelength(1e-13); // 0.0001 nm -> Gamma
assert(gammaBand.id === 'gamma', 'λ = 1e-13 m should classify as Gamma Rays');

const energy = calculatePhotonEnergy(5e14);
assert(energy.joules > 0, 'Photon energy in Joules is positive');
assertCloseTo(energy.electronVolts, 2.07, 0.05, '500 THz photon energy should be ~2.07 eV');

const info = getSpectrumInfo(100e6);
assert(info.band.id === 'radio', 'getSpectrumInfo correctly returns band metadata');

// --- 4. Polarization Solvers & Models ---
console.log('\n--- Test Suite 4: Polarization & Malus Law Solvers ---');
// θ = 0° -> I = I0
const iMax = calculateMalusIntensity(100, 0);
assertCloseTo(iMax, 100, 1e-5, 'Malus Law at θ=0° should return 100% intensity');

// θ = 45° -> I = I0 / 2 = 50%
const iHalf = calculateMalusIntensity(100, 45);
assertCloseTo(iHalf, 50, 1e-4, 'Malus Law at θ=45° should return 50% intensity');

// θ = 90° -> I = 0
const iZero = calculateMalusIntensity(100, 90);
assertCloseTo(iZero, 0, 1e-5, 'Malus Law at θ=90° should return 0% intensity');

// Unpolarized light through P1 -> 50%
const iP1 = calculateIntensityAfterPolarizer(100);
assertCloseTo(iP1, 50, 1e-5, 'Unpolarized light through P1 should return 50% intensity');

// Two polaroids at θ1=0° and θ2=45° -> I2 = 25% of I0
const twoPolaroids = calculateIntensityThroughTwoPolaroids(100, 0, 45);
assertCloseTo(twoPolaroids.I2, 25, 1e-4, 'Two polaroids at 45° relative angle should transmit 25% of I0');

const zeroAngles = findAngleForZeroIntensity();
assert(zeroAngles.includes(90) && zeroAngles.includes(270), 'Zero intensity angles include 90° and 270°');

console.log(`\n=======================================================`);
console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=======================================================`);

if (failed > 0) {
  process.exit(1);
}
