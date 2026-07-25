/**
 * @file wave-field-plotter.js
 * @description Canvas Plotter Adapter for EM Wave 3D Vector Fields (Simulator 18.1).
 * Renders perpendicular E-field (red) and B-field (blue) sinusoidal vector fields.
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

    const originX = 70;
    const originY = this.height / 2 + 10;
    const axisLengthX = this.width - 120;

    // 1. Draw 3D Coordinate Axes (X: propagation v, Y: E-field, Z: B-field)
    this.drawAxes(originX, originY, axisLengthX);

    // 2. Sample points along propagation axis X
    const samples = 120;
    const stepX = axisLengthX / samples;
    const numCycles = 2.5; // Display 2.5 wavelengths in viewport
    const k = (2 * Math.PI * numCycles) / axisLengthX;

    const ePoints = [];
    const bPoints = [];

    for (let i = 0; i <= samples; i++) {
      const px = i * stepX;
      const val = Math.sin(k * px - phaseShift);

      // E-field along Y axis (Vertical)
      const eY = originY - val * amplitude;
      const eX = originX + px;
      ePoints.push({ x: eX, y: eY, val });

      // B-field along Z axis (Slanted isometric projection)
      const bLen = val * amplitude * 0.7; // Scale B for isometric depth
      const bX = originX + px + bLen * Math.cos(this.tiltAngle);
      const bY = originY + bLen * Math.sin(this.tiltAngle);
      bPoints.push({ x: bX, y: bY, val });
    }

    // 3. Draw Continuous Envelope Enclosures
    this.drawEnvelope(originX, originY, ePoints, '#cc785c', 'rgba(204, 120, 92, 0.15)'); // Warm Coral E-field
    this.drawEnvelope(originX, originY, bPoints, '#5db8a6', 'rgba(93, 184, 166, 0.15)'); // Accent Teal B-field

    // 4. Draw Discrete Vector Arrows along Wave
    const arrowInterval = 6;
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
    this.drawArrow(endX - 40, originY, endX + 15, originY, '#10B981', 3, 10);
    this.drawLabel('v (ทิศการเคลื่อนที่)', endX + 25, originY - 15, {
      font: 'bold 12px Prompt, sans-serif',
      color: '#10B981',
      align: 'right',
      bgColor: 'rgba(16, 185, 129, 0.15)'
    });

    // 6. Draw Vector Legend Box
    this.drawLegend();
  }

  /**
   * Draw 3D coordinate system axes
   */
  drawAxes(ox, oy, axisLen) {
    // X Axis (Propagation axis v)
    this.drawLine(ox, oy, ox + axisLen + 20, oy, '#64748B', 1.5);
    this.drawLabel('X (แกนการแผ่)', ox + axisLen + 25, oy + 15, { font: '11px Sarabun, sans-serif', color: '#94A3B8' });

    // Y Axis (E-field axis)
    this.drawLine(ox, oy + 110, ox, oy - 110, '#cc785c', 1.5, [4, 4]);
    this.drawLabel('+E (สนามไฟฟ้า)', ox, oy - 120, { font: 'bold 12px Prompt, sans-serif', color: '#cc785c' });

    // Z Axis (B-field axis - Slanted)
    const zLen = 90;
    const zX1 = ox - zLen * Math.cos(this.tiltAngle);
    const zY1 = oy - zLen * Math.sin(this.tiltAngle);
    const zX2 = ox + zLen * Math.cos(this.tiltAngle);
    const zY2 = oy + zLen * Math.sin(this.tiltAngle);
    this.drawLine(zX1, zY1, zX2, zY2, '#5db8a6', 1.5, [4, 4]);
    this.drawLabel('+B (สนามแม่เหล็ก)', zX2 + 15, zY2 + 10, { font: 'bold 12px Prompt, sans-serif', color: '#5db8a6' });
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
   * Draw On-Canvas Legend for Vector Fields
   */
  drawLegend() {
    const lx = 20;
    const ly = 20;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(24, 23, 21, 0.9)';
    this.ctx.strokeStyle = 'rgba(230, 223, 216, 0.15)';
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(lx, ly, 190, 75);
    this.ctx.strokeRect(lx, ly, 190, 75);

    // E-field legend
    this.drawArrow(lx + 10, ly + 20, lx + 35, ly + 20, '#cc785c', 2, 4);
    this.drawLabel('เวกเตอร์สนามไฟฟ้า E (ตั้งฉาก)', lx + 45, ly + 20, { font: '11px Sarabun, sans-serif', color: '#F8FAFC', align: 'left' });

    // B-field legend
    this.drawArrow(lx + 10, ly + 40, lx + 35, ly + 40, '#5db8a6', 2, 4);
    this.drawLabel('เวกเตอร์สนามแม่เหล็ก B (ตั้งฉาก)', lx + 45, ly + 40, { font: '11px Sarabun, sans-serif', color: '#F8FAFC', align: 'left' });

    // Right hand rule note
    this.drawLabel('กฎมือขวา: E × B = v (เฟสตรงกัน)', lx + 10, ly + 60, { font: '10px Sarabun, sans-serif', color: '#10B981', align: 'left' });
    this.ctx.restore();
  }

}
