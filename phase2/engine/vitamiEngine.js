const fs = require('fs');
const path = require('path');

const LEVEL_ORDER = {
  E_no_current_indication: 0,
  D_optional_limited: 1,
  C_potential_benefit: 2,
  B_consider: 3,
  A_high_relevance: 4
};

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isAnswered(value) {
  return value !== undefined && value !== null && value !== '' && value !== 'unknown';
}

function includesValue(container, expected) {
  if (Array.isArray(container)) return container.includes(expected);
  if (typeof container === 'string') {
    return container.toLowerCase().includes(String(expected).toLowerCase());
  }
  return false;
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;
  const m = value.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function compareNumber(actual, expression) {
  const n = parseNumber(actual);
  if (n === null) return false;
  const m = String(expression).match(/^(>=|<=|>|<|==)\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return false;
  const op = m[1];
  const target = Number(m[2]);
  if (op === '>=') return n >= target;
  if (op === '<=') return n <= target;
  if (op === '>') return n > target;
  if (op === '<') return n < target;
  return n === target;
}

function conditionMatches(condition, answers) {
  const [field, expected] = condition;

  if (field.endsWith('_contains')) {
    const base = field.slice(0, -'_contains'.length);
    return includesValue(answers[base], expected);
  }

  const actual = answers[field];

  if (Array.isArray(actual) && !Array.isArray(expected)) {
    return actual.includes(expected);
  }

  if (Array.isArray(expected)) {
    if (Array.isArray(actual)) return actual.some(v => expected.includes(v));
    return expected.includes(actual);
  }

  if (typeof expected === 'string' && /^(>=|<=|>|<|==)/.test(expected)) {
    return compareNumber(actual, expected);
  }

  return actual === expected;
}

function conditionGroupMatches(group, answers, mode='all') {
  if (!group || group.length === 0) return mode === 'all';
  const values = group.map(c => conditionMatches(c, answers));
  return mode === 'all' ? values.every(Boolean) : values.some(Boolean);
}

function scoreToLevel(score) {
  if (score <= 1) return 'E_no_current_indication';
  if (score <= 3) return 'D_optional_limited';
  if (score <= 5) return 'C_potential_benefit';
  if (score <= 7) return 'B_consider';
  return 'A_high_relevance';
}

function applyCap(level, cap) {
  if (!cap || !(cap in LEVEL_ORDER) || !(level in LEVEL_ORDER)) return level;
  return LEVEL_ORDER[level] > LEVEL_ORDER[cap] ? cap : level;
}

function deriveActivityClasses(answers) {
  const selected = Array.isArray(answers.activity_type)
    ? answers.activity_type
    : answers.activity_type ? [answers.activity_type] : [];
  const intensity = answers.activity_intensity;
  const duration = answers.activity_session_duration;
  const classes = new Set();

  if (selected.includes('strength')) classes.add('strength_power');

  if (selected.some(x => ['running','cycling','swimming'].includes(x))) {
    if (['30-60','60-90','>90'].includes(duration) || !duration) classes.add('endurance');
  }

  if (selected.some(x => ['team_sport','functional'].includes(x))) {
    if (['high','variable'].includes(intensity) || !intensity) classes.add('mixed_high_intensity');
  }

  if (selected.some(x => ['walking','yoga_pilates'].includes(x))) {
    classes.add('low_intensity_general');
  }

  return [...classes];
}

function buildRuleAnswers(rawAnswers) {
  const answers = {...rawAnswers};
  const booleanLikeFields = [
    'profile_pregnancy','profile_lactation','medications_regular_use',
    'conditions_kidney','conditions_liver','conditions_kidney_stones',
    'conditions_bleeding','safety_upcoming_surgery','conditions_thyroid',
    'conditions_heart','symptom_neurologic','swallowing_difficulty',
    'pregnancy_planning'
  ];
  for (const field of booleanLikeFields) {
    if (answers[field] === 'yes') answers[field] = true;
    if (answers[field] === 'no' || answers[field] === 'not_applicable') answers[field] = false;
  }
  const activityClasses = deriveActivityClasses(answers);

  // Compatibility layer between the current Emergent UI values
  // (running, cycling, strength, etc.) and the scientific categories
  // already used by Phase 2 draft rules.
  const originalTypes = Array.isArray(answers.activity_type)
    ? [...answers.activity_type]
    : answers.activity_type ? [answers.activity_type] : [];

  const normalizedTypes = new Set(originalTypes);

  if (activityClasses.includes('strength_power')) normalizedTypes.add('strength');
  if (activityClasses.includes('mixed_high_intensity')) normalizedTypes.add('mixed_high_intensity');
  if (activityClasses.includes('endurance')) normalizedTypes.add('endurance');

  const performanceClasses = activityClasses.filter(x =>
    ['strength_power','mixed_high_intensity','endurance'].includes(x)
  );

  if (performanceClasses.length === 1 && performanceClasses[0] === 'endurance') {
    normalizedTypes.add('endurance_only');
  }

  answers.activity_type = [...normalizedTypes];
  return {answers, activityClasses};
}

function evaluateRules(rawAnswers, rules) {
  const {answers, activityClasses} = buildRuleAnswers(rawAnswers);
  const states = {};

  for (const rule of rules) {
    const allMatch = conditionGroupMatches(rule.conditions?.all || [], answers, 'all');
    const anyGroup = rule.conditions?.any || [];
    const anyMatch = anyGroup.length === 0 ? true : conditionGroupMatches(anyGroup, answers, 'any');

    if (!(allMatch && anyMatch)) continue;

    const sid = rule.supplement_id;
    if (!states[sid]) {
      states[sid] = {
        score: 0,
        caps: [],
        override: null,
        requestedQuestions: [],
        effects: [],
        reasonCodes: [],
        matchedRules: [],
        evidenceRefs: new Set()
      };
    }

    const state = states[sid];
    const effect = rule.effect || {};
    state.score += effect.score_delta || 0;
    if (effect.recommendation_cap) state.caps.push(effect.recommendation_cap);
    if (effect.override_result) state.override = effect.override_result;
    for (const q of (effect.ask_questions || [])) state.requestedQuestions.push(q);
    state.effects.push(effect.type);
    state.reasonCodes.push(rule.rule_id.toLowerCase());
    state.matchedRules.push(rule.rule_id);
    for (const ref of (rule.evidence_refs || [])) state.evidenceRefs.add(ref);
  }

  const recommendations = [];

  for (const [supplementId, state] of Object.entries(states)) {
    let level = state.override || scoreToLevel(state.score);
    if (!state.override) {
      for (const cap of state.caps) level = applyCap(level, cap);
    }

    const unanswered = [...new Set(state.requestedQuestions)]
      .filter(q => !isAnswered(rawAnswers[q]));

    recommendations.push({
      supplement_id: supplementId,
      state: level,
      score: state.score,
      decision_status:
        unanswered.length && !String(level).startsWith('X_')
          ? 'provisional_pending_questions'
          : 'complete_for_available_draft_rules',
      followup_questions: unanswered,
      reason_codes: [...new Set(state.reasonCodes)],
      matched_rules: state.matchedRules,
      effects: [...new Set(state.effects)],
      source_refs: [...state.evidenceRefs]
    });
  }

  recommendations.sort((a,b) => {
    const ax = String(a.state).startsWith('X_') ? 1 : 0;
    const bx = String(b.state).startsWith('X_') ? 1 : 0;
    if (ax !== bx) return bx - ax;
    return b.score - a.score;
  });

  return {activityClasses, recommendations};
}

function indexById(items, field='id') {
  return Object.fromEntries(items.map(x => [x[field], x]));
}

function buildBasicResponse({
  locale='es',
  sessionId='',
  rawAnswers={},
  rules=[],
  libraryRecords=[],
  doseRules=[]
}) {
  const evaluated = evaluateRules(rawAnswers, rules);
  const library = indexById(libraryRecords, 'id');
  const doseIndex = indexById(doseRules, 'supplement_id');

  const followups = [];
  const professional = [];
  const positive = [];
  const notRecommended = [];

  for (const rec of evaluated.recommendations) {
    for (const q of rec.followup_questions) {
      followups.push({
        question_id: q,
        reason_code: `needed_for_${rec.supplement_id}`,
        priority: String(rec.state).startsWith('X_') ? 'high' : 'normal'
      });
    }

    const enriched = {
      ...rec,
      library_record_id: library[rec.supplement_id] ? rec.supplement_id : null,
      dose_status: doseIndex[rec.supplement_id]?.status || 'not_defined'
    };

    if (String(rec.state).startsWith('X_')) {
      professional.push({
        supplement_id: rec.supplement_id,
        reason_codes: rec.reason_codes,
        source_refs: rec.source_refs
      });
    } else if (['A_high_relevance','B_consider','C_potential_benefit','D_optional_limited'].includes(rec.state)) {
      positive.push(enriched);
    } else {
      notRecommended.push(enriched);
    }
  }

  const uniqueFollowups = [];
  const seen = new Set();
  for (const f of followups) {
    if (!seen.has(f.question_id)) {
      uniqueFollowups.push(f);
      seen.add(f.question_id);
    }
  }

  let overall = 'complete';
  if (professional.length) overall = 'professional_review_present';
  else if (uniqueFollowups.length) overall = 'needs_more_answers';

  return {
    contract_version: '1.1.0',
    locale,
    session_id: sessionId,
    overall_status: overall,
    derived_profile: {
      activity_classes: evaluated.activityClasses,
      diet_flags: [],
      safety_flags: professional.map(x => x.supplement_id)
    },
    followup_questions: uniqueFollowups,
    recommendations: positive,
    not_recommended: notRecommended,
    professional_review: professional
  };
}

function loadVitamiRepository(repoRoot) {
  const rulesDir = path.join(repoRoot, 'phase2', 'draft_rules');
  const doseDir = path.join(repoRoot, 'phase2', 'dose_frequency_rules');
  const libraryDir = path.join(repoRoot, 'phase2', 'library');

  const rules = fs.readdirSync(rulesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => loadJson(path.join(rulesDir, f)))
    .filter(x => x && x.rule_id && x.supplement_id);

  const doseRules = fs.existsSync(doseDir)
    ? fs.readdirSync(doseDir)
        .filter(f => f.endsWith('.json') && f !== 'DOSE_RULE_INDEX.json')
        .map(f => loadJson(path.join(doseDir, f)))
    : [];

  const libraryRecords = fs.readdirSync(libraryDir)
    .filter(f => f.endsWith('.json') && !['LIBRARY_INDEX.json','recommendation_state_texts.json'].includes(f))
    .map(f => loadJson(path.join(libraryDir, f)));

  return {rules, doseRules, libraryRecords};
}

module.exports = {
  buildBasicResponse,
  evaluateRules,
  deriveActivityClasses,
  loadVitamiRepository
};