CLASS ltcl_request_parser DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_parse_valid       FOR TESTING.
    METHODS test_parse_empty       FOR TESTING.
    METHODS test_parse_missing_app FOR TESTING.
    METHODS test_parse_bad_json    FOR TESTING.
ENDCLASS.


CLASS ltcl_request_parser IMPLEMENTATION.
  METHOD test_parse_valid.
    DATA(lv_json) = |\{| &&
      |"app":"ZCL_MY_APP",| &&
      |"event":"SAVE",| &&
      |"event_args":["A","B"],| &&
      |"check_init":false| &&
      |\}|.

    DATA(ls_req) = zcl_abaplit_request_parser=>parse( lv_json ).

    cl_abap_unit_assert=>assert_equals( exp = 'ZCL_MY_APP'
                                        act = ls_req-app ).
    cl_abap_unit_assert=>assert_equals( exp = 'SAVE'
                                        act = ls_req-event ).
    cl_abap_unit_assert=>assert_false( ls_req-check_init ).
    cl_abap_unit_assert=>assert_equals( exp = 2
                                        act = lines( ls_req-event_args ) ).
  ENDMETHOD.

  METHOD test_parse_empty.
    TRY.
        zcl_abaplit_request_parser=>parse( '' ).
        cl_abap_unit_assert=>fail( 'Expected zcx_abaplit_error was not raised' ).
      CATCH zcx_abaplit_error ##NO_HANDLER.
    ENDTRY.
  ENDMETHOD.

  METHOD test_parse_missing_app.
    TRY.
        zcl_abaplit_request_parser=>parse( '{"event":"X"}' ).
        cl_abap_unit_assert=>fail( 'Expected zcx_abaplit_error was not raised' ).
      CATCH zcx_abaplit_error ##NO_HANDLER.
    ENDTRY.
  ENDMETHOD.

  METHOD test_parse_bad_json.
    TRY.
        zcl_abaplit_request_parser=>parse( '{"app":' ).
        cl_abap_unit_assert=>fail( 'Expected zcx_abaplit_error was not raised' ).
      CATCH zcx_abaplit_error ##NO_HANDLER.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
