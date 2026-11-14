"""Safety-focused regression tests for the scientific passport validator."""
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate_scientific_passports.py"
spec = importlib.util.spec_from_file_location("passport_validator", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def example():
    return {
        "passport_version": "1.0.0",
        "rule_id": "RULE_EXAMPLE",
        "evidence_claim_ids": ["CLAIM_EXAMPLE"],
        "source_ids": ["SOURCE_EXAMPLE"],
        "review": {
            "status": "draft", "last_reviewed_at": None, "reviewer": None,
            "source_passage_verified": False, "certainty_assessed": False
        },
        "safety": {
            "gate_ids": [], "professional_approval": False,
            "contraindications_reviewed": False, "interactions_reviewed": False
        },
        "presentation": {
            "locale": "es", "claim_text": "",
            "source_attribution": [], "endorsement_disclaimer": True
        }
    }


class PassportValidationTests(unittest.TestCase):
    def test_draft_with_unreviewed_evidence_is_allowed_but_not_approved(self):
        self.assertEqual(module.validate(example(), "example"), [])

    def test_approval_requires_all_gates(self):
        p = example()
        p["review"]["status"] = "approved"
        self.assertTrue(any("approved passport lacks" in e for e in module.validate(p, "example")))

    def test_complete_approval_gates(self):
        p = example()
        p["review"].update(status="approved", last_reviewed_at="2026-11-14",
                           reviewer="Qualified reviewer", source_passage_verified=True,
                           certainty_assessed=True)
        p["safety"].update(professional_approval=True, contraindications_reviewed=True,
                           interactions_reviewed=True)
        p["presentation"]["source_attribution"] = [{
            "source_id": "SOURCE_EXAMPLE", "organization": "Example organization",
            "title": "Example source", "url": "https://example.org/source",
            "logo_permission": "not_checked"
        }]
        self.assertEqual(module.validate(p, "example"), [])

    def test_source_must_be_listed(self):
        p = example()
        p["presentation"]["source_attribution"] = [{
            "source_id": "OTHER", "url": "https://example.org", "logo_permission": "not_checked"
        }]
        self.assertTrue(any("unlisted source" in e for e in module.validate(p, "example")))

    def test_duplicate_claims_rejected(self):
        p = example()
        p["evidence_claim_ids"] = ["CLAIM_EXAMPLE", "CLAIM_EXAMPLE"]
        self.assertTrue(any("duplicates" in e for e in module.validate(p, "example")))


if __name__ == "__main__":
    unittest.main()
