/* VITAMI v2 adaptive questionnaire prototype.
 * Navigation only. NEVER generates supplement doses or clinical advice.
 * ES module; pure deterministic functions; no dependencies.
 */
import master from "./questionnaire_master.json" with { type: "json" };
import routes from "./branching_rules_draft.json" with { type: "json" };
import map from "./canonical_question_mapping_v2.json" with { type: "json" };
import candidateMap from "./goal_ingredient_candidate_map.json" with { type: "json" };

const GOALS = new Set(master.goal_selection.goals.map(g => g.id));
const GROUPS = [
  ["omega_3_epa_dha","algal_omega3_dha"],["calcium","calcium_citrate"],
  ["iron","iron_bisglycinate"],["magnesium","magnesium_citrate","magnesium_glycinate"],
  ["vitamin_b12","methylcobalamin"],["folate_folic_acid","methylfolate_5mthf"],
  ["vitamin_d","vitamin_d3"],["zinc","zinc_gluconate"]
];
const parentById = new Map(GROUPS.flatMap(([parent,...variants]) => variants.map(v => [v,parent])));
const unique = xs => [...new Set(xs)];
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
function canonicalIds(id) {
  if (map.split_fields[id]) return map.split_fields[id];
  return [map.aliases[id] || id];
}
function knownAnswer(answers,id) {
  return own(answers,id) && answers[id] !== null && answers[id] !== undefined && answers[id] !== "";
}
function conditionMatches(when,goals,answers) {
  if (when.goal) return goals.includes(when.goal);
  if (when.answer) return Object.entries(when.answer).every(([k,v]) => {
    const ids=canonicalIds(k);
    return ids.some(id => knownAnswer(answers,id) && answers[id] === v);
  });
  return false;
}
export function validateGoals(goals) {
  if (!Array.isArray(goals) || goals.length < 1 || goals.length > 5 ||
      new Set(goals).size !== goals.length || goals.some(g => !GOALS.has(g)))
    throw new Error("Choose 1–5 distinct valid goal IDs in priority order");
  return [...goals];
}
export function candidateIngredients(goals) {
  validateGoals(goals);
  return unique(goals.flatMap(g => candidateMap.goals[g] || [])
    .map(id => parentById.get(id) || id));
}
export function nextQuestions({goals,answers={},bankIds=[]}) {
  validateGoals(goals);
  if (!answers || typeof answers !== "object" || Array.isArray(answers))
    throw new Error("answers must be an object");
  const bank = new Set(bankIds);
  const pending=[],unresolved=[];
  const add=(id,reason) => {
    for (const canon of canonicalIds(id)) {
      if (!bank.has(canon)) { unresolved.push({requested:id,canonical:canon,reason}); continue; }
      if (!knownAnswer(answers,canon)) pending.push(canon);
    }
  };
  // Safety triage is free and occurs before adaptive goals. Product-specific
  // gates remain necessary in the clinically approved downstream engine.
  for (const id of ["profile_age","profile_pregnancy","profile_lactation",
      "medications_regular_use","conditions_kidney","conditions_liver",
      "conditions_heart","conditions_other_relevant"]) add(id,"baseline_safety");
  for (const q of master.common_questions) add(q.id,"baseline_profile");
  for (const branch of routes.branches) {
    if (conditionMatches(branch.when,goals,answers))
      for (const id of branch.ask || []) add(id,"adaptive");
  }
  return {questions:unique(pending),unresolved:unique(unresolved.map(x=>JSON.stringify(x))).map(x=>JSON.parse(x)),
    candidates:candidateIngredients(goals), status:"NAVIGATION_ONLY_NO_RECOMMENDATIONS"};
}
export function safetyDecision({ingredient,answers={}}) {
  // Conservative demonstration, NOT a substitute for ingredient-level rules.
  if (ingredient === "creatine_monohydrate" && answers.conditions_kidney === true)
    return {state:"professional_review_required",personalizedDoseAllowed:false};
  if (ingredient === "creatine_monohydrate" && !knownAnswer(answers,"conditions_kidney"))
    return {state:"needs_more_answers",personalizedDoseAllowed:false};
  if (ingredient === "iron")
    return {state:"professional_review_required_for_treatment",personalizedDoseAllowed:false};
  if (ingredient === "probiotics")
    return {state:"strain_specific_evidence_required",personalizedDoseAllowed:false};
  return {state:"draft_not_approved",personalizedDoseAllowed:false};
}
