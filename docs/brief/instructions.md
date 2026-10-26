# Jolty project brief: Antigravity handoff

These files define the product brief for Jolty, an India-focused roadside assistance marketplace. They consolidate overlapping product, technical, architecture, flow, design, rules, phases, and progress notes into one source per subject.

## Where the files go

Place all seven brief files in this folder at the Jolty project root:

```text
docs/brief/
├── instructions.md
├── PRD.md
├── architecture.md
├── design.md
├── rules.md
├── phases.md
└── memory.md
```

From the project root, the full paths are `docs/brief/instructions.md`, `docs/brief/PRD.md`, `docs/brief/architecture.md`, `docs/brief/design.md`, `docs/brief/rules.md`, `docs/brief/phases.md`, and `docs/brief/memory.md`.

## Reading order

1. `docs/brief/PRD.md` — product purpose, users, scope, requirements, and success measures.
2. `docs/brief/design.md` — visual direction, page-level experience, responsive behavior, and accessibility.
3. `docs/brief/architecture.md` — user journeys, system boundaries, conceptual data model, and implementation-neutral technical guidance.
4. `docs/brief/rules.md` — cross-cutting product and engineering constraints.
5. `docs/brief/phases.md` — suggested build sequence and acceptance gates.
6. `docs/brief/memory.md` — confirmed decisions, assumptions, open questions, and progress tracking.

## How to use the briefs

- Treat confirmed decisions in these files as the current brief. If a detail is marked **Open**, ask the project owner or make it configurable; do not silently present a guess as a fact.
- Keep the product available for daytime bookings. The 2 AM breakdown is the central differentiator and a key marketing scenario, not a night-only operating mode or visual theme.
- Build a mobile-first responsive website. Do not assume a native app, specific framework, database, cloud provider, payment gateway, mapping provider, authentication vendor, or dispatch algorithm.
- Keep customer prices and payment timing clear before confirmation. The stated direction is customer payment upfront; exact authorization, refund, cancellation, and settlement rules remain open.
- Use the conceptual entities and flows in `docs/brief/architecture.md` as a starting point, then record any necessary implementation choices and rationale in `docs/brief/memory.md`.
- Do not invent real mechanics, coverage, service-level promises, prices, ratings, or availability. Use clearly labeled demo data if a prototype needs examples.
- Implement in the sequence in `docs/brief/phases.md`. A phase is complete only when its acceptance criteria are met and the owner has reviewed any open policy decisions needed by that phase.

## Scope of this handoff

This is a pre-coding project brief, not a final legal, operational, or infrastructure specification. It is intentionally explicit about known product direction and intentionally leaves unresolved implementation choices open. Update the relevant source file when a decision is made; avoid duplicating the same rule in multiple files.
