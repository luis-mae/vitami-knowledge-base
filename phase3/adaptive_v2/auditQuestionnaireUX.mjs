/**
 * Run: node phase3/adaptive_v2/auditQuestionnaireUX.mjs
 * Outputs grounded, actionable friction and safety findings.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const bank=JSON.parse(fs.readFileSync(path.join(root,"data/questions/question_bank_master.json"),"utf8"));
const questions=bank.questions,ids=new Set(),findings=[],byTier={},byDomain={},core=[];
const add=(id,severity,issue,fix)=>findings.push({question_id:id,severity,issue,suggested_fix:fix});
for(const q of questions){
 const id=q.question_id;
 if(ids.has(id))add(id,"critical","duplicate question id","Deduplicate IDs before deployment");
 ids.add(id);
 byTier[q.tier]=(byTier[q.tier]??0)+1;
 byDomain[q.domain]=(byDomain[q.domain]??0)+1;
 if(q.required_for_basic||q.required_for_safety)core.push(id);
 const es=q.text?.es??"";
 if(!es.trim())add(id,"critical","Spanish question text missing","Provide a clear Spanish prompt");
 if(es.length>115)add(id,"ux","long question (>115 characters)","Shorten main prompt and move explanation to help text");
 if(q.response_type==="single_choice"&&!q.options?.length)add(id,"critical","single-choice question without options","Define options");
 if(q.required_for_safety&&q.data_quality?.allow_skip===true)add(id,"safety","safety question allows skipping","Unknown must be explicitly recorded and personalization blocked");
 if(q.required_for_basic&&q.logic?.visibility?.mode==="always"&&q.domain!=="safety"&&q.domain!=="profile")add(id,"ux","always-visible BASIC question","Consider conditional presentation after a short goal screen");
 if(q.response_type==="free_text"&&q.required_for_basic)add(id,"ux","required free text","Prefer constrained answer plus optional details");
 if(q.question_id==="profile_sex_reference")add(id,"safety_ux","reference sex requested without a clear not-sure route","Clarify optionality and avoid deriving pregnancy from this answer");
 if(q.question_id==="medications_list")add(id,"safety","medicine names may be ambiguous","Ask name, dose, schedule and verification; don't infer classes from free text alone");
 if(q.question_id==="supplements_current_list")add(id,"safety","product list cannot establish cumulative exposure","Ask label, dose per unit, units per day, ingredient form and frequency");
}
const report={version:"1.0",questions:questions.length,coreQuestions:core.length,byTier,byDomain,findings,principles:["Safety first: ask medications, pregnancy/lactation and relevant diagnoses early","Do not hide essential safety questions behind optional goals","One question per screen where helpful; progress indicator","Show follow-ups only for chosen goals or flagged risks","Record unknown distinctly from no; fail closed","Use plain language and clear examples; preserve original question IDs","Never infer safe dosage from an incomplete questionnaire"],deployment:false};
const target=process.argv.includes("--output")?process.argv[process.argv.indexOf("--output")+1]:null;
if(target)fs.writeFileSync(target,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({questions:report.questions,coreQuestions:report.coreQuestions,byTier,byDomain,findings:findings.length,topFindings:findings.slice(0,25)},null,2));
