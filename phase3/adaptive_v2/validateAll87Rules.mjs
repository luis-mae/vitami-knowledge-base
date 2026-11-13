/**
 * Run: node phase3/adaptive_v2/validateAll87Rules.mjs
 * Static schema/data-quality audit; does NOT establish scientific validity.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const index=read("phase2/draft_rules/RULE_INDEX.json");
const bank=read("data/questions/question_bank_master.json");
const ids=index.rules;
const questions=new Map(bank.questions.map(q=>[q.question_id,q]));
const knownVirtual=new Map([["goals_primary_contains","goals_primary"],["supplements_current_use_contains","supplements_current_list"]]);
const results=[],errors=[],warnings=[],conditionKeys=new Map(),valuePairs=new Map();
const put=(target,rule,code,detail)=>target.push({rule,code,detail});
const numeric=/^(>=|<=|>|<)\s*(-?\d+(?:\.\d+)?)\s*(mg|g|mcg|µg|h|hours|minutes|%)?$/i;
for(const id of ids){
 let rule;try{rule=read("phase2/draft_rules/"+id.toLowerCase()+".json");}
 catch(e){put(errors,id,"FILE_MISSING",String(e));continue;}
 const local={rule:id,conditions:0,sourceUrls:0};
 if(rule.rule_id!==id)put(errors,id,"RULE_ID_MISMATCH",rule.rule_id);
 if(!rule.supplement_id)put(errors,id,"SUPPLEMENT_MISSING","");
 if(rule.safety_review?.clinical_approval!==false)put(errors,id,"CLINICAL_APPROVAL_NOT_EXPLICITLY_FALSE","");
 if(rule.safety_review?.unknown_inputs!=="block_personalized_recommendation")put(errors,id,"UNKNOWN_INPUTS_NOT_FAIL_CLOSED","");
 if(!Array.isArray(rule.correction_source_urls)||!rule.correction_source_urls.length)put(errors,id,"SOURCE_URLS_MISSING","");
 else for(const url of rule.correction_source_urls){local.sourceUrls++;if(!/^https:\/\/[a-z0-9.-]+\//i.test(url))put(errors,id,"INVALID_SOURCE_URL",url);}
 if(!["normal","safety_first"].includes(rule.priority))put(warnings,id,"UNRECOGNIZED_PRIORITY",rule.priority);
 for(const group of ["all","any"]){
  if(!Array.isArray(rule.conditions?.[group])){put(errors,id,"INVALID_CONDITION_GROUP",group);continue;}
  for(const condition of rule.conditions[group]){
   local.conditions++;
   if(!Array.isArray(condition)||condition.length!==2||typeof condition[0]!=="string"){put(errors,id,"INVALID_CONDITION",condition);continue;}
   const [key,value]=condition;
   conditionKeys.set(key,(conditionKeys.get(key)||0)+1);
   const question=questions.get(key)??questions.get(knownVirtual.get(key));
   if(!question){put(errors,id,"QUESTION_NOT_FOUND",key);continue;}
   const type=question.response_type;
   if(typeof value==="string"&&/^[<>]=?/.test(value)){
    const m=value.match(numeric);
    if(!m){put(errors,id,"UNSUPPORTED_COMPARATOR",key+"="+value);continue;}
    if(!["integer","number","decimal","numeric"].includes(type))put(warnings,id,"NUMERIC_COMPARATOR_ON_NON_NUMERIC_QUESTION",key+" type="+type);
    if(m[3])put(warnings,id,"COMPARATOR_UNIT_REQUIRES_NORMALIZATION",key+"="+value);
   }else if(question.options?.length&&!key.endsWith("_contains")){
    const options=new Set(question.options.map(o=>o.value));
    const vals=Array.isArray(value)?value:[value];
    for(const v of vals)if(typeof v==="string"&&!options.has(v))put(warnings,id,"VALUE_NOT_IN_QUESTION_OPTIONS",key+"="+v);
   }
   const pair=key+"="+JSON.stringify(value);valuePairs.set(pair,(valuePairs.get(pair)||0)+1);
  }
 }
 for(const qid of rule.effect?.ask_questions??[])if(!questions.has(qid))put(errors,id,"FOLLOWUP_QUESTION_NOT_FOUND",qid);
 if(rule.effect?.recommendation_cap)put(warnings,id,"CAP_NEEDS_RUNTIME_ENUM_VALIDATION",rule.effect.recommendation_cap);
 if(rule.effect?.override_result)put(warnings,id,"OVERRIDE_NEEDS_RUNTIME_ENUM_VALIDATION",rule.effect.override_result);
 results.push(local);
}
const report={version:"1.0",scope:"static audit of all 87 draft rules",indexCount:ids.length,uniqueIds:new Set(ids).size,loadedRules:results.length,questionBankCount:bank.questions.length,errors,warnings,conditionKeys:Object.fromEntries([...conditionKeys].sort((a,b)=>b[1]-a[1])),notes:["This checks syntax and questionnaire compatibility, not clinical evidence.","A URL is not proof of source accuracy.","Any unresolved condition must block personalization.","No application deployment or production changes."]};
const target=process.argv.includes("--output")?process.argv[process.argv.indexOf("--output")+1]:null;
if(target)fs.writeFileSync(target,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({loadedRules:report.loadedRules,indexCount:report.indexCount,errors:errors.length,warnings:warnings.length,topErrors:errors.slice(0,20),topWarnings:warnings.slice(0,20)},null,2));
if(errors.length||results.length!==87)process.exitCode=1;
