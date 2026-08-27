CLASS z2fiori_cl_http_cloud DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_http.

    METHODS constructor
      IMPORTING !request  TYPE REF TO object
                !response TYPE REF TO object.

  PRIVATE SECTION.
    DATA mo_request  TYPE REF TO object.
    DATA mo_response TYPE REF TO object.
ENDCLASS.


CLASS z2fiori_cl_http_cloud IMPLEMENTATION.
  METHOD constructor.
    mo_request  = request.
    mo_response = response.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_binary.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_BINARY')
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_header.
    DATA lv_upper TYPE string.
    DATA lv_lower TYPE string.
    lv_upper = to_upper( name ).
    
    lv_lower = to_lower( name ).

    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD')
          EXPORTING i_name  = name
          RECEIVING r_value = result.

        IF result IS INITIAL.
          CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD')
            EXPORTING i_name  = lv_upper
            RECEIVING r_value = result.
        ENDIF.

        IF result IS INITIAL.
          CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD')
            EXPORTING i_name  = lv_lower
            RECEIVING r_value = result.
        ENDIF.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_method.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_METHOD')
          RECEIVING r_value = result.
      CATCH cx_root.
        result = z2fiori_if_http~get_header( '~request_method' ).
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_path.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_REQUEST_URI')
          RECEIVING r_value = result.
      CATCH cx_root.
        result = z2fiori_if_http~get_header( '~request_uri' ).
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_query.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_FORM_FIELD')
          EXPORTING i_name  = name
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_text.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_TEXT')
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_binary.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_BINARY')
          EXPORTING i_data = binary.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_header.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = name
                    i_value = value.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_status.
    DATA lv_reason TYPE string.

    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_STATUS')
          EXPORTING i_code   = status
                    i_reason = lv_reason.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_text.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_TEXT')
          EXPORTING i_text = text.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_compression.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_COMPRESSION').
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
