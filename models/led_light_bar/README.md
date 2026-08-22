# LED Light Bar Detector

Place your trained Ultralytics YOLO weights here as:

    best.pt

Once `best.pt` exists in this folder, `core/model_interface.py`
will detect it automatically. Uncomment the Ultralytics loading
block in `load_models()` and fill in real inference inside
`detect_led_light_bar()` (see the comments in that file).

Until then, the app runs this detector in DEMO MODE and returns a
realistic placeholder detection so the full pipeline and dashboard
can be tested end-to-end.
