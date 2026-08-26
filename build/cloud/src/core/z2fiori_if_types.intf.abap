INTERFACE z2fiori_if_types PUBLIC.

  TYPES:
    BEGIN OF ty_s_query,
      name  TYPE string,
      value TYPE string,
    END OF ty_s_query,
    ty_t_query TYPE STANDARD TABLE OF ty_s_query WITH EMPTY KEY.
  TYPES:
    BEGIN OF ty_s_config,
      origin   TYPE string,
      pathname TYPE string,
      search   TYPE string,
      hash     TYPE string,
    END OF ty_s_config.
  TYPES:
    BEGIN OF ty_s_device_browser,
      name    TYPE string,
      version TYPE string,
    END OF ty_s_device_browser.
  TYPES:
    BEGIN OF ty_s_device_os,
      name    TYPE string,
      version TYPE string,
    END OF ty_s_device_os.
  TYPES:
    BEGIN OF ty_s_device_resize,
      width  TYPE i,
      height TYPE i,
    END OF ty_s_device_resize.
  TYPES:
    BEGIN OF ty_s_device_support,
      touch   TYPE abap_bool,
      pointer TYPE abap_bool,
      retina  TYPE abap_bool,
    END OF ty_s_device_support.
  TYPES:
    BEGIN OF ty_s_device,
      system      TYPE string,
      orientation TYPE string,
      browser     TYPE ty_s_device_browser,
      os          TYPE ty_s_device_os,
      resize      TYPE ty_s_device_resize,
      support     TYPE ty_s_device_support,
    END OF ty_s_device.
  TYPES:
    BEGIN OF ty_s_action,
      type    TYPE string,
      payload TYPE REF TO data,
    END OF ty_s_action,
    ty_t_action TYPE STANDARD TABLE OF ty_s_action WITH EMPTY KEY.
  TYPES:
    BEGIN OF ty_s_http_req,
      app             TYPE string,
      event           TYPE string,
      event_args      TYPE string_table,
      check_init      TYPE abap_bool,
      check_navigated TYPE abap_bool,
      check_nav_stack TYPE abap_bool,
      state           TYPE string,
      nav_prev_arg    TYPE string,
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
