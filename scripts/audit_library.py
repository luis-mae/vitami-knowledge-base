#!/usr/bin/env python3
"""Auditoría local, sin dependencias ni llamadas de red, de fichas VITAMI.

Uso: python scripts/audit_library.py --root . --out reports/library_audit.json
No modifica fichas, no valida veracidad científica ni presume estados active.
"""
import argparse, json, pathlib, re
from collections import Counter

FIELDS = {
    "identity": ("id", "ingredient_id", "slug"),
    "names": ("name", "names", "title", "nombre"),
    "evidence": ("evidence", "claims", "evidence_claim_ids", "indications"),
    "sources": ("sources", "references", "source_ids", "bibliography"),
    "safety": ("safety", "contraindications", "warnings", "interactions"),
    "dose": ("dose", "dosage", "dosing", "reference_intake"),
    "regulatory": ("regulatory", "availability", "commercial_status"),
    "alternatives": ("alternatives", "equivalents", "substitutes"),
}
LANG = ("es", "en", "it")
def nonempty(x):
    return x is not None and x != "" and x != [] and x != {}
def find_key(obj, keys):
    if not isinstance(obj, dict): return False
    return any(nonempty(obj.get(k)) for k in keys)
def languages(obj):
    if not isinstance(obj, dict): return []
    found=[]
    for lang in LANG:
        if nonempty(obj.get(lang)) or any(k.endswith("_"+lang) and nonempty(v) for k,v in obj.items()):
            found.append(lang)
    for key in ("translations", "i18n", "localized", "names", "description"):
        val=obj.get(key)
        if isinstance(val,dict):
            found=list(set(found)|{lang for lang in LANG if nonempty(val.get(lang))})
    return sorted(found)
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--root",default=".")
    p.add_argument("--out",default="reports/library_audit.json")
    p.add_argument("--expected",type=int,default=100)
    a=p.parse_args()
    root=pathlib.Path(a.root).resolve()
    folders=[root/"data"/"supplements",root/"data"/"ingredients"]
    files=sorted({f for folder in folders if folder.exists() for f in folder.rglob("*.json")})
    rows=[]; ids=Counter()
    for f in files:
        try:
            obj=json.loads(f.read_text(encoding="utf-8"))
            records=obj if isinstance(obj,list) else obj.get("ingredients",obj.get("supplements",[obj])) if isinstance(obj,dict) else []
            if not isinstance(records,list): records=[records]
            for idx,item in enumerate(records):
                if not isinstance(item,dict): continue
                ident=str(next((item[k] for k in FIELDS["identity"] if nonempty(item.get(k))),f.stem+":"+str(idx)))
                ids[ident]+=1
                checks={k:find_key(item,v) for k,v in FIELDS.items()}
                langs=languages(item)
                rows.append({"id":ident,"file":str(f.relative_to(root)),"fields_present":checks,
                             "languages_detected":langs,"declared_status":item.get("status","unknown"),
                             "structural_candidate":all(checks.values()) and len(langs)==3,
                             "scientifically_verified":False,
                             "regulatory_verified":False,
                             "note":"Presencia de campos no equivale a revisión científica ni regulatoria."})
        except (OSError,ValueError) as exc:
            rows.append({"file":str(f.relative_to(root)),"parse_error":str(exc)})
    result={"expected":a.expected,"files_scanned":len(files),"records_found":len(rows),
            "unique_ids":len(ids),"duplicate_ids":[k for k,v in ids.items() if v>1],
            "structural_candidates":sum(bool(r.get("structural_candidate")) for r in rows),
            "scientifically_verified":0,"scientifically_verified_note":"No comprobable por este script",
            "records":rows}
    target=(root/a.out);target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:v for k,v in result.items() if k!="records"},ensure_ascii=False,indent=2))
if __name__=="__main__": main()
