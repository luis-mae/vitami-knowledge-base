#!/usr/bin/env python3
"""Cross-reference existing passport claims and source registry without approval."""
import pathlib,json,collections,argparse
def walk(o):
 if isinstance(o,dict):
  for k,v in o.items():
   if k in ('id','claim_id','source_id') and isinstance(v,str):yield k,v
   yield from walk(v)
 elif isinstance(o,list):
  for x in o:yield from walk(x)
def audit(root):
 registry=root/'data'/'sources'/'source_registry.json'
 known=set();registry_error=None
 if registry.exists():
  try:
   for key,val in walk(json.loads(registry.read_text(encoding='utf-8'))):
    if key in ('id','source_id'):known.add(val)
  except Exception as e:registry_error=str(e)
 rows=[];counts=collections.Counter()
 for path in sorted((root/'data'/'scientific_passports').rglob('*.json')):
  try:
   p=json.loads(path.read_text(encoding='utf-8'));sources=p.get('source_ids') or []
   unresolved=[s for s in sources if s not in known] if known else []
   row={'path':str(path.relative_to(root)),'rule_id':p.get('rule_id'),'source_ids':sources,'claim_ids':p.get('evidence_claim_ids') or [],'registry_unresolved':unresolved,'source_passage_verified':(p.get('review') or {}).get('source_passage_verified') is True}
   if not sources:counts['no_source_ids']+=1
   if not row['claim_ids']:counts['no_claim_ids']+=1
   if unresolved:counts['unresolved_source_references']+=len(unresolved)
   if not row['source_passage_verified']:counts['unverified_source_passage']+=1
   rows.append(row)
  except Exception as e:rows.append({'path':str(path),'error':str(e)});counts['invalid_json']+=1
 return {'passport_count':len(rows),'registry_ids_discovered':len(known),'registry_error':registry_error,'issues':dict(counts),'rows':rows,'warning':'Registry ID matching is only a first check; passage-level evidence must be verified.'}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',default='.');a.add_argument('--output');v=a.parse_args();s=json.dumps(audit(pathlib.Path(v.root)),indent=2,ensure_ascii=False)+'\n'
 if v.output:pathlib.Path(v.output).write_text(s,encoding='utf-8')
 else:print(s)
