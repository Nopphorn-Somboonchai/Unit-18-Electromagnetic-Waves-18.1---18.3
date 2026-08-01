# Repository Profiles

> Standard repository profiles for the Physics Learning Ecosystem.

This document defines the standard repository profiles used to decide which standards, folders, documentation sections, and validation checks apply to a repository.

---

# Purpose

Not every repository in the Physics Learning Ecosystem has the same purpose.

A learning unit, an interactive simulation, a shared library, a physics engine, a documentation repository, and a utility package should not be judged by exactly the same checklist.

Repository profiles make compliance clearer by defining what each repository type is expected to contain.

---

# Profile Rule

Every repository SHOULD declare one primary repository profile in its README.

The profile should be selected from the standard profile list.

```text
learning-unit
interactive-simulation
shared-library
physics-engine
documentation-only
utility-package
```

A repository MAY include features from another profile, but it should still have one primary profile.

Example:

```text
Primary profile: learning-unit
Secondary capability: interactive simulation
```

---

# Common Requirements

All repositories, regardless of profile, SHOULD include:

- A clear `README.md`.
- A declared repository profile.
- A reference to `physics-learning-standard`.
- A license or a clearly documented license decision.
- Documentation that matches the actual repository.
- Clear ownership or maintainer information.
- Any applicable accessibility considerations.
- Any applicable AI agent notes.

Fields or sections that do not apply SHOULD be marked as `Not applicable` rather than invented.

---

# Profile Summary

| Profile | Primary Purpose | Typical Example |
| :--- | :--- | :--- |
| `learning-unit` | A complete learning unit or lesson repository | Unit 18 learning module |
| `interactive-simulation` | A focused simulation or virtual lab | Electric field simulator |
| `shared-library` | Reusable code or components used by multiple repositories | Formula rendering helpers |
| `physics-engine` | Core physics calculations, models, or simulation rules | Mechanics calculation engine |
| `documentation-only` | Documentation, standards, curriculum notes, or guides | Physics learning standard |
| `utility-package` | Development tools, scripts, generators, or automation | README generator |

---

# learning-unit

Use this profile when the repository provides a complete learning unit or lesson experience.

Typical responsibilities:

- Explain a physics topic.
- Define learning objectives.
- Present formulas and variables.
- Provide simulations, practice, assessment, or learning feedback when applicable.
- Connect learning content to a course, grade level, unit, or topic when applicable.

Expected documentation:

- Project identity.
- Learning context.
- Learning objectives.
- Physics scope.
- Learning features.
- Usage instructions.
- Validation checklist.
- Accessibility notes.
- References.

Expected validation focus:

- Physics correctness.
- Unit consistency.
- Notation consistency.
- Documented assumptions and limitations.
- Formula display clarity.
- Learning objective alignment.
- Practice or quiz correctness.
- Dynamic quiz behavior follows `Dynamic-Quiz-System-Rules.md` when randomized or roll-number based quizzes exist.
- Numerical tolerance when applicable.
- Accessibility and readability.

Not every `learning-unit` repository needs complex source structure, but it must clearly document how it is organized.

---

# interactive-simulation

Use this profile when the repository focuses primarily on a simulation, visualization, or virtual lab.

Typical responsibilities:

- Model a physics situation.
- Provide interactive controls.
- Render visual output through Canvas, SVG, DOM, or another adapter.
- Explain what the simulation represents and what assumptions it uses.

Expected documentation:

- Simulation purpose.
- Physics model.
- Assumptions and limitations.
- Variables and units.
- User controls.
- Expected behavior.
- Accessibility and motion considerations.

Expected validation focus:

- Simulation behavior matches the documented model.
- Simulation follows `Simulation-Standards.md`.
- Physics calculations remain separate from rendering.
- Dependencies follow `Architecture-Enforcement.md`.
- Inputs stay within reasonable physical ranges.
- Dynamic quiz behavior follows `Dynamic-Quiz-System-Rules.md` when randomized quiz questions are included.
- Animation supports learning and does not distract unnecessarily.
- The simulation is usable on supported screen sizes.

---

# shared-library

Use this profile when the repository provides reusable code or components for other repositories.

Typical responsibilities:

- Provide reusable modules.
- Define clear public APIs.
- Avoid repository-specific learning flows.
- Support multiple repositories consistently.

Expected documentation:

- Library purpose.
- Public API overview.
- Installation or usage instructions.
- Examples.
- Compatibility notes.
- Testing expectations.

Expected validation focus:

- API stability.
- Reusable behavior.
- Unit tests.
- Clear naming.
- Low coupling.
- No unnecessary dependency on UI, Canvas, or browser APIs unless the library is specifically for those adapters.

---

# physics-engine

Use this profile when the repository contains core physics calculations, models, constants, or simulation rules.

Typical responsibilities:

- Implement physics formulas.
- Provide deterministic calculations.
- Define constants, units, and tolerances.
- Support simulations or learning units without depending on their UI.

Expected documentation:

- Physics model.
- Supported formulas.
- Constants and units.
- Numerical assumptions.
- Tolerance rules.
- API or module usage.

Expected validation focus:

- Scientific correctness.
- Deterministic tests.
- Edge cases.
- Unit consistency.
- Constants and notation follow `Units-and-Notation.md`.
- Numerical tolerance follows `Simulation-Standards.md` when approximate results are produced.
- No dependency on UI, Canvas, DOM, browser storage, or rendering frameworks.

This profile has the strictest architecture boundary expectations.

Use `Architecture-Enforcement.md` when reviewing imports, dependencies, and forbidden technology usage in physics-engine repositories.

---

# documentation-only

Use this profile when the repository contains documentation, standards, curriculum notes, or guides without production application code.

Typical responsibilities:

- Explain standards, decisions, or learning guidance.
- Provide templates or documentation conventions.
- Preserve rationale and references.

Expected documentation:

- Clear purpose.
- Scope.
- Table or index of documents.
- Governance or update process when applicable.
- License scope.
- References.

Expected validation focus:

- Documentation accuracy.
- Internal link correctness.
- No empty required documents.
- Clear ownership.
- Clear distinction between original materials and third-party materials.
- Validation workflow is documented when the repository defines standards or governance.

This `physics-learning-standard` repository uses the `documentation-only` profile.

---

# utility-package

Use this profile when the repository provides tools, scripts, generators, validators, or automation for the ecosystem.

Typical responsibilities:

- Automate development tasks.
- Generate files or templates.
- Validate repository structure.
- Support local or CI workflows.

Expected documentation:

- Tool purpose.
- Inputs and outputs.
- Usage examples.
- Required environment.
- Safety notes.
- Validation behavior.

Expected validation focus:

- Predictable command behavior.
- Clear error messages.
- No destructive behavior without explicit confirmation.
- Validation behavior is documented when the tool checks repository quality.
- Tests for important logic.
- Documentation matching actual commands.

---

# Not Applicable Rules

Use `Not applicable` when a checklist item does not apply to the selected repository profile.

Do not invent course, unit, grade, source code, tests, simulations, or build commands just to fill a template field.

If an item is marked `Not applicable`, include a short reason when the reason is not obvious.

Example:

```text
Timed Exam System: Not applicable. This repository is a shared formula library and does not include learner assessment.
```

---

# Relationship to Other Standards

Use this document together with:

- `README-Template.md`
- `Physics-Standards.md`
- `Units-and-Notation.md`
- `Simulation-Standards.md`
- `Dynamic-Quiz-System-Rules.md`
- `Validation-Workflow.md`
- `Architecture-Enforcement.md`
- `Standard-Compliance-Checklist.md`
- `Folder-Structure.md`
- `Architecture.md`
- `AI-Agent-Rules.md`

Profiles explain which expectations apply.

The compliance checklist explains how to verify them.
