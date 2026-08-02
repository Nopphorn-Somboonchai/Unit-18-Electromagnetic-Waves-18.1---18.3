# Changelog

> History of approved changes to the Physics Learning Standard.

This changelog records changes that affect standards, templates, governance, or repository expectations across the Physics Learning Ecosystem.

---

# Unreleased

Changes planned or proposed for the next version should be listed here before release.

---

# 1.6.0 - 2026-08-02

Added timed exam system rules.

## Added

- `Timed-Exam-System-Rules.md` for scored and timed exam flow, start screens, identity fields, timer behavior, lock rules, scoring, and submitted result data.
- `schemas/assessment-session.schema.json` as the shared data contract for stored or exported exam sessions.
- ADR 0007 for the timed exam system rules decision.
- Timed exam checks in `Standard-Compliance-Checklist.md`.

## Changed

- Updated README documentation to include timed exam system rules.
- Updated README template to reference timed exam setup and assessment session data.
- Updated AI agent guidance to apply timed exam rules when editing scored assessments, exam start screens, lock behavior, or submitted exam data.
- Updated standard validation to require the timed exam standard, assessment schema, and ADR 0007.
- Updated version baseline from `1.5.0` to `1.6.0`.

## Governance

- Timed or scored exams should document metadata, start-screen rules, learner identity, timing, locking, scoring, and result data behavior before implementation.
- Timed exams that include dynamic or roll-number based questions must also follow `Dynamic-Quiz-System-Rules.md`.

---

# 1.5.0 - 2026-08-01

Added dynamic quiz system rules.

## Added

- `Dynamic-Quiz-System-Rules.md` for roll-number based dynamic quiz generation, on-the-fly validation, safety constraints, tolerance, and worked solution rules.
- ADR 0006 for the dynamic quiz system rules decision.
- Dynamic quiz checks in `Standard-Compliance-Checklist.md`.

## Changed

- Updated README documentation to include dynamic quiz system rules.
- Updated README template to reference dynamic quiz validation and a dedicated validation command section.
- Updated AI agent guidance to apply dynamic quiz rules when editing quizzes, randomized assessments, or roll-number based question systems.
- Updated version baseline from `1.4.0` to `1.5.0`.

## Governance

- Dynamic quizzes should document roll number use, random base ranges, constraints, tolerance, validation, and reproducibility behavior.
- Non-deterministic quiz generation must remain deterministic within a single quiz attempt.

---

# 1.4.0 - 2026-08-01

Added validation workflow and standard repository automation.

## Added

- `Validation-Workflow.md` for standard validation levels, reporting expectations, and human review guidance.
- `scripts/validate-standard.ps1` for lightweight validation of the standard repository.
- ADR 0005 for the validation workflow decision.
- Validation workflow references in README, contribution guidance, AI agent guidance, and the compliance checklist.

## Changed

- Updated README documentation to include validation workflow and the validation script.
- Updated README template to version `1.4.0`.
- Updated AI agent guidance to require validation reporting after standards changes.
- Updated version baseline from `1.3.0` to `1.4.0`.

## Governance

- Standard changes should now run or document validation before completion.
- Automation supports review but does not replace human review for physics correctness, accessibility, licensing, or repository-specific behavior.

---

# 1.3.0 - 2026-08-01

Added physics domain standards.

## Added

- `Physics-Standards.md` for scientific correctness, formula ownership, assumptions, constants, and dynamic question principles.
- `Units-and-Notation.md` for SI units, symbols, formula notation, constants notation, rounding, and bilingual terminology guidance.
- `Simulation-Standards.md` for simulation model documentation, numerical tolerance, randomness, input constraints, validation cases, and motion accessibility.
- ADR 0004 for the physics domain standards decision.
- Physics correctness, units, notation, and simulation validation checks in `Standard-Compliance-Checklist.md`.

## Changed

- Updated README documentation to include physics domain standards.
- Updated README template to reference physics standards, units, notation, and simulation validation.
- Updated AI agent guidance to require physics domain standards when editing physics content.
- Updated version baseline from `1.2.0` to `1.3.0`.

## Governance

- Physics correctness, unit consistency, and simulation validation are now part of profile-based compliance review.

---

# 1.2.0 - 2026-08-01

Added architecture enforcement rules.

## Added

- `Architecture-Enforcement.md` for enforceable dependency and responsibility boundaries.
- ADR 0003 for the architecture enforcement decision.
- Architecture enforcement checks in `Standard-Compliance-Checklist.md`.
- Simple repository exception rules for small browser-based learning applications.
- Forbidden dependency guidance for the Physics Domain.

## Changed

- Updated README documentation to include architecture enforcement.
- Updated README template to reference architecture enforcement in repository architecture rules.
- Updated AI agent guidance to require architecture enforcement checks during implementation and review.
- Updated version baseline from `1.1.0` to `1.2.0`.

## Governance

- Architecture enforcement is now part of compliance review, but automated enforcement is reserved for future tooling work.

---

# 1.1.0 - 2026-08-01

Added profile-based compliance governance.

## Added

- `Repository-Profiles.md` for selecting the appropriate repository profile.
- `Standard-Compliance-Checklist.md` for profile-based compliance checks.
- ADR 0002 for the repository profile and compliance checklist decision.
- Compliance result labels: `Compliant`, `Conditionally compliant`, `Not compliant`, and `Not assessed`.
- Checklist status values: `Pass`, `Partial`, `Fail`, and `Not applicable`.

## Changed

- Updated README documentation to include repository profiles and compliance checklist documents.
- Updated AI agent rules to require profile and compliance guidance when creating or reviewing repositories.
- Updated README template to include standard version and compliance status fields.

## Governance

- Version updated from `1.0.0` to `1.1.0` because this release adds compatible new standards without breaking existing repositories.

---

# 1.0.0 - 2026-08-01

Initial approved baseline of the Physics Learning Standard.

## Added

- Core engineering principles.
- Domain-Centric Architecture.
- Standard repository and source folder structure.
- JavaScript coding standards.
- Naming conventions.
- Canvas implementation guidelines.
- UI and UX guidelines.
- Formula display guidelines.
- Accessibility guidelines.
- AI agent collaboration rules.
- Official README template for ecosystem repositories.
- Contribution workflow.
- Decision record process.
- License scope for original standard materials.
- Versioning and changelog governance documents.
- ADR directory for significant decisions.

## Governance

- Established Semantic Versioning for standard changes.
- Established changelog tracking for approved standard updates.
- Established `adr/` as the location for individual decision records.

---

# Change Categories

Use these categories when updating this changelog:

- `Added` for new standards, templates, sections, or guidance.
- `Changed` for updates to existing standards.
- `Deprecated` for standards that should no longer be used.
- `Removed` for standards or rules that were deleted.
- `Fixed` for corrections that do not change intent.
- `Security` for security-related changes.
- `Governance` for versioning, decision, approval, or release-process updates.

---

# Changelog Rules

Every approved standard update should include:

- The version affected.
- The date of the change.
- A short description of what changed.
- A short explanation of why the change matters.
- Links or references to related ADRs when applicable.
