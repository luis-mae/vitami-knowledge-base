'use strict';
const assert = require('node:assert/strict');
const {buildQuestionnaireStep} = require('../engine/adaptiveQuestionnaire');
const bank = {questions:[
  {question_id:'profile_age',tier:'BASIC',required_for_basic:true},
  {question_id:'profile_sex_reference',tier:'BASIC',required_for_basic:true},
  {question_id:'conditions_kidney',tier:'BASIC',required_for_safety:true},
  {question_id:'symptom_sleep',tier:'BASIC'},
  {question_id:'sleep_hours',tier:'BASIC'},
  {question_id:'supplements_current_use',tier:'BASIC',required_for_safety:true,logic:{followups:['supplements_current_list']}},
  {question_id:'supplements_current_list',tier:'BASIC'},
  {question_id:'pro_weight',tier:'PRO'}
]};
const goals = {goals:[{goal_id:'sleep_rest',label:{es:'Dormir'}},{goal_id:'strength_muscle',label:{es:'Músculo'}}]};
const flow = {entry_step:{prompt:{es:'¿Qué te gustaría lograr o mejorar?'},max_selection:5},compact_profile_screen:{fields:[{question_id:'profile_age'},{question_id:'profile_sex_reference'},{question_id:'pro_weight'}]},goal_question_routes:[{goals:['sleep_rest'],questions:['symptom_sleep','sleep_hours']}]};
const run = (selectedGoals,answers={},ruleFollowups=[]) => buildQuestionnaireStep({selectedGoals,answers,questionBank:bank,goalBank:goals,flow,ruleFollowups});
assert.equal(run([]).stage,'select_goals');
assert.deepEqual(run(['sleep_rest']).question_ids,['profile_age','profile_sex_reference']);
assert.equal(run(['sleep_rest'],{profile_age:32,profile_sex_reference:'female'}).stage,'shared_safety_questions');
assert.deepEqual(run(['sleep_rest'],{profile_age:32,profile_sex_reference:'female',conditions_kidney:'no',supplements_current_use:'no'}).question_ids,['symptom_sleep','sleep_hours']);
assert.deepEqual(run(['sleep_rest'],{profile_age:32,profile_sex_reference:'female',conditions_kidney:'no',supplements_current_use:'yes'}).question_ids,['symptom_sleep','sleep_hours']);
assert.equal(run(['sleep_rest'],{profile_age:32,profile_sex_reference:'female',conditions_kidney:'no',supplements_current_use:'yes',symptom_sleep:'poor',sleep_hours:6}).stage,'rule_requested_followups');
assert.equal(run(['sleep_rest'],{profile_age:32,profile_sex_reference:'female',conditions_kidney:'no',supplements_current_use:'no',symptom_sleep:'poor',sleep_hours:6}).complete,true);
assert.equal(run(['not_real']).stage,'select_goals');
console.log('adaptiveQuestionnaire: 8 assertions passed');
