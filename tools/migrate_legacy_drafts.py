#!/usr/bin/env python3
"""Non-destructive legacy import. New fiches always draft."""
import pathlib,json,argparse,hashlib,re
def migrate(root,out):
 source=root/'data'/'supplements';out.mkdir(parents=True,exist_ok=True);rows=[]
 for p in sorted(source.rglob('*.json')):
  legacy=str(p.relative_to(root))
  try: original=json.loads(p.read_text(encoding='utf-8'))
  except Exception as e:rows.append({'path':legacy,'error':str(e)});continue
  if not isinstance(original,dict):rows.append({'path':legacy,'error':'not_object'});continue
  ident=re.sub('[^a-z0-9_-]','_',str(original.get('ingredient_id') or original.get('supplement_id') or original.get('id') or p.stem).lower())+'_'+hashlib.sha256(legacy.encode()).hexdigest()[:10]
  target=out/(ident+'.json')
  if target.exists():rows.append({'path':legacy,'action':'preserved_existing'});continue
  fiche={'schema_version':'1.0','ingredient_id':ident,'review_status':'draft','scientific':{'identity':None,'indications':[],'dosage':[],'administration':[],'contraindications':[],'interactions':[],'adverse_effects':[]},'regulatory':{'AR':[{'formulation':None,'dose':None,'status':'unverified','source_ids':[],'checked_at':None}]},'alternatives':[],'translations':{x:{'review_status':'draft'} for x in ('es','en','it')},'provenance':{'legacy_paths':[legacy],'source_ids':[],'legacy_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'legacy_original':original}}
  target.write_text(json.dumps(fiche,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');rows.append({'path':legacy,'action':'created_draft','target':str(target)})
 return rows
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',default='.');a.add_argument('--output',required=True);v=a.parse_args();root=pathlib.Path(v.root).resolve();out=pathlib.Path(v.output).resolve()
 if out==root or (root/'data'/'supplements') in out.parents:raise SystemExit('Output must not overwrite legacy data')
 print(json.dumps(migrate(root,out),ensure_ascii=False,indent=2))
