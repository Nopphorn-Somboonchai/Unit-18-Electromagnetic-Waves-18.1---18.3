/**
 * @file polarization-simulator.js
 * @description Application Service Orchestrator for Simulator 18.3 (Polarization & Malus's Law).
 * Features direct touch/drag rotation on Canvas for iPad and Mobile devices.
 */

import { PolaroidPlotter } from '../adapters/canvas/polaroid-plotter.js';
import { calculateIntensityThroughTwoPolaroids } from '../physics/polarization-solver.js';
import { APP_CONFIG } from '../shared/config.js';

export class PolarizationSimulator {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.plotter = new PolaroidPlotter(canvas);

    this.polarizerAngle = APP_CONFIG.polarizationDefaults.polarizerAngle; // 0 degrees
    this.analyzerAngle = APP_CONFIG.polarizationDefaults.analyzerAngle;   // 45 degrees
    this.initialIntensity = APP_CONFIG.polarizationDefaults.initialIntensity; // 100%

    this.onIntensityChangeCallback = null;
    this.onAngleChangeCallback = null;

    // Trigger re-render on canvas resize / orientation change
    this.plotter.onResize = () => {
      this.render();
    };

    // Attach direct touch / pointer rotation on Canvas
    this._initCanvasPointerInteraction();

    // Initial update & render
    this.setAnalyzerAngle(this.analyzerAngle);
  }

  /**
   * Initialize direct touch/pointer rotation on Canvas for Analyzer P2
   */
  _initCanvasPointerInteraction() {
    const canvas = this.plotter.canvas;
    if (!canvas || typeof window === 'undefined') return;

    let isDragging = false;

    const getTouchAngle = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = evt.clientX - rect.left;
      const touchY = evt.clientY - rect.top;
      const { x: p2X, y: p2Y } = this.plotter.getP2Center();

      const dx = touchX - p2X;
      const dy = touchY - p2Y;

      // Calculate angle from vertical axis (0 deg is vertical up)
      let deg = Math.round(Math.atan2(dx, -dy) * (180 / Math.PI));
      if (deg < 0) deg += 360;
      return deg % 360;
    };

    const isNearP2 = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = evt.clientX - rect.left;
      const touchY = evt.clientY - rect.top;
      const { x: p2X, y: p2Y, radius } = this.plotter.getP2Center();
      const dist = Math.hypot(touchX - p2X, touchY - p2Y);
      // Active interaction radius around Analyzer P2
      return dist <= radius * 1.5;
    };

    this._onPointerDown = (evt) => {
      if (isNearP2(evt)) {
        isDragging = true;
        try {
          canvas.setPointerCapture(evt.pointerId);
        } catch (_) {}
        const newAngle = getTouchAngle(evt);
        this.setAnalyzerAngle(newAngle);
        if (this.onAngleChangeCallback) {
          this.onAngleChangeCallback(newAngle);
        }
      }
    };

    this._onPointerMove = (evt) => {
      if (!isDragging) return;
      evt.preventDefault();
      const newAngle = getTouchAngle(evt);
      this.setAnalyzerAngle(newAngle);
      if (this.onAngleChangeCallback) {
        this.onAngleChangeCallback(newAngle);
      }
    };

    this._onPointerUp = (evt) => {
      if (isDragging) {
        isDragging = false;
        try {
          canvas.releasePointerCapture(evt.pointerId);
        } catch (_) {}
      }
    };

    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointermove', this._onPointerMove);
    canvas.addEventListener('pointerup', this._onPointerUp);
    canvas.addEventListener('pointercancel', this._onPointerUp);
  }

  /**
   * Update analyzer angle θ2 and re-evaluate Malus's Law
   * @param {number} newAngle - Angle in degrees (0..360)
   */
  setAnalyzerAngle(newAngle) {
    this.analyzerAngle = Number(newAngle) % 360;
    if (this.analyzerAngle < 0) this.analyzerAngle += 360;

    const result = calculateIntensityThroughTwoPolaroids(
      this.initialIntensity,
      this.polarizerAngle,
      this.analyzerAngle
    );

    this.intensity1 = result.I1;
    this.intensity2 = result.I2;
    this.isCrossed = result.isCrossed;

    if (this.onIntensityChangeCallback) {
      this.onIntensityChangeCallback({
        analyzerAngle: this.analyzerAngle,
        intensity1: this.intensity1,
        intensity2: this.intensity2,
        isCrossed: this.isCrossed
      });
    }

    this.render();
  }

  /**
   * Recalculate dimensions and re-render canvas
   */
  resizeAndRender() {
    this.plotter.resize();
    this.render();
  }

  /**
   * Render canvas
   */
  render() {
    this.plotter.render({
      analyzerAngle: this.analyzerAngle,
      intensity1: this.intensity1,
      intensity2: this.intensity2,
      isCrossed: this.isCrossed
    });
  }

  /**
   * Cleanup resources
   */
  destroy() {
    const canvas = this.plotter.canvas;
    if (canvas && this._onPointerDown) {
      canvas.removeEventListener('pointerdown', this._onPointerDown);
      canvas.removeEventListener('pointermove', this._onPointerMove);
      canvas.removeEventListener('pointerup', this._onPointerUp);
      canvas.removeEventListener('pointercancel', this._onPointerUp);
    }
    this.plotter.destroy();
  }
}
