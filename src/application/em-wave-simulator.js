/**
 * @file em-wave-simulator.js
 * @description Application Service Orchestrator for Simulator 18.1 (EM Wave Vector Fields).
 * Follows the Simulator Lifecycle: Initialize -> Load Parameters -> Calculate -> Update -> Render.
 */

import { WaveFieldPlotter } from '../adapters/canvas/wave-field-plotter.js';
import { createEMWave } from '../physics/em-wave-model.js';
import { calculateWavelength } from '../physics/em-wave-engine.js';
import { APP_CONFIG } from '../shared/config.js';

export class EMWaveSimulator {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.plotter = new WaveFieldPlotter(canvas);

    // Initial state
    this.frequency = APP_CONFIG.emWaveDefaults.frequency;
    this.wavelength = calculateWavelength(this.frequency);
    this.emWaveModel = createEMWave({ frequency: this.frequency });

    this.phaseShift = 0;
    this.isAnimating = true;
    this.animFrameId = null;
    this.lastTimestamp = 0;

    // Callbacks for UI updates
    this.onUpdateCallback = null;

    // Start render loop
    this.start();
  }

  /**
   * Update simulator parameters from UI controls
   * @param {number} newFrequency - Frequency in Hz
   */
  setFrequency(newFrequency) {
    this.frequency = Math.max(10e6, Number(newFrequency));
    this.wavelength = calculateWavelength(this.frequency);
    this.emWaveModel = createEMWave({ frequency: this.frequency });

    if (this.onUpdateCallback) {
      this.onUpdateCallback({
        frequency: this.frequency,
        wavelength: this.wavelength
      });
    }

    this.render();
  }

  /**
   * Start / Resume animation loop
   */
  start() {
    if (this.isAnimating && this.animFrameId) return;
    this.isAnimating = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  /**
   * Pause animation loop
   */
  pause() {
    this.isAnimating = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Toggle Play / Pause state
   */
  toggleAnimation() {
    if (this.isAnimating) {
      this.pause();
    } else {
      this.start();
    }
    return this.isAnimating;
  }

  /**
   * Animation Frame Loop
   */
  loop(timestamp) {
    if (!this.isAnimating) return;

    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Phase advance proportional to frequency and delta time
    const speedMultiplier = 2.5;
    this.phaseShift += delta * speedMultiplier * (Math.log10(this.frequency) - 5);

    this.render();

    this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  /**
   * Render current frame to canvas
   */
  render() {
    this.plotter.render({
      frequency: this.frequency,
      wavelength: this.wavelength,
      phaseShift: this.phaseShift,
      amplitude: APP_CONFIG.emWaveDefaults.amplitude
    });
  }

  /**
   * Cleanup resources on tab destroy
   */
  destroy() {
    this.pause();
    this.plotter.destroy();
  }
}
