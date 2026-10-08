/**
 * @file main.js
 * @description Main application entry point for Unit 18 Interactive Physics Portal.
 * Initializes Simulators, Adapters, Quiz System, Timed Exam, Section Navigator, and KaTeX rendering.
 * Designed according to U-17 Reference Architecture.
 */

import { APP_CONFIG } from './shared/config.js';
import { SPEED_OF_LIGHT, PLANCK_CONSTANT } from './shared/constants.js';

import { EMWaveSimulator } from './application/em-wave-simulator.js';
import { SpectrumSimulator } from './application/spectrum-simulator.js';
import { PolarizationSimulator } from './application/polarization-simulator.js';

import { ControlPanelAdapter } from './adapters/ui/control-panel.js';
import { TabNavigatorAdapter } from './adapters/ui/tab-navigator.js';
import { QuizUIAdapter } from './adapters/ui/quiz-ui.js';
import { ExamUIAdapter } from './adapters/ui/exam-ui.js';
import { KaTeXAdapter } from './adapters/formula/katex-adapter.js';

// Setup Global Error Boundary
setupErrorBoundary();

document.addEventListener('DOMContentLoaded', () => {
  console.log(`[Physics Portal] Initializing ${APP_CONFIG.appName} v${APP_CONFIG.version}`);
  console.log(`[Physics Constants] c = ${SPEED_OF_LIGHT.toExponential(2)} m/s, h = ${PLANCK_CONSTANT.toExponential(3)} J·s`);

  // Verify Offline KaTeX Engine
  verifyKaTeXLoaded();

  try {
    // 1. Initialize Simulator 18.1 (EM Wave Vector Fields)
    const canvasEMWave = document.getElementById('canvas-em-wave');
    let emWaveSim = null;
    if (canvasEMWave) {
      emWaveSim = new EMWaveSimulator(canvasEMWave);
      ControlPanelAdapter.bindEMWaveControls(emWaveSim);
    }

    // 2. Initialize Simulator 18.2 (7 Spectrum Bands)
    const canvasSpectrum = document.getElementById('canvas-spectrum');
    let spectrumSim = null;
    if (canvasSpectrum) {
      spectrumSim = new SpectrumSimulator(canvasSpectrum);
      ControlPanelAdapter.bindSpectrumControls(spectrumSim);
    }

    // 3. Initialize Simulator 18.3 (Polarization & Malus's Law)
    const canvasPolarization = document.getElementById('canvas-polarization');
    let polarizationSim = null;
    if (canvasPolarization) {
      polarizationSim = new PolarizationSimulator(canvasPolarization);
      ControlPanelAdapter.bindPolarizationControls(polarizationSim);
    }

    // 4. Initialize Practice & Dynamic RNG Quiz System
    const quizUI = new QuizUIAdapter();

    // 5. Initialize Timed Exam System & Anti-Cheat Manager
    const examUI = new ExamUIAdapter();

    // 6. Initialize Section & Tab Navigation Adapter
    TabNavigatorAdapter.init({
      emWaveSim,
      spectrumSim,
      polarizationSim
    });

    // 7. Render All Mathematical Notation across Document
    renderAllMathFormulas();

    console.log('[Physics Portal] All modules and simulators initialized successfully with U-17 UI architecture.');
  } catch (err) {
    console.error('[Physics Portal Error] Failed to initialize portal modules:', err);
  }
});

/**
 * Render dynamic KaTeX mathematical notation into UI elements
 */
function renderAllMathFormulas() {
  const tryRender = () => {
    if (typeof window.katex !== 'undefined') {
      KaTeXAdapter.renderAllMath(document.body);
    } else {
      setTimeout(tryRender, 150);
    }
  };
  setTimeout(tryRender, 100);
}

/**
 * Verify Local Offline KaTeX is loaded
 */
function verifyKaTeXLoaded() {
  if (typeof window.katex !== 'undefined') {
    console.log('[KaTeX Adapter] Local KaTeX engine loaded successfully for offline formula rendering.');
  } else {
    console.warn('[KaTeX Adapter] KaTeX not found in global window context. Retrying...');
  }
}

/**
 * Global Error Boundary
 */
function setupErrorBoundary() {
  window.addEventListener('error', (evt) => {
    console.error('[Global Error Boundary]', evt.message, evt.filename, evt.lineno);
  });

  window.addEventListener('unhandledrejection', (evt) => {
    console.error('[Unhandled Rejection Boundary]', evt.reason);
  });
}
