# Serve Prototype Directive

## 1. Goal
Start and manage the local HTTP server for the Jolty roadside assistance web client prototype, enabling rapid verification and testing across mobile and desktop viewport profiles.

## 2. Inputs
- Static web assets: `index.html`, `css/style.css`, `js/app.js`
- Port configuration: Default `8000` (configurable via `--port` or `.env` `PORT`)
- Host configuration: Default `127.0.0.1`

## 3. Tools & Execution Flow
Deterministic tools located in `execution/`:
1. `execution/serve_app.py`
   - Command: `python3 execution/serve_app.py --port 8000 --dir .`
   - Purpose: Starts a lightweight, self-contained HTTP server with no external dependencies, proper MIME types, and CORS support.

## 4. Outputs & Deliverables
- **Deliverables**:
  - Live prototype accessible at `http://127.0.0.1:8000`
- **Intermediates**:
  - Optional access logs written to `.tmp/server.log` if daemonized.

## 5. Edge Cases & Constraints
- Port conflict: If port 8000 is occupied, `serve_app.py` automatically checks and selects the next available port (e.g. 8080, 8081).
- Graceful shutdown: Handles SIGINT and SIGTERM cleanly.
- Static file caching: Disables caching during development so changes appear immediately.

## 6. Self-Annealing Log
- **2026-10-25**: Initial directive created for Jolty handoff instantiation and prototype serving.
