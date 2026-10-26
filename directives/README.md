# Layer 1: Directives (SOPs)

Directives are Standard Operating Procedures (SOPs) written in natural language Markdown. They define **what to do**, leaving the execution details to deterministic scripts in `execution/`.

## Anatomy of a Directive

Every directive in this directory should follow a structured format:

1. **Goal**: Clear, unambiguous definition of the desired outcome.
2. **Inputs**: All required inputs, configuration values, files, or parameters.
3. **Tools / Scripts**: Python scripts in `execution/` to run, along with flags and arguments.
4. **Outputs & Deliverables**:
   - Cloud deliverables (Google Sheets, Slides, etc.)
   - Intermediate files in `.tmp/`
5. **Edge Cases & Error Handling**: Known gotchas, rate limits, retry policies, and fallback actions.
6. **Learnings & Changelog (Self-annealing)**: Running history of discovered API quirks, constraints, and improvements.

See [template.md](template.md) to create a new directive.
