# Version

> Version information for the Physics Learning Standard.

Current version: `1.6.0`

Status: Active standard baseline

Effective date: 2026-08-01

---

# Purpose

This document identifies the current approved version of the Physics Learning Standard.

Repositories in the Physics Learning Ecosystem should reference this version when aligning their structure, documentation, architecture, and development practices.

---

# Versioning Scheme

This repository follows Semantic Versioning.

```text
MAJOR.MINOR.PATCH
```

## MAJOR

Increment the MAJOR version when a standard change breaks existing repository expectations.

Examples:

- Changing the required architecture model.
- Replacing the standard source folder layout.
- Renaming required standard documents.
- Removing a required rule that repositories already depend on.

## MINOR

Increment the MINOR version when adding new standards or significant new guidance without breaking existing repositories.

Examples:

- Adding a new standard document.
- Adding a new repository profile.
- Adding new recommended validation requirements.
- Extending an existing standard with compatible guidance.

## PATCH

Increment the PATCH version for clarifications, corrections, formatting fixes, and documentation improvements that do not change expectations.

Examples:

- Correcting broken document references.
- Clarifying existing wording.
- Fixing diagrams or examples.
- Updating templates without changing required behavior.

---

# Release Requirements

Before updating the version, maintainers should verify that:

- The reason for the change is documented.
- Affected standard documents are updated.
- `CHANGELOG.md` records the change.
- Significant architectural or cross-repository decisions are recorded in `adr/`.
- README and related references remain accurate.
- The change preserves the principles defined in `Principles.md`.

---

# Compatibility

Repositories should document which version of `physics-learning-standard` they follow.

If a repository cannot follow the current standard version, it should document:

- The standard version it follows.
- Which rules are not applicable.
- The reason for each exception.

---

# Current Baseline

Version `1.0.0` establishes the initial standard baseline for:

- Engineering principles
- Domain-Centric Architecture
- Repository and source folder structure
- Coding standards
- Naming conventions
- Canvas guidelines
- UI guidelines
- Formula display guidelines
- Accessibility guidelines
- AI agent rules
- README template
- Decision record process
- Repository license scope

Version `1.1.0` adds profile-based compliance governance for:

- Repository profile selection
- Universal compliance checks
- Profile-specific compliance checks
- Compliance result labels
- Evidence reporting for compliance reviews

Version `1.2.0` adds architecture enforcement guidance for:

- Dependency direction rules
- Layer responsibility rules
- Forbidden Physics Domain dependencies
- Adapter boundary rules
- Simple repository architecture exceptions
- Architecture review checklist

Version `1.3.0` adds physics domain standards for:

- Scientific correctness
- SI units and notation
- Formula and symbol consistency
- Constants and approximation documentation
- Simulation model documentation
- Numerical tolerance
- Dynamic question validation
- Randomness and input constraints

Version `1.4.0` adds validation workflow and automation for:

- Standard repository validation
- Lightweight automated consistency checks
- Validation reporting expectations
- ADR index checks
- Version and README template consistency checks
- Markdown code fence checks
- Obsolete reference checks
- Clear separation between automated checks and human review

Version `1.5.0` adds dynamic quiz system rules for:

- Roll-number based parameter generation
- Non-deterministic random base values
- Attempt-scoped determinism
- On-the-fly validation
- No static hardcoded production answers
- Safety constraints
- Answer tolerance and unit handling
- Worked solution generation
- Dynamic quiz architecture boundaries

Version `1.6.0` adds timed exam system rules for:

- Scored and timed exam metadata
- Exam start screen pattern
- Learner identity fields
- Timer and auto-submit behavior
- Refresh, tab-switch, focus-loss, and lock behavior
- Numerical answer display and tolerance expectations
- Scoring architecture boundaries
- Assessment session result data schema
