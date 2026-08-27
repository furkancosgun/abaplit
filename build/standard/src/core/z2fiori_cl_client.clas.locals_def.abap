CLASS lcl_binding_resolver DEFINITION FINAL.
  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_s_node,
        path TYPE string,
        dref TYPE REF TO data,
      END OF ty_s_node.
    TYPES ty_t_nodes TYPE STANDARD TABLE OF ty_s_node WITH DEFAULT KEY.

    METHODS constructor
      IMPORTING io_app TYPE REF TO object.

    METHODS bind
      IMPORTING val           TYPE any
      RETURNING VALUE(result) TYPE string.

  PRIVATE SECTION.
    DATA mo_app   TYPE REF TO object.
    DATA mt_nodes TYPE ty_t_nodes.

    METHODS resolve
      IMPORTING iv_path TYPE clike
                iv_data TYPE data
      CHANGING  ct_node TYPE ty_t_nodes.

    METHODS resolve_struct
      IMPORTING iv_path TYPE clike
                iv_data TYPE any
                io_desc TYPE REF TO cl_abap_structdescr
      CHANGING  ct_node TYPE ty_t_nodes.

    METHODS resolve_dref
      IMPORTING iv_path TYPE clike
                ir_data TYPE REF TO data
      CHANGING  ct_node TYPE ty_t_nodes.

    METHODS resolve_oref
      IMPORTING iv_path TYPE clike
                io_data TYPE REF TO object
      CHANGING  ct_node TYPE ty_t_nodes.
ENDCLASS.


CLASS lcl_action_mgr DEFINITION FINAL.
  PUBLIC SECTION.
    METHODS add_action
      IMPORTING n TYPE clike
                p TYPE any OPTIONAL.

    METHODS get_actions
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_t_action.

    METHODS popup_show
      IMPORTING xml TYPE clike.

    METHODS popup_close.

    METHODS popups_close_all.

    METHODS nest_view_display
      IMPORTING id            TYPE clike
                xml           TYPE clike
                method_insert TYPE clike.

    METHODS nest_view_destroy
      IMPORTING id             TYPE clike
                method_destroy TYPE clike.

    METHODS toast_display
      IMPORTING text     TYPE clike
                duration TYPE clike OPTIONAL.

    METHODS message_box_display
      IMPORTING text          TYPE clike
                title         TYPE clike OPTIONAL
                type          TYPE clike OPTIONAL
                confirm_event TYPE clike OPTIONAL
                cancel_event  TYPE clike OPTIONAL.

    METHODS set_title
      IMPORTING title TYPE clike.

    METHODS set_favicon
      IMPORTING url TYPE clike.

    METHODS set_focus
      IMPORTING id TYPE clike.

    METHODS scroll_into_view
      IMPORTING id TYPE clike.

    METHODS clipboard_write
      IMPORTING text TYPE clike.

    METHODS clipboard_read
      IMPORTING event TYPE clike.

    METHODS device_read
      IMPORTING event TYPE clike.

    METHODS location_read
      IMPORTING event TYPE clike.

    METHODS query_read
      IMPORTING event TYPE clike.

    METHODS open_new_tab
      IMPORTING url TYPE clike.

    METHODS location_reload.

    METHODS set_dirty_state
      IMPORTING is_dirty TYPE abap_bool.

    METHODS keyboard_shortcut
      IMPORTING key        TYPE clike
                ctrl       TYPE abap_bool    OPTIONAL
                alt        TYPE abap_bool    OPTIONAL
                shift      TYPE abap_bool    OPTIONAL
                event      TYPE clike
                event_args TYPE string_table OPTIONAL.

    METHODS add_script
      IMPORTING url TYPE clike.

    METHODS add_style
      IMPORTING url TYPE clike.

    METHODS file_download
      IMPORTING filename TYPE clike
                base64   TYPE clike
                type     TYPE clike OPTIONAL.

    METHODS follow_up_action
      IMPORTING event      TYPE clike
                event_args TYPE string_table OPTIONAL
                delay_ms   TYPE i            OPTIONAL.

    METHODS nav_call
      IMPORTING app TYPE REF TO object.

    METHODS nav_leave
      IMPORTING result TYPE any OPTIONAL.

  PRIVATE SECTION.
    DATA mt_actions TYPE z2fiori_if_types=>ty_t_action.
ENDCLASS.


CLASS lcl_event_helper DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS js_quote
      IMPORTING val           TYPE clike
      RETURNING VALUE(result) TYPE string.

    CLASS-METHODS event
      IMPORTING event         TYPE clike
                t_arg         TYPE string_table OPTIONAL
      RETURNING VALUE(result) TYPE string.
ENDCLASS.


CLASS lcl_request_reader DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS find_query_param
      IMPORTING it_query      TYPE z2fiori_if_types=>ty_t_query
                name          TYPE clike
      RETURNING VALUE(result) TYPE string.

    CLASS-METHODS get_query
      IMPORTING iv_json       TYPE clike
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_t_query.

    CLASS-METHODS get_config
      IMPORTING iv_json       TYPE clike
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_config.

    CLASS-METHODS get_device
      IMPORTING iv_json       TYPE clike
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_device.

    CLASS-METHODS get_nav_prev_arg
      IMPORTING iv_nav_prev_arg TYPE clike
      EXPORTING result          TYPE any.
ENDCLASS.
