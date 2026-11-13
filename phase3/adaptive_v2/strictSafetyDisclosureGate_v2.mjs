import {checkItemSafety} from "./safetyDisclosureGate.mjs";
/** Strict presentation gate. This does not authorize medical decisions. */
export function checkStrictResultSafety(input={}){
 const issues=[];
 const items=input.items;
 if(!Array.isArray(items)||items.length===0)issues.push("NO_VALIDATED_ITEMS");
 if(input.entryAcknowledged!==true)issues.push("ENTRY_DISCLOSURE_MISSING");
 if(input.resultsAcknowledged!==true)issues.push("RESULT_DISCLOSURE_MISSING");
 if(!input.combinationReview||input.combinationReview.status!=="reviewed"||input.combinationReview.unknownRisks!==false||input.combinationReview.duplicatesResolved!==true)issues.push("COMBINATION_REVIEW_INCOMPLETE");
 if(!input.clinicalApprovalRecord||input.clinicalApprovalRecord.status!=="approved"||!input.clinicalApprovalRecord.reviewerId||!input.clinicalApprovalRecord.protocolVersion)issues.push("VERIFIABLE_CLINICAL_APPROVAL_MISSING");
 const itemChecks=Array.isArray(items)?items.map(checkItemSafety):[];
 if(itemChecks.some(x=>!x.ok))issues.push("MISSING_SAFETY_FIELDS");
 for(const item of Array.isArray(items)?items:[]){
  if(!Array.isArray(item.source_refs)||!item.source_refs.some(s=>typeof s==="object"&&typeof s.url==="string"&&/^https:\/\//.test(s.url)))issues.push("SOURCE_URL_MISSING:"+String(item.ingredient_id??"unknown"));
  if(["unknown","pending","not_reviewed","n/a"].includes(String(item.evidence_grade??"").toLowerCase()))issues.push("UNVERIFIED_EVIDENCE:"+String(item.ingredient_id??"unknown"));
 }
 return {personalizedDoseAllowed:false,displayAsClinicallyApproved:false,structurallyComplete:issues.length===0,issues,itemChecks};
}
