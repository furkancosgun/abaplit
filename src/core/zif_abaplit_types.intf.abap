INTERFACE zif_abaplit_types PUBLIC.

  TYPES:
    BEGIN OF ty_s_action,
      type    TYPE string,
      payload TYPE REF TO data,
    END OF ty_s_action,
    ty_t_action TYPE STANDARD TABLE OF ty_s_action WITH EMPTY KEY.

  TYPES:
    BEGIN OF ty_s_http_req,
      app        TYPE string,
      event      TYPE string,
      event_args TYPE string_table,
      check_init TYPE abap_bool,
      state      TYPE string,
    END OF ty_s_http_req.

  TYPES:
    BEGIN OF ty_s_http_res,
      success   TYPE abap_bool,
      app       TYPE string,
      view      TYPE string,
      state     TYPE string,
      t_actions TYPE ty_t_action,
      message   TYPE string,
    END OF ty_s_http_res.

ENDINTERFACE.
