'use strict';

/** Conservative adapter from original Expo questionnaire to the scientific engine.
 * Never invent a clinical answer; unknown or ambiguous inputs remain unresolved.
 */
const yes = v => v === true || v === 'Sí' || v === 'yes';
const no = v => v === false || v === 'No' || v === 'no';
const has = (v, x) => Array.isArray(v) && v.includes(x);
function adaptLegacyAnswers(raw = {}) {
  const answers = {};
  const unresolved = [];
  const warnings = [];
  const set = (key, value) => { if (value !== undefined && value !== null && value !== '') answers[key] = value; };
  const number = (value, min, max) => {
    if (typeof value !== 'string' && typeof value !== 'number') return undefined;
    if (String(value).trim() === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
  };
  set('profile_age', number(raw.edad, 0, 120));
  set('pro_height', number(raw.altura, 50, 250));
  set('pro_weight', number(raw.peso, 10, 400));
  const diet = {'Variada o como de todo':'omnivore','Vegetariana':'vegetarian','Vegana':'vegan','Mayormente basada en plantas':'mostly_plant_based','Baja en carbohidratos':'low_carb'};
  set('diet_type', diet[raw.alimentacion]);
  // Legacy activity is frequency, not the intensity scale of canonical activity_level.
  if (raw.actividad !== undefined) unresolved.push('activity_level');
  if (raw.sexo !== undefined) unresolved.push('profile_sex_reference');
  if (raw.pescado !== undefined) unresolved.push('diet_fatty_fish_weekly');
  if (raw.sueno !== undefined) unresolved.push('sleep_hours');
  if (raw.embarazo === 'Embarazo') { set('profile_pregnancy','yes'); set('profile_lactation','unknown'); }
  else if (raw.embarazo === 'Lactancia') { set('profile_lactation','yes'); set('profile_pregnancy','unknown'); }
  else if (raw.embarazo === 'No corresponde') {
    set('profile_pregnancy','not_applicable'); set('profile_lactation','not_applicable');
  } else if (raw.embarazo !== undefined) unresolved.push('profile_pregnancy','profile_lactation');
  const conditions = raw.enfermedades;
  if (Array.isArray(conditions)) {
    if (conditions.length === 1 && conditions[0] === 'Ninguna') {
      set('conditions_kidney',false); set('conditions_liver',false); set('conditions_heart',false);
    } else if (conditions.includes('Ninguna') || !conditions.length) {
      unresolved.push('conditions_kidney','conditions_liver','conditions_heart');
      warnings.push('Conflicting or empty disease answers');
    } else {
      set('conditions_kidney',has(conditions,'Renal'));
      set('conditions_liver',has(conditions,'Hepática'));
      set('conditions_heart',has(conditions,'Cardíaca'));
      if (has(conditions,'Otra')) unresolved.push('conditions_other_relevant');
    }
  }
  const meds = raw.medicamentos;
  if (Array.isArray(meds)) {
    if (meds.length === 1 && meds[0] === 'no tomo medicamentos') set('medications_regular_use',false);
    else if (meds.length && !meds.includes('no tomo medicamentos')) {
      set('medications_regular_use',true);
      set('medications_list',meds.filter(x=>x!=='otros').concat(typeof raw.medicamentosOtros==='string'&&raw.medicamentosOtros.trim()?[raw.medicamentosOtros.trim()]:[]));
      if (has(meds,'otros') && !raw.medicamentosOtros?.trim()) unresolved.push('medications_list');
    } else { unresolved.push('medications_regular_use'); warnings.push('Conflicting or empty medication answers'); }
  }
  const supplements = raw.suplementos;
  if (Array.isArray(supplements)) {
    if (supplements.length === 1 && supplements[0] === 'no tomo ninguno') set('supplements_current_use',false);
    else if (supplements.length && !supplements.includes('no tomo ninguno')) {
      set('supplements_current_use',true);
      set('supplements_current_list',supplements);
    } else { unresolved.push('supplements_current_use'); warnings.push('Conflicting or empty supplement answers'); }
  }
  if (raw.cirugia !== undefined) {
    if (yes(raw.cirugia)) set('safety_upcoming_surgery',true);
    else if (no(raw.cirugia)) set('safety_upcoming_surgery',false);
    else unresolved.push('safety_upcoming_surgery');
  }
  if (raw.alergias === 'Sí, alergia relevante') {
    set('conditions_allergies',true);
    unresolved.push('conditions_allergies_details');
  } else if (raw.alergias === 'No') set('conditions_allergies',false);
  const critical = ['conditions_kidney','medications_regular_use','supplements_current_use','safety_upcoming_surgery'];
  const missingCritical = critical.filter(k => answers[k] === undefined);
  return {answers,unresolved:[...new Set(unresolved)],warnings,missing_critical:missingCritical,
    eligible_for_automatic_recommendations:missingCritical.length===0 && unresolved.filter(x=>x.startsWith('profile_pregnancy')||x.startsWith('profile_lactation')).length===0};
}
module.exports = {adaptLegacyAnswers};
