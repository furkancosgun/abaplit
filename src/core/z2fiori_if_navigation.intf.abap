INTERFACE z2fiori_if_navigation PUBLIC.

  METHODS nav_call
    IMPORTING app TYPE REF TO z2fiori_if_app
    PREFERRED PARAMETER app.

  METHODS nav_leave
    IMPORTING !result TYPE data OPTIONAL.

  METHODS get_nav_prev_arg
    EXPORTING !result TYPE data.

  METHODS check_navigated
    RETURNING VALUE(result) TYPE abap_bool.

  METHODS check_nav_stack
    RETURNING VALUE(result) TYPE abap_bool.

ENDINTERFACE.
