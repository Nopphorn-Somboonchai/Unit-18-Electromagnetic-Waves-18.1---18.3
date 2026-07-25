/**
 * @file spectrum-plotter.js
 * @description Canvas Plotter Adapter for 7 EM Spectrum Bands (Simulator 18.2).
 * Renders continuous multi-spectral bands, logarithmic frequency scale, and interactive cursor.
 */

import { CanvasRenderer } from './canvas-renderer.js';
import { SPECTRUM_BANDS } from '../../shared/constants.js';

export class SpectrumPlotter extends CanvasRenderer {
  /**
   * Render continuous spectrum band bar and cursor
   * @param {Object} state
   * @param {Object} state.selectedBand - Currently selected spectrum band
   * @param {number} state.frequency - Currently selected frequency in Hz
   */
  render(state) {
    const { selectedBand, frequency = 5e14 } = state;

    this.clear('#090D16');

    const paddingX = 40;
    const barY = 60;
    const barHeight = 60;
    const barWidth = this.width - paddingX * 2;

    // Logarithmic frequency bounds: 3 kHz (3e3) to 1e22 Hz
    const logMin = Math.log10(3e3);   // ~3.47
    const logMax = Math.log10(1e22);  // 22.0

    // 1. Draw Spectrum Color Bar
    const numBands = SPECTRUM_BANDS.length;
    const bandWidth = barWidth / numBands;

    for (let i = 0; i < numBands; i++) {
      const band = SPECTRUM_BANDS[i];
      const bx = paddingX + i * bandWidth;
      const isSelected = selectedBand && selectedBand.id === band.id;

      // Draw gradient block
      const grad = this.ctx.createLinearGradient(bx, barY, bx + bandWidth, barY);
      grad.addColorStop(0, band.color);
      grad.addColorStop(1, i < numBands - 1 ? SPECTRUM_BANDS[i + 1].color : band.color);

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(bx, barY, bandWidth, barHeight);

      // Highlight active selected band box
      if (isSelected) {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(bx - 1, barY - 2, bandWidth + 2, barHeight + 4);
      }

      // Draw band title on top
      this.drawLabel(band.nameThai, bx + bandWidth / 2, barY - 15, {
        font: isSelected ? 'bold 12px Prompt, sans-serif' : '11px Prompt, sans-serif',
        color: isSelected ? '#FFFFFF' : '#94A3B8'
      });
    }

    // 2. Draw Logarithmic Frequency Axis Markers
    const axisY = barY + barHeight + 25;
    this.drawLine(paddingX, axisY, paddingX + barWidth, axisY, '#64748B', 1.5);

    // Draw key frequency tick marks (10^3, 10^6, 10^9, 10^12, 10^15, 10^18, 10^21)
    const logTicks = [3, 6, 9, 12, 15, 18, 21];
    logTicks.forEach((exp) => {
      const frac = (exp - logMin) / (logMax - logMin);
      const tx = paddingX + frac * barWidth;

      this.drawLine(tx, axisY - 5, tx, axisY + 5, '#94A3B8', 1);
      this.drawLabel(`10^${exp} Hz`, tx, axisY + 18, {
        font: '10px JetBrains Mono, monospace',
        color: '#64748B'
      });
    });

    // 3. Draw Active Selection Cursor
    const currentLog = Math.log10(Math.max(3e3, frequency));
    const cursorFrac = Math.min(1, Math.max(0, (currentLog - logMin) / (logMax - logMin)));
    const cursorX = paddingX + cursorFrac * barWidth;

    // Glowing vertical cursor line
    this.ctx.save();
    this.ctx.shadowColor = selectedBand ? selectedBand.color : '#06B6D4';
    this.ctx.shadowBlur = 12;
    this.drawLine(cursorX, barY - 8, cursorX, barY + barHeight + 8, '#FFFFFF', 3);
    this.ctx.restore();

    // Cursor indicator handle (Triangle)
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.moveTo(cursorX, barY - 12);
    this.ctx.lineTo(cursorX - 7, barY - 22);
    this.ctx.lineTo(cursorX + 7, barY - 22);
    this.ctx.closePath();
    this.ctx.fill();

    // Selected frequency text above cursor
    const freqFormatted = this.formatFreqText(frequency);
    this.drawLabel(freqFormatted, cursorX, barY - 32, {
      font: 'bold 12px JetBrains Mono, monospace',
      color: '#06B6D4',
      bgColor: 'rgba(15, 23, 42, 0.9)',
      padding: 6
    });
  }

  /**
   * Format frequency number to human readable SI units (kHz, MHz, GHz, THz, PHz, EHz)
   */
  formatFreqText(f) {
    if (f >= 1e18) return `${(f / 1e18).toFixed(2)} EHz`;
    if (f >= 1e15) return `${(f / 1e15).toFixed(2)} PHz`;
    if (f >= 1e12) return `${(f / 1e12).toFixed(2)} THz`;
    if (f >= 1e9) return `${(f / 1e9).toFixed(2)} GHz`;
    if (f >= 1e6) return `${(f / 1e6).toFixed(2)} MHz`;
    if (f >= 1e3) return `${(f / 1e3).toFixed(2)} kHz`;
    return `${f.toFixed(0)} Hz`;
  }
}
