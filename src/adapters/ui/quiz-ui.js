/**
 * @file quiz-ui.js
 * @description UI Adapter for rendering the Practice & Quiz System in Tab 2.
 * Manages problem card rendering, KaTeX formula evaluation, and solution steps display.
 */

import { QuizManager } from '../../application/quiz-manager.js';
import { KaTeXAdapter } from '../formula/katex-adapter.js';

export class QuizUIAdapter {
  /**
   * @param {HTMLElement} containerElement - Container element for quiz UI
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.quizManager = new QuizManager(1);
    this.currentCategory = 'mixed';
    this.currentQuestionIndex = 0;

    this.renderLayout();
  }

  /**
   * Render overall Quiz System layout into container
   */
  renderLayout() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Header & Category Filter Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center gap-3">
            <label for="input-quiz-roll" class="text-sm font-semibold text-slate-300">
              เลขที่ผู้เรียน (R):
            </label>
            <input type="number" id="input-quiz-roll" min="1" max="40" value="${this.quizManager.rollNumber}"
              class="w-20 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center focus:border-blue-500 focus:outline-none" />
          </div>

          <!-- Category Selection Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white" data-cat="mixed">
              🔀 ทั้งหมด (ผสม)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.1">
              18.1 คลื่น E&B (c=fλ)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.2">
              18.2 สเปกตรัม (E=hf)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.3">
              18.3 โพลาไรเซชัน (มาลุส)
            </button>
          </div>
        </div>

        <!-- Question Card Placeholder -->
        <div id="quiz-question-card" class="space-y-6"></div>

      </div>
    `;

    this._bindEvents();
    this.loadQuestion();
  }

  /**
   * Bind event listeners for Roll Number and Category buttons
   */
  _bindEvents() {
    const rollInput = this.container.querySelector('#input-quiz-roll');
    if (rollInput) {
      rollInput.addEventListener('change', (e) => {
        const newR = parseInt(e.target.value, 10);
        this.quizManager.setRollNumber(newR);
        this.loadQuestion();

        // Also sync header status badge
        const headerStatus = document.getElementById('header-user-status');
        if (headerStatus) headerStatus.textContent = `เลขที่ #${this.quizManager.rollNumber}`;
      });
    }

    const catButtons = this.container.querySelectorAll('.quiz-cat-btn');
    catButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        catButtons.forEach((b) => {
          b.className = 'quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700';
        });
        btn.className = 'quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white';

        this.currentCategory = btn.getAttribute('data-cat');
        this.currentQuestionIndex = 0;
        this.loadQuestion();
      });
    });
  }

  /**
   * Load active question card
   */
  loadQuestion() {
    const q = this.quizManager.generateQuestion(this.currentQuestionIndex, this.currentCategory);
    const cardContainer = this.container.querySelector('#quiz-question-card');
    if (!cardContainer || !q) return;

    cardContainer.innerHTML = `
      <div class="glass-panel p-6 space-y-6 border-l-4 border-l-blue-500 animate-fade-in">
        
        <!-- Question Topic & Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">${q.topic}</span>
            <h3 class="text-xl font-bold text-white mt-2">${q.title}</h3>
          </div>
          <span class="text-xs font-mono text-slate-400">ข้อที่ ${this.currentQuestionIndex + 1}</span>
        </div>

        <!-- Problem Description Text -->
        <div id="quiz-problem-text" class="text-slate-200 text-base leading-relaxed bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          ${q.problemText}
        </div>

        <!-- Input & Answer Action Form -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2 flex-grow">
            <label for="input-quiz-answer" class="text-sm font-semibold text-slate-300 whitespace-nowrap">
              คำตอบของคุณ:
            </label>
            <input type="number" id="input-quiz-answer" step="any" placeholder="กรอกตัวเลขคำตอบ..."
              class="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-lg focus:border-blue-500 focus:outline-none" />
            <span class="text-sm font-bold text-blue-400 bg-blue-950/60 px-3 py-2.5 rounded-lg border border-blue-800/60 font-mono">
              ${q.unit}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button id="btn-submit-answer" class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
              <span>✅</span> <span>ตรวจคำตอบ</span>
            </button>
            <button id="btn-next-question" class="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors flex items-center justify-center gap-2">
              <span>🔄</span> <span>โจทย์ข้อถัดไป</span>
            </button>
          </div>
        </div>

        <!-- Feedback & Solution Steps Card (Initially Hidden) -->
        <div id="quiz-feedback-card" class="hidden space-y-4"></div>

      </div>
    `;

    // Render Math Expressions in Problem Text
    this.renderMathExpressions();

    // Bind Answer Submission Events
    const btnSubmit = cardContainer.querySelector('#btn-submit-answer');
    const btnNext = cardContainer.querySelector('#btn-next-question');
    const inputAnswer = cardContainer.querySelector('#input-quiz-answer');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.handleSubmission());
    }

    if (inputAnswer) {
      inputAnswer.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') this.handleSubmission();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.currentQuestionIndex++;
        this.loadQuestion();
      });
    }
  }

  /**
   * Evaluate and display feedback + LaTeX solution steps
   */
  handleSubmission() {
    const cardContainer = this.container.querySelector('#quiz-question-card');
    const inputAnswer = cardContainer.querySelector('#input-quiz-answer');
    const feedbackCard = cardContainer.querySelector('#quiz-feedback-card');

    if (!inputAnswer || !feedbackCard) return;

    const userVal = inputAnswer.value;
    const result = this.quizManager.evaluateAnswer(userVal);

    feedbackCard.classList.remove('hidden');

    const statusBadge = result.isCorrect
      ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-base flex items-center gap-3">
           <span class="text-2xl">🎉</span>
           <div>
             <div>คำตอบถูกต้องแม่นยำ!</div>
             <div class="text-xs text-emerald-400/80 font-normal">ความคลาดเคลื่อน ${result.relativeErrorPercent}% (ผ่านเกณฑ์ 3%)</div>
           </div>
         </div>`
      : `<div class="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-base flex items-center gap-3">
           <span class="text-2xl">❌</span>
           <div>
             <div>คำตอบยังไม่ถูกต้อง</div>
             <div class="text-xs text-red-400/80 font-normal">${result.message} — เฉลยที่ถูกต้องคือ ${result.correctAnswer} ${this.quizManager.currentQuestion.unit}</div>
           </div>
         </div>`;

    const stepsHtml = result.solutionSteps.map((step) => `<li class="leading-relaxed">${step}</li>`).join('');

    feedbackCard.innerHTML = `
      ${statusBadge}
      <div class="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-3">
        <h4 class="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>💡</span> เฉลยวิธีทำอย่างละเอียด (Step-by-Step Solution):
        </h4>
        <ol id="quiz-solution-steps-list" class="list-decimal list-inside space-y-2 text-sm text-slate-200">
          ${stepsHtml}
        </ol>
      </div>
    `;

    // Render LaTeX Math in Solution Steps
    this.renderMathExpressions();
  }

  /**
   * Render inline KaTeX math expressions \\(...\\)
   */
  renderMathExpressions() {
    if (typeof window.katex === 'undefined') return;

    const textNodes = this.container.querySelectorAll('#quiz-problem-text, #quiz-solution-steps-list li');
    textNodes.forEach((node) => {
      let html = node.innerHTML;
      html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
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
