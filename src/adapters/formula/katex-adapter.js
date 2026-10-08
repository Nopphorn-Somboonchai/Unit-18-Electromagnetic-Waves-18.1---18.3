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
    if (typeof document === 'undefined') return false;
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
        strict: false,
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
   * Render LaTeX string to HTML string.
   * @param {string} latex
   * @param {boolean} [displayMode=false]
   * @returns {string}
   */
  static renderToString(latex, displayMode = false) {
    if (typeof window === 'undefined' || typeof window.katex === 'undefined') {
      return latex;
    }
    try {
      return window.katex.renderToString(latex, {
        displayMode: displayMode,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml'
      });
    } catch (e) {
      return latex;
    }
  }

  /**
   * Safely scan and render all mathematical formulas in a container element.
   * Prioritizes official renderMathInElement (auto-render extension) for safe DOM text node handling.
   * @param {HTMLElement|string} [container=document.body]
   */
  static renderAllMath(container = document.body) {
    if (typeof document === 'undefined') return;
    const targetEl = typeof container === 'string' ? document.getElementById(container) : container;
    if (!targetEl) return;

    // 1. Try official KaTeX auto-render extension
    if (typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
      try {
        window.renderMathInElement(targetEl, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$', right: '$', display: false }
          ],
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'input', 'select', 'option'],
          throwOnError: false,
          strict: false,
          errorColor: '#ef4444'
        });
        return;
      } catch (err) {
        console.warn('[KaTeXAdapter] renderMathInElement failed, using fallback parser:', err);
      }
    }

    // 2. Safe Fallback: Process text nodes directly so event listeners are preserved
    if (typeof window !== 'undefined' && typeof window.katex !== 'undefined') {
      this._fallbackRenderTextNodes(targetEl);
    }
  }

  /**
   * Internal text node parser fallback when renderMathInElement is not present.
   * Avoids destructive innerHTML assignments on container nodes.
   * @private
   */
  static _fallbackRenderTextNodes(container) {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || (!node.nodeValue.includes('\\(') && !node.nodeValue.includes('$'))) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (['script', 'style', 'textarea', 'pre', 'code', 'input', 'select', 'option'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('.katex')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToReplace = [];
    let current;
    while ((current = walker.nextNode())) {
      nodesToReplace.push(current);
    }

    nodesToReplace.forEach((textNode) => {
      const text = textNode.nodeValue;
      const mathRegex = /(\\\([\s\S]*?\\\))|(\$\$[\s\S]*?\$\$)|(\$[^\$]+?\$)/g;
      if (!mathRegex.test(text)) return;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      mathRegex.lastIndex = 0;

      while ((match = mathRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        const rawMath = match[0];
        let formula = '';
        let displayMode = false;

        if (rawMath.startsWith('\\(') && rawMath.endsWith('\\)')) {
          formula = rawMath.slice(2, -2);
          displayMode = false;
        } else if (rawMath.startsWith('$$') && rawMath.endsWith('$$')) {
          formula = rawMath.slice(2, -2);
          displayMode = true;
        } else if (rawMath.startsWith('$') && rawMath.endsWith('$')) {
          formula = rawMath.slice(1, -1);
          displayMode = false;
        }

        try {
          const span = document.createElement('span');
          window.katex.render(formula, span, {
            displayMode,
            throwOnError: false,
            strict: false
          });
          fragment.appendChild(span);
        } catch (e) {
          fragment.appendChild(document.createTextNode(rawMath));
        }

        lastIndex = match.index + rawMath.length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  /**
   * Pre-defined physics LaTeX formula templates for Unit 18 (Standardized Notation)
   */
  static TEMPLATES = Object.freeze({
    SPEED_OF_LIGHT: 'c = f \\lambda = 3.00 \\times 10^8 \\text{ m/s}',
    WAVELENGTH_SOLVER: '\\lambda = \\frac{c}{f}',
    PHOTON_ENERGY: 'E = hf = \\frac{hc}{\\lambda}',
    MALUS_LAW: 'I = I_0 \\cos^2\\theta',
    POLAROID_TWO: 'I_2 = I_1 \\cos^2(\\theta_2 - \\theta_1)',
    UNPOLARIZED_P1: 'I_1 = \\frac{1}{2}I_0',
    VECTOR_FIELD: '\\vec{E} \\perp \\vec{B} \\perp \\vec{v}',
    PROPAGATION_DIRECTION: '\\hat{v} = \\hat{E} \\times \\hat{B}',
    PLANCK_CONSTANT: 'h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}',
    EV_CONVERSION: '1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}'
  });
}
