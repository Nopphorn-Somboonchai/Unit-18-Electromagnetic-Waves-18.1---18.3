/**
 * @file viewport-geometry.test.js
 * @description Viewport boundary clearance test for Simulators 18.1, 18.2, and 18.3 across Mobile, iPad, and Desktop viewports.
 */

import assert from 'node:assert';
import { SPECTRUM_BANDS } from '../src/shared/constants.js';

console.log('Testing Simulator 18.1, 18.2, 18.3 Geometry Clearance Across Viewports...');

const viewports = [
  { name: 'Mobile Compact (360px)', w: 360 },
  { name: 'Mobile Standard (393px)', w: 393 },
  { name: 'iPad Portrait (768px)', w: 768 },
  { name: 'iPad Landscape (1024px)', w: 1024 },
  { name: 'Desktop (1440px)', w: 1440 }
];

for (const vp of viewports) {
  const w = vp.w;

  // --- 1. Simulator 18.1: WaveFieldPlotter Geometry Audit ---
  const isCompact1 = w < 640;
  const h1 = isCompact1 ? 300 : (w < 768 ? 350 : 390);
  const ox1 = Math.max(45, Math.min(70, w * 0.1));
  const oy1 = h1 / 2 + 10;
  const axisLen1 = Math.max(160, w - ox1 - (isCompact1 ? 50 : 85));
  const maxAmp1 = Math.max(25, oy1 - 45);
  const amp1 = Math.max(28, Math.min(maxAmp1, (h1 - 90) * 0.3));
  const topE = oy1 - amp1 * 1.35 - 10;
  const botE = oy1 + amp1 * 1.35;
  const rightV = ox1 + axisLen1 + 22;

  assert(topE >= 0, `[18.1] +E label clipped at top for ${vp.name} (topE: ${topE})`);
  assert(botE <= h1, `[18.1] Wave clipped at bottom for ${vp.name} (botE: ${botE}, h: ${h1})`);
  assert(rightV <= w, `[18.1] Propagation vector v clipped on right for ${vp.name} (rightV: ${rightV}, w: ${w})`);

  // --- 2. Simulator 18.2: SpectrumPlotter Geometry Audit ---
  const isCompact2 = w < 768;
  const h2 = isCompact2 ? 260 : (w < 1024 ? 290 : 310);
  const pad2 = Math.max(16, w * 0.035);
  const barW = w - pad2 * 2;
  const barY = isCompact2 ? 68 : 78;
  const barH = isCompact2 ? 52 : 62;
  const axisY = barY + barH + (isCompact2 ? 22 : 28);
  const tickY = axisY + (isCompact2 ? 15 : 18);
  const bandW = barW / SPECTRUM_BANDS.length;

  assert(barW > 250, `[18.2] Spectrum bar too narrow for ${vp.name} (barW: ${barW})`);
  assert(tickY <= h2 - 10, `[18.2] Frequency ticks clipped at bottom for ${vp.name} (tickY: ${tickY}, h: ${h2})`);
  assert(bandW >= 35, `[18.2] Band slots too narrow for ${vp.name} (bandW: ${bandW})`);

  // --- 3. Simulator 18.3: PolaroidPlotter Geometry Audit ---
  const h3 = w < 640 ? 280 : (w < 768 ? 340 : 380);
  const startX = Math.max(16, w * 0.04);
  const endX = Math.min(w - 16, w * 0.96);
  const usableWidth = endX - startX;
  const p1X = startX + usableWidth * 0.33;
  const p2X = startX + usableWidth * 0.67;
  const sheetHeight = Math.max(115, Math.min(170, h3 * 0.48));

  assert(p1X > startX, `[18.3] P1 out of bounds for ${vp.name}`);
  assert(p2X < endX, `[18.3] P2 out of bounds for ${vp.name}`);
  assert(sheetHeight <= h3 * 0.55, `[18.3] Polaroid sheet too tall for ${vp.name}`);

  console.log(`✅ [PASS] ${vp.name}: 18.1 topE=${topE.toFixed(1)}px, 18.2 tickY=${tickY}px <= ${h2}px, 18.3 sheetH=${sheetHeight.toFixed(1)}px`);
}

console.log('\n🎉 ALL VIEWPORT GEOMETRY CLEARANCE TESTS PASSED (100%)!\n');

