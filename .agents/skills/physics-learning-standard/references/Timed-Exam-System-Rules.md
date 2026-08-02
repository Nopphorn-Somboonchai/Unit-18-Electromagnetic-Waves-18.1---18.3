# Timed Exam System Rules

> Rules for scored and timed exam systems in the Physics Learning Ecosystem.

This document defines how scored exams, timed assessments, exam start screens,
learner identity fields, scoring, lock behavior, and submitted assessment data
should work.

---

# Purpose

Timed exam systems should support classroom score collection while preserving
physics correctness, fairness, accessibility, and reviewability.

The system may include fixed questions, dynamic questions, randomized
parameters, or roll-number based questions. Whatever the source of the question,
the displayed question, expected answer, score, and submitted result must remain
internally consistent for one exam attempt.

---

# Ownership Boundary

`physics-learning-standard` defines the rules, required fields, UI pattern, and
data contract for timed or scored exam systems.

Child repositories implement the actual exam UI, questions, scoring logic,
storage, visual theme, and deployment.

Shared UI implementations may live in a separate shared UI repository when
multiple child repositories need the same components.

Lesson-specific questions, answer keys, and production exam screens should not
be placed inside `physics-learning-standard`.

---

# Relationship to Dynamic Quiz Rules

Use this document when an activity is a scored exam, timed assessment, or
classroom score collection flow.

Use `Dynamic-Quiz-System-Rules.md` when questions are randomized, generated from
student roll number `R`, or validated on-the-fly from generated parameters.

When a timed exam includes dynamic questions, both standards apply:

- `Timed-Exam-System-Rules.md` governs exam flow, start screen, identity,
  timing, locking, scoring, and submitted results.
- `Dynamic-Quiz-System-Rules.md` governs generated parameters, attempt-scoped
  determinism, answer calculation, tolerance, and worked solutions.

This document must not weaken the Domain-Centric Architecture or permit UI code
to become the source of physics truth.

---

# Required Exam Metadata

Every timed or scored exam must document:

| Field | Requirement |
| :--- | :--- |
| Exam title | Human-readable title shown before the exam starts |
| Grade or learner group | Target learners, such as Grade 12 or M.6 |
| Unit or chapter | Course unit, chapter, or topic |
| Main topic | Main physics concept covered |
| Content scope | Concepts, formulas, and applications included |
| Number of questions | Total number of questions |
| Points per question | Score value per question, or a scoring table if mixed |
| Total score | Maximum score |
| Time limit | Time allowed in minutes, or `Not applicable` |
| Numerical answer rule | Decimal places, tolerance, and units if applicable |
| Lock or auto-submit rule | Conditions that lock or submit the exam |
| Result storage | Where answers and scores are stored or exported |

The metadata shown to learners must match the implemented exam behavior.

---

# Required Start Screen

A timed or scored exam must show a start screen before the first question.

The learner must explicitly start the exam. Loading the page alone must not start
the timer unless the repository documents a controlled classroom reason.

The start screen should use this top-to-bottom order:

1. Assessment icon or subject marker.
2. Exam title.
3. Unit, chapter, or topic subtitle.
4. Rules warning panel.
5. Learner identity form.
6. Back or cancel action.
7. Primary start action.

The warning panel must appear before the learner identity form and before the
start action.

The start screen must include:

- Exam title.
- Unit, chapter, or topic subtitle.
- Warning or rules section visible before the learner starts.
- Number of questions.
- Points per question and total score.
- Content scope.
- Time limit.
- Numerical answer formatting rule when the exam accepts calculated answers.
- Refresh, tab-switch, timeout, lock, or auto-submit rule when implemented.
- Learner identity fields.
- Clear back or cancel action.
- Clear start action.

---

# Reference Start Screen Pattern

The following pattern is based on the provided Thai physics scored exam UI. Use
repository-specific values instead of copying these lesson details unless the
child repository is for the same topic.

```text
Exam title:
ทดสอบเก็บคะแนน ม.6

Subtitle:
บทที่ 17.4 พลศาสตร์ของของไหล (Fluid Dynamics)

Rules title:
กติกาการสอบ (อ่านก่อนเริ่ม):

Rules:
- มีข้อสอบทั้งหมด 5 ข้อ ข้อละ 2 คะแนน (คะแนนเต็ม 10 คะแนน)
- ขอบเขตเนื้อหา: ของไหลอุดมคติ, อัตราการไหล, สมการความต่อเนื่อง, สมการเบร์นูลลี, กฎของตอร์ริเชลลี และการประยุกต์ใช้
- มีระยะเวลาจำกัดในการทำข้อสอบ 15 นาที
- การตอบคำถามประเภทคำนวณตัวเลข ให้ป้อนคำตอบเป็นทศนิยมไม่เกิน 2 ตำแหน่ง
- ห้ามรีเฟรชหน้าจอหรือสลับแท็บ มิฉะนั้นจะถูกล็อคส่งคำตอบอัตโนมัติ
```

Recommended Thai classroom fields:

| Field | Label | Placeholder or control |
| :--- | :--- | :--- |
| Full name | `ชื่อ-นามสกุลผู้สอบ:` | `ระบุชื่อจริง นามสกุล` |
| Class or room | `ชั้น ม.6 / ห้อง:` | Select classroom or room |
| Student number | `เลขที่ (เลขตั้งค่าโจทย์):` | `ระบุเลขที่ 1-40` |

The exact grade label should match the child repository. For example, Grade 10
repositories should not keep `ม.6` unless that is the target learner group.

---

# Visual Requirements

The reference design uses a centered white exam panel, a compact subject icon, a
strong title, a muted topic subtitle, a red warning panel, and a clear primary
start button.

Implementations should preserve these functional visual priorities:

- The title is the strongest text on the screen.
- The subtitle is visible but secondary.
- The warning panel uses a distinct danger or warning style.
- The warning panel has enough contrast for comfortable reading.
- Inputs are full-width or arranged in a responsive grid.
- The primary start action is visually stronger than the back action.
- Buttons have stable dimensions and do not shift layout on hover or loading.

Decorative elements must not make the warning panel, labels, or actions harder
to read.

---

# Learner Identity Fields

Timed or scored exams should collect the following fields before starting:

| Field | Requirement |
| :--- | :--- |
| Full name | Required unless the system already authenticates the learner |
| Grade or class | Required for classroom assessments |
| Room or section | Required when used by the teacher |
| Student number | Required when used for seating, grouping, or generated values |

Repositories may add school ID, email, or authenticated user ID when
appropriate.

Identity fields must be validated before the exam starts. Validation errors
should be respectful, specific, and placed near the relevant field.

Student number should not be treated as the learner's full identity. When a
question system uses roll number `R`, apply `Dynamic-Quiz-System-Rules.md`.

---

# Timing Rules

If an exam has a time limit:

- The timer starts only after the learner selects the start action.
- The remaining time is visible during the exam.
- Timeout behavior is deterministic and documented.
- The exam should auto-submit when time expires.
- Submitted timestamps should be recorded.

The displayed duration must match the configured duration used by the scoring or
submission logic.

---

# Locking and Integrity Rules

Repositories may implement integrity controls such as refresh detection,
tab-switch detection, focus-loss warnings, or auto-submit.

When implemented:

- The start screen must state the rule before the learner starts.
- The logic must be deterministic.
- The reason for lock or auto-submit should be recorded.
- The rule should avoid punishing accessibility tools or normal browser behavior
  unless the teacher has explicitly chosen strict exam mode.

Strict controls are appropriate for classroom score collection. They may be
unnecessary for practice mode.

---

# Numerical Answers

For calculation questions:

- Accepted units must be documented when units are required.
- Decimal-place rules must be visible before or during the question.
- Tolerance must be documented in code or data.
- Scoring must compare normalized numeric values, not raw display strings.
- Questions should calculate expected answers from formulas when practical.

Example learner-facing rule:

```text
Enter numerical answers as decimal values with no more than 2 decimal places.
```

---

# Scoring Rules

Scoring logic must be independent from UI rendering.

The scoring domain or domain-safe assessment module should receive:

- Exam configuration.
- Question definitions.
- Learner answers.
- Timing state when relevant.

The scoring domain or domain-safe assessment module should return:

- Per-question correctness or score.
- Total score.
- Maximum score.
- Submission status.
- Feedback state when applicable.

UI code must display scoring results and must not be the source of scoring
truth.

---

# Result Data Contract

Stored or exported exam session data should follow
`schemas/assessment-session.schema.json`.

At minimum, a submitted result should include:

- Exam ID.
- Exam title.
- Learner identity.
- Start timestamp.
- Submit timestamp.
- Time limit.
- Answers.
- Score.
- Maximum score.
- Submission status.
- Lock or auto-submit reason when applicable.

Do not store unnecessary sensitive data.

---

# Accessibility Requirements

Timed or scored exam screens must preserve the accessibility expectations in
`Accessibility.md` and `UI-Guidelines.md`.

Before release, verify that:

- Warning text is visible before starting.
- Form fields expose accessible labels.
- The start button is disabled until required fields are valid.
- Keyboard navigation reaches every field and action.
- Focus states are visible.
- Validation messages are placed near invalid fields.
- Time warnings are understandable without relying on color alone.
- The layout has no overlapping text or controls on supported screen sizes.

---

# Review Checklist

Use this checklist when reviewing a timed or scored exam system.

| Check | Question |
| :--- | :--- |
| Metadata | Does documented metadata match the implemented exam behavior? |
| Start screen | Does the exam show title, topic, rules, identity fields, and actions before starting? |
| Explicit start | Does the timer start only after the learner selects the start action? |
| Identity validation | Are required learner fields validated before starting? |
| Timing | Is the time limit displayed and enforced consistently? |
| Lock behavior | Are refresh, tab-switch, timeout, or auto-submit rules documented and deterministic? |
| Numerical answers | Are decimal, unit, and tolerance rules documented and enforced consistently? |
| Scoring | Is scoring independent from UI rendering? |
| Dynamic questions | Do generated questions also follow `Dynamic-Quiz-System-Rules.md`? |
| Result data | Does stored or exported data follow `schemas/assessment-session.schema.json` when applicable? |
| Accessibility | Can the start screen and exam flow be used with keyboard controls and readable warning text? |

---

# Relationship to Other Standards

Use this document together with:

- `Dynamic-Quiz-System-Rules.md`
- `Physics-Standards.md`
- `Units-and-Notation.md`
- `Simulation-Standards.md`
- `Architecture-Enforcement.md`
- `Standard-Compliance-Checklist.md`
- `README-Template.md`
- `Validation-Workflow.md`
- `UI-Guidelines.md`
- `Accessibility.md`
- `AI-Agent-Rules.md`
