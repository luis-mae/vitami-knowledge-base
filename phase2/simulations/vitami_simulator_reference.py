"""
Vitami deterministic draft simulator.
Not clinical software. Rules remain DRAFT until validated.
"""
import re

LEVEL_ORDER = {
    "E_no_current_indication":0, "D_optional_limited":1,
    "C_potential_benefit":2, "B_consider":3, "A_high_relevance":4
}

def score_to_level(score):
    if score <= 1: return "E_no_current_indication"
    if score <= 3: return "D_optional_limited"
    if score <= 5: return "C_potential_benefit"
    if score <= 7: return "B_consider"
    return "A_high_relevance"

def apply_cap(level, cap):
    if not cap or cap not in LEVEL_ORDER: return level
    return cap if LEVEL_ORDER[level] > LEVEL_ORDER[cap] else level

# Production implementation should load JSON rules and reproduce the
# condition semantics documented in config/draft_rule_engine.json.
