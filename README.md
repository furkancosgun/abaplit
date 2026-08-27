# abap2fiori

> Build dynamic, reactive full-stack web applications in 100% pure ABAP with a native SAP Fiori (OpenUI5) frontend.

Inspired by [abap2UI5](https://github.com/abap2UI5/abap2UI5), **abap2fiori** keeps the server-driven ABAP paradigm but renders with standard **SAP Fiori / OpenUI5** controls. The ABAP backend generates XML views with a type-safe fluent builder. The Fiori runtime mounts views and synchronizes state and events bidirectionally as JSON.

Supports **SAP BTP / ABAP Cloud** and **SAP On-Premise (SICF)** from a single codebase.

---

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Your First App](#your-first-app)
- [Core Concepts](#core-concepts)
- [Frontend - app/webapp](#frontend---appwebapp)
- [Backend - src](#backend---src)
- [Security](#security)
- [View Builder Generation](#view-builder-generation)
- [Extending Actions](#extending-actions)
- [Scripts Reference](#scripts-reference)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Architecture

```
+---------------------------+          +--------------------------------------+
|  app/webapp/ (Fiori app)  |          |  src/ (Pure ABAP backend)            |
|                           |          |                                      |
|  controller/App.controller|   JSON   |  core/z2fiori_if_app   -> main( )    |
|  core/Dispatcher.ts       | <------> |  core/z2fiori_if_client->bind/event  |
|  core/State.ts            |  POST    |  core/z2fiori_cl_xml_view_builder    |
|  core/ViewManager.ts      | /sap/bc/ |  core/z2fiori_cl_view_builder        |
|  core/ActionRegistry.ts   | z2fiori_ |  http/z2fiori_cl_http_handler        |
|  core/PopupManager.ts     | http     |  http/z2fiori_cl_state_codec         |
|  Dynamic XML Views &      |          |  http/z2fiori_cl_app_runner          |
|  Native UI5 Fragments     |          |  http/z2fiori_cl_request_parser      |
+---------------------------+          +--------------------------------------+
```

**Every roundtrip:**

1.  **Client Request:** `Dispatcher.ts` sends `{app, event, event_args, check_init, check_navigated, check_nav_stack, nav_prev_arg, state, s_config, s_device}` to `/sap/bc/z2fiori_http` via `HttpClient.ts`. Includes CSRF token handling (`X-CSRF-Token: Fetch` flow).
2.  **State Hydration:** `z2fiori_cl_app_runner` instantiates your ABAP app class (implements `z2fiori_if_app`), hydrates public attributes from `state` JSON via `z2fiori_cl_ajson` / `z2fiori_cl_state_codec`, and calls `main( client )`.
3.  **View & Action Building:** Your app builds UI5 XML views with the fluent `z2fiori_cl_xml_view_builder`, calls `client->view_display( )`, `client->popup_show( )`, `client->nav_call( )` and queues client actions (toast, message box, navigation, clipboard, etc.).
4.  **Server Response:** Returns `{success, message, app, view, state, t_actions}` serialized by `z2fiori_cl_response_builder`.
5.  **Mount & Execute:** `ViewManager.ts` mounts the XML view into the `App` container (`view/App.view.xml`) and `ActionRegistry.ts` executes `t_actions` sequentially.

---

## Project Structure

```
abap2fiori/
├── app/                          # Fiori frontend (OpenUI5, TypeScript)
│   ├── webapp/
│   │   ├── Component.ts          # UIComponent, manifest bootstrap
│   │   ├── manifest.json         # App descriptor, dataSource: /sap/bc/z2fiori
│   │   ├── index.html
│   │   ├── view/App.view.xml     # Shell: <App id="appContainer"/>
│   │   ├── controller/App.controller.ts
│   │   ├── core/
│   │   │   ├── State.ts          # JSONModel, app name, nav stack, dirty flag
│   │   │   ├── Dispatcher.ts     # POST + BusyIndicator + handleResponse
│   │   │   ├── HttpClient.ts     # buildPayload, CSRF token, fetch
│   │   │   ├── ViewManager.ts    # XMLView.create + setModel + mount
│   │   │   ├── PopupManager.ts   # LIFO fragment stack
│   │   │   ├── Navigation.ts     # nav_call / nav_leave / popstate
│   │   │   ├── ShortcutManager.ts
│   │   │   ├── DeviceUtil.ts / ControlUtil.ts
│   │   │   ├── ActionRegistry.ts # Open/Closed plugin registry
│   │   │   └── actions/          # One module per action domain
│   │   │       ├── popup.ts, nest.ts, feedback.ts, focus.ts
│   │   │       ├── clipboard.ts, device.ts, system.ts, navigation.ts
│   │   ├── types/                # Http.ts, Action.ts, Device.ts, etc.
│   │   └── i18n/i18n.properties
│   ├── ui5.yaml / ui5-local.yaml
│   └── tsconfig.json             # strict, target es2022, @sapui5/types 1.151
├── src/                          # Pure ABAP backend
│   ├── core/
│   │   ├── z2fiori_if_app.intf.abap              # PUBLIC app interface: main()
│   │   ├── z2fiori_if_client.intf.abap           # bind(), event(), view_display(), actions
│   │   ├── z2fiori_cl_client.clas.abap           # + lcl_action_mgr, lcl_binding_resolver
│   │   ├── z2fiori_cl_view_builder.clas.abap     # Low-level XML tree builder
│   │   ├── z2fiori_cl_xml_view_builder.clas.abap # 500+ controls, generated
│   │   └── z2fiori_if_types.intf.abap
│   ├── http/
│   │   ├── z2fiori_cl_http_handler.clas.abap     # factory_onprem / factory_cloud, serve()
│   │   ├── z2fiori_cl_http_onprem.clas.abap      # ICF: IF_HTTP_REQUEST/RESPONSE + security
│   │   ├── z2fiori_cl_http_cloud.clas.abap       # BTP: IF_WEB_HTTP_REQUEST/RESPONSE + security
│   │   ├── z2fiori_cl_app_runner.clas.abap       # Instantiate + hydrate + run
│   │   ├── z2fiori_cl_request_parser.clas.abap   # JSON -> ty_s_http_req
│   │   ├── z2fiori_cl_response_builder.clas.abap # ty_s_http_res -> JSON
│   │   └── z2fiori_cl_state_codec.clas.abap
│   └── vendor/z2fiori_cl_ajson*  # JSON (ajson)
├── scripts/
│   ├── server.mjs                # Local dev server (UI5 + ABAP ICF)
│   ├── generate_views.mjs        # Generates z2fiori_cl_xml_view_builder from api.json
│   ├── pull_ajson.mjs            # Syncs & vendors ajson library
│   ├── build_dist.mjs            # standard + cloud distribution builds
│   ├── clean.mjs                 # Cleans build/transpiled artifacts
│   └── deploy_branches.mjs       # Deploys standard and cloud branches
├── abaplint.json / abaplint-cloud.json / abaplint-downport.json / abaplint-transpiler.json
└── package.json
```

`app/` is a standalone UI5 application deployable to BSP or BTP HTML5 repo. `src/` is pure ABAP importable via abapGit.

---

## Requirements

- **Node.js** >= 20 (see `package.json:engines`)
- **UI5** >= 1.151 (`@ui5/cli 4.x`, `ui5-tooling-transpile 3.10`)
- **TypeScript** 5.9, strict mode
- **ABAP** 7.69+ (Normal language version), downport via `abaplint-transpiler` for older releases
- **abaplint** 2.120+

---

## Getting Started

```bash
# 1. Clone and install
git clone <repo> && cd abap2fiori
npm install

# 2. Pull vendor JSON lib (if not as submodule)
npm run pull:ajson
# or
npm run deps

# 3. Regenerate view builder after UI5 version bump (optional)
npm run generate:views

# 4. Type-check frontend
npm run typecheck
# or: npm run lint:ui

# 5. Lint ABAP
npm run lint
npm run lint:cloud
npm run lint:downport

# 6. Full check (typecheck + all lints)
npm run ci

# 7. Transpile ABAP -> JS for unit tests
npm run build

# 8. Run unit tests (ABAP transpiled to JS)
npm run test:unit

# 9. Run everything
npm test

# 10. Build UI5 bundle
npm run build:ui5
# output -> dist/

# 11. Build ABAP distributions (standard + cloud)
npm run build:dist
```

Open the app locally (after `npm run build:ui5` + `ui5 serve` via `app/ui5-local.yaml`):

```
http://localhost:8080/index.html?app=ZCL_MY_FIORI_APP
```

`State.ts` resolves the app class from (in order): FLP `startupParameters.app`, `location.hash?app=`, `location.search?app=`.

---

## Your First App

Implement `z2fiori_if_app` - a single `main( client )` method covers the whole lifecycle:

```abap
CLASS zcl_my_fiori_app DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.
    DATA mv_user_name TYPE string VALUE 'John Doe'.
    DATA mv_status    TYPE string VALUE 'Ready'.
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

Key APIs:

- `client->check_init( )` - first call
- `client->check_event( 'SAVE' )` / `client->get_event( )` / `client->get_event_arg( 1 )`
- `client->bind( mv_var )` - two-way binding to `state` (`{/MV_USER_NAME}`)
- `client->event( 'MY_EVENT' t_arg = VALUE #( ( 'value' ) ) )` - serialized to `press` attribute
- `client->view_display( xml )`, `client->popup_show( xml )`, `client->popup_close( )`

---

## Core Concepts

### 1. Fluent XML View Builder (`z2fiori_cl_xml_view_builder`)

Generated 500+ controls from `sap.m`, `sap.ui.core`, `sap.ui.layout`, `sap.ui.table`. See [View Builder Generation](#view-builder-generation).

- **Containers vs Leaves:** Containers (`Page`, `VBox`, `Table`, `Panel`, `Dialog`) nest via `ele()`; leaves (`Input`, `Button`, `Label`, `Text`) stay flat via `tag()`. Determined by `ui5-metadata.defaultAggregation`.
- **Navigation:** `->end( )` to parent, `->root( )` to `<View>`.
- **Preferred Parameter:** `button( 'Save' )`, `input( '{/NAME}' )`, `page( 'Home' )`, `label( 'Username' )` map to `text / value / title` automatically.
- **Escaping:** Low-level `z2fiori_cl_view_builder=>xml_escape` uses `cl_abap_format=>e_xml_attr`.

Do not edit `z2fiori_cl_xml_view_builder` manually - regenerate via `scripts/generate_views.mjs`.

### 2. State and Binding

- Frontend: `State.ts` holds a `JSONModel` (`/MV_USER_NAME`, `/MT_FLIGHTS`, ...). `HttpClient.buildPayload()` sends `State.getStateJson()` (cached) each POST.
- Backend: `z2fiori_cl_state_codec` hydrates public attributes of your app class before `main()`, and serializes them back in the response. `z2fiori_cl_client`'s `lcl_binding_resolver` resolves `bind()` references.

### 3. Events

- Frontend: `App.controller.ts:onEvent` and `ViewManager.ts:ViewDelegateController:onEvent` both call `Dispatcher.send({event, args})`.
- Backend: `client->event( event = 'ROW_SELECT' t_arg = VALUE #( ( '${CARRID}' ) ... ) )` injects row context (`${ }` replaced client-side). Handler reads `client->get_event_arg( 1 )`.

### 4. Tables and Row Actions

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
        )->button( text = 'Details'
                   press = client->event( event = 'ROW_SELECT'
                                          t_arg = VALUE #( ( '${CARRID}' ) ( '${CONNID}' ) ) ) )
    )->root( ).

" Handler:
DATA(lv_carrid) = client->get_event_arg( 1 ).
```

### 5. Popups (`factory_popup`)

Native UI5 `FragmentDefinition` with stack:

```abap
DATA lo_popup TYPE REF TO z2fiori_cl_xml_view_builder.
lo_popup = z2fiori_cl_xml_view_builder=>factory_popup( ).
lo_popup->dialog( title = 'Edit Item'
  )->vbox( class = 'sapUiMediumMargin'
    )->input( value = client->bind( mv_input )
    )->button( text = 'Confirm' press = client->event( 'CONFIRM' )
    )->button( text = 'Cancel'  press = client->event( 'CANCEL' ) ).

client->popup_show( lo_popup->stringify( ) ).
" later: client->popup_close( ). / client->popups_close_all( ).
```

Frontend `PopupManager.ts` maintains LIFO stack, auto-closes all on `App.controller:onExit`.

### 6. Client Actions

Queued by `z2fiori_cl_client=>lcl_action_mgr` and returned as `t_actions`:

- `toast_display( text [ , duration ] )`
- `message_box_display( text [ , title, type, confirm_event, cancel_event ] )`
- `popup_show( xml )`, `popup_close( )`, `popups_close_all( )`
- `nest_view_display( id, xml [, method_insert ] )` / `nest_view_destroy( id )`
- `nav_call( app )` / `nav_leave( result )`
- `set_title( title )`, `set_favicon( url )`, `set_focus( id )`, `scroll_into_view( id )`
- `set_dirty_state( is_dirty )` -> `beforeunload` guard in `App.controller`
- `keyboard_shortcut( key, [ctrl, alt, shift], event [, event_args ] )`
- `clipboard_write( text )`, `clipboard_read( event )`
- `device_read( event )`, `location_read( event )`, `query_read( event )`
- `open_new_tab( url )`, `location_reload( )`
- `add_script( url )`, `add_style( url )`
- `file_download( filename, base64 [, type ] )`
- `follow_up_action( event [, event_args, delay_ms ] )`

---

## Frontend - app/webapp

### Dispatcher (`core/Dispatcher.ts`)

- Deduplicates with `isBusy`, blurs active element (`ControlUtil.blurActive()`), shows `BusyIndicator`.
- `HttpClient.buildPayload()` -> `HttpClient.post()` -> `handleResponse()`.
- On success: `State.setApp()`, `State.setModelData()`, `ViewManager.mount()`, then `ActionRegistry.execute()` for each `t_actions` (errors isolated per action via `MessageBox.error`).

### State (`core/State.ts`)

- Owns `JSONModel` (sizeLimit 10000), `App` container (`byId("appContainer")`), `Controller`, `navStack`, `shortcuts`, `dirty` flag.
- `init(controller)` lazy-initializes once (`booted`), reads endpoint from `manifest.json:sap.app/dataSources/http/uri` (`/sap/bc/z2fiori`), resolves app name from startupParameters / hash / search.
- Caches `JSON.stringify(modelData)` for `getStateJson()`.
- `consumeNavigated()` is called by `HttpClient.buildPayload()` to clear one-shot `navigated/prevArg`.

### ViewManager (`core/ViewManager.ts`)

- `ViewDelegateController` forwards `onEvent` via dynamic `import("./Dispatcher")` to avoid circular deps.
- `mount(xml)` creates `XMLView.create({definition: xml, controller})`, sets model, adds to `App` container, `to(viewId)`, destroys old pages.

### HttpClient (`core/HttpClient.ts`)

- `buildPayload({event, args, checkInit})` normalizes `event_args` to strings (objects -> JSON), picks `state` (or `"{}"` on init, else `State.getStateJson()`), merges `navigated/prevArg`.
- `fetchCsrfToken()` does `GET` with `X-CSRF-Token: Fetch`, stores case-insensitive `x-csrf-token`.
- `post(payload, retryOn403=true)` sends `Content-Type: application/json` + `X-CSRF-Token`, retries once on 403 after `fetchCsrfToken()`.

### Other Core Helpers

- `PopupManager.ts`, `Navigation.ts` (push/pop `navStack`, hash handling), `ShortcutManager.ts` (global `keydown`), `DeviceUtil.ts`, `ControlUtil.ts`, `ViewManager.ts`.
- `types/` - `Http.ts` (`HttpRequest`, `HttpResponse`, `DispatcherSendOptions`), `Action.ts` (discriminated union 1:1 with ABAP), `Device.ts`, `Query.ts`, `NavStack.ts`, `Config.ts`.

---

## Backend - src

### Interfaces

- `z2fiori_if_app` - `main( client TYPE REF TO z2fiori_if_client )`
- `z2fiori_if_client` - navigation (`check_init`, `check_event`, `get_event`, `get_event_arg`, `get_nav_prev_arg`, `check_navigated`, `check_nav_stack`, `get_query`, `get_query_param`, `get_config`, `get_device`, `get`), binding (`bind`, `event`), view (`view_display`, `get_view`, `nest_view_display/destroy`), all client actions.
- `z2fiori_if_types` - `ty_s_http_req`, `ty_s_http_res`, `ty_t_actions`
- `z2fiori_if_http` - abstract `IF_HTTP_REQUEST/RESPONSE` wrapper (`get_text/binary/header/method/path/query`, `set_text/binary/header/status/compression`)

### Core

- `z2fiori_cl_client` - facade; delegates to `lcl_action_mgr` (queues `t_actions`) and `lcl_binding_resolver` / `lcl_request_reader` / `lcl_event_helper`. Constructor takes `app` ref + optional `req`.
- `z2fiori_cl_view_builder` - generic tree (`ele`, `tag`, `a`, `end`, `root`, `render`, `stringify`, `xml_escape`).
- `z2fiori_cl_xml_view_builder` - generated typed wrapper for every UI5 control/aggregation. `factory( )` creates `<mvc:View displayBlock=true height=100% xmlns=...>`, `factory_popup( )` creates `<core:FragmentDefinition>`.

### HTTP Layer

- `z2fiori_cl_http_handler` - entry point. `factory_onprem( server )` and `factory_cloud( request, response )` delegate to `z2fiori_cl_http_onprem` / `z2fiori_cl_http_cloud` which implement `z2fiori_if_http`. `serve()` routes `POST -> serve_roundtrip()` (parse -> `z2fiori_cl_app_runner=>run` -> `respond_json`), `GET -> respond_info()` (`{service, method, version}`), `HEAD/OPTIONS -> 200`, else `405`. JSON content type `application/json; charset=utf-8`, compression for large payloads.
- `z2fiori_cl_request_parser` - validates non-empty JSON, `z2fiori_cl_ajson=>parse(...)->to_abap(corresponding)` -> `ty_s_http_req`, requires `app`.
- `z2fiori_cl_response_builder` - `ty_s_http_res` -> `create_empty->set_boolean/string/set(...)` -> `stringify()`.
- `z2fiori_cl_app_runner` - resolves app class by name, creates instance, hydrates state, invokes `main`.
- `z2fiori_cl_state_codec` - state JSON <-> ABAP attributes.

---

## Security

Implemented in both `z2fiori_cl_http_onprem` and `z2fiori_cl_http_cloud`:

- **CSRF:** 
  - `GET` with `X-CSRF-Token: Fetch` (or `Required`) triggers `generate_token()` (tries `CL_SYSTEM_UUID` / `CL_ABAP_UUID`, falls back to `sy-datum+uzeit+uname+tabix` hashed with `CL_ABAP_MESSAGE_DIGEST` SHA1) and is returned as `X-CSRF-Token` response header.
  - `POST` calls `validate_csrf_token()` in `get_text()`: allows `Fetch/Required` sentinel and empty token with fallback Origin/Referer vs Host (`Host`/`X-Forwarded-Host`) check; blocks cross-origin POST without token via `z2fiori_cx_error`.
  - Frontend `HttpClient.ts` does `Fetch` on startup and retries once on 403, storing token case-insensitively.

- **Clickjacking / Hardening:**
  - Every response (via `apply_security_headers()` called from `set_text/set_binary/set_status/set_header`) sets `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 0`. Idempotent per request (`mv_security_headers_sent`).

Headers are set via dynamic `IF_HTTP_RESPONSE~SET_HEADER_FIELD` / `IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD` calls for compatibility with transpiled and cloud runtimes.

---

## View Builder Generation

`z2fiori_cl_xml_view_builder` is **generated**, never edited manually.

- **Script:** `scripts/generate_views.mjs` (Node >= 20, ESM)
- **Source:** `https://ui5.sap.com/test-resources/<lib>/designtime/api.json` for `sap/m`, `sap/ui/core`, `sap/ui/layout`, `sap/ui/table`
- **Logic:** Parses `symbols` (`kind=class`, is `sap.ui.core.Element/Control`), walks inheritance for `properties/events/aggregations`, respects `ui5-metadata.defaultAggregation` to decide container (`ele`) vs leaf (`tag`), handles `deprecated`/`visibility`, de-duplicates method names with `getLibPrefix` and 30-char ABAP limit, maps `boolean` via `boolean()` helper, creates `PREFERRED PARAMETER` heuristics (`text/value/title/...` or `defaultAggregation`), generates aggregation slots (`<items>`, `<columns>`, etc.).
- **Output:** `src/core/z2fiori_cl_xml_view_builder.clas.abap` - `factory`, `factory_popup`, `end`, `root`, `stringify`, `boolean`, plus one `METHOD` per control and per aggregation, with `ABAPDoc` linking to `https://ui5.sap.com/#/api/<class>`.
- **Regenerate:**

```bash
npm run generate:views
# direct
node scripts/generate_views.mjs
```

Excluded from `abaplint.json:noIssues` because generated code intentionally violates some rules.

---

## Extending Actions

`app/webapp/core/ActionRegistry.ts` is **Open/Closed**:

- **Auto-discovery (preferred):** Place a new file `app/webapp/core/actions/myFeature.ts` exporting a handler map:

```ts
// app/webapp/core/actions/myFeature.ts
import type { ActionContext } from "../../types/Action";
export const myHandlers = {
  MY_ACTION: (payload: string, ctx: ActionContext) => { /* ... */ }
};
```

`ActionRegistry.ts` picks it up automatically via `import.meta.glob("./actions/*.ts", {eager:true})` (Vite) without editing the registry. Fallback for `ui5-tooling-transpile` uses dynamic `import("./actions/*")`.

- **Manual plugin (runtime):** From any module (e.g., `Component.ts:init`):

```ts
import ActionRegistry from "./core/ActionRegistry";
ActionRegistry.register("MY_ACTION", (payload, ctx) => { /* ... */ });
ActionRegistry.registerMany({ MY_ACTION2: fn2, MY_ACTION3: fn3 });
```

`ActionRegistry` API: `register(type, fn)`, `registerMany(map)`, `has(type)`, `getTypes()`, `ensureInitialized()`, `execute(action, ctx)`. `execute` throws if handler missing (shown as `MessageBox.error` by `Dispatcher`).

To expose a new ABAP action, add it to `lcl_action_mgr` in `z2fiori_cl_client` locals and to `types/Action.ts` discriminated union, keeping ABAP `TYPE` uppercase.

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| `clean` | `node scripts/clean.mjs` | Remove `output/`, `dist/` |
| `deps` | `git submodule update --init --recursive` | Init submodules |
| `pull:ajson` | `node scripts/pull_ajson.mjs` | Vendor `ajson` |
| `typecheck` | `tsc --noEmit --project app/tsconfig.json` | TS strict check |
| `lint` | `abaplint` | ABAP lint (Normal) |
| Command | Action | Description |
|---|---|---|
| `start` / `dev` | `node scripts/server.mjs` | Run local dev server (UI5 frontend + ABAP ICF handler) |
| `build` | `npm run build:ui && npm run build:abap && npm run lint:all` | Full project build and verification |
| `build:ui` | `tsc && ui5 build` | Build UI5 webapp to `dist/` |
| `build:abap` | `node scripts/build_dist.mjs` | Transpile & create onprem/cloud packages in `build/` |
| `clean` | `node scripts/clean.mjs` | Clean temporary and output directories |
| `views` | `node scripts/generate_views.mjs` | Regenerate ABAP XML view builder from UI5 metadata |
| `pull` | `node scripts/pull_ajson.mjs` | Pull latest ajson library into vendor folder |
| `lint` | `abaplint` | Lint ABAP code |
| `lint:fix` | `abaplint --fix` | Auto-fix ABAP issues |
| `lint:all` | `tsc && abaplint (all targets)` | Full linting (TS, standard, cloud, downport) |
| `test` | `abap_transpile && node index.mjs` | Run ABAP unit tests |
| `test:all` | `npm run lint:all && npm run test` | Full linting and unit testing |
| `deploy` | `node scripts/deploy_branches.mjs` | Deploy to `standard` and `cloud` branches |

---

## Configuration

- **`app/manifest.json`** - `sap.app.id: z2fiori`, `dataSources.http.uri: /sap/bc/z2fiori` (endpoint used by `State.ts` + `HttpClient.ts`), `sap.ui5.rootView: z2fiori.view.App`, libs `sap.m`, `sap.ui.core`, `flexEnabled: true`.
- **`app/ui5.yaml`** / `ui5-local.yaml` - `ui5-tooling-transpile-middleware/task` with `transformModulesToUI5`, `overridesToOverride`, `debug: true`.
- **`app/tsconfig.json`** - `target es2022`, `module es2022`, `strict: true`, `moduleResolution: node`, `paths: z2fiori/* -> webapp/*`.
- **`abaplint.json` (etc.)** - `release v769`, `global.files /src/**/*`, `noIssues` for `vendor` and generated builder, `abapdoc: false`, `in_statement_indentation`, `keyword_case: upper`.

---

## Deployment

### ABAP Backend (abapGit)

1. Import `src/` via abapGit to your system (On-Premise or BTP ABAP Environment).
2. Activate.

### On-Premise (SICF)

Create SICF service `/sap/bc/z2fiori_http` (or `/sap/bc/z2fiori`) pointing to handler class that calls `z2fiori_cl_http_handler=>factory_onprem( server )`. Ensure ICF node is active and auth is set.

### ABAP Cloud / BTP

Expose an HTTP Service (e.g., `Z2FIORI_HTTP`) with handler:

```abap
METHOD if_http_service_extension~handle_request.
  z2fiori_cl_http_handler=>factory_cloud( request  = request
                                           response = response ).
ENDMETHOD.
```

### Frontend

- **BSP/MIME:** Upload `app/webapp` to `SE80` BSP Application or `/sap/bc/bsp/sap/...`.
- **BTP HTML5 Repo:** `npm run build:ui5`, then deploy `dist/` via `html5-repo` or BAS.

### Access

```
https://<host>:<port>/sap/bc/z2fiori_http  (POST endpoint)
https://<host>:<port>/webapp/index.html?app=ZCL_MY_FIORI_APP
https://<host>:<port>/webapp/index.html#?app=ZCL_MY_FIORI_APP  (hash variant)
```

---

## Development Workflow

- **Type Safety First:** `npm run ci` before commit. `abaplint --fix` auto-formats ABAP.
- **Generated Code:** Never hand-edit `z2fiori_cl_xml_view_builder`. Bump UI5 version -> `npm run generate:views` -> commit.
- **State Size:** `State.ts` caches `JSON.stringify`; keep public attributes flat. Large tables use paging (future delta compression via `z2fiori_cl_state_codec`).
- **Actions:** Add ABAP `t_action` entry + `types/Action.ts` type + `app/webapp/core/actions/*.ts` handler in one PR.
- **Security:** Test CSRF flow: `GET` with `X-CSRF-Token: Fetch` must return token; `POST` without token + mismatched `Origin` must fail. Verify `X-Frame-Options` on `GET` and `POST` responses.

### Testing

- `npm run test:unit` - runs transpiled ABAP unit tests via `abap-kit` (`output/index.mjs`, `--expose-gc`).
- `npm run build:dist` validates both Standard and Cloud builds before deploy (`scripts/build_dist.mjs`).

---

## Troubleshooting

- **`No handler registered for action type 'X'`** - Missing `ActionRegistry.register` or new file not picked by `import.meta.glob` fallback. Check `app/webapp/core/actions/` export name and `types/Action.ts` union.
- **`CSRF validation failed`** - Frontend `HttpClient` not sending `X-CSRF-Token`, or `Host` vs `Origin` mismatch behind reverse proxy. Ensure `X-Forwarded-Host` is forwarded.
- **`HTTP 405`** - `z2fiori_cl_http_handler:serve()` only allows `POST` (roundtrip) and `GET` (info). Use `POST` for events.
- **`View mount failed`** - Invalid XML from builder (unescaped attr). `z2fiori_cl_view_builder=>xml_escape` handles attrs; check manual `stringify` concatenation.
- **`App name is missing`** - `State.ts` could not resolve `?app=`. Pass `?app=ZCL_MY_APP` or set FLP startup parameter.

---

## License

MIT
