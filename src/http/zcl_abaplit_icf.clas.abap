CLASS zcl_abaplit_icf DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_http_extension.
ENDCLASS.

CLASS zcl_abaplit_icf IMPLEMENTATION.
  METHOD if_http_extension~handle_request.
    zcl_abaplit_http_handler=>factory_onprem( server = server ).
  ENDMETHOD.
ENDCLASS.

