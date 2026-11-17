#!/usr/bin/env python3
"""Conservative master-fiche gate. Standard library only; never approves automatically."""
import argparse,json,pathlib,datetime,collections
REQUIRED=("ingredient_id","review_status","scientific","regulatory","alternatives","translations","provenance")
SCI=("identity","indications","dosage","administration","contraindications","interactions","adverse_effects")
LANG=("es","en","it")
def check(o):
 errors=[];warnings=[]
 if not isinstance(o,dict):return ["root_not_object"],[]
 for k in REQUIRED:
  if k not in o:errors.append("missing:"+k)
 if not isinstance(o.get("ingredient_id"),str) or not o.get("ingredient_id","").strip():errors.append("invalid_ingredient_id")
 sci=o.get("scientific",{})
 if not isinstance(sci,dict):errors.append("scientific_not_object");sci={}
 for k in SCI:
  if k not in sci or sci[k] in (None,[],{},""):errors.append("scientific_missing_or_empty:"+k)
 for i,claim in enumerate(sci.get("indications",[]) if isinstance(sci.get("indications"),list) else []):
  if not isinstance(claim,dict) or not claim.get("source_ids") or not claim.get("evidence_grade"):errors.append("indication_missing_source_or_grade:"+str(i))
 reg=o.get("regulatory",{})
 entries=reg.get("AR",[]) if isinstance(reg,dict) else []
 if not entries:errors.append("regulatory_AR_missing")
 for i,e in enumerate(entries):
  if not isinstance(e,dict):errors.append("regulatory_entry_invalid:"+str(i));continue
  if e.get("status") not in ("dietary_store","pharmacy_otc","pharmacy_prescription","restricted","not_available","unverified"):errors.append("regulatory_status_invalid:"+str(i))
  if e.get("status")!="unverified" and (not e.get("source_ids") or not e.get("checked_at")):errors.append("regulatory_unsubstantiated:"+str(i))
 for i,e in enumerate(o.get("alternatives",[]) if isinstance(o.get("alternatives"),list) else []):
  if not isinstance(e,dict) or not e.get("indication") or not e.get("candidate_id"):errors.append("alternative_incomplete:"+str(i));continue
  if e.get("equivalence") not in ("not_established","partial","supported_for_specific_use"):errors.append("alternative_grade_invalid:"+str(i))
  if e.get("equivalence")!="not_established" and not e.get("source_ids"):errors.append("alternative_without_sources:"+str(i))
 trans=o.get("translations",{})
 for lang in LANG:
  t=trans.get(lang) if isinstance(trans,dict) else None
  if not isinstance(t,dict) or t.get("review_status")!="reviewed":errors.append("translation_unreviewed:"+lang)
 prov=o.get("provenance",{})
 if not isinstance(prov,dict) or not prov.get("source_ids"):errors.append("provenance_missing_sources")
 if o.get("review_status")=="active" and errors:errors.append("ACTIVE_BLOCKED")
 if o.get("review_status")=="active":warnings.append("automated_checks_cannot_replace_expert_signoff")
 return errors,warnings
def run(root):
 files=sorted((root/"migration"/"master_fiches").rglob("*.json"))
 result=[];seen=collections.defaultdict(list)
 for p in files:
  try:
   o=json.loads(p.read_text(encoding="utf-8"));errors,warnings=check(o)
   key=o.get("ingredient_id") if isinstance(o,dict) else None
   if key:seen[key].append(str(p.relative_to(root)))
  except Exception as e:errors=["parse_error:"+str(e)];warnings=[]
  result.append({"path":str(p.relative_to(root)),"passes_structural_gate":not errors,"errors":errors,"warnings":warnings})
 duplicates={k:v for k,v in seen.items() if len(v)>1}
 return {"checked_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),"files_checked":len(files),"structurally_passing":sum(x["passes_structural_gate"] for x in result),"scientifically_approved":None,"duplicate_ids":duplicates,"records":result,"note":"Structural validation is not scientific or regulatory approval."}
if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--root",default=".");p.add_argument("--output");a=p.parse_args()
 result=run(pathlib.Path(a.root));output=json.dumps(result,indent=2,ensure_ascii=False)+"\n"
 if a.output:pathlib.Path(a.output).write_text(output,encoding="utf-8")
 else:print(output)
