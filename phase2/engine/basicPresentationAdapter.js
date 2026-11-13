'use strict';
/** BASIC presentation adapter. Never promotes a draft rule to a clinical recommendation. */
const REQUIRED = ['supplement_id','display_name','state','state_label','short_reason','why_it_appears','evidence_label','dose_display','important_limit','library_cta','how_to_take','daily_amount_guidance','library_safety_cta'];
const POSITIVE = new Set(['A_high_relevance','B_consider','C_potential_benefit','D_optional_limited']);
function validateCard(card) {
  if (!card || typeof card !== 'object') return {valid:false,missing:REQUIRED};
  const missing = REQUIRED.filter(k => typeof card[k] !== 'string' || !card[k].trim());
  if (POSITIVE.has(card.state)) {
    if (!card.library_url || !/^https:\/\//.test(card.library_url)) missing.push('library_url');
    if (!Array.isArray(card.source_refs) || !card.source_refs.length) missing.push('source_refs');
    if (card.scientific_review_status !== 'reviewed') missing.push('scientific_review_status');
  }
  return {valid:missing.length===0,missing};
}
function renderableBasicCards(engineResult, cardRecords=[]) {
  const byId = new Map(cardRecords.map(c=>[c.supplement_id,c]));
  const cards=[], withheld=[];
  for (const recommendation of engineResult.recommendations || []) {
    const card=byId.get(recommendation.supplement_id);
    const check=validateCard(card);
    if (!check.valid || !POSITIVE.has(recommendation.state) || card.state !== recommendation.state) {
      withheld.push({supplement_id:recommendation.supplement_id,reason:'pending_verified_card',missing:check.missing});
      continue;
    }
    cards.push({...card,score:recommendation.score,matched_rules:recommendation.matched_rules});
  }
  return {cards,withheld,professional_review:engineResult.professional_review || [],followup_questions:engineResult.followup_questions || [],actions:{pro:'optional',cart:'optional_verified_sku_only'}};
}
module.exports={REQUIRED,validateCard,renderableBasicCards};
