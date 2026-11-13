'use strict';
/** Non-destructive cross-reference audit; missing links are reported, never invented. */
function auditScientificReferences({rules=[],libraryRecords=[],doseRules=[],questionBank={questions:[]}}={}) {
  const issues=[];
  const libraryIds=new Set(libraryRecords.map(x=>x.id));
  const questionIds=new Set((questionBank.questions||[]).map(x=>x.question_id));
  const doseIds=new Set(doseRules.map(x=>x.supplement_id));
  for (const rule of rules) {
    if (!libraryIds.has(rule.supplement_id)) issues.push({type:'rule_without_library',rule_id:rule.rule_id,supplement_id:rule.supplement_id});
    for (const q of rule.effect?.ask_questions||[]) if (!questionIds.has(q)) issues.push({type:'unknown_followup_question',rule_id:rule.rule_id,question_id:q});
  }
  for (const dose of doseRules) if (!libraryIds.has(dose.supplement_id)) issues.push({type:'dose_without_library',supplement_id:dose.supplement_id});
  for (const record of libraryRecords) {
    if (!Array.isArray(record.source_refs)||record.source_refs.length===0) issues.push({type:'library_missing_sources',supplement_id:record.id});
  }
  return {valid:issues.length===0,issues,counts:{rules:rules.length,library:libraryRecords.length,dose:doseRules.length,questions:questionIds.size}};
}
module.exports={auditScientificReferences};
