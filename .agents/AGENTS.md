# 🎨 Project Web Design Standard

> **Mandatory Rule for this Workspace / Repository**

- **Design System Adherence**: All web application pages, HTML files, CSS stylesheets, and UI components created or updated within this workspace must strictly conform to the design tokens and component standards defined in [`.agents/DESIGN.md`](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/DESIGN.md).
- **Core Aesthetic Specifications**:
  - **Canvas & Surface**: Base page on tinted cream canvas (`#faf9f5`), feature cards (`#efe9de`), and dark navy product surfaces (`#181715`).
  - **Primary Accent**: Warm coral (`#cc785c`), pressed/active state (`#a9583e`).
  - **Typography**: Display headlines must use slab-serif (`Copernicus` / `Tiempos Headline` / `Cormorant Garamond` fallback) with negative letter-spacing. Running body text uses humanist sans (`StyreneB` / `Inter` fallback). Monospace code blocks use `JetBrains Mono`.
  - **Border Radius**: 8px (`rounded.md`) for buttons & inputs, 12px (`rounded.lg`) for content cards, 9999px for pills/badges.
  - **Spacing & Rhythm**: Section vertical padding at 96px, internal card padding at 32px. Alternating surface contrast between cream canvas, cream cards, dark navy mockups, and coral callout bands.
  - **Interactive Controls & Physics UI**: Sliders and dynamic controls must feature immediate value badge updates with physical units. High-DPI Canvas rendering for wave vectors (Electric Field $E$ in warm coral `#cc785c`, Magnetic Field $B$ in accent teal `#5db8a6`).

---

# ⚛️ Physics Learning Standard (v1.5.0)

> **Mandatory Architecture & Engineering Guidelines for this Physics Repository**

This workspace adheres to the **Physics Learning Standard (v1.5.0)** defined in [`.agents/skills/physics-learning-standard/SKILL.md`](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/SKILL.md).

## 🏛️ Core Principles & Architecture
1. **Domain First**: Physics models & scientific logic (`src/physics/`) must remain pure and free from DOM, Canvas, or UI framework dependencies.
2. **Layered Separation of Concerns**:
   - `src/physics/`: Pure calculations & formula models ($c = f\lambda$, $I = I_0 \cos^2\theta$, $E = hf$).
   - `src/application/`: Simulator orchestrators & quiz/exam logic.
   - `src/adapters/`: Canvas 2D rendering (`canvas/`), KaTeX rendering (`formula/`), LocalStorage persistence (`storage/`), UI controls (`ui/`).
   - `src/shared/`: Physics constants & app configurations.
   - `src/utils/`: RNG, number formatters, validators.
3. **Inward Dependency Rule**: `UI / Adapters -> Application -> Physics Domain`.
4. **Pedagogical Clarity & Accuracy**: Educational value, scientific determinism, explicit SI units, and accessible LaTeX rendering take top priority.

## 📚 Standard References
Detailed standard guidelines are available in `.agents/skills/physics-learning-standard/references/`:
- [Principles](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Principles.md)
- [Architecture](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Architecture.md)
- [Physics-Standards](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Physics-Standards.md)
- [Simulation-Standards](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Simulation-Standards.md)
- [Dynamic-Quiz-System-Rules](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Dynamic-Quiz-System-Rules.md)
- [Timed-Exam-System-Rules](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Timed-Exam-System-Rules.md)
- [Units-and-Notation](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/Units-and-Notation.md)

- [AI-Agent-Rules](file:///h:/05-Physics/Unit%2018/Unit-18-Electromagnetic-Waves-18.1---18.3/.agents/skills/physics-learning-standard/references/AI-Agent-Rules.md)


