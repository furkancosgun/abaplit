"""
abaplit Demo 007 – Streamlit Gallery (Python)

Ayni widget setinin Streamlit native implementasyonu.
ABAP karsiligi: src/demo/zcl_abaplit_demo_007.clas.abap

Calistirma:
  pip install streamlit pandas
  streamlit run streamlit_gallery/app.py
  # veya
  streamlit run src/demo/demo_007_streamlit.py

Tema karsilastirmasi icin ABAP demo'yu da calistirin:
  npm start  -> http://localhost:3000/?app=zcl_abaplit_demo_007
"""

import streamlit as st
import pandas as pd
import datetime
import json

st.set_page_config(page_title="Demo 007: Complete Widget Gallery (Streamlit)", layout="wide", page_icon="⚡")

# --- Session state defaults (mirrors ABAP mv_*) ---
defaults = {
    "mv_text": "Hello abaplit",
    "mv_text_pwd": "s3cr3t",
    "mv_number": 42,
    "mv_textarea": "abaplit brings Streamlit DX to ABAP.",
    "mv_checkbox": True,
    "mv_toggle": False,
    "mv_color": "#ff4b4b",
    "mv_radio": "Option B",
    "mv_selectbox": "Enterprise Cloud",
    "mv_multiselect": ["ABAP", "Streamlit"],
    "mv_pills": "React",
    "mv_segmented": "Frontend",
    "mv_feedback_s": 5,
    "mv_feedback_t": 1,  # 0=down 1=up for thumbs
    "mv_slider": 72,
    "mv_select_sl": "Medium",
    "mv_date": datetime.date(2026, 9, 20),
    "mv_time": datetime.time(14, 30),
    "mv_form_name": "",
    "mv_form_role": "Developer",
    "mv_progress": 68,
    "mv_sidebar_note": "Widget Gallery",
    "mv_show_extra": False,
}
for k, v in defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v
# sync sidebar color with main color (avoid duplicate key)
if "mv_color_sidebar" not in st.session_state:
    st.session_state["mv_color_sidebar"] = st.session_state["mv_color"]

# Sidebar (mirrors ABAP sb->sidebar())
with st.sidebar:
    st.link_button("<- Back to Hub (ABAP)", "http://localhost:3000/?app=zcl_abaplit_demo_000")
    st.divider()
    st.title("Widget Gallery")
    st.caption("All frontend widgets in one demo (Streamlit native)")
    # streamlit 1.40+ has st.badge
    try:
        st.badge("v007 Complete", color="red")
    except Exception:
        st.markdown("`v007 Complete` :red[●]")
    st.metric("Total Widgets", "48+", delta="Complete")
    st.divider()
    st.text_input("Sidebar Search:", key="mv_sidebar_note", placeholder="Filter...")
    st.toggle("Show Extra Section", key="mv_show_extra")
    st.color_picker("Theme Accent", key="mv_color_sidebar")
    st.divider()
    st.download_button("Download Sample JSON", data=json.dumps({"demo": "007", "framework": "streamlit"}, indent=2), file_name="streamlit_demo_007.json", mime="application/json")
    try:
        st.page_link("streamlit_gallery/app.py", label="Go to Tables Demo (page_link)")
    except Exception:
        st.caption("page_link: Go to Tables Demo")

# Main header Typography
st.title("Demo 007: Complete Widget Gallery")
st.write("Frontend `web/src/components` altindaki tum widgetlarin Streamlit native karsiligi. ABAP implementasyonu: `src/demo/zcl_abaplit_demo_007.clas.abap`")
st.markdown("**Amac:** Tema, API ve davranis farklarini birebir karsilastirmak icin ayni widget setinin iki implementasyonu.")
st.caption("Tip: Streamlit'te state `st.session_state` ile, abaplit'te `client->bind(mv_*)` ile tutulur.")
st.divider()

kpi1, kpi2, kpi3 = st.columns(3)
kpi1.metric("Employees", "4", delta="+4")
kpi2.metric("Coverage", "100%", delta="All widgets")
kpi3.metric("Sync Mode", "Reactive", delta="session_state")

st.divider()

tab1, tab2, tab3, tab4 = st.tabs(["Inputs", "Data & Charts", "Layout & Feedback", "Media & Chat"])

# =====================================================
# TAB 1 : INPUTS
# =====================================================
with tab1:
    st.header("Input Widgets – Full Set")
    st.caption("TextInput mantigi: onChange -> aninda state, Enter/on_submit -> event.")
    st.divider()
    c1a, c1b = st.columns(2)
    with c1a:
        st.subheader("Text & Numeric")
        st.text_input("Text Input:", key="mv_text", placeholder="Type something...", help="on_change aninda, Enter on_submit")
        st.text_input("Password Input:", key="mv_text_pwd", placeholder="***", type="password")
        st.number_input("Number Input:", key="mv_number", min_value=0, max_value=100, step=1, help="ABAP: number_input min/max/step")
        st.text_area("Text Area:", key="mv_textarea", placeholder="Long text...", height=120, help="ABAP height=4")
        st.color_picker("Color Picker:", key="mv_color")
        st.file_uploader("File Uploader:", accept_multiple_files=False, help="ABAP: accept='*'")
    with c1b:
        st.subheader("Choices")
        st.checkbox("Accept Terms (Checkbox)", key="mv_checkbox")
        st.toggle("Enable Notifications (Toggle)", key="mv_toggle")
        st.radio("Radio Group:", options=["Option A", "Option B", "Option C"], key="mv_radio", horizontal=False)
        st.selectbox("Selectbox:", options=["Core Development", "Enterprise Cloud", "Quality Assurance", "Security"], key="mv_selectbox")
        st.multiselect("MultiSelect:", options=["ABAP", "Streamlit", "Cloud", "Fiori", "NodeJS", "HANA"], key="mv_multiselect")
        # pills / segmented_control / feedback are newer streamlit APIs; fallback if not available
        try:
            st.pills("Pills:", options=["React", "Vue", "Angular", "Svelte"], key="mv_pills")
        except Exception:
            st.selectbox("Pills (fallback as selectbox):", options=["React", "Vue", "Angular", "Svelte"], key="mv_pills")
        try:
            st.segmented_control("Segmented Control:", options=["Frontend", "Backend", "Fullstack"], key="mv_segmented")
        except Exception:
            st.radio("Segmented Control (fallback):", options=["Frontend", "Backend", "Fullstack"], key="mv_segmented", horizontal=True)
    st.divider()
    r2a, r2b = st.columns(2)
    with r2a:
        st.slider("Slider (0-100):", min_value=0, max_value=100, key="mv_slider")
        st.select_slider("Select Slider:", options=["Small", "Medium", "Large", "XLarge"], key="mv_select_sl")
        try:
            st.feedback("stars", key="mv_feedback_s")
            st.caption(f"Stars: {st.session_state.mv_feedback_s}")
        except Exception:
            st.slider("Feedback (Stars fallback 0-5):", 0, 5, key="mv_feedback_s")
        try:
            st.feedback("thumbs", key="mv_feedback_t")
            st.caption(f"Thumbs: {st.session_state.mv_feedback_t}")
        except Exception:
            st.radio("Feedback thumbs fallback", ["down", "up"], key="mv_feedback_t", horizontal=True)
    with r2b:
        st.date_input("Date Input:", key="mv_date")
        st.time_input("Time Input:", key="mv_time")
        # datetime_input in abaplit is combined; streamlit has no single widget -> combine
        st.caption("DateTime Input (abaplit birlesik, Streamlit'te iki widget):")
        st.date_input("DateTime - Date part", key="mv_datetime_date")
        st.time_input("DateTime - Time part", key="mv_datetime_time")

    st.divider()
    st.subheader("Actions")
    ac1, ac2, ac3 = st.columns(3)
    with ac1:
        if st.button("Trigger Toast (ABAP: toast_display)", type="primary"):
            st.toast("Server-dispatched toast from ABAP!", icon="✅")
    with ac2:
        if st.button("Copy Token (clipboard_write)"):
            st.toast("Copied: abaplit-widget-gallery-2026", icon="📋")
    with ac3:
        st.link_button("Open GitHub", "https://github.com/abaplit/abaplit")
    st.link_button("External Docs", "https://github.com/abaplit/abaplit")
    st.divider()
    st.write(f"Current state preview: text=\"{st.session_state.mv_text}\" number={st.session_state.mv_number} slider={st.session_state.mv_slider} color={st.session_state.mv_color} date={st.session_state.mv_date} pills={st.session_state.mv_pills}")

# =====================================================
# TAB 2 : DATA & CHARTS
# =====================================================
with tab2:
    st.header("Data Display & Charts")
    st.caption("ABAP internal tables are bound via client->bind; Streamlit'te pandas DataFrame.")
    employees = pd.DataFrame([
        {"id": "E-1001", "name": "Alice Keller", "department": "Core ERP", "location": "Walldorf", "status": "Active", "score": 92},
        {"id": "E-1002", "name": "Can Yilmaz", "department": "BTP Cloud", "location": "Istanbul", "status": "On Leave", "score": 84},
        {"id": "E-1003", "name": "John Smith", "department": "Security", "location": "Palo Alto", "status": "Active", "score": 77},
        {"id": "E-1004", "name": "Sakura Tanaka", "department": "HANA DB", "location": "Tokyo", "status": "Active", "score": 95},
    ])
    chart_q = pd.DataFrame({"label": ["Q1", "Q2", "Q3", "Q4"], "value": [42, 68, 54, 95]})
    chart_m = pd.DataFrame({"label": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], "value": [18, 24, 36, 45, 40, 62]})
    m2a, m2b, m2c = st.columns(3)
    m2a.metric("Total Employees", str(len(employees)), delta="+1")
    m2b.metric("Avg Score", "87.0", delta="+2.3%")
    m2c.metric("Quarterly Max", "95", delta="Q4")
    st.divider()
    st.subheader("Table vs Dataframe (same source)")
    st.table(employees)
    st.dataframe(employees, use_container_width=True)
    st.divider()
    st.subheader("Charts – Line / Bar / Area / Scatter (shared data)")
    ch1, ch2 = st.columns(2)
    with ch1:
        st.write("Line Chart (monthly):")
        st.line_chart(chart_m.set_index("label"))
        st.write("Area Chart (monthly):")
        st.area_chart(chart_m.set_index("label"))
    with ch2:
        st.write("Bar Chart (quarterly):")
        st.bar_chart(chart_q.set_index("label"))
        st.write("Scatter Chart (quarterly):")
        st.scatter_chart(chart_q.set_index("label"))
    st.divider()
    st.subheader("Code, JSON, Latex, HTML")
    st.code('DATA(st) = client->new_view( ).\nst->pills( label = \'Stack\' options = \'React,Vue\' value = client->bind( mv_stack ) ).', language="abap")
    st.json(employees.to_dict(orient="records"))
    st.latex(r"\sum_{i=1}^{n} x_i = \frac{n(n+1)}{2}")
    st.html('<div style="padding:10px;border:1px dashed #ff4b4b;border-radius:8px">Custom <b>HTML</b> block via st.html</div>')
    try:
        st.badge("Data Verified", color="green")
    except Exception:
        st.success("Data Verified")

# =====================================================
# TAB 3 : LAYOUT & FEEDBACK
# =====================================================
with tab3:
    st.header("Layout Containers & Feedback")
    with st.container():
        st.write("Container: generic grouping element (Container.jsx).")
    st.divider()
    la, lb = st.columns(2)
    la.write("Column 1: left pane")
    lb.write("Column 2: right pane")
    with st.expander("Expander: Details & Diagnostics"):
        st.write("Hidden until clicked. Contains table + json.")
        st.table(employees)
    # popover (streamlit 1.35+)
    try:
        with st.popover("Popover: Quick Settings"):
            st.write("Popover renders as overlay (Popover.jsx).")
            st.checkbox("Enable verbose logging", key="pop_verbose")
            if st.button("Apply", type="primary"):
                st.toast("Popover applied")
    except Exception:
        st.caption("Popover fallback: (st.popover requires streamlit>=1.35)")
        st.checkbox("Enable verbose logging (fallback)", key="pop_verbose")
    # status
    try:
        with st.status("Deployment Pipeline", state="running"):
            st.write("Step 1: Build ABAP transpiled bundle.")
            st.write("Step 2: Deploy to SICF node.")
            st.progress(68, text="Progress 68%")
    except Exception:
        st.write("Status: Deployment Pipeline – running")
        st.progress(68, text="Progress 68%")
    # dialog
    @st.dialog("Dialog: Confirm Action")
    def confirm_dialog():
        st.write("Dialog renders as modal backdrop (Dialog.jsx). Press X or backdrop to close.")
        st.warning("This is a demo dialog – no backend effect.")
        if st.button("Confirm", type="primary"):
            st.rerun()
    if st.button("Open Dialog"):
        confirm_dialog()
    st.divider()
    st.subheader("Form (with FormSubmitButton)")
    with st.form("demo_form"):
        st.text_input("Full Name", key="mv_form_name", placeholder="Enter name")
        st.selectbox("Role", options=["Developer", "Architect", "Admin"], key="mv_form_role")
        submitted = st.form_submit_button("Submit Form", type="primary")
        if submitted:
            st.toast(f"Form: {st.session_state.mv_form_name} / {st.session_state.mv_form_role} saved", icon="✅")
            st.success(f"Form: {st.session_state.mv_form_name} / {st.session_state.mv_form_role} saved (abaplit: set_title)")
    st.empty()
    st.divider()
    st.subheader("Alerts & Progress")
    st.success("Success: All widgets rendered without binding errors.")
    st.info("Info: This demo intentionally triggers every widget type.")
    st.warning("Warning: File uploader is client-only (no ICF upload yet).")
    st.error("Error: Demo error card (no real error).")
    st.progress(st.session_state.mv_progress, text="Overall Completion")
    with st.spinner("Loading simulation..."):
        import time
        time.sleep(0.2)
    try:
        raise Exception("DEMO_EXCEPTION: Example stack trace for ExceptionWidget")
    except Exception as e:
        st.exception(e)
    b1, b2, b3 = st.columns(3)
    with b1:
        if st.button("Show Balloons"):
            st.balloons()
    with b2:
        if st.button("Show Snow"):
            st.snow()
    with b3:
        if st.button("Trigger Toast"):
            st.toast("Hello from Streamlit!", icon="🎉")

# =====================================================
# TAB 4 : MEDIA & CHAT
# =====================================================
with tab4:
    st.header("Media, Chat & Misc")
    st.subheader("Image / Audio / Video")
    st.image("https://picsum.photos/seed/abaplit/600/200", caption="Random image via st.image (picsum.photos)", width=600)
    st.audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
    st.video("https://www.w3schools.com/html/mov_bbb.mp4")
    st.divider()
    st.subheader("Chat Interface")
    # chat history in session_state
    if "chat_hist" not in st.session_state:
        st.session_state.chat_hist = [
            {"role": "assistant", "content": "Welcome to the complete widget gallery. Every frontend component is showcased here."},
            {"role": "user", "content": "Show me all inputs, charts, layouts and media in one place."},
        ]
    for msg in st.session_state.chat_hist:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])
    if prompt := st.chat_input("Type a message and press Enter..."):
        st.session_state.chat_hist.append({"role": "user", "content": prompt})
        st.session_state.chat_hist.append({"role": "assistant", "content": "abaplit chat_input is reactive via client->bind + on_submit (Streamlit: st.chat_input)."})
        st.rerun()
    st.divider()
    st.subheader("HTML / Latex / Code / Badge / Empty")
    st.html("<b>HTML Widget:</b> renders raw HTML (sanitized). <i>abaplit</i> vs <i>Streamlit</i> theme diff: abaplit uses --st-* CSS vars.")
    st.latex(r"e^{i\pi} + 1 = 0")
    st.code('st.text_input("Name", value=st.session_state.name)', language="python")
    try:
        st.badge("New", color="blue")
    except Exception:
        st.info("New badge")
    st.empty()
    st.divider()
    st.subheader("Download & Page Navigation")
    st.download_button("Download CSV (employees)", data=employees.to_csv(index=False), file_name="employees.csv", mime="text/csv")
    try:
        st.page_link("streamlit_gallery/app.py", label="Page Link: Back to Hub")
    except Exception:
        st.caption("page_link fallback")
    st.link_button("Open abaplit Docs", "https://github.com/abaplit/abaplit")

st.divider()
st.caption("Demo 007 generated: covers web/src/components/**/* ; ABAP: src/demo/zcl_abaplit_demo_007.clas.abap ; Streamlit: streamlit_gallery/app.py & src/demo/demo_007_streamlit.py")

# =====================================================
# Theme comparison table
# =====================================================
with st.expander("Tema Farklari – abaplit vs Streamlit (karsilastirma tablosu)"):
    st.markdown("""
| Ozellik | abaplit (ABAP + React) | Streamlit (Python) | Not |
|---|---|---|---|
| **Tema token'lari** | CSS vars `--st-*`, `st-*` classlari, Streamlit design system'in birebir kopyasi, dark/light media query | Streamlit native tema (config.toml `theme.*`), `stApp` CSS | abaplit Streamlit'in light temasini taklit eder; Streamlit'te `base="light/dark"` daha kapsamli |
| **State yonetimi** | `client->bind(mv_*)` dot-notation, state codec AJSON ile SICF POST roundtrip | `st.session_state` + widget `key` | abaplit her event'te ABAP `main` bastan calisir (reactive), Streamlit script de bastan calisir – benzer |
| **Event modeli** | `on_click`/`on_change`/`on_submit` -> `client->check_event()` + `onValueChange` | callback `on_change` + `st.rerun()` / form submit | abaplit'te `onChange` vs `onKeyDown Enter` ayrimi (TextInput mantigi) biz standardize ettik |
| **Layout** | `columns->col(i)`, `tabs->tab(i)`, `popover`, `dialog`, `status`, `expander` ABAP builder ile | `st.columns`, `st.tabs`, `st.popover`, `st.dialog`, `st.status`, `st.expander` | API isimleri %95 ayni, ABAP'ta `->end()` chain gerekir |
| **Chart** | `StreamlitChart.jsx` SVG (line/bar/area/scatter), prop `data=bind(itab)` | `st.line_chart`/`st.bar_chart`/`st.area_chart`/`st.scatter_chart` Vega-Lite | abaplit chart'lari minimal SVG; Streamlit Vega-Lite daha zengin ama abaplit offline calisir |
| **Dataframe** | `DataframeWidget.jsx` client-side search/sort/pagination | `st.dataframe` Arrow + frontend | abaplit dataframe search/sort client-side, Streamlit server-side |
| **Chat** | `chat_message` + `chat_input` custom React | `st.chat_message` + `st.chat_input` native | abaplit avatari `avatar` prop'u ile ayni |
| **File upload** | `FileUploader.jsx` sadece dosya adi + on_change (ICF upload yok) | `st.file_uploader` BytesIO ile gercek upload | En buyuk fonksiyonel fark |
| **Media** | `image`/`audio`/`video` sadece `src` URL | `st.image`/`st.audio`/`st.video` URL veya bytes | abaplit'te base64 gomme sinirli |
| **Feedback** | `progress`, `spinner`, `success/info/warning/error`, `balloons/snow`, `toast` (client action) | `st.progress`, `st.spinner`, `st.success`..., `st.balloons`/`st.snow`/`st.toast` | Neredeyse 1:1 |
| **Form** | `form( key )` + `form_submit_button` ABAP builder | `st.form` + `st.form_submit_button` | ABAP'ta form submit de `check_event` ile yakalanir |
| **Deploy** | Tek ABAP sinifi `zcl_abaplit_web_assets` (SingleFile React), SICF `/sap/bc/abaplit` | `streamlit run app.py` Python server | abaplit SAP icinde, Streamlit harici |
""")
    st.info("Ozet: Gorunum %90 ayni (Streamlit design system port edildi), farklar daha cok runtime'da: abaplit ABAP state'i AJSON ile tasir, Streamlit Python state'i memory'de tutar. File upload ve chart zenginligi Streamlit'te daha guclu; abaplit ise SAP transaction icinde zero-dependency calisir.")

