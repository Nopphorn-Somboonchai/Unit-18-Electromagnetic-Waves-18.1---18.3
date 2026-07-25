/**
 * @file katex-adapter.js
 * @description Formula Rendering Adapter wrapping the local offline KaTeX library.
 * Safe rendering with fallback handling according to Formula-Display.md standards.
 */

export class KaTeXAdapter {
  /**
   * Render LaTeX string into a target DOM element.
   * @param {string} latex - LaTeX formula string (e.g. "c = f\\lambda")
   * @param {HTMLElement|string} elementOrId - Target DOM element or element ID
   * @param {boolean} [displayMode=false] - True for centered block display ($$), false for inline ($)
   * @returns {boolean} Success status
   */
  static render(latex, elementOrId, displayMode = false) {
    const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;

    if (!el) {
      console.warn(`[KaTeXAdapter] Target element "${elementOrId}" not found in DOM`);
      return false;
    }

    if (typeof window.katex === 'undefined') {
      console.warn('[KaTeXAdapter] KaTeX library not loaded yet. Falling back to plain text.');
      el.textContent = latex;
      return false;
    }

    try {
      window.katex.render(latex, el, {
        displayMode: displayMode,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
      return true;
    } catch (err) {
      console.error('[KaTeXAdapter] KaTeX render error:', err);
      el.textContent = latex;
      return false;
    }
  }

  /**
   * Pre-defined physics LaTeX formula templates for Unit 18
   */
  static TEMPLATES = Object.freeze({
    SPEED_OF_LIGHT: 'c = f \\lambda',
    WAVELENGTH_SOLVER: '\\lambda = \\frac{c}{f}',
    PHOTON_ENERGY: 'E = hf = \\frac{hc}{\\lambda}',
    MALUS_LAW: 'I = I_0 \\cos^2\\theta',
    POLAROID_TWO: 'I_2 = I_1 \\cos^2(\\theta_2 - \\theta_1)',
    UNPOLARIZED_P1: 'I_1 = \\frac{I_0}{2}',
    VECTOR_FIELD: '\\vec{E} \\perp \\vec{B} \\perp \\vec{v}',
    RIGHT_HAND_RULE: '\\vec{E} \\times \\vec{B} = \\vec{v}'
  });
}
