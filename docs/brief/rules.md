# Jolty — product and implementation rules

These rules apply across all phases. If a rule conflicts with an unresolved policy, record the conflict and resolve it before the affected production feature ships.

## Product truth
- Jolty serves roadside assistance requests during daytime and nighttime. Night repair is the standout pain point and marketing hook, not the only use case.
- Describe Jolty as a marketplace connecting stranded drivers to nearby local mechanics.
- Never invent provider availability, verification, ratings, arrival time, service coverage, prices, or live location.
- Label estimates as estimates and disclose what is included before customer commitment.
- Do not present a request as accepted/confirmed until the defined provider and payment conditions are met.

## Experience
- Keep the customer flow focused and mobile-first.
- Keep login uncluttered.
- Use cream, black/charcoal, and saffron yellow as the core palette, with restrained Indian roadside/truck-art cues.
- Mix day and night imagery. Do not make all pages or imagery dark.
- Take inspiration from service-product clarity; do not copy Uber or another brand's distinctive design.
- Provide visible states for loading, empty results, errors, offline/stale status, and successful completion.

## Data and trust
- Collect only necessary personal, vehicle, payment-related, and location data.
- Explain location access and sharing; restrict request details to authorized actors.
- Never store raw payment credentials in Jolty's own data store.
- Keep order status transitions explicit and auditable.
- Keep demo data unmistakably labeled; do not imply it represents live coverage.

## Engineering discipline
- Do not assume a framework, database, cloud, payment, identity, map, notification, or real-time vendor before confirming project constraints.
- Keep business rules enforceable server-side; do not rely on client-only restrictions for ownership, pricing, or state transitions.
- Handle retries without duplicate orders or charges where the chosen integrations support idempotency.
- Record new decisions and rationale in `memory.md`; update the source brief rather than maintaining contradictory duplicated notes.
