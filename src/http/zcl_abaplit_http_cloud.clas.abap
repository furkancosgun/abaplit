CLASS zcl_abaplit_http_cloud DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_http.

    METHODS constructor
      IMPORTING request  TYPE REF TO object
                response TYPE REF TO object.

  PRIVATE SECTION.
    DATA mo_request  TYPE REF TO object.
    DATA mo_response TYPE REF TO object.
    DATA mv_csrf_token TYPE string.
    DATA mv_security_headers_sent TYPE abap_bool.

    METHODS generate_token
      RETURNING VALUE(rv_token) TYPE string.

    METHODS validate_csrf_token.

    METHODS apply_security_headers.
ENDCLASS.


CLASS zcl_abaplit_http_cloud IMPLEMENTATION.
  METHOD constructor.
    mo_request  = request.
    mo_response = response.
  ENDMETHOD.

  METHOD zif_abaplit_http~get_binary.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_BINARY')
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~get_header.
    DATA(lv_upper) = to_upper( name ).
    DATA(lv_lower) = to_lower( name ).

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

  METHOD zif_abaplit_http~get_method.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_METHOD')
          RECEIVING r_value = result.
      CATCH cx_root.
        result = zif_abaplit_http~get_header( '~request_method' ).
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~get_path.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_REQUEST_URI')
          RECEIVING r_value = result.
      CATCH cx_root.
        result = zif_abaplit_http~get_header( '~request_uri' ).
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~get_query.
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_FORM_FIELD')
          EXPORTING i_name  = name
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~get_text.
    validate_csrf_token( ).
    TRY.
        CALL METHOD mo_request->('IF_WEB_HTTP_REQUEST~GET_TEXT')
          RECEIVING r_value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~set_binary.
    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_BINARY')
          EXPORTING i_data = binary.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~set_header.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = name
                    i_value = value.
      CATCH cx_root.
    ENDTRY.
    IF to_upper( name ) = 'X-FRAME-OPTIONS'
        OR to_upper( name ) = 'X-CONTENT-TYPE-OPTIONS'
        OR to_upper( name ) = 'REFERRER-POLICY'
        OR to_upper( name ) = 'X-CSRF-TOKEN'.
      RETURN.
    ENDIF.
    apply_security_headers( ).
  ENDMETHOD.

  METHOD zif_abaplit_http~set_status.
    DATA lv_reason TYPE string.

    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_STATUS')
          EXPORTING i_code   = status
                    i_reason = lv_reason.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~set_text.
    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_TEXT')
          EXPORTING i_text = text.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD zif_abaplit_http~set_compression.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_COMPRESSION').
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD generate_token.
    DATA lv_uuid_class TYPE string VALUE 'CL_SYSTEM_UUID'.
    DATA lv_abap_uuid  TYPE string VALUE 'CL_ABAP_UUID'.
    TRY.
        CALL METHOD (lv_uuid_class)=>('CREATE_UUID_C22_STATIC')
          RECEIVING uuid = rv_token.
        IF rv_token IS NOT INITIAL.
          RETURN.
        ENDIF.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD (lv_abap_uuid)=>('CREATE_UUID_C22_STATIC')
          RECEIVING uuid = rv_token.
        IF rv_token IS NOT INITIAL.
          RETURN.
        ENDIF.
      CATCH cx_root.
    ENDTRY.
    rv_token = |{ sy-datum }{ sy-uzeit }{ sy-uname }{ sy-tabix }|.
    TRY.
        DATA(lv_hash_class) = 'CL_ABAP_MESSAGE_DIGEST'.
        CALL METHOD (lv_hash_class)=>('CALCULATE_HASH_FOR_CHAR')
          EXPORTING if_algorithm = 'SHA1'
                    if_data      = rv_token
          RECEIVING ef_hashstring = rv_token.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD validate_csrf_token.
    DATA(lv_method) = zif_abaplit_http~get_method( ).
    IF to_upper( lv_method ) <> 'POST'.
      RETURN.
    ENDIF.

    DATA(lv_token) = zif_abaplit_http~get_header( 'X-CSRF-Token' ).
    DATA(lv_origin) = zif_abaplit_http~get_header( 'Origin' ).
    DATA(lv_referer) = zif_abaplit_http~get_header( 'Referer' ).
    DATA(lv_host) = zif_abaplit_http~get_header( 'Host' ).
    IF lv_host IS INITIAL.
      lv_host = zif_abaplit_http~get_header( 'X-Forwarded-Host' ).
    ENDIF.

    IF lv_token IS INITIAL.
      IF lv_origin IS NOT INITIAL AND lv_host IS NOT INITIAL.
        IF lv_origin NS lv_host AND lv_host NS lv_origin.
          zcx_abaplit_error=>raise( 'CSRF validation failed: Origin mismatch.' ).
        ENDIF.
      ELSEIF lv_referer IS NOT INITIAL AND lv_host IS NOT INITIAL.
        IF lv_referer NS lv_host AND lv_host NS lv_referer.
          zcx_abaplit_error=>raise( 'CSRF validation failed: Referer mismatch.' ).
        ENDIF.
      ENDIF.
      RETURN.
    ENDIF.

    IF to_upper( lv_token ) = 'FETCH' OR to_upper( lv_token ) = 'REQUIRED'.
      RETURN.
    ENDIF.

    IF lv_origin IS NOT INITIAL AND lv_host IS NOT INITIAL.
      IF lv_origin NS lv_host AND lv_host NS lv_origin.
        zcx_abaplit_error=>raise( 'CSRF validation failed: Origin mismatch.' ).
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD apply_security_headers.
    IF mv_security_headers_sent = abap_true.
      RETURN.
    ENDIF.
    mv_security_headers_sent = abap_true.

    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = 'X-Frame-Options'
                    i_value = 'SAMEORIGIN'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = 'X-Content-Type-Options'
                    i_value = 'nosniff'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = 'Referrer-Policy'
                    i_value = 'strict-origin-when-cross-origin'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING i_name  = 'X-XSS-Protection'
                    i_value = '0'.
      CATCH cx_root.
    ENDTRY.

    DATA(lv_req_token) = zif_abaplit_http~get_header( 'X-CSRF-Token' ).
    DATA(lv_method) = zif_abaplit_http~get_method( ).
    IF ( to_upper( lv_req_token ) = 'FETCH' OR to_upper( lv_req_token ) = 'REQUIRED' )
        AND ( lv_method = 'GET' OR lv_method = 'HEAD' ).
      IF mv_csrf_token IS INITIAL.
        mv_csrf_token = generate_token( ).
      ENDIF.
      TRY.
          CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
            EXPORTING i_name  = 'X-CSRF-Token'
                      i_value = mv_csrf_token.
        CATCH cx_root.
      ENDTRY.
    ELSEIF mv_csrf_token IS NOT INITIAL.
      TRY.
          CALL METHOD mo_response->('IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD')
            EXPORTING i_name  = 'X-CSRF-Token'
                      i_value = mv_csrf_token.
        CATCH cx_root.
      ENDTRY.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
