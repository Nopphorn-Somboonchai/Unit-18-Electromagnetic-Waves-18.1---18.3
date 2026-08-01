# AGENTS.md

> AI agent entry point for the Physics Learning Standard repository.

AI agents working in this repository MUST follow the standards defined here before making changes.

## Required Reading

Before modifying files, AI agents MUST read:

1. README.md
2. Principles.md
3. Architecture.md
4. Architecture-Enforcement.md
5. Folder-Structure.md
6. AI-Agent-Rules.md
7. VERSION.md
8. CHANGELOG.md
9. Repository-Profiles.md
10. Standard-Compliance-Checklist.md
11. Physics-Standards.md, when physics content is involved
12. Units-and-Notation.md, when formulas, variables, or units are involved
13. Simulation-Standards.md, when simulations, dynamic questions, or numerical validation are involved
14. Dynamic-Quiz-System-Rules.md, when dynamic quizzes, randomized assessments, or roll-number based questions are involved
15. Validation-Workflow.md, when completing or reviewing changes
16. The standard document related to the task

## Working Rules

AI agents MUST:

- Keep changes focused on the requested task.
- Preserve the Domain-Centric Architecture.
- Apply Architecture-Enforcement.md when reviewing code boundaries.
- Apply Physics-Standards.md when reviewing physics content.
- Apply Units-and-Notation.md when reviewing formulas, variables, units, or constants.
- Apply Simulation-Standards.md when reviewing simulations, dynamic questions, randomness, or numerical tolerance.
- Apply Dynamic-Quiz-System-Rules.md when reviewing dynamic quizzes, randomized assessments, roll-number based parameter generation, or on-the-fly answer validation.
- Avoid unrelated refactoring.
- Avoid changing established standards without documenting the reason.
- Update related documentation when a standard changes.
- Update CHANGELOG.md and VERSION.md when a change affects the approved standard version.
- Create or update ADRs in `adr/` for significant architectural or cross-repository decisions.
- Use repository profiles and the compliance checklist when creating or reviewing ecosystem repositories.
- Run `scripts/validate-standard.ps1` or document why it could not be run after changing this standard repository.
- Report validation performed before completion.

AI agents MUST NOT:

- Move physics logic into UI, Canvas, formula, or infrastructure layers.
- Introduce undocumented architecture changes.
- Leave referenced required files empty.
- Change repository direction without maintainer approval.

## Conflict Resolution

If standards appear to conflict, AI agents MUST apply them in this order:

1. Principles.md
2. Architecture.md
3. Folder-Structure.md
4. Domain-specific standards
5. Coding-Standards.md
6. Naming-Conventions.md
7. AI-Agent-Rules.md
8. AGENTS.md

Lower-level documents MUST NOT override higher-level standards.
