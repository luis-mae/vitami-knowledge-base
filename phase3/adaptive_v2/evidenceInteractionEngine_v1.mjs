export const RISK_ACTIONS = Object.freeze(["PROFESSIONAL_REVIEW_NO_AUTOMATIC_RECOMMENDATION","MEDICATION_TIMING_REVIEW","CHECK_TOTAL_ELEMENTAL_ZINC_DURATION_AND_COPPER"]);
const normalize = value => String(value ?? "").trim().toLowerCase().replace(/[_\s-]+/g,"_");
const asSet = values => new Set((Array.isArray(values)?values:[]).map(normalize));
export function evaluateEvidenceInteractions({ingredientIds=[],medicationGenericNames=[],medicationClasses=[],conditions=[],matrix=null,medicationListKnown=false,ingredientListKnown=false}={}){
 const errors=[];
 if(!matrix || !Array.isArray(matrix.interactions)) errors.push("MATRIX_MISSING");
 if(!ingredientListKnown) errors.push("INGREDIENT_LIST_NOT_VERIFIED");
 if(!medicationListKnown) errors.push("MEDICATION_LIST_NOT_VERIFIED");
 const ingredients=asSet(ingredientIds),medications=asSet(medicationGenericNames),classes=asSet(medicationClasses),diagnoses=asSet(conditions);
 const findings=[];
 for(const rule of matrix?.interactions??[]){
  const matchedIngredients=(rule.ingredients??[]).filter(x=>ingredients.has(normalize(x)));
  if(!matchedIngredients.length)continue;
  const hasDrugCriteria=(rule.medications?.length||rule.medication_classes?.length);
  const hasConditionCriteria=Boolean(rule.conditions?.length);
  const drugMatch=(rule.medications??[]).some(x=>medications.has(normalize(x)))||(rule.medication_classes??[]).some(x=>classes.has(normalize(x)));
  const conditionMatch=(rule.conditions??[]).some(x=>diagnoses.has(normalize(x)));
  if(hasDrugCriteria&&!drugMatch)continue;
  if(hasConditionCriteria&&!conditionMatch)continue;
  if(!hasDrugCriteria&&!hasConditionCriteria)continue; // nutrient-nutrient risks need quantities; don't emit unconditional alerts
  findings.push({id:rule.id,ingredients:matchedIngredients,risk:rule.risk,action:rule.action,source:rule.source});
 }
 return {status:errors.length?"BLOCKED_INCOMPLETE_DATA":findings.length?"REVIEW_REQUIRED":"NO_MATCHES_FOUND_NOT_CLEARED",personalizedRecommendationAllowed:false,errors,findings,notice:"No matches found is not a clinical safety clearance. Unknown products, aliases, quantities and unmodeled interactions require review."};
}
