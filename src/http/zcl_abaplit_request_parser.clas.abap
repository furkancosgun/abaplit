CLASS zcl_abaplit_request_parser DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS parse
      IMPORTING json          TYPE string
      RETURNING VALUE(result) TYPE zif_abaplit_types=>ty_s_http_req.
ENDCLASS.


CLASS zcl_abaplit_request_parser IMPLEMENTATION.
  METHOD parse.
    IF json IS INITIAL.
      zcx_abaplit_error=>raise( 'Request payload is empty.' ).
    ENDIF.

    TRY.
        zcl_abaplit_ajson=>parse( json )->to_abap( EXPORTING iv_corresponding = abap_true
                                                  IMPORTING ev_container      = result ).
      CATCH zcx_abaplit_ajson_error INTO DATA(lx_ajson).
        zcx_abaplit_error=>raise( val     = |JSON Parse Error: { lx_ajson->get_text( ) }|
                                 previous = lx_ajson ).
    ENDTRY.

    IF result-app IS INITIAL.
      zcx_abaplit_error=>raise( 'Application name is missing in request payload.' ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
