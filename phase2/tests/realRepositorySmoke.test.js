'use strict';
/** Audit actual repository assets without treating draft scientific material as approved. */
const {loadVitamiRepository,buildBasicResponse}=require('../engine/vitamiEngine');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const assets=loadVitamiRepository(root);
assert.ok(assets.rules.length>0,'real rules must load');
assert.ok(assets.libraryRecords.length>0,'real library must load');
assert.ok(assets.doseRules.length>0,'real dose rules must load');
const ids=new Set(assets.libraryRecords.map(r=>r.id));
assert.equal(ids.size,assets.libraryRecords.length,'duplicate library IDs');
const missingLibrary=[...new Set(assets.rules.map(r=>r.supplement_id).filter(id=>!ids.has(id)))];
const result=buildBasicResponse({rawAnswers:{profile_age:35},...assets});
assert.ok(Array.isArray(result.recommendations));
assert.ok(Array.isArray(result.professional_review));
assert.ok(Array.isArray(result.followup_questions));
assert.ok(result.recommendations.every(r=>r.library_record_id && r.dose_status==='reviewed'),'draft content cannot produce positive cards');
console.log(JSON.stringify({audit:'repository-assets',rules:assets.rules.length,library:assets.libraryRecords.length,doseRules:assets.doseRules.length,missingLibrary,positive:result.recommendations.length},null,2));
