# Jolty — Architecture, flows, and conceptual data model

This document combines the pre-coding technical requirements, high-level architecture, conceptual schema, and app flow. It is implementation-neutral: choose stack and vendors only after checking project constraints.

## 1. System context

Jolty has at least three actors: customer, local mechanic/provider, and possibly operations/support. The customer-facing product is a responsive website with landing, login, mechanics list, order/checkout, and tracking experiences. A provider workflow is needed for real marketplace fulfillment, but whether that is a separate web portal, responsive provider view, or another interface is open.

Conceptual components (not mandated services):
- Customer web interface.
- Provider interface for receiving and updating requests.
- Application/API layer enforcing authorization and order rules.
- Persistent storage for accounts, provider/service information, requests, and status history.
- External integrations as selected: identity/authentication, maps/geocoding, payment, messaging/notifications.

No specific framework, hosting, database, payment processor, map provider, or API style has been selected.

## 2. Main flow and states

### Customer request
`Landing → Login/identity → Location and vehicle/problem details → Mechanics list → Select/confirm → Checkout/payment → Booking confirmation → Tracking → Completion/receipt`

Allow the user to return to edit request details before payment. Preserve entered data safely during the flow where practical. Define a clear recovery path for each failure.

### Suggested order lifecycle
`draft → submitted / awaiting_provider → accepted → en_route → arrived → in_service → completed`
Possible terminal/exception states: `cancelled`, `declined`, `expired`, `payment_failed`, `support_required`.

These are conceptual states, not a finalized contract. Decide who can trigger each transition, what customer sees, and whether payment is authorized, captured, or otherwise handled at each point. Do not show impossible transitions or silently treat an unaccepted request as confirmed.

### Key exception paths
- Location unavailable or permission denied: allow address/pin entry if supported, and explain limitations.
- No provider found: offer retry, adjust location/service details, or support route; never fabricate results.
- Provider declines or does not respond: explain the state and next action; retry/dispatch policy is open.
- Payment fails: keep the booking state clear and avoid duplicate charges on retry.
- Tracking unavailable/stale: show last update time and text status; do not animate a false live location.
- Customer cancellation, provider cancellation, dispute, or safety issue: provide a defined support path before launch.

## 3. Conceptual data model

Use stable IDs, timestamps, and explicit ownership/authorization in the chosen implementation. Fields below are illustrative; validate necessity and privacy before collection.

- **Customer**: id, contact/login reference, display name (optional), created/updated timestamps.
- **Vehicle**: id, customer id, type/make/model (as needed), registration identifier only if operationally necessary.
- **Provider**: id, mechanic/business identity, contact reference, verification state, service area/location, service categories, operating/availability information, status.
- **ServiceCategory**: id, name, description, supported vehicle scope.
- **ServiceRequest / Order**: id, customer id, selected vehicle, issue description/category, pickup location reference, request time, current state, assigned provider id, customer-visible quote/price snapshot, timestamps.
- **OrderStatusEvent**: id, order id, prior/new state, actor, timestamp, optional customer-safe note. Preserve history for audit and support.
- **PaymentRecord**: id, order id, provider reference, amount/currency, payment state, timestamps, refund reference/status when applicable. Never store raw card credentials.
- **LocationUpdate** (if live tracking is selected): id, order/provider id, coordinates, captured time, consent/retention handling. Minimize precision and retention to operational need.
- **SupportCase** (if needed): id, order id, requester, category, status, notes/access controls, timestamps.

Do not collect or expose fields solely because they appear here. Payment, location, and identity handling need security and privacy review.

## 4. Interface/API responsibilities

Define explicit operations for: identity/session; provider discovery by location and service; request creation/update; price/quote presentation; order submission; provider acceptance and status changes; payment initiation/result; tracking/status retrieval; cancellation/support. Exact endpoints, protocols, and real-time transport are open.

The server or trusted backend must enforce order transitions, customer/provider ownership, price snapshot integrity, and payment state reconciliation. The client must treat provider/location/payment data as untrusted until validated by the backend.

## 5. Privacy, safety, and reliability

- Request location permission only when needed and explain its use.
- Share customer location with an assigned provider only under a defined operational and consent policy.
- Restrict provider access to assigned requests and only the details needed to fulfill them.
- Use secure transport, appropriate access controls, secret management, logging without sensitive payloads, and documented data retention.
- Use idempotent handling for order submission and payment retry where supported by the selected provider.
- Design clear loading, empty, offline, stale, and failure states.

## 6. Decisions that block production architecture

Choose and document: launch geography; identity flow; provider onboarding and verification; price/quote and settlement model; payment provider and capture/refund/cancellation handling; map/geocoding/tracking capability and consent; real-time/status delivery; customer/provider/support interfaces; data retention and applicable legal requirements. Record decisions and rationale in `memory.md`.
