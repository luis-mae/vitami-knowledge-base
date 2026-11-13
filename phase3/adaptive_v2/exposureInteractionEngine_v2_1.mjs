const norm=x=>String(x??"").trim().toLowerCase().replace(/[\s-]+/g,"_");
const list=x=>Array.isArray(x)?x:[];
export function auditExposureInteractions({products=[],medications=[],medicationListComplete=false,productLabelsComplete=false,rules=[]}={}){
 const errors=[];if(!medicationListComplete)errors.push("MEDICATIONS_NOT_VERIFIED");if(!productLabelsComplete)errors.push("PRODUCT_LABELS_NOT_VERIFIED");
 const exposures=new Map(),unknown=new Set();
 for(const p of products){if(!p?.labelVerified||!Array.isArray(p.ingredients)){unknown.add(String(p?.productId??"UNKNOWN_PRODUCT"));continue;}
  for(const i of p.ingredients){const id=norm(i?.ingredientId);if(!id){unknown.add(String(p.productId));continue;}
   const prior=exposures.get(id)||{id,amounts:[],products:[]};prior.products.push(p.productId);if(Number.isFinite(i.elementalMgPerDay)&&i.elementalMgPerDay>=0)prior.amounts.push(i.elementalMgPerDay);else prior.amounts.push(null);exposures.set(id,prior);
  }}
 if(unknown.size)errors.push("UNVERIFIED_PRODUCT_COMPOSITION");
 const meds=new Set(medications.map(norm)),alerts=[],pending=[];
 for(const rule of rules){const matched=list(rule.ingredient_ids).filter(x=>exposures.has(norm(x)));if(!matched.length)continue;
  if(rule.type==="drug"){if(!list(rule.drug_names).some(x=>meds.has(norm(x))))continue;alerts.push({id:rule.id,action:rule.action,source:rule.source?.url,claim:rule.claim});continue;}
  if(rule.type==="nutrient"){const co=list(rule.co_ingredient_ids).filter(x=>exposures.has(norm(x)));if(!co.length)continue;const threshold=rule.condition?.co_elemental_iron_mg_gte;
   if(Number.isFinite(threshold)){const values=co.flatMap(x=>exposures.get(norm(x)).amounts);if(values.some(x=>x===null)){pending.push({id:rule.id,reason:"CO_NUTRIENT_AMOUNT_UNKNOWN"});continue;}if(values.reduce((a,b)=>a+b,0)<threshold)continue;}
   if(rule.condition?.same_time===true){const timings=matched.flatMap(x=>exposures.get(norm(x)).products);const cotimings=co.flatMap(x=>exposures.get(norm(x)).products);pending.push({id:rule.id,reason:"COADMINISTRATION_TIMING_UNKNOWN_REQUIRE_PRODUCT_TIMING"});continue;}
   alerts.push({id:rule.id,action:rule.action,source:rule.source?.url,claim:rule.claim});continue;}
  if(rule.type==="nutrient_exposure"){const values=matched.flatMap(x=>exposures.get(norm(x)).amounts);if(values.some(x=>x===null)){pending.push({id:rule.id,reason:"ELEMENTAL_AMOUNT_UNKNOWN"});continue;}
   const sum=values.reduce((a,b)=>a+b,0),limit=rule.condition?.total_elemental_zinc_mg_per_day_gte;if(Number.isFinite(limit)&&sum<limit)continue;
   if(rule.condition?.prolonged_use===true){pending.push({id:rule.id,reason:"DURATION_NOT_VERIFIED_REQUIRE_DAYS"});continue;}
   alerts.push({id:rule.id,action:rule.action,source:rule.source?.url,claim:rule.claim});}
 }
 return {status:errors.length||pending.length?"BLOCKED_UNRESOLVED":alerts.length?"REVIEW_REQUIRED":"NO_MATCHES_NOT_SAFETY_CLEARANCE",errors,pending,alerts,personalizedRecommendationAllowed:false};
}
