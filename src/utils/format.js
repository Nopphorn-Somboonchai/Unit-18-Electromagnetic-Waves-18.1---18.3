/**
 * @file format.js
 * @description Number formatting, SI unit display, and scientific notation helpers.
 */

/**
 * Format a number into clean scientific notation (e.g. 3.00 × 10⁸)
 * @param {number} num - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted string
 */
export function formatScientific(num, decimals = 2) {
  const val = Number(num);
  if (isNaN(val) || val === 0) return '0';

  const absVal = Math.abs(val);
  if (absVal >= 0.01 && absVal < 10000) {
    return val.toFixed(decimals);
  }

  const exp = Math.floor(Math.log10(absVal));
  const mantissa = val / Math.pow(10, exp);
  return `${mantissa.toFixed(decimals)} × 10${toSuperscriptExponent(exp)}`;
}

/**
 * Format a number into standard LaTeX scientific notation (e.g. 3.00 \times 10^{8})
 * Suitable for KaTeX math environments.
 * @param {number} num - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} LaTeX formatted string without unicode superscripts
 */
export function formatLatexScientific(num, decimals = 2) {
  const val = Number(num);
  if (isNaN(val) || val === 0) return '0';

  const absVal = Math.abs(val);
  if (absVal >= 0.01 && absVal < 10000) {
    return val.toFixed(decimals);
  }

  const exp = Math.floor(Math.log10(absVal));
  const mantissa = val / Math.pow(10, exp);
  return `${mantissa.toFixed(decimals)} \\times 10^{${exp}}`;
}

/**
 * Convert exponent integer to Unicode superscript (e.g. 8 -> ⁸, -19 -> ⁻¹⁹)
 * @param {number} exp
 * @returns {string} Superscript string
 */
function toSuperscriptExponent(exp) {
  const map = {
    '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
    '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return String(exp).split('').map(char => map[char] || char).join('');
}

/**
 * Format frequency to readable string with SI unit (Hz, kHz, MHz, GHz, THz)
 * @param {number} freqHz - Frequency in Hz
 * @returns {string} e.g. "100.00 MHz"
 */
export function formatFrequency(freqHz) {
  const f = Number(freqHz);
  if (f >= 1e12) return `${(f / 1e12).toFixed(2)} THz`;
  if (f >= 1e9) return `${(f / 1e9).toFixed(2)} GHz`;
  if (f >= 1e6) return `${(f / 1e6).toFixed(2)} MHz`;
  if (f >= 1e3) return `${(f / 1e3).toFixed(2)} kHz`;
  return `${f.toFixed(2)} Hz`;
}

/**
 * Format wavelength to readable string with SI unit (m, cm, mm, µm, nm)
 * @param {number} waveMeters - Wavelength in meters
 * @returns {string} e.g. "3.00 m" or "500.00 nm"
 */
export function formatWavelength(waveMeters) {
  const w = Number(waveMeters);
  if (w >= 1) return `${w.toFixed(2)} m`;
  if (w >= 1e-2) return `${(w * 1e2).toFixed(2)} cm`;
  if (w >= 1e-3) return `${(w * 1e3).toFixed(2)} mm`;
  if (w >= 1e-6) return `${(w * 1e6).toFixed(2)} µm`;
  return `${(w * 1e9).toFixed(2)} nm`;
}

/**
 * Format angle to degree string
 * @param {number} deg - Angle in degrees
 * @returns {string} e.g. "45°"
 */
export function formatAngle(deg) {
  return `${Math.round(deg)}°`;
}
