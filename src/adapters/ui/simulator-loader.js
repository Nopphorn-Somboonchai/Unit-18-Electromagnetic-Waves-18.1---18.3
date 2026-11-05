/**
 * @file simulator-loader.js
 * @description UI Adapter for Simulator Loading Progression (% Progression & Physics Calibration Stages).
 * Displays an in-canvas frosted glass overlay with animated percentage (0% -> 100%) and scientific status messages.
 * Adheres strictly to Physics Learning Standard (v1.13.0) and U-17 UI Reference Architecture.
 */

export class SimulatorLoader {
  /**
   * Tracks loaded state for each simulator to prevent unnecessary re-runs
   * @type {Record<string, boolean>}
   */
  static loadedState = {
    '18-1-wave': false,
    '18-2-spectrum': false,
    '18-3-polarization': false
  };

  /**
   * Maps simulator id to DOM element prefix
   * @type {Record<string, string>}
   */
  static prefixMap = {
    '18-1-wave': 'em-wave',
    '18-2-spectrum': 'spectrum',
    '18-3-polarization': 'polarization'
  };

  /**
   * Scientific calibration stages for each simulator
   */
  static calibrationStages = {
    '18-1-wave': [
      { maxPct: 25, status: 'กำลังสร้างระบบพิกัด 3 มิติ (แกน X, Y, Z)...' },
      { maxPct: 60, status: 'คำนวณสนามคลื่นไซน์ E ⟂ B ตามสมการแมกซ์เวลล์...' },
      { maxPct: 90, status: 'กำหนดทิศทางเวกเตอร์การแผ่คลื่น v = c...' },
      { maxPct: 100, status: 'ปรับเทียบเสร็จสมบูรณ์! พร้อมจำลองการแผ่คลื่น' }
    ],
    '18-2-spectrum': [
      { maxPct: 25, status: 'จัดเตรียมช่วงคลื่นสเปกตรัม 7 แถบสี (สสวท.)...' },
      { maxPct: 60, status: 'ปรับเทียบสเกลลอการิทึมความถี่ 10³ - 10²² Hz...' },
      { maxPct: 90, status: 'เชื่อมโยงฟังก์ชันคำนวณพลังงานโฟตอน E = hf...' },
      { maxPct: 100, status: 'ปรับเทียบเสร็จสมบูรณ์! พร้อมเลือกช่วงคลื่น' }
    ],
    '18-3-polarization': [
      { maxPct: 25, status: 'ติดตั้งแหล่งกำเนิดแสงไม่โพลาไรส์ (I₀)...' },
      { maxPct: 60, status: 'ติดตั้งแผ่นโพลาไรเซอร์ P1 (0°, I₁ = 0.5 I₀)...' },
      { maxPct: 90, status: 'ปรับเทียบแผ่นวิเคราะห์ P2 ตามกฎของมาลุส...' },
      { maxPct: 100, status: 'ปรับเทียบเสร็จสมบูรณ์! พร้อมหมุนปรับมุม' }
    ]
  };

  /**
   * Check if a simulator has completed its initial load
   * @param {string} simId - '18-1-wave' | '18-2-spectrum' | '18-3-polarization'
   * @returns {boolean}
   */
  static isLoaded(simId) {
    return !!this.loadedState[simId];
  }

  /**
   * Mark a simulator as loaded
   * @param {string} simId
   */
  static markLoaded(simId) {
    this.loadedState[simId] = true;
  }

  /**
   * Reset loaded state (used for testing or explicit reload)
   * @param {string} [simId] - Omit to reset all
   */
  static reset(simId) {
    if (simId) {
      this.loadedState[simId] = false;
    } else {
      Object.keys(this.loadedState).forEach((key) => {
        this.loadedState[key] = false;
      });
    }
  }

  /**
   * Get current stage status message based on percentage
   * @param {string} simId
   * @param {number} pct - 0 to 100
   * @returns {string}
   */
  static getStatusText(simId, pct) {
    const stages = this.calibrationStages[simId] || this.calibrationStages['18-1-wave'];
    const current = stages.find((s) => pct <= s.maxPct);
    return current ? current.status : stages[stages.length - 1].status;
  }

  /**
   * Start loading progression animation (0% -> 100%)
   * @param {string} simId - '18-1-wave' | '18-2-spectrum' | '18-3-polarization'
   * @param {Object} [options]
   * @param {boolean} [options.force=false] - Force reload even if already loaded
   * @param {number} [options.duration=700] - Duration in milliseconds
   * @param {Function} [options.onComplete] - Callback on 100% completion
   * @param {Function} [options.onProgress] - Callback on each percentage step (pct, status)
   * @returns {Promise<boolean>}
   */
  static load(simId, options = {}) {
    const {
      force = false,
      duration = 700,
      onComplete = null,
      onProgress = null
    } = options;

    // If already loaded and not forced, invoke onComplete immediately
    if (this.isLoaded(simId) && !force) {
      if (typeof onComplete === 'function') onComplete();
      return Promise.resolve(true);
    }

    const prefix = this.prefixMap[simId] || simId;

    return new Promise((resolve) => {
      // DOM elements (if in browser environment)
      const isDOM = typeof document !== 'undefined';
      const elOverlay = isDOM ? document.getElementById(`loader-${prefix}`) : null;
      const elPct = isDOM ? document.getElementById(`loader-${prefix}-pct`) : null;
      const elBar = isDOM ? document.getElementById(`loader-${prefix}-bar`) : null;
      const elStatus = isDOM ? document.getElementById(`loader-${prefix}-status`) : null;

      // Show overlay if present
      if (elOverlay) {
        elOverlay.classList.remove('opacity-0', 'pointer-events-none');
        elOverlay.style.display = 'flex';
      }

      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

      const updateProgress = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, Math.max(0, elapsed / duration));

        // Ease-out cubic curve for natural smooth feel
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentPct = Math.min(100, Math.round(ease * 100));
        const statusText = this.getStatusText(simId, currentPct);

        // Update DOM
        if (elPct) elPct.textContent = String(currentPct);
        if (elBar) elBar.style.width = `${currentPct}%`;
        if (elStatus) elStatus.textContent = statusText;

        if (typeof onProgress === 'function') {
          onProgress(currentPct, statusText);
        }

        if (progress < 1) {
          if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(updateProgress);
          } else {
            setTimeout(() => updateProgress(Date.now()), 16);
          }
        } else {
          // Finished 100%
          this.markLoaded(simId);

          if (elPct) elPct.textContent = '100';
          if (elBar) elBar.style.width = '100%';
          if (elStatus) elStatus.textContent = this.getStatusText(simId, 100);

          // Smooth fade out overlay
          if (elOverlay) {
            setTimeout(() => {
              elOverlay.classList.add('opacity-0', 'pointer-events-none');
              setTimeout(() => {
                if (elOverlay.classList.contains('opacity-0')) {
                  elOverlay.style.display = 'none';
                }
              }, 300);
            }, 120);
          }

          if (typeof onComplete === 'function') {
            onComplete();
          }

          resolve(true);
        }
      };

      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => updateProgress(Date.now()), 16);
      }
    });
  }

  /**
   * Reload simulator with progression animation
   * @param {string} simId
   * @param {Function} [onComplete]
   */
  static reload(simId, onComplete = null) {
    return this.load(simId, { force: true, onComplete });
  }

  /**
   * Initialize Global Window Handlers
   */
  static initGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.SimulatorLoader = SimulatorLoader;
      window.reloadSimulator = (simId) => {
        return SimulatorLoader.reload(simId);
      };
    }
  }
}

