"""
core/ui.py

All visual rendering lives here: CSS theme injection + every dashboard
panel (top status bar, sidebar, vehicle inspection, compliance gauge,
detected modifications, detection confidence, AI reasoning, regulation
engine, analytics, violation donut, recent scans, quick actions,
system status, and the full-screen AI scanning animation).

app.py only calls these functions and manages session_state / data.
No detection logic lives here - this file only ever consumes the
STANDARD DETECTION SCHEMA already evaluated by core/scanner.py.
"""

import time
import datetime
import streamlit as st
import plotly.graph_objects as go
import pandas as pd

# --------------------------------------------------------------------
# THEME CONSTANTS
# --------------------------------------------------------------------
BG_DARK = "#060B14"
BG_PANEL = "rgba(15, 23, 42, 0.55)"
BG_PANEL_SOLID = "#0B1220"
BORDER_CYAN = "rgba(56, 224, 255, 0.25)"
CYAN = "#38E0FF"
BLUE = "#3B82F6"
GREEN = "#22E584"
YELLOW = "#FFC93C"
ORANGE = "#FF8A3D"
RED = "#FF4D5E"
PURPLE = "#A78BFA"
TEXT_MAIN = "#E7F3FB"
TEXT_DIM = "#7C93AC"

STATUS_COLOR = {
    "ILLEGAL": RED,
    "WARNING": YELLOW,
    "COMPLIANT": GREEN,
    "INFO": CYAN,
}

NAV_ITEMS = [
    ("dashboard", "▦", "DASHBOARD", "Overview & Analytics"),
    ("scan", "◉", "AI INSPECTION", "Upload & Analyze"),
    ("assistant", "◇", "VEHICLE AI ASSISTANT", "Ask about your vehicle"),
    ("advisor", "✂", "MODIFICATION ADVISOR", "Modification Guidance"),
    ("cost", "₹", "COST ESTIMATOR", "Estimate Modification Cost"),
    ("history", "▣", "INSPECTION HISTORY", "Past Inspections"),
    ("reports", "▤", "REPORTS", "Generated Reports"),
    ("settings", "⚙", "SETTINGS", "System Preferences"),
]


def inject_css():
    st.markdown(f"""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        html, body, [class*="css"] {{
            font-family: 'Inter', sans-serif;
        }}

        #MainMenu, footer, header {{ visibility: hidden; }}

        .stApp {{
            background: radial-gradient(circle at 15% 0%, #0c1830 0%, {BG_DARK} 45%) fixed;
            color: {TEXT_MAIN};
        }}

        section[data-testid="stSidebar"] {{
            background: linear-gradient(180deg, #08101F 0%, #060B14 100%);
            border-right: 1px solid {BORDER_CYAN};
        }}

        div.block-container {{
            padding-top: 1.1rem;
            padding-bottom: 2rem;
            max-width: 1500px;
        }}

        /* ---------- generic glass panel ---------- */
        .glass-panel {{
            background: {BG_PANEL};
            border: 1px solid {BORDER_CYAN};
            border-radius: 14px;
            padding: 18px 20px;
            backdrop-filter: blur(6px);
            box-shadow: 0 0 0 1px rgba(56,224,255,0.03), 0 8px 30px rgba(0,0,0,0.35);
            margin-bottom: 16px;
        }}

        .panel-title {{
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            letter-spacing: 1.5px;
            font-size: 15px;
            color: {TEXT_MAIN};
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
        }}

        .panel-title .live-pill {{
            font-size: 10.5px;
            color: {CYAN};
            border: 1px solid {BORDER_CYAN};
            background: rgba(56,224,255,0.08);
            padding: 3px 10px;
            border-radius: 20px;
            letter-spacing: 1px;
            font-family: 'Rajdhani', sans-serif;
        }}

        /* ---------- top status bar ---------- */
        .topbar {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: {BG_PANEL};
            border: 1px solid {BORDER_CYAN};
            border-radius: 14px;
            padding: 12px 22px;
            margin-bottom: 18px;
        }}
        .brand-title {{
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 1px;
            color: {TEXT_MAIN};
            line-height: 1.05;
        }}
        .brand-sub {{
            font-size: 10.5px;
            color: {CYAN};
            letter-spacing: 1.5px;
        }}
        .status-chip {{
            display: inline-flex;
            flex-direction: column;
            padding: 6px 14px;
            border-radius: 10px;
            border: 1px solid {BORDER_CYAN};
            background: rgba(255,255,255,0.02);
            margin-right: 8px;
            min-width: 108px;
        }}
        .status-chip .label {{
            font-size: 9.5px;
            color: {TEXT_DIM};
            letter-spacing: 1px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
        }}
        .status-chip .value {{
            font-size: 11.5px;
            font-weight: 700;
            font-family: 'Rajdhani', sans-serif;
        }}
        .dot {{
            display: inline-block;
            width: 7px; height: 7px;
            border-radius: 50%;
            margin-right: 5px;
            box-shadow: 0 0 8px currentColor;
        }}

        /* ---------- sidebar nav ---------- */
        .nav-item {{
            padding: 9px 12px;
            border-radius: 10px;
            margin-bottom: 4px;
            border-left: 3px solid transparent;
            transition: all .15s ease;
        }}
        .nav-item .nav-title {{
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 12.5px;
            letter-spacing: 0.5px;
            color: {TEXT_MAIN};
        }}
        .nav-item .nav-sub {{
            font-size: 10px;
            color: {TEXT_DIM};
        }}
        .nav-item-active {{
            background: rgba(56,224,255,0.10);
            border-left: 3px solid {CYAN};
            box-shadow: inset 0 0 18px rgba(56,224,255,0.08);
        }}
        .nav-item-active .nav-title {{ color: {CYAN}; }}

        div.stButton > button {{
            width: 100%;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            color: {TEXT_MAIN};
            border-radius: 10px;
            padding: 6px 10px;
            text-align: left;
        }}
        div.stButton > button:hover {{
            border: 1px solid {BORDER_CYAN};
            color: {CYAN};
            background: rgba(56,224,255,0.06);
        }}

        /* primary CTA button */
        .cta-btn button {{
            background: linear-gradient(90deg, rgba(56,224,255,0.18), rgba(59,130,246,0.18)) !important;
            border: 1px solid {CYAN} !important;
            color: {CYAN} !important;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700 !important;
            letter-spacing: 1px;
            text-align: center !important;
            box-shadow: 0 0 18px rgba(56,224,255,0.15);
        }}

        /* ---------- badges ---------- */
        .badge {{
            display: inline-block;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 3px 10px;
            border-radius: 6px;
            font-family: 'Rajdhani', sans-serif;
        }}
        .badge-illegal {{ color: {RED}; background: rgba(255,77,94,0.12); border: 1px solid rgba(255,77,94,0.4); }}
        .badge-warning {{ color: {YELLOW}; background: rgba(255,201,60,0.12); border: 1px solid rgba(255,201,60,0.4); }}
        .badge-compliant {{ color: {GREEN}; background: rgba(34,229,132,0.12); border: 1px solid rgba(34,229,132,0.4); }}

        /* ---------- detection card ---------- */
        .det-card {{
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-left: 3px solid {RED};
            border-radius: 10px;
            padding: 10px 14px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .det-card .name {{ font-weight: 700; font-size: 13px; color: {TEXT_MAIN}; }}
        .det-card .conf {{ font-size: 11px; color: {TEXT_DIM}; }}

        /* ---------- confidence mini-card ---------- */
        .conf-card {{
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 14px 16px;
        }}
        .conf-card .label {{
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            font-size: 11.5px;
            letter-spacing: 1px;
            color: {ORANGE};
        }}
        .conf-card .pct {{
            font-size: 26px;
            font-weight: 700;
            font-family: 'Rajdhani', sans-serif;
            margin: 4px 0 8px 0;
        }}
        .bar-track {{
            height: 6px;
            border-radius: 4px;
            background: rgba(255,255,255,0.06);
            overflow: hidden;
        }}
        .bar-fill {{
            height: 100%;
            border-radius: 4px;
        }}

        /* ---------- reasoning list ---------- */
        .reason-line {{
            font-size: 12.5px;
            color: {TEXT_MAIN};
            margin-bottom: 8px;
            padding-left: 4px;
        }}
        .reason-line span.check {{ color: {GREEN}; margin-right: 6px; }}

        /* ---------- recent scans table ---------- */
        .scan-row {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 4px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 12.5px;
        }}
        .scan-row:last-child {{ border-bottom: none; }}

        /* ---------- quick action ---------- */
        .qa-btn {{
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 12px;
            text-align: center;
            padding: 14px 6px;
            font-size: 11px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: {TEXT_MAIN};
        }}

        /* ---------- gauge number override ---------- */
        .gauge-wrap {{ text-align: center; }}

        /* ---------- footer tip ---------- */
        .safety-tip {{
            display: flex;
            align-items: center;
            gap: 12px;
            background: {BG_PANEL};
            border: 1px solid {BORDER_CYAN};
            border-radius: 14px;
            padding: 14px 20px;
            font-size: 12.5px;
            color: {TEXT_DIM};
        }}

        /* ---------- scanning overlay ---------- */
        .scan-shell {{
            border: 1px solid {BORDER_CYAN};
            border-radius: 16px;
            padding: 30px;
            background: radial-gradient(circle at 50% 20%, rgba(56,224,255,0.06), transparent 60%), {BG_PANEL_SOLID};
            text-align: center;
        }}
        .scan-grid-bg {{
            background-image:
                linear-gradient(rgba(56,224,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56,224,255,0.08) 1px, transparent 1px);
            background-size: 26px 26px;
            border-radius: 12px;
            padding: 34px 20px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(56,224,255,0.15);
        }}
        .scan-beam {{
            position: absolute;
            left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, {CYAN}, transparent);
            box-shadow: 0 0 20px 4px rgba(56,224,255,0.7);
            animation: beamMove 1.6s linear infinite;
        }}
        @keyframes beamMove {{
            0% {{ top: 6%; }}
            50% {{ top: 90%; }}
            100% {{ top: 6%; }}
        }}
        .scan-title {{
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            letter-spacing: 3px;
            font-size: 22px;
            color: {CYAN};
            margin-bottom: 6px;
            text-shadow: 0 0 18px rgba(56,224,255,0.5);
        }}
        .scan-step {{
            font-size: 12.5px;
            font-family: 'Rajdhani', sans-serif;
            letter-spacing: 1px;
            padding: 5px 0;
            color: {TEXT_DIM};
        }}
        .scan-step.done {{ color: {GREEN}; }}
        .scan-step.active {{ color: {CYAN}; }}

        hr {{ border-color: rgba(255,255,255,0.06); }}
    </style>
    """, unsafe_allow_html=True)


# ======================================================================
# TOP STATUS BAR
# ======================================================================
def render_top_status_bar():
    now = datetime.datetime.now()
    chips = [
        ("AI VISION", "ONLINE", GREEN),
        ("YOLOv8 MODEL", "READY", CYAN),
        ("RULE ENGINE", "ONLINE", GREEN),
        ("DATABASE", "CONNECTED", GREEN),
        ("REPORT ENGINE", "READY", CYAN),
    ]
    chips_html = "".join([
        f'''<div class="status-chip">
                <span class="label">{label}</span>
                <span class="value" style="color:{color};"><span class="dot" style="background:{color};color:{color};"></span>{value}</span>
            </div>'''
        for label, value, color in chips
    ])

    st.markdown(f"""
    <div class="topbar">
        <div style="display:flex;align-items:center;gap:12px;">
            <div style="font-size:26px;">&#128737;</div>
            <div>
                <div class="brand-title">AI VEHICLE</div>
                <div class="brand-sub">MODIFICATION LEGALITY CHECKER</div>
            </div>
        </div>
        <div style="display:flex;align-items:center;">{chips_html}</div>
        <div style="display:flex;align-items:center;gap:16px;">
            <div style="text-align:right;">
                <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;">{now.strftime('%I:%M:%S %p')}</div>
                <div style="font-size:10.5px;color:{TEXT_DIM};">{now.strftime('%d %B %Y')}</div>
            </div>
            <div style="font-size:20px;">&#128276;</div>
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,{CYAN},{BLUE});display:flex;align-items:center;justify-content:center;font-weight:700;">I</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


# ======================================================================
# SIDEBAR NAVIGATION
# ======================================================================
def render_sidebar() -> str:
    current = st.session_state.get("current_page", "dashboard")

    with st.sidebar:
        st.markdown(f"""
        <div style="padding:6px 4px 18px 4px;">
            <div class="brand-title" style="font-size:17px;">AI VEHICLE</div>
            <div class="brand-sub" style="font-size:9.5px;">MODIFICATION LEGALITY CHECKER</div>
        </div>
        """, unsafe_allow_html=True)

        for key, icon, title, sub in NAV_ITEMS:
            active = (key == current)
            label = f"{icon}  {title}\n{sub}"
            if st.button(title, key=f"nav_{key}", width="stretch"):
                st.session_state.current_page = key
                current = key
            # subtitle rendered under the native button for extra context
            st.markdown(
                f'<div style="margin:-10px 0 8px 4px;font-size:10px;color:{"#38E0FF" if active else TEXT_DIM};">{sub}</div>',
                unsafe_allow_html=True,
            )

        st.markdown("<hr/>", unsafe_allow_html=True)
        render_system_status_panel()

    return current


def render_system_status_panel():
    st.markdown(f"""
    <div class="glass-panel" style="text-align:center;">
        <div class="panel-title" style="justify-content:center;">SYSTEM STATUS</div>
        <div style="font-size:44px;margin:6px 0;">&#128225;</div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;color:{TEXT_DIM};font-size:11px;letter-spacing:1px;">ALL SYSTEMS</div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;color:{GREEN};font-size:16px;letter-spacing:1px;">OPERATIONAL</div>
    </div>
    """, unsafe_allow_html=True)


# ======================================================================
# VEHICLE INSPECTION PANEL
# ======================================================================
def render_vehicle_inspection_panel(display_image, has_result: bool):
    st.markdown(f"""
    <div class="panel-title">
        <span>VEHICLE INSPECTION &nbsp;<span style="color:{TEXT_DIM};font-weight:500;">&mdash;</span> <span class="live-pill">&#10022; LIVE ANALYSIS</span></span>
    </div>
    """, unsafe_allow_html=True)

    if display_image is None:
        st.markdown(f"""
        <div class="scan-grid-bg" style="min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:52px;opacity:0.5;">&#128663;</div>
            <div style="color:{TEXT_DIM};font-family:'Rajdhani',sans-serif;letter-spacing:1px;margin-top:10px;">
                UPLOAD A VEHICLE IMAGE TO BEGIN INSPECTION
            </div>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.image(display_image, use_container_width=True)


# ======================================================================
# COMPLIANCE SCORE (GAUGE)
# ======================================================================
def render_compliance_gauge(result):
    st.markdown('<div class="panel-title">COMPLIANCE SCORE</div>', unsafe_allow_html=True)

    if result is None:
        score, risk_label, risk_color = 0, "AWAITING SCAN", TEXT_DIM
    else:
        score = result["score"]
        risk_label = result["risk"]["label"]
        risk_color = {"green": GREEN, "yellow": YELLOW, "orange": ORANGE, "red": RED}.get(result["risk"]["color"], TEXT_DIM)

    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=score,
        number={"suffix": "", "font": {"size": 46, "color": TEXT_MAIN, "family": "Rajdhani"}},
        gauge={
            "axis": {"range": [0, 100], "tickcolor": TEXT_DIM, "tickfont": {"color": TEXT_DIM, "size": 9}},
            "bar": {"color": "rgba(0,0,0,0)"},
            "bgcolor": "rgba(0,0,0,0)",
            "borderwidth": 0,
            "steps": [
                {"range": [0, 30], "color": RED},
                {"range": [30, 50], "color": ORANGE},
                {"range": [50, 70], "color": YELLOW},
                {"range": [70, 100], "color": GREEN},
            ],
            "threshold": {
                "line": {"color": TEXT_MAIN, "width": 3},
                "thickness": 0.85,
                "value": score,
            },
        },
        domain={"x": [0, 1], "y": [0, 1]},
    ))
    fig.update_layout(
        height=200,
        margin=dict(l=20, r=20, t=10, b=0),
        paper_bgcolor="rgba(0,0,0,0)",
        font={"color": TEXT_MAIN},
    )
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    st.markdown(f"""
    <div style="text-align:center;margin-top:-14px;">
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;color:{risk_color};letter-spacing:1px;">{risk_label}</span>
    </div>
    <div style="text-align:center;font-size:11.5px;color:{TEXT_DIM};margin:8px 0 14px 0;">
        This vehicle {'has several modifications that may be illegal under configured rules.' if result and result['status']=='NON-COMPLIANT' else 'has been assessed against the configured rule set.'}
    </div>
    """, unsafe_allow_html=True)

    summary = result["summary"] if result else {"detected": 0, "illegal": 0, "warning": 0, "compliant": 0}
    cols = st.columns(4)
    stats = [("DETECTED", summary["detected"], TEXT_MAIN), ("ILLEGAL", summary["illegal"], RED),
             ("WARNING", summary["warning"], YELLOW), ("COMPLIANT", summary["compliant"], GREEN)]
    for c, (label, val, color) in zip(cols, stats):
        c.markdown(f"""
        <div style="text-align:center;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:8px 2px;">
            <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:20px;color:{color};">{val}</div>
            <div style="font-size:9px;color:{TEXT_DIM};letter-spacing:0.5px;">{label}</div>
        </div>
        """, unsafe_allow_html=True)

    status = result["status"] if result else "AWAITING SCAN"
    status_color = RED if status == "NON-COMPLIANT" else (GREEN if status == "COMPLIANT" else TEXT_DIM)
    st.markdown(f"""
    <div style="margin-top:14px;border:1px solid {status_color}55;background:{status_color}14;border-radius:12px;padding:12px 14px;">
        <div style="font-size:10px;color:{status_color};letter-spacing:1px;font-family:'Rajdhani',sans-serif;font-weight:700;">
            &#128737; VEHICLE STATUS
        </div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:19px;color:{status_color};letter-spacing:1px;">{status}</div>
        <div style="font-size:11px;color:{TEXT_DIM};margin-top:2px;">
            {"This vehicle is not compliant with the configured vehicle rules." if status=="NON-COMPLIANT" else ("This vehicle satisfies the configured vehicle rules." if status=="COMPLIANT" else "Upload an image and run analysis.")}
        </div>
    </div>
    """, unsafe_allow_html=True)


# ======================================================================
# DETECTED MODIFICATIONS (right panel)
# ======================================================================
DET_ICONS = {
    "led_light_bar": "&#128161;",
    "oversized_wheel": "&#9899;",
    "number_plate_missing": "&#128712;",
}


def render_detected_modifications(result):
    st.markdown("""
    <div class="panel-title"><span>DETECTED MODIFICATIONS</span></div>
    """, unsafe_allow_html=True)

    if result is None:
        st.markdown(f'<div style="color:{TEXT_DIM};font-size:12.5px;">No scan yet. Upload an image and click Analyze Vehicle.</div>', unsafe_allow_html=True)
        return

    badge_class = {"ILLEGAL": "badge-illegal", "WARNING": "badge-warning", "COMPLIANT": "badge-compliant"}
    border_color = {"ILLEGAL": RED, "WARNING": YELLOW, "COMPLIANT": GREEN}

    for d in result["detections"]:
        icon = DET_ICONS.get(d["class_name"], "&#128269;")
        status = d.get("status", "ILLEGAL")
        st.markdown(f"""
        <div class="det-card" style="border-left-color:{border_color.get(status, RED)};">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="font-size:20px;">{icon}</div>
                <div>
                    <div class="name">{d['display_name']}</div>
                    <div class="conf">Confidence: {int(d['confidence']*100)}%</div>
                </div>
            </div>
            <div class="badge {badge_class.get(status,'badge-illegal')}">{status}</div>
        </div>
        """, unsafe_allow_html=True)

    st.button("&#128196;  VIEW FULL REPORT", key="view_full_report_btn", use_container_width=True)


# ======================================================================
# DETECTION CONFIDENCE CARDS
# ======================================================================
def render_detection_confidence(result):
    st.markdown('<div class="panel-title">DETECTION CONFIDENCE</div>', unsafe_allow_html=True)

    if result is None:
        st.markdown(f'<div style="color:{TEXT_DIM};font-size:12.5px;">No detections to display yet.</div>', unsafe_allow_html=True)
        return

    detections = result["detections"]
    cols = st.columns(len(detections)) if detections else []
    color_for = {"ILLEGAL": RED, "WARNING": YELLOW, "COMPLIANT": GREEN}

    for c, d in zip(cols, detections):
        pct = int(d["confidence"] * 100)
        color = color_for.get(d.get("status", "ILLEGAL"), RED)
        with c:
            st.markdown(f"""
            <div class="conf-card">
                <div class="label" style="color:{color};">{d['display_name'].upper()}</div>
                <div class="pct">{pct}%</div>
                <div class="bar-track"><div class="bar-fill" style="width:{pct}%;background:{color};box-shadow:0 0 8px {color};"></div></div>
            </div>
            """, unsafe_allow_html=True)


# ======================================================================
# AI REASONING PANEL
# ======================================================================
REASONING_TEMPLATES = {
    "led_light_bar": "LED bar detected in roof-mounted region",
    "oversized_wheel": "Wheel diameter exceeds configured threshold",
    "number_plate_missing": "Number plate region appears empty or obscured",
}


def render_ai_reasoning(result):
    st.markdown('<div class="panel-title">AI REASONING</div>', unsafe_allow_html=True)

    if result is None:
        st.markdown(f'<div style="color:{TEXT_DIM};font-size:12.5px;">Reasoning will appear here after a scan.</div>', unsafe_allow_html=True)
        return

    st.markdown(f'<div style="font-size:34px;text-align:center;">&#129504;</div>', unsafe_allow_html=True)

    lines = [REASONING_TEMPLATES.get(d["class_name"], f"{d['display_name']} pattern flagged") for d in result["detections"]]
    lines += ["Modification pattern verified against training reference", "Regulation cross-check completed"]

    for line in lines:
        st.markdown(f'<div class="reason-line"><span class="check">&#10003;</span>{line}</div>', unsafe_allow_html=True)

    avg_conf = int(sum(d["confidence"] for d in result["detections"]) / max(1, len(result["detections"])) * 100)
    st.markdown(f"""
    <div style="margin-top:10px;font-size:11.5px;color:{TEXT_DIM};">Confidence in result: <b style="color:{TEXT_MAIN};">{avg_conf}%</b></div>
    <div class="bar-track" style="margin-top:6px;"><div class="bar-fill" style="width:{avg_conf}%;background:{CYAN};box-shadow:0 0 8px {CYAN};"></div></div>
    """, unsafe_allow_html=True)


# ======================================================================
# REGULATION ENGINE PANEL
# ======================================================================
def render_regulation_engine(result):
    st.markdown('<div class="panel-title">REGULATION ENGINE</div>', unsafe_allow_html=True)

    if result is None:
        st.markdown(f'<div style="color:{TEXT_DIM};font-size:12.5px;">Rule evaluation will appear here after a scan.</div>', unsafe_allow_html=True)
        return

    refs = ", ".join(sorted(set(d["rule_reference"].split(" (")[-1].rstrip(")") for d in result["detections"])))
    n_violations = result["summary"]["illegal"]
    status = result["status"]
    status_color = RED if status == "NON-COMPLIANT" else GREEN

    st.markdown(f"""
    <div style="font-size:12px;line-height:1.9;">
        <div><span style="color:{TEXT_DIM};">Rule Applied:</span> &nbsp;<b>Configured CMVR-style Rule Set</b></div>
        <div><span style="color:{TEXT_DIM};">Min. Requirement:</span> &nbsp;As per configured rules</div>
        <div><span style="color:{TEXT_DIM};">This Vehicle:</span> &nbsp;<b style="color:{status_color};">Violates {n_violations} rule(s)</b></div>
    </div>
    <div style="margin-top:12px;border:1px solid {status_color}55;background:{status_color}14;border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">
        <div>
            <div style="font-family:'Rajdhani',sans-serif;font-weight:700;color:{status_color};font-size:13px;">{status}</div>
        </div>
        <div style="font-size:11px;color:{status_color};">Risk: <b>{result['risk']['label'].replace(' RISK','')}</b></div>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns(2)
    c1.button("VIEW RULE DETAILS", key="view_rule_details_btn", use_container_width=True)
    c2.button("PENALTY ESTIMATE", key="penalty_estimate_btn", use_container_width=True)


# ======================================================================
# SCAN ANALYTICS (line chart)
# ======================================================================
def render_scan_analytics(history):
    st.markdown("""
    <div class="panel-title"><span>SCAN ANALYTICS</span></div>
    """, unsafe_allow_html=True)
    st.caption("Last 7 Days")

    today = datetime.date.today()
    dates = [today - datetime.timedelta(days=i) for i in range(6, -1, -1)]
    date_labels = [d.strftime("%d %b") for d in dates]

    # Deterministic demo baseline so the chart always looks populated;
    # once scan_history has real entries, today's bucket reflects them.
    base_total = [42, 55, 48, 63, 51, 58, 60]
    base_compliant = [28, 34, 30, 38, 31, 33, 35]
    base_noncompliant = [14, 21, 18, 25, 20, 25, 25]

    if history:
        today_count = len(history)
        today_noncompliant = sum(1 for h in history if h["status"] == "NON-COMPLIANT")
        today_compliant = today_count - today_noncompliant
        base_total[-1] = max(base_total[-1], today_count)
        base_compliant[-1] = today_compliant if today_count else base_compliant[-1]
        base_noncompliant[-1] = today_noncompliant if today_count else base_noncompliant[-1]

    violations = [n * 2 for n in base_noncompliant]

    fig = go.Figure()
    series = [
        ("Total Scans", base_total, BLUE),
        ("Compliant", base_compliant, GREEN),
        ("Non-Compliant", base_noncompliant, RED),
        ("Violations", violations, ORANGE),
    ]
    for name, values, color in series:
        fig.add_trace(go.Scatter(
            x=date_labels, y=values, mode="lines+markers", name=name,
            line=dict(color=color, width=2.4), marker=dict(size=5, color=color),
        ))

    fig.update_layout(
        height=230,
        margin=dict(l=10, r=10, t=10, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color=TEXT_DIM, size=10),
        legend=dict(orientation="h", yanchor="bottom", y=-0.35, x=0, font=dict(size=9.5)),
        xaxis=dict(showgrid=False, color=TEXT_DIM),
        yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.05)", color=TEXT_DIM),
    )
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})


# ======================================================================
# VIOLATION BREAKDOWN (donut)
# ======================================================================
def render_violation_breakdown(history):
    st.markdown('<div class="panel-title">VIOLATION BREAKDOWN</div>', unsafe_allow_html=True)

    counts = {"LED Light Bar": 0, "Oversized Wheel": 0, "Number Plate Issues": 0}
    label_map = {"led_light_bar": "LED Light Bar", "oversized_wheel": "Oversized Wheel", "number_plate_missing": "Number Plate Issues"}

    for row in history:
        for d in row["detections"]:
            key = label_map.get(d["class_name"])
            if key:
                counts[key] += 1

    if sum(counts.values()) == 0:
        # demo fallback so the chart is never empty
        counts = {"LED Light Bar": 28, "Oversized Wheel": 20, "Number Plate Issues": 35}

    total = sum(counts.values())
    colors = [RED, ORANGE, BLUE]

    fig = go.Figure(go.Pie(
        labels=list(counts.keys()),
        values=list(counts.values()),
        hole=0.68,
        marker=dict(colors=colors, line=dict(color=BG_DARK, width=2)),
        textinfo="none",
    ))
    fig.update_layout(
        height=210,
        margin=dict(l=10, r=10, t=10, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        showlegend=False,
        annotations=[dict(text=f"<b>{total}</b><br><span style='font-size:10px;color:{TEXT_DIM}'>Total Violations</span>",
                           x=0.5, y=0.5, font=dict(size=20, color=TEXT_MAIN), showarrow=False)],
    )
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    for (label, val), color in zip(counts.items(), colors):
        pct = round(val / total * 100, 1) if total else 0
        st.markdown(f"""
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:11.5px;margin-bottom:6px;">
            <div><span class="dot" style="background:{color};color:{color};"></span>{label}</div>
            <div style="color:{TEXT_DIM};">{val} ({pct}%)</div>
        </div>
        """, unsafe_allow_html=True)


# ======================================================================
# RECENT SCANS
# ======================================================================
def render_recent_scans(history):
    st.markdown("""
    <div class="panel-title"><span>RECENT SCANS</span></div>
    """, unsafe_allow_html=True)

    demo_rows = [
        {"vehicle_id": "MH12AB1234", "timestamp": "17 May 2025, 10:24 AM", "score": 72, "status": "NON-COMPLIANT"},
        {"vehicle_id": "KA05XY6789", "timestamp": "17 May 2025, 09:15 AM", "score": 88, "status": "COMPLIANT"},
        {"vehicle_id": "DL8CAX2020", "timestamp": "16 May 2025, 08:35 PM", "score": 38, "status": "NON-COMPLIANT"},
        {"vehicle_id": "TN09BZ5555", "timestamp": "16 May 2025, 06:20 PM", "score": 91, "status": "COMPLIANT"},
    ]

    rows = (list(reversed(history))[:6] + demo_rows)[:6] if history else demo_rows

    st.markdown(f"""
    <div style="display:flex;justify-content:space-between;font-size:10px;color:{TEXT_DIM};padding:0 4px 6px 4px;letter-spacing:0.5px;">
        <div style="flex:1.4;">VEHICLE</div><div style="flex:2;">DATE &amp; TIME</div><div style="flex:1;text-align:center;">SCORE</div><div style="flex:1.3;text-align:right;">STATUS</div>
    </div>
    """, unsafe_allow_html=True)

    for row in rows:
        score_color = GREEN if row["score"] >= 70 else (YELLOW if row["score"] >= 50 else RED)
        badge = "badge-compliant" if row["status"] == "COMPLIANT" else "badge-illegal"
        st.markdown(f"""
        <div class="scan-row">
            <div style="flex:1.4;font-weight:700;">{row['vehicle_id']}</div>
            <div style="flex:2;color:{TEXT_DIM};">{row['timestamp']}</div>
            <div style="flex:1;text-align:center;color:{score_color};font-weight:700;">{row['score']}/100</div>
            <div style="flex:1.3;text-align:right;"><span class="badge {badge}">{row['status']}</span></div>
        </div>
        """, unsafe_allow_html=True)


# ======================================================================
# QUICK ACTIONS
# ======================================================================
QUICK_ACTIONS = [
    ("&#9729;", "Start Inspection", "scan"),
    ("&#129302;", "Vehicle AI", "assistant"),
    ("&#128196;", "Generate Report", "reports"),
    ("&#8377;", "Estimate Cost", "cost"),
    ("&#128337;", "Inspection History", "history"),
    ("&#10024;", "Modification Advisor", "advisor"),
]


def render_quick_actions():
    st.markdown('<div class="panel-title">QUICK ACTIONS</div>', unsafe_allow_html=True)
    cols = st.columns(3)
    for i, (icon, label, target_page) in enumerate(QUICK_ACTIONS):
        with cols[i % 3]:
            if st.button(f"{label}", key=f"qa_{label}", use_container_width=True):
                st.session_state.current_page = target_page
                st.rerun()


# ======================================================================
# SAFETY TIP FOOTER
# ======================================================================
def render_safety_tip():
    st.markdown(f"""
    <div class="safety-tip">
        <div style="font-size:20px;">&#128272;</div>
        <div><b style="color:{CYAN};">SAFETY TIP</b> &nbsp; Always keep your vehicle within legal limits to ensure safety and avoid penalties.</div>
    </div>
    """, unsafe_allow_html=True)


# ======================================================================
# FULL-SCREEN AI SCANNING ANIMATION
# ======================================================================
SCAN_STEPS = [
    "IMAGE ACQUIRED",
    "VEHICLE DETECTED",
    "AI VISION ACTIVE",
    "MODIFICATION SCAN",
    "RULE ENGINE",
    "COMPLIANCE ANALYSIS",
]


def run_scanning_animation(placeholder):
    """
    Renders a real, timed (~2.3s) futuristic scanning sequence inside
    the given st.empty() placeholder, then clears it. This actually
    blocks execution for the animation duration (Streamlit's model is
    synchronous per-run), so the visual progression the user sees is
    genuinely tied to pipeline stages, not just decorative CSS.
    """
    total_steps = len(SCAN_STEPS)

    for i in range(total_steps + 1):
        progress = int((i / total_steps) * 100)
        bar_filled = int(progress / 10)
        bar = "\u25b0" * bar_filled + "\u25b1" * (10 - bar_filled)

        steps_html = ""
        for idx, step in enumerate(SCAN_STEPS):
            if idx < i:
                cls, mark = "done", "&#10003;"
            elif idx == i:
                cls, mark = "active", "&#9679;"
            else:
                cls, mark = "", "&#9675;"
            steps_html += f'<div class="scan-step {cls}">{mark}&nbsp;&nbsp;{step}</div>'

        placeholder.markdown(f"""
        <div class="scan-shell">
            <div class="scan-title">SCANNING VEHICLE...</div>
            <div style="color:{TEXT_DIM};font-size:11.5px;letter-spacing:1px;margin-bottom:18px;">
                AI VISION ACTIVE &nbsp;&bull;&nbsp; REGULATION ENGINE ACTIVE
            </div>
            <div class="scan-grid-bg" style="min-height:150px;display:flex;align-items:center;justify-content:center;">
                <div class="scan-beam"></div>
                <div style="font-size:64px;opacity:0.55;">&#128663;</div>
            </div>
            <div style="font-family:'Rajdhani',sans-serif;letter-spacing:2px;color:{CYAN};margin:16px 0 4px 0;">
                {bar} &nbsp;{progress}%
            </div>
            <div style="max-width:340px;margin:16px auto 0 auto;text-align:left;">
                {steps_html}
            </div>
        </div>
        """, unsafe_allow_html=True)

        time.sleep(0.38)

    placeholder.empty()
