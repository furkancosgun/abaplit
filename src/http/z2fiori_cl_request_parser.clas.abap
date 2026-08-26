CLASS z2fiori_cl_request_parser DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS parse
      IMPORTING json          TYPE string
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_http_req.
ENDCLASS.


CLASS z2fiori_cl_request_parser IMPLEMENTATION.
  METHOD parse.
    IF json IS INITIAL.
      z2fiori_cx_error=>raise( 'Request payload is empty.' ).
    ENDIF.

    TRY.
        z2fiori_cl_ajson=>parse( json )->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = result ).
      CATCH z2fiori_cx_ajson_error INTO DATA(lx_ajson).
        z2fiori_cx_error=>raise( val      = 'Invalid JSON request payload.'
                                 previous = lx_ajson ).
    ENDTRY.

    IF result-app IS INITIAL.
      z2fiori_cx_error=>raise( 'Application name is missing in request payload.' ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
