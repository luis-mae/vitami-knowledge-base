import {buildResearchRuleAnswers} from "./researchAnswerNormalizer_v1.mjs";
import {auditExposureInteractionsV3} from "./exposureInteractionEngine_v3.mjs";
import {evaluateDraftRules} from "./draftRuleEngine_v1.mjs";
import {checkStrictResultSafety} from "./strictSafetyDisclosureGate_v2.mjs";
/** Research-only orchestration. A matching rule never implies medical safety. */
export function evaluateVitamiResearchScenario({rules=[],interactionRules=[],answers={},products=[],medications=[],medicationListComplete=false,productLabelsComplete=false,disclosure={}}={}){
 const interactions=auditExposureInteractionsV3({products,medications,medicationListComplete,productLabelsComplete,rules:interactionRules});
 const normalized=buildResearchRuleAnswers(answers);
 const draft=evaluateDraftRules({rules,answers:normalized.answers,interactionReview:interactions});
 const disclosureCheck=checkStrictResultSafety(disclosure);
 const reasons=[...normalized.issues,...interactions.errors,...interactions.pending.map(x=>x.reason),...draft.blockers,...disclosureCheck.issues];
 return {status:"RESEARCH_DRAFT_NOT_CLINICALLY_VALIDATED",normalizationIssues:normalized.issues,interactions,draft,disclosureCheck,blockingReasons:[...new Set(reasons)],personalizedRecommendationAllowed:false,personalizedDoseAllowed:false,productionReady:false};
}
