# abaplit ⚡

> **Streamlit for ABAP**: The fastest, most elegant way to build interactive, reactive web applications in pure ABAP.

---

## 💡 What is abaplit?

**abaplit** transforms enterprise ABAP UI development. Inspired by Python's **Streamlit**, you write top-down, reactive ABAP classes that automatically render modern, pixel-perfect web applications with real-time two-way data binding.

- 🚀 **Pure ABAP**: No JavaScript or complex XML view configuration required.
- ⚡ **Streamlit Reactive Execution**: Your ABAP class runs top-to-bottom on interaction; state is synchronized automatically.
- 🔗 **Fiori-Style Dot-Notation Binding**: Bind attributes and nested structures directly using `client->bind( ms_user-name )` $\rightarrow$ `{MS_USER.NAME}` with seamless case-insensitive resolution.
- 🛡️ **Zero-Fallback Strict Error Diagnostics**: Immediate, actionable diagnostic cards pinpointing exact missing attributes and usage instructions — no silent broken states or dummy fallback data.
- ⚡ **Server-Dispatched Client Actions**: Trigger client-side actions directly from ABAP via `client->toast_display`, `client->set_title`, `client->clipboard_write`, `client->open_new_tab`, and `client->file_download`.
- 💎 **Pixel-Perfect Streamlit Design**: Built with Streamlit's official design system tokens, responsive grid layouts, dark/light themes, smooth micro-animations, and full keyboard shortcuts (`R` to rerun).
- 📦 **Embedded Single-Class Deployment**: The entire React SingleFile frontend is inlined into a single ABAP class (`zcl_abaplit_web_assets.clas.abap`) — zero external CDN or separate static web hosting required.
- 🌐 **SAP ICF & Cloud Native**: Runs seamlessly via SICF on SAP NetWeaver/S/4HANA (`/sap/bc/abaplit`), SAP BTP Cloud, or Node.js via `@abaplint/transpiler-cli`.

---

## 🏛️ Architecture

```
Browser (React SPA - SingleFile)
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
       ├──> zcl_abaplit_client          (Dot-notation resolver & event manager)
       ├──> Your App -> zif_abaplit_app~main( client )
       │        └──> zcl_abaplit_view_builder (Streamlit widget tree)
       │
       └──> zcl_abaplit_response_builder (Serializes widget tree + state + actions)
```

---

## 🚀 Ready-to-use Demos

abaplit includes a comprehensive suite of interactive demos demonstrating real-world enterprise SAP workflows:

| Demo Class | Topic & Features | URL |
| :--- | :--- | :--- |
| **`zcl_abaplit_demo_000`** | **Central Hub & Showcase Dashboard**<br>Navigation launchpad, catalog table, metrics, quick start guides | `http://localhost:3000/?app=zcl_abaplit_demo_000` |
| **`zcl_abaplit_demo_001`** | **Charts & Visualizations**<br>Interactive SVG Line, Bar, and Area charts with dynamic hover tooltips | `http://localhost:3000/?app=zcl_abaplit_demo_001` |
| **`zcl_abaplit_demo_002`** | **Forms & Reactive Controls**<br>Text inputs, selectbox, toggle, color picker, slider, and dynamic table | `http://localhost:3000/?app=zcl_abaplit_demo_002` |
| **`zcl_abaplit_demo_003`** | **Business DataFrames**<br>Direct ABAP internal table binding (Sales Orders, Plant Inventory) | `http://localhost:3000/?app=zcl_abaplit_demo_003` |
| **`zcl_abaplit_demo_004`** | **AI Chat Assistant**<br>Chat bubbles, assistant avatars, and reactive `chat_input` stream | `http://localhost:3000/?app=zcl_abaplit_demo_004` |
| **`zcl_abaplit_demo_005`** | **Tabs, Modals & Progress**<br>Tabbed views, progress bars, and modal dialogs | `http://localhost:3000/?app=zcl_abaplit_demo_005` |
| **`zcl_abaplit_demo_006`** | **Modern Streamlit & Server Actions**<br>Pills, segmented controls, multiselect tags, popover, status containers, live dataframes, code blocks, and backend actions | `http://localhost:3000/?app=zcl_abaplit_demo_006` |

---

## 💻 Code Example: Interactive Application

```abap
CLASS zcl_my_app DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    " Reactive public state (synchronized automatically)
    TYPES:
      BEGIN OF ty_user,
        name       TYPE string,
        department TYPE string,
      END OF ty_user.

    DATA ms_user   TYPE ty_user.
    DATA mt_logs   TYPE STANDARD TABLE OF string WITH EMPTY KEY.
    DATA mv_rating TYPE string VALUE '5'.
ENDCLASS.

CLASS zcl_my_app IMPLEMENTATION.
  METHOD zif_abaplit_app~main.
    " Handle backend actions & events
    IF client->check_event( 'SAVE_USER' ).
      APPEND |{ ms_user-name } ({ ms_user-department }) at { sy-uzeit }| TO mt_logs.
      client->toast_display( text = |User { ms_user-name } saved!| duration = '3000' ).
      client->set_title( |abaplit: { ms_user-name }| ).
    ENDIF.

    DATA(st) = client->new_view( ).

    " Streamlit Top Bar & Sidebar
    st->title( 'Developer Workspace' ).
    st->badge( text = 'v2.0 Modern' color = '#ff4b4b' ).

    DATA(sb) = st->sidebar( ).
    sb->header( 'Session Status' ).
    sb->metric( label = 'Total Entries' value = |{ lines( mt_logs ) }| ).

    " Responsive Columns
    DATA(cols) = st->columns( 2 ).
    DATA(col1) = cols->col( 1 ).
    col1->text_input( label = 'Full Name'
                      value = client->bind( ms_user-name ) ).

    DATA(col2) = cols->col( 2 ).
    col2->pills( label   = 'Department'
                 options = 'Cloud Platform,Core ERP,Security'
                 value   = client->bind( ms_user-department ) ).

    st->feedback( label = 'Rate Experience'
                 options = 'stars'
                 value   = client->bind( mv_rating ) ).

    st->button( text  = 'Save Entry'
                event = client->event( 'SAVE_USER' )
                type  = 'primary' ).

    st->divider( ).
    st->subheader( 'Logged Submissions' ).
    st->table( client->bind( mt_logs ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.
ENDCLASS.
```

---

## 🧰 Available Widgets & APIs

| Category | ABAP Methods |
| :--- | :--- |
| **Typography** | `title`, `header`, `subheader`, `write`, `text`, `markdown`, `caption`, `code`, `divider` |
| **Inputs** | `text_input`, `number_input`, `text_area`, `checkbox`, `toggle`, `radio`, `selectbox`, `multiselect`, `pills`, `segmented_control`, `feedback`, `slider`, `date_input`, `time_input`, `color_picker`, `file_uploader` |
| **Actions** | `button`, `link_button`, `download_button` |
| **Data & Charts** | `metric`, `badge`, `table`, `dataframe` *(with search/sort)*, `line_chart`, `bar_chart`, `area_chart`, `json` |
| **Layout & Containers**| `columns( count )`, `col( index )`, `sidebar( )`, `container( )`, `expander( label )`, `popover( label )`, `status( label, state )`, `tabs( 'Tab1,Tab2' )`, `dialog( title )` |
| **Chat & AI** | `chat_message( name, avatar )`, `chat_input( placeholder, event )` |
| **Feedback & Alerts** | `success`, `info`, `warning`, `error`, `toast`, `progress`, `spinner`, `balloons`, `snow` |
| **Client Actions** | `client->toast_display( text, duration )`<br>`client->set_title( title )`<br>`client->clipboard_write( text )`<br>`client->open_new_tab( url )`<br>`client->file_download( filename, base64, type )` |

---

## 🛠️ Development & Testing

```bash
# Install dependencies
npm install

# Run transpilation and automated ABAP/binding unit tests
npm test

# Run Playwright End-to-End browser test suite (20 comprehensive tests)
npx playwright test

# Run abaplint static checks
npm run lint

# Build React SingleFile web frontend and embed into ABAP class
npm run bundle:abap

# Start local dev server (Express ICF Shim)
npm start
```

Access the application in your browser:
- **Showcase Dashboard**: [http://localhost:3000/?app=zcl_abaplit_demo_000](http://localhost:3000/?app=zcl_abaplit_demo_000)
- **Modern Controls & Actions**: [http://localhost:3000/?app=zcl_abaplit_demo_006](http://localhost:3000/?app=zcl_abaplit_demo_006)
- **ICF Endpoint**: [http://localhost:3000/sap/bc/abaplit?app=zcl_abaplit_demo_000](http://localhost:3000/sap/bc/abaplit?app=zcl_abaplit_demo_000)

---

## 📄 License

MIT
