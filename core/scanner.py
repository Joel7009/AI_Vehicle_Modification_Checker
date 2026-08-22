"""
core/scanner.py

Orchestration layer. Wires together:
    model_interface.run_detection_pipeline()  -> raw detections
    rules_engine.evaluate_all()               -> legality verdicts
    scoring.calculate_compliance_score()      -> 0-100 score + risk

...and produces ONE structured result object that the UI renders.
Also owns bounding-box drawing (OpenCV) and scan-history bookkeeping.
"""

import datetime
from typing import Dict, Any, List

import cv2
import numpy as np

from core.model_interface import run_detection_pipeline
from core.rules_engine import evaluate_all
from core.scoring import calculate_compliance_score, get_risk_level, summarize_detections, get_vehicle_status

STATUS_COLORS_BGR = {
    "ILLEGAL": (60, 60, 255),      # red/orange
    "WARNING": (0, 210, 255),      # yellow
    "COMPLIANT": (110, 220, 90),   # green
    "INFO": (255, 210, 60),        # cyan-ish
}


def run_full_scan(image_rgb: np.ndarray, vehicle_id: str = None) -> Dict[str, Any]:
    """
    Runs the complete pipeline on an RGB numpy image and returns a
    structured result:

    {
        "score": 72,
        "status": "NON-COMPLIANT",
        "risk": {"label": "HIGH RISK", "color": "orange"},
        "detections": [ ...evaluated detections... ],
        "summary": {"detected": 3, "illegal": 3, "warning": 0, "compliant": 0},
        "annotated_image": <np.ndarray RGB with boxes drawn>,
        "timestamp": "17 May 2025, 10:24 AM",
        "vehicle_id": "MH12AB1234" or None
    }
    """
    raw_detections = run_detection_pipeline(image_rgb)
    evaluated = evaluate_all(raw_detections)

    score = calculate_compliance_score(evaluated)
    risk = get_risk_level(score)
    status = get_vehicle_status(evaluated)
    summary = summarize_detections(evaluated)
    annotated = draw_detections(image_rgb, evaluated)

    return {
        "score": score,
        "status": status,
        "risk": risk,
        "detections": evaluated,
        "summary": summary,
        "annotated_image": annotated,
        "timestamp": datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "vehicle_id": vehicle_id,
    }


def draw_detections(image_rgb: np.ndarray, detections: List[Dict[str, Any]]) -> np.ndarray:
    """
    Draws bounding boxes + label + confidence + status onto a COPY of
    the original image using OpenCV. The original uploaded image is
    never modified in place.
    """
    img = image_rgb.copy()
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    for d in detections:
        x1, y1, x2, y2 = d["bbox"]
        color = STATUS_COLORS_BGR.get(d.get("status", "INFO"), STATUS_COLORS_BGR["INFO"])

        cv2.rectangle(img_bgr, (x1, y1), (x2, y2), color, 3)

        label = f'{d["display_name"]}  {int(d["confidence"]*100)}%'
        (tw, th), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        label_y1 = max(0, y1 - th - 12)
        cv2.rectangle(img_bgr, (x1, label_y1), (x1 + tw + 12, y1), color, -1)
        cv2.putText(img_bgr, label, (x1 + 6, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (10, 10, 15), 2, cv2.LINE_AA)

    return cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)


def add_to_history(result: Dict[str, Any]) -> Dict[str, Any]:
    """Builds a compact scan-history row from a full scan result. Storage handled by caller (session_state)."""
    return {
        "vehicle_id": result.get("vehicle_id") or "UNIDENTIFIED",
        "timestamp": result["timestamp"],
        "score": result["score"],
        "status": result["status"],
        "detections": result["detections"],
    }
