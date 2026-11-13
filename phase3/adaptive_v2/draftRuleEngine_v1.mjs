import {compareMeasuredAnswer} from "./typedQuestionnaireComparator_v1.mjs";
/** VITAMI rules evaluation prototype. Draft decisions only; never clinical clearance. */
const norm=x=>String(x??"").trim().toLowerCase().replace(/[\s-]+/g,"_");
const asArray=x=>Array.isArray(x)?x:[];
function compare(actual,expected){
 if(typeof expected==="string"&&/^(>=|<=|>|<)-?\d+(?:\.\d+)?$/.test(expected)){
  const m=expected.match(/^(>=|<=|>|<)(-?\d+(?:\.\d+)?)$/),n=Number(actual),limit=Number(m[2]);
  if(actual===null||actual===undefined||actual===""||!Number.isFinite(n))return null;
  return m[1]===">="?n>=limit:m[1]==="<="?n<=limit:m[1]===">"?n>limit:n<limit;
 }
 if(Array.isArray(expected))return expected.some(x=>compare(actual,x)===true);
 if(typeof actual==="boolean"&&typeof expected==="string")return ["yes","true","no","false"].includes(expected)?actual===["yes","true"].includes(expected):String(actual)===expected;
 if(typeof expected==="boolean"&&typeof actual==="string"&&["yes","no","true","false"].includes(actual))return ["yes","true"].includes(actual)===expected;
 return actual===expected;
}
export function evaluateRuleCondition(pair,answers={}){
 if(!Array.isArray(pair)||pair.length!==2||typeof pair[0]!=="string")return {match:false,unknown:true,reason:"INVALID_CONDITION"};
 const [key,expected]=pair;
 if(key.endsWith("_contains")){
  const raw=key.slice(0,-9),value=answers[raw];
  if(value===undefined||value===null)return {match:false,unknown:true,reason:"MISSING:"+raw};
  if(!Array.isArray(value))return {match:false,unknown:true,reason:"INVALID_ARRAY:"+raw};
  return {match:value.includes(expected),unknown:false};
 }
 if(!Object.prototype.hasOwnProperty.call(answers,key)||answers[key]===null||answers[key]===undefined||answers[key]===""||answers[key]==="unknown"||answers[key]==="prefer_not"||answers[key]==="not_sure")return {match:false,unknown:true,reason:"MISSING:"+key};
 const result=typeof expected==="string"&&/^[<>]=?/.test(expected)?compareMeasuredAnswer(answers[key],expected,{declaredUnit:key==="lifestyle_caffeine_daily"?"mg":null}):compare(answers[key],expected);
 if(result&&typeof result==="object"&&"unknown" in result)return result;
 return result===null?{match:false,unknown:true,reason:"INVALID_VALUE:"+key}:{match:result,unknown:false};
}
export function evaluateDraftRules({rules=[],answers={},interactionReview=null}={}){
 const matches=[],unresolved=[],notMatched=[],questions=new Set(),scores=new Map(),caps=new Map(),overrides=new Map();
 for(const rule of asArray(rules)){
  if(!rule||!rule.rule_id||!rule.supplement_id||!rule.conditions||!Array.isArray(rule.conditions.all)||!Array.isArray(rule.conditions.any)){unresolved.push({rule_id:rule?.rule_id??null,reason:"INVALID_RULE"});continue;}
  const all=asArray(rule.conditions.all).map(x=>evaluateRuleCondition(x,answers));
  const any=asArray(rule.conditions.any).map(x=>evaluateRuleCondition(x,answers));
  const allMatch=all.every(x=>x.match),anyMatch=!any.length||any.some(x=>x.match);
  if(!allMatch||!anyMatch){
   const missing=[...(all.some(x=>!x.match&&!x.unknown)?[]:all.filter(x=>x.unknown)),...(any.some(x=>x.match)||any.every(x=>!x.match&&!x.unknown)?[]:any.filter(x=>x.unknown))];
   if(missing.length)unresolved.push({rule_id:rule.rule_id,reasons:missing.map(x=>x.reason)});
   else notMatched.push(rule.rule_id);
   continue;
  }
  matches.push(rule.rule_id);
  const effect=rule.effect??{};
  for(const q of asArray(effect.ask_questions))questions.add(q);
  if(Number.isFinite(effect.score_delta))scores.set(rule.supplement_id,(scores.get(rule.supplement_id)??0)+effect.score_delta);
  if(effect.recommendation_cap)(caps.get(rule.supplement_id)??caps.set(rule.supplement_id,[]).get(rule.supplement_id)).push(effect.recommendation_cap);
  if(effect.override_result)(overrides.get(rule.supplement_id)??overrides.set(rule.supplement_id,[]).get(rule.supplement_id)).push(effect.override_result);
 }
 const blockers=[];
 if(asArray(rules).some(r=>!r?.safety_review||r.safety_review.clinical_approval!==false))blockers.push("RULE_SAFETY_METADATA_MISSING_OR_UNSAFE");
 if(!interactionReview||interactionReview.personalizedRecommendationAllowed!==false)blockers.push("INTERACTION_AUDIT_NOT_PRESENT_OR_INVALID");
 if(unresolved.length)blockers.push("RULE_INPUTS_UNRESOLVED");
 blockers.push("CLINICAL_PROTOCOL_NOT_APPROVED");
 return {status:"DRAFT_ONLY_NO_PERSONALIZED_RECOMMENDATIONS",matchedRuleIds:matches,notMatchedRuleIds:notMatched,unresolved,askQuestions:[...questions],draftScores:Object.fromEntries(scores),draftCaps:Object.fromEntries(caps),draftOverrides:Object.fromEntries(overrides),blockers,personalizedRecommendationAllowed:false};
}
