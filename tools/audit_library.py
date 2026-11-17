#!/usr/bin/env python3
"""Read-only inventory of supplements, master fiches and research drafts.

Distinct universes are reported separately. No medical approval inferred.
Standard library only. Usage: python tools/audit_library.py --root . --output report.json
"""
import argparse
import collections
import json
import pathlib

def scan(root):
    supplements = []
    supplement_ids = collections.defaultdict(list)
    for path in sorted((root / "data" / "supplements").rglob("*.json")):
        row = {"path": str(path.relative_to(root)), "certified_complete": False, "issues": []}
        try:
            obj = json.loads(path.read_text(encoding="utf-8"))
            if not isinstance(obj, dict):
                row["issues"].append("not_an_object")
            else:
                row["keys"] = sorted(obj.keys())
                row["id"] = obj.get("id") or obj.get("supplement_id") or obj.get("ingredient_id")
                if row["id"]:
                    supplement_ids[str(row["id"])].append(row["path"])
                else:
                    row["issues"].append("id_requires_manual_mapping")
                row["issues"].append("clinical_and_regulatory_review_pending")
        except (OSError, ValueError) as exc:
            row["issues"].append("invalid_json: " + str(exc))
        supplements.append(row)

    research = []
    research_ids = collections.defaultdict(list)
    for path in sorted((root / "data" / "research").rglob("*.json")):
        try:
            obj = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if not isinstance(obj, dict) or not isinstance(obj.get("records"), list):
            continue
        for index, record in enumerate(obj["records"]):
            if not isinstance(record, dict) or not record.get("ingredient_id"):
                continue
            ident = str(record["ingredient_id"])
            location = str(path.relative_to(root)) + "#" + str(index)
            research_ids[ident].append(location)
            research.append({
                "ingredient_id": ident, "path": location,
                "status": record.get("status", "unknown"),
                "source_ids_present": bool(record.get("source_ids")),
                "public_recommendation_allowed": record.get("public_recommendation_allowed", False),
                "language_status": record.get("languages", {}),
            })

    master_ids = collections.defaultdict(list)
    for path in sorted((root / "migration" / "master_fiches").rglob("*.json")):
        try:
            obj = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(obj, dict) and obj.get("ingredient_id"):
                master_ids[str(obj["ingredient_id"])].append(str(path.relative_to(root)))
        except (OSError, ValueError):
            continue

    return {
        "json_file_count": len(supplements),
        "unique_common_ids": len(supplement_ids),
        "duplicates": {k: v for k, v in supplement_ids.items() if len(v) > 1},
        "certified_complete": 0,
        "files": supplements,
        "research": {
            "record_count": len(research),
            "unique_ingredient_ids": len(research_ids),
            "duplicates": {k: v for k, v in research_ids.items() if len(v) > 1},
            "without_sources": sum(not r["source_ids_present"] for r in research),
            "records": research,
        },
        "master_fiches": {
            "unique_ingredient_ids": len(master_ids),
            "duplicate_ids": {k: v for k, v in master_ids.items() if len(v) > 1},
        },
        "note": "These counts are separate universes. Zero certified by this script does not mean zero scientifically complete; expert verification is required.",
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--output")
    args = parser.parse_args()
    result = json.dumps(scan(pathlib.Path(args.root)), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        target = pathlib.Path(args.output)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(result, encoding="utf-8")
    else:
        print(result)
