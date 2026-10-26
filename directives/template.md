# [Directive Name]

## 1. Goal
Describe the objective and business purpose in clear, natural language.

## 2. Inputs
- Input datasets, files, or URLs:
- Environment variables / credentials needed:
- Operational parameters:

## 3. Tools & Execution Flow
Deterministic tools located in `execution/`:
1. `execution/<script_name>.py`
   - Command: `python3 execution/<script_name>.py --param <value>`
   - Purpose: ...

## 4. Outputs & Deliverables
- **Deliverables** (Accessible to user):
  - Google Sheets / Slides link / external asset
- **Intermediates** (Regenerable, stored in `.tmp/`):
  - `.tmp/<intermediate_output>.json`

## 5. Edge Cases & Constraints
- Rate limits / API quotas:
- Timeout / retry handling:
- Failure recovery steps:

## 6. Self-Annealing Log
*Record changes and learnings as unexpected behavior or API limits arise:*
- **YYYY-MM-DD**: [Description of issue encountered and how execution tool / directive was updated]
