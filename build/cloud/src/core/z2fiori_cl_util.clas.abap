CLASS z2fiori_cl_util DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS string_to_xstring_utf8
      IMPORTING iv_str         TYPE string
      RETURNING VALUE(rv_xstr) TYPE xstring.

    CLASS-METHODS xstring_to_string_utf8
      IMPORTING iv_xstr       TYPE xstring
      RETURNING VALUE(rv_str) TYPE string.

    CLASS-METHODS xstring_to_base64
      IMPORTING iv_xstr          TYPE xstring
      RETURNING VALUE(rv_base64) TYPE string.

    CLASS-METHODS base64_to_xstring
      IMPORTING iv_base64      TYPE string
      RETURNING VALUE(rv_xstr) TYPE xstring.

    CLASS-METHODS string_to_base64
      IMPORTING iv_str           TYPE string
      RETURNING VALUE(rv_base64) TYPE string.

    CLASS-METHODS base64_to_string
      IMPORTING iv_base64     TYPE string
      RETURNING VALUE(rv_str) TYPE string.

ENDCLASS.


CLASS z2fiori_cl_util IMPLEMENTATION.
  METHOD string_to_xstring_utf8.
    DATA lo_conv TYPE REF TO object.

    DATA(lv_out_ce)   = 'CL_ABAP_CONV_OUT_CE'.
    DATA(lv_codepage) = 'CL_ABAP_CONV_CODEPAGE'.

    TRY.
        CALL METHOD (lv_codepage)=>('CREATE_OUT')
          RECEIVING instance = lo_conv.
        CALL METHOD lo_conv->('IF_ABAP_CONV_OUT~CONVERT')
          EXPORTING source = iv_str
          RECEIVING result = rv_xstr.
      CATCH cx_sy_dyn_call_illegal_class
            cx_sy_dyn_call_illegal_method
            cx_root.
        TRY.
            CALL METHOD (lv_out_ce)=>('CREATE')
              EXPORTING encoding = 'UTF-8'
              RECEIVING conv     = lo_conv.
            TRY.
                CALL METHOD lo_conv->('CONVERT')
                  EXPORTING data   = iv_str
                  IMPORTING buffer = rv_xstr.
              CATCH cx_sy_dyn_call_illegal_class
                    cx_sy_dyn_call_illegal_method
                    cx_root.
                CALL METHOD lo_conv->('CONVERT')
                  EXPORTING data   = iv_str
                  IMPORTING buffer = rv_xstr.
            ENDTRY.
          CATCH cx_sy_dyn_call_illegal_class
                cx_sy_dyn_call_illegal_method
                cx_root.
        ENDTRY.
    ENDTRY.
  ENDMETHOD.

  METHOD xstring_to_string_utf8.
    DATA lo_conv TYPE REF TO object.

    DATA(lv_in_ce)    = 'CL_ABAP_CONV_IN_CE'.
    DATA(lv_codepage) = 'CL_ABAP_CONV_CODEPAGE'.

    TRY.
        CALL METHOD (lv_codepage)=>('CREATE_IN')
          RECEIVING instance = lo_conv.
        CALL METHOD lo_conv->('IF_ABAP_CONV_IN~CONVERT')
          EXPORTING source = iv_xstr
          RECEIVING result = rv_str.
      CATCH cx_sy_dyn_call_illegal_class
            cx_sy_dyn_call_illegal_method
            cx_root.
        TRY.
            CALL METHOD (lv_in_ce)=>('CREATE')
              EXPORTING encoding = 'UTF-8'
              RECEIVING conv     = lo_conv.
            TRY.
                CALL METHOD lo_conv->('CONVERT')
                  EXPORTING data   = iv_xstr
                  IMPORTING buffer = rv_str.
              CATCH cx_sy_dyn_call_illegal_class
                    cx_sy_dyn_call_illegal_method
                    cx_root.
                CALL METHOD lo_conv->('CONVERT')
                  EXPORTING input = iv_xstr
                  IMPORTING data  = rv_str.
            ENDTRY.
          CATCH cx_sy_dyn_call_illegal_class
                cx_sy_dyn_call_illegal_method
                cx_root.
        ENDTRY.
    ENDTRY.
  ENDMETHOD.

  METHOD xstring_to_base64.
    DATA(lv_web_class)     = 'CL_WEB_HTTP_UTILITY'.
    DATA(lv_classic_class) = 'CL_HTTP_UTILITY'.

    TRY.
        CALL METHOD (lv_web_class)=>('ENCODE_X_BASE64')
          EXPORTING unencoded = iv_xstr
          RECEIVING encoded   = rv_base64.
      CATCH cx_sy_dyn_call_illegal_class
            cx_sy_dyn_call_illegal_method
            cx_root.
        TRY.
            CALL METHOD (lv_classic_class)=>('ENCODE_X_BASE64')
              EXPORTING unencoded = iv_xstr
              RECEIVING encoded   = rv_base64.
          CATCH cx_sy_dyn_call_illegal_class
                cx_sy_dyn_call_illegal_method
                cx_root.
        ENDTRY.
    ENDTRY.
  ENDMETHOD.

  METHOD base64_to_xstring.
    DATA(lv_web_class)     = 'CL_WEB_HTTP_UTILITY'.
    DATA(lv_classic_class) = 'CL_HTTP_UTILITY'.

    TRY.
        CALL METHOD (lv_web_class)=>('DECODE_X_BASE64')
          EXPORTING encoded = iv_base64
          RECEIVING decoded = rv_xstr.
      CATCH cx_sy_dyn_call_illegal_class
            cx_sy_dyn_call_illegal_method
            cx_root.
        TRY.
            CALL METHOD (lv_classic_class)=>('DECODE_X_BASE64')
              EXPORTING encoded = iv_base64
              RECEIVING decoded = rv_xstr.
          CATCH cx_sy_dyn_call_illegal_class
                cx_sy_dyn_call_illegal_method
                cx_root.
        ENDTRY.
    ENDTRY.
  ENDMETHOD.

  METHOD string_to_base64.
    DATA(lv_xstr) = string_to_xstring_utf8( iv_str ).
    rv_base64 = xstring_to_base64( lv_xstr ).
  ENDMETHOD.

  METHOD base64_to_string.
    DATA(lv_xstr) = base64_to_xstring( iv_base64 ).
    rv_str = xstring_to_string_utf8( lv_xstr ).
  ENDMETHOD.
ENDCLASS.
