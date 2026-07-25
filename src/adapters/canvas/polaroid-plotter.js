/**
 * @file polaroid-plotter.js
 * @description Canvas Plotter Adapter for Light Polarization & Malus's Law (Simulator 18.3).
 * Renders Unpolarized Light -> P1 Polarizer -> Linearly Polarized Light -> P2 Analyzer -> Transmitted Light.
 */

import { CanvasRenderer } from './canvas-renderer.js';

export class PolaroidPlotter extends CanvasRenderer {
  /**
   * Render complete polarization setup
   * @param {Object} state
   * @param {number} state.analyzerAngle - Analyzer angle θ in degrees (0..360)
   * @param {number} state.intensity1 - Intensity after P1 (e.g. 50%)
   * @param {number} state.intensity2 - Transmitted intensity after P2 (e.g. 0..50%)
   * @param {boolean} state.isCrossed - Whether polaroids are crossed (θ = 90° or 270°)
   */
  render(state) {
    const { analyzerAngle = 45, intensity1 = 50, intensity2 = 25, isCrossed = false } = state;

    this.clear('#090D16');

    const centerY = this.height / 2;
    const p1X = 260; // X position of Polarizer P1
    const p2X = 540; // X position of Analyzer P2

    // 1. Draw Optical Axis (Center ray line)
    this.drawLine(40, centerY, this.width - 50, centerY, 'rgba(255, 255, 255, 0.15)', 1, [6, 6]);

    // 2. Section A: Unpolarized Light Beam (Left -> P1)
    this.drawUnpolarizedBeam(40, p1X - 30, centerY);

    // 3. Draw Polaroid P1 (Polarizer - Fixed Vertical 0°)
    this.drawPolaroidSheet(p1X, centerY, 0, 'P1: Polarizer', '#3B82F6');

    // 4. Section B: Linearly Polarized Light Beam (P1 -> P2)
    this.drawPolarizedBeam(p1X + 30, p2X - 30, centerY, 0, intensity1);

    // 5. Draw Polaroid P2 (Analyzer - Rotatable θ)
    this.drawPolaroidSheet(p2X, centerY, analyzerAngle, 'P2: Analyzer', '#F59E0B');

    // 6. Section C: Transmitted Light Beam (After P2)
    this.drawTransmittedBeam(p2X + 30, this.width - 60, centerY, analyzerAngle, intensity2, isCrossed);

    // 7. Draw Labels and Status Overlay
    this.drawStatusOverlay(analyzerAngle, intensity2, isCrossed);
  }

  /**
   * Draw Unpolarized Light Beam (multi-directional arrows)
   */
  drawUnpolarizedBeam(x1, x2, cy) {
    const numRays = 4;
    const step = (x2 - x1) / numRays;

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;

      // Multi-directional field vectors (Vertical, Horizontal, 45-deg)
      this.drawLine(rx, cy - 35, rx, cy + 35, 'rgba(239, 68, 68, 0.6)', 1.5);
      this.drawLine(rx - 25, cy, rx + 25, cy, 'rgba(59, 130, 246, 0.6)', 1.5);
      this.drawLine(rx - 18, cy - 18, rx + 18, cy + 18, 'rgba(245, 158, 11, 0.5)', 1.2);
      this.drawLine(rx - 18, cy + 18, rx + 18, cy - 18, 'rgba(245, 158, 11, 0.5)', 1.2);
    }

    this.drawLabel('แสงไม่โพลาไรส์ (I₀ = 100%)', (x1 + x2) / 2, cy + 65, {
      font: '11px Sarabun, sans-serif',
      color: '#94A3B8'
    });
  }

  /**
   * Draw Polarized Light Beam (Single plane oscillation)
   */
  drawPolarizedBeam(x1, x2, cy, angleDeg, intensity) {
    const numRays = 4;
    const step = (x2 - x1) / numRays;
    const alpha = Math.max(0.15, intensity / 50);

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;
      // Vertical oscillation vector
      this.drawLine(rx, cy - 30, rx, cy + 30, `rgba(239, 68, 68, ${alpha})`, 2.2);
      this.drawArrow(rx, cy, rx, cy - 30, `rgba(239, 68, 68, ${alpha})`, 2, 4);
      this.drawArrow(rx, cy, rx, cy + 30, `rgba(239, 68, 68, ${alpha})`, 2, 4);
    }

    this.drawLabel(`แสงโพลาไรส์เชิงเส้น (I₁ = ${intensity.toFixed(1)}%)`, (x1 + x2) / 2, cy + 65, {
      font: '11px Sarabun, sans-serif',
      color: '#EF4444'
    });
  }

  /**
   * Draw Transmitted Light Beam after Analyzer P2
   */
  drawTransmittedBeam(x1, x2, cy, angleDeg, intensity, isCrossed) {
    if (isCrossed || intensity <= 0.1) {
      // Dark blocked state
      this.drawLabel('🔒 แสงถูกกั้นสมบูรณ์ (I₂ = 0%)', (x1 + x2) / 2, cy, {
        font: 'bold 12px Prompt, sans-serif',
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.2)',
        padding: 6
      });
      return;
    }

    const numRays = 3;
    const step = (x2 - x1) / numRays;
    const alpha = Math.min(1, Math.max(0.1, intensity / 50));
    const rad = (angleDeg * Math.PI) / 180;
    const armLen = 30 * (intensity / 50);

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;
      const dx = armLen * Math.sin(rad);
      const dy = armLen * Math.cos(rad);

      this.drawLine(rx - dx, cy - dy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2.5);
      this.drawArrow(rx, cy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2, 4);
    }

    this.drawLabel(`ความเข้มแสงผ่านออก (I₂ = ${intensity.toFixed(1)}%)`, (x1 + x2) / 2, cy + 65, {
      font: 'bold 12px Prompt, sans-serif',
      color: '#F59E0B'
    });
  }

  /**
   * Draw Polaroid Filter Sheet Frame and Slits
   */
  drawPolaroidSheet(cx, cy, angleDeg, label, accentColor) {
    const width = 70;
    const height = 150;
    const rad = (angleDeg * Math.PI) / 180;

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // Filter outer frame glass
    this.ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(-width / 2, -height / 2, width, height, 10);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw Transmission Axis Slits (Rotated according to angleDeg)
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);

    const numSlits = 5;
    const slitLength = 110;

    for (let i = -2; i <= 2; i++) {
      const offsetX = i * 12;
      const dx = (slitLength / 2) * Math.sin(rad);
      const dy = (slitLength / 2) * Math.cos(rad);

      this.ctx.beginPath();
      this.ctx.moveTo(offsetX - dx, -dy);
      this.ctx.lineTo(offsetX + dx, dy);
      this.ctx.stroke();
    }

    this.ctx.restore();

    // Draw Label below Polaroid sheet
    this.drawLabel(`${label} (${angleDeg}°)`, cx, cy + height / 2 + 20, {
      font: 'bold 12px Prompt, sans-serif',
      color: accentColor
    });
  }

  /**
   * Draw Overlay status info
   */
  drawStatusOverlay(angleDeg, intensity2, isCrossed) {
    this.drawLabel(`มุม θ = ${angleDeg}°`, 20, 20, {
      font: 'bold 13px JetBrains Mono, monospace',
      color: isCrossed ? '#EF4444' : '#F59E0B',
      align: 'left',
      bgColor: 'rgba(15, 23, 42, 0.9)',
      padding: 6
    });
  }
}
