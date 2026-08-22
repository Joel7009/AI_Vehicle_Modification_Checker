"""
app.py

AI Vehicle Modification Legality Checker - main Streamlit entry point.

Run with:
    python -m streamlit run app.py

This file ONLY wires together:
    - session_state (uploaded image, scan result, scan history, page)
    - core.ui render functions (all visuals)
    - core.scanner.run_full_scan() (the actual pipeline)
`
It contains no detection/rule/scoring logic itself - see core/ for that.
"""

import numpy as np
from PIL import Image
import streamlit as st

from core import ui
from core.scanner import run_full_scan, add_to_history

st.set_page_config(
    page_title="AI Vehicle Modification Legality Checker",
    page_icon="\U0001F6E1\uFE0F",
    layout="wide",
    initial_sidebar_state="expanded",
)

ui.inject_css()

# ----------------------------------------------------------------------
# SESSION STATE INITIALIZATION
# ----------------------------------------------------------------------
if "current_page" not in st.session_state:
    st.session_state.current_page = "dashboard"
if "uploaded_image" not in st.session_state:
    st.session_state.uploaded_image = None          # np.ndarray RGB, original (never modified)
if "scan_result" not in st.session_state:
    st.session_state.scan_result = None              # structured result from run_full_scan()
if "scan_history" not in st.session_state:
    st.session_state.scan_history = []                # list of add_to_history() rows
if "view_mode" not in st.session_state:
    st.session_state.view_mode = "AI DETECTION"       # "AI DETECTION" | "ORIGINAL IMAGE"
if "vehicle_id_input" not in st.session_state:
    st.session_state.vehicle_id_input = ""


def get_display_image():
    """Chooses which image to render in the inspection panel based on view mode + scan state."""
    if st.session_state.uploaded_image is None:
        return None
    if st.session_state.scan_result is not None and st.session_state.view_mode == "AI DETECTION":
        return st.session_state.scan_result["annotated_image"]
    return st.session_state.uploaded_image


# ----------------------------------------------------------------------
# TOP BAR + SIDEBAR (always rendered)
# ----------------------------------------------------------------------
ui.render_top_status_bar()
page = ui.render_sidebar()

# ----------------------------------------------------------------------
# PAGE: DASHBOARD / SCAN VEHICLE  (both share the full working dashboard)
# ----------------------------------------------------------------------
if page in ("dashboard", "scan"):

    col_left, col_mid, col_right = st.columns([2.1, 1.15, 1.15])

    # ---- LEFT: Vehicle Inspection ----
    with col_left:
        with st.container():
            st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
            ui.render_vehicle_inspection_panel(get_display_image(), st.session_state.scan_result is not None)

            view_cols = st.columns([1, 1, 1, 2])
            with view_cols[0]:
                st.caption("VIEW:")
            with view_cols[1]:
                if st.button("AI Detection", key="view_ai", width="stretch"):
                    st.session_state.view_mode = "AI DETECTION"
            with view_cols[2]:
                if st.button("Original", key="view_orig", width="stretch"):
                    st.session_state.view_mode = "ORIGINAL IMAGE"
            st.markdown('</div>', unsafe_allow_html=True)

        # ---- Upload + Analyze controls ----
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        uc1, uc2 = st.columns([2, 1])
        with uc1:
            uploaded_file = st.file_uploader(
                "Upload vehicle image", type=["jpg", "jpeg", "png", "webp"],
                label_visibility="collapsed",
            )
            if uploaded_file is not None:
                pil_img = Image.open(uploaded_file).convert("RGB")
                st.session_state.uploaded_image = np.array(pil_img)
                st.session_state.scan_result = None  # new image invalidates old scan
        with uc2:
            st.session_state.vehicle_id_input = st.text_input(
                "Vehicle ID (optional)", value=st.session_state.vehicle_id_input,
                placeholder="e.g. MH12AB1234", label_visibility="collapsed",
            )

        st.markdown('<div class="cta-btn">', unsafe_allow_html=True)
        analyze_clicked = st.button(
            "\u26A1  ANALYZE VEHICLE", key="analyze_btn", width="stretch",
            disabled=st.session_state.uploaded_image is None,
        )
        st.markdown('</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # ---- Trigger scan + animation ----
        if analyze_clicked and st.session_state.uploaded_image is not None:
            anim_placeholder = st.empty()
            ui.run_scanning_animation(anim_placeholder)

            result = run_full_scan(
                st.session_state.uploaded_image,
                vehicle_id=st.session_state.vehicle_id_input or None,
            )
            st.session_state.scan_result = result
            st.session_state.view_mode = "AI DETECTION"
            st.session_state.scan_history.append(add_to_history(result))
            st.rerun()

        # ---- Detection Confidence + AI Reasoning + Regulation Engine ----
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
            ui.render_detection_confidence(st.session_state.scan_result)
            st.markdown('</div>', unsafe_allow_html=True)
        with c2:
            st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
            ui.render_ai_reasoning(st.session_state.scan_result)
            st.markdown('</div>', unsafe_allow_html=True)
        with c3:
            st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
            ui.render_regulation_engine(st.session_state.scan_result)
            st.markdown('</div>', unsafe_allow_html=True)

    # ---- MIDDLE: Compliance Score ----
    with col_mid:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_compliance_gauge(st.session_state.scan_result)
        st.markdown('</div>', unsafe_allow_html=True)

    # ---- RIGHT: Detected Modifications ----
    with col_right:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_detected_modifications(st.session_state.scan_result)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("---")

    # ---- BOTTOM ROW: Analytics / Violations / Recent Scans / Quick Actions ----
    b1, b2, b3, b4 = st.columns([1.3, 1, 1.3, 1])
    with b1:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_scan_analytics(st.session_state.scan_history)
        st.markdown('</div>', unsafe_allow_html=True)
    with b2:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_violation_breakdown(st.session_state.scan_history)
        st.markdown('</div>', unsafe_allow_html=True)
    with b3:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_recent_scans(st.session_state.scan_history)
        st.markdown('</div>', unsafe_allow_html=True)
    with b4:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_quick_actions()
        st.markdown('</div>', unsafe_allow_html=True)

    ui.render_safety_tip()

# ----------------------------------------------------------------------
# OTHER NAV PAGES - placeholders, ready for future expansion
# ----------------------------------------------------------------------
else:
    page_titles = {
        "history": ("SCAN HISTORY", "Full scan history will be listed here. Currently backed by session state; move to SQLite for persistence."),
        "reports": ("REPORTS", "Generated legality reports will be listed and downloadable here (PDF export placeholder)."),
        "rules": ("RULES & REGULATIONS", "Displays the configurable rule set from rules/rules.json (CMVR references are placeholders)."),
        "penalty": ("PENALTY ESTIMATOR", "Will estimate penalty/challan amounts once official penalty tables are configured."),
        "stats": ("STATISTICS", "Deeper trend analytics across all historical scans will be built here."),
        "profile": ("USER PROFILE", "Inspector account settings will be managed here."),
        "settings": ("SETTINGS", "System preferences (thresholds, rule set version, theme) will be configured here."),
        "help": ("HELP & SUPPORT", "Guide and contact information for this project."),
    }
    title, desc = page_titles.get(page, ("PAGE", "Coming soon."))
    st.markdown(f'<div class="glass-panel"><div class="panel-title">{title}</div>'
                f'<div style="color:{ui.TEXT_DIM};font-size:13px;">{desc}</div></div>', unsafe_allow_html=True)

    if page == "history" and st.session_state.scan_history:
        st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
        ui.render_recent_scans(st.session_state.scan_history)
        st.markdown('</div>', unsafe_allow_html=True)

    if page == "rules":
        import json
        from core.rules_engine import RULES_PATH
        with open(RULES_PATH) as f:
            st.json(json.load(f))
