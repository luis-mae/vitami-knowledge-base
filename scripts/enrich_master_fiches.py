#!/usr/bin/env python3
"""Enrich all migrated VITAMI fiches without overwriting legacy content.
Run: python scripts/enrich_master_fiches.py
Offline, deterministic, idempotent; no network, CI, deployment or paid API.
"""
import json
from pathlib import Path
from collections import defaultdict

ROOT=Path(__file__).resolve().parents[1]
MASTER=ROOT/"migration/master_fiches"
DEEP=ROOT/"phase2/deep_records"
CLAIMS=ROOT/"data/evidence_claims"
SOURCE_FILES=[ROOT/"data/sources/source_registry.json",ROOT/"data/sources/phase2_specific_sources.json"]
ALIASES={"creatine_monohydrate":["creatine"],"magnesium_glycinate":["magnesium"],"magnesium_citrate":["magnesium"],"iron_bisglycinate":["iron"],"methylcobalamin":["vitamin_b12","b12"],"vitamin_d3":["vitamin_d","vitd"],"algal_omega3_dha":["algal_omega3","omega_3_epa_dha"],"calcium_citrate":["calcium"],"zinc_gluconate":["zinc"]}
def read(p):return json.loads(p.read_text(encoding="utf-8"))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
def main():
    sources=set()
    for p in SOURCE_FILES:
        if not p.exists():continue
        d=read(p)
        rows=d if isinstance(d,list) else next((v for k,v in d.items() if isinstance(v,list) and ("source" in k or k=="sources")),[])
        sources.update(row["id"] for row in rows if isinstance(row,dict) and "id" in row)
    claims=defaultdict(list)
    for p in sorted(CLAIMS.glob("*.json")):
        d=read(p)
        if not isinstance(d,dict) or not d.get("ingredient_id") or not d.get("evidence_claim_id"):continue
        claims[d["ingredient_id"]].append({"legacy_path":p.relative_to(ROOT).as_posix(),"original_claim":d,"evidence_claim_id":d["evidence_claim_id"],"source_ids":d.get("source_ids",[]),"verified_for_customer":False})
    report={"fiches":0,"deep_records_linked":0,"evidence_claims_linked":0,"missing_source_registry_ids":[],"claim_specific_citations_pending":0,"ambiguous_alias_links":[],"files":[]}
    for p in sorted(MASTER.glob("*.json")):
        if p.name.startswith("_"):continue
        d=read(p); id=d["id"]; keys=[id]+ALIASES.get(id,[])
        dp=DEEP/(id+".json")
        if dp.exists():
            d["deep_record"]={"legacy_path":dp.relative_to(ROOT).as_posix(),"original_record":read(dp)}
            report["deep_records_linked"]+=1
        matched=[]
        for key in keys:
            for c in claims.get(key,[]):
                copy=dict(c)
                copy["link_type"]="exact_ingredient_id" if key==id else "alias_candidate_requires_review"
                if key!=id:report["ambiguous_alias_links"].append({"fiche":id,"claim":c["evidence_claim_id"],"matched_ingredient_id":key})
                matched.append(copy)
        d["linked_evidence_claims"]=matched
        report["evidence_claims_linked"]+=len(matched)
        ids=set(d.get("source_refs_preserved",[]))
        if dp.exists():ids.update(d["deep_record"]["original_record"].get("source_refs",[]))
        for c in matched:ids.update(c["source_ids"])
        missing=sorted(x for x in ids if x not in sources)
        if missing:report["missing_source_registry_ids"].append({"fiche":id,"source_ids":missing})
        d["source_resolution"]={"source_ids":sorted(ids),"unresolved_in_registry":missing,"claim_specific_verification":"pending"}
        d["migration_status"]="enriched_pending_source_and_safety_review"
        d["activation_gate"]="not_approved"
        report["claim_specific_citations_pending"]+=len(d.get("claims",[]))
        write(p,d)
        report["fiches"]+=1
        report["files"].append({"id":id,"claims_linked":len(matched),"deep_record":dp.exists(),"unresolved_source_ids":missing})
    write(ROOT/"migration/ENRICHMENT_AUDIT.json",report)
    print(json.dumps({k:v for k,v in report.items() if k not in ("files","ambiguous_alias_links","missing_source_registry_ids")},ensure_ascii=False))
if __name__=="__main__":main()
