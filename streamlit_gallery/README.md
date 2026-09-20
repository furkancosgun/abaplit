# Streamlit Gallery – abaplit Demo 007 Eşdeğeri

ABAP: `src/demo/zcl_abaplit_demo_007.clas.abap`
Streamlit: `streamlit_gallery/app.py` (kopya: `src/demo/demo_007_streamlit.py`)

## Çalıştırma
```bash
pip install -r streamlit_gallery/requirements.txt
streamlit run streamlit_gallery/app.py
```

ABAP tarafını çalıştırma:
```bash
npm install
npm start
# http://localhost:3000/?app=zcl_abaplit_demo_007
```

## Tema farkları kısa özet
- **Görsel tema** %90 aynı – abaplit Streamlit'in CSS token'larını (`--st-*`) port etti.
- **State**: abaplit `client->bind` + AJSON roundtrip, Streamlit `st.session_state`.
- **File upload**: abaplit sadece dosya adı, Streamlit gerçek BytesIO.
- **Chart**: abaplit minimal SVG, Streamlit Vega-Lite.
- **Deploy**: abaplit tek ABAP sınıfı ile SICF'te, Streamlit Python server.
