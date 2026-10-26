# Jolty — decisions, assumptions, and progress

Use this file as the compact project memory. Update it when a decision is confirmed. Put the authoritative rule in the relevant source file as well, then link here; do not let this become a second conflicting specification.

## Confirmed from project context
- Product name: Jolty.
- India-focused roadside assistance marketplace connecting stranded drivers to nearby local mechanics.
- Late-night breakdown help, including the 2 AM scenario, is the standout problem and differentiator.
- Customers can also book mechanics during daytime; the product and imagery must not be night-only.
- Customer payment is intended upfront; detailed payment policy remains undecided.
- Customer-facing mobile-first responsive website.
- Main planned experiences: landing, login, mechanics list, order/checkout, and live mechanic tracking.
- Visual direction: premium and Uber-inspired in clarity, without copying; cream/black/saffron yellow palette and subtle Indian roadside/truck-art cues.
- Login should be uncluttered.

## Assumptions used in these briefs
- Mechanics list is based on location and service fit, but exact discovery/ranking behavior is undecided.
- A provider-side workflow is necessary for a functioning marketplace; its form is undecided.
- Live tracking may be a status timeline if live location data is not available. Do not simulate GPS movement.
- The first release should prioritize a complete customer booking path, with production launch gated by operational decisions.

## Open decisions
1. Launch city/region and actual service coverage.
2. Supported vehicle types and repair/service categories; towing or other add-ons.
3. Provider onboarding, identity/skill verification, availability management, and quality controls.
4. How the marketplace matches providers and handles no response, decline, or multiple offers.
5. Pricing model: fixed fee, mechanic quote, estimate, platform fee, taxes, and what upfront payment means operationally.
6. Payment provider, authorization/capture timing, cancellation fees, refunds, failed payment recovery, and provider settlement.
7. Login method, required customer information, and guest browsing/booking policy.
8. Map/geocoding provider, manual location fallback, tracking precision, consent, and retention.
9. Whether customer tracking is real-time GPS, periodic updates, or status-only.
10. Support ownership, escalation path, safety incidents, disputes, and any internal operations console.
11. Languages for launch, customer notifications, reviews, and receipt needs.
12. Applicable privacy, consumer, payment, and marketplace requirements; obtain suitable review before production.
13. Technology stack, hosting, database, integrations, analytics, and repository conventions.
14. Success metric baselines, targets, and launch instrumentation.

## Progress
- Pre-coding brief set drafted and internally aligned across product, flow, design, rules, and phases.
- **Instantiated (Phase 0 & Phase 1 kickoff)**:
  - Repository instantiated with the 3-layer architecture (`directives/`, `execution/`, and client app).
  - Selected prototype stack: Mobile-first responsive web client (HTML5, Vanilla CSS design system, vanilla JS state engine) served via deterministic Python runner (`execution/serve_app.py`). Zero third-party runtime dependencies.
  - Pilot demo geography: Bengaluru cluster (Indiranagar, Koramangala, MG Road, Outer Ring Road, Hosur Highway) with clear "Demo / Simulation" labels.
  - Core services scoped: Battery Jumpstart, Flat Tyre / Puncture, Engine Stall / Breakdown, Fuel Delivery.
  - Pricing model snapshot: Base call-out fee + transparent job estimate with upfront disclosure.
  - Order state model: `draft` → `awaiting_provider` → `accepted` → `en_route` → `arrived` → `in_service` → `completed`.
  - Next step: Deliver Phase 1 experience foundation (Landing + uncluttered Login) with end-to-end interactive flow demo.

