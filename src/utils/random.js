/**
 * @file random.js
 * @description Roll-Number (RNG) & Dynamic Randomization Utilities for Unit 18 Physics Quiz System.
 * Implements Dynamic Parameter Generation combining student Roll Number (R ∈ [1, 40])
 * with non-deterministic random variation and strict safety constraints.
 */

/**
 * Simple Mulberry32 Seeded Random Number Generator
 * @param {number} seed - Integer seed
 * @returns {function(): number} Function returning pseudo-random float in [0, 1)
 */
export function createSeededRNG(seed) {
  let s = seed >>> 0;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a seeded random integer in range [min, max] inclusive
 * @param {number} rollNumber - Student roll number R (1..40)
 * @param {number} questionIndex - Index/ID of the question
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function getSeededInt(rollNumber, questionIndex, min, max) {
  const seed = (rollNumber * 10007 + questionIndex * 9973 + 12345) >>> 0;
  const rng = createSeededRNG(seed);
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generate a seeded random float in range [min, max] rounded to specified decimal places
 * @param {number} rollNumber - Student roll number R (1..40)
 * @param {number} questionIndex - Index/ID of the question
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {number} Random float
 */
export function getSeededFloat(rollNumber, questionIndex, min, max, decimals = 2) {
  const seed = (rollNumber * 10007 + questionIndex * 9973 + 54321) >>> 0;
  const rng = createSeededRNG(seed);
  const val = rng() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Pick a seeded random element from an array
 * @template T
 * @param {number} rollNumber
 * @param {number} questionIndex
 * @param {T[]} array
 * @returns {T} Selected element
 */
export function getSeededChoice(rollNumber, questionIndex, array) {
  if (!array || array.length === 0) return null;
  const idx = getSeededInt(rollNumber, questionIndex, 0, array.length - 1);
  return array[idx];
}

/**
 * Dynamic Parameter Generator:
 * Combines Roll Number R (1..40) with non-deterministic random variation
 * and applies strict safety constraints to guarantee physically sound parameters.
 * 
 * @param {number} rollNumber - Student roll number R (1..40)
 * @param {number} baseMin - Base minimum value before R scaling
 * @param {number} baseStep - Multiplier for roll number R
 * @param {number} [randomRange=0] - Dynamic non-deterministic variation range
 * @param {{ min?: number, max?: number, decimals?: number }} [safetyBounds] - Strict safety constraints
 * @returns {number} Dynamically generated physics parameter
 */
export function getDynamicParam(rollNumber, baseMin, baseStep, randomRange = 0, safetyBounds = {}) {
  const R = Math.max(1, Math.min(40, Number(rollNumber) || 1));
  const randOffset = randomRange > 0 ? (Math.random() - 0.5) * 2 * randomRange : 0;
  let val = baseMin + (R * baseStep) + randOffset;

  // Apply Safety Constraints
  if (safetyBounds.min !== undefined && val < safetyBounds.min) {
    val = safetyBounds.min;
  }
  if (safetyBounds.max !== undefined && val > safetyBounds.max) {
    val = safetyBounds.max;
  }

  const decimals = safetyBounds.decimals !== undefined ? safetyBounds.decimals : 2;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
