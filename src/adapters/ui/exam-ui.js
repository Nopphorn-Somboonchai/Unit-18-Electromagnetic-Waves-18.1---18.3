/**
 * @file exam-ui.js
 * @description UI Adapter for Timed Exam System, Anti-Cheat detection, and Score Dashboard.
 * Designed according to U-17 Reference Architecture.
 */

import { ExamManager, EXAM_STATES } from '../../application/exam-manager.js';
import { LocalStorageAdapter } from '../storage/local-storage.js';
import { KaTeXAdapter } from '../formula/katex-adapter.js';
import { TabNavigatorAdapter } from './tab-navigator.js';

export class ExamUIAdapter {
  constructor() {
    this.examManager = new ExamManager(1);
    this.tabSwitchCount = 0;
    this.refreshCount = 0;

    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Attach global window handlers
    if (typeof window !== 'undefined') {
      window.startExamProcess = () => this.startExamProcess();
      window.confirmSubmitExam = () => this.confirmSubmitExam();
      window.dismissCheatWarning = () => this.dismissCheatWarning();
      window.toggleExamSolutionBox = () => this.toggleExamSolutionBox();
      window.showLatestResultModal = () => this.showLatestResultModal();
      window.closeLatestResultModal = () => this.closeLatestResultModal();
      window.recordExamAnswer = (qIdx, val) => this.recordAnswer(qIdx, val);
    }

    // Set ExamManager Callbacks
    this.examManager.onTickCallback = (secondsLeft, timerStr) => {
      this.updateTimerDisplay(secondsLeft, timerStr);
    };

    this.examManager.onStateChangeCallback = (state, result) => {
      if (state === EXAM_STATES.SUBMITTED || state === EXAM_STATES.REVIEW) {
        TabNavigatorAdapter.setExamInProgress(false);
        this.renderResults(result || this.examManager.examResult);
      }
    };

    // Setup Anti-Cheat Detection
    this.setupAntiCheatDetection();

    // Check for existing saved session or result
    const savedSession = LocalStorageAdapter.loadExamSession();
    const savedResult = LocalStorageAdapter.loadExamResult();

    if (savedResult) {
      this.updateHomeLastScore(savedResult.totalScore);
    }

    if (savedSession) {
      const resumed = this.examManager.resumeExamSession(savedSession);
      if (resumed) {
        this.refreshCount++;
        TabNavigatorAdapter.setExamInProgress(true);
        this.renderActiveExamView();
      } else {
        LocalStorageAdapter.clearExamSession();
      }
    }
  }

  /**
   * Setup Anti-Cheat tab-switch and blur detection
   */
  setupAntiCheatDetection() {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        if (document.hidden) {
          this.tabSwitchCount++;
          this.triggerCheatWarning('ตรวจพบการสลับหน้าต่างหรือออกจากแท็บสอบ!');
        } else {
          this.examManager.syncTimeRemaining();
        }
      }
    };

    const handleBlur = () => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        this.tabSwitchCount++;
        this.triggerCheatWarning('ตรวจพบการคลิกออกจากหน้าต่างข้อสอบ!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    // Save active attempt on unload/hide
    window.addEventListener('beforeunload', () => {
      if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
        this.examManager._saveSessionState(0);
      }
    });
  }

  /**
   * Trigger high-contrast floating anti-cheat warning banner
   */
  triggerCheatWarning(msg) {
    const banner = document.getElementById('cheat-warning-banner');
    const textEl = document.getElementById('cheat-warning-text');
    if (!banner || !textEl) return;

    textEl.textContent = `${msg} (บันทึกครั้งที่ ${this.tabSwitchCount})`;
    banner.classList.remove('hidden');
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(0)';
    banner.classList.add('cheat-shake');

    setTimeout(() => {
      banner.classList.remove('cheat-shake');
    }, 450);
  }

  /**
   * Dismiss warning banner
   */
  dismissCheatWarning() {
    const banner = document.getElementById('cheat-warning-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(110%)';
      setTimeout(() => banner.classList.add('hidden'), 350);
    }
  }

  /**
   * Start exam process from start screen
   */
  startExamProcess() {
    const nameInput = document.getElementById('exam-student-name');
    const classSelect = document.getElementById('exam-student-class');
    const rollInput = document.getElementById('exam-student-no');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const className = classSelect ? `ม.${classSelect.value}` : 'ม.6/1';
    const rollNumber = rollInput ? parseInt(rollInput.value, 10) : 1;

    if (!fullName) {
      alert('กรุณาระบุชื่อ-นามสกุลก่อนเริ่มการสอบ');
      if (nameInput) nameInput.focus();
      return;
    }

    if (isNaN(rollNumber) || rollNumber < 1 || rollNumber > 40) {
      alert('กรุณาระบุเลขที่ระหว่าง 1 ถึง 40');
      if (rollInput) rollInput.focus();
      return;
    }

    this.tabSwitchCount = 0;
    this.refreshCount = 0;

    this.examManager.setIdentity(fullName, className, rollNumber);
    this.examManager.startExam();

    TabNavigatorAdapter.setExamInProgress(true);
    this.renderActiveExamView();
  }

  /**
   * Render all 5 questions into #sec-exam-live
   */
  renderActiveExamView() {
    const container = document.getElementById('exam-questions-container');
    const userInfoEl = document.getElementById('lbl-exam-user-info');
    if (!container) return;

    if (userInfoEl) {
      userInfoEl.textContent = `ผู้เข้าสอบ: ${this.examManager.fullName} (${this.examManager.className}) เลขที่ ${this.examManager.rollNumber}`;
    }

    container.innerHTML = this.examManager.questions
      .map((q, idx) => {
        const currentAns = this.examManager.userAnswers[idx] ?? '';
        return `
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              ข้อที่ ${idx + 1} • ${q.topic}
            </span>
            <span class="text-xs font-bold font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              2.0 คะแนน
            </span>
          </div>

          <h4 class="text-base font-bold text-slate-800">${q.title}</h4>

          <div class="exam-problem-content text-slate-700 bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200 text-sm md:text-base leading-relaxed math-font">
            ${q.problemText}
          </div>

          <!-- Answer Zone -->
          <div class="pt-2">
            ${
              q.type === 'choice'
                ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${q.choices
                  .map(
                    (choice, cIdx) => `
                  <label class="exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    String(currentAns) === String(cIdx)
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }">
                    <input type="radio" name="exam-q-${idx}" value="${cIdx}" ${
                      String(currentAns) === String(cIdx) ? 'checked' : ''
                    } onchange="recordExamAnswer(${idx}, ${cIdx})" class="w-4 h-4 text-blue-600" />
                    <span class="text-xs md:text-sm flex-1">${choice}</span>
                  </label>
                `
                  )
                  .join('')}
              </div>
            `
                : `
              <div class="flex items-center gap-3 max-w-sm">
                <label class="text-xs font-bold text-slate-600">คำตอบ:</label>
                <input type="number" step="any" value="${currentAns}" placeholder="กรอกตัวเลขคำตอบ"
                  oninput="recordExamAnswer(${idx}, this.value)"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base" />
                <span class="text-xs font-bold font-mono text-slate-500 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
                  ${q.unit || ''}
                </span>
              </div>
            `
            }
          </div>
        </div>
      `;
      })
      .join('');

    this.renderMathExpressions();
  }

  /**
   * Record answer for question index
   */
  recordAnswer(qIdx, val) {
    this.examManager.recordAnswer(qIdx, val, qIdx);

    // Update radio label styles if choice
    if (this.examManager.questions[qIdx]?.type === 'choice') {
      const radios = document.querySelectorAll(`input[name="exam-q-${qIdx}"]`);
      radios.forEach((r) => {
        const label = r.closest('label');
        if (label) {
          if (r.checked) {
            label.className = 'exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all bg-blue-50 border-blue-500 text-blue-900 font-semibold';
          } else {
            label.className = 'exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
          }
        }
      });
    }
  }

  /**
   * Confirm and submit exam
   */
  confirmSubmitExam() {
    const unanswered = this.examManager.questions.filter((_, idx) => {
      const a = this.examManager.userAnswers[idx];
      return a === undefined || a === '';
    }).length;

    let confirmMsg = 'คุณต้องการยืนยันและส่งข้อสอบใช่หรือไม่?';
    if (unanswered > 0) {
      confirmMsg = `คุณยังมีข้อสอบที่ยังไม่ได้ตอบอีก ${unanswered} ข้อ!\nต้องการยืนยันและส่งข้อสอบตอนนี้ใช่หรือไม่?`;
    }

    if (confirm(confirmMsg)) {
      this.examManager.submitExam(false);
    }
  }

  /**
   * Update timer display string
   */
  updateTimerDisplay(secondsLeft, timerStr) {
    const timerDisplay = document.getElementById('exam-timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = timerStr;
      if (secondsLeft < 180) {
        timerDisplay.className = 'font-mono text-lg font-bold text-red-400 tracking-wider animate-pulse';
      } else {
        timerDisplay.className = 'font-mono text-lg font-bold text-white tracking-wider';
      }
    }
  }

  /**
   * Render results into #sec-exam-result
   */
  renderResults(res) {
    if (!res) return;

    TabNavigatorAdapter.showSection('exam-result');
    this.updateHomeLastScore(res.totalScore);

    // SVG Circular Score Gauge
    const circle = document.getElementById('res-circle-progress');
    const totalScoreEl = document.getElementById('lbl-res-total-score');
    if (circle) {
      const perimeter = 439.8;
      const offset = perimeter - (res.percentage / 100) * perimeter;
      setTimeout(() => {
        circle.style.strokeDashoffset = String(offset);
      }, 100);
    }
    if (totalScoreEl) totalScoreEl.textContent = String(res.totalScore);

    // Student Info Cards
    const nameEl = document.getElementById('lbl-res-student-name');
    const metaEl = document.getElementById('lbl-res-student-meta');
    const timeEl = document.getElementById('lbl-res-time-elapsed');
    const dateEl = document.getElementById('lbl-res-finished-at');

    if (nameEl) nameEl.textContent = res.fullName || 'ผู้สอบ';
    if (metaEl) metaEl.textContent = `${res.className || 'ม.6/1'} • เลขที่ #${res.rollNumber}`;
    if (timeEl) timeEl.textContent = res.formattedTimeTaken || '15 นาที';
    if (dateEl) dateEl.textContent = res.formattedSubmittedAt || new Date().toLocaleString('th-TH');

    // Anti-Cheat Summary Alert
    const cheatCard = document.getElementById('exam-cheat-summary-card');
    const tabSwitchesEl = document.getElementById('lbl-res-tab-switches');
    const refreshesEl = document.getElementById('lbl-res-refreshes');

    if (this.tabSwitchCount > 0 || this.refreshCount > 0) {
      if (cheatCard) cheatCard.classList.remove('hidden');
      if (tabSwitchesEl) tabSwitchesEl.textContent = `${this.tabSwitchCount} ครั้ง`;
      if (refreshesEl) refreshesEl.textContent = `${this.refreshCount} ครั้ง`;
    } else {
      if (cheatCard) cheatCard.classList.add('hidden');
    }

    // Performance Feedback
    const feedbackBadge = document.getElementById('lbl-res-badge-feedback');
    if (feedbackBadge) {
      if (res.totalScore >= 8) {
        feedbackBadge.className = 'text-center p-4 rounded-xl mb-8 border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold';
        feedbackBadge.textContent = '🌟 ผลการสอบระดับยอดเยี่ยม! คุณเข้าใจหลักการคลื่นแม่เหล็กไฟฟ้าได้อย่างแม่นยำมาก';
      } else if (res.totalScore >= 6) {
        feedbackBadge.className = 'text-center p-4 rounded-xl mb-8 border border-blue-200 bg-blue-50 text-blue-800 text-sm font-semibold';
        feedbackBadge.textContent = '🎉 ผ่านเกณฑ์การประเมิน! สามารถทบทวนวิธีทำในข้อที่ผิดเพื่อความแม่นยำยิ่งขึ้น';
      } else {
        feedbackBadge.className = 'text-center p-4 rounded-xl mb-8 border border-amber-200 bg-amber-50 text-amber-800 text-sm font-semibold';
        feedbackBadge.textContent = '⚠️ คะแนนยังไม่ผ่านเกณฑ์ 60% แนะนำให้กลับไปทบทวนบทเรียนและฝึกทำโจทย์อีกครั้ง';
      }
    }

    // Result Table
    const tbody = document.getElementById('exam-result-tbody');
    if (tbody) {
      tbody.innerHTML = res.gradedQuestions
        .map(
          (q, idx) => `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-4 font-bold text-slate-800">ข้อที่ ${idx + 1}</td>
          <td class="px-5 py-4 text-slate-600">${q.topic} - ${q.title}</td>
          <td class="px-5 py-4 text-center font-mono text-slate-500">2.0</td>
          <td class="px-5 py-4 text-center">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }">
              ${q.scoreObtained.toFixed(1)}
            </span>
          </td>
        </tr>
      `
        )
        .join('');
    }

    // Solution Steps Container
    const solutionsContainer = document.getElementById('exam-solutions-container');
    if (solutionsContainer) {
      solutionsContainer.innerHTML = res.gradedQuestions
        .map(
          (q, idx) => `
        <div class="bg-white p-5 rounded-2xl border ${
          q.isCorrect ? 'border-emerald-200' : 'border-red-200'
        } space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg ${
              q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }">
              ข้อที่ ${idx + 1} • ${q.isCorrect ? 'ถูกต้อง (+2.0)' : 'ไม่ถูกต้อง (0.0)'}
            </span>
            <span class="text-xs text-slate-500 font-mono">${q.topic}</span>
          </div>

          <p class="text-sm font-medium text-slate-800 math-font">${q.problemText}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-500 block mb-0.5">คำตอบของคุณ:</span>
              <span class="font-bold text-sm ${q.isCorrect ? 'text-emerald-600' : 'text-red-600'}">
                ${q.userAnswer ?? '-'} ${q.unit || ''}
              </span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-500 block mb-0.5">เฉลยที่ถูกต้อง:</span>
              <span class="font-bold text-sm text-emerald-600">
                ${q.type === 'choice' ? q.choices[q.correctChoiceIndex] : `${q.correctAnswer} ${q.unit || ''}`}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div class="font-bold text-blue-600 flex items-center gap-1.5">
              <i class="fa-solid fa-lightbulb"></i> วิธีทำอย่างละเอียด:
            </div>
            <ol class="list-decimal pl-4 space-y-1 text-slate-700 math-font">
              ${q.solutionSteps.map((s) => `<li>${s}</li>`).join('')}
            </ol>
          </div>
        </div>
      `
        )
        .join('');
    }

    this.renderMathExpressions();
  }

  /**
   * Toggle solution box
   */
  toggleExamSolutionBox() {
    const box = document.getElementById('exam-solution-box');
    const icon = document.getElementById('icon-toggle-sol');
    const text = document.getElementById('lbl-toggle-solution-text');

    if (!box) return;

    if (box.classList.contains('hidden')) {
      box.classList.remove('hidden');
      if (icon) icon.className = 'fa-solid fa-chevron-up';
      if (text) text.textContent = 'ซ่อนคำเฉลยและวิธีทำ';
    } else {
      box.classList.add('hidden');
      if (icon) icon.className = 'fa-solid fa-chevron-down';
      if (text) text.textContent = 'แสดงคำเฉลยอย่างละเอียดและแสดงวิธีทำ';
    }
  }

  /**
   * Update home screen score badge
   */
  updateHomeLastScore(score) {
    const el = document.getElementById('lbl-last-score');
    if (el) {
      el.textContent = `${score} / 10 คะแนน`;
    }
  }

  /**
   * Open Latest Result Modal from Home page
   */
  showLatestResultModal() {
    const modal = document.getElementById('latest-result-modal');
    const content = document.getElementById('modal-latest-result-content');
    const result = LocalStorageAdapter.loadExamResult();

    if (!result) {
      alert('ยังไม่มีประวัติการสอบ กรุณาทำแบบทดสอบเก็บคะแนนก่อน');
      return;
    }

    if (content) {
      content.innerHTML = `
        <div class="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="text-4xl font-extrabold text-blue-600 font-mono">${result.totalScore} / 10</div>
          <div class="text-xs text-slate-500 mt-1">คะแนนรวม (${result.percentage.toFixed(0)}%)</div>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">ชื่อผู้เข้าสอบ:</span>
            <span class="font-bold text-slate-800">${result.fullName} (${result.className}) เลขที่ ${result.rollNumber}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">เวลาที่ใช้:</span>
            <span class="font-bold text-slate-800">${result.formattedTimeTaken}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">วันที่ส่งข้อสอบ:</span>
            <span class="font-bold text-slate-800">${result.formattedSubmittedAt}</span>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
  }

  /**
   * Close Latest Result Modal
   */
  closeLatestResultModal() {
    const modal = document.getElementById('latest-result-modal');
    if (modal) modal.classList.add('hidden');
  }

  /**
   * Render KaTeX Math Expressions
   */
  renderMathExpressions() {
    if (typeof window.katex === 'undefined') return;

    const container = document.getElementById('sec-exam-live') || document.getElementById('sec-exam-result');
    if (!container) return;

    const targets = document.querySelectorAll('.exam-problem-content, .exam-choice-label span, #exam-solutions-container p, #exam-solutions-container li');
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
