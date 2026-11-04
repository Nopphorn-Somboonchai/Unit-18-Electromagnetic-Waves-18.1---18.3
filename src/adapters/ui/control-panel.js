/**
 * @file control-panel.js
 * @description UI Adapter connecting DOM inputs (sliders, buttons, knobs) to Simulator Orchestrators.
 * Manages real-time DOM value badges and user input listeners.
 */

import { KaTeXAdapter } from '../formula/katex-adapter.js';

export class ControlPanelAdapter {
  /**
   * Bind controls for Simulator 18.1 (EM Wave Vector Fields)
   * @param {Object} simulator - EMWaveSimulator instance
   */
  static bindEMWaveControls(simulator) {
    const sliderFreq = document.getElementById('slider-em-freq');
    const valFreq = document.getElementById('val-em-freq');
    const valWavelength = document.getElementById('val-em-wavelength');
    const btnToggleAnim = document.getElementById('btn-toggle-wave-anim');

    if (sliderFreq && valFreq && valWavelength) {
      sliderFreq.addEventListener('input', (e) => {
        const freqMHz = parseFloat(e.target.value);
        const freqHz = freqMHz * 1e6;
        valFreq.textContent = `${freqMHz.toFixed(2)} MHz`;

        simulator.setFrequency(freqHz);
      });

      simulator.onUpdateCallback = ({ wavelength }) => {
        valWavelength.textContent = `${wavelength.toFixed(2)} m`;
      };

      if (typeof window !== 'undefined') {
        window.adjustEMFrequency = (delta) => {
          let current = parseFloat(sliderFreq.value) || 100;
          let target = Math.max(10, Math.min(500, current + delta));
          sliderFreq.value = target;
          sliderFreq.dispatchEvent(new Event('input', { bubbles: true }));
        };

        window.setEMFrequencyPreset = (freq) => {
          sliderFreq.value = Math.max(10, Math.min(500, freq));
          sliderFreq.dispatchEvent(new Event('input', { bubbles: true }));
        };
      }
    }

    if (btnToggleAnim) {
      btnToggleAnim.addEventListener('click', () => {
        const isNowPlaying = simulator.toggleAnimation();
        btnToggleAnim.innerHTML = isNowPlaying
          ? '<span>⏸️</span> <span>หยุดแอนิเมชัน</span>'
          : '<span>▶️</span> <span>เล่นแอนิเมชัน</span>';
      });
    }
  }

  /**
   * Bind controls for Simulator 18.2 (7 Spectrum Bands)
   * @param {Object} simulator - SpectrumSimulator instance
   */
  static bindSpectrumControls(simulator) {
    const bandName = document.getElementById('spectrum-band-name');
    const colorBadge = document.getElementById('spectrum-color-badge');
    const freqRange = document.getElementById('spectrum-freq-range');
    const waveRange = document.getElementById('spectrum-wave-range');
    const energyVal = document.getElementById('spectrum-energy-val');
    const appDesc = document.getElementById('spectrum-app-desc');

    simulator.onInfoChangeCallback = (info) => {
      const { band, energyEv, wavelength } = info;
      if (!band) return;

      if (bandName) bandName.textContent = `${band.nameThai} (${band.name})`;
      if (colorBadge) colorBadge.style.backgroundColor = band.color;
      if (freqRange) freqRange.textContent = `${formatSci(band.frequencyMin)} - ${formatSci(band.frequencyMax)} Hz`;
      if (waveRange) waveRange.textContent = `${formatSci(band.wavelengthMin)} - ${formatSci(band.wavelengthMax)} m`;
      if (energyVal) energyVal.textContent = `${energyEv.toExponential(2)} eV`;
      if (appDesc) appDesc.textContent = band.applications;
    };

    if (typeof window !== 'undefined') {
      window.selectSpectrumBandById = (bandId) => {
        if (typeof simulator.selectBandById === 'function') {
          simulator.selectBandById(bandId);
        }
      };
    }
  }

  /**
   * Bind controls for Simulator 18.3 (Polarization & Malus's Law)
   * @param {Object} simulator - PolarizationSimulator instance
   */
  static bindPolarizationControls(simulator) {
    const sliderAngle = document.getElementById('slider-analyzer-angle');
    const valAngle = document.getElementById('val-analyzer-angle');
    const valIntensity = document.getElementById('val-transmitted-intensity');

    if (sliderAngle && valAngle && valIntensity) {
      sliderAngle.addEventListener('input', (e) => {
        const angle = parseInt(e.target.value, 10);
        valAngle.textContent = `${angle}°`;

        simulator.setAnalyzerAngle(angle);
      });

      // Synchronize slider and display when angle is rotated directly on Canvas
      simulator.onAngleChangeCallback = (angle) => {
        if (sliderAngle && parseInt(sliderAngle.value, 10) !== angle) {
          sliderAngle.value = angle;
        }
        if (valAngle) {
          valAngle.textContent = `${angle}°`;
        }
      };

      // Register global stepper and preset helpers for touch controls
      if (typeof window !== 'undefined') {
        window.adjustAnalyzerAngle = (delta) => {
          let current = parseInt(sliderAngle.value, 10) || 0;
          let target = (current + delta) % 360;
          if (target < 0) target += 360;
          sliderAngle.value = target;
          sliderAngle.dispatchEvent(new Event('input', { bubbles: true }));
        };

        window.setAnalyzerAnglePreset = (angle) => {
          let target = parseInt(angle, 10) % 360;
          if (target < 0) target += 360;
          sliderAngle.value = target;
          sliderAngle.dispatchEvent(new Event('input', { bubbles: true }));
        };
      }

      simulator.onIntensityChangeCallback = ({ analyzerAngle, intensity2, isCrossed }) => {
        const frac = (intensity2 / 100).toFixed(2);
        valIntensity.innerHTML = `${intensity2.toFixed(1)}% (${KaTeXAdapter.renderToString(`${frac} I_0`)})`;

        if (isCrossed || intensity2 <= 0.05) {
          valIntensity.className = 'text-sm font-bold font-mono text-rose-400 bg-rose-950/40 px-3 py-1.5 rounded-md border border-rose-800';
        } else {
          valIntensity.className = 'text-sm font-bold font-mono text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-md border border-amber-800/80';
        }

        const lblStatus = document.getElementById('lbl-polarization-status');
        if (lblStatus) {
          if (isCrossed || intensity2 <= 0.05) {
            lblStatus.textContent = '🔒 แสงถูกกั้นสมบูรณ์ (มืดสนิท)';
            lblStatus.className = 'text-rose-400 font-bold bg-rose-950/40 px-2.5 py-1 rounded border border-rose-800/80';
          } else if (Math.abs(intensity2 - 50.0) < 0.1) {
            lblStatus.textContent = '✨ แสงโพลาไรส์เชิงเส้น (สว่างสุด)';
            lblStatus.className = 'text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/80';
          } else {
            lblStatus.textContent = 'แสงโพลาไรส์เชิงเส้น';
            lblStatus.className = 'text-emerald-400 font-bold bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700';
          }
        }
      };
    }
  }
}

/**
 * Format scientific notation numbers cleanly
 */
function formatSci(num) {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)} GHz`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)} MHz`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)} kHz`;
  if (num < 1e-6) return `${(num * 1e9).toFixed(1)} nm`;
  if (num < 1e-3) return `${(num * 1e6).toFixed(1)} µm`;
  if (num < 1) return `${(num * 1e3).toFixed(1)} mm`;
  return `${num.toFixed(1)}`;
}
