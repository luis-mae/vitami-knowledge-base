const path = require('path');
const {loadVitamiRepository, buildBasicResponse} = require('../vitamiEngine');
const fixtures = require('./fixtures.json').fixtures;

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const repo = loadVitamiRepository(repoRoot);

function findState(response, supplementId) {
  const all = [
    ...response.recommendations,
    ...response.not_recommended,
    ...response.professional_review.map(x => ({supplement_id:x.supplement_id, state:'X_professional_review_required'}))
  ];
  return all.find(x => x.supplement_id === supplementId)?.state;
}

let failures = [];

for (const fx of fixtures) {
  const response = buildBasicResponse({
    locale:'es',
    sessionId:fx.id,
    rawAnswers:fx.answers,
    ...repo
  });

  for (const [sid, allowed] of Object.entries(fx.assert?.contains_state || {})) {
    const actual = findState(response, sid);
    if (!allowed.includes(actual)) {
      failures.push(`${fx.id}: ${sid} expected one of ${allowed.join(', ')} but got ${actual}`);
    }
  }

  for (const [sid, forbidden] of Object.entries(fx.assert?.not_state || {})) {
    const actual = findState(response, sid);
    if (actual === forbidden) {
      failures.push(`${fx.id}: ${sid} must not be ${forbidden}`);
    }
  }
}

if (failures.length) {
  console.error('Vitami test failures:');
  failures.forEach(x => console.error('-', x));
  process.exit(1);
}

console.log(`OK: ${fixtures.length} Vitami deterministic fixtures passed.`);