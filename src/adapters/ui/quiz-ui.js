/**
 * @file quiz-ui.js
 * @description UI Adapter for rendering the Practice & Quiz System in #sec-practice.
 * Follows U-17 Reference UI Architecture.
 */

import { QuizManager } from '../../application/quiz-manager.js';
import { KaTeXAdapter } from '../formula/katex-adapter.js';

export class QuizUIAdapter {
  constructor() {
    this.quizManager = new QuizManager(1);
    this.currentTopic = '18.1';
    this.currentMode = 'standard';
    this.currentQuestion = null;
    this.questionCount = 0;

    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Attach global functions to window
    if (typeof window !== 'undefined') {
      window.currentPracticeTopic = this.currentTopic;
      window.startPracticeMode = (topic) => this.startPracticeMode(topic);
      window.regeneratePractice = () => this.generateQuestion();
      window.checkPracticeAnswer = () => this.checkNumericAnswer();
      window.checkPracticeChoice = (cIdx) => this.checkChoiceAnswer(cIdx);
    }

    const rollInput = document.getElementById('prac-student-roll');
    if (rollInput) {
      rollInput.addEventListener('change', (e) => {
        const roll = parseInt(e.target.value, 10);
        this.quizManager.setRollNumber(roll);
        this.generateQuestion();
      });
    }

    const modeSelect = document.getElementById('prac-mode-select');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this.currentMode = e.target.value;
        this.generateQuestion();
      });
    }

    const inputVal1 = document.getElementById('prac-input-val1');
    if (inputVal1) {
      inputVal1.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') this.checkNumericAnswer();
      });
    }

    // Initial load
    this.startPracticeMode('18.1');
  }

  /**
   * Switch practice topic (18.1, 18.2, 18.3)
   * @param {string} topic
   */
  startPracticeMode(topic) {
    this.currentTopic = topic;
    if (typeof window !== 'undefined') window.currentPracticeTopic = topic;

    // Update active styling on 3 topic cards
    const topics = ['18.1', '18.2', '18.3'];
    topics.forEach((t) => {
      const btn = document.getElementById(`btn-prac-${t.replace('.', '-')}`);
      if (btn) {
        if (t === topic) {
          btn.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50/50');
        } else {
          btn.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50/50');
        }
      }
    });

    this.generateQuestion();
  }

  /**
   * Generate next question
   */
  generateQuestion() {
    this.questionCount++;
    this.currentQuestion = this.quizManager.generateQuestion(this.questionCount, this.currentTopic);
    if (!this.currentQuestion) return;

    const titleEl = document.getElementById('prac-question-title');
    const textEl = document.getElementById('prac-question-text');
    const choiceZone = document.getElementById('prac-choice-zone');
    const numericZone = document.getElementById('prac-numeric-zone');
    const feedbackBox = document.getElementById('prac-feedback');
    const explBox = document.getElementById('prac-explanation-box');
    const inputVal1 = document.getElementById('prac-input-val1');

    // Reset feedback and explanation
    if (feedbackBox) {
      feedbackBox.classList.add('hidden');
      feedbackBox.innerHTML = '';
    }
    if (explBox) explBox.classList.add('hidden');
    if (inputVal1) inputVal1.value = '';

    if (titleEl) {
      titleEl.textContent = `📋 ข้อคำถาม (${this.currentQuestion.topic}) - ${this.currentQuestion.title}:`;
    }

    if (textEl) {
      textEl.innerHTML = this.currentQuestion.problemText;
    }

    // Toggle choice vs numeric input
    if (this.currentQuestion.type === 'choice') {
      if (choiceZone) choiceZone.classList.remove('hidden');
      if (numericZone) numericZone.classList.add('hidden');
      this.renderChoices();
    } else {
      if (choiceZone) choiceZone.classList.add('hidden');
      if (numericZone) numericZone.classList.remove('hidden');

      const lblInput = document.getElementById('lbl-prac-input-1');
      if (lblInput) {
        lblInput.textContent = `คำตอบ (${this.currentQuestion.unit || 'ตัวเลข'}):`;
      }
    }

    this.renderMathExpressions();
  }

  /**
   * Render choice buttons
   */
  renderChoices() {
    const choiceZone = document.getElementById('prac-choice-zone');
    if (!choiceZone || !this.currentQuestion.choices) return;

    choiceZone.innerHTML = this.currentQuestion.choices
      .map(
        (choice, idx) => `
        <button onclick="checkPracticeChoice(${idx})"
          class="prac-choice-btn w-full p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-left font-medium text-sm transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
            ${['ก', 'ข', 'ค', 'ง'][idx] || idx + 1}
          </span>
          <span class="choice-text flex-1">${choice}</span>
        </button>
      `
      )
      .join('');
  }

  /**
   * Check choice answer
   */
  checkChoiceAnswer(choiceIdx) {
    if (!this.currentQuestion) return;

    const isCorrect = choiceIdx === this.currentQuestion.correctChoiceIndex;
    this.displayFeedback(isCorrect, isCorrect ? 'ถูกต้องยอดเยี่ยม!' : 'ยังไม่ถูกต้อง ลองศึกษาจากวิธีทำด้านล่าง');
  }

  /**
   * Check numeric answer
   */
  checkNumericAnswer() {
    if (!this.currentQuestion) return;

    const inputVal1 = document.getElementById('prac-input-val1');
    const userVal = inputVal1 ? inputVal1.value.trim() : '';

    if (!userVal) {
      alert('กรุณากรอกตัวเลขคำตอบก่อนกดตรวจคำตอบ');
      return;
    }

    const evalResult = this.quizManager.evaluateAnswer(userVal);
    this.displayFeedback(evalResult.isCorrect, evalResult.message);
  }

  /**
   * Display feedback banner and step-by-step solution
   */
  displayFeedback(isCorrect, message) {
    const feedbackBox = document.getElementById('prac-feedback');
    const explBox = document.getElementById('prac-explanation-box');
    const explText = document.getElementById('prac-explanation-text');

    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      if (isCorrect) {
        feedbackBox.className = 'p-5 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-900 transition-all';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-emerald-800 mb-1">
            <i class="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
            <span>ยินดีด้วย! คำตอบถูกต้อง 🎉</span>
          </div>
          <p class="text-xs text-emerald-700">${message || 'คุณคำนวณและตอบได้ถูกต้องตามหลักฟิสิกส์'}</p>
        `;
      } else {
        feedbackBox.className = 'p-5 rounded-2xl border bg-red-50 border-red-200 text-red-900 transition-all';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-red-800 mb-1">
            <i class="fa-solid fa-circle-xmark text-2xl text-red-600"></i>
            <span>ยังไม่ถูกต้อง ❌</span>
          </div>
          <p class="text-xs text-red-700">${message || 'ลองทบทวนสูตรและขั้นตอนการคำนวณในวิธีทำด้านล่าง'}</p>
        `;
      }
    }

    if (explBox && explText && this.currentQuestion.solutionSteps) {
      explBox.classList.remove('hidden');
      explText.innerHTML = `
        <ol class="list-decimal pl-5 space-y-2">
          ${this.currentQuestion.solutionSteps.map((step) => `<li>${step}</li>`).join('')}
        </ol>
      `;
    }

    this.renderMathExpressions();
  }

  /**
   * Render KaTeX mathematical expressions
   */
  renderMathExpressions() {
    if (typeof window.katex === 'undefined') return;

    const container = document.getElementById('sec-practice');
    if (!container) return;

    const targets = container.querySelectorAll('#prac-question-text, .choice-text, #prac-explanation-text li, #prac-explanation-text');
    targets.forEach((node) => {
      let html = node.innerHTML;
      html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
        try {
          return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch (e) {
          return match;
        }
      });
      html = html.replace(/\$(.*?)\$/g, (match, math) => {
        try {
          return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch (e) {
          return match;
        }
      });
      node.innerHTML = html;
    });
  }
}
