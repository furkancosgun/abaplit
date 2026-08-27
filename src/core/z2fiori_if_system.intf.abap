INTERFACE z2fiori_if_system PUBLIC.

  CONSTANTS:
    BEGIN OF cs_msg_box_type,
      information TYPE string VALUE `information`,
      success     TYPE string VALUE `success`,
      warning     TYPE string VALUE `warning`,
      error       TYPE string VALUE `error`,
      question    TYPE string VALUE `question`,
    END OF cs_msg_box_type.

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

ENDINTERFACE.
