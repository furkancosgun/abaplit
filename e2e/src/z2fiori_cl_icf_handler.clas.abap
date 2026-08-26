CLASS z2fiori_cl_icf_handler DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_http_extension.
ENDCLASS.


CLASS z2fiori_cl_icf_handler IMPLEMENTATION.
  METHOD if_http_extension~handle_request.
    z2fiori_cl_http_handler=>factory_onprem( server ).
  ENDMETHOD.
ENDCLASS.
