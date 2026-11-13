// VITAMI research prototype. No clinical authorization or personalized recommendation.
const norm=x=>String(x??"").trim().toLowerCase().replace(/[\\s-]+/g,"_");
const aliases={zinc_gluconate:"zinc",zinc_picolinate:"zinc",iron_bisglycinate:"iron",ferrous_sulfate:"iron",magnesium_glycinate:"magnesium",magnesium_citrate:"magnesium",magnesium_oxide:"magnesium",vitamin_k2_mk4:"vitamin_k",vitamin_k2_mk7:"vitamin_k"};
const canonical=x=>aliases[norm(x)]??norm(x);
const list=x=>Array.isArray(x)?x:[];
const validNumber=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
export function auditExposureInteractionsV3({products=[],medications=[],medicationListComplete=false,productLabelsComplete=false,rules=[]}={}){
 const errors=[],alerts=[],pending=[],exposures=new Map();
 if(!medicationListComplete||!Array.isArray(medications))errors.push("MEDICATION_LIST_NOT_VERIFIED");
 if(!productLabelsComplete||!Array.isArray(products))errors.push("PRODUCT_LABELS_NOT_VERIFIED");
 for(const product of list(products)){
  if(!product||product.labelVerified!==true||!Array.isArray(product.ingredients)||!product.ingredients.length){errors.push("PRODUCT_COMPOSITION_UNKNOWN:"+String(product?.productId??"unknown"));continue;}
  for(const ingredient of product.ingredients){
   const id=canonical(ingredient?.ingredientId);
   if(!id){errors.push("INGREDIENT_ID_UNKNOWN:"+String(product.productId));continue;}
   const amount=ingredient.elementalMgPerDay;
   const entry={productId:product.productId,amount:validNumber(amount)?amount:null,timing:ingredient.timing??product.timing??null,durationDays:ingredient.durationDays??product.durationDays??null};
   if(!exposures.has(id))exposures.set(id,[]);
   exposures.get(id).push(entry);
  }
 }
 const meds=new Set(list(medications).map(norm));
 const entries=ids=>list(ids).flatMap(id=>exposures.get(canonical(id))??[]);
 for(const rule of list(rules)){
  const ingredientIds=list(rule.ingredient_ids).filter(x=>canonical(x)!=="multivitamin_mineral");
  const matched=entries(ingredientIds);if(!matched.length)continue;
  if(rule.type==="drug"){
   if(rule.id==="MULTIVITAMIN_WARFARIN")continue; // Covered only by confirmed vitamin K ingredient rule.
   if(!medicationListComplete){pending.push({id:rule.id,reason:"MEDICATION_LIST_UNKNOWN"});continue;}
   if(!list(rule.drug_names).some(x=>meds.has(norm(x))))continue;
   // A multivitamin is not proof of vitamin K; only actual ingredient rows match.
   alerts.push({id:rule.id,action:rule.action,source:rule.source?.url});continue;
  }
  if(rule.type==="nutrient"){
   const co=entries(rule.co_ingredient_ids);if(!co.length)continue;
   const limit=rule.condition?.co_elemental_iron_mg_gte;
   if(validNumber(limit)){
    if(co.some(x=>x.amount===null)){pending.push({id:rule.id,reason:"CO_NUTRIENT_AMOUNT_UNKNOWN"});continue;}
    if(co.reduce((s,x)=>s+x.amount,0)<limit)continue;
   }
   if(rule.condition?.same_time===true){
    if([...matched,...co].some(x=>!x.timing)){pending.push({id:rule.id,reason:"TIMING_UNKNOWN"});continue;}
    if(!matched.some(a=>co.some(b=>a.timing===b.timing)))continue;
   }
   alerts.push({id:rule.id,action:rule.action,source:rule.source?.url});continue;
  }
  if(rule.type==="nutrient_exposure"){
   if(matched.some(x=>x.amount===null)){pending.push({id:rule.id,reason:"DOSE_UNKNOWN"});continue;}
   const limit=rule.condition?.total_elemental_zinc_mg_per_day_gte;
   if(validNumber(limit)&&matched.reduce((s,x)=>s+x.amount,0)<limit)continue;
   if(rule.condition?.prolonged_use===true){
    if(matched.some(x=>!validNumber(x.durationDays))){pending.push({id:rule.id,reason:"DURATION_UNKNOWN"});continue;}
    if(matched.every(x=>x.durationDays<28))continue;
   }
   alerts.push({id:rule.id,action:rule.action,source:rule.source?.url});
  }
 }
 return {status:errors.length||pending.length?"BLOCKED_UNRESOLVED":alerts.length?"REVIEW_REQUIRED":"NO_MATCHES_NOT_SAFETY_CLEARANCE",errors,pending,alerts,exposures:[...exposures].map(([ingredientId,rows])=>({ingredientId,totalMg:rows.every(x=>x.amount!==null)?rows.reduce((s,x)=>s+x.amount,0):null,productCount:rows.length})),personalizedRecommendationAllowed:false};
}
