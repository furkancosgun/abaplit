CLASS ltcl_response_builder DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_build_full     FOR TESTING.
    METHODS test_message_escape FOR TESTING.
ENDCLASS.


CLASS ltcl_response_builder IMPLEMENTATION.
  METHOD test_build_full.
    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    ls_res-success   = abap_true.
    ls_res-app       = 'ZCL_MY_APP'.
    ls_res-view      = '<Button text="Hi" />'.
    ls_res-state     = '{"ms_state":{"count":2}}'.
    ls_res-message   = 'ok'.

    DATA(lv_json) = z2fiori_cl_response_builder=>build( ls_res ).

    TRY.
        DATA(lo_ajson) = z2fiori_cl_ajson=>parse( lv_json ).
        cl_abap_unit_assert=>assert_true( lo_ajson->get_boolean( '/success' ) ).
        cl_abap_unit_assert=>assert_equals( exp = 'ZCL_MY_APP' act = lo_ajson->get_string( '/app' ) ).
        cl_abap_unit_assert=>assert_equals( exp = '<Button text="Hi" />' act = lo_ajson->get_string( '/view' ) ).
        cl_abap_unit_assert=>assert_equals( exp = '{"ms_state":{"count":2}}' act = lo_ajson->get_string( '/state' ) ).
        cl_abap_unit_assert=>assert_equals( exp = 'ok' act = lo_ajson->get_string( '/message' ) ).
      CATCH z2fiori_cx_ajson_error.
        cl_abap_unit_assert=>fail( 'Response JSON could not be parsed' ).
    ENDTRY.
  ENDMETHOD.

  METHOD test_message_escape.
    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    ls_res-success = abap_false.
    ls_res-message = |quotes " and \\ backslash|.

    DATA(lv_json) = z2fiori_cl_response_builder=>build( ls_res ).

    TRY.
        DATA(lo_ajson) = z2fiori_cl_ajson=>parse( lv_json ).
        cl_abap_unit_assert=>assert_false( lo_ajson->get_boolean( '/success' ) ).
        cl_abap_unit_assert=>assert_equals( exp = ls_res-message
                                            act = lo_ajson->get_string( '/message' ) ).
      CATCH z2fiori_cx_ajson_error.
        cl_abap_unit_assert=>fail( 'Response JSON could not be parsed' ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
