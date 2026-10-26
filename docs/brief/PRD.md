# Jolty — Product Requirements Document

## 1. Product summary

Jolty is a mobile-first roadside assistance marketplace for India. It helps a stranded driver find and request help from nearby local mechanics, including during late-night breakdowns when finding help can be difficult. Customers can also book during the day. The customer pays upfront as part of the booking direction; the exact payment and refund policy is still to be decided.

## 2. Problem and opportunity

A vehicle breakdown can leave a driver uncertain about whom to call, whether a mechanic is available, how much the work may cost, and when help will arrive. The uncertainty is especially painful around 2 AM, but roadside repair needs occur at all hours. Jolty should make it easier to request nearby help, understand the next steps, and follow the assigned mechanic.

## 3. Product principles

- **Help when it matters:** Night availability is a defining promise only where verified supply supports it; daytime service remains first-class.
- **Clarity under stress:** Keep the booking path focused, legible, and low effort.
- **Local and trustworthy:** Represent local mechanics respectfully and show only verified information the service can support.
- **Honest status:** Clearly distinguish requested, accepted, en route, arrived, and completed states; do not imply live precision without live data.
- **Mobile first:** Optimize core actions for a phone on a roadside, with responsive desktop support.

## 4. Users

### Primary: stranded driver / vehicle owner
Needs to explain a problem, share a location, understand price and timing, pay, and know whether help is coming.

### Marketplace provider: local mechanic
Needs to receive relevant requests, understand the location and reported issue, accept or decline, and communicate status. Provider-facing experience is required for marketplace operations but its exact product surface is open.

### Operations/support role
May need to handle exceptions, disputes, cancellations, and provider or customer support. The need for an internal console and its permissions are open.

## 5. Goals

- Let a customer start and complete a roadside assistance request with minimal friction.
- Make nearby mechanics discoverable and their service/availability information understandable.
- Make the 2 AM use case credible while supporting day bookings.
- Give customers a clear order state and a way to follow the mechanic after assignment.
- Establish a trustworthy, premium-feeling brand grounded in Indian roadside context.

## 6. Non-goals for the initial brief

- Do not assume Jolty owns or employs mechanics; it is described as a marketplace connecting customers and local mechanics.
- Do not promise towing, parts delivery, roadside safety response, insurance, or any particular repair category until confirmed.
- Do not assume automated dispatch, guaranteed arrival times, multi-city launch, subscriptions, fleet accounts, or a native mobile app.
- Do not prescribe a technology stack or vendor in this PRD.

## 7. Core customer journey

1. **Landing:** Understand the service, see that help can be requested day or night, and start a request.
2. **Login / identity:** Sign in or provide required contact details. The authentication method and whether browsing is allowed before login are open.
3. **Request details:** Share current/pickup location, vehicle details, and issue description/category. Exact required fields are open.
4. **Mechanics list:** Review nearby providers and relevant service, availability, distance/ETA, and price information only when available and reliable.
5. **Order / checkout:** Confirm request details and total/estimated charges, accept applicable terms, then pay upfront according to the final policy.
6. **Assignment and live tracking:** See order progress and assigned mechanic details. Use a map/location feed only if supported by the chosen provider and consent model; otherwise show honest status updates.
7. **Completion / support:** Confirm service completion, see receipt or booking summary, and access help for exceptions. Rating/review behavior is open.

## 8. Functional requirements

### P0 — required for a coherent first customer flow
- Landing page explains Jolty's value and offers a clear start action.
- Login page is uncluttered and usable on a small screen.
- Customer can provide or confirm the service location and request details.
- Mechanics list can display providers relevant to a location, with clear loading, empty, and error states.
- Order/checkout summarizes the request and discloses the payable amount before payment.
- Booking confirmation and tracking view show the current order state and next expected action.
- Daytime and late-night scenarios are both supported in copy and interface states.

### P1 — marketplace completeness, subject to operational decisions
- Provider accept/decline and status-update experience.
- Customer cancellation and support handling.
- Payment result, failed payment, refund, and receipt states.
- Notifications for important order changes, subject to channel/consent choices.

### P2 — later opportunities, not launch commitments
- Reviews, repeat booking, saved vehicles, service history, promotions, and multi-language expansion.

## 9. Quality requirements

- Responsive layout with touch targets and readable text on mobile.
- Accessible labels, keyboard navigation, visible focus, sufficient contrast, and non-color status cues.
- Graceful handling of denied location permission, poor connectivity, no nearby providers, payment failure, and stale tracking data.
- Collect only data needed for the chosen flow; protect contact, location, vehicle, and payment-related data.
- Do not claim a provider is available, verified, nearby, or live-tracked unless the system has current evidence.

## 10. Success measures to define

Candidate measures: request-start-to-confirmation completion rate; time to find a suitable provider; provider acceptance rate; cancellation and failed-payment rates; percentage of bookings with understandable status; customer satisfaction; availability coverage by time and geography. Baselines, targets, instrumentation, and launch geography are **Open**.

## 11. Open product questions

See `memory.md` for the consolidated decision register. Critical before production: launch city/coverage, supported vehicle and repair categories, provider onboarding/verification, pricing and quote rules, payment/refund/cancellation policy, exact tracking capability, support ownership, and regulatory/privacy review.
