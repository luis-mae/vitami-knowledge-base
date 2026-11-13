import assert from "node:assert/strict";
import {checkStrictResultSafety as check} from "./strictSafetyDisclosureGate_v2.mjs";
assert.equal(check().personalizedDoseAllowed,false);
assert.ok(check({items:[]}).issues.includes("NO_VALIDATED_ITEMS"));
assert.ok(check({items:[],clinicalApproval:true}).issues.includes("VERIFIABLE_CLINICAL_APPROVAL_MISSING"));
assert.ok(check({items:[],entryAcknowledged:true,resultsAcknowledged:true}).issues.includes("COMBINATION_REVIEW_INCOMPLETE"));
assert.equal(check({items:[{}]}).structurallyComplete,false);
console.log("5 strict safety gate checks passed");
