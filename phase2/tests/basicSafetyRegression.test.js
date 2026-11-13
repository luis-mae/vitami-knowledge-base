const assert = require('node:assert/strict');
const { buildBasicResponse } = require('../engine/vitamiEngine');

const base = {
  supplement_id: 'test_supplement',
  conditions: { all: [], any: [] },
  evidence_refs: ['TEST_SOURCE']
};
const rules = [
  { ...base, rule_id: 'TEST_POSITIVE', effect: { score_delta: 8, ask_questions: ['conditions_kidney'] } }
];

function run(answers, activeRules = rules) {
  return buildBasicResponse({ rawAnswers: answers, rules: activeRules });
}

// Missing critical answer must not become an actionable positive recommendation.
const pending = run({});
assert.equal(pending.overall_status, 'needs_more_answers');
assert.equal(pending.recommendations.length, 0);
assert.deepEqual(pending.followup_questions.map(x => x.question_id), ['conditions_kidney']);
assert.equal(pending.not_recommended[0].display_status, 'pending_required_answers');

// Explicit 'no' is a valid answer and must not be treated as missing.
const complete = run({ conditions_kidney: false });
assert.equal(complete.overall_status, 'complete');
assert.equal(complete.recommendations.length, 1);
assert.equal(complete.recommendations[0].state, 'A_high_relevance');

// A professional review flag must never become a positive card.
const blocked = run({ conditions_kidney: true }, [
  { ...base, rule_id: 'TEST_BLOCK', effect: { override_result: 'X_professional_review_required' } }
]);
assert.equal(blocked.recommendations.length, 0);
assert.equal(blocked.professional_review.length, 1);
assert.equal(blocked.overall_status, 'professional_review_present');

// No matching rule should not force a recommendation.
const empty = run({}, [{ ...base, rule_id: 'TEST_NO_MATCH', conditions: { all: [['diet_type', 'vegan']] }, effect: { score_delta: 8 } }]);
assert.equal(empty.recommendations.length, 0);
assert.equal(empty.overall_status, 'complete');

console.log('Vitami BASIC safety regression: 4 scenarios passed');
