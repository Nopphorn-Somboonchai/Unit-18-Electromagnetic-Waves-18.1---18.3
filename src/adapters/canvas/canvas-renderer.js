/**
 * @file canvas-renderer.js
 * @description Base Canvas 2D Rendering Adapter.
 * Provides high-DPI awareness, coordinate system scaling, and reusable drawing primitives.
 * Strictly decoupled from physics calculations according to Canvas-Guidelines.md.
 */

export class CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas - HTML5 Canvas element
   */
  constructor(canvas) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('[CanvasRenderer] Valid HTMLCanvasElement is required');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // Resize canvas for sharp rendering on high-DPI (Retina) screens
    this.resize();

    // Bind window resize event
    this._handleResize = this.resize.bind(this);
    window.addEventListener('resize', this._handleResize);
  }

  /**
   * Handle canvas resize and scale for high DPI displays
   */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || this.canvas.width || 800;
    const height = rect.height || this.canvas.height || 400;

    this.width = width;
    this.height = height;

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);

    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Clear canvas viewport
   * @param {string} [bgColor='#090D16'] - Background clear color
   */
  clear(bgColor = '#090D16') {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Draw a line segment
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {string} [color='#FFFFFF']
   * @param {number} [lineWidth=1]
   * @param {number[]} [dash=[]]
   */
  drawLine(x1, y1, x2, y2, color = '#FFFFFF', lineWidth = 1, dash = []) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    if (dash.length > 0) {
      this.ctx.setLineDash(dash);
    }
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draw a vector arrow with arrowhead
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {string} [color='#3B82F6'] - Line and head color
   * @param {number} [lineWidth=2]
   * @param {number} [headSize=8]
   */
  drawArrow(x1, y1, x2, y2, color = '#3B82F6', lineWidth = 2, headSize = 8) {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = lineWidth;

    // Draw main shaft
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Draw arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headSize * Math.cos(angle - Math.PI / 6),
      y2 - headSize * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - headSize * Math.cos(angle + Math.PI / 6),
      y2 - headSize * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  /**
   * Draw text label with optional background pill
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   */
  drawLabel(text, x, y, {
    font = '12px Sarabun, sans-serif',
    color = '#F8FAFC',
    align = 'center',
    bgColor = null,
    padding = 4
  } = {}) {
    this.ctx.save();
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';

    if (bgColor) {
      const metrics = this.ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = 14;
      let rectX = x - textWidth / 2 - padding;
      if (align === 'left') rectX = x - padding;
      if (align === 'right') rectX = x - textWidth - padding;

      this.ctx.fillStyle = bgColor;
      this.ctx.fillRect(rectX, y - textHeight / 2 - padding / 2, textWidth + padding * 2, textHeight + padding);
    }

    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  /**
   * Cleanup event listeners on destroy
   */
  destroy() {
    window.removeEventListener('resize', this._handleResize);
  }
}
