# 📡 Implementation Plan: Unit 18 — คลื่นแม่เหล็กไฟฟ้า (18.1 - 18.3)

## บริบทและเป้าหมาย

สร้าง **Interactive Physics Learning Portal** สำหรับบทที่ 18 คลื่นแม่เหล็กไฟฟ้า (18.1 - 18.3) ประกอบด้วย 3 Simulator, ระบบฝึกโจทย์สุ่ม (Roll-Number RNG) และระบบสอบจับเวลา 15 นาที โดยยึดมาตรฐานจาก **2 แหล่งอ้างอิงเท่านั้น**:

| บทบาท | แหล่งอ้างอิง | หน้าที่ |
| :--- | :--- | :--- |
| **สกิลหลัก** | [physics-learning-standard](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/README.md) | กำหนดสถาปัตยกรรม, โครงสร้างโฟลเดอร์, Coding Standards, Naming Conventions, Canvas/UI/Formula/Accessibility Guidelines |
| **สกิลรอง** | [README.md (Unit 18)](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md) | กำหนดเนื้อหาฟิสิกส์ 18.1-18.3, สมการ, Simulator Spec, Quiz/Exam Rules, Tech Stack |

---

## User Review Required

> [!IMPORTANT]
> **เลือก CSS Framework**: ใน [README.md](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md) ระบุใช้ทั้ง Tailwind CSS (`input.css`) และ Vanilla CSS (`style.css`) — แต่ [physics-learning-standard](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Coding-Standards.md) ไม่ได้กำหนดว่าต้องใช้ framework ใด คุณต้องการใช้ **Tailwind CSS** (ตาม README เดิม) หรือ **Vanilla CSS** (ตามแนวทาง web_application_development) สำหรับ Implementation นี้?

> [!IMPORTANT]
> **KaTeX Loading Strategy**: README ระบุใช้ KaTeX ผ่าน CDN ต้องการให้ดาวน์โหลด KaTeX เป็น local dependency แทน (ใช้ได้ offline เต็มรูปแบบ) หรือคงใช้ CDN ตาม README?

> [!IMPORTANT]
> **ขอบเขตการ implement**: คุณต้องการให้ implement ทั้งหมดจนจบ (ทุกเฟส) ภายใน Chat นี้ หรือต้องการให้ implement ทีละเฟสแล้ว Review ก่อนไปเฟสถัดไป?

---

## Open Questions

> [!NOTE]
> **Reference Implementation จาก Unit 17**: พบว่ามี repo [Unit-17-Fluid-Dynamics](file:///c:/Users/Lenovo/Desktop/Unit17/Unit-17-Fluid-Dynamics) ที่อาจมีตัวอย่าง code จริง — ต้องการให้ใช้เป็น code reference เสริมหรือไม่? (ยึดเฉพาะ physics-learning-standard + README.md ตามที่คุณระบุ)

---

## สถาปัตยกรรมระบบ (Architecture Mapping)

การ map ระหว่าง [Architecture.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Architecture.md) ↔ [README.md](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md):

```text
physics-learning-standard            Unit 18 README.md
─────────────────────────            ──────────────────
Physics Domain           ◄────►     engine/ + models/
Application Services     ◄────►     simulators/
Canvas Adapter           ◄────►     renderer/
Formula Adapter          ◄────►     utils/KatexHelper.js
UI Adapter               ◄────►     ui/
Infrastructure           ◄────►     utils/ + assets/
```

### Dependency Flow (ตาม [Architecture.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Architecture.md#L135-L155)):

```text
User Interface (ui/)
        │
        ▼
Adapters (renderer/, utils/KatexHelper.js)
        │
        ▼
Application Services (simulators/)
        │
        ▼
Physics Domain (engine/, models/)
```

> **Golden Rule**: Technology serves the Physics Domain. Physics Domain never depends on UI, Canvas, or browser APIs.

---

## โครงสร้างโฟลเดอร์ (ตาม [Folder-Structure.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Folder-Structure.md))

```text
Unit 18.1/
├── README.md                          # (existing) Domain Specification
├── PhysicsBook6.md                    # (existing) สสวท. Reference
├── index.html                         # [NEW] Entry point — Semantic HTML5
├── src/
│   ├── physics/                       # Physics Domain (= engine/ + models/ ใน README)
│   │   ├── em-wave-engine.js          # c = fλ solvers, vector cross product
│   │   ├── spectrum-solver.js         # ช่วงสเปกตรัม 7 ช่วง, E = hf
│   │   ├── polarization-solver.js     # กฎของมาลุส I = I₀cos²θ
│   │   ├── em-wave-model.js           # Data model: EM Wave properties
│   │   ├── spectrum-band-model.js     # Data model: 7 spectrum bands
│   │   └── polaroid-model.js          # Data model: Polaroid sheet
│   ├── application/                   # Application Services (= simulators/)
│   │   ├── em-wave-simulator.js       # 18.1 Simulator orchestrator
│   │   ├── spectrum-simulator.js      # 18.2 Simulator orchestrator
│   │   ├── polarization-simulator.js  # 18.3 Simulator orchestrator
│   │   ├── quiz-manager.js            # Quiz/Practice system orchestrator
│   │   └── exam-manager.js            # Timed exam system orchestrator
│   ├── adapters/
│   │   ├── canvas/
│   │   │   ├── canvas-renderer.js     # Base canvas drawing utilities
│   │   │   ├── wave-field-plotter.js  # E & B vector field visualization
│   │   │   ├── spectrum-plotter.js    # Spectrum band color rendering
│   │   │   └── polaroid-plotter.js    # Polaroid light intensity visualization
│   │   ├── formula/
│   │   │   └── katex-adapter.js       # KaTeX wrapper for LaTeX rendering
│   │   ├── storage/
│   │   │   └── local-storage.js       # LocalStorage adapter for scores
│   │   └── ui/
│   │       ├── control-panel.js       # Slider, knob, input controls
│   │       ├── tab-navigator.js       # Tab switching (Review/Practice/Exam)
│   │       ├── quiz-ui.js             # Quiz/Practice UI rendering
│   │       └── exam-ui.js             # Exam UI, timer, dashboard
│   ├── shared/
│   │   ├── constants.js               # Physics constants (c, h, π)
│   │   └── config.js                  # App configuration, quiz limits
│   └── utils/
│       ├── random.js                  # Roll-Number RNG algorithm
│       ├── format.js                  # Number formatting, unit display
│       └── validation.js              # Input validation helpers
├── assets/
│   ├── styles/
│   │   ├── main.css                   # Primary CSS (design system + layout)
│   │   └── animations.css             # Wave & transition animations
│   └── icons/                         # Static icons if needed
├── tests/                             # Future: unit tests
└── docs/                              # Future: additional documentation
```

> **Naming**: ตาม [Naming-Conventions.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Naming-Conventions.md) — files ใช้ `kebab-case`, variables ใช้ `camelCase`, constants ใช้ `UPPER_SNAKE_CASE`, classes ใช้ `PascalCase`

---

## Proposed Changes — แบ่งเฟส 6 เฟส

---

### 🔵 Phase 1: Core Foundation & Repository Setup

**เป้าหมาย**: วางโครงสร้างโฟลเดอร์ + Entry Point + Design System CSS ตาม [Folder-Structure.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Folder-Structure.md) และ [UI-Guidelines.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/UI-Guidelines.md)

**Standards ที่ยึด**: Folder-Structure.md, Architecture.md, UI-Guidelines.md, Accessibility.md, Naming-Conventions.md

#### [NEW] [index.html](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/index.html)
- Semantic HTML5 structure
- SEO meta tags (title, description)
- Tab navigation structure: `📖 ทบทวนบทเรียน` | `🧠 ตะลุยโจทย์` | `⏱️ สอบเก็บคะแนน`
- Canvas elements สำหรับ 3 simulators
- CDN links: KaTeX, Lucide Icons, Google Fonts (Prompt, Sarabun)
- ES Module `<script type="module">` loading

#### [NEW] [assets/styles/main.css](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/assets/styles/main.css)
- CSS Custom Properties (Design Tokens): สี, ฟอนต์, spacing, border-radius
- Dark mode EM wave theme (deep navy/electric blue/cyan)
- Layout system: responsive grid/flex
- Component styles: buttons, cards, sliders, tabs, modals
- Typography scale based on Prompt + Sarabun fonts
- Accessibility: focus-visible, reduced-motion, contrast

#### [NEW] [assets/styles/animations.css](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/assets/styles/animations.css)
- Wave propagation keyframes
- Spectrum glow effects
- Polaroid rotation transitions
- Micro-animations for hover, active states

#### [NEW] [src/shared/constants.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/shared/constants.js)
- Physics constants: `SPEED_OF_LIGHT`, `PLANCK_CONSTANT`, `PI`
- Spectrum band boundaries (frequency/wavelength ranges)
- Application config constants

#### [NEW] [src/shared/config.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/shared/config.js)
- Quiz settings: จำนวนข้อ, เวลาสอบ 15 นาที, คะแนนเต็ม
- Canvas dimensions, animation frame rate
- Roll-number range: R ∈ [1, 40]

**Deliverable**: เปิด `index.html` แล้วเห็นหน้า Landing Page สวยงามพร้อม Tab Navigation ว่างเปล่า (ยังไม่มี logic)

---

### 🟢 Phase 2: Physics Domain — Engine & Models

**เป้าหมาย**: สร้าง Pure Functions สำหรับสมการฟิสิกส์ทั้งหมด **ปราศจาก DOM/Canvas dependency** ตาม [Architecture.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Architecture.md#L70-L83)

**Standards ที่ยึด**: Architecture.md (Physics Domain), Coding-Standards.md, Naming-Conventions.md, Formula-Display.md

#### [NEW] [src/physics/em-wave-model.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/em-wave-model.js)
- `createEMWave({ frequency, wavelength, phase })` — Factory function
- Data structure: `{ frequency, wavelength, speed, electricField, magneticField, direction }`
- ไม่ import อะไรจาก DOM/Canvas

#### [NEW] [src/physics/spectrum-band-model.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/spectrum-band-model.js)
- Array ของ 7 spectrum bands: Radio → Gamma
- แต่ละ band: `{ name, nameThai, frequencyMin, frequencyMax, wavelengthMin, wavelengthMax, color, applications, dangers }`
- Lookup functions: `findBandByFrequency(f)`, `findBandByWavelength(λ)`

#### [NEW] [src/physics/polaroid-model.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/polaroid-model.js)
- `createPolaroid({ transmissionAxisAngle })` — Factory function
- Data: `{ angle, transmissionAxis }`

#### [NEW] [src/physics/em-wave-engine.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/em-wave-engine.js)
- `calculateWavelength(frequency)` → `λ = c / f`
- `calculateFrequency(wavelength)` → `f = c / λ`
- `calculateSpeed(frequency, wavelength)` → `v = f × λ`
- `calculateVectorDirection(E, B)` → Cross product `E × B = v`
- `calculateAntennaLength(wavelength, type)` → `L = λ/2` หรือ `λ/4`
- Pure functions ทั้งหมด ไม่มี side-effect

#### [NEW] [src/physics/spectrum-solver.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/spectrum-solver.js)
- `calculatePhotonEnergy(frequency)` → `E = hf`
- `compareSpectrumBands(band1, band2)` → เปรียบเทียบ frequency/energy
- `getSpectrumInfo(frequency)` → return band + applications + color

#### [NEW] [src/physics/polarization-solver.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/physics/polarization-solver.js)
- `calculateMalusIntensity(I0, theta)` → `I = I₀ cos²θ`
- `calculateIntensityAfterPolarizer(I_unpolarized)` → `I₁ = I₀ / 2`
- `calculateIntensityThroughTwoPolaroids(I0, theta1, theta2)` → I₁ แล้ว I₂
- `findAngleForZeroIntensity()` → θ = 90°, 270°
- `findAngleForMaxIntensity()` → θ = 0°, 180°

**Deliverable**: สามารถ import physics functions มาเรียกใช้ได้โดยไม่ต้องมี browser — พร้อมสำหรับ Unit Testing

---

### 🟡 Phase 3: Interactive Simulators & Canvas Rendering

**เป้าหมาย**: สร้าง 3 Simulators พร้อม Canvas rendering ตาม [Canvas-Guidelines.md](file:///c:/Users/Lenovo/Desktop/physics-learning-standard/Canvas-Guidelines.md) และ Simulator Lifecycle ใน [README.md](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md#L180-L215)

**Standards ที่ยึด**: Canvas-Guidelines.md, Architecture.md (Adapters), UI-Guidelines.md

#### Canvas Adapters

##### [NEW] [src/adapters/canvas/canvas-renderer.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/canvas/canvas-renderer.js)
- Base class/module สำหรับ Canvas operations
- Reusable: `drawArrow()`, `drawAxis()`, `drawLabel()`, `drawGrid()`, `clearCanvas()`
- Coordinate system utilities, DPI-aware scaling
- **ไม่มี physics logic** (ตาม Canvas-Guidelines.md)

##### [NEW] [src/adapters/canvas/wave-field-plotter.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/canvas/wave-field-plotter.js)
- วาด sinusoidal E-field (สีแดง) และ B-field (สีน้ำเงิน) ในแนวตั้งฉากกัน
- แสดงทิศทาง v (สีเขียว) ตามกฎมือขวา
- Animation: คลื่นเคลื่อนที่ไปข้างหน้า + เฟส E, B ตรงกัน
- รับ state จาก em-wave-engine — **ไม่คำนวณเอง**

##### [NEW] [src/adapters/canvas/spectrum-plotter.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/canvas/spectrum-plotter.js)
- วาดแถบสเปกตรัม 7 สีต่อเนื่อง (Radio → Gamma)
- Highlight ช่วงที่ผู้ใช้เลือก + แสดง f, λ, E
- Interactive cursor บนแถบสเปกตรัม

##### [NEW] [src/adapters/canvas/polaroid-plotter.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/canvas/polaroid-plotter.js)
- วาดแผ่นโพลารอยด์ 2 แผ่น (Polarizer + Analyzer)
- แสดงลูกศรแสงไม่โพลาไรส์ → ผ่าน P1 → แสงโพลาไรส์ → ผ่าน P2 → ความเข้ม
- Visual: ความสว่างแปรผันตาม I = I₀cos²θ (สว่าง ↔ มืด)
- Rotation animation ของแผ่น Analyzer

#### Application Services (Simulator Orchestrators)

##### [NEW] [src/application/em-wave-simulator.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/application/em-wave-simulator.js)
- ตาม Simulator Lifecycle: Initialize → Load Parameters → Calculate → Update → Render → Wait
- เชื่อม UI controls (f slider) → em-wave-engine → wave-field-plotter
- State management: `{ frequency, wavelength, phase, isAnimating }`

##### [NEW] [src/application/spectrum-simulator.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/application/spectrum-simulator.js)
- เชื่อม UI slider (f/λ) → spectrum-solver → spectrum-plotter
- State: `{ selectedFrequency, currentBand, photonEnergy }`

##### [NEW] [src/application/polarization-simulator.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/application/polarization-simulator.js)
- เชื่อม UI angle knob (θ) → polarization-solver → polaroid-plotter
- State: `{ polarizerAngle, analyzerAngle, intensity, transmittedIntensity }`

#### UI Adapters

##### [NEW] [src/adapters/ui/control-panel.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/ui/control-panel.js)
- ผูก DOM sliders, buttons, angle knobs กับ simulator callbacks
- Real-time value display (ค่า f, λ, θ, I)
- Responsive controls

##### [NEW] [src/adapters/ui/tab-navigator.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/ui/tab-navigator.js)
- Tab switching: ทบทวนบทเรียน | ตะลุยโจทย์ | สอบเก็บคะแนน
- Lazy initialization ของแต่ละ simulator

#### Formula Adapter

##### [NEW] [src/adapters/formula/katex-adapter.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/formula/katex-adapter.js)
- `renderFormula(latexString, element)` — wrapper สำหรับ KaTeX
- Pre-defined formula templates สำหรับ c = fλ, I = I₀cos²θ, E = hf
- Error handling สำหรับกรณี KaTeX ยังโหลดไม่เสร็จ

**Deliverable**: เปิด `index.html` แล้วเห็น 3 Canvas simulators ทำงานได้จริง สามารถปรับ slider แล้วเห็นคลื่น/สเปกตรัม/แสงโพลาไรส์เปลี่ยนแปลงแบบ real-time

---

### 🟠 Phase 4: Practice & Quiz System

**เป้าหมาย**: สร้างระบบตะลุยโจทย์สุ่มตามเลขที่ + เฉลยละเอียดแบบ LaTeX ตาม [README.md §Quiz System Rules](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md#L261-L269)

**Standards ที่ยึด**: Coding-Standards.md, Formula-Display.md, UI-Guidelines.md (Learning Feedback)

#### [NEW] [src/utils/random.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/utils/random.js)
- `generateQuizParameters(rollNumber, questionType)` — RNG ตามเลขที่ R
- Safety constraints: ป้องกันค่าติดลบ / ผิดหลักฟิสิกส์
- Non-deterministic random ผสมกับ R

#### [NEW] [src/utils/format.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/utils/format.js)
- `formatScientific(number)` → "3.00 × 10⁸"
- `formatUnit(value, unit)` → "150 MHz"
- `formatAngle(degrees)` → "45°"

#### [NEW] [src/utils/validation.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/utils/validation.js)
- `validateNumericAnswer(userAnswer, correctAnswer, tolerance)`
- `validateRollNumber(R)` → R ∈ [1, 40]

#### [NEW] [src/application/quiz-manager.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/application/quiz-manager.js)
- โจทย์ 3 หมวด: 18.1 (c = fλ), 18.2 (สเปกตรัม/สายอากาศ), 18.3 (กฎของมาลุส)
- 2 โหมด: Fixed (ตามคู่มือ สสวท.) / Random (RNG ตาม R)
- On-the-fly validation: คำนวณเฉลยจาก R ของผู้สอบ
- สร้าง LaTeX step-by-step solution

#### [NEW] [src/adapters/ui/quiz-ui.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/ui/quiz-ui.js)
- ฟอร์มกรอกเลขที่ R
- เลือกหมวดข้อสอบ 18.1 / 18.2 / 18.3
- แสดงโจทย์ + ช่องกรอกคำตอบ
- ปุ่มตรวจคำตอบ → แสดงเฉลยละเอียดด้วย KaTeX
- Encouraging feedback (ตาม UI-Guidelines.md §Learning Feedback)

**Deliverable**: ระบบตะลุยโจทย์ทำงานได้จริง กรอกเลขที่ → เลือกหมวด → ทำโจทย์ → เห็นเฉลยสมการทีละขั้นตอน

---

### 🔴 Phase 5: Timed Exam & Dashboard

**เป้าหมาย**: สร้างระบบสอบจับเวลา 15 นาที 5 ข้อ (10 คะแนน) + Dashboard สรุปผล ตาม [README.md §Timed Exam](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/README.md#L249-L258)

**Standards ที่ยึด**: UI-Guidelines.md, Accessibility.md, Coding-Standards.md

#### [NEW] [src/application/exam-manager.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/application/exam-manager.js)
- State machine: `IDLE → STARTED → IN_PROGRESS → SUBMITTED → REVIEW`
- Timer: 15 นาทีถอยหลัง, auto-submit เมื่อหมดเวลา
- ข้อสอบผสม: 1 Choice (ทฤษฎี 18.1-18.3) + 4 Numeric (คำนวณ)
- Anti-cheat: `beforeunload` event guard
- Scoring: คำนวณคะแนนรวม, เวลาที่ใช้

#### [NEW] [src/adapters/ui/exam-ui.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/ui/exam-ui.js)
- Exam start screen: กรอกเลขที่ → เริ่มสอบ
- Question navigation: ข้อ 1-5 พร้อมสถานะ (ตอบแล้ว/ยังไม่ตอบ)
- Timer display แบบถอยหลัง (MM:SS) บนเมนูด้านบน
- Submit confirmation dialog
- Dashboard สรุปผล: คะแนนรวม, เวลาที่ใช้, ตารางรายข้อ, ปุ่มดูเฉลย

#### [NEW] [src/adapters/storage/local-storage.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/adapters/storage/local-storage.js)
- `saveExamResult(result)` → บันทึกลง LocalStorage
- `loadExamResult()` → อ่านผลสอบล่าสุด
- `clearExamResult()` → ล้างข้อมูล

**Deliverable**: ระบบสอบครบวงจร — กดเริ่มสอบ → ทำข้อสอบ → ส่ง → ดูคะแนน + เฉลย → บันทึกผล

---

### 🟣 Phase 6: Entry Point, Integration & QA

**เป้าหมาย**: เชื่อมโยงทุก Module เข้าด้วยกัน + ขัดเกลา UI + ตรวจสอบความถูกต้อง

**Standards ที่ยึด**: AI-Agent-Rules.md, Accessibility.md, ทุก Standard

#### [NEW] [src/main.js](file:///c:/Users/Lenovo/Desktop/Unit%2018/Unit%2018.1/src/main.js)
- Application Entry Point
- Import และ Initialize ทุก module
- Event wiring: เชื่อม DOM events → simulators, quiz, exam
- Error boundary: จัดการ error ที่ไม่คาดคิด

#### UI/UX Polish
- Responsive testing: mobile / tablet / desktop
- Accessibility audit: keyboard navigation, focus management, ARIA labels
- Animation smoothness: requestAnimationFrame optimization
- Font loading: Prompt + Sarabun fallback chain

#### Physics Accuracy Verification
- ตรวจสอบ c = fλ = 3 × 10⁸ m/s ทุก edge case
- ตรวจสอบ I = I₀cos²θ ที่ θ = 0°, 45°, 90°, 180°, 270°, 360°
- ตรวจสอบ E = hf คำนวณถูกต้องทุกช่วง spectrum
- ตรวจสอบ quiz answer validation tolerance

**Deliverable**: เว็บแอปพร้อมใช้งาน — เปิด `index.html` ใช้งานได้ครบทุกฟีเจอร์ สวยงาม ถูกต้อง

---

## สรุปโครงสร้างไฟล์ทั้งหมด (File Summary)

| เฟส | จำนวนไฟล์ใหม่ | ไฟล์หลัก |
| :---: | :---: | :--- |
| Phase 1 | 5 | `index.html`, `main.css`, `animations.css`, `constants.js`, `config.js` |
| Phase 2 | 6 | `em-wave-engine.js`, `spectrum-solver.js`, `polarization-solver.js`, + 3 models |
| Phase 3 | 10 | 4 canvas adapters, 3 simulator orchestrators, 2 UI adapters, 1 formula adapter |
| Phase 4 | 5 | `quiz-manager.js`, `quiz-ui.js`, `random.js`, `format.js`, `validation.js` |
| Phase 5 | 3 | `exam-manager.js`, `exam-ui.js`, `local-storage.js` |
| Phase 6 | 1 | `main.js` (+ polish existing files) |
| **รวม** | **~30 ไฟล์** | |

---

## Verification Plan

### Automated Tests
- ทดสอบ physics engine functions ด้วย manual console tests:
  ```js
  // c = fλ
  calculateWavelength(100e6) === 3  // 100 MHz → λ = 3 m
  
  // Malus Law
  calculateMalusIntensity(100, 0) === 100     // θ=0° → I=I₀
  calculateMalusIntensity(100, 90) === 0      // θ=90° → I=0
  calculateMalusIntensity(100, 45) === 50     // θ=45° → I=I₀/2
  
  // Photon energy
  calculatePhotonEnergy(5e14) ≈ 3.313e-19    // Visible light
  ```

### Manual Verification
1. **Simulator 18.1**: ปรับ slider ความถี่ → คลื่น E, B เปลี่ยนตามจริง, ทิศทาง v ตามกฎมือขวา
2. **Simulator 18.2**: คลิกแถบสเปกตรัม → ข้อมูลช่วงคลื่นถูกต้อง (f, λ, E, ชื่อ, การประยุกต์)
3. **Simulator 18.3**: หมุนมุม Analyzer → ความสว่างเปลี่ยนตาม cos²θ, มืดสนิทที่ 90°
4. **Quiz**: กรอก R=1~40 → โจทย์ตัวเลขเปลี่ยน → เฉลย LaTeX ถูกต้อง
5. **Exam**: จับเวลา 15 นาที → ส่งข้อสอบ → Dashboard คะแนนถูกต้อง → บันทึก LocalStorage
6. **Responsive**: ทดสอบบน Chrome, Edge, Firefox — Desktop + Mobile viewport
7. **Accessibility**: Tab navigation ทำงาน, focus visible, contrast ratio ผ่าน
