/**
 * @file exam-manager.js
 * @description Application Service Orchestrator for Timed Exam System (15 Minutes / 5 Questions / 10 Marks).
 * Manages exam state machine: IDLE -> STARTED -> IN_PROGRESS -> SUBMITTED -> REVIEW.
 */

import { APP_CONFIG } from '../shared/config.js';
import { validateRollNumber, validateNumericAnswer } from '../utils/validation.js';
import { getSeededInt, getSeededChoice } from '../utils/random.js';
import { calculateWavelength, calculateFrequency } from '../physics/em-wave-engine.js';
import { calculatePhotonEnergy, getSpectrumInfo } from '../physics/spectrum-solver.js';
import { calculateMalusIntensity } from '../physics/polarization-solver.js';
import { formatScientific } from '../utils/format.js';
import { LocalStorageAdapter } from '../adapters/storage/local-storage.js';

export const EXAM_STATES = Object.freeze({
  IDLE: 'IDLE',
  STARTED: 'STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  REVIEW: 'REVIEW'
});

export class ExamManager {
  /**
   * @param {number} [rollNumber=1]
   */
  constructor(rollNumber = 1) {
    this.rollNumber = validateRollNumber(rollNumber);
    this.state = EXAM_STATES.IDLE;

    this.durationSeconds = APP_CONFIG.examDurationSeconds; // 900 seconds (15 mins)
    this.timeRemaining = this.durationSeconds;
    this.timerInterval = null;
    this.startTime = null;
    this.endTime = null;

    this.questions = [];
    this.userAnswers = {};
    this.examResult = null;

    this.onTickCallback = null;
    this.onStateChangeCallback = null;
  }

  /**
   * Set student roll number
   * @param {number} newR
   */
  setRollNumber(newR) {
    this.rollNumber = validateRollNumber(newR);
  }

  /**
   * Start new 15-minute exam session
   */
  startExam() {
    this.state = EXAM_STATES.IN_PROGRESS;
    this.timeRemaining = this.durationSeconds;
    this.startTime = Date.now();
    this.userAnswers = {};
    this.examResult = null;

    // Generate 5 exam questions (1 Choice + 4 Numeric)
    this.questions = this._generateExamQuestions();

    // Start 1-second countdown timer
    this._startTimer();

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.state);
    }

    return this.questions;
  }

  /**
   * Countdown timer tick
   */
  _startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.onTickCallback) {
        this.onTickCallback(this.timeRemaining, this.formatTimerString());
      }

      // Auto-submit when time expires
      if (this.timeRemaining <= 0) {
        this.submitExam(true);
      }
    }, 1000);
  }

  /**
   * Stop timer
   */
  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Format remaining time into MM:SS string
   */
  formatTimerString() {
    const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
    const secs = Math.max(0, this.timeRemaining) % 60;
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  /**
   * Record answer for a question
   * @param {number} questionIndex - 0..4
   * @param {any} answer
   */
  recordAnswer(questionIndex, answer) {
    if (this.state !== EXAM_STATES.IN_PROGRESS) return;
    this.userAnswers[questionIndex] = answer;
  }

  /**
   * Submit exam and compute final score out of 10
   * @param {boolean} [isAutoSubmit=false]
   */
  submitExam(isAutoSubmit = false) {
    if (this.state === EXAM_STATES.SUBMITTED || this.state === EXAM_STATES.REVIEW) {
      return this.examResult;
    }

    this._stopTimer();
    this.endTime = Date.now();
    this.state = EXAM_STATES.SUBMITTED;

    const timeTakenSeconds = Math.round((this.endTime - this.startTime) / 1000);

    // Grade each question (2 points per question, 5 questions = 10 points)
    let totalScore = 0;
    const gradedQuestions = this.questions.map((q, idx) => {
      const uAns = this.userAnswers[idx];
      let isCorrect = false;
      let score = 0;

      if (q.type === 'choice') {
        isCorrect = String(uAns) === String(q.correctChoiceIndex);
        score = isCorrect ? 2 : 0;
      } else {
        const evalResult = validateNumericAnswer(uAns, q.correctAnswer, 0.03);
        isCorrect = evalResult.isCorrect;
        score = isCorrect ? 2 : 0;
      }

      totalScore += score;

      return {
        ...q,
        userAnswer: uAns !== undefined ? uAns : 'ไม่ได้ตอบ',
        isCorrect: isCorrect,
        scoreObtained: score
      };
    });

    this.examResult = {
      rollNumber: this.rollNumber,
      totalScore: totalScore,
      maxScore: APP_CONFIG.examMaxScore, // 10
      percentage: (totalScore / APP_CONFIG.examMaxScore) * 100,
      timeTakenSeconds: timeTakenSeconds,
      formattedTimeTaken: `${Math.floor(timeTakenSeconds / 60)} นาที ${timeTakenSeconds % 60} วินาที`,
      isAutoSubmit: isAutoSubmit,
      gradedQuestions: gradedQuestions
    };

    // Save to LocalStorage
    LocalStorageAdapter.saveExamResult(this.examResult);

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.state, this.examResult);
    }

    return this.examResult;
  }

  /**
   * Generate 5 mixed exam questions (1 Choice + 4 Numeric)
   */
  _generateExamQuestions() {
    const R = this.rollNumber;

    // Q1: Theory Multiple Choice (2 Points)
    const q1 = {
      id: 'exam_q1',
      type: 'choice',
      topic: '18.1 ทฤษฎีคลื่นแม่เหล็กไฟฟ้า',
      title: 'ข้อ 1: ข้อใดต่อไปนี้เป็นสมบัติที่ไม่ถูกต้องของคลื่นแม่เหล็กไฟฟ้า',
      problemText: 'ข้อใดต่อไปนี้กล่าวถึงสมบัติของคลื่นแม่เหล็กไฟฟ้า **ไม่ถูกต้อง**',
      choices: [
        'เป็นคลื่นตามขวางที่สนามไฟฟ้าและสนามแม่เหล็กตั้งฉากกันและตั้งฉากกับทิศการแผ่',
        'สามารถเคลื่อนที่ผ่านสุญญากาศได้ด้วยอัตราเร็วเท่ากับอัตราเร็วแสง c',
        'จำเป็นต้องอาศัยตัวกลางที่มีมวลในการส่งผ่านพลังงาน',
        'เวกเตอร์สนามไฟฟ้า E และสนามแม่เหล็ก B มีเฟสตรงกันทุกตำแหน่ง'
      ],
      correctChoiceIndex: 2, // Choice 3 is incorrect statement (EM waves don't need medium)
      solutionSteps: [
        '**คำอธิบาย**: คลื่นแม่เหล็กไฟฟ้าเป็นคลื่นไม่อาศัยตัวกลาง สามารถเคลื่อนที่ผ่านสุญญากาศได้ การกล่าวว่า "จำเป็นต้องอาศัยตัวกลาง" จึงเป็นข้อความที่ไม่ถูกต้อง'
      ]
    };

    // Q2: Topic 18.1 Numeric (Wavelength c = fλ)
    const freqMHz = 90 + (R * 2);
    const freqHz = freqMHz * 1e6;
    const lambda2 = calculateWavelength(freqHz);
    const q2 = {
      id: 'exam_q2',
      type: 'numeric',
      topic: '18.1 การคำนวณอัตราเร็วและความยาวคลื่น',
      title: 'ข้อ 2: คำนวณความยาวคลื่นวิทยุ',
      problemText: `เสาส่งสัญญาณวิทยุส่งคลื่นความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) ในสุญญากาศ (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) จงหาความยาวคลื่น (\\(\\lambda\\)) ในหน่วยเมตร (m)`,
      unit: 'm',
      correctAnswer: Math.round(lambda2 * 100) / 100,
      solutionSteps: [
        `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda2.toFixed(2)} \\text{ m}\\)`
      ]
    };

    // Q3: Topic 18.2 Numeric (Photon Energy E = hf)
    const freqFactor = 5.0 + (R * 0.05);
    const freqHz3 = freqFactor * 1e14;
    const energyObj = calculatePhotonEnergy(freqHz3);
    const q3 = {
      id: 'exam_q3',
      type: 'numeric',
      topic: '18.2 พลังงานโฟตอนสเปกตรัม',
      title: 'ข้อ 3: พลังงานโฟตอนในย่านแสง',
      problemText: `โฟตอนของแสงมีความถี่ \\(f = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) จงหาพลังงานโฟตอนในหน่วยอิเล็กตรอนโวลต์ (eV) กำหนดให้ \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
      unit: 'eV',
      correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
      solutionSteps: [
        `\\(E = hf = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatScientific(energyObj.joules)} \\text{ J}\\)`,
        `\\(E_{\\text{eV}} = \\frac{${formatScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(2)} \\text{ eV}\\)`
      ]
    };

    // Q4: Topic 18.3 Numeric (Malus Law I = I0 cos^2 θ)
    const angleDeg = Math.round((20 + (R * 1.5)) % 60) + 15;
    const I1 = 50; // Unpolarized through P1 -> 50%
    const I2 = calculateMalusIntensity(I1, angleDeg);
    const q4 = {
      id: 'exam_q4',
      type: 'numeric',
      topic: '18.3 กฎของมาลุสและความเข้มแสง',
      title: 'ข้อ 4: ความเข้มแสงผ่านแผ่นโพลารอยด์',
      problemText: `แสงไม่โพลาไรส์ความเข้มเริ่มต้น \\(I_0 = 100\\%\\) ผ่านแผ่น Polarizer P1 และ Analyzer P2 ทำมุม \\(\\theta = ${angleDeg}^\\circ\\) จงหาร้อยละของความเข้มแสงที่ส่องผ่านออกหลังจากแผ่น P2 (\\(I_2\\))`,
      unit: '%',
      correctAnswer: Math.round(I2 * 100) / 100,
      solutionSteps: [
        `\\(I_1 = \\frac{I_0}{2} = 50\\%\\)`,
        `\\(I_2 = I_1 \\cos^2(${angleDeg}^\\circ) = 50 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)}\\%\\)`
      ]
    };

    // Q5: Topic 18.1 Monopole Antenna Length
    const lambda5 = calculateWavelength((90 + R * 2) * 1e6);
    const antennaLen = lambda5 / 4; // Quarter-wave monopole
    const q5 = {
      id: 'exam_q5',
      type: 'numeric',
      topic: '18.1 สายอากาศควอเตอร์เวฟ',
      title: 'ข้อ 5: สายอากาศรับสัญญาณ 1/4 ความยาวคลื่น',
      problemText: `สายอากาศแบบโมโนโพล (Quarter-wave Monopole) มีความยาวเท่ากับ \\(1/4\\) ของความยาวคลื่น (\\(L = \\lambda/4\\)) สำหรับรับคลื่นความถี่ที่มีความยาวคลื่น \\(\\lambda = ${lambda5.toFixed(2)} \\text{ m}\\) จงหาความยาวของสายอากาศนี้ในหน่วยเมตร (m)`,
      unit: 'm',
      correctAnswer: Math.round(antennaLen * 100) / 100,
      solutionSteps: [
        `\\(L = \\frac{\\lambda}{4} = \\frac{${lambda5.toFixed(2)}}{4} = ${antennaLen.toFixed(2)} \\text{ m}\\)`
      ]
    };

    return [q1, q2, q3, q4, q5];
  }
}
