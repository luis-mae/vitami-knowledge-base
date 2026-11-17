import unittest,tempfile,pathlib,json,sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'tools'))
from audit_source_links import audit
class LinkTests(unittest.TestCase):
 def test_missing_sources(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);p=root/'data/scientific_passports';p.mkdir(parents=True)
   (p/'a.json').write_text(json.dumps({'rule_id':'A','source_ids':[],'evidence_claim_ids':[],'review':{'source_passage_verified':False}}))
   r=audit(root);self.assertEqual(r['issues']['no_source_ids'],1);self.assertEqual(r['issues']['unverified_source_passage'],1)
if __name__=='__main__':unittest.main()
