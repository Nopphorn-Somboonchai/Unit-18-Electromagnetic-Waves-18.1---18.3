/**
 * @file tab-navigator.js
 * @description UI Adapter for tab navigation and simulator lifecycle management.
 */

export class TabNavigatorAdapter {
  /**
   * Initialize Tab Navigator
   * @param {Object} simulators - Dictionary of simulators { emWaveSim, spectrumSim, polarizationSim }
   */
  static init(simulators = {}) {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');

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
  }
}
