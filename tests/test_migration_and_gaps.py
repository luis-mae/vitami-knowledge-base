import unittest,tempfile,pathlib,json,sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'tools'))
from migrate_legacy_drafts import migrate
from library_gap_report import report
class MigrationTests(unittest.TestCase):
 def test_preserve_and_repeat(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);src=root/'data'/'supplements';src.mkdir(parents=True)
   payload={'id':'vitamin_d','claim':'original'};(src/'d.json').write_text(json.dumps(payload))
   out=root/'migration'/'master_fiches'
   self.assertEqual(migrate(root,out)[0]['action'],'created_draft')
   self.assertEqual(migrate(root,out)[0]['action'],'preserved_existing')
   self.assertEqual(json.loads((src/'d.json').read_text()),payload)
   self.assertEqual(json.loads(next(out.glob('*.json')).read_text())['review_status'],'draft')
   self.assertIn('regulatory.AR.verified',report(root)['records'][0]['missing'])
 def test_invalid_json(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);src=root/'data'/'supplements';src.mkdir(parents=True);(src/'bad.json').write_text('{')
   self.assertIn('error',migrate(root,root/'migration'/'master_fiches')[0])
if __name__=='__main__':unittest.main()
