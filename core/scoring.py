"""
core/scoring.py

Turns a list of rule-evaluated detections into a single 0-100
compliance score and a risk label. Fully configurable via
rules/rules.json (score_penalty per class, risk_bands for labels).
"""

from typing import List, Dict, Any
from core.rules_engine import get_risk_band


def calculate_compliance_score(evaluated_detections: List[Dict[str, Any]]) -> int:
    """
    Starts at 100 and subtracts each detection's configured score_penalty.
    ILLEGAL modifications subtract their full penalty, WARNING subtracts
    half, COMPLIANT subtracts nothing. Clamped to 0-100.
    """
    score = 100
    for d in evaluated_detections:
        penalty = d.get("score_penalty", 0)
        status = d.get("status", "ILLEGAL")
        if status == "ILLEGAL":
            score -= penalty
        elif status == "WARNING":
            score -= penalty / 2
        # COMPLIANT -> no penalty
    return max(0, min(100, round(score)))


def get_risk_level(score: int) -> Dict[str, str]:
    """Returns {'label': 'HIGH RISK', 'color': 'orange'} style dict for a given score."""
    return get_risk_band(score)


def summarize_detections(evaluated_detections: List[Dict[str, Any]]) -> Dict[str, int]:
    """Returns counts used by the compliance panel: detected / illegal / warning / compliant."""
    summary = {"detected": len(evaluated_detections), "illegal": 0, "warning": 0, "compliant": 0}
    for d in evaluated_detections:
        status = d.get("status", "ILLEGAL")
        if status == "ILLEGAL":
            summary["illegal"] += 1
        elif status == "WARNING":
            summary["warning"] += 1
        elif status == "COMPLIANT":
            summary["compliant"] += 1
    return summary


def get_vehicle_status(evaluated_detections: List[Dict[str, Any]]) -> str:
    """Returns 'NON-COMPLIANT' if any illegal detection exists, else 'COMPLIANT'."""
    for d in evaluated_detections:
        if d.get("status") == "ILLEGAL":
            return "NON-COMPLIANT"
    return "COMPLIANT"
