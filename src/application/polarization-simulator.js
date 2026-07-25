/**
 * @file polarization-simulator.js
 * @description Application Service Orchestrator for Simulator 18.3 (Polarization & Malus's Law).
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

    // Initial update & render
    this.setAnalyzerAngle(this.analyzerAngle);
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
    this.plotter.destroy();
  }
}
