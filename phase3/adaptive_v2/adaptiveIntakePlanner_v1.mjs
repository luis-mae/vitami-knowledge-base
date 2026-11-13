/**
 * VITAMI adaptive intake planner v1. Research prototype only.
 * Uses stable IDs from data/questions/question_bank_master.json.
 */
const stages=[
 ["goals","goals_primary"],
 ["profile","profile_age","profile_sex_reference","profile_pregnancy","profile_lactation"],
 ["safety","medications_regular_use","supplements_current_use","conditions_kidney","conditions_liver","conditions_bleeding","conditions_allergies","conditions_thyroid","conditions_heart","conditions_kidney_stones","safety_upcoming_surgery"],
 ["context","diet_type","diet_fatty_fish_weekly","diet_dairy_calcium_sources","diet_animal_products_frequency","lifestyle_sun_exposure","lifestyle_caffeine_daily","activity_level"],
 ["review"]
];
const unknown=x=>x===undefined||x===null||x===""||x==="unknown"||x==="prefer_not"||x==="not_sure";
const yes=x=>x===true||x==="yes";
const no=x=>x===false||x==="no";
const unique=x=>[...new Set(x)];
export function planAdaptiveIntake({questionBank=[],answers={},goalQuestionIds=[],candidateQuestionIds=[]}={}){
 const bank=new Map(questionBank.map(q=>[q.question_id,q]));
 const requiredSafety=unique(questionBank.filter(q=>q.required_for_safety).map(q=>q.question_id));
 const relevant=new Set([...goalQuestionIds,...candidateQuestionIds]);
 const ordered=[],stagesOutput=[];
 for(const [stage,...ids] of stages){
  const stageIds=ids.filter(id=>bank.has(id));
  if(stage==="safety")stageIds.push(...requiredSafety.filter(id=>!stageIds.includes(id)));
  if(stage==="context")stageIds.splice(0,stageIds.length,...stageIds.filter(id=>relevant.has(id)));
  if(stage==="review")continue;
  const stageUnique=unique(stageIds);
  stagesOutput.push({id:stage,questionIds:stageUnique});
  ordered.push(...stageUnique);
 }
 const followups=[];
 if(yes(answers.medications_regular_use))followups.push("medications_list");
 if(yes(answers.supplements_current_use))followups.push("supplements_current_list","supplement_product_form","supplement_amount_per_unit","supplement_amount_unit");
 if(yes(answers.conditions_allergies))followups.push("conditions_allergies_list");
 if(yes(answers.pro_labs_available))followups.push("pro_labs_details");
 const filteredFollowups=unique(followups).filter(id=>bank.has(id));
 const pending=unique([...ordered,...filteredFollowups]).filter(id=>unknown(answers[id]));
 const safetyMissing=requiredSafety.filter(id=>unknown(answers[id]));
 const conflicts=[];
 if(no(answers.medications_regular_use)&&Array.isArray(answers.medications_list)&&answers.medications_list.length)conflicts.push("MEDICATION_LIST_CONTRADICTS_NO");
 if(no(answers.supplements_current_use)&&Array.isArray(answers.supplements_current_list)&&answers.supplements_current_list.length)conflicts.push("SUPPLEMENT_LIST_CONTRADICTS_NO");
 if(yes(answers.medications_regular_use)&&unknown(answers.medications_list))conflicts.push("MEDICATION_IDENTITY_NOT_CAPTURED");
 if(yes(answers.supplements_current_use)&&unknown(answers.supplements_current_list))conflicts.push("SUPPLEMENT_PRODUCTS_NOT_CAPTURED");
 const nextQuestionId=pending[0]??null;
 return {stages:stagesOutput,followupQuestionIds:filteredFollowups,nextQuestionId,pendingQuestionIds:pending,safetyMissing,conflicts,readyForPersonalization:false,canCompleteDraftIntake:safetyMissing.length===0&&conflicts.length===0&&pending.length===0};
}
