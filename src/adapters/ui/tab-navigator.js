/**
 * @file tab-navigator.js
 * @description UI Adapter for tab navigation, simulator lifecycle, and exam protection lock.
 */

export class TabNavigatorAdapter {
  static isExamInProgress = false;

  /**
   * Set exam protection lock state and switch to exam tab if active
   * @param {boolean} inProgress
   */
  static setExamInProgress(inProgress) {
    this.isExamInProgress = !!inProgress;
    this.updateTabLockUI();
    if (this.isExamInProgress) {
      this.switchToTab('tab-exam');
    }
  }

  /**
   * Switch active tab view programmatically
   * @param {string} targetTabId
   */
  static switchToTab(targetTabId) {
    if (typeof document === 'undefined') return;

    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((b) => {
      if (b.getAttribute('data-tab') === targetTabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabContents.forEach((content) => {
      if (content.id === targetTabId) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  /**
   * Update visual lock styling on tab buttons
   */
  static updateTabLockUI() {
    if (typeof document === 'undefined') return;
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach((btn) => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId !== 'tab-exam') {
        if (this.isExamInProgress) {
          btn.classList.add('opacity-40', 'cursor-not-allowed');
          btn.setAttribute('title', 'อยู่ระหว่างการสอบ ไม่สามารถเข้าถึงแท็บนี้ได้');
        } else {
          btn.classList.remove('opacity-40', 'cursor-not-allowed');
          btn.removeAttribute('title');
        }
      }
    });
  }

  /**
   * Initialize Tab Navigator
   * @param {Object} simulators - Dictionary of simulators { emWaveSim, spectrumSim, polarizationSim }
   */
  static init(simulators = {}) {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetTabId = btn.getAttribute('data-tab');

        // Block navigation if exam is currently in progress
        if (this.isExamInProgress && targetTabId !== 'tab-exam') {
          e.preventDefault();
          e.stopPropagation();
          alert('⚠️ อยู่ระหว่างการทำข้อสอบเก็บคะแนน (15 นาที)!\nระบบไม่อนุญาตให้เปลี่ยนไปดูเนื้อหาหรือฝึกทำโจทย์ในแท็บอื่นจนกว่าจะส่งข้อสอบ');
          return;
        }

        // Update button active states
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle tab content visibility
        tabContents.forEach((content) => {
          if (content.id === targetTabId) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        });

        // Manage simulator lifecycle on tab switch
        if (targetTabId === 'tab-review') {
          if (simulators.emWaveSim) simulators.emWaveSim.start();
          if (simulators.spectrumSim) simulators.spectrumSim.render();
          if (simulators.polarizationSim) simulators.polarizationSim.render();
        } else {
          // Pause animation when leaving review tab to save CPU/GPU
          if (simulators.emWaveSim) simulators.emWaveSim.pause();
        }
      });
    });

    // If an exam session was resumed during initialization, ensure exam tab is active
    if (this.isExamInProgress) {
      this.switchToTab('tab-exam');
      this.updateTabLockUI();
    }
  }
}
