# Layer 3: Execution (Deterministic Tools)

This directory contains standalone, deterministic Python scripts.

## Core Rules for Execution Scripts
1. **Deterministic & Testable**: Scripts should produce repeatable outputs for given inputs. Avoid placing unstructured probabilistic logic here unless calling an external API with strict schemas.
2. **Environment & Secrets**: Load environment variables and secrets from `.env`. Never hardcode secrets.
3. **Storage Separation**:
   - Write intermediate / temporary files to `.tmp/`.
   - Never write permanent deliverables to local processing folders—deliverables belong in cloud services (Google Sheets, Slides, Drive) or structured exports.
4. **Self-Contained & Documented**: Include CLI argument parsing (`argparse`), error logging, and standard exit codes.
