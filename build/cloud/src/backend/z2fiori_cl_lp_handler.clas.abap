CLASS z2fiori_cl_lp_handler DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_http_service_extension.
ENDCLASS.


CLASS z2fiori_cl_lp_handler IMPLEMENTATION.
  METHOD if_http_service_extension~handle_request.
    z2fiori_cl_http_handler=>factory_cloud( request  = request
                                            response = response ).
  ENDMETHOD.
ENDCLASS.
