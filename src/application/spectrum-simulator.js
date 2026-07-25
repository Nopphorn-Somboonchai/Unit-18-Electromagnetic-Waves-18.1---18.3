/**
 * @file spectrum-simulator.js
 * @description Application Service Orchestrator for Simulator 18.2 (7 EM Spectrum Bands).
 */

import { SpectrumPlotter } from '../adapters/canvas/spectrum-plotter.js';
import { getSpectrumInfo } from '../physics/spectrum-solver.js';
import { APP_CONFIG } from '../shared/config.js';

export class SpectrumSimulator {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.plotter = new SpectrumPlotter(canvas);
    this.frequency = APP_CONFIG.spectrumDefaults.initialFrequency; // 500 THz

    this.onInfoChangeCallback = null;

    // Attach click listener to canvas for direct band selection
    this._attachCanvasClickListener();

    // Initial render
    this.updateFrequency(this.frequency);
  }

  /**
   * Update simulator frequency and trigger physics solver & render
   * @param {number} newFrequency - Frequency in Hz
   */
  updateFrequency(newFrequency) {
    this.frequency = Math.max(3e3, Number(newFrequency));
    this.spectrumInfo = getSpectrumInfo(this.frequency);

    if (this.onInfoChangeCallback) {
      this.onInfoChangeCallback(this.spectrumInfo);
    }

    this.render();
  }

  /**
   * Handle user click on Canvas spectrum bar to select frequency
   */
  _attachCanvasClickListener() {
    this.plotter.canvas.addEventListener('click', (evt) => {
      const rect = this.plotter.canvas.getBoundingClientRect();
      const clickX = evt.clientX - rect.left;
      const paddingX = 40;
      const barWidth = this.plotter.width - paddingX * 2;

      if (clickX >= paddingX && clickX <= paddingX + barWidth) {
        const frac = (clickX - paddingX) / barWidth;
        const logMin = Math.log10(3e3);
        const logMax = Math.log10(1e22);
        const targetLog = logMin + frac * (logMax - logMin);
        const targetFreq = Math.pow(10, targetLog);

        this.updateFrequency(targetFreq);
      }
    });
  }

  /**
   * Render canvas
   */
  render() {
    this.plotter.render({
      frequency: this.frequency,
      selectedBand: this.spectrumInfo ? this.spectrumInfo.band : null
    });
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.plotter.destroy();
  }
}
