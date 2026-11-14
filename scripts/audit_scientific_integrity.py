#!/usr/bin/env python3
"""Read-only integrity audit for Vitami's scientific evidence repository.

This checks referential integrity and publication guardrails only. It does
NOT assess clinical validity, risk of bias, evidence certainty, or legal
compliance. Run from the repository root:
    python3 scripts/audit_scientific_integrity.py
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

def load(path: Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)

def files(folder: str, exclude=()):
    base = ROOT / folder
    return [p for p in sorted(base.glob("*.json"))
            if not any(token in p.name.lower() for token in exclude)
            and p.name != "README.json"]

def main() -> int:
    errors, warnings = [], []
    registry = load(ROOT / "data/sources/source_registry.json")
    source_ids = {item.get("id") for item in registry.get("sources", [])}
    if None in source_ids:
        errors.append("Source registry contains a record without id.")
    if len(source_ids) != len(registry.get("sources", [])):
        errors.append("Duplicate or missing source IDs in source registry.")

    for source in registry.get("sources", []):
        sid = source.get("id", "<missing-id>")
        if not source.get("organization"):
            errors.append(f"Source {sid} has no organization.")
        if not source.get("resource_name"):
            errors.append(f"Source {sid} has no resource title.")
        if not source.get("source_class"):
            errors.append(f"Source {sid} has no source class.")
        if not source.get("status"):
            errors.append(f"Source {sid} has no review status.")
        if not source.get("logo", {}).get("usage_status"):
            errors.append(f"Source {sid} has no logo usage policy.")
        if source.get("status") not in ("needs_validation", "not_verified", "withdrawn"):
            parsed = urlparse(source.get("url") or "")
            if parsed.scheme not in ("http", "https") or not parsed.netloc:
                errors.append(f"Source {sid} has no valid original HTTP(S) URL.")

    crosswalk = load(ROOT / "docs/SOURCE_REFERENCE_CROSSWALK.json")
    rule_rows = crosswalk.get("reviewed_rule_sample", [])
    rule_ids = [row.get("rule_id") for row in rule_rows]
    if len(rule_ids) != len(set(rule_ids)):
        errors.append("Duplicate rule IDs in source crosswalk.")
    for row in rule_rows:
        for sid in row.get("source_ids", []):
            if sid not in source_ids:
                errors.append(f"Rule {row.get('rule_id')} references unknown source {sid}.")

    gate_map = load(ROOT / "docs/SAFETY_GATE_SOURCE_CROSSWALK.json")
    gate_rows = gate_map.get("gates", [])
    for row in gate_rows:
        for sid in row.get("source_ids", []):
            if sid not in source_ids:
                errors.append(f"Safety gate {row.get('rule_id')} references unknown source {sid}.")

    claims = {}
    for path in files("data/evidence_claims", exclude=("template",)):
        item = load(path)
        cid = item.get("evidence_claim_id")
        if not cid or cid in claims:
            errors.append(f"Missing or duplicate evidence_claim_id: {path.name}")
            continue
        claims[cid] = item
        for sid in item.get("source_ids", []):
            if sid not in source_ids:
                errors.append(f"Claim {cid} references unknown source {sid}.")
        if item.get("approved_for_rule_activation") and item.get("review_status") not in ("approved", "active"):
            errors.append(f"Claim {cid} is activation-approved without approved/active status.")
        if item.get("approved_for_user_display") and item.get("review_status") not in ("approved", "active"):
            errors.append(f"Claim {cid} is display-approved without approved/active status.")

    for row in gate_rows:
        claim_ids = row.get("evidence_claim_ids", [])
        if not claim_ids:
            errors.append(f"Safety gate {row.get('rule_id')} has no preliminary evidence-claim link.")
        for cid in claim_ids:
            if cid not in claims:
                errors.append(f"Safety gate {row.get('rule_id')} references unknown evidence claim {cid}.")
            elif claims[cid].get("approved_for_rule_activation") or claims[cid].get("approved_for_user_display"):
                errors.append(f"Safety gate placeholder claim {cid} must not be approved before full review.")

    for row in rule_rows:
        for cid in row.get("evidence_claim_ids", []):
            if cid not in claims:
                errors.append("Rule {} references unknown evidence claim {}.".format(row.get("rule_id"), cid))

    attributions = {}
    for path in files("data/attributions", exclude=("template",)):
        item = load(path)
        aid = item.get("attribution_id")
        if not aid or aid in attributions:
            errors.append(f"Missing or duplicate attribution_id: {path.name}")
            continue
        attributions[aid] = item
        if item.get("source_id") not in source_ids:
            errors.append(f"Attribution {aid} references unknown source.")
        for cid in item.get("claim_ids", []):
            if cid not in claims:
                errors.append(f"Attribution {aid} references unknown claim {cid}.")
        if item.get("logo", {}).get("permission_status") != "permission_confirmed":
            if item.get("logo", {}).get("asset_url"):
                errors.append(f"Attribution {aid} has a logo asset without confirmed permission.")
        if item.get("status") in ("approved", "active") and not item.get("original_url"):
            errors.append(f"Approved attribution {aid} has no original URL.")

    reviews = {}
    for path in files("data/scientific_reviews", exclude=("template", "safety_gate_review_queue")):
        item = load(path)
        rid = item.get("scientific_review_id")
        if rid:
            reviews[rid] = item
            cid = item.get("evidence_claim_id")
            if cid and cid not in claims:
                errors.append(f"Scientific review {rid} references unknown claim {cid}.")

    queue_path = ROOT / "data/scientific_reviews/SAFETY_GATE_REVIEW_QUEUE.json"
    if queue_path.exists():
        queue = load(queue_path)
        if queue.get("gate_count") != len(queue.get("records", [])):
            errors.append("Safety gate review queue count does not match its records.")
        if len(queue.get("records", [])) != len(gate_rows):
            warnings.append("Safety gate review queue and source crosswalk counts differ.")

    safety_attribution_path = ROOT / "docs/SAFETY_GATE_ATTRIBUTION_INDEX.json"
    if safety_attribution_path.exists():
        manifest = load(safety_attribution_path)
        if manifest.get("record_count") != len(manifest.get("records", [])):
            errors.append("Safety attribution manifest count does not match its records.")
        for item in manifest.get("records", []):
            if item.get("source_id") not in source_ids:
                errors.append("Safety attribution {} references unknown source.".format(item.get("attribution_id")))
            if item.get("evidence_claim_id") not in claims:
                errors.append("Safety attribution {} references unknown claim.".format(item.get("attribution_id")))

    if len(rule_rows) != 87:
        warnings.append(f"Expected 87 mapped rules; found {len(rule_rows)}.")
    if len(gate_rows) != 31:
        warnings.append(f"Expected 31 mapped safety gates; found {len(gate_rows)}.")

    print("VITAMI SCIENTIFIC INTEGRITY AUDIT")
    print(f"Sources: {len(source_ids)} | Rules mapped: {len(rule_rows)} | Safety gates: {len(gate_rows)}")
    print(f"Evidence claims: {len(claims)} | Scientific reviews: {len(reviews)} | Attributions: {len(attributions)}")
    print(f"Errors: {len(errors)} | Warnings: {len(warnings)}")
    for message in errors:
        print("ERROR:", message)
    for message in warnings:
        print("WARNING:", message)
    print("Scope: structural integrity only; not clinical validation.")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())
