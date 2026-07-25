/**
 * @file config.js
 * @description Application configuration settings, quiz limits, and UI presets for Unit 18 portal.
 */

export const APP_CONFIG = Object.freeze({
  appName: 'Interactive Physics Portal: Unit 18 คลื่นแม่เหล็กไฟฟ้า',
  version: '1.0.0',
  author: 'Nopphorn Somboonchai',
  
  // Roll Number RNG Limits
  minRollNumber: 1,
  maxRollNumber: 40,
  defaultRollNumber: 1,

  // Exam Configuration
  examDurationMinutes: 15,
  examDurationSeconds: 15 * 60,
  examQuestionCount: 5,
  examMaxScore: 10,
  numericAnswerTolerance: 0.03, // 3% numerical error tolerance for grading

  // Canvas & Simulation Engine Specs
  canvas: {
    targetFPS: 60,
    aspectRatio: 16 / 9,
    defaultWidth: 800,
    defaultHeight: 450,
  },

  // Simulator 18.1 Defaults
  emWaveDefaults: {
    frequency: 100e6, // 100 MHz (FM Radio)
    amplitude: 80,    // Canvas pixels
    propagationSpeed: 2, // Visual speed multiplier
  },

  // Simulator 18.2 Defaults
  spectrumDefaults: {
    initialFrequency: 5e14, // 500 THz (Green light)
  },

  // Simulator 18.3 Defaults
  polarizationDefaults: {
    initialIntensity: 100, // I0 = 100%
    polarizerAngle: 0,     // 0 degrees (Vertical)
    analyzerAngle: 45,     // 45 degrees
  },

  // LocalStorage Keys
  storageKeys: {
    examResult: 'unit18_exam_result',
    userRollNumber: 'unit18_user_roll_number',
    themePreference: 'unit18_theme',
  }
});
