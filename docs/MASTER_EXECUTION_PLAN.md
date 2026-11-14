# VITAMI EXPRESS — Master Execution Plan

**Version:** 1.0 · **Status:** Active roadmap

## Product scope
BASIC, PRO, Scientific Knowledge Base, Scientific Passport, follow-up, VITAMI SHOP, first-party instrumentation and independent infrastructure.

## Stage 1 — Scientific knowledge consolidation
- Inventory ingredients, claims, sources, questions and rules.
- Normalize IDs and taxonomies.
- Build source registry, evidence claims and scientific review records.
- Add Scientific Passport and ingredient review queues.
- Keep incomplete records in draft/review; do not activate unsupported claims.

## Stage 2 — Rule engine consolidation
- Map each rule to question IDs, evidence claims and sources.
- Define activation, exclusion, missing-information and professional-escalation conditions.
- Enforce safety precedence.
- Version rules and connect outcomes to source attribution.

## Stage 3 — BASIC and PRO
- Complete BASIC questionnaire, safety filter, results, references and how-to-take guidance.
- Complete PRO assessment, report, scientific annex and follow-up.
- AI assists interpretation and communication; validated deterministic rules control safety and eligibility.
- Separate PRO payments from product checkout.

## Stage 4 — User experience and follow-up
- Complete navigation, ES/EN/IT localization and responsive layouts.
- Complete profile, history, library, results and follow-up.
- Add notifications and safety escalation.
- Never automatically alter doses based on symptoms or feedback.

## Stage 5 — Marketplace
- Preserve and extend the existing cart.
- Complete merchant onboarding and product moderation.
- Complete stock reservation, order/suborder lifecycle, expiry, cancellation and restock.
- Complete seller acceptance/rejection and shipment states.
- Integrate marketplace-capable PSP only after legal/provider approval.
- Implement signed webhooks, idempotency, refunds, commissions, reconciliation and tracking.
- MVP checkout may be separate per merchant until multi-merchant split is verified.

## Stage 6 — Internationalization and country compliance
- Maintain country-by-country legal, regulatory, tax, payment and logistics matrix.
- Enable sales only where operator, seller, product and PSP eligibility are verified.
- Keep scientific localization separate from commercial availability.

## Stage 7 — Independent infrastructure
- Establish preview and production environments.
- Configure domain, HTTPS, backend, database, secrets, backups and deployment.
- Synchronize GitHub and hosting without overwriting newer work.
- Keep Emergent optional, not a runtime dependency.

## Stage 8 — Security, privacy and compliance
- Complete authentication, RBAC, privileged-role MFA, rate limits and audit logs.
- Separate clinical, identity, commercial and analytics data.
- Implement consent, retention, deletion and access controls.
- Complete product, advertising, consumer and health-data legal reviews.

## Stage 9 — Integrated acceptance testing
- Scientific traceability and safety.
- BASIC/PRO journeys.
- Buyer/seller/admin marketplace journeys.
- Payments, refunds, inventory and logistics.
- Web/mobile, localization, performance, security, privacy and backup recovery.
- Fix defects and rerun affected tests.

## Stage 10 — Controlled launch
- Private beta.
- Limited merchant and country pilot.
- Operational support and incident response.
- Gradual public launch and continuous evidence updates.

## Working rules
Preserve existing components; implement rather than repeatedly re-audit; commit coherent changes; protect production; do not represent demo functions as real transactions; never activate unsupported claims or provisional doses; maintain concise progress and dependency logs; verify comprehensively at major stage gates.

## Immediate sequence
1. Source registry and Scientific Passport contract.
2. Ingredient/source/claim inventory.
3. Evidence review workflow and templates.
4. Rule-to-evidence mapping.
5. App attribution integration.
6. Parallel non-blocking application and marketplace work.
