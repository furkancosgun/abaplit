# abaplit ⚡

> **Streamlit for ABAP**: The fastest way to build interactive, reactive web applications in pure ABAP.

---

## 💡 Overview

**abaplit** transforms how ABAP developers build user interfaces. Inspired by Python's **Streamlit**, you write simple, top-down ABAP scripts or classes that automatically generate dynamic, reactive web user interfaces with two-way data binding.

- 🚀 **Pure ABAP**: No JavaScript or UI5 XML configuration required.
- ⚡ **Streamlit-style Reactive Execution**: Script runs on interaction, UI updates instantly.
- 🧱 **Rich Widgets**: Titles, metrics, markdown, text/number inputs, checkboxes, sliders, tables, columns, sidebars, alerts and more.
- 🌐 **JSON Widget Tree**: Decoupled, clean backend architecture that feeds modern web frontends via REST / ICF.
- 🧪 **Full Transpiler & Cloud Ready**: Fully transpiles via `@abaplint/transpiler-cli` and runs anywhere (SAP on-prem, BTP, Node.js runtime).

---

## 🛠️ Architecture

```
User Browser  <--->  [ REST / ICF API ]  <--->  zcl_abaplit_app_runner
                                                      │
                                                      ├──> zcl_abaplit_state_codec (Hydrate / Serialize)
                                                      ├──> zcl_abaplit_client
                                                      └──> zcl_abaplit_view_builder (Streamlit UI Tree)
```

1. **State Hydration:** Public attributes of your ABAP application class are automatically hydrated from client state via `zcl_abaplit_state_codec` and `zcl_abaplit_ajson`.
2. **Execution:** Your class implements `zif_abaplit_app~main( client )`.
3. **View Building:** You build the UI using the fluent `client->new_view( )` (or `zcl_abaplit_view_builder`).
4. **Response:** A reactive JSON widget tree and updated state are returned to the frontend.

---

## 💻 Hello World Example

```abap
CLASS zcl_demo_app DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    " Reactive state (bound to UI)
    DATA mv_user_name TYPE string.
    DATA mv_counter   TYPE i.
ENDCLASS.

CLASS zcl_demo_app IMPLEMENTATION.
  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    st->title( 'Hello from abaplit! 🚀' ).
    st->write( 'Streamlit-style reactive web development in pure ABAP.' ).

    " Sidebar
    st->sidebar( )->header( 'Navigation & Settings' ).
    st->sidebar( )->write( 'Configure your app parameters here.' ).

    " Two-way binding
    st->text_input( label = 'What is your name?'
                    value = client->bind( mv_user_name ) ).

    " Interaction & Events
    IF client->check_event( 'BTN_CLICK' ).
      mv_counter = mv_counter + 1.
      st->success( |Great job, { mv_user_name }! Button clicked { mv_counter } times.| ).
      st->balloons( ).
    ENDIF.

    st->button( text  = 'Click Me'
                event = client->event( 'BTN_CLICK' )
                type  = 'primary' ).

    " Layout: Responsive Columns
    DATA(cols) = st->columns( 2 ).
    cols->col( 1 )->metric( label = 'Clicks' value = |{ mv_counter }| ).
    cols->col( 2 )->metric( label = 'Status' value = 'Active' delta = '+100%' ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.
ENDCLASS.
```

---

## 🧰 Available Streamlit Widgets

| Category | Methods |
| :--- | :--- |
| **Typography** | `title`, `header`, `subheader`, `write`, `text`, `markdown`, `caption`, `code`, `divider` |
| **Inputs** | `text_input`, `number_input`, `text_area`, `checkbox`, `radio`, `selectbox`, `multiselect`, `slider`, `date_input`, `time_input` |
| **Action** | `button` |
| **Display** | `metric`, `table`, `dataframe` |
| **Layout** | `columns( count )`, `col( index )`, `sidebar( )`, `container( )`, `expander( label )` |
| **Feedback** | `success`, `info`, `warning`, `error`, `toast`, `progress`, `spinner`, `balloons`, `snow` |

---

## 🧪 Testing & Development

```bash
# Clean build artifacts
npm run clean

# Run ABAP transpiler and all automated unit tests
npm test

# Run syntax and style checks
npm run lint

# Start local test dev server
npm start
```
