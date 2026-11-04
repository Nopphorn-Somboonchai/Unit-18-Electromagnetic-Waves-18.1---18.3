/**
 * @file wave-field-plotter.js
 * @description Canvas Plotter Adapter for EM Wave 3D Vector Fields (Simulator 18.1).
 * Renders perpendicular E-field (red) and B-field (blue) sinusoidal vector fields.
 * Fully responsive for Mobile, iPad, and Desktop viewports.
 * Follows Canvas-Guidelines.md (receives state, renders visually, performs no physics solvers).
 */

import { CanvasRenderer } from './canvas-renderer.js';

export class WaveFieldPlotter extends CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    super(canvas);
    this.tiltAngle = Math.PI / 6; // 30-degree isometric slant for Z-axis (B-field)
  }

  /**
   * Render complete EM wave field
   * @param {Object} state - Simulator state from em-wave-simulator
   * @param {number} state.frequency - Frequency in Hz
   * @param {number} state.wavelength - Wavelength in meters
   * @param {number} state.phaseShift - Current phase shift from animation (radians)
   * @param {number} [state.amplitude=70] - Amplitude scale in pixels
   */
  render(state) {
    const { phaseShift = 0, amplitude = 70 } = state;

    this.clear('#090D16');

    const isCompact = this.width < 640;
    const originX = Math.max(45, Math.min(70, this.width * 0.1));
    const originY = this.height / 2 + 10;
    const axisLengthX = Math.max(160, this.width - originX - (isCompact ? 50 : 85));

    // Calculate dynamic amplitude ensuring waves NEVER touch or exceed canvas bounds
    const maxAllowedAmp = Math.max(25, originY - 45);
    const waveAmp = Math.max(28, Math.min(maxAllowedAmp, (this.height - 90) * 0.3));

    // 1. Draw 3D Coordinate Axes (X: propagation v, Y: E-field, Z: B-field)
    this.drawAxes(originX, originY, axisLengthX, waveAmp, isCompact);

    // 2. Sample points along propagation axis X
    const samples = isCompact ? 80 : 120;
    const stepX = axisLengthX / samples;
    const numCycles = isCompact ? 2.0 : 2.5; // Slightly fewer cycles on mobile for clear wave visibility
    const k = (2 * Math.PI * numCycles) / axisLengthX;

    const ePoints = [];
    const bPoints = [];

    for (let i = 0; i <= samples; i++) {
      const px = i * stepX;
      const val = Math.sin(k * px - phaseShift);

      // E-field along Y axis (Vertical)
      const eY = originY - val * waveAmp;
      const eX = originX + px;
      ePoints.push({ x: eX, y: eY, val });

      // B-field along Z axis (Slanted isometric projection)
      const bLen = val * waveAmp * 0.7; // Scale B for isometric depth
      const bX = originX + px + bLen * Math.cos(this.tiltAngle);
      const bY = originY + bLen * Math.sin(this.tiltAngle);
      bPoints.push({ x: bX, y: bY, val });
    }

    // 3. Draw Continuous Envelope Enclosures
    this.drawEnvelope(originX, originY, ePoints, '#cc785c', 'rgba(204, 120, 92, 0.15)'); // Warm Coral E-field
    this.drawEnvelope(originX, originY, bPoints, '#5db8a6', 'rgba(93, 184, 166, 0.15)'); // Accent Teal B-field

    // 4. Draw Discrete Vector Arrows along Wave
    const arrowInterval = isCompact ? 8 : 6;
    for (let i = 0; i <= samples; i += arrowInterval) {
      const eP = ePoints[i];
      const bP = bPoints[i];
      const posX = originX + i * stepX;

      // E-field vector arrow (Vertical)
      if (Math.abs(eP.val) > 0.05) {
        this.drawArrow(posX, originY, eP.x, eP.y, '#cc785c', 1.8, 5);
      }

      // B-field vector arrow (Slanted)
      if (Math.abs(bP.val) > 0.05) {
        this.drawArrow(posX, originY, bP.x, bP.y, '#5db8a6', 1.8, 5);
      }
    }

    // 5. Draw Velocity Vector v (Green Arrow along X)
    const endX = originX + axisLengthX;
    this.drawArrow(endX - 35, originY, endX + 12, originY, '#10B981', 2.6, 8);
    const vLabel = isCompact ? 'v' : 'v (การแผ่)';
    this.drawLabel(vLabel, endX + (isCompact ? 15 : 22), originY - (isCompact ? 12 : 16), {
      font: 'bold 11px Prompt, sans-serif',
      color: '#10B981',
      align: 'right',
      bgColor: 'rgba(16, 185, 129, 0.2)',
      padding: 3
    });

    // 6. Draw Responsive Vector Legend (No Wave Collision!)
    this.drawLegend(isCompact);
  }

  /**
   * Draw 3D coordinate system axes scaled proportionally to wave amplitude
   */
  drawAxes(ox, oy, axisLen, amplitude, isCompact) {
    // X Axis (Propagation axis v)
    this.drawLine(ox, oy, ox + axisLen + 15, oy, '#64748B', 1.5);
    this.drawLabel('X', ox + axisLen + 18, oy + (isCompact ? 12 : 15), {
      font: '10px Sarabun, sans-serif',
      color: '#94A3B8'
    });

    // Y Axis (E-field axis) - scaled dynamically to stay strictly within canvas bounds
    const ySpan = amplitude * 1.35;
    this.drawLine(ox, oy + ySpan, ox, oy - ySpan, '#cc785c', 1.5, [4, 4]);
    this.drawLabel('+E', ox, oy - ySpan - 10, {
      font: isCompact ? 'bold 11px Prompt, sans-serif' : 'bold 12px Prompt, sans-serif',
      color: '#cc785c'
    });

    // Z Axis (B-field axis - Slanted 30-deg) - scaled dynamically
    const zLen = amplitude * 1.2;
    const zX1 = ox - zLen * Math.cos(this.tiltAngle);
    const zY1 = oy - zLen * Math.sin(this.tiltAngle);
    const zX2 = ox + zLen * Math.cos(this.tiltAngle);
    const zY2 = oy + zLen * Math.sin(this.tiltAngle);
    this.drawLine(zX1, zY1, zX2, zY2, '#5db8a6', 1.5, [4, 4]);
    this.drawLabel('+B', zX2 + 10, zY2 + 8, {
      font: isCompact ? 'bold 11px Prompt, sans-serif' : 'bold 12px Prompt, sans-serif',
      color: '#5db8a6'
    });
  }

  /**
   * Draw wave envelope curve
   */
  drawEnvelope(ox, oy, points, strokeColor, fillColor) {
    if (points.length === 0) return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(ox, oy);

    for (let i = 0; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.lineTo(points[points.length - 1].x, oy);
    this.ctx.closePath();

    this.ctx.fillStyle = fillColor;
    this.ctx.fill();

    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draw On-Canvas Legend for Vector Fields (Responsive & Collision-Free)
   */
  drawLegend(isCompact) {
    if (isCompact) {
      // Sleek top-pill on mobile viewports so wave amplitude has 100% breathing room
      const lx = 14;
      const ly = 14;
      this.drawLabel('● E (ไฟฟ้า) | ● B (แม่เหล็ก) | ▶ v', lx, ly, {
        font: '10px JetBrains Mono, monospace',
        color: '#E2E8F0',
        align: 'left',
        bgColor: 'rgba(15, 23, 42, 0.9)',
        padding: 5
      });
      return;
    }

    // Desktop: Sleek compact legend box at top-left
    const lx = 20;
    const ly = 16;
    const boxW = 180;
    const boxH = 68;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(lx, ly, boxW, boxH, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // E-field legend
    this.drawArrow(lx + 10, ly + 18, lx + 30, ly + 18, '#cc785c', 2, 4);
    this.drawLabel('เวกเตอร์ E (สนามไฟฟ้า)', lx + 38, ly + 18, {
      font: '11px Sarabun, sans-serif',
      color: '#F8FAFC',
      align: 'left'
    });

    // B-field legend
    this.drawArrow(lx + 10, ly + 36, lx + 30, ly + 36, '#5db8a6', 2, 4);
    this.drawLabel('เวกเตอร์ B (สนามแม่เหล็ก)', lx + 38, ly + 36, {
      font: '11px Sarabun, sans-serif',
      color: '#F8FAFC',
      align: 'left'
    });

    // Right-hand rule note
    this.drawLabel('กฎมือขวา: E × B = v', lx + 10, ly + 54, {
      font: '10px Sarabun, sans-serif',
      color: '#10B981',
      align: 'left'
    });
    this.ctx.restore();
  }
}
