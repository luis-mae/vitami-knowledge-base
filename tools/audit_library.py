#!/usr/bin/env python3
"""Read-only inventory of existing supplement JSON; no clinical approval inferred."""
import pathlib,json,collections,argparse
p=argparse.ArgumentParser();p.add_argument("--root",default=".");p.add_argument("--output");a=p.parse_args()
root=pathlib.Path(a.root); paths=sorted((root/"data/supplements").rglob("*.json"))
rows=[]; ids=collections.defaultdict(list)
for path in paths:
 row={"path":str(path.relative_to(root)),"certified_complete":False,"issues":[]}
 try:
  obj=json.loads(path.read_text(encoding="utf-8"))
  if not isinstance(obj,dict): row["issues"].append("not_an_object")
  else:
   row["keys"]=sorted(obj.keys());row["id"]=obj.get("id") or obj.get("supplement_id") or obj.get("ingredient_id")
   if row["id"]: ids[str(row["id"])].append(row["path"])
   else: row["issues"].append("id_requires_manual_mapping")
   row["issues"].append("clinical_and_regulatory_review_pending")
 except Exception as e: row["issues"].append("invalid_json: "+str(e))
 rows.append(row)
report={"json_file_count":len(rows),"unique_common_ids":len(ids),"duplicates":{k:v for k,v in ids.items() if len(v)>1},"certified_complete":0,"note":"Zero certified by this script does not mean zero scientifically complete; requires expert verification.","files":rows}
out=json.dumps(report,indent=2,ensure_ascii=False)+"\n"
if a.output: pathlib.Path(a.output).write_text(out,encoding="utf-8")
else: print(out)
