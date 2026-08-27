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
    TRY.
        CALL METHOD mo_request->('IF_HTTP_REQUEST~GET_CDATA')
          RECEIVING data = result.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_binary.
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
  ENDMETHOD.

  METHOD z2fiori_if_http~set_status.
    DATA lv_reason TYPE string.

    TRY.
        CALL METHOD mo_response->('IF_HTTP_RESPONSE~SET_STATUS')
          EXPORTING code   = status
                    reason = lv_reason.
      CATCH cx_root.
    ENDTRY.
  ENDMETHOD.

  METHOD z2fiori_if_http~set_text.
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
ENDCLASS.
