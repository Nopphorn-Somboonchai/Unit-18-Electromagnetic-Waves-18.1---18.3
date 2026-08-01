/**
 * @file exam-ui.js
 * @description UI Adapter for rendering the Timed Exam System and Score Dashboard in Tab 3.
 */

import { ExamManager, EXAM_STATES } from '../../application/exam-manager.js';
import { LocalStorageAdapter } from '../storage/local-storage.js';
import { KaTeXAdapter } from '../formula/katex-adapter.js';
import { TabNavigatorAdapter } from './tab-navigator.js';

export class ExamUIAdapter {
  /**
   * @param {HTMLElement} containerElement - Container element for exam UI
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.examManager = new ExamManager(1);
    this.activeQuestionIdx = 0;

    // Listen for timer ticks and state changes
    this.examManager.onTickCallback = (secondsLeft, timerStr) => {
      this.updateTimerDisplay(secondsLeft, timerStr);
    };

    this.examManager.onStateChangeCallback = (state, result) => {
      this.renderState(state, result);
      TabNavigatorAdapter.setExamInProgress(state === EXAM_STATES.IN_PROGRESS);
    };

    // Bind Reload & Unload Protection (F5, Ctrl+R, beforeunload)
    this.setupReloadProtection();

    // Check if saved result exists in LocalStorage
    const savedResult = LocalStorageAdapter.loadExamResult();
    if (savedResult) {
      this.examManager.examResult = savedResult;
      this.renderState(EXAM_STATES.REVIEW, savedResult);
    } else {
      this.renderState(EXAM_STATES.IDLE);
    }
  }

  /**
   * Setup browser reload protection (F5 / Ctrl+R / beforeunload)
   */
  setupReloadProtection() {
    if (typeof window === 'undefined') return;

    // Intercept keyboard reload shortcuts (F5, Ctrl+R, Cmd+R)
    window.addEventListener('keydown', (e) => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        if (
          e.key === 'F5' ||
          (e.key === 'r' && (e.ctrlKey || e.metaKey)) ||
          (e.key === 'R' && (e.ctrlKey || e.metaKey))
        ) {
          e.preventDefault();
          e.stopPropagation();
          alert('⚠️ ไม่อนุญาตให้กดรีโหลดหน้าเว็บ (F5 / Ctrl+R) ระหว่างทำข้อสอบเก็บคะแนน!\nหากต้องการส่งข้อสอบ กรุณากดปุ่ม "ส่งข้อสอบ" ด้านล่าง');
          return false;
        }
      }
    }, true);

    // Intercept browser reload / tab close / window unload
    window.addEventListener('beforeunload', (e) => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        // Auto-submit current exam immediately before unloading to prevent exam reset
        this.examManager.submitExam(true);

        const warningMsg = '⚠️ คุณกำลังทำข้อสอบเก็บคะแนนอยู่ หากคุณรีโหลดหรือออกจากหน้านี้ ข้อสอบของคุณจะถูกส่งและยุติการสอบทันที!';
        e.preventDefault();
        e.returnValue = warningMsg;
        return warningMsg;
      }
    });
  }

  /**
   * Render view based on state machine
   */
  renderState(state, data = null) {
    if (!this.container) return;

    switch (state) {
      case EXAM_STATES.IN_PROGRESS:
        this.renderActiveExamView();
        break;
      case EXAM_STATES.SUBMITTED:
      case EXAM_STATES.REVIEW:
        this.renderDashboardView(data || this.examManager.examResult);
        break;
      case EXAM_STATES.IDLE:
      default:
        this.renderStartScreenView();
        break;
    }
  }

  /**
   * 1. Start Screen View
   */
  renderStartScreenView() {
    this.container.innerHTML = `
      <div class="glass-panel p-8 space-y-6 max-w-3xl mx-auto text-center border-t-4 border-t-emerald-500 animate-fade-in">
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/10">
          🎓
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-white">ระบบสอบเก็บคะแนน (Timed Exam 15 นาที)</h2>
          <p class="text-slate-300 text-sm mt-2">
            บทที่ 18 คลื่นแม่เหล็กไฟฟ้า (18.1 - 18.3) | ข้อสอบ 5 ข้อ (10 คะแนนเต็ม)
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
          <div class="p-3 bg-slate-800/40 rounded-lg">
            <span class="text-slate-400 block mb-1">⏱️ เวลาในการทำข้อสอบ:</span>
            <span class="font-bold text-white text-sm">15 นาทีถอยหลัง</span>
          </div>
          <div class="p-3 bg-slate-800/40 rounded-lg">
            <span class="text-slate-400 block mb-1">📝 จำนวนข้อสอบ:</span>
            <span class="font-bold text-white text-sm">5 ข้อ (1 ตัวเลือก + 4 คำนวณ)</span>
          </div>
          <div class="p-3 bg-slate-800/40 rounded-lg">
            <span class="text-slate-400 block mb-1">🎯 คะแนนเต็ม:</span>
            <span class="font-bold text-emerald-400 text-sm">10 คะแนน (ข้อละ 2 คะแนน)</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-4 pt-2">
          <label for="input-exam-roll" class="text-sm font-semibold text-slate-300">
            ยืนยันเลขที่ผู้สอบ (R):
          </label>
          <input type="number" id="input-exam-roll" min="1" max="40" value="${this.examManager.rollNumber}"
            class="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center text-lg focus:border-emerald-500 focus:outline-none" />
        </div>

        <div>
          <button id="btn-start-exam" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 mx-auto">
            <span>🚀</span> <span>เริ่มทำข้อสอบทันที</span>
          </button>
        </div>
      </div>
    `;

    const rollInput = this.container.querySelector('#input-exam-roll');
    if (rollInput) {
      rollInput.addEventListener('change', (e) => {
        this.examManager.setRollNumber(parseInt(e.target.value, 10));
      });
    }

    const btnStart = this.container.querySelector('#btn-start-exam');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.examManager.startExam();
      });
    }
  }

  /**
   * 2. Active Exam View
   */
  renderActiveExamView() {
    const q = this.examManager.questions[this.activeQuestionIdx];
    if (!q) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Active Exam Header Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <!-- Question Status Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            ${this.examManager.questions.map((_, idx) => {
              const isAnswered = this.examManager.userAnswers[idx] !== undefined && this.examManager.userAnswers[idx] !== '';
              const isActive = idx === this.activeQuestionIdx;

              let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
              if (isAnswered) btnClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
              if (isActive) btnClass = 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50';

              return `<button class="exam-q-pill px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${btnClass}" data-idx="${idx}">
                        ข้อที่ ${idx + 1} ${isAnswered ? '✓' : ''}
                      </button>`;
            }).join('')}
          </div>

          <!-- Timer & Submit Actions -->
          <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div id="active-exam-timer" class="text-xl font-bold font-mono text-emerald-400 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
              ${this.examManager.formatTimerString()}
            </div>
            <button id="btn-submit-exam-now" class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/20">
              ส่งข้อสอบ
            </button>
          </div>
        </div>

        <!-- Question Card -->
        <div class="glass-panel p-6 space-y-6 border-l-4 border-l-blue-500 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">${q.topic}</span>
            <span class="text-xs font-mono text-amber-400 font-bold">2 คะแนน</span>
          </div>

          <h3 class="text-lg font-bold text-white">${q.title}</h3>
          
          <div id="exam-problem-text" class="text-slate-200 text-base leading-relaxed bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            ${q.problemText}
          </div>

          <!-- Input Area (Choice vs Numeric) -->
          <div id="exam-input-area" class="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            ${q.type === 'choice' ? this._renderChoiceInput(q) : this._renderNumericInput(q)}
          </div>

          <!-- Question Navigation Buttons -->
          <div class="flex items-center justify-between pt-2">
            <button id="btn-prev-q" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors ${this.activeQuestionIdx === 0 ? 'opacity-50 pointer-events-none' : ''}">
              ← ข้อก่อนหน้า
            </button>
            <button id="btn-next-q" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors ${this.activeQuestionIdx === 4 ? 'hidden' : ''}">
              ข้อถัดไป →
            </button>
          </div>
        </div>

      </div>
    `;

    this._bindActiveExamEvents();
    this.renderMathExpressions();
  }

  /**
   * Render Choice Input for Theory Question
   */
  _renderChoiceInput(q) {
    const selectedIdx = this.examManager.userAnswers[this.activeQuestionIdx];
    return `
      <div class="space-y-3">
        ${q.choices.map((choiceText, cIdx) => {
          const isChecked = String(selectedIdx) === String(cIdx);
          return `
            <label class="flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-blue-950/60 border-blue-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'}">
              <input type="radio" name="exam-choice" value="${cIdx}" ${isChecked ? 'checked' : ''} class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm">${choiceText}</span>
            </label>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Render Numeric Input for Calculation Questions
   */
  _renderNumericInput(q) {
    const currentVal = this.examManager.userAnswers[this.activeQuestionIdx] || '';
    return `
      <div class="flex items-center gap-3 max-w-md">
        <label for="input-exam-numeric" class="text-sm font-semibold text-slate-300 whitespace-nowrap">
          คำตอบ:
        </label>
        <input type="number" id="input-exam-numeric" step="any" value="${currentVal}" placeholder="กรอกตัวเลขคำตอบ..."
          class="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-lg focus:border-blue-500 focus:outline-none" />
        <span class="text-sm font-bold text-blue-400 bg-blue-950/60 px-3 py-2.5 rounded-lg border border-blue-800/60 font-mono">
          ${q.unit}
        </span>
      </div>
    `;
  }

  /**
   * Bind Active Exam events
   */
  _bindActiveExamEvents() {
    const qPills = this.container.querySelectorAll('.exam-q-pill');
    qPills.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeQuestionIdx = parseInt(btn.getAttribute('data-idx'), 10);
        this.renderActiveExamView();
      });
    });

    const choiceInputs = this.container.querySelectorAll('input[name="exam-choice"]');
    choiceInputs.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value);
        this.renderActiveExamView();
      });
    });

    const numericInput = this.container.querySelector('#input-exam-numeric');
    if (numericInput) {
      numericInput.addEventListener('input', (e) => {
        this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value);
      });
    }

    const btnPrev = this.container.querySelector('#btn-prev-q');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.activeQuestionIdx > 0) {
          this.activeQuestionIdx--;
          this.renderActiveExamView();
        }
      });
    }

    const btnNext = this.container.querySelector('#btn-next-q');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.activeQuestionIdx < 4) {
          this.activeQuestionIdx++;
          this.renderActiveExamView();
        }
      });
    }

    const btnSubmit = this.container.querySelector('#btn-submit-exam-now');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (confirm('คุณต้องการยืนยันการส่งข้อสอบเก็บคะแนนใช่หรือไม่?')) {
          this.examManager.submitExam(false);
        }
      });
    }
  }

  /**
   * Update active timer string
   */
  updateTimerDisplay(secondsLeft, timerStr) {
    const timerBox = this.container.querySelector('#active-exam-timer');
    const headerTimerBox = document.getElementById('exam-timer-display');

    if (timerBox) {
      timerBox.textContent = timerStr;
      if (secondsLeft < 180) {
        timerBox.className = 'text-xl font-bold font-mono text-red-400 bg-red-950/80 px-3.5 py-1.5 rounded-lg border border-red-800 animate-pulse';
      }
    }

    if (headerTimerBox) {
      headerTimerBox.textContent = timerStr;
      if (secondsLeft < 180) {
        headerTimerBox.className = 'text-2xl font-bold font-mono text-red-400 bg-slate-900 px-4 py-2 rounded-xl border border-red-800 animate-pulse';
      }
    }
  }

  /**
   * 3. Score Dashboard & Review View
   */
  renderDashboardView(res) {
    if (!res) return;

    const isPass = res.totalScore >= 6; // Pass mark: 6/10 (60%)

    this.container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Score Overview Card -->
        <div class="glass-panel p-6 border-t-4 ${isPass ? 'border-t-emerald-500' : 'border-t-amber-500'} grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="text-center md:text-left space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">สรุปผลการสอบเก็บคะแนน</span>
            <h3 class="text-2xl font-bold text-white">ผลสอบเลขที่ #${res.rollNumber}</h3>
            <p class="text-xs text-slate-400">ใช้เวลาสอบ: ${res.formattedTimeTaken}</p>
          </div>

          <!-- Total Score Gauge -->
          <div class="flex items-center justify-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div class="text-center">
              <div class="text-4xl font-extrabold ${isPass ? 'text-emerald-400' : 'text-amber-400'} font-mono">${res.totalScore}</div>
              <div class="text-xs text-slate-400 mt-1">คะแนนเต็ม 10</div>
            </div>
            <div class="h-10 w-px bg-slate-800"></div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white font-mono">${res.percentage.toFixed(0)}%</div>
              <div class="text-xs ${isPass ? 'text-emerald-400' : 'text-amber-400'} font-semibold mt-1">
                ${isPass ? 'ผ่านเกณฑ์ 🎉' : 'ควรทบทวน ⚠️'}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row md:flex-col gap-3">
            <button id="btn-retake-exam" class="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2">
              <span>🔄</span> <span>เริ่มสอบใหม่อีกครั้ง</span>
            </button>
            <button id="btn-clear-exam" class="w-full px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-2">
              <span>🗑️</span> <span>ล้างข้อมูลผลสอบ</span>
            </button>
          </div>
        </div>

        <!-- Question Breakdown List -->
        <div class="space-y-6">
          <h4 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📋</span> รายละเอียดผลการตอบรายข้อ (Question Review):
          </h4>

          ${res.gradedQuestions.map((q, idx) => `
            <div class="glass-panel p-5 space-y-4 border-l-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">ข้อที่ ${idx + 1}</span>
                  <span class="text-xs text-slate-400">${q.topic}</span>
                </div>
                <span class="text-xs font-bold font-mono ${q.isCorrect ? 'text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800' : 'text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800'}">
                  ${q.scoreObtained} / 2 คะแนน
                </span>
              </div>

              <h5 class="text-base font-bold text-white">${q.title}</h5>
              <div id="exam-problem-text-${idx}" class="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                ${q.problemText}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div class="p-3 rounded-lg ${q.isCorrect ? 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-200' : 'bg-red-950/30 border border-red-800/40 text-red-200'}">
                  คำตอบของคุณ: <span class="font-bold text-sm ml-1">${q.userAnswer} ${q.unit || ''}</span>
                </div>
                <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                  เฉลยที่ถูกต้อง: <span class="font-bold text-sm text-emerald-400 ml-1">${q.type === 'choice' ? q.choices[q.correctChoiceIndex] : `${q.correctAnswer} ${q.unit}`}</span>
                </div>
              </div>

              <!-- Solution Steps -->
              <div class="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
                <div class="font-bold text-amber-400">วิธีทำอย่างละเอียด:</div>
                <ul id="exam-solution-steps-${idx}" class="list-disc list-inside space-y-1 text-slate-300">
                  ${q.solutionSteps.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    const btnRetake = this.container.querySelector('#btn-retake-exam');
    if (btnRetake) {
      btnRetake.addEventListener('click', () => {
        this.examManager.state = EXAM_STATES.IDLE;
        this.renderStartScreenView();
      });
    }

    const btnClear = this.container.querySelector('#btn-clear-exam');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('คุณต้องการล้างข้อมูลผลสอบออกจาก LocalStorage ใช่หรือไม่?')) {
          LocalStorageAdapter.clearExamResult();
          this.examManager.examResult = null;
          this.examManager.state = EXAM_STATES.IDLE;
          this.renderStartScreenView();
        }
      });
    }

    this.renderMathExpressions();
  }

  /**
   * Render inline KaTeX math expressions \\(...\\)
   */
  renderMathExpressions() {
    if (typeof window.katex === 'undefined') return;

    const textNodes = this.container.querySelectorAll('[id^="exam-problem-text"], [id^="exam-solution-steps"] li');
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
