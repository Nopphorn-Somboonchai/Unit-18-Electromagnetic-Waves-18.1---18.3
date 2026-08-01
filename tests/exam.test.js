/**
 * @file exam.test.js
 * @description Automated Unit Verification Script for Phase 5 Timed Exam System & Storage Adapter.
 */

import { ExamManager, EXAM_STATES } from '../src/application/exam-manager.js';
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

console.log('=============== 🧪 RUNNING PHASE 5 EXAM ENGINE TESTS ===============\n');

// Mock localStorage for Node environment if absent
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
  };
}

// --- 1. Exam State Machine Tests ---
console.log('--- Test Suite 1: Exam State Machine & Timer Setup ---');
const em = new ExamManager(1);
assert(em.state === EXAM_STATES.IDLE, 'Initial state is IDLE');

const questions = em.startExam();
assert(em.state === EXAM_STATES.IN_PROGRESS, 'State transitions to IN_PROGRESS on startExam()');
assert(questions.length === 5, 'Exam paper contains 5 questions');
assert(em.formatTimerString() === '15:00', 'Timer string initialized to 15:00');

// --- 2. Answer Recording & Grading Tests ---
console.log('\n--- Test Suite 2: Answer Recording & Scoring (10 Marks Total) ---');
// Q1 is Choice question (dynamic correctChoiceIndex)
em.recordAnswer(0, questions[0].correctChoiceIndex);

// Record correct answers for Q2..Q5
for (let i = 1; i < 5; i++) {
  em.recordAnswer(i, questions[i].correctAnswer);
}

const result = em.submitExam(false);
assert(em.state === EXAM_STATES.SUBMITTED, 'State transitions to SUBMITTED after submission');
assert(result.totalScore === 10, 'Perfect score is 10/10');
assert(result.percentage === 100, 'Percentage is 100%');
assert(result.gradedQuestions.every(q => q.isCorrect), 'All 5 questions graded correct');

// --- 4. Non-Deterministic Dynamic System (R + B) Tests ---
console.log('\n--- Test Suite 4: Non-Deterministic Dynamic Systems (R + B) ---');
const em1 = new ExamManager(1);
const questionsAttempt1 = em1.startExam(1001);

const em2 = new ExamManager(1);
const questionsAttempt2 = em2.startExam(9999);

assert(questionsAttempt1[1].correctAnswer !== questionsAttempt2[1].correctAnswer,
  'Different exam attempts for same Roll Number produce different randomized questions (R + B)');

// Test Attempt-Scoped Determinism: regenerate attempt with same seed 1001
const em1Repeat = new ExamManager(1);
const questionsAttempt1Repeat = em1Repeat.startExam(1001);
assert(questionsAttempt1[1].correctAnswer === questionsAttempt1Repeat[1].correctAnswer,
  'Same attempt seed reproduces identical questions for attempt-scoped determinism');

const cleared = LocalStorageAdapter.clearExamResult();
assert(cleared === true, 'LocalStorage clear operation succeeded');
assert(LocalStorageAdapter.loadExamResult() === null, 'Exam result cleared from LocalStorage');

console.log(`\n=======================================================`);
console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=======================================================`);

if (failed > 0) {
  process.exit(1);
}
