/**
 * @file tab-navigator.js
 * @description UI Adapter for section & tab navigation, simulator lifecycles, and exam protection lock.
 * Designed according to U-17 Reference Architecture.
 */

import { KaTeXAdapter } from '../formula/katex-adapter.js';

export class TabNavigatorAdapter {
  static isExamInProgress = false;
  static currentSection = 'home';
  static currentReviewTab = '18-1-wave';
  static simulators = {};

  /**
   * Set exam protection lock state and switch to live exam section if active
   * @param {boolean} inProgress
   */
  static setExamInProgress(inProgress) {
    this.isExamInProgress = !!inProgress;
    this.updateExamLockUI();
    if (this.isExamInProgress) {
      this.showSection('exam-live');
    }
  }

  /**
   * Update visual lock styling and classes
   */
  static updateExamLockUI() {
    if (typeof document === 'undefined') return;

    if (this.isExamInProgress) {
      document.documentElement.classList.add('exam-locked');
      document.body.classList.add('exam-locked');
    } else {
      document.documentElement.classList.remove('exam-locked');
      document.body.classList.remove('exam-locked');
    }
  }

  /**
   * Show target section and hide others (home, review, practice, exam-start, exam-live, exam-result)
   * @param {string} sectionId
   */
  static showSection(sectionId) {
    if (typeof document === 'undefined') return;

    // Exam protection lock
    if (this.isExamInProgress && sectionId !== 'exam-live' && sectionId !== 'exam-result') {
      alert('⚠️ อยู่ระหว่างการทำข้อสอบเก็บคะแนน (15 นาที)!\nคุณกำลังทำข้อสอบอยู่ ไม่สามารถเปลี่ยนไปหน้าอื่นได้จนกว่าจะส่งข้อสอบ');
      return;
    }

    this.currentSection = sectionId;
    const sections = ['home', 'review', 'practice', 'exam-start', 'exam-live', 'exam-result'];

    sections.forEach((id) => {
      const el = document.getElementById(`sec-${id}`);
      if (el) {
        if (id === sectionId) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Manage simulator lifecycles
    if (sectionId === 'review') {
      this.handleSimulatorLifecycle(this.currentReviewTab);
    } else {
      if (this.simulators.emWaveSim) {
        this.simulators.emWaveSim.pause();
      }
    }

    // Trigger KaTeX rendering on newly visible section
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        const el = document.getElementById(`sec-${sectionId}`);
        if (el) KaTeXAdapter.renderAllMath(el);
      });
    }
  }

  /**
   * Switch review tab (18-1-wave, 18-2-spectrum, 18-3-polarization)
   * @param {string} tabId
   */
  static switchReviewTab(tabId) {
    if (typeof document === 'undefined') return;

    this.currentReviewTab = tabId;
    const tabKeys = ['18-1-wave', '18-2-spectrum', '18-3-polarization'];

    tabKeys.forEach((key) => {
      const btn = document.getElementById(`btn-tab-${key}`);
      const content = document.getElementById(`review-tab-${key}`);

      if (btn) {
        if (key === tabId) {
          btn.className = 'flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 bg-white text-blue-600 shadow-sm cursor-pointer';
        } else {
          btn.className = 'flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 cursor-pointer';
        }
      }

      if (content) {
        if (key === tabId) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      }
    });

    this.handleSimulatorLifecycle(tabId);

    // Trigger KaTeX rendering on newly visible review tab
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        const content = document.getElementById(`review-tab-${tabId}`);
        if (content) KaTeXAdapter.renderAllMath(content);
      });
    }
  }

  /**
   * Manage active simulator lifecycle on sub-tab switch
   * @param {string} tabId
   */
  static handleSimulatorLifecycle(tabId) {
    const { emWaveSim, spectrumSim, polarizationSim } = this.simulators;

    if (tabId === '18-1-wave') {
      if (emWaveSim) emWaveSim.start();
    } else {
      if (emWaveSim) emWaveSim.pause();
    }

    if (tabId === '18-2-spectrum') {
      if (spectrumSim) spectrumSim.render();
    }

    if (tabId === '18-3-polarization') {
      if (polarizationSim) polarizationSim.render();
    }
  }

  /**
   * Toggle mobile navigation menu
   */
  static toggleMobileMenu() {
    if (typeof document === 'undefined') return;
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  }

  /**
   * Backward-compatibility wrapper for switchToTab
   * @param {string} targetTabId
   */
  static switchToTab(targetTabId) {
    if (targetTabId === 'tab-review') this.showSection('review');
    else if (targetTabId === 'tab-practice') this.showSection('practice');
    else if (targetTabId === 'tab-exam') this.showSection(this.isExamInProgress ? 'exam-live' : 'exam-start');
    else this.showSection(targetTabId.replace(/^tab-|^sec-/, ''));
  }

  /**
   * Initialize Tab Navigator
   * @param {Object} simulators - Dictionary of simulators { emWaveSim, spectrumSim, polarizationSim }
   */
  static init(simulators = {}) {
    this.simulators = simulators;

    // Attach navigation helper functions to global window object
    if (typeof window !== 'undefined') {
      window.showSection = (sectionId) => this.showSection(sectionId);
      window.switchReviewTab = (tabId) => this.switchReviewTab(tabId);
      window.toggleMobileMenu = () => this.toggleMobileMenu();
    }

    // Default to home section unless an active exam session was restored
    if (this.isExamInProgress) {
      this.showSection('exam-live');
    } else {
      this.showSection('home');
    }
  }
}
