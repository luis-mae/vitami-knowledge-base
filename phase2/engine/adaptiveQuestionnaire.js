'use strict';

/**
 * Goal-first questionnaire navigation. Pure and side-effect free.
 * It never computes supplement eligibility or overrides clinical safety rules.
 */
const hasAnswer = value => value !== undefined && value !== null && value !== '' && value !== 'unknown' && !(Array.isArray(value) && value.length === 0);
const unique = values => [...new Set(values)];
function buildQuestionnaireStep({selectedGoals = [], answers = {}, questionBank, goalBank, flow, ruleFollowups = [], locale = 'es'} = {}) {
  if (!questionBank || !Array.isArray(questionBank.questions) || !goalBank || !Array.isArray(goalBank.goals) || !flow) {
    throw new TypeError('questionBank, goalBank and flow are required');
  }
  const questionById = new Map(questionBank.questions.map(q => [q.question_id, q]));
  const validGoals = new Set(goalBank.goals.map(g => g.goal_id));
  const goals = unique(Array.isArray(selectedGoals) ? selectedGoals : []);
  const invalidGoals = goals.filter(g => !validGoals.has(g));
  const max = flow.entry_step.max_selection || 5;
  if (!goals.length || invalidGoals.length || goals.length > max) {
    return {stage:'select_goals', prompt:flow.entry_step.prompt[locale] || flow.entry_step.prompt.es,
      goals:goalBank.goals.map(g => ({id:g.goal_id,label:g.label?.[locale] || g.label?.es || g.goal_id})),
      invalid_goals:invalidGoals, max_selection:max, complete:false};
  }
  const profileIds = (flow.compact_profile_screen?.fields || []).map(f => f.question_id);
  const safetyIds = questionBank.questions.filter(q => q.required_for_safety && q.tier !== 'PRO').map(q => q.question_id);
  const commonIds = questionBank.questions.filter(q => q.required_for_basic && q.tier !== 'PRO').map(q => q.question_id);
  const goalIds = (flow.goal_question_routes || []).filter(route => route.goals.some(g => goals.includes(g))).flatMap(route => route.questions);
  const followups = unique([...ruleFollowups, ...questionBank.questions.flatMap(q => {
    if (!hasAnswer(answers[q.question_id])) return [];
    if (answers[q.question_id] === false || answers[q.question_id] === 'no' || answers[q.question_id] === 'not_applicable') return [];
    return q.logic?.followups || [];
  })]);
  const stages = [
    ['compact_profile_screen',profileIds],
    ['shared_safety_questions',unique([...safetyIds,...commonIds]).filter(id => !profileIds.includes(id))],
    ['goal_specific_questions',goalIds],
    ['rule_requested_followups',followups]
  ];
  const unknownIds = unique(stages.flatMap(s => s[1])).filter(id => !questionById.has(id));
  const seen = new Set();
  for (const [stage, ids] of stages) {
    const questions = [];
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const q = questionById.get(id);
      if (!q || hasAnswer(answers[id])) continue;
      if (q.tier === 'PRO' && stage !== 'compact_profile_screen' && !ruleFollowups.includes(id)) continue;
      if (stage === 'compact_profile_screen' && (id === 'pro_height' || id === 'pro_weight') &&
        !goals.some(g => ['weight_body_composition','sports_performance','strength_muscle','exercise_recovery'].includes(g)) &&
        !ruleFollowups.includes(id)) continue;
      questions.push(q);
    }
    if (questions.length) return {stage,questions,question_ids:questions.map(q => q.question_id),unknown_question_ids:unknownIds,complete:false};
  }
  return {stage:'basic_results',questions:[],question_ids:[],unknown_question_ids:unknownIds,complete:true};
}
module.exports = {buildQuestionnaireStep,hasAnswer};
