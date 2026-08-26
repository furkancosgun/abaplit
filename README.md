# abap2fiori

> **Build dynamic, reactive full-stack web applications in 100% pure ABAP with a native SAP Fiori (OpenUI5) frontend.**

Inspired by [abap2UI5](https://github.com/abap2UI5/abap2UI5), **abap2fiori** keeps the server-driven ABAP paradigm while rendering with standard **SAP Fiori / OpenUI5 controls**. The ABAP backend generates XML views with a type-safe fluent builder, while the Fiori runtime mounts views and synchronizes state and events bidirectionally as JSON.

Supports both **SAP BTP / ABAP Cloud** and **SAP On-Premise (SICF)**.

---

## 🏛️ Architecture

```
+---------------------------+          +--------------------------------------+
|  app/webapp/ (Fiori app)  |          |  src/ (Pure ABAP backend)            |
|                           |          |                                      |
|  controller/App.controller|   JSON   |  core/z2fiori_if_app   -> main( )    |
|  core/Dispatcher.js       | <------> |  core/z2fiori_if_client->bind/event  |
|  core/PopupManager.js     |  POST    |  core/z2fiori_cl_xml_view_builder    |
|                           | /sap/bc/ |  http/z2fiori_cl_http_handler        |
|  Dynamic XML views &      | z2fiori_ |  http/z2fiori_cl_state_codec         |
|  Native UI5 Fragments     | http     |  http/z2fiori_cl_app_runner          |
+---------------------------+          +--------------------------------------+
```

### Every Roundtrip:
1. **Client Request:** Sends `{app, event, event_args, check_init, check_navigated, nav_prev_arg, state, params, s_config, s_device}` to `/sap/bc/z2fiori_http`.
2. **State Hydration:** `z2fiori_cl_app_runner` instantiates your ABAP app class, hydrates public attributes from `state` via `z2fiori_cl_ajson` and calls `main( client )`.
3. **View & Action Building:** Your app builds UI5 XML views using the fluent `z2fiori_cl_xml_view_builder`, calls `client->view_display( )`, `client->popup_show( )`, and queues client actions (toasts, message boxes, navigation...).
4. **Server Response:** Returns `{success, message, app, view, state, t_actions}`.
5. **DOM & Fragment Mounting:** The Fiori controller mounts the XML view into the shell and triggers any UI actions.

---

## 🚀 Quick Example

Implement `z2fiori_if_app` with a single `main( )` method:

```abap
CLASS zcl_my_fiori_app DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_user_name  TYPE string VALUE 'John Doe'.
    DATA mv_status     TYPE string VALUE 'Ready'.

ENDCLASS.

CLASS zcl_my_fiori_app IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_xml_view_builder.

    IF client->check_init( ).

      lo_view = z2fiori_cl_xml_view_builder=>factory( ).
      lo_view->page( title = 'My Fiori App'
        )->vbox( class = 'sapUiMediumMargin'
          )->title( 'User Profile'
          )->label( 'Name'
          )->input( value = client->bind( mv_user_name )
          )->button( text = 'Save Profile' press = client->event( 'SAVE' )
          )->text( text = client->bind( mv_status ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN 'SAVE'.
          mv_status = |Saved user: { mv_user_name }|.
          client->toast_display( 'Profile saved successfully!' ).
      ENDCASE.

    ENDIF.
  ENDMETHOD.

ENDCLASS.
```

---

## 💎 Features & Capabilities

### 1. Fluent XML View Builder (`z2fiori_cl_xml_view_builder`)
- **500+ UI5 Controls Modeled:** Controls across `sap.m`, `sap.ui.core`, `sap.ui.layout`, `sap.ui.table`.
- **Intelligent Containers vs Leaves:** Containers (`Page`, `VBox`, `Table`, `Panel`, `Dialog`) automatically nest children; leaf controls (`Input`, `Button`, `Label`, `Text`, `Title`) stay at the current DOM level.
- **Convenient Navigation:**
  - `->end( )`: Ascends to the parent container.
  - `->root( )`: Ascends directly to the root view.
- **`PREFERRED PARAMETER` Support:** Direct single-argument calls like `button( 'Save' )`, `input( '{/NAME}' )`, `page( 'Home' )`, `label( 'Username' )`.

### 2. Dialogs & Popups (`factory_popup`)
Create native UI5 Fragments with stack management (LIFO popup stack):
```abap
lo_popup = z2fiori_cl_xml_view_builder=>factory_popup( ).
lo_popup->dialog( title = 'Edit Item'
  )->vbox( class = 'sapUiMediumMargin'
    )->input( value = client->bind( mv_input )
    )->button( text = 'Confirm' press = client->event( 'CONFIRM' )
    )->button( text = 'Cancel' press = client->event( 'CANCEL' ) ).

client->popup_show( lo_popup->stringify( ) ).

" In event handler:
client->popup_close( ).
```

### 3. Tables & Dynamic Row Actions
Pass table row context values directly to ABAP events:
```abap
lo_view->table( items = client->bind( mt_flights )
  )->columns(
    )->column( )->text( 'Airline' )->end(
    )->column( )->text( 'Flight No' )->end(
    )->column( )->text( 'Action' )->end(
  )->end(
  )->items(
    )->column_list_item(
      )->cells(
        )->text( '{CARRID}'
        )->text( '{CONNID}'
        )->button( text = 'Details' press = client->event( event = 'ROW_SELECT' t_arg = VALUE #( ( '${CARRID}' ) ( '${CONNID}' ) ) )
    )->root( ).

" In event handler:
DATA(lv_carrid) = client->get_event_arg( 1 ).
DATA(lv_connid) = client->get_event_arg( 2 ).
```

### 4. Rich Client Actions
- `toast_display( 'Message' )`
- `message_box_display( text = '...' title = '...' confirm_event = 'OK' )`
- `popup_show( xml )` & `popup_close( )` / `popups_close_all( )`
- `nav_call( NEW zcl_child_app( ) )` & `nav_leave( result )`
- `set_title( '...' )` & `set_favicon( '...' )`
- `set_focus( 'controlId' )`
- `set_dirty_state( abap_true )`
- `keyboard_shortcut( key = 'k' ctrl = abap_true event = 'CTRL_K' )`
- `clipboard_write( '...' )` & `clipboard_read( event = 'ON_PASTE' )`
- `file_download( filename = 'data.csv' data = ... )`
- `follow_up_action( event = 'ASYNC_STEP' delay_ms = 100 )`

---

## 🛠️ Local Development & Testing

Everything runs with a single command:

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development (derleme + backend + Fiori UI5 server)
npm start

# 3. Run all ABAP linter & unit tests
npm test

# 4. Run full Playwright E2E test suite (Headless Chrome/Edge testing all 6 sample apps)
npm run test:e2e
```

Open in browser: `http://localhost:8080/index.html?app=Z2FIORI_CL_SMP_006_TABLE`

---

## 📦 Samples Included (`e2e/src/`)

- `z2fiori_cl_smp_001_basic`: Two-way data binding, button click event counter.
- `z2fiori_cl_smp_002_popups`: LIFO nested stacked popups.
- `z2fiori_cl_smp_003_nav_main` & `child`: Inter-app navigation and data passing.
- `z2fiori_cl_smp_004_features`: Shortcuts, Message Box, Dirty State, Followup, Nested Views.
- `z2fiori_cl_smp_005_dialog`: Form with Two-Way Data Binding inside a Dialog Fragment.
- `z2fiori_cl_smp_006_table`: Table list with dynamic row parameters and popup editing.

---

## 🚢 Deployment to SAP

1. **ABAP Backend:** Import repository sources into your SAP system via [abapGit](https://abapgit.org/).
2. **SICF Configuration:** Create SICF service `/sap/bc/z2fiori_http` pointing to handler class `z2fiori_cl_icf_handler`.
3. **ABAP Cloud / BTP:** Expose via HTTP Service with `z2fiori_cl_http_handler=>factory_cloud(...)`.
4. **Frontend:** Deploy `app/webapp` to SAP BSP / MIME repository or BTP HTML5 Application Repository.
5. **Access:** Launch `https://<host>:<port>/webapp/index.html?app=YOUR_APP_CLASS`.

---

## 📄 License

MIT
