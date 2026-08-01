/**
 * @file exam-manager.js
 * @description Application Service Orchestrator for Timed Exam System (15 Minutes / 5 Questions / 10 Marks).
 * Manages exam state machine: IDLE -> STARTED -> IN_PROGRESS -> SUBMITTED -> REVIEW.
 */

import { APP_CONFIG } from '../shared/config.js';
import { validateRollNumber, validateNumericAnswer } from '../utils/validation.js';
import { getSeededInt, getSeededChoice, getDynamicParam } from '../utils/random.js';
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
    this.attemptSeed = 0;

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
   * @param {number} [customSeed=null] - Optional attempt seed for testing/reproducibility
   */
  startExam(customSeed = null) {
    this.state = EXAM_STATES.IN_PROGRESS;
    this.timeRemaining = this.durationSeconds;
    this.startTime = Date.now();
    this.userAnswers = {};
    this.examResult = null;
    this.attemptSeed = customSeed !== null ? customSeed : ((Date.now() ^ Math.floor(Math.random() * 100000)) >>> 0);

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
      attemptSeed: this.attemptSeed,
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
   * Non-deterministic parameters combining Roll Number R and Attempt Seed B
   */
  _generateExamQuestions() {
    const R = this.rollNumber;
    const B = this.attemptSeed;

    // Q1: Theory Multiple Choice (2 Points)
    const theoryPool = [
      {
        problemText: 'ข้อใดต่อไปนี้กล่าวถึงสมบัติของคลื่นแม่เหล็กไฟฟ้า **ไม่ถูกต้อง**',
        choices: [
          'เป็นคลื่นตามขวางที่สนามไฟฟ้าและสนามแม่เหล็กตั้งฉากกันและตั้งฉากกับทิศการแผ่',
          'สามารถเคลื่อนที่ผ่านสุญญากาศได้ด้วยอัตราเร็วเท่ากับอัตราเร็วแสง c',
          'จำเป็นต้องอาศัยตัวกลางที่มีมวลในการส่งผ่านพลังงาน',
          'เวกเตอร์สนามไฟฟ้า E และสนามแม่เหล็ก B มีเฟสตรงกันทุกตำแหน่ง'
        ],
        correctChoiceIndex: 2,
        explanation: 'คลื่นแม่เหล็กไฟฟ้าเป็นคลื่นไม่อาศัยตัวกลาง สามารถเคลื่อนที่ผ่านสุญญากาศได้ การกล่าวว่า "จำเป็นต้องอาศัยตัวกลาง" จึงไม่ถูกต้อง'
      },
      {
        problemText: 'ข้อใดเรียงลำดับคลื่นแม่เหล็กไฟฟ้าจาก **ความยาวคลื่นมากไปน้อย** ได้ถูกต้อง',
        choices: [
          'รังสีแกมมา → รังสีเอ็กซ์ → แสงขาว → คลื่นวิทยุ',
          'คลื่นวิทยุ → ไมโครเวฟ → อินฟราเรด → รังสีอัลตราไวโอเลต',
          'อินฟราเรด → คลื่นวิทยุ → ไมโครเวฟ → รังสีเอ็กซ์',
          'รังสีอัลตราไวโอเลต → แสงขาว → อินฟราเรด → คลื่นวิทยุ'
        ],
        correctChoiceIndex: 1,
        explanation: 'คลื่นวิทยุมีความยาวคลื่นมากที่สุด ถัดมาเป็นไมโครเวฟ อินฟราเรด และอัลตราไวโอเลตตามลำดับ'
      },
      {
        problemText: 'ข้อใดเรียงลำดับคลื่นแม่เหล็กไฟฟ้าจาก **ความยาวคลื่นน้อยไปมาก** ได้ถูกต้อง',
        choices: [
          'คลื่นวิทยุ → ไมโครเวฟ → อินฟราเรด → รังสีอัลตราไวโอเลต',
          'รังสีแกมมา → รังสีเอ็กซ์ → รังสีอัลตราไวโอเลต → อินฟราเรด',
          'อินฟราเรด → แสงขาว → รังสีเอ็กซ์ → รังสีแกมมา',
          'ไมโครเวฟ → อินฟราเรด → คลื่นวิทยุ → รังสีเอ็กซ์'
        ],
        correctChoiceIndex: 1,
        explanation: 'เรียงลำดับจากความยาวคลื่นน้อยไปมาก (ความถี่สูงไปต่ำ) ได้แก่: รังสีแกมมา → รังสีเอ็กซ์ → รังสีอัลตราไวโอเลต → อินฟราเรด → คลื่นไมโครเวฟ → คลื่นวิทยุ'
      }
    ];

    const selectedTheory = getSeededChoice(R, 1, theoryPool, B);
    const q1 = {
      id: 'exam_q1',
      type: 'choice',
      topic: '18.1 ทฤษฎีคลื่นแม่เหล็กไฟฟ้า',
      title: 'ข้อ 1: ทฤษฎีคลื่นแม่เหล็กไฟฟ้า',
      problemText: selectedTheory.problemText,
      choices: selectedTheory.choices,
      correctChoiceIndex: selectedTheory.correctChoiceIndex,
      solutionSteps: [`**คำอธิบาย**: ${selectedTheory.explanation}`]
    };

    // =========================================================================
    // Q2: Topic 18.1 Numeric Pool (3 Variations)
    // =========================================================================
    const pool181 = [
      // Variation 1: Find Wavelength λ from Frequency f
      () => {
        const freqMHz = getDynamicParam(R, 80, 1.5, 15, { min: 50, max: 400, decimals: 1 }, B);
        const freqHz = freqMHz * 1e6;
        const lambda = calculateWavelength(freqHz);
        return {
          id: 'exam_q2',
          type: 'numeric',
          topic: '18.1 การคำนวณอัตราเร็วและความยาวคลื่น',
          title: 'ข้อ 2: คำนวณความยาวคลื่นวิทยุ',
          problemText: `เสาส่งสัญญาณวิทยุส่งคลื่นความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) ในสุญญากาศ (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) จงหาความยาวคลื่น (\\(\\lambda\\)) ในหน่วยเมตร (m)`,
          unit: 'm',
          correctAnswer: Math.round(lambda * 100) / 100,
          solutionSteps: [
            `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`
          ]
        };
      },
      // Variation 2: Find Frequency f from Wavelength λ
      () => {
        const lambdaM = getDynamicParam(R, 1.2, 0.05, 0.8, { min: 0.5, max: 6.0, decimals: 2 }, B);
        const freqHz = calculateFrequency(lambdaM);
        const freqMHz = freqHz / 1e6;
        return {
          id: 'exam_q2',
          type: 'numeric',
          topic: '18.1 การคำนวณอัตราเร็วและความยาวคลื่น',
          title: 'ข้อ 2: คำนวณความถี่จากความยาวคลื่น',
          problemText: `คลื่นแม่เหล็กไฟฟ้ามีความยาวคลื่น \\(\\lambda = ${lambdaM.toFixed(2)} \\text{ m}\\) เคลื่อนที่ในสุญญากาศ (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) จงคำนวณความถี่ของคลื่นนี้ในหน่วยเมกะเฮิรตซ์ (MHz)`,
          unit: 'MHz',
          correctAnswer: Math.round(freqMHz * 100) / 100,
          solutionSteps: [
            `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${lambdaM.toFixed(2)}} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
            `แปลงหน่วยเป็น MHz: \\(f_{\\text{MHz}} = \\frac{${formatScientific(freqHz)}}{10^6} = ${freqMHz.toFixed(2)} \\text{ MHz}\\)`
          ]
        };
      },
      // Variation 3: Half-wave Dipole Antenna Length
      () => {
        const freqMHz = getDynamicParam(R, 90, 2.0, 20, { min: 80, max: 500, decimals: 1 }, B);
        const freqHz = freqMHz * 1e6;
        const lambda = calculateWavelength(freqHz);
        const antennaL = lambda / 2;
        return {
          id: 'exam_q2',
          type: 'numeric',
          topic: '18.1 สายอากาศครึ่งคลื่น',
          title: 'ข้อ 2: คำนวณความยาวสายอากาศไดโพล',
          problemText: `สายอากาศแบบไดโพลครึ่งคลื่น (Half-wave Dipole) มีความยาวเท่ากับ \\(L = \\lambda/2\\) สำหรับรับคลื่นความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) ในสุญญากาศ จงหาความยาวของสายอากาศนี้ในหน่วยเมตร (m)`,
          unit: 'm',
          correctAnswer: Math.round(antennaL * 100) / 100,
          solutionSteps: [
            `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`,
            `\\(L = \\frac{\\lambda}{2} = \\frac{${lambda.toFixed(2)}}{2} = ${antennaL.toFixed(2)} \\text{ m}\\)`
          ]
        };
      }
    ];

    const q2Generator = getSeededChoice(R, 2, pool181, B);
    const q2 = q2Generator();

    // =========================================================================
    // Q3: Topic 18.2 Numeric Pool (3 Variations)
    // =========================================================================
    const pool182 = [
      // Variation 1: Photon Energy E (eV) from Frequency f
      () => {
        const freqFactor = getDynamicParam(R, 4.0, 0.05, 1.5, { min: 2.0, max: 9.0, decimals: 2 }, B + 1);
        const freqHz3 = freqFactor * 1e14;
        const energyObj = calculatePhotonEnergy(freqHz3);
        return {
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
      },
      // Variation 2: Frequency f from Photon Energy E (eV)
      () => {
        const energyEV = getDynamicParam(R, 1.8, 0.05, 0.8, { min: 1.5, max: 4.5, decimals: 2 }, B + 1);
        const energyJ = energyEV * 1.602e-19;
        const freqHz = energyJ / 6.626e-34;
        const freqFactor = freqHz / 1e14;
        return {
          id: 'exam_q3',
          type: 'numeric',
          topic: '18.2 พลังงานโฟตอนสเปกตรัม',
          title: 'ข้อ 3: คำนวณความถี่จากพลังงานโฟตอน',
          problemText: `อนุภาคโฟตอนมีพลังงาน \\(E = ${energyEV.toFixed(2)} \\text{ eV}\\) จงคำนวณความถี่ของคลื่นนี้ในหน่วย \\(\\times 10^{14} \\text{ Hz}\\) (ตอบเฉพาะตัวเลขสัมพัทธ์หน้า \\(10^{14}\\)) กำหนดให้ \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: 'x10^14 Hz',
          correctAnswer: Math.round(freqFactor * 100) / 100,
          solutionSteps: [
            `\\(E_{\\text{J}} = ${energyEV.toFixed(2)} \\times 1.602 \\times 10^{-19} = ${formatScientific(energyJ)} \\text{ J}\\)`,
            `\\(f = \\frac{E}{h} = \\frac{${formatScientific(energyJ)}}{6.626 \\times 10^{-34}} = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`
          ]
        };
      },
      // Variation 3: Photon Energy E (eV) from Wavelength λ (nm)
      () => {
        const lambdaNm = getDynamicParam(R, 420, 5.0, 60, { min: 400, max: 700, decimals: 0 }, B + 1);
        const lambdaM = lambdaNm * 1e-9;
        const freqHz = 3.00e8 / lambdaM;
        const energyObj = calculatePhotonEnergy(freqHz);
        return {
          id: 'exam_q3',
          type: 'numeric',
          topic: '18.2 พลังงานโฟตอนสเปกตรัม',
          title: 'ข้อ 3: พลังงานโฟตอนจากความยาวคลื่น',
          problemText: `คลื่นแสงมีความยาวคลื่น \\(\\lambda = ${Math.round(lambdaNm)} \\text{ nm}\\) ในสุญญากาศ จงคำนวณพลังงานของโฟตอนในหน่วยอิเล็กตรอนโวลต์ (eV) กำหนดให้ \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
          unit: 'eV',
          correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
          solutionSteps: [
            `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${Math.round(lambdaNm)} \\times 10^{-9}} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
            `\\(E_{\\text{eV}} = \\frac{hf}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(2)} \\text{ eV}\\)`
          ]
        };
      }
    ];

    const q3Generator = getSeededChoice(R, 3, pool182, B + 1);
    const q3 = q3Generator();

    // =========================================================================
    // Q4: Topic 18.3 Numeric Pool (3 Variations)
    // =========================================================================
    const pool183 = [
      // Variation 1: Unpolarized light through P1 and P2 (% Transmitted)
      () => {
        const standardAngles = [0, 30, 45, 60, 90];
        const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
        const I1 = 50;
        const I2 = calculateMalusIntensity(I1, angleDeg);
        return {
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
      },
      // Variation 2: Linearly Polarized light through P2 (Intensity in W/m^2)
      () => {
        const standardAngles = [0, 30, 45, 60, 90];
        const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
        const I1 = 100; // 100 W/m^2 after P1
        const I2 = calculateMalusIntensity(I1, angleDeg);
        return {
          id: 'exam_q4',
          type: 'numeric',
          topic: '18.3 กฎของมาลุสและความเข้มแสง',
          title: 'ข้อ 4: ความเข้มแสงโพลาไรส์ผ่าน Analyzer',
          problemText: `แสงโพลาไรส์เชิงเส้นมีความเข้ม \\(I_1 = 100 \\text{ W/m}^2\\) ตกกระทบแผ่นแอนาไลเซอร์ P2 ซึ่งทำมุม \\(\\theta = ${angleDeg}^\\circ\\) กับแนวโพลาไรซ์ จงหาความเข้มแสงที่ทะลุผ่าน P2 (\\(I_2\\)) ในหน่วย \\(\\text{W/m}^2\\)`,
          unit: 'W/m^2',
          correctAnswer: Math.round(I2 * 100) / 100,
          solutionSteps: [
            `\\(I_2 = I_1 \\cos^2\\theta = 100 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)} \\text{ W/m}^2\\)`
          ]
        };
      },
      // Variation 3: Initial Polarized Light I0 = 80% through P1 and P2
      () => {
        const standardAngles = [0, 30, 45, 60, 90];
        const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
        const I0 = 80;
        const I1 = I0 / 2; // 40%
        const I2 = calculateMalusIntensity(I1, angleDeg);
        return {
          id: 'exam_q4',
          type: 'numeric',
          topic: '18.3 กฎของมาลุสและความเข้มแสง',
          title: 'ข้อ 4: ความเข้มแสงเริ่มต้น 80% ผ่านแผ่นโพลารอยด์',
          problemText: `ลำแสงไม่โพลาไรส์มีความเข้มเริ่มต้น \\(I_0 = 80\\%\\) ผ่านแผ่นโพลารอยด์ P1 และ P2 ทำมุม \\(\\theta = ${angleDeg}^\\circ\\) จงคำนวณร้อยละของความเข้มแสงที่ส่องผ่านแผ่น P2 (\\(I_2\\))`,
          unit: '%',
          correctAnswer: Math.round(I2 * 100) / 100,
          solutionSteps: [
            `\\(I_1 = \\frac{I_0}{2} = \\frac{80}{2} = 40\\%\\)`,
            `\\(I_2 = I_1 \\cos^2(${angleDeg}^\\circ) = 40 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)}\\%\\)`
          ]
        };
      }
    ];

    const q4Generator = getSeededChoice(R, 4, pool183, B + 2);
    const q4 = q4Generator();

    // =========================================================================
    // Q5: Topic 18.1 Monopole Antenna Length (Quarter-wave)
    // =========================================================================
    const freq5MHz = getDynamicParam(R, 85, 1.5, 15, { min: 50, max: 400, decimals: 1 }, B + 3);
    const freq5Hz = freq5MHz * 1e6;
    const lambda5 = calculateWavelength(freq5Hz);
    const antennaLen = lambda5 / 4; // Quarter-wave monopole
    const q5 = {
      id: 'exam_q5',
      type: 'numeric',
      topic: '18.1 สายอากาศควอเตอร์เวฟ',
      title: 'ข้อ 5: สายอากาศรับสัญญาณ 1/4 ความยาวคลื่น',
      problemText: `สายอากาศแบบโมโนโพล (Quarter-wave Monopole) มีความยาวเท่ากับ \\(1/4\\) ของความยาวคลื่น (\\(L = \\lambda/4\\)) สำหรับรับคลื่นความถี่ \\(f = ${freq5MHz.toFixed(1)} \\text{ MHz}\\) ในสุญญากาศ (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) จงหาความยาวของสายอากาศนี้ในหน่วยเมตร (m)`,
      unit: 'm',
      correctAnswer: Math.round(antennaLen * 100) / 100,
      solutionSteps: [
        `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freq5Hz)}} = ${lambda5.toFixed(2)} \\text{ m}\\)`,
        `\\(L = \\frac{\\lambda}{4} = \\frac{${lambda5.toFixed(2)}}{4} = ${antennaLen.toFixed(2)} \\text{ m}\\)`
      ]
    };

    return [q1, q2, q3, q4, q5];
  }
}
