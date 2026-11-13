'use strict';
/** Strict UI -> canonical answer mapping. Never guess or coerce clinical meaning. */
function normalizeAnswers(rawAnswers={},config={}) {
  if (!rawAnswers || typeof rawAnswers!=='object' || Array.isArray(rawAnswers)) throw new TypeError('answers must be an object');
  const aliases=config.field_aliases || {};
  const maps=config.value_maps || {};
  const answers={};
  const conflicts=[];
  for (const [inputKey,value] of Object.entries(rawAnswers)) {
    const key=Object.prototype.hasOwnProperty.call(aliases,inputKey)?aliases[inputKey]:inputKey;
    if (typeof key!=='string' || !/^[a-z][a-z0-9_]*$/.test(key)) {conflicts.push({field:inputKey,reason:'invalid_field_alias'});continue;}
    const valueMap=maps[key] || {};
    const normalized=typeof value==='string' && Object.prototype.hasOwnProperty.call(valueMap,value)?valueMap[value]:value;
    if (Object.prototype.hasOwnProperty.call(answers,key) && JSON.stringify(answers[key])!==JSON.stringify(normalized)) {
      conflicts.push({field:key,reason:'conflicting_alias_values'});
      continue;
    }
    answers[key]=normalized;
  }
  return {answers,conflicts,valid:conflicts.length===0};
}
module.exports={normalizeAnswers};
