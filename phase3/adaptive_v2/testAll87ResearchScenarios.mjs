/**
 * Integration harness for all 87 original rule files.
 * Run from repo root: node phase3/adaptive_v2/testAll87ResearchScenarios.mjs
 * Does not authorize personalized advice.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {evaluateVitamiResearchScenario} from "./researchScenarioOrchestrator_v1.mjs";
import {evaluateDraftRules} from "./draftRuleEngine_v1.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const index=read("phase2/draft_rules/RULE_INDEX.json");
const bank=read("data/questions/question_bank_master.json");
const rules=index.rules.map(id=>read("phase2/draft_rules/"+id.toLowerCase()+".json"));
const questions=new Map(bank.questions.map(q=>[q.question_id,q]));
assert.equal(rules.length,87);
assert.equal(new Set(rules.map(r=>r.rule_id)).size,87);
const findings=[];
for(const rule of rules){
 assert.ok(rule.rule_id&&rule.supplement_id);
 const pairs=[...(rule.conditions?.all??[]),...(rule.conditions?.any??[])];
 for(const [key,expected] of pairs){
  const q=questions.get(key.endsWith("_contains")?key.slice(0,-9):key);
  if(!q)findings.push({rule:rule.rule_id,issue:"UNKNOWN_QUESTION",key});
  if(typeof expected==="string"&&/^[<>]=?/.test(expected)&&!/^(>=|<=|>|<)-?\d+(?:\.\d+)?$/.test(expected))findings.push({rule:rule.rule_id,issue:"UNSUPPORTED_NUMERIC_COMPARATOR",key,expected});
 }
 const evaluated=evaluateDraftRules({rules:[rule],answers:{},interactionReview:{personalizedRecommendationAllowed:false}});
 assert.equal(evaluated.personalizedRecommendationAllowed,false);
 assert.equal(evaluated.matchedRuleIds.length,0);
}
const cases=[
 {name:"fatigue_only_no_iron",answers:{symptom_fatigue:true},expectedRule:"IRON_FATIGUE_ONLY",expectedCap:"E_no_current_indication"},
 {name:"kidney_requires_review",answers:{conditions_kidney:true},expectedRule:"CREATINE_KIDNEY",expectedOverride:"X_professional_review_required"},
 {name:"pregnancy_melatonin_review",answers:{profile_pregnancy:"yes"},expectedRule:"MELATONIN_PREGNANCY",expectedOverride:"X_professional_review_required"}
];
const scenarioResults=[];
for(const c of cases){
 const output=evaluateVitamiResearchScenario({rules,answers:c.answers,medications:[],medicationListComplete:true,productLabelsComplete:true});
 const matched=output.draft.matchedRuleIds.includes(c.expectedRule);
 const rule=rules.find(r=>r.rule_id===c.expectedRule);
 const capOk=!c.expectedCap||output.draft.draftCaps[rule.supplement_id]?.includes(c.expectedCap);
 const overrideOk=!c.expectedOverride||output.draft.draftOverrides[rule.supplement_id]?.includes(c.expectedOverride);
 scenarioResults.push({name:c.name,matched,capOk,overrideOk});
 assert.equal(output.personalizedRecommendationAllowed,false);
 assert.equal(output.productionReady,false);
}
const report={rulesLoaded:rules.length,questionBankSize:bank.questions.length,staticFindings:findings,scenarioResults,clinicalApproval:false,productionReady:false};
const target=process.argv.includes("--output")?process.argv[process.argv.indexOf("--output")+1]:null;
if(target)fs.writeFileSync(target,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(findings.length||scenarioResults.some(x=>!x.matched||!x.capOk||!x.overrideOk))process.exitCode=1;
