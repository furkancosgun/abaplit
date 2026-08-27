CLASS z2fiori_cl_http_onprem DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_http.

    METHODS constructor
      IMPORTING request  TYPE REF TO object OPTIONAL
                response TYPE REF TO object OPTIONAL
                server   TYPE REF TO object OPTIONAL.

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


CLASS z2fiori_cl_http_onprem IMPLEMENTATION.
  METHOD constructor.
    IF server IS BOUND.
      TRY.
          ASSIGN server->('REQUEST') TO FIELD-SYMBOL(<lo_req>).
          IF sy-subrc = 0.
            mo_request = <lo_req>.
          ENDIF.
          ASSIGN server->('RESPONSE') TO FIELD-SYMBOL(<lo_res>).
          IF sy-subrc = 0.
            mo_response = <lo_res>.
          ENDIF.
        CATCH cx_root.
      ENDTRY.
    ENDIF.

    IF mo_request IS INITIAL.
      mo_request = request.
    ENDIF.
    IF mo_response IS INITIAL.
      mo_response = response.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_binary.
    TRY.
        CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_DATA')
          RECEIVING data = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_header.
    DATA(lv_upper) = to_upper( name ).
    DATA(lv_lower) = to_lower( name ).

    TRY.
        CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_HEADER_FIELD')
          EXPORTING name  = name
          RECEIVING value = result.

        IF result IS INITIAL.
          CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_HEADER_FIELD')
            EXPORTING name  = lv_upper
            RECEIVING value = result.
        ENDIF.

        IF result IS INITIAL.
          CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_HEADER_FIELD')
            EXPORTING name  = lv_lower
            RECEIVING value = result.
        ENDIF.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_method.
    result = z2fiori_if_http~get_header( '~request_method' ).
    IF result IS INITIAL.
      TRY.
          CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_METHOD')
            RECEIVING method = result.
        CATCH cx_root.
      ENDTRY.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_path.
    result = z2fiori_if_http~get_header( '~request_uri' ).
    IF result IS INITIAL.
      result = z2fiori_if_http~get_header( '~path' ).
    ENDIF.
    IF result IS INITIAL.
      result = z2fiori_if_http~get_header( '~path_info' ).
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_query.
    TRY.
        CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_FORM_FIELD')
          EXPORTING name  = name
          RECEIVING value = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~get_text.
    validate_csrf_token( ).
    TRY.
        CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_CDATA')
          RECEIVING data = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_binary.
    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_DATA')
          EXPORTING data = binary.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_header.
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING name  = name
                    value = value.
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

  METHOD z2fiori_if_http~set_status.
    DATA lv_reason TYPE string.

    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_STATUS')
          EXPORTING code   = status
                    reason = lv_reason.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_text.
    apply_security_headers( ).
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_CDATA')
          EXPORTING data = text.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_compression.
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_COMPRESSION').
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
    DATA(lv_method) = z2fiori_if_http~get_method( ).
    IF to_upper( lv_method ) <> 'POST'.
      RETURN.
    ENDIF.

    DATA(lv_token) = z2fiori_if_http~get_header( 'X-CSRF-Token' ).
    DATA(lv_origin) = z2fiori_if_http~get_header( 'Origin' ).
    DATA(lv_referer) = z2fiori_if_http~get_header( 'Referer' ).
    DATA(lv_host) = z2fiori_if_http~get_header( 'Host' ).
    IF lv_host IS INITIAL.
      lv_host = z2fiori_if_http~get_header( 'X-Forwarded-Host' ).
    ENDIF.

    " Allow Fetch/Required sentinel from HttpClient fetchCsrfToken flow
    IF lv_token IS INITIAL.
      " Enforce Origin check as fallback CSRF defence
      IF lv_origin IS NOT INITIAL AND lv_host IS NOT INITIAL.
        IF lv_origin NS lv_host AND lv_host NS lv_origin.
          " Cross-origin POST without token - block
          z2fiori_cx_error=>raise( 'CSRF validation failed: Origin mismatch.' ).
        ENDIF.
      ELSEIF lv_referer IS NOT INITIAL AND lv_host IS NOT INITIAL.
        IF lv_referer NS lv_host AND lv_host NS lv_referer.
          z2fiori_cx_error=>raise( 'CSRF validation failed: Referer mismatch.' ).
        ENDIF.
      ENDIF.
      RETURN.
    ENDIF.

    IF to_upper( lv_token ) = 'FETCH' OR to_upper( lv_token ) = 'REQUIRED'.
      RETURN.
    ENDIF.

    " If Origin is present, it must match Host when token is supplied
    IF lv_origin IS NOT INITIAL AND lv_host IS NOT INITIAL.
      IF lv_origin NS lv_host AND lv_host NS lv_origin.
        z2fiori_cx_error=>raise( 'CSRF validation failed: Origin mismatch.' ).
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD apply_security_headers.
    IF mv_security_headers_sent = abap_true.
      RETURN.
    ENDIF.
    mv_security_headers_sent = abap_true.

    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING name  = 'X-Frame-Options'
                    value = 'SAMEORIGIN'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING name  = 'X-Content-Type-Options'
                    value = 'nosniff'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING name  = 'Referrer-Policy'
                    value = 'strict-origin-when-cross-origin'.
      CATCH cx_root.
    ENDTRY.
    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
          EXPORTING name  = 'X-XSS-Protection'
                    value = '0'.
      CATCH cx_root.
    ENDTRY.

    " CSRF token issuance for GET with X-CSRF-Token: Fetch
    DATA(lv_req_token) = z2fiori_if_http~get_header( 'X-CSRF-Token' ).
    DATA(lv_method) = z2fiori_if_http~get_method( ).
    IF ( to_upper( lv_req_token ) = 'FETCH' OR to_upper( lv_req_token ) = 'REQUIRED' )
        AND ( lv_method = 'GET' OR lv_method = 'HEAD' ).
      IF mv_csrf_token IS INITIAL.
        mv_csrf_token = generate_token( ).
      ENDIF.
      TRY.
          CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
            EXPORTING name  = 'X-CSRF-Token'
                      value = mv_csrf_token.
        CATCH cx_root.
      ENDTRY.
    ELSEIF mv_csrf_token IS NOT INITIAL.
      TRY.
          CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_HEADER_FIELD')
            EXPORTING name  = 'X-CSRF-Token'
                      value = mv_csrf_token.
        CATCH cx_root.
      ENDTRY.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
