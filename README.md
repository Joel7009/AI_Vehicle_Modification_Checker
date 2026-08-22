# AI Vehicle Modification Legality Checker

An MSc AI project dashboard: upload a vehicle image, run it through an
AI detection pipeline, cross-check detections against a configurable
rule engine, and get a compliance score + legality report — all inside
a futuristic, single-page Streamlit "AI command center" UI.

Ships in **DEMO MODE** out of the box — no trained model weights
required to run and explore the full UI/UX and pipeline.

---

## 1. Requirements

- Python 3.9–3.12
- Windows, macOS, or Linux

## 2. Install (Windows / macOS / Linux)

```bash
# 1. Extract the ZIP, then open a terminal inside the project folder
cd AI_Vehicle_Modification_Checker

# 2. (Recommended) create a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

## 3. Run

```bash
python -m streamlit run app.py
```

Streamlit will print a local URL (usually `http://localhost:8501`) —
open it in your browser.

---

## 4. What works right now (Demo Mode)

- Upload a vehicle image (JPG/PNG/WEBP)
- Click **ANALYZE VEHICLE** → a real, timed AI-scanning animation runs
  (image acquired → vehicle detected → AI vision active → modification
  scan → rule engine → compliance analysis)
- Three demo detections are generated: **LED Light Bar**, **Oversized
  Wheel**, **Number Plate Missing**
- Bounding boxes are drawn onto the image with OpenCV
- The **Regulation Engine** cross-checks each detection against
  `rules/rules.json`
- A **Compliance Score** (0–100) and risk level are calculated
  dynamically — not hard-coded
- **Detected Modifications**, **Detection Confidence**, **AI
  Reasoning**, **Scan Analytics**, **Violation Breakdown**, and
  **Recent Scans** all render dynamically from the pipeline's output
  object (and grow as you run more scans in a session)

## 5. Plugging in your real YOLO models

Everything is designed so your three trained detectors slot in without
touching the UI:

1. Train each model separately (Ultralytics YOLOv8 recommended).
2. Drop the weights in:
   ```
   models/oversized_wheel/best.pt
   models/number_plate/best.pt
   models/led_light_bar/best.pt
   ```
3. Open `core/model_interface.py`:
   - Uncomment the `from ultralytics import YOLO` / `YOLO(path)` lines
     in `load_models()`.
   - Replace the `# --- DEMO RESULT ---` block in each
     `detect_*()` function with a real `model.predict(...)` call,
     converting the output boxes into the **standard detection
     schema**:
     ```python
     {
         "class_name": "oversized_wheel",
         "display_name": "Oversized Wheel",
         "confidence": 0.91,
         "bbox": [x1, y1, x2, y2],
         "status": "ILLEGAL",
     }
     ```
4. That's it — `core/rules_engine.py`, `core/scoring.py`,
   `core/scanner.py`, and every panel in `core/ui.py` already consume
   that schema and need **no changes**.

You can add one model at a time; any detector without a `best.pt`
simply keeps returning its demo result.

## 6. Editing the legal rules

All rule text, references, risk levels, and score penalties live in
`rules/rules.json` — no Python changes needed to update them. Replace
the `CONFIGURE_OFFICIAL_RULE` placeholders with real CMVR clause
references once you have them finalized.

## 7. Project structure

```
AI_Vehicle_Modification_Checker/
    app.py                      # Streamlit entry point — wiring only
    requirements.txt
    README.md
    core/
        model_interface.py      # AI model abstraction layer (plug in YOLO here)
        scanner.py               # Orchestrates detection -> rules -> scoring
        rules_engine.py          # Loads/evaluates rules/rules.json
        scoring.py                # Compliance score + risk level
        ui.py                      # All CSS + panel rendering (futuristic theme)
    models/
        oversized_wheel/         # put best.pt here later
        number_plate/            # put best.pt here later
        led_light_bar/           # put best.pt here later
    rules/
        rules.json                # configurable legal rule set
    assets/                        # logos/fonts/demo images (optional)
    uploads/                        # (runtime scratch space)
    outputs/                        # (runtime scratch space, e.g. reports)
    pages/                          # notes for future native multipage routing
```

## 8. Notes

- Scan history currently lives in `st.session_state` (resets when the
  Streamlit process restarts). Swap in SQLite/a real DB later without
  touching the UI — just change how `scan_history` is populated/read
  in `app.py`.
- Report generation (`VIEW FULL REPORT` / `GENERATE REPORT`) is wired
  as a UI action point; hook it up to a PDF exporter (e.g. `reportlab`
  or `fpdf2`) using the `scan_result` object already available in
  `st.session_state`.
- `rule_reference` / `requirement` / penalty values in `rules.json`
  are **placeholders** — replace with verified CMVR text before using
  this for anything beyond demonstration.
