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
      if (state === EXAM_STATES.IN_PROGRESS && this.examManager.isRecoveredSession) {
        this.activeQuestionIdx = this.examManager.restoredActiveQuestionIdx;
      }
      this.renderState(state, result);
      TabNavigatorAdapter.setExamInProgress(state === EXAM_STATES.IN_PROGRESS);
    };

    // Persist the active attempt before reload, close, or background transitions.
    this.setupRecoveryPersistence();

    // Check if active session or saved result exists in LocalStorage
    const savedSession = LocalStorageAdapter.loadExamSession();
    const savedResult = LocalStorageAdapter.loadExamResult();

    if (savedSession) {
      const resumed = this.examManager.resumeExamSession(savedSession);
      if (!resumed && (this.examManager.examResult || savedResult)) {
        const recoveredResult = this.examManager.examResult || savedResult;
        this.examManager.examResult = recoveredResult;
        this.renderState(EXAM_STATES.REVIEW, recoveredResult);
      } else {
        if (!resumed) {
          LocalStorageAdapter.clearExamSession();
          this.renderState(EXAM_STATES.IDLE);
        }
      }
    } else if (savedResult) {
      this.examManager.examResult = savedResult;
      this.renderState(EXAM_STATES.REVIEW, savedResult);
    } else {
      this.renderState(EXAM_STATES.IDLE);
    }
  }

  /**
   * Persist exam progress around reload, page close, or background transitions.
   * Refresh remains available; the saved attempt is restored on the next page load.
   */
  setupRecoveryPersistence() {
    if (typeof window === 'undefined') return;

    const saveActiveAttempt = () => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        this.examManager._saveSessionState(this.activeQuestionIdx);
      }
    };

    window.addEventListener('pagehide', saveActiveAttempt);
    window.addEventListener('beforeunload', saveActiveAttempt);

    document.addEventListener('visibilitychange', () => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        saveActiveAttempt();
        if (document.visibilityState === 'visible') {
          this.examManager.syncTimeRemaining();
        }
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
   * 1. Start Screen View (Strict 7-Step Layout per Timed-Exam-System-Rules.md)
   */
  renderStartScreenView() {
    const defaultName = this.examManager.fullName || '';
    const defaultClass = this.examManager.className || 'ม.6/1';
    const defaultRoll = this.examManager.rollNumber || 1;

    this.container.innerHTML = `
      <div class="glass-panel p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-left border-t-4 border-t-emerald-500 animate-fade-in">
        
        <!-- Step 1: Assessment Icon & Subject Marker -->
        <div class="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-emerald-500/10">
            🎓
          </div>
          <div>
            <!-- Step 2: Exam Title -->
            <h2 class="text-2xl font-bold text-white tracking-tight">ทดสอบเก็บคะแนน ม.6</h2>
            <!-- Step 3: Subtitle -->
            <p class="text-slate-400 text-sm mt-0.5 font-medium">
              บทที่ 18 คลื่นแม่เหล็กไฟฟ้า (18.1 - 18.3)
            </p>
          </div>
        </div>

        <!-- Step 4: Rules Warning Panel (Visible BEFORE identity form & start button) -->
        <div class="bg-gradient-to-r from-red-950/60 via-slate-900/90 to-amber-950/40 border border-red-500/40 rounded-xl p-5 space-y-3 shadow-lg shadow-red-950/20">
          <div class="flex items-center gap-2 text-red-400 font-bold text-base border-b border-red-500/20 pb-2">
            <span>🚨</span> <span>กติกาการสอบ (อ่านก่อนเริ่ม):</span>
          </div>
          <ul class="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed list-none">
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span>มีข้อสอบทั้งหมด <strong>5 ข้อ</strong> ข้อละ 2 คะแนน (คะแนนเต็ม <strong>10 คะแนน</strong>)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span>ขอบเขตเนื้อหา: 18.1 การเกิดคลื่นแม่เหล็กไฟฟ้า, 18.2 สเปกตรัมคลื่นแม่เหล็กไฟฟ้า (\\(E = hf\\)), 18.3 โพลาไรเซชัน (\\(I = I_0 \\cos^2 \\theta\\))</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span>มีระยะเวลาจำกัดในการทำข้อสอบ <strong>15 นาที</strong> (นับถอยหลัง)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span>การตอบคำถามประเภทคำนวณตัวเลข ให้ป้อนคำตอบเป็นทศนิยมไม่เกิน <strong>2 ตำแหน่ง</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold">•</span>
              <span class="text-amber-200 font-semibold">หากรีเฟรชหรือปิดหน้าแล้วกลับเข้ามา ระบบจะกู้คืนข้อสอบ คำตอบ และข้อที่กำลังทำ โดยนับเวลาต่อจากเวลาเริ่มเดิมและไม่เพิ่มเวลา</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span class="text-red-300 font-semibold">ระหว่างทำข้อสอบ ระบบจะไม่อนุญาตให้สลับไปยังแท็บเนื้อหาหรือแบบฝึกหัดภายในแอปจนกว่าจะส่งข้อสอบ</span>
            </li>
          </ul>
        </div>

        <!-- Step 5: Learner Identity Form -->
        <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>👤</span> <span>ข้อมูลผู้เข้าสอบ:</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Full Name -->
            <div class="space-y-1.5 md:col-span-1">
              <label for="input-exam-name" class="block text-xs font-semibold text-slate-300">
                ชื่อ-นามสกุลผู้สอบ <span class="text-red-400">*</span>:
              </label>
              <input type="text" id="input-exam-name" value="${defaultName}" placeholder="ระบุชื่อจริง นามสกุล"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors" />
            </div>

            <!-- Room Select (ม.6/1 - ม.6/5) -->
            <div class="space-y-1.5">
              <label for="select-exam-class" class="block text-xs font-semibold text-slate-300">
                ชั้น ม.6 / ห้อง <span class="text-red-400">*</span>:
              </label>
              <select id="select-exam-class"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors">
                <option value="ม.6/1" ${defaultClass === 'ม.6/1' ? 'selected' : ''}>ม.6/1</option>
                <option value="ม.6/2" ${defaultClass === 'ม.6/2' ? 'selected' : ''}>ม.6/2</option>
                <option value="ม.6/3" ${defaultClass === 'ม.6/3' ? 'selected' : ''}>ม.6/3</option>
                <option value="ม.6/4" ${defaultClass === 'ม.6/4' ? 'selected' : ''}>ม.6/4</option>
                <option value="ม.6/5" ${defaultClass === 'ม.6/5' ? 'selected' : ''}>ม.6/5</option>
              </select>
            </div>

            <!-- Student Roll Number -->
            <div class="space-y-1.5">
              <label for="input-exam-roll" class="block text-xs font-semibold text-slate-300">
                เลขที่ <span class="text-red-400">*</span>:
              </label>
              <input type="number" id="input-exam-roll" min="1" max="40" value="${defaultRoll}" placeholder="1-40"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none transition-colors" />
            </div>
          </div>

          <div id="exam-identity-error" class="hidden text-xs text-red-400 font-semibold pt-1">
            ⚠️ กรุณากรอกชื่อ-นามสกุล เลือกห้องเรียน และระบุเลขที่ระหว่าง 1-40 ให้ครบถ้วนก่อนเริ่มทำข้อสอบ
          </div>
        </div>

        <!-- Step 6 & Step 7: Actions (Back & Start Button) -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <!-- Step 6: Back or Cancel Action -->
          <button id="btn-back-to-review" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2">
            <span>←</span> <span>กลับไปทบทวนบทเรียน</span>
          </button>

          <!-- Step 7: Primary Start Action -->
          <button id="btn-start-exam" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>🚀</span> <span>เริ่มทำข้อสอบทันที</span>
          </button>
        </div>

      </div>
    `;

    this._bindStartScreenEvents();
    this.renderMathExpressions();
  }

  /**
   * Bind event listeners and real-time validation for start screen
   */
  _bindStartScreenEvents() {
    const inputName = this.container.querySelector('#input-exam-name');
    const selectClass = this.container.querySelector('#select-exam-class');
    const inputRoll = this.container.querySelector('#input-exam-roll');
    const btnStart = this.container.querySelector('#btn-start-exam');
    const btnBack = this.container.querySelector('#btn-back-to-review');
    const errorBox = this.container.querySelector('#exam-identity-error');

    const validateForm = () => {
      const nameVal = inputName ? inputName.value.trim() : '';
      const classVal = selectClass ? selectClass.value : '';
      const rollVal = inputRoll ? parseInt(inputRoll.value, 10) : 0;

      const isValid = nameVal.length > 0 && classVal.length > 0 && rollVal >= 1 && rollVal <= 40;

      if (btnStart) {
        btnStart.disabled = !isValid;
        if (isValid) {
          btnStart.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 cursor-pointer';
        } else {
          btnStart.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-base transition-all border border-slate-700 flex items-center justify-center gap-3 cursor-not-allowed opacity-60';
        }
      }

      return isValid;
    };

    // Real-time input listeners
    if (inputName) inputName.addEventListener('input', validateForm);
    if (selectClass) selectClass.addEventListener('change', validateForm);
    if (inputRoll) inputRoll.addEventListener('input', validateForm);

    // Initial validation check
    validateForm();

    // Start exam handler
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        const nameVal = inputName ? inputName.value.trim() : '';
        const classVal = selectClass ? selectClass.value : 'ม.6/1';
        const rollVal = inputRoll ? parseInt(inputRoll.value, 10) : 1;

        if (!validateForm()) {
          if (errorBox) errorBox.classList.remove('hidden');
          return;
        }

        if (errorBox) errorBox.classList.add('hidden');
        this.examManager.setIdentity(nameVal, classVal, rollVal);
        this.examManager.startExam();
      });
    }

    // Back to review tab handler
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        TabNavigatorAdapter.switchToTab('tab-review');
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

        ${this.examManager.isRecoveredSession ? `
          <div role="status" aria-live="polite" class="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100 flex items-start gap-3">
            <span aria-hidden="true">↻</span>
            <div>
              <div class="font-bold text-emerald-300">กู้คืนข้อสอบเดิมเรียบร้อยแล้ว</div>
              <div class="text-xs text-emerald-100/80 mt-0.5">คำตอบและข้อที่กำลังทำถูกนำกลับมาแล้ว เวลายังคงนับต่อจากเวลาเริ่มสอบเดิม</div>
            </div>
          </div>
        ` : ''}
        
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
    const currentVal = this.examManager.userAnswers[this.activeQuestionIdx] ?? '';
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
        this.examManager._saveSessionState(this.activeQuestionIdx);
        this.renderActiveExamView();
      });
    });

    const choiceInputs = this.container.querySelectorAll('input[name="exam-choice"]');
    choiceInputs.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value, this.activeQuestionIdx);
        this.renderActiveExamView();
      });
    });

    const numericInput = this.container.querySelector('#input-exam-numeric');
    if (numericInput) {
      numericInput.addEventListener('input', (e) => {
        this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value, this.activeQuestionIdx);
      });
    }

    const btnPrev = this.container.querySelector('#btn-prev-q');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.activeQuestionIdx > 0) {
          this.activeQuestionIdx--;
          this.examManager._saveSessionState(this.activeQuestionIdx);
          this.renderActiveExamView();
        }
      });
    }

    const btnNext = this.container.querySelector('#btn-next-q');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.activeQuestionIdx < 4) {
          this.activeQuestionIdx++;
          this.examManager._saveSessionState(this.activeQuestionIdx);
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
            <h3 class="text-xl font-bold text-white">${res.fullName || 'ผู้สอบ'} (${res.className || 'ม.6/1'})</h3>
            <p class="text-xs text-slate-300 font-medium">เลขที่: <span class="font-mono text-emerald-400 font-bold">#${res.rollNumber}</span> | ใช้เวลาสอบ: ${res.formattedTimeTaken}</p>
            <p class="text-xs text-slate-400 font-medium flex items-center gap-1.5 justify-center md:justify-start pt-0.5">
              <span>📅</span> <span>วันที่สอบ: ${res.formattedSubmittedAt || '2 ส.ค. 2569 เวลา 12:46 น.'}</span>
            </p>
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
          <div class="flex items-center justify-center">
            <button id="btn-retake-exam" class="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              <span>🔄</span> <span>เริ่มสอบใหม่อีกครั้ง</span>
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

    this.renderMathExpressions();
  }

  /**
   * Render inline KaTeX math expressions \\(...\\) and $...$
   */
  renderMathExpressions() {
    if (typeof window.katex === 'undefined') return;

    const textNodes = this.container.querySelectorAll('[id^="exam-problem-text"], [id^="exam-solution-steps"] li, .glass-panel li, .glass-panel p');
    textNodes.forEach((node) => {
      let html = node.innerHTML;
      // Replace \(...\)
      html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
        try {
          return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch (e) {
          return match;
        }
      });
      // Replace $...$
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
