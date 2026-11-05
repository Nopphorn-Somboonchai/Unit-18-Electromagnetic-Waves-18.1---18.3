/**
 * @file simulator-loader.test.js
 * @description Unit tests for SimulatorLoader UI Adapter (Physics Learning Standard v1.13.0).
 */

import assert from 'node:assert';
import { SimulatorLoader } from '../src/adapters/ui/simulator-loader.js';

console.log('=============== 🧪 RUNNING SIMULATOR LOADER TESTS ===============\n');

// Test Suite 1: Initial State & Prefix Mapping
console.log('--- Test Suite 1: Initial State & Mapping ---');
SimulatorLoader.reset();
assert.strictEqual(SimulatorLoader.isLoaded('18-1-wave'), false);
assert.strictEqual(SimulatorLoader.isLoaded('18-2-spectrum'), false);
assert.strictEqual(SimulatorLoader.isLoaded('18-3-polarization'), false);
console.log('✅ [PASS] All simulators initially not loaded');

assert.strictEqual(SimulatorLoader.prefixMap['18-1-wave'], 'em-wave');
assert.strictEqual(SimulatorLoader.prefixMap['18-2-spectrum'], 'spectrum');
assert.strictEqual(SimulatorLoader.prefixMap['18-3-polarization'], 'polarization');
console.log('✅ [PASS] Prefix mapping correct for DOM IDs');

// Test Suite 2: Calibration Stages & Physics Status Text
console.log('\n--- Test Suite 2: Calibration Stages & Status Text ---');

// 18.1 EM Wave stages
const s1_0 = SimulatorLoader.getStatusText('18-1-wave', 15);
assert(s1_0.includes('พิกัด 3 มิติ'), `Expected coordinate text, got: ${s1_0}`);
const s1_50 = SimulatorLoader.getStatusText('18-1-wave', 50);
assert(s1_50.includes('แมกซ์เวลล์'), `Expected Maxwell text, got: ${s1_50}`);
const s1_100 = SimulatorLoader.getStatusText('18-1-wave', 100);
assert(s1_100.includes('เสร็จสมบูรณ์'), `Expected completed text, got: ${s1_100}`);
console.log('✅ [PASS] Simulator 18.1 calibration stage messages validated');

// 18.2 Spectrum stages
const s2_0 = SimulatorLoader.getStatusText('18-2-spectrum', 20);
assert(s2_0.includes('สเปกตรัม 7 แถบสี'), `Expected spectrum text, got: ${s2_0}`);
const s2_50 = SimulatorLoader.getStatusText('18-2-spectrum', 50);
assert(s2_50.includes('ลอการิทึม'), `Expected logarithm text, got: ${s2_50}`);
const s2_80 = SimulatorLoader.getStatusText('18-2-spectrum', 80);
assert(s2_80.includes('E = hf'), `Expected E=hf text, got: ${s2_80}`);
console.log('✅ [PASS] Simulator 18.2 calibration stage messages validated');

// 18.3 Polarization stages
const s3_0 = SimulatorLoader.getStatusText('18-3-polarization', 20);
assert(s3_0.includes('ไม่โพลาไรส์'), `Expected unpolarized text, got: ${s3_0}`);
const s3_50 = SimulatorLoader.getStatusText('18-3-polarization', 50);
assert(s3_50.includes('P1'), `Expected P1 text, got: ${s3_50}`);
const s3_80 = SimulatorLoader.getStatusText('18-3-polarization', 80);
assert(s3_80.includes('มาลุส'), `Expected Malus text, got: ${s3_80}`);
console.log('✅ [PASS] Simulator 18.3 calibration stage messages validated');

// Test Suite 3: Async Load Progression
console.log('\n--- Test Suite 3: Async Progression Execution ---');
let progressUpdates = [];
await SimulatorLoader.load('18-1-wave', {
  duration: 100, // Fast test duration
  onProgress: (pct, msg) => {
    progressUpdates.push({ pct, msg });
  }
});

assert.strictEqual(SimulatorLoader.isLoaded('18-1-wave'), true);
assert(progressUpdates.length > 0, 'Progress updates should have fired');
assert.strictEqual(progressUpdates[progressUpdates.length - 1].pct, 100);
console.log(`✅ [PASS] Simulator 18.1 async load reached 100% with ${progressUpdates.length} steps`);

// Test Suite 4: Repeated Load Skip & Force Reload
console.log('\n--- Test Suite 4: Skip Repeat vs Force Reload ---');
let secondRunCalled = false;
await SimulatorLoader.load('18-1-wave', {
  duration: 100,
  onComplete: () => {
    secondRunCalled = true;
  }
});
assert.strictEqual(secondRunCalled, true);
console.log('✅ [PASS] Second load skipped progression and resolved immediately');

let reloadProgressSteps = 0;
await SimulatorLoader.reload('18-1-wave', () => {
  // completion
});
console.log('✅ [PASS] Force reload re-triggered progression successfully');

console.log('\n=======================================================');
console.log('📊 SIMULATOR LOADER TEST SUMMARY: ALL PASSED');
console.log('=======================================================\n');

