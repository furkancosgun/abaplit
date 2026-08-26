CLASS lcl_binding_resolver DEFINITION FINAL.
  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_s_node,
        path TYPE string,
        dref TYPE REF TO data,
      END OF ty_s_node.
    TYPES ty_t_nodes TYPE STANDARD TABLE OF ty_s_node WITH EMPTY KEY.

    METHODS constructor
      IMPORTING
        io_app TYPE REF TO object.

    METHODS bind
      IMPORTING
        val           TYPE any
      RETURNING
        VALUE(result) TYPE string
      RAISING
        z2fiori_cx_error.

  PRIVATE SECTION.
    DATA mo_app   TYPE REF TO object.
    DATA mt_nodes TYPE ty_t_nodes.

    METHODS resolve
      IMPORTING
        iv_path TYPE string
        iv_data TYPE data
      CHANGING
        ct_node TYPE ty_t_nodes.

    METHODS resolve_struct
      IMPORTING
        iv_path TYPE string
        iv_data TYPE any
        io_desc TYPE REF TO cl_abap_structdescr
      CHANGING
        ct_node TYPE ty_t_nodes.

    METHODS resolve_dref
      IMPORTING
        iv_path TYPE string
        ir_data TYPE REF TO data
      CHANGING
        ct_node TYPE ty_t_nodes.

    METHODS resolve_oref
      IMPORTING
        iv_path TYPE string
        io_data TYPE REF TO object
      CHANGING
        ct_node TYPE ty_t_nodes.
ENDCLASS.

CLASS lcl_action_mgr DEFINITION FINAL.
  PUBLIC SECTION.
    METHODS add_action
      IMPORTING
        n TYPE clike
        p TYPE any OPTIONAL.

    METHODS get_actions
      RETURNING
        VALUE(result) TYPE z2fiori_if_types=>ty_t_action.

    METHODS popup_show
      IMPORTING
        xml TYPE string.

    METHODS popup_close.

    METHODS popups_close_all.

    METHODS nest_view_display
      IMPORTING
        id            TYPE string
        xml           TYPE string
        method_insert TYPE string.

    METHODS nest_view_destroy
      IMPORTING
        id             TYPE string
        method_destroy TYPE string.

    METHODS toast_display
      IMPORTING
        text     TYPE string
        duration TYPE string.

    METHODS message_box_display
      IMPORTING
        text          TYPE clike
        title         TYPE string
        type          TYPE string
        confirm_event TYPE string
        cancel_event  TYPE string.

    METHODS set_title
      IMPORTING
        title TYPE string.

    METHODS set_favicon
      IMPORTING
        url TYPE string.

    METHODS set_focus
      IMPORTING
        id TYPE string.

    METHODS scroll_into_view
      IMPORTING
        id TYPE string.

    METHODS clipboard_write
      IMPORTING
        text TYPE string.

    METHODS clipboard_read
      IMPORTING
        event TYPE string.

    METHODS device_read
      IMPORTING
        event TYPE string.

    METHODS location_read
      IMPORTING
        event TYPE string.

    METHODS query_read
      IMPORTING
        event TYPE string.

    METHODS open_new_tab
      IMPORTING
        url TYPE string.

    METHODS location_reload.

    METHODS set_dirty_state
      IMPORTING
        is_dirty TYPE abap_bool.

    METHODS keyboard_shortcut
      IMPORTING
        key        TYPE string
        ctrl       TYPE abap_bool
        alt        TYPE abap_bool
        shift      TYPE abap_bool
        event      TYPE string
        event_args TYPE string_table.

    METHODS add_script
      IMPORTING
        url TYPE string.

    METHODS add_style
      IMPORTING
        url TYPE string.

    METHODS file_download
      IMPORTING
        filename TYPE string
        base64   TYPE string
        type     TYPE string.

    METHODS follow_up_action
      IMPORTING
        event      TYPE string
        event_args TYPE string_table
        delay_ms   TYPE i.

    METHODS nav_call
      IMPORTING
        app TYPE REF TO object.

    METHODS nav_leave
      IMPORTING
        result TYPE any OPTIONAL.

  PRIVATE SECTION.
    DATA mt_actions TYPE z2fiori_if_types=>ty_t_action.
ENDCLASS.

CLASS lcl_event_helper DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS js_quote
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE string.

    CLASS-METHODS event
      IMPORTING
        event         TYPE string
        t_arg         TYPE string_table OPTIONAL
      RETURNING
        VALUE(result) TYPE string.
ENDCLASS.

CLASS lcl_request_reader DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS find_query_param
      IMPORTING
        it_query      TYPE z2fiori_if_types=>ty_t_query
        name          TYPE clike
      RETURNING
        VALUE(result) TYPE string.

    CLASS-METHODS get_query
      IMPORTING
        iv_json       TYPE string
      RETURNING
        VALUE(result) TYPE z2fiori_if_types=>ty_t_query.

    CLASS-METHODS get_config
      IMPORTING
        iv_json       TYPE string
      RETURNING
        VALUE(result) TYPE z2fiori_if_types=>ty_s_config.

    CLASS-METHODS get_device
      IMPORTING
        iv_json       TYPE string
      RETURNING
        VALUE(result) TYPE z2fiori_if_types=>ty_s_device.

    CLASS-METHODS get_nav_prev_arg
      IMPORTING
        iv_nav_prev_arg TYPE string
      EXPORTING
        result          TYPE any
      RAISING
        z2fiori_cx_error.
ENDCLASS.