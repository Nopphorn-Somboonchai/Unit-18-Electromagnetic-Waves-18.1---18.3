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

      simulator.onIntensityChangeCallback = ({ analyzerAngle, intensity2, isCrossed }) => {
        const frac = (intensity2 / 100).toFixed(2);
        valIntensity.innerHTML = `${intensity2.toFixed(1)}% (${KaTeXAdapter.renderToString(`${frac} I_0`)})`;

        if (isCrossed) {
          valIntensity.className = 'text-sm font-bold font-mono text-red-400 bg-red-950/40 px-3 py-1.5 rounded-md border border-red-800';
        } else {
          valIntensity.className = 'text-sm font-bold font-mono text-amber-400 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700';
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
