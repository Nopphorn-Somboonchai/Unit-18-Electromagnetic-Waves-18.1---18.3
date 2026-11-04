/**
 * @file polaroid-plotter.js
 * @description Canvas Plotter Adapter for Light Polarization & Malus's Law (Simulator 18.3).
 * Renders Unpolarized Light -> P1 Polarizer -> Linearly Polarized Light -> P2 Analyzer -> Transmitted Light.
 * Fully optimized for touch devices (iPad, Mobile) and high-DPI desktop viewports.
 */

import { CanvasRenderer } from './canvas-renderer.js';

export class PolaroidPlotter extends CanvasRenderer {
  constructor(canvas) {
    super(canvas);
    this.lastState = {
      analyzerAngle: 45,
      intensity1: 50,
      intensity2: 25,
      isCrossed: false
    };
  }

  /**
   * Get center and active touch radius of Analyzer P2 for direct canvas interaction
   * @returns {{x: number, y: number, radius: number}}
   */
  getP2Center() {
    const width = this.width;
    const height = this.height;
    const startX = Math.max(16, width * 0.04);
    const endX = Math.min(width - 16, width * 0.96);
    const usableWidth = endX - startX;
    const sheetHeight = Math.max(115, Math.min(170, height * 0.48));

    return {
      x: startX + usableWidth * 0.67,
      y: height / 2,
      radius: Math.max(50, sheetHeight * 0.55)
    };
  }

  /**
   * Render complete polarization setup
   * @param {Object} [state]
   * @param {number} [state.analyzerAngle=45] - Analyzer angle θ in degrees (0..360)
   * @param {number} [state.intensity1=50] - Intensity after P1 (e.g. 50%)
   * @param {number} [state.intensity2=25] - Transmitted intensity after P2 (e.g. 0..50%)
   * @param {boolean} [state.isCrossed=false] - Whether polaroids are crossed (θ = 90° or 270°)
   */
  render(state) {
    if (state) {
      this.lastState = { ...this.lastState, ...state };
    }
    const { analyzerAngle = 45, intensity1 = 50, intensity2 = 25, isCrossed = false } = this.lastState;

    this.clear('#090D16');

    const width = this.width;
    const height = this.height;
    const isCompact = width < 640;
    const isUltraCompact = width < 480;

    const centerY = height / 2;

    // Responsive Horizontal Boundaries
    const startX = Math.max(16, width * 0.04);
    const endX = Math.min(width - 16, width * 0.96);
    const usableWidth = endX - startX;

    // Dynamic Polaroids Positions (1/3 and 2/3 distribution)
    const p1X = startX + usableWidth * 0.33;
    const p2X = startX + usableWidth * 0.67;

    // Responsive Sheet Dimensions (guaranteed generous height)
    const sheetWidth = Math.max(42, Math.min(68, width * 0.08));
    const sheetHeight = Math.max(115, Math.min(170, height * 0.48));
    const halfSheetW = sheetWidth / 2;
    const gap = Math.max(6, Math.min(14, width * 0.015));

    // Responsive Ray Amplitude / Vector Length
    const rayLen = Math.max(18, Math.min(32, sheetHeight * 0.22));

    // 1. Draw Optical Axis (Center ray dashed line)
    this.drawLine(startX, centerY, endX, centerY, 'rgba(255, 255, 255, 0.15)', 1, [6, 6]);

    // 2. Section A: Unpolarized Light Beam (Left -> P1)
    const secAX1 = startX + 4;
    const secAX2 = p1X - halfSheetW - gap;
    this.drawUnpolarizedBeam(secAX1, secAX2, centerY, rayLen, isCompact, isUltraCompact);

    // 3. Draw Polaroid P1 (Polarizer - Fixed Vertical 0°)
    const p1Label = isCompact ? 'P1' : 'P1: Polarizer';
    this.drawPolaroidSheet(p1X, centerY, 0, p1Label, '#3B82F6', sheetWidth, sheetHeight, isCompact, false);

    // 4. Section B: Linearly Polarized Light Beam (P1 -> P2)
    const secBX1 = p1X + halfSheetW + gap;
    const secBX2 = p2X - halfSheetW - gap;
    this.drawPolarizedBeam(secBX1, secBX2, centerY, 0, intensity1, rayLen, isCompact, isUltraCompact);

    // 5. Draw Polaroid P2 (Analyzer - Rotatable θ with interactive compass ring)
    const p2Label = isCompact ? 'P2' : 'P2: Analyzer';
    this.drawPolaroidSheet(p2X, centerY, analyzerAngle, p2Label, '#F59E0B', sheetWidth, sheetHeight, isCompact, true);

    // 6. Section C: Transmitted Light Beam (After P2)
    const secCX1 = p2X + halfSheetW + gap;
    const secCX2 = endX - 4;
    this.drawTransmittedBeam(secCX1, secCX2, centerY, analyzerAngle, intensity2, isCrossed, rayLen, isCompact, isUltraCompact);

    // 7. Draw Labels and Status Overlay
    this.drawStatusOverlay(analyzerAngle, intensity2, isCrossed, isCompact);
  }

  /**
   * Draw Unpolarized Light Beam (multi-directional arrows)
   */
  drawUnpolarizedBeam(x1, x2, cy, rayLen, isCompact, isUltraCompact) {
    if (x2 <= x1) return;
    // On ultra-compact screens (phone), use 2 well-spaced rays to avoid visual crowding
    const numRays = isUltraCompact ? 2 : (isCompact ? 3 : 4);
    const step = (x2 - x1) / numRays;

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;

      // Multi-directional field vectors (Vertical, Horizontal, 45-deg diagonals)
      this.drawLine(rx, cy - rayLen, rx, cy + rayLen, 'rgba(239, 68, 68, 0.65)', 1.6);
      this.drawLine(rx - rayLen * 0.75, cy, rx + rayLen * 0.75, cy, 'rgba(59, 130, 246, 0.65)', 1.6);
      this.drawLine(rx - rayLen * 0.55, cy - rayLen * 0.55, rx + rayLen * 0.55, cy + rayLen * 0.55, 'rgba(245, 158, 11, 0.55)', 1.2);
      this.drawLine(rx - rayLen * 0.55, cy + rayLen * 0.55, rx + rayLen * 0.55, cy - rayLen * 0.55, 'rgba(245, 158, 11, 0.55)', 1.2);
    }

    const labelX = (x1 + x2) / 2;
    const labelY = cy + rayLen + (isCompact ? 38 : 44);

    if (isCompact) {
      this.drawStackedLabel(['แสงไม่โพลาไรส์', '(I₀ = 100%)'], labelX, labelY, {
        font: isUltraCompact ? '10px Sarabun, sans-serif' : '11px Sarabun, sans-serif',
        color: '#94A3B8',
        lineHeight: 14
      });
    } else {
      this.drawLabel('แสงไม่โพลาไรส์ (I₀ = 100%)', labelX, labelY, {
        font: '11px Sarabun, sans-serif',
        color: '#94A3B8'
      });
    }
  }

  /**
   * Draw Polarized Light Beam (Single plane oscillation)
   */
  drawPolarizedBeam(x1, x2, cy, angleDeg, intensity, rayLen, isCompact, isUltraCompact) {
    if (x2 <= x1) return;
    const numRays = isUltraCompact ? 2 : (isCompact ? 3 : 4);
    const step = (x2 - x1) / numRays;
    const alpha = Math.max(0.18, intensity / 50);
    const headSize = Math.max(4, Math.min(7, rayLen * 0.22));

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;
      // Vertical oscillation vector
      this.drawLine(rx, cy - rayLen, rx, cy + rayLen, `rgba(239, 68, 68, ${alpha})`, 2.2);
      this.drawArrow(rx, cy, rx, cy - rayLen, `rgba(239, 68, 68, ${alpha})`, 2, headSize);
      this.drawArrow(rx, cy, rx, cy + rayLen, `rgba(239, 68, 68, ${alpha})`, 2, headSize);
    }

    const labelX = (x1 + x2) / 2;
    const labelY = cy + rayLen + (isCompact ? 38 : 44);

    if (isCompact) {
      this.drawStackedLabel(['แสงโพลาไรส์เชิงเส้น', `(I₁ = ${intensity.toFixed(1)}%)`], labelX, labelY, {
        font: isUltraCompact ? '10px Sarabun, sans-serif' : '11px Sarabun, sans-serif',
        color: '#EF4444',
        lineHeight: 14
      });
    } else {
      this.drawLabel(`แสงโพลาไรส์เชิงเส้น (I₁ = ${intensity.toFixed(1)}%)`, labelX, labelY, {
        font: '11px Sarabun, sans-serif',
        color: '#EF4444'
      });
    }
  }

  /**
   * Draw Transmitted Light Beam after Analyzer P2
   */
  drawTransmittedBeam(x1, x2, cy, angleDeg, intensity, isCrossed, rayLen, isCompact, isUltraCompact) {
    if (x2 <= x1) return;
    const labelX = (x1 + x2) / 2;

    if (isCrossed || intensity <= 0.1) {
      // Dark blocked state
      if (isCompact) {
        this.drawStackedLabel(['🔒 แสงถูกกั้น', '(I₂ = 0%)'], labelX, cy, {
          font: isUltraCompact ? 'bold 10px Prompt, sans-serif' : 'bold 11px Prompt, sans-serif',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.25)',
          padding: 4,
          lineHeight: 14
        });
      } else {
        this.drawLabel('🔒 แสงถูกกั้นสมบูรณ์ (I₂ = 0%)', labelX, cy, {
          font: 'bold 12px Prompt, sans-serif',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.2)',
          padding: 6
        });
      }
      return;
    }

    const numRays = isUltraCompact ? 2 : (isCompact ? 2 : 3);
    const step = (x2 - x1) / numRays;
    const alpha = Math.min(1, Math.max(0.15, intensity / 50));
    const rad = (angleDeg * Math.PI) / 180;
    const armLen = rayLen * (intensity / 50);
    const headSize = Math.max(4, Math.min(7, rayLen * 0.22));

    for (let i = 0; i <= numRays; i++) {
      const rx = x1 + i * step;
      const dx = armLen * Math.sin(rad);
      const dy = armLen * Math.cos(rad);

      this.drawLine(rx - dx, cy - dy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2.5);
      this.drawArrow(rx, cy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2, headSize);
    }

    const labelY = cy + rayLen + (isCompact ? 38 : 44);

    if (isCompact) {
      this.drawStackedLabel(['แสงผ่านออก', `(I₂ = ${intensity.toFixed(1)}%)`], labelX, labelY, {
        font: isUltraCompact ? 'bold 10px Prompt, sans-serif' : 'bold 11px Prompt, sans-serif',
        color: '#F59E0B',
        lineHeight: 14
      });
    } else {
      this.drawLabel(`ความเข้มแสงผ่านออก (I₂ = ${intensity.toFixed(1)}%)`, labelX, labelY, {
        font: 'bold 12px Prompt, sans-serif',
        color: '#F59E0B'
      });
    }
  }

  /**
   * Draw Polaroid Filter Sheet Frame, Transmission Slits, and Rotary Dial
   */
  drawPolaroidSheet(cx, cy, angleDeg, label, accentColor, width, height, isCompact, isRotatable = false) {
    const rad = (angleDeg * Math.PI) / 180;

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // If Analyzer P2 (Rotatable): Draw subtle circular degree compass & rotation guide
    if (isRotatable) {
      const ringRadius = height * 0.52;
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([3, 4]);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Cardinal angle tick marks on dial
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      this.ctx.setLineDash([]);
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((tickRad) => {
        const tx1 = (ringRadius - 5) * Math.sin(tickRad);
        const ty1 = -(ringRadius - 5) * Math.cos(tickRad);
        const tx2 = (ringRadius + 5) * Math.sin(tickRad);
        const ty2 = -(ringRadius + 5) * Math.cos(tickRad);
        this.ctx.beginPath();
        this.ctx.moveTo(tx1, ty1);
        this.ctx.lineTo(tx2, ty2);
        this.ctx.stroke();
      });
      this.ctx.restore();
    }

    // Filter outer frame glass
    this.ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 2.2;
    this.ctx.beginPath();
    this.ctx.roundRect(-width / 2, -height / 2, width, height, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw Transmission Axis Slits (Rotated according to angleDeg)
    this.ctx.strokeStyle = accentColor;
    this.ctx.lineWidth = 1.6;
    this.ctx.setLineDash([4, 4]);

    const numSlits = isCompact ? 3 : 5;
    const slitLength = height * 0.74;
    const slitSpacing = width * 0.18;
    const halfCount = Math.floor(numSlits / 2);

    for (let i = -halfCount; i <= halfCount; i++) {
      const offsetX = i * slitSpacing;
      const dx = (slitLength / 2) * Math.sin(rad);
      const dy = (slitLength / 2) * Math.cos(rad);

      this.ctx.beginPath();
      this.ctx.moveTo(offsetX - dx, -dy);
      this.ctx.lineTo(offsetX + dx, dy);
      this.ctx.stroke();
    }

    // Center Transmission Axis Arrow through center slit
    if (isRotatable) {
      const cdx = (slitLength / 2) * Math.sin(rad);
      const cdy = (slitLength / 2) * Math.cos(rad);
      this.drawArrow(0, 0, cdx, cdy, accentColor, 1.8, 5);
      this.drawArrow(0, 0, -cdx, -cdy, accentColor, 1.8, 5);
    }

    this.ctx.restore();

    // Draw Label below Polaroid sheet
    const font = isCompact ? 'bold 11px Prompt, sans-serif' : 'bold 12px Prompt, sans-serif';
    this.drawLabel(`${label} (${angleDeg}°)`, cx, cy + height / 2 + (isCompact ? 18 : 22), {
      font,
      color: accentColor
    });

    // Touch hint indicator above Analyzer P2 on compact screens
    if (isRotatable && isCompact) {
      this.drawLabel('↻ แตะหมุนได้', cx, cy - height / 2 - 14, {
        font: '9px Prompt, sans-serif',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        padding: 3
      });
    }
  }

  /**
   * Draw Overlay status info
   */
  drawStatusOverlay(angleDeg, intensity2, isCrossed, isCompact) {
    const font = isCompact ? 'bold 11px JetBrains Mono, monospace' : 'bold 13px JetBrains Mono, monospace';
    const padding = isCompact ? 4 : 6;
    const x = isCompact ? 12 : 20;
    const y = isCompact ? 16 : 20;

    this.drawLabel(`มุม θ = ${angleDeg}°`, x, y, {
      font,
      color: isCrossed ? '#EF4444' : '#F59E0B',
      align: 'left',
      bgColor: 'rgba(15, 23, 42, 0.92)',
      padding
    });
  }
}
