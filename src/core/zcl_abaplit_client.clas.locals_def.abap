CLASS lcl_binding_resolver DEFINITION FINAL.
  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_s_node,
        path TYPE string,
        dref TYPE REF TO data,
      END OF ty_s_node.
    TYPES ty_t_nodes TYPE STANDARD TABLE OF ty_s_node WITH EMPTY KEY.

    METHODS constructor
      IMPORTING io_app TYPE REF TO object.

    METHODS bind
      IMPORTING val           TYPE data
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
      RETURNING VALUE(result) TYPE zif_abaplit_types=>ty_t_action.

    METHODS toast_display
      IMPORTING text     TYPE clike
                duration TYPE clike OPTIONAL.

    METHODS set_title
      IMPORTING title TYPE clike.

    METHODS clipboard_write
      IMPORTING text TYPE clike.

    METHODS open_new_tab
      IMPORTING url TYPE clike.

    METHODS file_download
      IMPORTING filename TYPE clike
                base64   TYPE clike
                type     TYPE clike OPTIONAL.

  PRIVATE SECTION.
    DATA mt_actions TYPE zif_abaplit_types=>ty_t_action.
ENDCLASS.


CLASS lcl_event_helper DEFINITION FINAL.
  PUBLIC SECTION.
    CLASS-METHODS event
      IMPORTING event         TYPE clike
                t_arg         TYPE string_table OPTIONAL
      RETURNING VALUE(result) TYPE string.
ENDCLASS.
