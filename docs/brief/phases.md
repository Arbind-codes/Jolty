# Jolty — suggested delivery phases

This is a sequence for building a coherent product, not a committed schedule. Do not start production integration work that depends on unresolved policies or vendor choices.

## Phase 0 — confirm foundations
Confirm launch geography, service categories, provider onboarding/verification, operating-hours promise, pricing and quote rules, payment/refund/cancellation policy, tracking capability, support ownership, identity requirements, and applicable privacy obligations. Select stack and integrations based on repository constraints. Record decisions in `memory.md`.

**Gate:** Owner approves a feasible operating model and implementation decisions needed for the first live flow.

## Phase 1 — experience foundation
Set up the responsive visual system and shared navigation/components. Build landing and uncluttered login experiences with day/night balance, accessible controls, and clear copy. Use labeled placeholders where live data is not connected.

**Acceptance:** Mobile and desktop layouts render coherently; the 2 AM promise is prominent without implying night-only service; no unsupported claims appear.

## Phase 2 — request and discovery
Implement request details (location, vehicle/problem fields as decided) and mechanics list with realistic empty/loading/error states. Connect only confirmed provider data and discovery rules.

**Acceptance:** A user can enter a valid request and understand provider options; no-results and permission-denied cases have a next step; provider claims are evidence-based.

## Phase 3 — checkout and order creation
Implement request summary, price/quote disclosure, upfront payment flow, and order creation according to the approved payment policy. Include safe retry and cancellation behavior.

**Acceptance:** Total and terms are visible before confirmation; payment/order states cannot be confused; retry does not create duplicate orders/charges where supported.

## Phase 4 — fulfillment and tracking
Implement provider acceptance/status workflow and customer order tracking. Use actual supported status/location updates and show their freshness. Add notifications only after channels and consent are decided.

**Acceptance:** Each state has a defined actor and next step; declined, delayed, stale, and cancelled cases are honest and recoverable.

## Phase 5 — operational readiness
Add support/admin needs, audit and monitoring, privacy/security review, accessibility pass, and launch instrumentation. Validate target geography and provider supply before making availability claims.

**Acceptance:** Owner approves operational runbooks, support handling, data practices, and launch metrics; critical journeys work on mobile with representative failure cases.
