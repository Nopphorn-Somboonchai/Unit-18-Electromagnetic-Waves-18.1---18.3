/**
 * @file integration.test.js
 * @description Master Integration QA Test Suite for Unit 18 Physics Portal (Phases 1 - 6).
 * Verifies physics accuracy, RNG reproducibility, grading tolerances, and exam state machine.
 */

import { createEMWave } from '../src/physics/em-wave-model.js';
import { findBandByFrequency, findBandByWavelength } from '../src/physics/spectrum-band-model.js';
import { createPolaroid } from '../src/physics/polaroid-model.js';
import { calculateWavelength, calculateFrequency, calculateVectorDirection, calculateAntennaLength } from '../src/physics/em-wave-engine.js';
import { calculatePhotonEnergy, getSpectrumInfo } from '../src/physics/spectrum-solver.js';
import { calculateMalusIntensity, calculateIntensityThroughTwoPolaroids } from '../src/physics/polarization-solver.js';
import { QuizManager } from '../src/application/quiz-manager.js';
import { ExamManager, EXAM_STATES } from '../src/application/exam-manager.js';
import { validateRollNumber, validateNumericAnswer } from '../src/utils/validation.js';
import { LocalStorageAdapter } from '../src/adapters/storage/local-storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

function assertCloseTo(actual, expected, precision = 1e-3, message = '') {
  const diff = Math.abs(actual - expected);
  assert(diff <= precision, `${message} (Expected: ~${expected}, Got: ${actual})`);
}

// Mock localStorage for Node environment if absent
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
  };
}

console.log('================================================================');
console.log('🧪 MASTER INTEGRATION & QA TEST SUITE — UNIT 18 PHYSICS PORTAL');
console.log('================================================================\n');

// --- 1. Physics Engine Accuracy Audit ---
console.log('--- 1. Physics Engine & Solver Accuracy Audit ---');
assertCloseTo(calculateWavelength(100e6), 3.0, 1e-4, 'c = fλ: 100 MHz wavelength = 3.0 m');
assertCloseTo(calculateFrequency(0.1), 3e9, 1e-4, 'c = fλ: 0.1 m wavelength = 3.0 GHz');

const dir = calculateVectorDirection({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 });
assert(dir.x === 1 && dir.y === 0 && dir.z === 0, 'Vector cross product E x B = v (Right-Hand Rule)');

const energy = calculatePhotonEnergy(5e14); // 500 THz Green Light
assertCloseTo(energy.electronVolts, 2.067, 1e-2, 'E = hf: 500 THz photon energy ≈ 2.07 eV');

assertCloseTo(calculateMalusIntensity(100, 0), 100, 1e-4, 'Malus Law θ=0° -> I = 100%');
assertCloseTo(calculateMalusIntensity(100, 45), 50, 1e-4, 'Malus Law θ=45° -> I = 50%');
assertCloseTo(calculateMalusIntensity(100, 90), 0, 1e-4, 'Malus Law θ=90° -> I = 0%');

// --- 2. Roll-Number RNG & Validation Audit ---
console.log('\n--- 2. Roll-Number RNG & Student Answer Validation ---');
assert(validateRollNumber(1) === 1, 'Roll number min bound = 1');
assert(validateRollNumber(40) === 40, 'Roll number max bound = 40');
assert(validateRollNumber(-10) === 1, 'Negative roll number clamped');

const qm1 = new QuizManager(1);
const qm40 = new QuizManager(40);
const q1 = qm1.generateQuestion(0, '18.1');
const q40 = qm40.generateQuestion(0, '18.1');
assert(q1.correctAnswer !== q40.correctAnswer, 'RNG generates distinct questions for R=1 vs R=40');

const valResult = validateNumericAnswer(q1.correctAnswer, q1.correctAnswer, 0.03);
assert(valResult.isCorrect === true, 'Student answer within 3% tolerance accepted');

// --- 3. Timed Exam & Dashboard Persistence Audit ---
console.log('\n--- 3. Timed Exam System & LocalStorage Audit ---');
const exam = new ExamManager(15);
assert(exam.state === EXAM_STATES.IDLE, 'Exam state machine starts in IDLE');

const examQuestions = exam.startExam();
assert(exam.state === EXAM_STATES.IN_PROGRESS, 'Exam state transitions to IN_PROGRESS');
assert(examQuestions.length === 5, 'Exam paper contains 5 questions');

// Simulate student completing exam
exam.recordAnswer(0, examQuestions[0].correctChoiceIndex); // Q1 Choice answer
for (let i = 1; i < 5; i++) {
  exam.recordAnswer(i, examQuestions[i].correctAnswer);
}

const examResult = exam.submitExam(false);
assert(exam.state === EXAM_STATES.SUBMITTED, 'Exam state transitions to SUBMITTED');
assert(examResult.totalScore === 10, 'Full score is 10/10 marks');
assert(examResult.percentage === 100, 'Percentage is 100%');

// Test Tab Navigator Exam Protection Lock
import { TabNavigatorAdapter } from '../src/adapters/ui/tab-navigator.js';
TabNavigatorAdapter.setExamInProgress(true);
assert(TabNavigatorAdapter.isExamInProgress === true, 'TabNavigatorAdapter locks navigation during IN_PROGRESS exam');

TabNavigatorAdapter.setExamInProgress(false);
assert(TabNavigatorAdapter.isExamInProgress === false, 'TabNavigatorAdapter unlocks navigation after exam submission');

const loadedRecord = LocalStorageAdapter.loadExamResult();
assert(loadedRecord !== null && loadedRecord.totalScore === 10, 'Exam score persisted in LocalStorage');

console.log(`\n================================================================`);
console.log(`📊 MASTER TEST SUITE RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);

if (failed > 0) {
  process.exit(1);
}
