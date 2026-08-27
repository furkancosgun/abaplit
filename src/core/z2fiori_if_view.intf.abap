INTERFACE z2fiori_if_view PUBLIC.

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

  METHODS nest_view_display
    IMPORTING !id           TYPE clike
              !xml          TYPE clike
              method_insert TYPE clike.

  METHODS nest_view_destroy
    IMPORTING !id            TYPE clike
              method_destroy TYPE clike.

ENDINTERFACE.
