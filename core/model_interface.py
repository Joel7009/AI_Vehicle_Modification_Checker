"""
core/model_interface.py

=====================================================================
MODEL ABSTRACTION LAYER
=====================================================================
This is the ONLY file the UI talks to for AI inference. The UI never
imports Ultralytics/YOLO directly and never knows how a detection was
produced. That means you can drop in your real, trained .pt weights
later WITHOUT touching app.py or any file in core/ui.py.

--------------------------------------------------------------------
HOW TO PLUG IN YOUR REAL YOLO MODELS LATER
--------------------------------------------------------------------
1. Put your trained weights here:

       models/oversized_wheel/best.pt
       models/number_plate/best.pt
       models/led_light_bar/best.pt

2. In load_models() below, uncomment the Ultralytics loading block.

3. In each detect_*() function, replace the `# --- DEMO RESULT ---`
   block with a real inference call, e.g.:

       results = model.predict(image, conf=0.35)[0]
       for box in results.boxes:
           ...append a dict following STANDARD_DETECTION_SCHEMA...

4. Everything downstream (rules engine, scoring, UI) already consumes
   the standard schema below, so nothing else needs to change.

--------------------------------------------------------------------
STANDARD DETECTION SCHEMA (every detector must return a list of these)
--------------------------------------------------------------------
{
    "class_name":   "oversized_wheel",       # machine-readable key, matches rules.json
    "display_name": "Oversized Wheel",       # human readable
    "confidence":   0.91,                    # float 0-1
    "bbox":         [x1, y1, x2, y2],        # pixel coords on the ORIGINAL image
    "status":       "ILLEGAL"                # ILLEGAL | WARNING | COMPLIANT (pre rule-engine hint)
}
=====================================================================
"""

import os
import random
from typing import List, Dict, Any

import numpy as np

try:
    import streamlit as st
    _cache_resource = st.cache_resource
except Exception:  # pragma: no cover - allows this module to be unit tested outside streamlit
    def _cache_resource(*dargs, **dkwargs):
        def decorator(func):
            return func
        # allow both @_cache_resource and @_cache_resource(show_spinner=False)
        if len(dargs) == 1 and callable(dargs[0]) and not dkwargs:
            return dargs[0]
        return decorator

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")

WEIGHT_PATHS = {
    "oversized_wheel": os.path.join(MODELS_DIR, "oversized_wheel", "best.pt"),
    "number_plate": os.path.join(MODELS_DIR, "number_plate", "best.pt"),
    "led_light_bar": os.path.join(MODELS_DIR, "led_light_bar", "best.pt"),
}

DISPLAY_NAMES = {
    "oversized_wheel": "Oversized Wheel",
    "number_plate": "Number Plate Missing",
    "led_light_bar": "LED Light Bar",
}


@_cache_resource(show_spinner=False)
def load_models() -> Dict[str, Any]:
    """
    Loads (or, in demo mode, stubs out) all three detectors ONCE and
    caches them for the lifetime of the Streamlit session/process.

    Returns a dict: { "oversized_wheel": <model or None>, ... }
    A value of None means "no weights found -> running in demo mode"
    for that specific detector, so you can add your models one at a
    time without breaking the other two.
    """
    models = {}
    for key, path in WEIGHT_PATHS.items():
        if os.path.exists(path):
            # --------------------------------------------------------
            # REAL MODEL LOADING (uncomment once you add best.pt files)
            # --------------------------------------------------------
            # from ultralytics import YOLO
            # models[key] = YOLO(path)
            models[key] = None
        else:
            models[key] = None  # demo mode for this detector
    return models


def _demo_bbox(image_shape, region: str) -> List[int]:
    """Generates a plausible-looking bounding box in a given region of the image for demo mode."""
    h, w = image_shape[0], image_shape[1]
    if region == "roof":
        x1, y1 = int(w * 0.30), int(h * 0.06)
        x2, y2 = int(w * 0.62), int(h * 0.22)
    elif region == "wheel":
        x1, y1 = int(w * 0.06), int(h * 0.55)
        x2, y2 = int(w * 0.34), int(h * 0.92)
    elif region == "plate":
        x1, y1 = int(w * 0.40), int(h * 0.68)
        x2, y2 = int(w * 0.62), int(h * 0.82)
    else:
        x1, y1, x2, y2 = int(w * 0.4), int(h * 0.4), int(w * 0.6), int(h * 0.6)
    return [x1, y1, x2, y2]


def detect_led_light_bar(image: np.ndarray, model: Any = None) -> List[Dict[str, Any]]:
    """Detects unauthorized LED light bars. Returns list following STANDARD_DETECTION_SCHEMA."""
    if model is not None:
        # --- REAL INFERENCE GOES HERE ---
        # results = model.predict(image, conf=0.35)[0]
        # return _parse_yolo_results(results, "led_light_bar")
        pass

    # --- DEMO RESULT ---
    return [{
        "class_name": "led_light_bar",
        "display_name": DISPLAY_NAMES["led_light_bar"],
        "confidence": 0.89,
        "bbox": _demo_bbox(image.shape, "roof"),
        "status": "ILLEGAL",
    }]


def detect_oversized_wheel(image: np.ndarray, model: Any = None) -> List[Dict[str, Any]]:
    """Detects oversized wheels/tyres. Returns list following STANDARD_DETECTION_SCHEMA."""
    if model is not None:
        # --- REAL INFERENCE GOES HERE ---
        pass

    # --- DEMO RESULT ---
    return [{
        "class_name": "oversized_wheel",
        "display_name": DISPLAY_NAMES["oversized_wheel"],
        "confidence": 0.91,
        "bbox": _demo_bbox(image.shape, "wheel"),
        "status": "ILLEGAL",
    }]


def detect_number_plate(image: np.ndarray, model: Any = None) -> List[Dict[str, Any]]:
    """Detects a missing / obscured number plate. Returns list following STANDARD_DETECTION_SCHEMA."""
    if model is not None:
        # --- REAL INFERENCE GOES HERE ---
        pass

    # --- DEMO RESULT ---
    return [{
        "class_name": "number_plate_missing",
        "display_name": DISPLAY_NAMES["number_plate"],
        "confidence": 0.96,
        "bbox": _demo_bbox(image.shape, "plate"),
        "status": "ILLEGAL",
    }]


def merge_detections(*detection_lists: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Flattens and merges detection lists from every detector into one list."""
    merged: List[Dict[str, Any]] = []
    for dlist in detection_lists:
        merged.extend(dlist)
    return merged


def run_detection_pipeline(image: np.ndarray) -> List[Dict[str, Any]]:
    """
    Main entry point the UI calls. Runs all three detectors and returns
    a single merged, standard-schema detection list. Internally this is
    the ONLY function that needs to know how many/which detectors exist.
    """
    models = load_models()

    led = detect_led_light_bar(image, models.get("led_light_bar"))
    wheel = detect_oversized_wheel(image, models.get("oversized_wheel"))
    plate = detect_number_plate(image, models.get("number_plate"))

    return merge_detections(led, wheel, plate)
