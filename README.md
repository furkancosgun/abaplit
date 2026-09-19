# abaplit ⚡

> **Streamlit for ABAP**: The fastest, most elegant way to build interactive, reactive web applications in pure ABAP.

---

## 💡 What is abaplit?

**abaplit** transforms enterprise ABAP UI development. Inspired by Python's **Streamlit**, you write top-down, reactive ABAP classes that automatically render modern, pixel-perfect web applications with real-time two-way data binding.

- 🚀 **Pure ABAP**: No JavaScript or complex XML view configuration required.
- ⚡ **Streamlit Reactive Execution**: Your ABAP class runs top-to-bottom on interaction; state is synchronized automatically.
- 📊 **Native ABAP Internal Table Binding**: Bind internal tables directly using `client->bind( lt_table )` — backend auto-serializes to structured JSON.
- 💎 **Pixel-Perfect Streamlit Theme**: Dark/light modes, vibrant modern colors, typography, and fluid micro-animations.
- 📦 **Embedded Single-Class Deployment**: Frontend SPA is inlined into a single ABAP class (`zcl_abaplit_web_assets.clas.abap`) — zero external CDN or separate static hosting needed.
- 🌐 **SAP ICF & Cloud Native**: Seamlessly runs via SICF on SAP NetWeaver/S/4HANA (`/sap/bc/abaplit`), SAP BTP Cloud, or Node.js via `@abaplint/transpiler-cli`.

---

## 🏛️ Architecture

```
Browser (React SingleFile SPA)
       │
       │  HTTP GET  --> Serves embedded HTML from zcl_abaplit_web_assets
       │  HTTP POST --> /sap/bc/abaplit (State + Event Payload)
       ▼
[ SAP ICF Handler / zcl_abaplit_http_handler ]
       │
       ├──> zcl_abaplit_request_parser   (Parses event & incoming state)
       │
       ▼
[ zcl_abaplit_app_runner ]
       │
       ├──> zcl_abaplit_state_codec     (Hydrates ABAP object attributes)
       ├──> zcl_abaplit_client          (Binding resolver & event handling)
       ├──> Your App -> zif_abaplit_app~main( client )
       │        └──> zcl_abaplit_view_builder (Streamlit widget tree)
       │
       └──> zcl_abaplit_response_builder (Serializes widget tree + updated state)
```

---

## 🚀 Ready-to-use Demos

abaplit includes a suite of interactive demos demonstrating real-world SAP workflows:

| Demo Class | Topic & Features | URL |
| :--- | :--- | :--- |
| **`zcl_abaplit_demo_000`** | **Central Hub & Showcase Dashboard**<br>Navigation launchpad, catalog table, metrics | `http://localhost:3000/?app=zcl_abaplit_demo_000` |
| **`zcl_abaplit_demo_001`** | **Charts & Analytics**<br>Interactive Line, Bar, and Area charts with live data | `http://localhost:3000/?app=zcl_abaplit_demo_001` |
| **`zcl_abaplit_demo_002`** | **Forms & Reactive Controls**<br>Text inputs, selectbox, toggle, color picker, slider & dynamic submission table | `http://localhost:3000/?app=zcl_abaplit_demo_002` |
| **`zcl_abaplit_demo_003`** | **Business DataFrames**<br>Direct ABAP internal table binding (Sales Orders, Plant Inventory) | `http://localhost:3000/?app=zcl_abaplit_demo_003` |
| **`zcl_abaplit_demo_004`** | **AI Chat Assistant**<br>Chat bubbles, assistant avatars, and reactive `chat_input` | `http://localhost:3000/?app=zcl_abaplit_demo_004` |
| **`zcl_abaplit_demo_005`** | **Tabs, Modals & Progress**<br>Tabbed containers, progress bars, and modal dialogs | `http://localhost:3000/?app=zcl_abaplit_demo_005` |

---

## 💻 Code Example: Interactive Form

```abap
CLASS zcl_my_app DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    " Reactive public state
    DATA mv_name TYPE string VALUE 'SAP Developer'.
    DATA mv_dept TYPE string VALUE 'Cloud Platform'.
    DATA mt_logs TYPE STANDARD TABLE OF string WITH EMPTY KEY.
ENDCLASS.

CLASS zcl_my_app IMPLEMENTATION.
  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " Streamlit Top Bar & Sidebar
    st->title( 'Developer Workspace' ).
    st->sidebar( )->header( 'Session Status' ).
    st->sidebar( )->metric( label = 'Total Entries' value = |{ lines( mt_logs ) }| ).

    " Responsive Columns
    DATA(cols) = st->columns( 2 ).
    DATA(col1) = cols->col( 1 ).
    col1->text_input( label = 'Full Name'
                      value = client->bind( mv_name ) ).

    DATA(col2) = cols->col( 2 ).
    col2->selectbox( label   = 'Department'
                     options = 'Cloud Platform,Core ERP,Security'
                     value   = client->bind( mv_dept ) ).

    " Event Handling
    IF client->check_event( 'SUBMIT_ENTRY' ).
      APPEND |{ mv_name } ({ mv_dept }) at { sy-uzeit }| TO mt_logs.
      st->success( |Entry created for { mv_name }!| ).
      st->balloons( ).
    ENDIF.

    st->button( text  = 'Save Entry'
                event = 'SUBMIT_ENTRY'
                type  = 'primary' ).

    st->divider( ).
    st->subheader( 'Logged Submissions' ).
    st->table( client->bind( mt_logs ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.
ENDCLASS.
```

---

## 🧰 Available Widgets

| Category | Available ABAP Methods |
| :--- | :--- |
| **Typography** | `title`, `header`, `subheader`, `write`, `text`, `markdown`, `caption`, `code`, `divider` |
| **Inputs** | `text_input`, `number_input`, `text_area`, `checkbox`, `toggle`, `radio`, `selectbox`, `multiselect`, `slider`, `date_input`, `time_input`, `color_picker`, `file_uploader` |
| **Actions** | `button`, `link_button`, `download_button` |
| **Data & Charts** | `metric`, `table`, `dataframe`, `line_chart`, `bar_chart`, `area_chart`, `json` |
| **Layout** | `columns( count )`, `col( index )`, `sidebar( )`, `container( )`, `expander( label )`, `tabs( 'Tab1,Tab2' )`, `dialog( title )` |
| **Chat** | `chat_message( name, avatar )`, `chat_input( placeholder, event )` |
| **Feedback** | `success`, `info`, `warning`, `error`, `toast`, `progress`, `spinner`, `balloons`, `snow` |

---

## 🛠️ Development & Tooling

```bash
# Install dependencies
npm install

# Run transpilation and automated unit tests
npm test

# Run abaplint checks
npm run lint

# Build web frontend and embed into ABAP class
npm run bundle:abap

# Start local dev server (Express ICF Shim)
npm start
```

Access the application in your browser:
- Dashboard: [http://localhost:3000/?app=zcl_abaplit_demo_000](http://localhost:3000/?app=zcl_abaplit_demo_000)
- ICF Path: [http://localhost:3000/sap/bc/abaplit?app=zcl_abaplit_demo_000](http://localhost:3000/sap/bc/abaplit?app=zcl_abaplit_demo_000)

---

## 📄 License

MIT
