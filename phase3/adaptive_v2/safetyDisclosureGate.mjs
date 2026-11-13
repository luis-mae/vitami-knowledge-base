/** VITAMI safety disclosure gate — presentation-agnostic, fail-closed.
 * It validates disclosure and warning completeness; NOT clinical approval.
 */
export const REQUIRED_ITEM_FIELDS = Object.freeze([
  "ingredient_id","evidence_grade","evidence_summary","indication",
  "benefit_limitations","adverse_effects","contraindications",
  "drug_interactions","supplement_interactions","duplicate_ingredient_sources",
  "special_populations","medical_review_triggers","source_refs","last_reviewed"
]);
const meaningful = v => v !== null && v !== undefined && v !== "" &&
  (!Array.isArray(v) || v.length > 0) &&
  (typeof v !== "object" || Array.isArray(v) || Object.keys(v).length > 0);
export function checkItemSafety(item) {
  if (!item || typeof item !== "object" || Array.isArray(item))
    return {ok:false,missing:[...REQUIRED_ITEM_FIELDS]};
  const missing=REQUIRED_ITEM_FIELDS.filter(k=>!meaningful(item[k]));
  return {ok:missing.length===0,missing};
}
export function checkResultSafety({entryAcknowledged=false,resultsAcknowledged=false,items=[],combinationReview=null,clinicalApproval=false}={}) {
  const issues=[];
  if (!entryAcknowledged) issues.push("entry_disclaimer_not_acknowledged");
  if (!resultsAcknowledged) issues.push("results_disclaimer_not_acknowledged");
  if (!Array.isArray(items)) issues.push("invalid_items");
  const itemChecks=Array.isArray(items)?items.map(checkItemSafety):[];
  if (itemChecks.some(c=>!c.ok)) issues.push("ingredient_precautions_incomplete");
  if (!combinationReview || combinationReview.status!=="reviewed" ||
      combinationReview.unknownRisks===true || combinationReview.duplicatesResolved!==true)
    issues.push("combination_safety_not_cleared");
  if (!clinicalApproval) issues.push("clinical_protocol_not_approved");
  return {personalizedDoseAllowed:issues.length===0,issues,itemChecks};
}
