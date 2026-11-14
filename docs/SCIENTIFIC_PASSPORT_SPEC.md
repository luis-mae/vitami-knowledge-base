# VITAMI — Scientific Passport Specification

**Version:** 1.0.0 · **Status:** Draft architecture

## Purpose
Every material recommendation, non-recommendation, safety warning or professional-review outcome must be traceable to the rule, evidence claim and original source used at decision time.

## Traceability chain
`user answers → rule_id + rule_version → evidence_claim_id → source_id + source_version → displayed attribution`

## Required entities
- `source_registry`: organizations, authorities, publications, legal texts, databases and methodologies.
- `evidence_claims`: atomic, context-specific scientific claims.
- `scientific_reviews`: appraisal, certainty, limitations and reviewer decisions.
- `rule_justifications`: mapping between rules and supporting or constraining claims.
- `source_attribution`: presentation metadata for names, logos, citations and links.
- `rule_application_events`: minimal audit record of rule/evidence versions used.

## Claim minimum fields
`evidence_claim_id`, `ingredient_id`, `claim_text`, `health_goal_or_outcome`, `population`, `form_or_preparation`, `dose_context`, `duration`, `outcome_type`, `certainty_level`, `limitations`, `source_ids`, `review_status`, `reviewed_at`.

Evidence strength is claim-specific, not ingredient-wide.

## Rule activation requirements
A rule cannot be active unless it has:
1. Stable ID and version.
2. Required question IDs and explicit activation conditions.
3. Safety exclusions and escalation conditions.
4. Reviewed evidence claims, or reviewed authoritative safety/legal sources for blocking rules.
5. Population and context boundaries.
6. Dose/reference constraints where relevant.
7. Reviewer, review date and change history.

Incomplete rules remain draft/review-required. Safety rules cannot be overridden by recommendation rules.

## User-facing attribution
For each material claim, show organization/publication name, document title, direct original URL or DOI, publication/update date when available, access/review date, what the source supports, certainty and limitations.

A logo is optional and never substitutes for a citation. Use official logos only after checking brand guidelines and permission/reuse terms. Never imply endorsement, certification or sponsorship.

## Audit event
Store only minimum necessary data: pseudonymous session reference, timestamp, rule ID/version, evidence claim IDs/versions, source IDs/versions, outcome category, locale and app version. Do not copy questionnaire health details into analytics events.

## Lifecycle
`draft → evidence_review → safety_review → approved → active → superseded/deprecated`

Historical decisions remain tied to the versions used at the time.

## Methodological distinctions
- GRADE assesses certainty of evidence and recommendation strength.
- PRISMA guides reporting of systematic reviews.
- A regulator's scientific opinion is not always binding law.
- Product-label databases are not proof of efficacy or safety.
- Source attribution does not imply endorsement by the source organization.
