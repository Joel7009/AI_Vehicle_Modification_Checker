# Pages

Currently the whole dashboard is single-page (app.py) with sidebar-driven
`st.session_state.current_page` routing, matching the reference design's
single-screen command-center layout.

If you later want real Streamlit multipage routing (separate URLs per
section), move the placeholder sections in app.py's `else` branch
(History, Reports, Rules, Penalty Estimator, Statistics, Profile,
Settings, Help) into files here, e.g. `pages/1_Scan_History.py`,
following Streamlit's native multipage convention.
