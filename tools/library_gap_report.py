#!/usr/bin/env python3
"""Gap report: completeness is NOT medical approval."""
import pathlib,json,argparse,collections
def report(root):
 rows=[];totals=collections.Counter()
 for p in sorted((root/'migration'/'master_fiches').rglob('*.json')):
  try:f=json.loads(p.read_text(encoding='utf-8'))
  except Exception as e:rows.append({'path':str(p),'error':str(e)});continue
  sci=f.get('scientific') or {};missing=['scientific.'+k for k in ('identity','indications','dosage','administration','contraindications','interactions','adverse_effects') if not sci.get(k)]
  if not f.get('provenance',{}).get('source_ids'):missing.append('provenance.source_ids')
  if not any(e.get('status')!='unverified' and e.get('source_ids') and e.get('checked_at') for e in f.get('regulatory',{}).get('AR',[])):missing.append('regulatory.AR.verified')
  if not f.get('alternatives'):missing.append('alternatives.assessed')
  for lang in ('es','en','it'):
   if f.get('translations',{}).get(lang,{}).get('review_status')!='reviewed':missing.append('translations.'+lang)
  for m in missing:totals[m]+=1
  rows.append({'path':str(p.relative_to(root)),'ingredient_id':f.get('ingredient_id'),'missing':missing})
 return {'master_file_count':len(rows),'field_gaps':dict(totals),'records':rows,'note':'Completeness does not imply scientific approval.'}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',default='.');a.add_argument('--output');v=a.parse_args();data=json.dumps(report(pathlib.Path(v.root)),ensure_ascii=False,indent=2)+'\n'
 if v.output:pathlib.Path(v.output).write_text(data,encoding='utf-8')
 else:print(data)
