INTERFACE z2fiori_if_client PUBLIC.

  CONSTANTS:
    BEGIN OF cs_msg_box_type,
      information TYPE string VALUE `information`,
      success     TYPE string VALUE `success`,
      warning     TYPE string VALUE `warning`,
      error       TYPE string VALUE `error`,
      question    TYPE string VALUE `question`,
    END OF cs_msg_box_type.

  METHODS view_display
    IMPORTING !xml TYPE clike.

  METHODS get_view
    RETURNING VALUE(result) TYPE string.

  METHODS bind
    IMPORTING val           TYPE data
    RETURNING VALUE(result) TYPE string.

  METHODS event
    IMPORTING !event        TYPE clike        OPTIONAL
              t_arg         TYPE string_table OPTIONAL
        PREFERRED PARAMETER event
    RETURNING VALUE(result) TYPE string.

  METHODS popup_show
    IMPORTING !xml TYPE clike.

  METHODS popup_close.

  METHODS popups_close_all.

  METHODS nest_view_display
    IMPORTING !id           TYPE clike
              !xml          TYPE clike
              method_insert TYPE clike.

  METHODS nest_view_destroy
    IMPORTING !id            TYPE clike
              method_destroy TYPE clike.

  METHODS toast_display
    IMPORTING !text     TYPE clike
              !duration TYPE clike OPTIONAL.

  METHODS message_box_display
    IMPORTING !text         TYPE any
              !title        TYPE clike OPTIONAL
              !type         TYPE clike DEFAULT `information`
              confirm_event TYPE clike OPTIONAL
              cancel_event  TYPE clike OPTIONAL.

  METHODS set_title
    IMPORTING !title TYPE clike.

  METHODS set_favicon
    IMPORTING url TYPE clike.

  METHODS set_focus
    IMPORTING !id TYPE clike.

  METHODS scroll_into_view
    IMPORTING !id TYPE clike.

  METHODS clipboard_write
    IMPORTING !text TYPE clike.

  METHODS clipboard_read
    IMPORTING !event TYPE clike.

  METHODS device_read
    IMPORTING !event TYPE clike.

  METHODS location_read
    IMPORTING !event TYPE clike.

  METHODS query_read
    IMPORTING !event TYPE clike.

  METHODS open_new_tab
    IMPORTING url TYPE clike.

  METHODS location_reload.

  METHODS set_dirty_state
    IMPORTING is_dirty TYPE abap_bool DEFAULT abap_true.

  METHODS keyboard_shortcut
    IMPORTING !key       TYPE clike
              ctrl       TYPE abap_bool    OPTIONAL
              alt        TYPE abap_bool    OPTIONAL
              !shift     TYPE abap_bool    OPTIONAL
              !event     TYPE clike
              event_args TYPE string_table OPTIONAL.

  METHODS add_script
    IMPORTING url TYPE clike.

  METHODS add_style
    IMPORTING url TYPE clike.

  METHODS file_download
    IMPORTING filename TYPE clike
              base64   TYPE clike
              !type    TYPE clike OPTIONAL.

  METHODS follow_up_action
    IMPORTING !event     TYPE clike
              event_args TYPE string_table OPTIONAL
              delay_ms   TYPE i            DEFAULT 0.

  METHODS nav_call
    IMPORTING app TYPE REF TO z2fiori_if_app
    PREFERRED PARAMETER app.

  METHODS nav_leave
    IMPORTING !result TYPE data OPTIONAL.

  METHODS get_nav_prev_arg
    EXPORTING !result TYPE data.

  METHODS get
    RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_http_req.

  METHODS get_event
    RETURNING VALUE(result) TYPE string.

  METHODS get_event_arg
    IMPORTING !index        TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE string.

  METHODS get_query_param
    IMPORTING !name         TYPE clike
              !index        TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE string.

  METHODS get_query
    IMPORTING !index        TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_t_query.

  METHODS get_config
    IMPORTING !index        TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_config.

  METHODS get_device
    IMPORTING !index        TYPE i DEFAULT 1
    RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_device.

  METHODS check_init
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS check_navigated
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS check_nav_stack
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS check_event
    IMPORTING !event        TYPE clike OPTIONAL
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS get_actions
    RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_t_action.

ENDINTERFACE.
