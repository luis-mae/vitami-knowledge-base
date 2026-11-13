'use strict';
/** Prevent duplicate supplement cards and ambiguous scientific record selection. */
function auditAssetIds({rules=[],libraryRecords=[],doseRules=[],cardRecords=[]}={}) {
  const issues=[];
  for (const [kind,records,field] of [['library',libraryRecords,'id'],['dose',doseRules,'supplement_id'],['cards',cardRecords,'supplement_id'],['rules',rules,'rule_id']]) {
    const seen=new Set();
    for (const record of records) {
      const id=record?.[field];
      if (typeof id!=='string'||!id.trim()) {issues.push({kind,reason:'missing_id'});continue;}
      if (seen.has(id)) issues.push({kind,id,reason:'duplicate_id'});
      seen.add(id);
    }
  }
  return {valid:issues.length===0,issues};
}
module.exports={auditAssetIds};
