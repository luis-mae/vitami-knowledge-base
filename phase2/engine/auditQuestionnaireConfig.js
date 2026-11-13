'use strict';
/** Validate the real goal-first questionnaire contract before serving a session. */
function auditQuestionnaireConfig({questionBank,goalBank,flow}={}) {
  const issues=[];
  if (!Array.isArray(questionBank?.questions)||!Array.isArray(goalBank?.goals)||!flow?.entry_step) return {valid:false,issues:[{type:'missing_configuration'}]};
  const questions=new Set(questionBank.questions.map(q=>q.question_id));
  const goals=new Set(goalBank.goals.map(g=>g.goal_id));
  const seenQuestions=new Set(),seenGoals=new Set();
  for (const q of questionBank.questions) {if(seenQuestions.has(q.question_id))issues.push({type:'duplicate_question',id:q.question_id});seenQuestions.add(q.question_id);}
  for (const g of goalBank.goals) {if(seenGoals.has(g.goal_id))issues.push({type:'duplicate_goal',id:g.goal_id});seenGoals.add(g.goal_id);}
  for (const field of flow.compact_profile_screen?.fields||[]) if (!questions.has(field.question_id)) issues.push({type:'unknown_profile_question',id:field.question_id});
  for (const route of flow.goal_question_routes||[]) {
    for (const g of route.goals||[]) if (!goals.has(g)) issues.push({type:'unknown_goal',id:g});
    for (const q of route.questions||[]) if (!questions.has(q)) issues.push({type:'unknown_routed_question',id:q});
  }
  for (const q of questionBank.questions) for (const id of q.logic?.followups||[]) if (!questions.has(id)) issues.push({type:'unknown_conditional_followup',id,source:q.question_id});
  return {valid:issues.length===0,issues,counts:{questions:questions.size,goals:goals.size,routes:(flow.goal_question_routes||[]).length}};
}
module.exports={auditQuestionnaireConfig};
