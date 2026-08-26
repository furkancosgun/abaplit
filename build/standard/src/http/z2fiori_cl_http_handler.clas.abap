CLASS z2fiori_cl_http_handler DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS factory_onprem
      IMPORTING server TYPE REF TO object.

    CLASS-METHODS factory_cloud
      IMPORTING request  TYPE REF TO object
                response TYPE REF TO object.

    METHODS constructor
      IMPORTING http TYPE REF TO z2fiori_if_http.

  PRIVATE SECTION.
    CONSTANTS gc_content_json TYPE string VALUE 'application/json; charset=utf-8'.

    DATA mo_http TYPE REF TO z2fiori_if_http.

    METHODS serve.

    METHODS serve_roundtrip.

    METHODS respond_json
      IMPORTING res TYPE z2fiori_if_types=>ty_s_http_res.

    METHODS respond_info.
ENDCLASS.


CLASS z2fiori_cl_http_handler IMPLEMENTATION.
  METHOD factory_onprem.
    DATA lo_service TYPE REF TO z2fiori_cl_http_onprem.
    CREATE OBJECT lo_service TYPE z2fiori_cl_http_onprem EXPORTING server = server.
    DATA lo_handler TYPE REF TO z2fiori_cl_http_handler.
    CREATE OBJECT lo_handler TYPE z2fiori_cl_http_handler EXPORTING HTTP = lo_service.
    lo_handler->serve( ).
  ENDMETHOD.

  METHOD factory_cloud.
    DATA lo_service TYPE REF TO z2fiori_cl_http_cloud.
    CREATE OBJECT lo_service TYPE z2fiori_cl_http_cloud EXPORTING request = request response = response.
    DATA lo_handler TYPE REF TO z2fiori_cl_http_handler.
    CREATE OBJECT lo_handler TYPE z2fiori_cl_http_handler EXPORTING HTTP = lo_service.
    lo_handler->serve( ).
  ENDMETHOD.

  METHOD constructor.
    mo_http = http.
  ENDMETHOD.

  METHOD serve.
    CASE mo_http->get_method( ).
      WHEN 'POST'.
        serve_roundtrip( ).
      WHEN 'GET'.
        respond_info( ).
      WHEN 'HEAD' OR 'OPTIONS'.
        mo_http->set_status( 200 ).
      WHEN OTHERS.
        mo_http->set_status( 405 ).
    ENDCASE.
    mo_http->set_compression( ).
  ENDMETHOD.

  METHOD serve_roundtrip.
    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    DATA ls_req TYPE z2fiori_if_types=>ty_s_http_req.
    DATA lx_err TYPE REF TO cx_root.

    TRY.
        ls_req = z2fiori_cl_request_parser=>parse( mo_http->get_text( ) ).
        ls_res = z2fiori_cl_app_runner=>run( ls_req ).
      CATCH cx_root INTO lx_err.
        CLEAR ls_res.
        ls_res-success = abap_false.
        ls_res-message = lx_err->get_text( ).
    ENDTRY.

    respond_json( ls_res ).
  ENDMETHOD.

  METHOD respond_json.
    mo_http->set_header( name  = 'content-type'
                         value = gc_content_json ).
    mo_http->set_text( z2fiori_cl_response_builder=>build( res ) ).
    mo_http->set_status( 200 ).
  ENDMETHOD.

  METHOD respond_info.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>create_empty( ).
        lo_ajson->set_string( iv_path = '/service'
                              iv_val  = 'abap2fiori' ).
        lo_ajson->set_string( iv_path = '/method'
                              iv_val  = 'POST' ).

        mo_http->set_header( name  = 'content-type'
                             value = gc_content_json ).
        mo_http->set_text( lo_ajson->stringify( ) ).
        mo_http->set_status( 200 ).
      CATCH z2fiori_cx_ajson_error.
        mo_http->set_status( 500 ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
