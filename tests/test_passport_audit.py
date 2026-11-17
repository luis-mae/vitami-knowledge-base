import unittest,tempfile,pathlib,json,sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'tools'))
from audit_scientific_passports import inspect
class PassportAuditTests(unittest.TestCase):
 def test_draft_not_approved(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);folder=root/'data'/'scientific_passports';folder.mkdir(parents=True)
   obj={'rule_id':'D3_LOW_SUN','evidence_claim_ids':['C1'],'source_ids':['S1'],'review':{'status':'draft','source_passage_verified':False,'certainty_assessed':False},'safety':{'professional_approval':False,'contraindications_reviewed':False,'interactions_reviewed':False},'presentation':{'claim_text':''}}
   (folder/'a.json').write_text(json.dumps(obj));result=inspect(root)
   self.assertEqual(result['passport_files'],1);self.assertEqual(result['ready_for_manual_activation_review'],0)
   self.assertIn('source_passage_unverified',result['records'][0]['issues'])
 def test_duplicate_rule_id(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);folder=root/'data'/'scientific_passports';folder.mkdir(parents=True)
   for name in ('a','b'):(folder/(name+'.json')).write_text(json.dumps({'rule_id':'DUP'}))
   self.assertIn('DUP',inspect(root)['duplicate_rule_ids'])
if __name__=='__main__':unittest.main()
