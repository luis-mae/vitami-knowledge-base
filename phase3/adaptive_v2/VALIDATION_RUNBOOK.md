# VITAMI research branch — reproducible validation

No part of this package is clinically approved or connected to the published app.

From repository root, with Node.js 20+:

```sh
node phase3/adaptive_v2/exposureInteractionEngine_v3.test.mjs
node phase3/adaptive_v2/strictSafetyDisclosureGate_v2.test.mjs
node phase3/adaptive_v2/draftRuleEngine_v1.test.mjs
node phase3/adaptive_v2/researchScenarioOrchestrator_v1.test.mjs
node phase3/adaptive_v2/adaptiveIntakePlanner_v1.test.mjs
node phase3/adaptive_v2/validateAll87Rules.mjs --output /tmp/vitami-rules-audit.json
node phase3/adaptive_v2/auditQuestionnaireUX.mjs --output /tmp/vitami-ux-audit.json
node phase3/adaptive_v2/testAll87ResearchScenarios.mjs --output /tmp/vitami-87-scenarios.json
```

The rule validator intentionally exits nonzero on structural errors. Findings must be repaired, not bypassed. The integration harness may exit nonzero on unsupported rule conditions, which must be investigated. A test file being committed does **not** imply it has been executed or passed.

Known work remaining:
- Verify all 87 rules against question response enums and real patient-input representations.
- Correct unsupported comparator units such as `>=300mg`; parse units explicitly, never strip them silently.
- Define typed medication identities and confirmed product composition before medication interactions.
- Add nutrient-specific dose units, elemental conversion and aggregate across current and candidate products.
- Verify scientific evidence at source level and obtain clinical sign-off.
- Make questionnaire branches sensitive to relevant goals without hiding essential safety questions.
- Keep all personalized recommendations disabled and do not deploy.
