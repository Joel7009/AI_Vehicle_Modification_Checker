"""
core/rules_engine.py

Configurable rule engine. Takes standard-schema detections (see
model_interface.py) and cross-checks them against rules/rules.json,
producing a rule verdict for every detection.

Nothing here is a real legal claim - all rule_reference / explanation
text is a placeholder until official CMVR clauses are supplied. Edit
rules/rules.json to change behaviour; no Python code changes needed.
"""

import json
import os
from typing import List, Dict, Any

RULES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "rules", "rules.json")


def load_rules() -> Dict[str, Any]:
    with open(RULES_PATH, "r") as f:
        return json.load(f)


def evaluate_detection(detection: Dict[str, Any], rules: Dict[str, Any]) -> Dict[str, Any]:
    """
    Input: one standard-schema detection dict.
    Output: the detection dict enriched with rule_reference, requirement,
    explanation, risk and a penalty placeholder.
    """
    class_key = detection.get("class_name")
    rule = rules.get("rules", {}).get(class_key)

    if rule is None:
        return {
            **detection,
            "rule_reference": "NO_RULE_CONFIGURED",
            "requirement": "No rule has been configured for this detection class yet.",
            "explanation": "This detection has no matching entry in rules/rules.json.",
            "risk": "UNKNOWN",
            "penalty_placeholder": 0,
            "score_penalty": 0,
        }

    return {
        **detection,
        "rule_reference": rule["rule_reference"],
        "requirement": rule["requirement"],
        "explanation": rule["violation_explanation"],
        "risk": rule["risk"],
        "penalty_placeholder": rule["penalty_placeholder"],
        "score_penalty": rule["score_penalty"],
    }


def evaluate_all(detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rules = load_rules()
    return [evaluate_detection(d, rules) for d in detections]


def get_risk_band(score: int) -> Dict[str, str]:
    rules = load_rules()
    for band in rules.get("risk_bands", []):
        if band["min"] <= score <= band["max"]:
            return band
    return {"min": 0, "max": 0, "label": "UNKNOWN", "color": "gray"}
