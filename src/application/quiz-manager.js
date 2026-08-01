/**
 * @file quiz-manager.js
 * @description Dynamic Quiz Orchestrator adhering to Dynamic Quiz System Rules:
 * 1. Dynamic Parameter Generation (Roll Number R ∈ [1, 40] + Non-deterministic random variation)
 * 2. On-the-fly Validation & KaTeX Step-by-Step Solutions
 * 3. Strict Safety Constraints for physical validity.
 */

import { getSeededInt, getSeededChoice, getDynamicParam } from '../utils/random.js';
import { validateRollNumber, validateNumericAnswer } from '../utils/validation.js';
import { calculateWavelength, calculateAntennaLength } from '../physics/em-wave-engine.js';
import { calculatePhotonEnergy, getSpectrumInfo } from '../physics/spectrum-solver.js';
import { calculateMalusIntensity, calculateIntensityAfterPolarizer } from '../physics/polarization-solver.js';
import { formatScientific } from '../utils/format.js';
import { SPEED_OF_LIGHT, PLANCK_CONSTANT } from '../shared/constants.js';

export class QuizManager {
  /**
   * @param {number} [rollNumber=1] - Student roll number R (1..40)
   */
  constructor(rollNumber = 1) {
    this.rollNumber = validateRollNumber(rollNumber);
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.scoreHistory = [];
    this.attemptSeed = 0;
  }

  /**
   * Set student roll number and regenerate active question set
   * @param {number} newRollNumber
   */
  setRollNumber(newRollNumber) {
    this.rollNumber = validateRollNumber(newRollNumber);
    return this.generateQuestion(this.currentQuestionIndex);
  }

  /**
   * Generate question by category (18.1, 18.2, 18.3, or random)
   * @param {number} [questionIndex=0] - Index of question
   * @param {'18.1' | '18.2' | '18.3' | 'mixed'} [category='mixed']
   * @param {number} [customSeed=null] - Optional attempt seed for testing/reproducibility
   */
  generateQuestion(questionIndex = 0, category = 'mixed', customSeed = null) {
    this.currentQuestionIndex = questionIndex;
    this.attemptSeed = customSeed !== null ? customSeed : ((Date.now() ^ Math.floor(Math.random() * 100000)) >>> 0);
    const R = this.rollNumber;
    const B = this.attemptSeed;

    let targetTopic = category;
    if (category === 'mixed') {
      const topics = ['18.1', '18.2', '18.3'];
      targetTopic = getSeededChoice(R, questionIndex, topics, B);
    }

    switch (targetTopic) {
      case '18.1':
        this.currentQuestion = this._generateTopic181Question(R, questionIndex, B);
        break;
      case '18.2':
        this.currentQuestion = this._generateTopic182Question(R, questionIndex, B);
        break;
      case '18.3':
      default:
        this.currentQuestion = this._generateTopic183Question(R, questionIndex, B);
        break;
    }

    return this.currentQuestion;
  }

  /**
   * Topic 18.1: EM Wave speed c = fλ & Dipole Antenna Length
   * Dynamic Parameter Generation with Safety Constraints [50 MHz, 500 MHz]
   */
  _generateTopic181Question(R, qIndex, B) {
    const subType = (R + qIndex + B) % 2 === 0 ? 1 : 2;

    if (subType === 1) {
      // Variety A: Wavelength λ from frequency f (in MHz)
      // Dynamic frequency f = Base(80) + R*2.5 + random variation B
      const freqMHz = getDynamicParam(R, 80, 2.5, 10.0, { min: 50, max: 400, decimals: 1 }, B);
      const freqHz = freqMHz * 1e6;

      // On-the-fly Validation & Solver
      const correctWavelength = calculateWavelength(freqHz);

      return {
        id: `q_18_1_${qIndex}_${B}`,
        topic: '18.1 การเกิดคลื่นแม่เหล็กไฟฟ้า',
        title: `การคำนวณความยาวคลื่นแม่เหล็กไฟฟ้า (เลขที่ #${R})`,
        problemText: `สถานีวิทยุกระจายเสียงส่งสัญญาณด้วยความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) ในอากาศ ถ้าอัตราเร็วของคลื่นแม่เหล็กไฟฟ้าในอากาศเท่ากับ \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) จงหาความยาวคลื่น (\\(\\lambda\\)) ของสัญญาณวิทยุนี้ในหน่วยเมตร (m)`,
        unit: 'm',
        correctAnswer: Math.round(correctWavelength * 100) / 100,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรที่ใช้**: \\(c = f\\lambda \\rightarrow \\lambda = \\frac{c}{f}\\)`,
          `แทนค่าความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
          `แทนค่าอัตราเร็วแสง \\(c = 3.00 \\times 10^8 \\text{ m/s}\\)`,
          `\\(\\lambda = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${correctWavelength.toFixed(3)} \\text{ m}\\)`,
          `**ตอบ**: ความยาวคลื่นเท่ากับ **${correctWavelength.toFixed(2)} m**`
        ]
      };
    } else {
      // Variety B: Half-wave dipole antenna length L = λ / 2
      // Dynamic frequency f = Base(100) + R*3.0 + random variation B
      const freqMHz = getDynamicParam(R, 100, 3.0, 12.0, { min: 80, max: 500, decimals: 1 }, B);
      const freqHz = freqMHz * 1e6;

      // On-the-fly Validation & Solver
      const lambda = calculateWavelength(freqHz);
      const antennaLength = calculateAntennaLength(lambda, 'half-wave');

      return {
        id: `q_18_1_${qIndex}_${B}`,
        topic: '18.1 สายอากาศและคลื่นแม่เหล็กไฟฟ้า',
        title: `ความยาวสายอากาศรับสัญญาณ (เลขที่ #${R})`,
        problemText: `ต้องการออกแบบสายอากาศรับสัญญาณวิทยุแบบไดโพลครึ่งคลื่น (Half-wave Dipole Antenna) สำหรับรับความถี่ \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) จงคำนวณความยาวของสายอากาศ (\\(L = \\lambda/2\\)) ที่เหมาะสมในหน่วยเมตร (m)`,
        unit: 'm',
        correctAnswer: Math.round(antennaLength * 100) / 100,
        tolerance: 0.03,
        solutionSteps: [
          `**สูตรหาความยาวคลื่น**: \\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(3)} \\text{ m}\\)`,
          `**สูตรความยาวสายอากาศครึ่งคลื่น**: \\(L = \\frac{\\lambda}{2}\\)`,
          `\\(L = \\frac{${lambda.toFixed(3)}}{2} = ${antennaLength.toFixed(3)} \\text{ m}\\)`,
          `**ตอบ**: ความยาวสายอากาศเท่ากับ **${antennaLength.toFixed(2)} m**`
        ]
      };
    }
  }

  /**
   * Topic 18.2: Spectrum & Photon Energy E = hf
   * Dynamic Parameter Generation with Safety Constraints [3.5 x 10^14, 8.0 x 10^14 Hz]
   */
  _generateTopic182Question(R, qIndex, B) {
    // Dynamic Frequency factor f = (3.8 + R * 0.08 + random variation B) x 10^14 Hz
    const freqFactor = getDynamicParam(R, 3.8, 0.08, 0.5, { min: 3.5, max: 7.8, decimals: 2 }, B);
    const freqHz = freqFactor * 1e14;

    // On-the-fly Validation & Solvers
    const energyObj = calculatePhotonEnergy(freqHz);
    const spectrumInfo = getSpectrumInfo(freqHz);

    return {
      id: `q_18_2_${qIndex}_${B}`,
      topic: '18.2 สเปกตรัมคลื่นแม่เหล็กไฟฟ้า',
      title: `พลังงานโฟตอนของคลื่นแม่เหล็กไฟฟ้า (เลขที่ #${R})`,
      problemText: `คลื่นแม่เหล็กไฟฟ้าในย่าน${spectrumInfo.band.nameThai} มีความถี่ \\(f = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) จงคำนวณพลังงานของโฟตอน 1 อนุภาค (\\(E = hf\\)) ในหน่วยอิเล็กตรอนโวลต์ (eV) กำหนดให้ \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) และ \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
      unit: 'eV',
      correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
      tolerance: 0.03,
      solutionSteps: [
        `**สูตรพลังงานโฟตอน**: \\(E = hf\\)`,
        `แทนค่าพลังงานในหน่วยจูล: \\(E = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatScientific(energyObj.joules)} \\text{ J}\\)`,
        `แปลงหน่วยเป็น eV: \\(E_{\\text{eV}} = \\frac{${formatScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(3)} \\text{ eV}\\)`,
        `**ตอบ**: พลังงานโฟตอนเท่ากับ **${energyObj.electronVolts.toFixed(2)} eV**`
      ]
    };
  }

  /**
   * Topic 18.3: Polarization & Malus's Law I = I0 * cos^2(θ)
   * Dynamic Parameter Generation restricted to standard angles θ ∈ {0°, 30°, 45°, 60°, 90°}
   */
  _generateTopic183Question(R, qIndex, B) {
    const standardAngles = [0, 30, 45, 60, 90];
    const angleDeg = getSeededChoice(R, qIndex, standardAngles, B);
    const initialIntensityPercent = 100;

    // On-the-fly Validation & Solvers
    const I1 = calculateIntensityAfterPolarizer(initialIntensityPercent); // 50%
    const I2 = calculateMalusIntensity(I1, angleDeg);

    return {
      id: `q_18_3_${qIndex}_${B}`,
      topic: '18.3 โพลาไรเซชันของคลื่นแม่เหล็กไฟฟ้า',
      title: `ความเข้มแสงตามกฎของมาลุส (เลขที่ #${R})`,
      problemText: `ฉายลำแสงไม่โพลาไรส์ความเข้มเริ่มต้น \\(I_0\\) ผ่านแผ่นโพลารอยด์ 2 แผ่น โดยแผ่นแรก (P1) วางในแนวตั้ง และแผ่นที่สอง (P2) หมุนทำมุม \\(\\theta = ${angleDeg}^\\circ\\) กับแผ่นแรก จงคำนวณร้อยละของความเข้มแสงที่ส่องผ่านออกหลังจากแผ่น P2 (\\(I_2\\)) เทียบกับความเข้มเริ่มต้น \\(I_0\\) (ระบุเฉพาะตัวเลขร้อยละ)`,
      unit: '%',
      correctAnswer: Math.round(I2 * 100) / 100,
      tolerance: 0.03,
      solutionSteps: [
        `**ขั้นตอนที่ 1 (แผ่น P1)**: แสงไม่โพลาไรส์เมื่อผ่านแผ่นแรก จะมีความเข้มลดลงเหลือครึ่งหนึ่ง \\(I_1 = \\frac{I_0}{2} = 50\\%\\)`,
        `**ขั้นตอนที่ 2 (แผ่น P2 ตามกฎของมาลุส)**: \\(I_2 = I_1 \\cos^2\\theta\\)`,
        `แทนค่ามุมมาตรฐาน \\(\\theta = ${angleDeg}^\\circ\\) \\(\\rightarrow \\cos(${angleDeg}^\\circ) = ${Math.cos((angleDeg * Math.PI)/180).toFixed(4)}\\)`,
        `\\(I_2 = 50 \\times \\cos^2(${angleDeg}^\\circ) = 50 \\times ${Math.pow(Math.cos((angleDeg * Math.PI)/180), 2).toFixed(4)} = ${I2.toFixed(2)}\\%\\)`,
        `**ตอบ**: ความเข้มแสงที่ส่องผ่านแผ่น P2 คิดเป็น **${I2.toFixed(2)}%** ของความเข้มเริ่มต้น`
      ]
    };
  }

  /**
   * Submit and grade user's answer
   * @param {number|string} userAnswer
   * @returns {Object} Full grading breakdown with step-by-step solution
   */
  evaluateAnswer(userAnswer) {
    if (!this.currentQuestion) {
      throw new Error('[QuizManager] No active question to evaluate');
    }

    const evalResult = validateNumericAnswer(
      userAnswer,
      this.currentQuestion.correctAnswer,
      this.currentQuestion.tolerance
    );

    const record = {
      questionId: this.currentQuestion.id,
      topic: this.currentQuestion.topic,
      rollNumber: this.rollNumber,
      userAnswer: evalResult.userVal,
      correctAnswer: evalResult.correctVal,
      isCorrect: evalResult.isCorrect,
      relativeErrorPercent: evalResult.relativeErrorPercent,
      solutionSteps: this.currentQuestion.solutionSteps
    };

    this.scoreHistory.push(record);
    return record;
  }
}
