#!/usr/bin/env python3
"""Smoke tests for structural safety gates; run locally, no external services."""
import unittest,sys,pathlib
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/"tools"))
from validate_master_fiches import check
class GateTests(unittest.TestCase):
 def test_empty_blocked(self):self.assertTrue(check({})[0])
 def test_unsupported_active_blocked(self):
  obj={"ingredient_id":"X","review_status":"active","scientific":{},"regulatory":{"AR":[{"status":"pharmacy_otc"}]},"translations":{},"provenance":{}}
  errors,_=check(obj)
  self.assertIn("regulatory_unsubstantiated:0",errors)
  self.assertIn("ACTIVE_BLOCKED",errors)
 def test_alternative_needs_sources(self):
  obj={"ingredient_id":"X","alternatives":[{"indication":"test","candidate_id":"Y","equivalence":"supported_for_specific_use"}]}
  self.assertIn("alternative_without_sources:0",check(obj)[0])
if __name__=="__main__":unittest.main()
