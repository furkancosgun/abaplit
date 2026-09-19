INTERFACE zif_abaplit_client PUBLIC.

  METHODS new_view
    RETURNING VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

  METHODS view_display
    IMPORTING val TYPE clike.

  METHODS get_view
    RETURNING VALUE(result) TYPE string.

  METHODS bind
    IMPORTING val           TYPE data
    RETURNING VALUE(result) TYPE string.

  METHODS event
    IMPORTING event         TYPE clike        OPTIONAL
              t_arg         TYPE string_table OPTIONAL
        PREFERRED PARAMETER event
    RETURNING VALUE(result) TYPE string.

  METHODS check_event
    IMPORTING event         TYPE clike OPTIONAL
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS check_init
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS get_event
    RETURNING VALUE(result) TYPE string.

  METHODS get_event_arg
    IMPORTING index         TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE string.

  METHODS toast_display
    IMPORTING text     TYPE clike
              duration TYPE clike OPTIONAL.

  METHODS file_download
    IMPORTING filename TYPE clike
              base64   TYPE clike
              type     TYPE clike OPTIONAL.

  METHODS clipboard_write
    IMPORTING text TYPE clike.

  METHODS open_new_tab
    IMPORTING url TYPE clike.

  METHODS set_title
    IMPORTING title TYPE clike.

  METHODS get
    RETURNING VALUE(result) TYPE zif_abaplit_types=>ty_s_http_req.

  METHODS get_actions
    RETURNING VALUE(result) TYPE zif_abaplit_types=>ty_t_action.

ENDINTERFACE.
