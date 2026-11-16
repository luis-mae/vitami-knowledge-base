#!/usr/bin/env python3
"""Non-destructive VITAMI master fiche migration. Run from repository root.
Preserves every legacy JSON record, original source IDs and claim provenance.
No claim becomes clinically active automatically.
"""
import json
from pathlib import Path
from collections import defaultdict

ROOT=Path(__file__).resolve().parents[1]
LIB=ROOT/"phase2/library"
DEEP=ROOT/"phase2/deep_records"
CLAIMS=ROOT/"data/evidence_claims"
OUT=ROOT/"migration/master_fiches"
FIELDS=("what_it_is","common_uses","why_vitami_may_show_it","evidence_summary","limits","dose_reference","precautions","when_to_consult")
def load(p):
    return json.loads(p.read_text(encoding="utf-8"))
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    claim_by_ingredient=defaultdict(list)
    for p in sorted(CLAIMS.glob("*.json")):
        d=load(p)
        if not isinstance(d,dict) or not d.get("ingredient_id"):continue
        claim_by_ingredient[d["ingredient_id"]].append({
            "legacy_path":p.relative_to(ROOT).as_posix(),
            "evidence_claim_id":d.get("evidence_claim_id"),
            "claim_text":d.get("claim_text"),
            "source_ids":d.get("source_ids",[]),
            "review_status":d.get("review_status"),
            "approved_for_user_display":d.get("approved_for_user_display",False),
            "approved_for_rule_activation":d.get("approved_for_rule_activation",False),
            "original":d})
    stats={"library_records":0,"deep_records_attached":0,"claims_attached":0,"without_record_sources":0,"missing_field_specific_citations":0}
    index=[]
    for p in sorted(LIB.glob("*.json")):
        d=load(p)
        if not isinstance(d,dict) or not isinstance(d.get("id"),str):continue
        id=d["id"]
        dp=DEEP/(id+".json")
        deep=load(dp) if dp.exists() else None
        sources=list(dict.fromkeys((d.get("source_refs") or [])+((deep or {}).get("source_refs") or [])))
        claims=claim_by_ingredient.get(id,[])
        assertions=[{"field":k,"original_text":d[k],"legacy_path":p.relative_to(ROOT).as_posix(),
                     "legacy_json_pointer":"/"+k,"candidate_record_source_ids":d.get("source_refs",[]),
                     "claim_specific_source_ids":[],"citation_verification":"pending_field_specific_verification",
                     "approved_for_recommendation":False} for k in FIELDS if k in d]
        record={"schema_version":"1.1.0","id":id,"migration_status":"migrated_not_clinically_approved",
                "identity":{"title":d.get("title"),"id":id},
                "legacy":{"library_path":p.relative_to(ROOT).as_posix(),"library_original":d,
                          "deep_path":dp.relative_to(ROOT).as_posix() if deep is not None else None,
                          "deep_original":deep},
                "source_ids_preserved":sources,"assertions":assertions,
                "evidence_claims":claims,
                "administration":{"protocols":[],"timing_interactions":[],"review_status":"pending"},
                "safety":{"contraindications":[],"interactions":[],"review_status":"pending"},
                "regulatory":{"country_rules":[],"review_status":"pending"},
                "commercial":{"supplier_products":[]},
                "question_ids_preserved":(deep or {}).get("required_questions",[]),
                "safety_question_ids_preserved":(deep or {}).get("safety_questions",[]),
                "topics":[],"articles":[],
                "activation_gate":"requires_individually_verified_sources_and_clinical_safety_review"}
        (OUT/(id+".json")).write_text(json.dumps(record,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        stats["library_records"]+=1
        stats["deep_records_attached"]+=int(deep is not None)
        stats["claims_attached"]+=len(claims)
        stats["without_record_sources"]+=int(not sources)
        stats["missing_field_specific_citations"]+=len(assertions)
        index.append({"id":id,"source_ids":sources,"evidence_claim_count":len(claims),"deep_record":deep is not None,"status":record["migration_status"]})
    (OUT/"_migration_report.json").write_text(json.dumps({"statistics":stats,"records":index},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(stats,ensure_ascii=False))
if __name__=="__main__":main()
