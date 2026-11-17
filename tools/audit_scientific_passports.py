#!/usr/bin/env python3
"""Audit real scientific passports, without changing source files or implying approval."""
import argparse,collections,datetime,json,pathlib
def inspect(root):
 paths=sorted((root/'data'/'scientific_passports').rglob('*.json'))
 rows=[];by_rule=collections.defaultdict(list);counts=collections.Counter()
 for path in paths:
  row={'path':str(path.relative_to(root)),'issues':[]}
  try:
   p=json.loads(path.read_text(encoding='utf-8'))
   if not isinstance(p,dict):raise ValueError('passport_not_object')
   rid=p.get('rule_id');row['rule_id']=rid
   if rid:by_rule[rid].append(row['path'])
   else:row['issues'].append('missing_rule_id')
   for k in ('evidence_claim_ids','source_ids'):
    if not isinstance(p.get(k),list) or not p[k]:row['issues'].append('missing_'+k)
   rev=p.get('review') or {};safe=p.get('safety') or {};pres=p.get('presentation') or {}
   row['review_status']=rev.get('status','unknown')
   if rev.get('status') not in ('reviewed','active'):row['issues'].append('review_pending')
   if rev.get('source_passage_verified') is not True:row['issues'].append('source_passage_unverified')
   if rev.get('certainty_assessed') is not True:row['issues'].append('certainty_unassessed')
   if safe.get('professional_approval') is not True:row['issues'].append('professional_approval_missing')
   if safe.get('contraindications_reviewed') is not True:row['issues'].append('contraindications_unreviewed')
   if safe.get('interactions_reviewed') is not True:row['issues'].append('interactions_unreviewed')
   if not pres.get('claim_text'):row['issues'].append('presentation_claim_empty')
   row['eligible_for_manual_activation_review']=not row['issues']
  except Exception as e:row['issues'].append('invalid_passport:'+str(e));row['eligible_for_manual_activation_review']=False
  counts.update(row['issues']);rows.append(row)
 duplicates={k:v for k,v in by_rule.items() if len(v)>1}
 return {'generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'passport_files':len(rows),'unique_rule_ids':len(by_rule),'ready_for_manual_activation_review':sum(r['eligible_for_manual_activation_review'] for r in rows),'issue_counts':dict(counts),'duplicate_rule_ids':duplicates,'records':rows,'note':'Passport is a rule-context document, NOT one of 100 unique ingredient fiches; do not conflate counts.'}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--root',default='.');a.add_argument('--output');v=a.parse_args();data=json.dumps(inspect(pathlib.Path(v.root)),ensure_ascii=False,indent=2)+'\n'
 if v.output:pathlib.Path(v.output).write_text(data,encoding='utf-8')
 else:print(data)
