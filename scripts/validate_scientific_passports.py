#!/usr/bin/env python3
"""Validate VITAMI scientific passports without activating clinical rules.

Usage: python scripts/validate_scientific_passports.py [path-to-passports]
Defaults to data/scientific_passports. Uses only Python standard library.
"""
import json
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = {"passport_version", "rule_id", "evidence_claim_ids", "source_ids", "review", "safety", "presentation"}
APPROVAL = {"approved"}
STATUSES = {"draft", "evidence_review", "professional_review", "approved", "deprecated"}
LOCALES = {"es", "en", "it"}


def validate(data, location):
    errors = []
    def fail(message):
        errors.append(f"{location}: {message}")

    if not isinstance(data, dict):
        return [f"{location}: expected JSON object"]
    for key in sorted(REQUIRED - set(data)):
        fail(f"missing {key}")
    if data.get("passport_version") != "1.0.0":
        fail("passport_version must be 1.0.0")
    if not isinstance(data.get("rule_id"), str) or not data["rule_id"].strip():
        fail("rule_id must be nonempty")
    for key in ("evidence_claim_ids", "source_ids"):
        values = data.get(key)
        if not isinstance(values, list) or not values or any(not isinstance(v, str) or not v.strip() for v in values):
            fail(f"{key} must contain nonempty IDs")
        elif len(values) != len(set(values)):
            fail(f"{key} contains duplicates")

    review = data.get("review")
    safety = data.get("safety")
    presentation = data.get("presentation")
    if not isinstance(review, dict) or not isinstance(safety, dict) or not isinstance(presentation, dict):
        fail("review, safety, presentation must be objects")
        return errors
    status = review.get("status")
    if status not in STATUSES:
        fail("invalid review.status")
    reviewed_at = review.get("last_reviewed_at")
    if reviewed_at is not None:
        try:
            date.fromisoformat(reviewed_at)
        except (ValueError, TypeError):
            fail("invalid review.last_reviewed_at")
    for field in ("source_passage_verified", "certainty_assessed"):
        if not isinstance(review.get(field), bool):
            fail(f"review.{field} must be boolean")
    for field in ("professional_approval", "contraindications_reviewed", "interactions_reviewed"):
        if not isinstance(safety.get(field), bool):
            fail(f"safety.{field} must be boolean")
    if not isinstance(safety.get("gate_ids"), list):
        fail("safety.gate_ids must be a list")
    if presentation.get("locale") not in LOCALES:
        fail("invalid presentation.locale")
    if not isinstance(presentation.get("endorsement_disclaimer"), bool):
        fail("presentation.endorsement_disclaimer must be boolean")
    attributions = presentation.get("source_attribution")
    if not isinstance(attributions, list):
        fail("presentation.source_attribution must be a list")
    else:
        for idx, attribution in enumerate(attributions):
            if not isinstance(attribution, dict):
                fail(f"attribution {idx} must be an object")
                continue
            if attribution.get("source_id") not in data.get("source_ids", []):
                fail(f"attribution {idx} references an unlisted source")
            url = attribution.get("url")
            if not isinstance(url, str) or urlparse(url).scheme not in ("http", "https") or not urlparse(url).netloc:
                fail(f"attribution {idx} has invalid URL")
            if attribution.get("logo_permission") not in ("not_checked", "denied", "licensed"):
                fail(f"attribution {idx} has invalid logo permission")
    if status in APPROVAL:
        if not all((review.get("source_passage_verified") is True,
                    review.get("certainty_assessed") is True,
                    isinstance(reviewed_at, str) and bool(reviewed_at),
                    isinstance(review.get("reviewer"), str) and bool(review["reviewer"].strip()),
                    safety.get("professional_approval") is True,
                    safety.get("contraindications_reviewed") is True,
                    safety.get("interactions_reviewed") is True,
                    presentation.get("endorsement_disclaimer") is True,
                    bool(attributions))):
            fail("approved passport lacks scientific, professional, safety or attribution gates")
    return errors


def main():
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "scientific_passports"
    files = sorted(folder.rglob("*.json")) if folder.is_dir() else ([folder] if folder.is_file() else [])
    if not files:
        print(f"No passports found in {folder}; nothing validated (NOT a pass).", file=sys.stderr)
        return 2
    errors = []
    rule_ids = set()
    for file in files:
        try:
            data = json.loads(file.read_text(encoding="utf-8"))
            errors.extend(validate(data, str(file)))
            if isinstance(data, dict) and isinstance(data.get("rule_id"), str):
                if data["rule_id"] in rule_ids:
                    errors.append(f"{file}: duplicate rule_id {data['rule_id']}")
                rule_ids.add(data["rule_id"])
        except (OSError, ValueError) as exc:
            errors.append(f"{file}: {exc}")
    for error in errors:
        print(error, file=sys.stderr)
    print(f"Passports inspected: {len(files)}; errors: {len(errors)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
